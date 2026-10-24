// The Clive — light show review page.
// The engine comes from the visualizer of the Light Show State Packet (phase 1).
// Song data (titles, cues, sections) and audio are served by the Worker behind the band password;
// nothing song-specific lives in this public file. Comments are stored in D1 through /api/lightshow/comments.
(function () {
  'use strict';

  // ---------- Vocabulary of the LIGHTS track (shared by every song) ----------
  const NAMES = {36:'NOIR',37:'NEON_ALLUMAGE',38:'GYROPHARE_ROUGE',39:'STUDIO_AMBRE',40:'MONTEE_TEAL',41:'REFRAIN_TEAL_AMBRE',42:'ALERTE_ROUGE',43:'POURSUITE_MONTEE',44:'REFRAIN_ALERTE',45:'PONT_ROUGE_FAIBLE',46:'CIEL_EN_FEU',47:'SPHERE',48:'SALON_NOEL',49:'FIN_TRANSMISSION',50:'STROBE_RAFALE',51:'STROBE_FLASH',52:'BUMP',53:'TUBE_G',54:'TUBE_D',55:'CHASE_RAPIDE',56:'STROBE_TUBES',57:'NOIR_COURT',58:'SWAP',59:'GLACE',60:'GIVRE',61:'MONTEE_GEL',62:'LUMIERE',63:'BRASIER',64:'FIGE',65:'AURORE',66:'PROFOND',67:'SOLEIL',68:'RECHERCHE_SIGNAL',69:'DALLE_NOIRE',70:'DEFILEMENT',71:'GLITCH',72:'BOUCLE_BLEUE',73:'REMBOBINAGE',74:'SCISSION',75:'SURCHAUFFE'};
  const DESC = {36:'Tout éteint',37:'Les tubes grésillent puis restent allumés en blanc chaud',38:'Rouge, une bande lumineuse qui tourne comme un gyrophare',39:'Ambre chaud fixe, le studio calme',40:'Teal qui monte en intensité sur 4 mesures',41:'Teal et ambre, pleine intensité',42:'Rouge plein',43:'Remplissage du bas vers le haut à chaque temps',44:'Rouge et orange, pulsé sur les temps',45:'Rouge faible fixe',46:'Dégradé violet vers orange, le ciel en feu',47:'Cyan, ambre, lilas, violet qui défilent',48:'Ambre doux qui scintille, le salon de Noël',49:'Les tubes s’éteignent en grésillant',50:'Strobe de la grosse caisse en rafale, tant que la note dure',51:'Un gros flash du strobe de la grosse caisse',52:'Flash blanc chaud des deux tubes',53:'Accent sur le tube gauche',54:'Accent sur le tube droit',55:'Poursuite rapide de pixels, tant que la note dure',56:'Strobe sur les tubes, tant que la note dure',57:'Tubes éteints, tant que la note dure',58:'Inverse les couleurs gauche et droite',59:'Bleu glacé fixe, plus blanc vers le bas',60:'Bleu nuit avec des scintillements de givre',61:'Remplissage lent du bas vers le haut, bleu puis blanc, sur 8 mesures',62:'Ambre et blanc chaud, pulsé sur les temps',63:'Rouge et ambre, croisés gauche-droite, pulsé',64:'Tout figé : noir, un filet blanc au milieu des tubes',65:'Teal et violet qui ondulent lentement',66:'Violet profond qui respire',67:'Blanc chaud plein',68:'On cherche le signal : grésillement, une bande qui balaie au hasard, coupures et accroches brèves',69:'Dalle noire mate, arêtes blanc froid en haut et en bas, un reflet lent qui remonte',70:'Le fil qui défile : bandes bleu écran, blanc et cyan qui montent d’une bande par temps',71:'Bleu écran, des blocs cyan, magenta et blanc qui sautent à chaque double-croche, micro-coupures',72:'Boucles de feedback : des vagues bleues qui montent en écho et reviennent',73:'On rembobine : remplissage du haut vers le bas, blanc puis bleu, sur 4 mesures, avec des lignes qui sautent',74:'Coupé en deux : cyan en haut, magenta en bas, un vide noir qui s’ouvre et se referme au milieu',75:'L’écran surchauffe : magenta et violet pulsés sur les temps, étincelles blanches'};
  const C = {amber:[1,.62,.18],teal:[.15,.85,.78],red:[1,.08,.05],orange:[1,.38,.05],violet:[.55,.15,1],cyan:[.1,.85,1],lilac:[.8,.58,1],warm:[1,.8,.55],white:[1,1,1],ice:[.35,.72,1],deep:[.06,.18,.55],screen:[.18,.42,1],magenta:[1,.12,.7]};
  const SWATCH = {36:'#000',37:C.warm,38:C.red,39:C.amber,40:C.teal,41:'linear-gradient(#e89c2e,#26d9c7)',42:C.red,43:'linear-gradient(#ff600d,#3a0a06)',44:'linear-gradient(#ff600d,#ff140c)',45:'#4a0d0a',46:'linear-gradient(#ff600d,#8c26ff)',47:'linear-gradient(#1ad9ff,#ff9e2e,#cc94ff,#8c26ff)',48:'#a8691f',49:'linear-gradient(#ffcc8c,#000)',50:'repeating-linear-gradient(#fff 0 4px,#000 4px 8px)',51:'#fff',52:'#ffe7c4',53:'linear-gradient(90deg,#ffe7c4 50%,#222 50%)',54:'linear-gradient(90deg,#222 50%,#ffe7c4 50%)',55:'repeating-linear-gradient(#ffcc8c 0 3px,#3a2a10 3px 7px)',56:'repeating-linear-gradient(#fff 0 3px,#222 3px 6px)',57:'#111',58:'linear-gradient(90deg,#26d9c7 50%,#e89c2e 50%)',59:'linear-gradient(#5bb8ff,#cfe9ff)',60:'#0f2e8c',61:'linear-gradient(#fff,#5bb8ff 60%,#0a1530)',62:'linear-gradient(#ffcc8c,#ff9e2e)',63:'linear-gradient(#ff140c,#ff9e2e)',64:'linear-gradient(#000 45%,#fff 45% 55%,#000 55%)',65:'linear-gradient(#26d9c7,#8c26ff)',66:'#2a0d4a',67:'#ffcc8c',68:'repeating-linear-gradient(#9fe8ff 0 2px,#0a1530 2px 5px,#4a6a80 5px 6px,#000 6px 9px)',69:'linear-gradient(#cfe0ff 0 6%,#08090c 6% 94%,#cfe0ff 94%)',70:'repeating-linear-gradient(#2e6bff 0 5px,#e6eeff 5px 8px,#1ad9ff 8px 12px,#0a1530 12px 14px)',71:'repeating-linear-gradient(#2e6bff 0 4px,#ff1fb3 4px 6px,#1ad9ff 6px 8px,#2e6bff 8px 12px)',72:'linear-gradient(#0a1530,#5bb8ff 40%,#0a1530 60%,#2e6bff)',73:'linear-gradient(#fff,#2e6bff 60%,#0a1530)',74:'linear-gradient(#1ad9ff 42%,#000 42% 58%,#ff1fb3 58%)',75:'linear-gradient(#ff1fb3,#8c26ff)'};
  const STATES = new Set([36,37,38,39,40,41,42,43,44,45,46,47,48,49,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75]);
  const HOT = new Set([50, 51, 56]);
  const N = 32;

  // ---------- Helpers ----------
  const $ = (id) => document.getElementById(id);
  const API = '/api/lightshow/';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch (e) {} },
  };
  let token = store.get('ls_token');

  async function api(path, opts = {}) {
    const headers = Object.assign({}, opts.headers || {});
    if (token) headers.Authorization = 'Bearer ' + token;
    if (opts.body && typeof opts.body !== 'string') { headers['Content-Type'] = 'application/json'; opts.body = JSON.stringify(opts.body); }
    const r = await fetch(API + path, Object.assign({}, opts, { headers }));
    if (r.status === 401 && path !== 'login') { logout(); throw new Error('auth'); }
    return r;
  }
  async function apiJson(path, opts) {
    const r = await api(path, opts);
    let d = null; try { d = await r.json(); } catch (e) {}
    if (!r.ok || !d || d.ok === false) throw new Error((d && d.error) || 'Erreur ' + r.status);
    return d;
  }

  const rgb = (a) => Array.isArray(a) ? `rgb(${a.map((v) => Math.round(v * 255)).join(',')})` : a;
  const fmt = (t) => { t = Math.max(0, t); const m = Math.floor(t / 60), s = t - m * 60; return String(m).padStart(2, '0') + ':' + s.toFixed(2).padStart(5, '0'); };
  const fmtShort = (t) => { t = Math.max(0, t); const m = Math.floor(t / 60), s = t - m * 60; return m + ':' + s.toFixed(1).padStart(4, '0'); };
  const fmtDate = (iso) => { const d = new Date(iso); return isNaN(d) ? '' : d.toLocaleDateString('fr-CH', { day: '2-digit', month: '2-digit' }) + ' ' + d.toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' }); };

  // ---------- Song state ----------
  // A song without a light plan yet (no bpm, no cues) can still be played and commented: comments are then ideas.
  let SONGS = [], song = null, EV = [], SEC = [], BPM = 0, SPB = 0, OFF = 0, DUR = 1;
  const hasPlan = () => EV.length > 0;
  const beatAt = (t) => SPB ? (t - OFF) / SPB : 0;
  const barOf = (t) => { if (!SPB) return '—'; const b = Math.max(0, beatAt(t)); return (Math.floor(b / 4) + 1) + '.' + (Math.floor(b % 4) + 1); };
  const secOf = (t) => { let s = null; for (const x of SEC) { if (x[0] <= t + 1e-6) s = x; else break; } return s ? s[1] : ''; };
  const stateOf = (t) => hasPlan() ? NAMES[frame(beatAt(t)).st] : '';
  const where = (t) => [secOf(t), stateOf(t)].filter(Boolean).join(' · ');
  const stepNav = () => SPB ? SPB * 4 : 5;
  const stepFine = () => SPB || .5;

  // ---------- Engine ----------
  function frame(beat) {
    let st = 36, stB = 0, swap = 0; const held = [], imp = [];
    for (const [b, n, l] of EV) {
      if (b > beat) break;
      if (STATES.has(n)) { st = n; stB = b; }
      else if (n === 58) swap ^= 1;
      else if (n === 50 || n === 55 || n === 56 || n === 57) { if (beat < b + l) held.push([n, b]); }
      else imp.push([n, b]);
    }
    return { st, stB, swap, held, imp };
  }
  const hash = (x) => { const s = Math.sin(x * 12.9898) * 43758.5453; return s - Math.floor(s); };
  const mix = (a, b, k) => a.map((v, i) => v + (b[i] - v) * k);
  const mul = (a, k) => a.map((v) => v * k);
  function base(st, i, side, age, beat) {
    const y = i / (N - 1), fb = beat - Math.floor(beat);
    switch (st) {
      case 36: return [0, 0, 0];
      case 37: { if (age < 1.4) { const on = hash(Math.floor(age * 14) + side * 7) > .45; return on ? mul(C.warm, .7) : [0, 0, 0]; } return mul(C.warm, .5 + .04 * Math.sin(age * 50)); }
      case 38: { const k = Math.pow(Math.max(0, Math.cos(2 * Math.PI * (beat / 2 - y))), 4); return mul(C.red, .12 + .88 * k); }
      case 39: return mul(C.amber, .55 + .2 * y);
      case 40: return mul(C.teal, Math.min(1, .15 + age / 10.3));
      case 41: return mix(C.teal, C.amber, side ? 1 - y : y);
      case 42: return C.red;
      case 43: return y <= fb ? mix(C.red, C.orange, y) : mul(C.red, .15);
      case 44: return mul(mix(C.red, C.orange, side ? 1 - y : y), .72 + .28 * (1 - fb));
      case 45: return mul(C.red, .22);
      case 46: { const k = Math.min(1, Math.max(0, y + .25 * Math.sin(age * .8 + side * Math.PI))); return mix(C.violet, C.orange, k); }
      case 47: { const pal = [C.cyan, C.amber, C.lilac, C.violet]; const p = ((y * 2 + beat / 4 + side * .5) % 1 + 1) % 1 * 4; const a = Math.floor(p), k = p - a; return mix(pal[a % 4], pal[(a + 1) % 4], k); }
      case 48: return mul(C.amber, .32 + .25 * hash(i * 3.1 + side * 17 + Math.floor(age * 3)));
      case 49: { const k = Math.max(0, 1 - age / 2.6); const on = hash(Math.floor(age * 16) + side) > (1 - k) * .9; return on ? mul(C.warm, .5 * k) : [0, 0, 0]; }
      case 59: return mul(mix(C.ice, C.white, (1 - y) * .45), .42 + .18 * (1 - y));
      case 60: return hash(i * 7.3 + side * 13 + Math.floor(age * 6)) > .9 ? mul(C.white, .75) : mul(C.deep, .55);
      case 61: { const lv = Math.min(1, age / (32 * SPB)); return y <= lv ? mix(C.ice, C.white, y) : mul(C.deep, .15); }
      case 62: return mul(mix(C.amber, C.warm, y), .72 + .28 * (1 - fb));
      case 63: return mul(mix(C.red, C.amber, side ? 1 - y : y), .7 + .3 * (1 - fb));
      case 64: return Math.abs(y - .5) < .045 ? mul(C.white, .7) : [0, 0, 0];
      case 65: { const k = .5 + .5 * Math.sin(y * 6 + age * 1.5 + side * Math.PI); return mul(mix(C.teal, C.violet, k), .6); }
      case 66: return mul(C.violet, .16 + .07 * Math.sin(age * 2));
      case 67: return C.warm;
      case 68: {
        const q = Math.floor(age * 18); if (hash(q * 1.7 + side * 3.3) > .78) return [0, 0, 0];
        const pos = .5 + .47 * Math.sin(age * 2.3 + side * 1.9) * Math.sin(age * .71 + hash(Math.floor(age * 2) + side) * 3);
        const d = Math.abs(y - pos); const lock = hash(Math.floor(age * 1.3) + side * 5) > .86;
        const g = d < .07 ? (1 - d / .07) * (lock ? 1 : .7) : 0; const n = hash(i * 5.1 + q * .37 + side * 11) > .9 ? .35 : 0;
        return mix(mul(C.ice, .05 + n), lock ? C.white : C.teal, g);
      }
      case 69: {
        if (i === 0 || i === N - 1) return mul(C.ice, .55);
        const p = (age * .1 + side * .5) % 1.4 - .2, d = (y - p) / .09;
        return mix([.015, .018, .028], C.ice, .18 * Math.exp(-d * d));
      }
      case 70: {
        const p = y * 3 - beat / 2, f = p - Math.floor(p), k = ((Math.floor(p) % 4) + 4) % 4;
        if (f < .14) return [0, 0, 0];
        return mul([C.screen, C.white, C.cyan, C.deep][k], .55);
      }
      case 71: {
        const r = hash(Math.floor(y * 6) * 3.1 + Math.floor(beat * 4) * .77 + side * 9);
        if (r > .82) return C.magenta; if (r > .7) return mul(C.cyan, .85); if (r > .64) return mul(C.white, .8); if (r < .05) return [0, 0, 0];
        return mul(C.screen, .45);
      }
      case 72: {
        let v = 0; for (let e = 0; e < 3; e++) { const p = (((beat / 2 - e * .22) % 1) + 1) % 1, d = (y - p) / .07; v += Math.exp(-d * d) * Math.pow(.6, e); }
        return mix(mul(C.deep, .3), mix(C.screen, C.ice, side ? .3 : 0), Math.min(1, v));
      }
      case 73: {
        const lv = Math.min(1, age / (16 * SPB));
        if (1 - y > lv) return mul(C.deep, .12);
        return hash(i * 2.7 + Math.floor(beat * 2) * 1.3 + side * 5) > .9 ? [0, 0, 0] : mix(C.white, C.screen, 1 - y);
      }
      case 74: {
        const g = .05 + .18 * (.5 + .5 * Math.sin(age * .9));
        if (Math.abs(y - .5) < g) return [0, 0, 0];
        return mul((y > .5) !== !!side ? C.cyan : C.magenta, .7);
      }
      case 75: {
        if (hash(i * 4.3 + Math.floor(beat * 2) * 2.1 + side * 7) > .93) return C.white;
        return mul(mix(C.magenta, C.violet, y), .55 + .45 * (1 - fb));
      }
    }
    return [0, 0, 0];
  }
  const calm = $('calm');
  function compute(t) {
    const beat = beatAt(t); const f = frame(beat); const age = (beat - f.stB) * SPB; const reduce = calm.checked;
    const tubes = [[], []]; let kick = 0; const active = new Set();
    for (let s = 0; s < 2; s++) { const side = s ^ f.swap; for (let i = 0; i < N; i++) tubes[s][i] = base(f.st, i, side, age, beat); }
    for (const [n, b] of f.held) {
      active.add(n); const el = (beat - b) * SPB;
      if (n === 55) { const pos = ((beat - b) * 2) % 1; for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) { const d = Math.abs(i / (N - 1) - pos); if (d < .12) tubes[s][i] = mix(tubes[s][i], C.warm, 1 - d / .12); } }
      if (n === 56) { const hz = reduce ? 3 : 10; const on = Math.floor(el * hz * 2) % 2 === 0; for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) tubes[s][i] = on ? mul(C.white, reduce ? .5 : 1) : [0, 0, 0]; }
      if (n === 57) { for (let s = 0; s < 2; s++) for (let i = 0; i < N; i++) tubes[s][i] = [0, 0, 0]; }
      if (n === 50) { const hz = reduce ? 3 : 12; kick = Math.max(kick, (Math.floor(el * hz * 2) % 2 === 0) ? (reduce ? .5 : 1) : 0); }
    }
    for (const [n, b] of f.imp) {
      const el = (beat - b) * SPB;
      if (n === 51) { const dec = reduce ? .4 : .16; if (el < dec * 3) { kick = Math.max(kick, (reduce ? .55 : 1) * Math.exp(-el / dec)); active.add(n); } }
      if (n === 52 || n === 53 || n === 54) {
        const k = (reduce ? .45 : .85) * Math.exp(-el / .14);
        if (k > .02) { active.add(n); for (let s = 0; s < 2; s++) { if (n === 53 && s === 1) continue; if (n === 54 && s === 0) continue; for (let i = 0; i < N; i++) tubes[s][i] = mix(tubes[s][i], C.warm, k); } }
      }
    }
    return { beat, f, tubes, kick, active };
  }

  // ---------- Render ----------
  const cv = $('stage'), cx = cv.getContext('2d');
  function resize() { const r = cv.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); cv.width = Math.max(1, Math.round(r.width * d)); cv.height = Math.max(1, Math.round(r.height * d)); }
  new ResizeObserver(resize).observe(cv);
  const avg = (a) => { let r = 0, g = 0, b = 0; a.forEach((c) => { r += c[0]; g += c[1]; b += c[2]; }); return [r / a.length, g / a.length, b / a.length]; };
  function draw(S) {
    const W = cv.width, H = cv.height; cx.globalCompositeOperation = 'source-over'; cx.fillStyle = '#050505'; cx.fillRect(0, 0, W, H);
    const floorY = H * .82, tubeH = H * .58, tubeW = Math.max(6, W * .018), xs = [W * .11, W * .89];
    cx.globalCompositeOperation = 'lighter';
    S.tubes.forEach((tb, s) => { const a = avg(tb); const g = cx.createRadialGradient(xs[s], floorY - tubeH / 2, 0, xs[s], floorY - tubeH / 2, W * .42); g.addColorStop(0, `rgba(${a.map((v) => Math.round(v * 255)).join(',')},.45)`); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, W, H); });
    if (S.kick > 0) { const g = cx.createRadialGradient(W * .5, H * .7, 0, W * .5, H * .7, W * .7); g.addColorStop(0, `rgba(255,255,255,${.55 * S.kick})`); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(0, 0, W, H); }
    cx.globalCompositeOperation = 'source-over';
    cx.fillStyle = '#0b0a09'; cx.fillRect(0, floorY, W, H - floorY); cx.strokeStyle = '#26231d'; cx.lineWidth = Math.max(1, H * .003); cx.beginPath(); cx.moveTo(0, floorY); cx.lineTo(W, floorY); cx.stroke();
    cx.fillStyle = '#151411'; cx.fillRect(W * .2, floorY - H * .16, W * .09, H * .16); cx.fillRect(W * .71, floorY - H * .16, W * .09, H * .16);
    cx.fillRect(W * .36, floorY - H * .05, W * .28, H * .05);
    cx.strokeStyle = '#2c2922'; cx.lineWidth = Math.max(1, H * .004);
    [[.4, .42], [.6, .4]].forEach(([x, y]) => { cx.beginPath(); cx.moveTo(W * x, floorY - H * .05); cx.lineTo(W * x, H * y); cx.stroke(); cx.beginPath(); cx.ellipse(W * x, H * y, W * .045, H * .008, 0, 0, Math.PI * 2); cx.stroke(); });
    const kx = W * .5, ky = floorY - H * .05 - H * .1, kr = H * .1;
    cx.save(); cx.shadowColor = `rgba(255,255,255,${S.kick})`; cx.shadowBlur = S.kick * H * .12;
    cx.fillStyle = S.kick > 0 ? `rgba(255,255,255,${.15 + .85 * S.kick})` : 'rgba(120,150,170,.06)'; cx.beginPath(); cx.arc(kx, ky, kr, 0, Math.PI * 2); cx.fill(); cx.restore();
    cx.strokeStyle = '#5c6a72'; cx.lineWidth = Math.max(1, H * .005); cx.beginPath(); cx.arc(kx, ky, kr, 0, Math.PI * 2); cx.stroke();
    cx.fillStyle = '#14130f'; cx.beginPath(); cx.arc(kx, ky, kr * .18, 0, Math.PI * 2); cx.fill();
    cx.strokeStyle = '#2c2922'; cx.beginPath(); cx.moveTo(W * .5, floorY); cx.lineTo(W * .5, H * .52); cx.lineTo(W * .47, H * .49); cx.stroke();
    S.tubes.forEach((tb, s) => {
      const x = xs[s] - tubeW / 2, ph = tubeH / N;
      cx.fillStyle = '#111'; cx.fillRect(x - 2, floorY - tubeH - 2, tubeW + 4, tubeH + 4);
      for (let i = 0; i < N; i++) {
        const c = tb[i]; const lum = Math.max(c[0], c[1], c[2]); const y = floorY - (i + 1) * ph;
        cx.save(); if (lum > .05) { cx.shadowColor = rgb(c); cx.shadowBlur = lum * W * .025; }
        cx.fillStyle = lum > .01 ? rgb(c) : '#0d0d0d'; cx.fillRect(x, y + ph * .08, tubeW, ph * .84); cx.restore();
      }
      cx.strokeStyle = '#2c2922'; cx.beginPath(); cx.moveTo(xs[s] - tubeW * 2, floorY); cx.lineTo(xs[s], floorY - ph); cx.lineTo(xs[s] + tubeW * 2, floorY); cx.stroke();
      const a = avg(tb); const g = cx.createLinearGradient(0, floorY, 0, H); g.addColorStop(0, `rgba(${a.map((v) => Math.round(v * 255)).join(',')},.35)`); g.addColorStop(1, 'rgba(0,0,0,0)'); cx.fillStyle = g; cx.fillRect(xs[s] - tubeW * 3, floorY, tubeW * 6, H - floorY);
    });
  }

  // ---------- Clock (the embedded master is the clock) ----------
  const audio = $('player'), playBtn = $('play');
  let playing = false;
  const now = () => audio.currentTime || 0;
  function seek(t) { t = Math.max(0, Math.min(DUR, t)); try { audio.currentTime = t; } catch (e) {} }
  function setPlay(p) {
    playing = p;
    if (p) audio.play().catch(() => { playing = false; playBtn.textContent = 'Lecture'; });
    else audio.pause();
    playBtn.textContent = p ? 'Pause' : 'Lecture';
  }
  playBtn.onclick = () => setPlay(!playing);
  $('back').onclick = () => seek(0);
  $('prevbar').onclick = () => seek(now() - stepNav());
  $('nextbar').onclick = () => seek(now() + stepNav());
  audio.onended = () => setPlay(false);

  const tl = $('tl'), ph = $('ph');
  function tlSeek(x) { const r = tl.getBoundingClientRect(); seek((x - r.left) / r.width * DUR); }
  let drag = false;
  tl.addEventListener('pointerdown', (e) => { drag = true; tl.setPointerCapture(e.pointerId); tlSeek(e.clientX); });
  tl.addEventListener('pointermove', (e) => { if (drag) tlSeek(e.clientX); });
  tl.addEventListener('pointerup', () => { drag = false; });
  document.addEventListener('keydown', (e) => {
    const typing = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement;
    if (typing || $('app').hidden || e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.code === 'Space' && !(e.target instanceof HTMLButtonElement)) { e.preventDefault(); playBtn.click(); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); seek(now() + stepNav()); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); seek(now() - stepNav()); }
    else if (e.key === 'c' || e.key === 'C') { e.preventDefault(); openForm(); }
  });

  // ---------- Audio loading (fetched with the token, played from a local blob) ----------
  const audioCache = {};
  async function loadAudio(s) {
    const msg = $('audio-msg');
    playBtn.disabled = true;
    if (audioCache[s.key]) { useAudio(s); return; }
    audio.removeAttribute('src'); audio.load();
    msg.textContent = 'Chargement du son…';
    try {
      const r = await api('audio/' + s.audio);
      if (!r.ok) throw new Error('Son introuvable');
      const total = +r.headers.get('Content-Length') || 0;
      const reader = r.body.getReader(); const chunks = []; let got = 0;
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        chunks.push(value); got += value.length;
        if (total && song === s) msg.textContent = 'Chargement du son… ' + Math.round(got / total * 100) + ' %';
      }
      audioCache[s.key] = URL.createObjectURL(new Blob(chunks, { type: 'audio/mpeg' }));
      if (song === s) useAudio(s);
    } catch (e) {
      if (e.message !== 'auth') msg.textContent = 'Le son n’a pas pu être chargé. Recharge la page.';
    }
  }
  let pendingSeek = null;
  function useAudio(s) {
    audio.addEventListener('loadedmetadata', () => {
      if (song !== s) return;
      if (isFinite(audio.duration) && audio.duration > 0) { DUR = audio.duration; buildTL(); buildMarks(); }
      seek(pendingSeek != null ? pendingSeek : s.start || 0);
    }, { once: true });
    audio.src = audioCache[s.key];
    $('audio-msg').textContent = ''; playBtn.disabled = false;
  }

  // ---------- Song switch ----------
  function buildLegend() {
    const lg = $('legend'); lg.textContent = '';
    const used = new Set(EV.map((e) => e[1]));
    Object.keys(NAMES).filter((k) => used.has(+k)).forEach((k) => {
      const d = document.createElement('div'); d.className = 'ls-lg';
      const sw = document.createElement('span'); sw.className = 'ls-sw'; sw.style.background = rgb(SWATCH[k]);
      const t = document.createElement('div'); const b = document.createElement('b'); b.textContent = k + ' · ' + NAMES[k];
      t.append(b, DESC[k]); d.append(sw, t); lg.append(d);
    });
  }
  function buildTL() {
    tl.querySelectorAll('.ls-seg').forEach((e) => e.remove());
    SEC.forEach((s, i) => {
      const e = document.createElement('div'); e.className = 'ls-seg' + (s[3] ? ' light' : '');
      const end = i < SEC.length - 1 ? SEC[i + 1][0] : DUR;
      e.style.left = (s[0] / DUR * 100) + '%'; e.style.width = ((end - s[0]) / DUR * 100) + '%'; e.style.background = s[2];
      e.textContent = s[1]; tl.insertBefore(e, ph);
    });
    tl.setAttribute('aria-valuemax', String(Math.round(DUR)));
  }
  function loadSong(key, at) {
    const s = SONGS.find((x) => x.key === key) || SONGS[0]; if (!s) return;
    if (playing) setPlay(false);
    song = s; EV = (s.ev || []).slice().sort((a, b) => a[0] - b[0]); SEC = s.sec || []; BPM = s.bpm || 0; SPB = BPM ? 60 / BPM : 0; OFF = s.off || 0; DUR = s.dur || 1;
    pendingSeek = at != null ? at : null;
    $('hcode').textContent = (s.track ? String(s.track).padStart(2, '0') + ' · ' : '') + s.code + ' //';
    $('htitle').textContent = s.name;
    $('hinfo').textContent = hasPlan()
      ? 'Plan lumière ' + s.ver + ' · ' + BPM + ' BPM · ' + EV.length + ' déclenchements'
      : 'Pas encore de plan lumière. Écoute et note tes idées au bon moment : elles serviront à le construire.';
    $('prevbar').textContent = SPB ? '−1 mes.' : '−5 s'; $('nextbar').textContent = SPB ? '+1 mes.' : '+5 s';
    $('cf-minus').textContent = SPB ? '− 1 temps' : '− 0,5 s'; $('cf-plus').textContent = SPB ? '+ 1 temps' : '+ 0,5 s';
    $('comment').textContent = hasPlan() ? 'Commenter ici' : 'Proposer une idée ici';
    $('cf-title').textContent = hasPlan() ? 'Nouveau commentaire' : 'Nouvelle idée';
    $('legend-wrap').hidden = !hasPlan();
    document.title = s.code + ' — Light show — The Clive';
    document.querySelectorAll('#songs .btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.k === key)));
    buildLegend(); buildTL(); closeForm(); lastChips = null;
    comments = []; renderComments(); loadComments();
    loadAudio(s);
    history.replaceState(null, '', '#' + s.key + (at != null ? '@' + at.toFixed(2) : ''));
  }

  // ---------- Comments ----------
  let comments = [], replyTo = null;
  const clist = $('clist');
  async function loadComments() {
    if (!song) return; const key = song.key;
    try {
      const d = await apiJson('comments?song=' + encodeURIComponent(key));
      if (song && song.key === key) { comments = d.comments; renderComments(); }
    } catch (e) {}
  }
  function el(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function actionBtn(label, fn) { const b = el('button', 'copy', label); b.type = 'button'; b.onclick = fn; return b; }

  function renderComments() {
    const showDone = $('show-done').checked;
    const roots = comments.filter((c) => !c.parent);
    const kids = {}; comments.filter((c) => c.parent).forEach((c) => { (kids[c.parent] = kids[c.parent] || []).push(c); });
    const open = roots.filter((c) => !c.resolved).length;
    $('ccount').textContent = 'Commentaires · ' + open + ' ouvert' + (open > 1 ? 's' : '') + (roots.length - open ? ' · ' + (roots.length - open) + ' réglé' + (roots.length - open > 1 ? 's' : '') : '');
    clist.textContent = '';
    const shown = roots.filter((c) => showDone || !c.resolved);
    $('cempty').hidden = shown.length > 0;
    if (!shown.length && roots.length) { $('cempty').hidden = false; $('cempty').textContent = 'Tous les points sont réglés.'; }
    else $('cempty').textContent = 'Rien pour ce morceau. Lance la lecture et clique sur « ' + $('comment').textContent + ' » au moment voulu.';
    for (const c of shown) {
      const li = el('li', 'ls-c' + (c.resolved ? ' done' : '')); li.dataset.t = c.t; li.dataset.id = c.id;
      const top = el('div', 'ls-ctop');
      const tb = el('button', 'ls-time', fmtShort(c.t) + (SPB ? ' · mes. ' + barOf(c.t) : '')); tb.type = 'button';
      tb.title = 'Écouter depuis 2 secondes avant'; tb.onclick = () => { seek(c.t - 2); if (!playBtn.disabled) setPlay(true); };
      top.append(tb); if (where(c.t)) top.append(el('span', 'ls-ctx', where(c.t)));
      if (song && (c.ver || '') !== (song.ver || '')) top.append(el('span', 'ls-tag', c.ver ? 'sur ' + c.ver : 'avant le plan'));
      if (c.resolved) top.append(el('span', 'ls-tag ok', 'Réglé'));
      const meta = el('p', 'ls-cmeta'); meta.append(el('b', null, c.author), ' · ' + fmtDate(c.created_at));
      li.append(top, meta, el('p', 'ls-cbody', c.body));
      const rs = kids[c.id] || [];
      if (rs.length) {
        const ul = el('ul', 'ls-replies');
        rs.forEach((r) => { const ri = el('li'); const m = el('p', 'ls-cmeta'); m.append(el('b', null, r.author), ' · ' + fmtDate(r.created_at)); ri.append(m, el('p', 'ls-cbody', r.body)); ul.append(ri); });
        li.append(ul);
      }
      const act = el('div', 'ls-cact');
      act.append(
        actionBtn('Répondre', () => openReply(li, c)),
        actionBtn(c.resolved ? 'Rouvrir' : 'Marquer réglé', () => setResolved(c, !c.resolved)),
        actionBtn('Copier le lien', (e) => copyLink(c, e.currentTarget)),
        actionBtn('Supprimer', () => removeComment(c)),
      );
      li.append(act);
      if (replyTo === c.id) li.append(replyForm(c));
      clist.append(li);
    }
    buildMarks();
  }
  function buildMarks() {
    tl.querySelectorAll('.ls-mark').forEach((e) => e.remove());
    comments.filter((c) => !c.parent).forEach((c) => {
      const m = el('span', 'ls-mark' + (c.resolved ? ' done' : '')); m.style.left = (c.t / DUR * 100) + '%'; tl.insertBefore(m, ph);
    });
  }
  function openReply(li, c) { replyTo = replyTo === c.id ? null : c.id; renderComments(); const f = clist.querySelector('.ls-rform textarea'); if (f) f.focus(); }
  function replyForm(c) {
    const f = el('form', 'ls-rform');
    const name = el('input', 'ls-input'); name.maxLength = 40; name.placeholder = 'Ton nom'; name.required = true; name.value = store.get('ls_author') || ''; name.setAttribute('aria-label', 'Ton nom');
    const ta = el('textarea', 'ls-input'); ta.rows = 2; ta.maxLength = 1500; ta.required = true; ta.placeholder = 'Ta réponse'; ta.setAttribute('aria-label', 'Ta réponse');
    const row = el('div', 'ls-row'); const send = el('button', 'btn solid', 'Répondre'); send.type = 'submit';
    const cancel = el('button', 'btn', 'Annuler'); cancel.type = 'button'; cancel.onclick = () => { replyTo = null; renderComments(); };
    row.append(send, cancel); f.append(name, ta, row);
    f.onsubmit = async (e) => {
      e.preventDefault(); if (!name.value.trim() || !ta.value.trim()) return;
      send.disabled = true; store.set('ls_author', name.value.trim());
      try {
        const d = await apiJson('comments', { method: 'POST', body: { song: song.key, ver: song.ver, t: c.t, author: name.value.trim(), body: ta.value.trim(), parent: c.id } });
        comments.push(d.comment); replyTo = null; renderComments();
      } catch (err) { send.disabled = false; }
    };
    ta.addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) f.requestSubmit(); });
    return f;
  }
  async function setResolved(c, v) {
    try { await apiJson('comments/' + c.id, { method: 'PATCH', body: { resolved: v } }); c.resolved = v ? 1 : 0; renderComments(); } catch (e) {}
  }
  async function removeComment(c) {
    if (!confirm('Supprimer ce commentaire' + (comments.some((x) => x.parent === c.id) ? ' et ses réponses' : '') + ' ?')) return;
    try { await apiJson('comments/' + c.id, { method: 'DELETE' }); comments = comments.filter((x) => x.id !== c.id && x.parent !== c.id); renderComments(); } catch (e) {}
  }
  function copyLink(c, btn) {
    const url = location.origin + location.pathname + '#' + song.key + '@' + Math.max(0, c.t - 2).toFixed(2);
    const done = () => { btn.textContent = 'Lien copié'; setTimeout(() => { btn.textContent = 'Copier le lien'; }, 1500); };
    if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, () => prompt('Lien :', url)); else prompt('Lien :', url);
  }
  $('show-done').onchange = renderComments;

  // New comment form
  const cform = $('cform'); let cfT = 0;
  function updateFormAt() { $('cf-at').textContent = fmt(cfT) + (SPB ? ' · mesure ' + barOf(cfT) : ''); $('cf-ctx').textContent = where(cfT); }
  function openForm() {
    if (!song) return;
    if (playing) setPlay(false);
    cfT = now(); updateFormAt(); $('cf-msg').textContent = '';
    cform.hidden = false;
    $('cf-author').value = $('cf-author').value || store.get('ls_author') || '';
    ($('cf-author').value ? $('cf-body') : $('cf-author')).focus({ preventScroll: true });
    cform.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function closeForm() { cform.hidden = true; $('cf-body').value = ''; }
  $('comment').onclick = openForm;
  $('cf-cancel').onclick = closeForm;
  $('cf-minus').onclick = () => { cfT = Math.max(0, cfT - stepFine()); updateFormAt(); seek(cfT); };
  $('cf-plus').onclick = () => { cfT = Math.min(DUR, cfT + stepFine()); updateFormAt(); seek(cfT); };
  $('cf-replay').onclick = () => { seek(cfT - 3); setPlay(true); setTimeout(() => { if (playing) setPlay(false); }, 4500); };
  $('cf-body').addEventListener('keydown', (e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) cform.requestSubmit(); });
  cform.onsubmit = async (e) => {
    e.preventDefault();
    const author = $('cf-author').value.trim(), body = $('cf-body').value.trim(), msg = $('cf-msg');
    if (!author || !body) { msg.textContent = 'Ton nom et le commentaire sont obligatoires.'; return; }
    store.set('ls_author', author);
    const btn = cform.querySelector('button[type=submit]'); btn.disabled = true; msg.textContent = 'Envoi…';
    try {
      const d = await apiJson('comments', { method: 'POST', body: { song: song.key, ver: song.ver, t: Math.round(cfT * 100) / 100, author, body } });
      comments.push(d.comment); comments.sort((a, b) => a.t - b.t || a.id - b.id); renderComments(); closeForm();
    } catch (err) { msg.textContent = err.message === 'auth' ? '' : 'Envoi impossible : ' + err.message; }
    btn.disabled = false;
  };

  // ---------- Main loop ----------
  let lastChips = '', lastNow = 0;
  function loop(ts) {
    if (song) {
      const t = Math.min(now(), DUR); const S = compute(t); draw(S);
      const bar = barOf(t);
      const st = hasPlan() ? NAMES[S.f.st] : '—';
      $('rtime').textContent = fmt(t); $('rbar').textContent = bar; $('rstate').textContent = st; $('rsec').textContent = secOf(t) || '—';
      $('osdState').textContent = hasPlan() ? st + (S.f.swap ? ' · SWAP' : '') : 'PAS ENCORE DE PLAN'; $('osdTime').textContent = fmt(t) + (SPB ? ' · ' + bar : '');
      ph.style.left = (t / DUR * 100) + '%'; tl.setAttribute('aria-valuenow', String(Math.round(t))); tl.setAttribute('aria-valuetext', fmt(t) + ', mesure ' + bar);
      const chips = [...S.active].sort().map((n) => `<span class="ls-chip${HOT.has(n) ? ' hot' : ''}">${NAMES[n]}</span>`).join('');
      if (chips !== lastChips) { $('chips').innerHTML = chips; lastChips = chips; }
      if (ts - lastNow > 200) { lastNow = ts; clist.querySelectorAll('.ls-c').forEach((li) => { const ct = +li.dataset.t; li.classList.toggle('now', t >= ct - .5 && t <= ct + 2.5); }); }
    }
    requestAnimationFrame(loop);
  }

  // ---------- Auth and start ----------
  function logout() {
    token = null; store.set('ls_token', null);
    if (playing) setPlay(false);
    $('app').hidden = true; $('logout').hidden = true; $('login').hidden = false;
  }
  $('logout').onclick = logout;
  $('login-form').onsubmit = async (e) => {
    e.preventDefault(); const msg = $('login-msg'); msg.textContent = 'Vérification…';
    try {
      const d = await apiJson('login', { method: 'POST', body: { password: $('pw').value } });
      token = d.token; store.set('ls_token', token); $('pw').value = ''; msg.textContent = ''; start();
    } catch (err) { msg.textContent = err.message.startsWith('Erreur 404') || err.message.startsWith('Erreur 5') ? 'Le service n’est pas encore en ligne.' : err.message; }
  };

  function parseHash() { const m = location.hash.match(/^#([a-z0-9-]+)(?:@([\d.]+))?$/); return m ? { key: m[1], at: m[2] != null ? +m[2] : null } : null; }
  window.addEventListener('hashchange', () => { const h = parseHash(); if (h && SONGS.length) { if (song && h.key === song.key && h.at != null) seek(h.at); else loadSong(h.key, h.at); } });

  async function start() {
    try {
      const r = await api('songs');
      if (!r.ok) throw new Error('songs');
      const d = await r.json(); SONGS = d.songs || [];
    } catch (e) {
      if (e.message !== 'auth') { $('login').hidden = false; $('login-msg').textContent = 'Les morceaux n’ont pas pu être chargés.'; }
      return;
    }
    $('login').hidden = true; $('app').hidden = false; $('logout').hidden = false;
    const songs = $('songs'); songs.textContent = '';
    SONGS.forEach((s) => { const b = el('button', 'btn' + (s.ev && s.ev.length ? '' : ' noplan'), s.code + ' // ' + s.name); b.title = s.ev && s.ev.length ? 'Plan lumière ' + s.ver : 'Pas encore de plan lumière'; b.type = 'button'; b.dataset.k = s.key; b.setAttribute('aria-pressed', 'false'); b.onclick = () => loadSong(s.key); songs.append(b); });
    resize();
    const h = parseHash();
    loadSong(h && SONGS.some((s) => s.key === h.key) ? h.key : SONGS[0].key, h ? h.at : null);
  }

  // Refresh comments every 30 s while the tab is visible, so everyone sees the others' notes.
  setInterval(() => { if (song && !document.hidden && !$('app').hidden && cform.hidden && replyTo == null) loadComments(); }, 30000);

  requestAnimationFrame(loop);
  if (token) start(); else $('login').hidden = false;
})();
