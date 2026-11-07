// Live leave-save probe (2026-11-04) — does a change made just before the page goes away reach Kata?
//
//   node _test/live-leave.mjs <launch link of part 01, FRESH registration> [<path to xapi-720-l.js>]
//
// Without the library path it runs the DEPLOYED build as is (the -k baseline). With it, the deployed
// pages are shadowed (_test/shadow.mjs): this tree's text files and the local -l library are served in
// place of the CDN copies — the -l build against the real Kata, with nothing uploaded.
// Scenarios, in order on the one registration (each starts after the previous relaunch):
//   nav    goTo(22), wait 1.5 s, goTo(23), navigate away at once → the relaunch lands on 23?
//   close  goTo(20), wait 1.5 s, goTo(24), close the TAB at once → a new tab lands on 24?
//   hidden goTo(25), wait 1.5 s, goTo(26), page hidden (kept alive) → the leave save is the
//          SYNCHRONOUS PUT (no keepalive fetch), and the document holds 26?
//   answer goTo(25), wait 1.5 s, answer s31 right, navigate away at once → lands on 25 with s31 done?
// Every state request is recorded with its type (XHR / Fetch / Preflight), method and status.
import { spawn } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { DRIVER, ANSWER, FP_JS } from './drive-common.mjs';
import { shadow } from './shadow.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [url, lib] = process.argv.slice(2);
if (!url) { console.error('usage: live-leave.mjs <launch url of part 01> [xapi-720-l.js]'); process.exit(2); }
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PORT = 9800 + Math.floor(Math.random() * 150);
const chrome = spawn(process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'll-'))}`, 'about:blank'], { stdio: 'ignore' });
const sh = lib ? shadow(ROOT, { lib }) : null;
const net = [];   // every state request of every tab: { tab, type, method, status }
const logs = [];

async function tab(name) {
  let v; for (let i = 0; i < 60; i++) { try { v = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json(); break; } catch { await sleep(200); } }
  const ws = new WebSocket(v.webSocketDebuggerUrl); let id = 0; const pend = new Map(); const reqs = new Map();
  let send;
  ws.onmessage = e => { const m = JSON.parse(e.data), p = m.params;
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
    if (m.method === 'Fetch.requestPaused' && sh) sh.paused(p, send);
    if (m.method === 'Network.requestWillBeSent' && /activities\/state/.test(p.request.url)) {
      const r = { tab: name, type: p.type, method: p.request.method, status: null }; reqs.set(p.requestId, r); net.push(r); }
    if (m.method === 'Network.responseReceived' && reqs.has(p.requestId)) reqs.get(p.requestId).status = p.response.status;
    if (m.method === 'Network.loadingFailed' && reqs.has(p.requestId)) reqs.get(p.requestId).status = 'failed:' + p.errorText;
    if (m.method === 'Runtime.consoleAPICalled') { const t = p.args.map(a => a.value ?? a.description).join(' ');
      if (/saveState720|resume\]/.test(t)) logs.push(name + ' ' + p.type + ' ' + t.slice(0, 160)); } };
  await new Promise(r => ws.onopen = r);
  send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true });
    if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable'); await send('Network.enable');
  await send('Network.setCacheDisabled', { cacheDisabled: true });
  if (sh) await sh.install(send);
  return { ws, send, ev, targetId: v.id, async open() {
    await send('Page.navigate', { url });
    for (let i = 0; i < 300; i++) { await sleep(150); try { if (await ev(`window._resumeReady === true && !document.getElementById('boot-cover')`)) break; } catch {} }
    await sleep(800); await ev(DRIVER); await ev(FP_JS); await ev(`__settle()`);
  } };
}
const doc = `(() => { const d = window.loadState720(RESUME_STATE_ID); return d && { cs: d.payload && d.payload.currentScreen,
  s31: !!(d.payload && d.payload.ssm && d.payload.ssm.s31 && d.payload.ssm.s31.logic && d.payload.ssm.s31.logic.done) }; })()`;
const out = {};
const mark = () => net.length;
const since = n => net.slice(n).map(r => `${r.type}:${r.method}:${r.status}`);

try {
  let t = await tab('A');
  await t.open();
  out.library = await t.ev(`[...document.scripts].map(s => s.src).find(s => /xapi-720-[a-z]\.js/.test(s))`);
  out.hasOnLeave = await t.ev(`typeof window.saveState720OnLeave === 'function'`);
  await t.ev(`(() => { const c = document.querySelector('#s0 .option-card[data-value="char1"]'); if (c && currentScreen === 0) selectOption(c); })()`);

  // nav
  await t.ev(`goTo(22)`); await sleep(1500);
  let n = mark();
  await t.ev(`goTo(23); 1`);
  await t.open();
  out.nav = { landed: await t.ev(`currentScreen`), want: 23, requests: since(n) };

  // close
  await t.ev(`goTo(20)`); await sleep(1500);
  n = mark();
  await t.ev(`goTo(24); 1`);
  await fetch(`http://127.0.0.1:${PORT}/json/close/${t.targetId}`);
  await sleep(2000);
  t = await tab('B');
  await t.open();
  out.close = { landed: await t.ev(`currentScreen`), want: 24, requests: since(n) };

  // hidden (the page stays alive)
  await t.ev(`goTo(25)`); await sleep(1500);
  n = mark();
  await t.ev(`goTo(26); Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' });
    document.dispatchEvent(new Event('visibilitychange')); 1`);
  await sleep(1500);
  const hiddenReqs = since(n);
  await t.ev(`delete document.visibilityState; 1`);
  out.hidden = { doc: await t.ev(doc), want: 26, requests: hiddenReqs };

  // answer, then leave at once
  await t.ev(`goTo(25)`); await sleep(1500);
  const meta = JSON.parse(readFileSync(join(ROOT, 'metadata', 'methodica-math-percent-03-01.json'), 'utf8'));
  const q31 = meta.subContent.flatMap(sc => sc.questions || []).find(q => /-005\/q1$/.test(q.questionId));
  n = mark();
  await t.ev(`(${ANSWER.plain})('s31', ${JSON.stringify({ right: true, q: q31 })}); 1`);
  await t.open();
  out.answer = { landed: await t.ev(`currentScreen`), want: 25, doc: await t.ev(doc), requests: since(n) };
  t.ws.close();
} catch (e) { out.error = String(e.stack || e); }
finally {
  chrome.kill();
  if (sh) out.shadowServed = [...sh.served].sort();
  out.logs = logs.filter(l => /OnLeave|failed|FAILED|refused/.test(l));
  console.log(JSON.stringify(out, null, 1));
  process.exit(0);
}
