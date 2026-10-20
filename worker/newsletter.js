// The Clive — newsletter API (Cloudflare Worker).
// Attached to the route www.the-clive.com/api/* ; every other request goes to GitHub Pages as usual.
// Setup: see worker/README.md
//
// Bindings to set in Cloudflare (Worker > Settings > Bindings / Variables and secrets):
//   DB         D1 database binding
//   ADMIN_KEY  secret, any long random string, used to download the list
//
// Routes:
//   POST /api/subscribe          {email, website, t}  -> {ok:true}
//   POST /api/unsubscribe        {email}              -> {ok:true}
//   GET  /api/subscribers.csv?key=ADMIN_KEY           -> CSV of active subscribers

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
  if ((request.headers.get('Content-Length') || '0') > 2000) return null;
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;

    if (p.startsWith('/api/')) {
      if (!env.DB) return json({ ok: false, error: 'Signup is not available yet.' }, 503);
      try {
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
