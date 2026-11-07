// Live Kata run — the deployed unit, launched from real Kata links, the real library (xapi-720-k.js) and LRS.
//
//   node _test/live-kata.mjs <links learner A.csv> <links learner B.csv> [parts=01,...,07] [out.json]
//
// The CSVs come from Tools/full-kata-link/New-KataLaunchLinks.ps1 -UnitKey methodica-math-percent-03; each
// learner's registrations must be FRESH (nothing saved yet). Every request the page makes to Kata's xAPI is
// recorded from the browser's network traffic (DevTools protocol), with the status Kata answered.
//   learner A — every question RIGHT; learner B — every question WRONG, hint opened, second attempt where allowed.
// Per part and learner: every statement answered 2xx; per question the last answered carries the right
// verdict, a RIGHT response equals Kata's pattern from metadata byte for byte, the parent is the item;
// at most one requested per question (B); one component completed with the expected score.
// Then reload the same launch link: the part restores exactly (the resume fingerprint), nothing answered /
// requested is re-sent, no second completed, and the state document on Kata carries the character.
// Once, learner A: the tester's scenario on 01 (a card and a navigation BEFORE the restore lands — the
// document must stay intact) and a Slow 4G cold-cache launch of 03 (the cover holds until the restore).
// ⚠️ It writes to Kata (statements, state documents) for the two pseudonymous test learners only.
import { spawn } from 'node:child_process';
import { readFileSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { DRIVER, ANSWER, HINT, kind, SCREEN_OF, ADVANCE, FP_JS, firstDiff, pattern } from './drive-common.mjs';
import { shadow } from './shadow.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [csvA, csvB, partsArg, outFile] = process.argv.slice(2);
if (!csvA || !csvB) { console.error('usage: live-kata.mjs <links A.csv> <links B.csv> [parts] [out.json]'); process.exit(2); }
const PARTS = (partsArg || '01,02,03,04,05,06,07').split(',');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PORT = 9700 + Math.floor(Math.random() * 200);
const chrome = spawn(process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'lk-'))}`, 'about:blank'], { stdio: 'ignore' });

// componentId,title,launchUrl,registrationId,error — quoted CSV from Export-Csv
function links(file) {
  const rows = readFileSync(file, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean)
    .map(l => [...l.matchAll(/"((?:[^"]|"")*)"|([^,]+)|(?<=,)(?=,|$)/g)].map(m => (m[1] ?? m[2] ?? '').replace(/""/g, '"')));
  const head = rows.shift(); const ix = n => head.indexOf(n);
  return Object.fromEntries(rows.map(r => [r[ix('componentId')].replace(/\/$/, '').split('/').pop().slice(-2), r[ix('launchUrl')]]));
}
const LINKS = { A: links(csvA), B: links(csvB) };
// SHADOW_LIB=<path to a library build>: run the deployed pages shadowed by this tree + that library
// (_test/shadow.mjs) — a candidate build against the real Kata with nothing uploaded.
const SH = process.env.SHADOW_LIB ? shadow(ROOT, { lib: process.env.SHADOW_LIB }) : null;

async function cdp() {
  let v; for (let i = 0; i < 60; i++) { try { v = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json(); break; } catch { await sleep(200); } }
  const ws = new WebSocket(v.webSocketDebuggerUrl); let id = 0; const pend = new Map(); const logs = []; const net = new Map(); const order = [];
  let send;
  ws.onmessage = e => { const m = JSON.parse(e.data);
    if (m.method === 'Fetch.requestPaused' && SH) SH.paused(m.params, send);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
    const p = m.params;
    if (m.method === 'Runtime.consoleAPICalled') logs.push({ type: p.type, text: p.args.map(a => a.value ?? a.description).join(' ') });
    if (m.method === 'Runtime.exceptionThrown') logs.push({ type: 'exception', text: p.exceptionDetails.exception?.description || p.exceptionDetails.text });
    if (m.method === 'Network.requestWillBeSent' && /kata\.cet\.ac\.il\/api\/v1\/xapi\//.test(p.request.url) && p.request.method !== 'OPTIONS') {
      net.set(p.requestId, { url: p.request.url, method: p.request.method, type: p.type, body: p.request.postData, hasBody: p.request.hasPostData, status: null, done: false });
      order.push(p.requestId);
    }
    if (m.method === 'Network.responseReceived' && net.has(p.requestId)) net.get(p.requestId).status = p.response.status;
    if (m.method === 'Network.loadingFinished' && net.has(p.requestId)) net.get(p.requestId).done = true;
    if (m.method === 'Network.loadingFailed' && net.has(p.requestId)) Object.assign(net.get(p.requestId), { done: true, failed: p.errorText }); };
  await new Promise(r => ws.onopen = r);
  send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true });
    if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable', { maxPostDataSize: 1 << 20 });
  if (SH) await SH.install(send);
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 710, deviceScaleFactor: 1, mobile: false });
  // every xAPI request so far, bodies filled in, settled (none in flight for 1.5 s, at most 30 s)
  async function requests() {
    for (let t = 0, quiet = 0; t < 300 && quiet < 15; t++) { await sleep(100); quiet = [...net.values()].every(r => r.done) ? quiet + 1 : 0; }
    for (const rid of order) { const r = net.get(rid);
      if (r.hasBody && r.body == null) { const b = await send('Network.getRequestPostData', { requestId: rid }); r.body = b.result ? b.result.postData : null; } }
    return order.map(rid => net.get(rid));
  }
  // the statements among them, one row per statement
  async function statements() {
    const out = [];
    for (const r of await requests()) {
      if (!/\/statements/.test(r.url) || !/^(PUT|POST)$/.test(r.method) || !r.body) continue;
      let b; try { b = JSON.parse(r.body); } catch { continue; }
      for (const s of [].concat(b)) out.push({ status: r.status, failed: r.failed, verb: s.verb.id.split('/').pop(), objectId: s.object.id,
        parentId: s.context?.contextActivities?.parent?.[0]?.id, result: s.result || {} });
    }
    return out;
  }
  return { ws, send, ev, logs, requests, statements, async open(url, { ready = true } = {}) {
    await send('Page.navigate', { url });
    if (!ready) return;
    for (let i = 0; i < 300; i++) { await sleep(150); try { if (await ev(`!!(window.METADATA && window.METADATA.id && window._resumeReady === true && !document.getElementById('boot-cover'))`)) break; } catch {} }
    await sleep(800); await ev(DRIVER); await ev(FP_JS); await ev(`__settle()`);
  } };
}

let fails = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { fails++; console.log('  FAIL ' + msg); } };
const report = { when: new Date().toISOString(), parts: {}, tester: null, slow4g: null };
const doc = `(() => { const d = window.loadState720(RESUME_STATE_ID); const r = window.stateLastResult720 ? window.stateLastResult720() : null;
  return { d: d && { component: d.component, character: d.ui && d.ui.character, cs: d.payload && d.payload.currentScreen,
    ssm: d.payload && d.payload.ssm ? Object.keys(d.payload.ssm).length : 0, bytes: JSON.stringify(d).length }, r }; })()`;

try {
  for (const part of PARTS) {
    const slug = `methodica-math-percent-03-${part}`;
    const meta = JSON.parse(readFileSync(join(ROOT, 'metadata', slug + '.json'), 'utf8'));
    const qmeta = {}; meta.subContent.forEach(sc => (sc.questions || []).forEach(q => { qmeta[q.questionId] = { ...q, item: sc.id }; }));
    report.parts[part] = {};
    for (const [who, walk] of [['A', 'right'], ['B', 'wrong']]) {
      const url = LINKS[who][part];
      ok(!!url, `${part} ${who}: no launch link`); if (!url) continue;
      const page = await cdp();
      await page.open(url);
      // fresh = the page's first read of its state document was a 404 (the landing screen is saved right after)
      const firstRead = (await page.requests()).find(r => /activities\/state/.test(r.url) && r.method === 'GET');
      ok(firstRead && firstRead.status === 404, `${part} ${who}: the registration is not fresh (first state read ${firstRead && firstRead.status})`);
      await page.ev(`(() => { const c = document.querySelector('#s0 .option-card[data-value="char2"]');
        if (c && currentScreen === 0) selectOption(c); else setUnitCharacter('char2'); })()`);
      const cfg = await page.ev(`({ first: SPLIT_FIRST, last: SPLIT_LAST, keys: Object.keys(XAPI_QUESTIONS), qs: XAPI_PART_QUESTIONS,
        screenOf: Object.fromEntries([...document.querySelectorAll('section[data-screen]')].map(s => [s.id, +s.dataset.screen])) })`);
      const keys = cfg.keys.filter(k => { const s = SCREEN_OF[k] ?? cfg.screenOf[k]; return s != null && cfg.screenOf[k.replace(/[a-c]$/, '')] != null && s >= cfg.first && s <= cfg.last; });
      ok(keys.length === cfg.qs.length, `${part} ${who}: ${keys.length} question keys on screen vs ${cfg.qs.length} in metadata`);
      const expect = [];
      for (const k of keys) {
        const [item, qk] = await page.ev(`XAPI_QUESTIONS[${JSON.stringify(k)}]`);
        const q = qmeta[`${meta.id}${slug}-${item}/${qk}`];
        ok(!!q, `${part} ${k}: not in metadata`); if (!q) continue;
        const scr = SCREEN_OF[k] ?? cfg.screenOf[k];
        if (await page.ev(`currentScreen`) !== scr) await page.ev(`goTo(${scr})`);
        await sleep(200);
        const kd = kind(k), arg = JSON.stringify({ right: walk === 'right', q });
        await page.ev(`(${ANSWER[kd]})(${JSON.stringify(k)}, ${arg})`);
        if (walk === 'wrong') {
          await sleep(150);
          await page.ev(`(${HINT[kd]})(${JSON.stringify(k)})`).catch(() => {});
          const more = await page.ev(`(() => { const st = (typeof vqState !== 'undefined' && vqState[${JSON.stringify(k)}]) || null; return st ? !st.done : null; })()`);
          if (more !== false) await page.ev(`(${ANSWER[kd].replace(/'1'/g, "'2'")})(${JSON.stringify(k)}, ${arg})`).catch(() => {});
        }
        await sleep(250);
        expect.push({ k, qid: q.questionId, item: q.item, q });
        if (ADVANCE[k]) { await page.ev(ADVANCE[k]); await sleep(250); }
      }
      if (part === '04') { await page.ev(`goTo(51)`); await page.ev(`s57Continue(); s57Continue();`); }
      else if (part === '06' || part === '07') await page.ev(`vqSubmit(${JSON.stringify(part === '06' ? 's71' : 's76')})`);
      else await page.ev(`document.getElementById(XAPI_END_BTN).click()`);
      await sleep(1500);
      const st = await page.statements();
      const bad = st.filter(s => !(s.status >= 200 && s.status < 300));
      ok(!bad.length, `${part} ${who}: ${bad.length} statement(s) not accepted — ${bad.slice(0, 3).map(s => `${s.verb} ${s.status ?? s.failed}`).join(', ')}`);
      const rows = [];
      for (const e of expect) {
        const ans = st.filter(s => s.verb === 'answered' && s.objectId === e.qid);
        const last = ans[ans.length - 1];
        ok(ans.length >= 1, `${part} ${who} ${e.k}: no answered on Kata`);
        ok(ans.every(s => s.parentId === e.item), `${part} ${who} ${e.k}: parent ${ans.map(s => s.parentId)} is not ${e.item}`);
        if (last) {
          ok(last.result.success === (walk === 'right'), `${part} ${who} ${e.k}: last answered success=${last.result.success}`);
          if (walk === 'right') ok(last.result.response === pattern(e.q), `${part} A ${e.k}: response ${JSON.stringify(last.result.response)} != ${JSON.stringify(pattern(e.q))}`);
        }
        const req = st.filter(s => s.verb === 'requested' && s.objectId === e.qid).length;
        if (walk === 'wrong') ok(req <= 1, `${part} B ${e.k}: ${req} requested`);
        rows.push({ q: e.qid.split('/').slice(-2).join('/'), type: e.q.questionType, answered: ans.length, requested: req,
          status: [...new Set(ans.map(s => s.status))].join('/'), response: last && last.result.response, success: last && last.result.success });
      }
      const comp = st.filter(s => s.verb === 'completed' && s.objectId === meta.id);
      ok(comp.length === 1, `${part} ${who}: ${comp.length} component completed`);
      if (comp[0] && cfg.qs.length) ok(comp[0].result.score?.scaled === (walk === 'right' ? 1 : 0), `${part} ${who}: component scaled ${comp[0].result.score?.scaled}`);
      const warns = page.logs.filter(l => /\[xAPI\]|\[resume\]/.test(l.text) && /warn|error/.test(l.type) || l.type === 'exception');
      ok(!warns.length, `${part} ${who}: ${warns.length} warning(s) — ${warns.slice(0, 3).map(w => w.text).join(' || ')}`);
      const verbs = st.reduce((o, s) => (o[s.verb] = (o[s.verb] || 0) + 1, o), {});
      console.log(`${part} ${who} ${walk}: ${expect.length} questions, ${st.length} statements ${JSON.stringify(verbs)}, all ${bad.length ? 'NOT ' : ''}accepted`);

      // ── save → relaunch the same link → restore ──
      const before = await page.ev(`__fp()`);
      // __fp's sweep ends with a navigation; its debounced save (800 ms) must land before the reload,
      // because Chrome blocks the library's synchronous write on page dismissal (the leave flush fails)
      await sleep(1500);
      const saved = await page.ev(doc);
      const n0 = st.length;
      await page.open(url);
      const after = await page.ev(`__fp()`);
      const d = firstDiff(before, after);
      ok(!d, `${part} ${who} relaunch: restored part differs at ${d}`);
      ok(after.cs === before.cs, `${part} ${who} relaunch: landed on ${after.cs}, left on ${before.cs}`);
      const st2 = await page.statements();
      const again = st2.slice(n0).filter(s => /^(answered|requested)$/.test(s.verb) || (s.verb === 'completed' && s.objectId === meta.id));
      ok(!again.length, `${part} ${who} relaunch: re-sent ${again.map(s => s.verb).join(', ')}`);
      const back = await page.ev(doc);
      ok(back.d && back.d.component === slug && back.d.character === 'char2', `${part} ${who} relaunch: document ${JSON.stringify(back.d)}`);
      const stateReq = (await page.requests()).filter(r => /activities\/state/.test(r.url));
      // -l's leave save on the old page (a keepalive fetch) completes after the navigation, so its answer
      // is never seen here — DevTools shows it pending or 'net::ERR_ABORTED' for the departed document.
      // Counted apart: the identical restore above is what proves it landed.
      const unobserved = stateReq.filter(r => r.type === 'Fetch' && r.method === 'PUT' && r.status == null && (!r.failed || r.failed === 'net::ERR_ABORTED'));
      const stateBad = stateReq.filter(r => !unobserved.includes(r) && !(r.status >= 200 && r.status < 300) && r.status !== 404);
      ok(!stateBad.length, `${part} ${who}: state request(s) failed ${stateBad.map(r => r.method + ' ' + (r.status ?? r.failed)).join(', ')}`);
      console.log(`${part} ${who} relaunch: ${Object.keys(after.screens).length} screens restored on ${after.cs}, document ${back.d && back.d.bytes} bytes, ${stateReq.length} state requests (${unobserved.length} keepalive leave PUT unobserved)`);
      report.parts[part][who] = { walk, rows, verbs, statements: st.length, notAccepted: bad.length, screens: Object.keys(after.screens).length,
        landed: after.cs, docBytes: back.d && back.d.bytes, savedBefore: saved.d, stateRequests: stateReq.length, restoredSame: !d };
      page.ws.close();
    }
  }

  // ═══ the tester's scenario, learner A, part 01: a card and a navigation before the restore lands ═══
  if (PARTS.includes('01')) {
    // the document as the walk left it, read by a plain launch once its saves have settled
    const plain = await cdp();
    await plain.open(LINKS.A['01']); await sleep(2500);
    const prev = (await plain.ev(doc)).d;
    plain.ws.close();
    const page = await cdp();
    const early = await page.send('Page.addScriptToEvaluateOnNewDocument', { source: `(function () {
      window.__early = { ran: false };
      var t = setInterval(function () {
        if (typeof setUnitCharacter !== 'function' || typeof goTo !== 'function' || !document.getElementById('s0')) return;
        clearInterval(t);
        window.__early = { ran: true, readyAtPick: window._resumeReady === true, at: performance.now() };
        try { setUnitCharacter('char1'); goTo(1); } catch (e) { window.__early.err = String(e); }
      }, 5);
    })();` });
    await page.open(LINKS.A['01']);
    const e = await page.ev(`window.__early`);
    await sleep(2500);
    const after = await page.ev(doc);
    await page.send('Page.removeScriptToEvaluateOnNewDocument', { identifier: early.result.identifier });
    ok(e && e.ran && e.readyAtPick === false, `tester: the pick did not land before the restore (${JSON.stringify(e)})`);
    ok(after.d && prev && after.d.cs === prev.cs && after.d.ssm === prev.ssm, `tester: the document changed — before ${JSON.stringify(prev)}, after ${JSON.stringify(after.d)}`);
    ok(after.d && after.d.character === 'char1', `tester: the pick's character did not win (${after.d && after.d.character})`);
    const cs = await page.ev(`currentScreen`);
    console.log(`tester: pick at ${Math.round(e.at)} ms before stage B; document kept screen ${after.d && after.d.cs} with ${after.d && after.d.ssm} screens; page on ${cs}; character ${after.d && after.d.character}`);
    report.tester = { early: e, before: prev, after: after.d, pageScreen: cs };
    // put the character back so the part's document is as the walk left it
    await page.ev(`setUnitCharacter('char2'); flushResumeSave(); 1`); await sleep(1500);
    page.ws.close();
  }

  // ═══ Slow 4G, cold cache, learner A, part 03 ═══
  if (PARTS.includes('03')) {
    const page = await cdp();
    await page.send('Network.clearBrowserCache');
    await page.send('Network.setCacheDisabled', { cacheDisabled: true });
    // Chrome DevTools "Slow 4G" preset
    await page.send('Network.emulateNetworkConditions', { offline: false, latency: 562.5, downloadThroughput: 180000, uploadThroughput: 84375 });
    await page.send('Page.addScriptToEvaluateOnNewDocument', { source: `(function () {
      window.__boot = []; var last = '', seen = false;
      var t = setInterval(function () {
        /* nothing to sample until the body has parsed the cover (on Slow 4G the HTML takes seconds) */
        if (!seen) { if (!document.getElementById('boot-cover')) return; seen = true; }
        var s = { cover: !!document.getElementById('boot-cover'), flight: !!window.__resumeInFlight, ready: window._resumeReady === true,
          cs: typeof currentScreen === 'number' ? currentScreen : null };
        var k = JSON.stringify(s); if (k !== last) { last = k; s.t = Math.round(performance.now()); window.__boot.push(s); }
        if (!s.cover && s.ready) clearInterval(t);
      }, 20);
    })();` });
    const t0 = Date.now();
    await page.open(LINKS.A['03']);
    const boot = await page.ev(`window.__boot`);
    const drop = boot.find(s => !s.cover);
    const saved = report.parts['03'] && report.parts['03'].A && report.parts['03'].A.landed;
    ok(drop && drop.ready && drop.cs === saved, `slow4g: the cover dropped ${JSON.stringify(drop)} before the restore to screen ${saved}`);
    ok(!boot.some(s => !s.cover && s.cs === 0), `slow4g: screen 0 visible without the cover`);
    console.log(`slow4g: cover dropped at ${drop && drop.t} ms on screen ${drop && drop.cs} (ready ${drop && drop.ready}), page usable after ${Date.now() - t0} ms`);
    report.slow4g = { boot, wallMs: Date.now() - t0 };
    page.ws.close();
  }
} catch (e) { fails++; console.log('ERROR ' + (e.stack || e)); }
finally {
  chrome.kill();
  if (SH) { report.shadowServed = [...SH.served].sort(); console.log('shadow served: ' + report.shadowServed.join(', ')); }
  if (outFile) writeFileSync(outFile, JSON.stringify(report, null, 1));
  console.log(`${fails ? 'FAIL' : 'PASS'} ${checks - fails}/${checks}`);
  process.exit(fails ? 1 : 0);
}
