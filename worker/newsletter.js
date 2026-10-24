// The Clive — site API (Cloudflare Worker): newsletter + light show review page.
// Attached to the route www.the-clive.com/api/* ; every other request goes to GitHub Pages as usual.
// Setup: see worker/README.md
//
// Bindings to set in Cloudflare (Worker > Settings > Bindings / Variables and secrets):
//   DB                  D1 database binding
//   ADMIN_KEY           secret, any long random string, used to download the list
//   LIGHTSHOW           R2 bucket binding: songs.json + the MP3s (never in the public repo)
//   LIGHTSHOW_PASSWORD  secret, the band password for /lightshow/
//
// Routes:
//   POST /api/subscribe          {email, website, t}  -> {ok:true}
//   POST /api/unsubscribe        {email}              -> {ok:true}
//   GET  /api/subscribers.csv?key=ADMIN_KEY           -> CSV of active subscribers
//
//   Light show (all but login need the header  Authorization: Bearer <token>):
//   POST   /api/lightshow/login          {password}                    -> {ok, token}
//   GET    /api/lightshow/songs                                         -> songs.json from R2
//   GET    /api/lightshow/audio/<file>.mp3                              -> MP3 from R2
//   GET    /api/lightshow/comments?song=<key>                           -> {ok, comments}
//   POST   /api/lightshow/comments       {song, ver, t, author, body, parent?} -> {ok, comment}
//   PATCH  /api/lightshow/comments/<id>  {resolved}                    -> {ok}
//   DELETE /api/lightshow/comments/<id>                                -> {ok}

const CONSENT_TEXT = 'Newsletter: new releases and shows only. Unsubscribe anytime.';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}

async function ensureTable(db) {
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS subscribers (
       email TEXT PRIMARY KEY,
       created_at TEXT NOT NULL,
       consent_text TEXT NOT NULL,
       country TEXT,
       unsubscribed_at TEXT
     )`
  ).run();
}

function sameOrigin(request, url) {
  const origin = request.headers.get('Origin');
  return !origin || origin === url.origin;
}

async function readJson(request) {
  if ((request.headers.get('Content-Length') || '0') > 8000) return null;
  try { return await request.json(); } catch { return null; }
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string' || a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

async function subscribe(request, env, url) {
  if (!sameOrigin(request, url)) return json({ ok: false, error: 'Not allowed.' }, 403);
  const body = await readJson(request);
  if (!body) return json({ ok: false, error: 'Invalid request.' }, 400);

  // Bots: the hidden "website" field is filled, or the form was sent in under 2 seconds.
  // Answer as if it worked so they learn nothing.
  if (body.website || (typeof body.t === 'number' && body.t < 2000)) return json({ ok: true });

  const email = String(body.email || '').trim().toLowerCase();
  if (email.length > 254 || !EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Enter a valid email address.' }, 400);
  }

  await ensureTable(env.DB);
  const now = new Date().toISOString();
  const country = (request.cf && request.cf.country) || null;
  await env.DB.prepare(
    `INSERT INTO subscribers (email, created_at, consent_text, country, unsubscribed_at)
     VALUES (?1, ?2, ?3, ?4, NULL)
     ON CONFLICT(email) DO UPDATE SET
       created_at = CASE WHEN subscribers.unsubscribed_at IS NULL THEN subscribers.created_at ELSE excluded.created_at END,
       consent_text = excluded.consent_text,
       unsubscribed_at = NULL`
  ).bind(email, now, CONSENT_TEXT, country).run();

  return json({ ok: true });
}

async function unsubscribe(request, env, url) {
  if (!sameOrigin(request, url)) return json({ ok: false, error: 'Not allowed.' }, 403);
  const body = await readJson(request);
  const email = String((body && body.email) || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return json({ ok: false, error: 'Enter a valid email address.' }, 400);
  await ensureTable(env.DB);
  await env.DB.prepare(`DELETE FROM subscribers WHERE email = ?1`).bind(email).run();
  // Same answer whether or not the address was on the list.
  return json({ ok: true });
}

async function exportCsv(env, url) {
  if (!env.ADMIN_KEY || !safeEqual(url.searchParams.get('key') || '', env.ADMIN_KEY)) {
    return new Response('Not found', { status: 404 });
  }
  await ensureTable(env.DB);
  const { results } = await env.DB.prepare(
    `SELECT email, created_at, country FROM subscribers WHERE unsubscribed_at IS NULL ORDER BY created_at`
  ).all();
  const esc = (v) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const lines = ['EMAIL,SUBSCRIBED_AT,COUNTRY'].concat(
    results.map((r) => [r.email, r.created_at, r.country].map(esc).join(','))
  );
  const date = new Date().toISOString().slice(0, 10);
  return new Response(lines.join('\r\n') + '\r\n', {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="the-clive-newsletter-${date}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
}

// ---------- Light show review page ----------

const LS_SALT = 'the-clive-lightshow-v1';
const SONG_RE = /^[a-z0-9-]{1,32}$/;
const AUDIO_RE = /^[a-z0-9-]{1,64}\.mp3$/;

async function lsToken(env) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey('raw', enc.encode(env.LIGHTSHOW_PASSWORD), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(LS_SALT));
  return [...new Uint8Array(sig)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function lsAuthed(request, env) {
  const h = request.headers.get('Authorization') || '';
  return h.startsWith('Bearer ') && safeEqual(h.slice(7), await lsToken(env));
}

async function ensureCommentsTable(db) {
  await db.prepare(
    `CREATE TABLE IF NOT EXISTS lightshow_comments (
       id INTEGER PRIMARY KEY AUTOINCREMENT,
       song TEXT NOT NULL,
       ver TEXT,
       t REAL NOT NULL,
       author TEXT NOT NULL,
       body TEXT NOT NULL,
       parent INTEGER,
       resolved INTEGER NOT NULL DEFAULT 0,
       created_at TEXT NOT NULL
     )`
  ).run();
}

async function lsLogin(request, env, url) {
  if (!sameOrigin(request, url)) return json({ ok: false, error: 'Not allowed.' }, 403);
  const body = await readJson(request);
  const pw = String((body && body.password) || '');
  if (!safeEqual(pw, env.LIGHTSHOW_PASSWORD)) {
    await new Promise((r) => setTimeout(r, 800));
    return json({ ok: false, error: 'Mot de passe incorrect.' }, 401);
  }
  return json({ ok: true, token: await lsToken(env) });
}

async function lsFile(env, key, type) {
  const obj = await env.LIGHTSHOW.get(key);
  if (!obj) return json({ ok: false, error: 'Not found.' }, 404);
  return new Response(obj.body, {
    headers: { 'Content-Type': type, 'Content-Length': String(obj.size), 'Cache-Control': 'private, no-store' },
  });
}

async function lsListComments(env, url) {
  const song = url.searchParams.get('song') || '';
  if (!SONG_RE.test(song)) return json({ ok: false, error: 'Invalid song.' }, 400);
  await ensureCommentsTable(env.DB);
  const { results } = await env.DB.prepare(
    `SELECT id, song, ver, t, author, body, parent, resolved, created_at
     FROM lightshow_comments WHERE song = ?1 ORDER BY t, id`
  ).bind(song).all();
  return json({ ok: true, comments: results });
}

async function lsAddComment(request, env, url) {
  if (!sameOrigin(request, url)) return json({ ok: false, error: 'Not allowed.' }, 403);
  const b = await readJson(request);
  if (!b) return json({ ok: false, error: 'Invalid request.' }, 400);
  const song = String(b.song || '');
  const ver = String(b.ver || '').slice(0, 16);
  const t = Number(b.t);
  const author = String(b.author || '').trim().slice(0, 40);
  const text = String(b.body || '').trim().slice(0, 1500);
  const parent = Number.isInteger(b.parent) ? b.parent : null;
  if (!SONG_RE.test(song) || !Number.isFinite(t) || t < 0 || t > 3600 || !author || !text) {
    return json({ ok: false, error: 'Nom et commentaire obligatoires.' }, 400);
  }
  await ensureCommentsTable(env.DB);
  const now = new Date().toISOString();
  const row = await env.DB.prepare(
    `INSERT INTO lightshow_comments (song, ver, t, author, body, parent, resolved, created_at)
     VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0, ?7)
     RETURNING id, song, ver, t, author, body, parent, resolved, created_at`
  ).bind(song, ver, t, author, text, parent, now).first();
  return json({ ok: true, comment: row });
}

async function lsEditComment(request, env, url, id) {
  if (!sameOrigin(request, url)) return json({ ok: false, error: 'Not allowed.' }, 403);
  await ensureCommentsTable(env.DB);
  if (request.method === 'DELETE') {
    await env.DB.prepare(`DELETE FROM lightshow_comments WHERE id = ?1 OR parent = ?1`).bind(id).run();
    return json({ ok: true });
  }
  const b = await readJson(request);
  if (!b || typeof b.resolved !== 'boolean') return json({ ok: false, error: 'Invalid request.' }, 400);
  await env.DB.prepare(`UPDATE lightshow_comments SET resolved = ?2 WHERE id = ?1`).bind(id, b.resolved ? 1 : 0).run();
  return json({ ok: true });
}

async function lightshow(request, env, url) {
  const p = url.pathname.slice('/api/lightshow/'.length);
  const m = request.method;
  if (!env.LIGHTSHOW_PASSWORD || !env.LIGHTSHOW) return json({ ok: false, error: 'Pas encore configuré.' }, 503);
  if (p === 'login' && m === 'POST') return lsLogin(request, env, url);
  if (!(await lsAuthed(request, env))) return json({ ok: false, error: 'Connexion requise.' }, 401);

  if (p === 'songs' && m === 'GET') return lsFile(env, 'songs.json', 'application/json; charset=utf-8');
  if (p.startsWith('audio/') && m === 'GET') {
    const name = p.slice(6);
    if (!AUDIO_RE.test(name)) return json({ ok: false, error: 'Not found.' }, 404);
    return lsFile(env, name, 'audio/mpeg');
  }
  if (p === 'comments' && m === 'GET') return lsListComments(env, url);
  if (p === 'comments' && m === 'POST') return lsAddComment(request, env, url);
  const cm = p.match(/^comments\/(\d{1,9})$/);
  if (cm && (m === 'PATCH' || m === 'DELETE')) return lsEditComment(request, env, url, Number(cm[1]));
  return json({ ok: false, error: 'Not found.' }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;

    if (p.startsWith('/api/')) {
      if (!env.DB) return json({ ok: false, error: 'Signup is not available yet.' }, 503);
      try {
        if (p.startsWith('/api/lightshow/')) return await lightshow(request, env, url);
        if (p === '/api/subscribe' && request.method === 'POST') return await subscribe(request, env, url);
        if (p === '/api/unsubscribe' && request.method === 'POST') return await unsubscribe(request, env, url);
        if (p === '/api/subscribers.csv' && request.method === 'GET') return await exportCsv(env, url);
        return json({ ok: false, error: 'Not found.' }, 404);
      } catch (e) {
        return json({ ok: false, error: 'Something went wrong. Try again later.' }, 500);
      }
    }

    return new Response('Not found', { status: 404 });
  },
};
