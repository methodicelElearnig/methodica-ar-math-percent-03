// Reporting harness — every catalogue question of every part, answered in the running page.
//
//   node _test/verify-report.mjs <baseUrl> [parts=01,...,07]
//
// <baseUrl> serves the repo root (python -m http.server 8803 --bind 127.0.0.1). Each part is loaded
// in headless Chrome (DevTools protocol, no npm dependency) with ?xapiLib=../_test/xapi-720-l.js,
// the stub that logs every statement. Two walks per part:
//   right — every question answered right on the first attempt;
//   wrong — every question answered wrong until no attempt is left (hint opened on the way).
// Checks, per question: object.id = the metadata questionId byte for byte, parent = its item,
// answered.last carries the verdict, a RIGHT response is byte-identical to the pattern Kata builds
// from metadata correctAnswers (choice A[,]B in answers order, performance step[.]value), exactly one
// requested per hinted question; per part: the item initialized/completed pairs, one component
// 'completed' with the expected score, no '[xAPI]' warning, no old '=' / ' | ' response joiners.
//
// Resume (2026-11-04), per part:
//   round trip — after each walk every screen of the part is fingerprinted (interaction DOM, feedback
//     text, typeset math count, the screen's logic object, results, character), the page is reloaded,
//     and the restored part must fingerprint the same; the reload sends no answered / requested and no
//     duplicate completed, and the finished part's last button stays disabled (D-8);
//   retry gate — one wrong attempt, reload: same screen, same attempt count, the check button still
//     disabled on the untouched wrong answer (D-14), nothing re-sent.
// Then, once: the write-guard group of BOOT-AND-RESUME-HARDENING-2026-11-03.md §2.6 (the tester's
// scenario, markSent before stage B, a failed read), the source shape of A1–A4 / B2–B5, and per part
// the boot markup (inline flag, one net, preload links equal to the loader's URL, preconnect, lazy
// images off the landing screen) and identical ?v= across parts.
import { spawn } from 'node:child_process';
import { readFileSync, mkdtempSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { DRIVER, ANSWER, HINT, kind, SCREEN_OF, ADVANCE, FP_JS, firstDiff, RETRY_KEY, pattern } from './drive-common.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const [baseUrl, partsArg] = process.argv.slice(2);
if (!baseUrl) { console.error('usage: verify-report.mjs <baseUrl> [parts]'); process.exit(2); }
const PARTS = (partsArg || '01,02,03,04,05,06,07').split(',');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const PORT = 9400 + Math.floor(Math.random() * 300);
const chrome = spawn(process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${mkdtempSync(join(tmpdir(), 'vr-'))}`, 'about:blank'], { stdio: 'ignore' });

async function cdp(url) {
  let v; for (let i = 0; i < 60; i++) { try { v = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json(); break; } catch { await sleep(200); } }
  const ws = new WebSocket(v.webSocketDebuggerUrl); let id = 0; const pend = new Map(); const logs = [];
  ws.onmessage = e => { const m = JSON.parse(e.data);
    if (m.id && pend.has(m.id)) { pend.get(m.id)(m); pend.delete(m.id); }
    if (m.method === 'Runtime.consoleAPICalled') logs.push({ type: m.params.type, text: m.params.args.map(a => a.value ?? a.description).join(' ') });
    if (m.method === 'Runtime.exceptionThrown') logs.push({ type: 'exception', text: m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text }); };
  await new Promise(r => ws.onopen = r);
  const send = (method, params = {}) => new Promise(r => { const i = ++id; pend.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async x => { const r = await send('Runtime.evaluate', { expression: x, awaitPromise: true, returnByValue: true });
    if (r.result.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description || r.result.exceptionDetails.text); return r.result.result.value; };
  await send('Runtime.enable'); await send('Page.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 710, deviceScaleFactor: 1, mobile: false });
  return { ws, send, ev, logs, async open() {
    await send('Page.navigate', { url });
    for (let i = 0; i < 100; i++) { await sleep(150); try { if (await ev(`!!(window.METADATA && window.METADATA.id && typeof __stmts === 'function')`)) break; } catch {} }
    await sleep(500); await ev(DRIVER); await ev(FP_JS);
  } };
}

let fails = 0, checks = 0;
const ok = (cond, msg) => { checks++; if (!cond) { fails++; console.log('  FAIL ' + msg); } };

try {
  for (const part of PARTS) {
    const slug = `methodica-math-percent-03-${part}`;
    const meta = JSON.parse(readFileSync(join(ROOT, 'metadata', slug + '.json'), 'utf8'));
    const qmeta = {}; meta.subContent.forEach(sc => (sc.questions || []).forEach(q => { qmeta[q.questionId] = { ...q, item: sc.id }; }));
    const page = await cdp(`${baseUrl}/${slug}/index.html?xapiLib=../_test/xapi-720-l.js`);
    for (const walk of ['right', 'wrong']) {
      // reset, then load again: the landing item's 'initialized' must be in the log. The writes are
      // closed first: with resume on, the leave handler would otherwise save the restored page again
      // on the reload and the walk would start inside the previous one.
      await page.open();
      await page.ev(`_resumeReady = false; __reset()`);
      page.logs.length = 0;
      await page.open();
      // the character goes with the part's document (part 01 picks it on s0)
      await page.ev(`(() => { const c = document.querySelector('#s0 .option-card[data-value="char2"]');
        if (c && currentScreen === 0) selectOption(c); else setUnitCharacter('char2'); })()`);
      const cfg = await page.ev(`({ first: SPLIT_FIRST, last: SPLIT_LAST, keys: Object.keys(XAPI_QUESTIONS), comp: XAPI_COMP_SLUG, qs: XAPI_PART_QUESTIONS,
        vq: Object.keys(VQ), screenOf: Object.fromEntries([...document.querySelectorAll('section[data-screen]')].map(s => [s.id, +s.dataset.screen])) })`);
      const keys = cfg.keys.filter(k => { const s = SCREEN_OF[k] ?? cfg.screenOf[k]; return s != null && cfg.screenOf[k.replace(/[a-c]$/, '')] != null && s >= cfg.first && s <= cfg.last; });
      ok(keys.length === cfg.qs.length, `${part} ${walk}: ${keys.length} question keys on screen vs ${cfg.qs.length} in metadata`);
      const expect = [];
      for (const k of keys) {
        const [item, qk] = await page.ev(`XAPI_QUESTIONS[${JSON.stringify(k)}]`);
        const qid = `${meta.id}${slug}-${item}/${qk}`;
        const q = qmeta[qid];
        ok(!!q, `${part} ${k}: ${qid} not in metadata`);
        if (!q) continue;
        const scr = SCREEN_OF[k] ?? cfg.screenOf[k];
        if (await page.ev(`currentScreen`) !== scr) await page.ev(`goTo(${scr})`);
        await sleep(120);
        const kd = kind(k), arg = JSON.stringify({ right: walk === 'right', q });
        if (walk === 'right') {
          await page.ev(`(${ANSWER[kd]})(${JSON.stringify(k)}, ${arg})`);
        } else {
          await page.ev(`(${ANSWER[kd]})(${JSON.stringify(k)}, ${arg})`);
          await sleep(80);
          await page.ev(`(${HINT[kd]})(${JSON.stringify(k)})`).catch(() => {});
          // a second wrong attempt where the screen allows one (the retry gate needs a changed answer)
          const more = await page.ev(`(() => { const st = (typeof vqState !== 'undefined' && vqState[${JSON.stringify(k)}]) || null; return st ? !st.done : null; })()`);
          if (more !== false) await page.ev(`(${ANSWER[kd].replace(/'1'/g, "'2'")})(${JSON.stringify(k)}, ${arg})`).catch(() => {});
        }
        await sleep(150);
        expect.push({ k, qid, item: q.item, q });
        if (ADVANCE[k]) { await page.ev(ADVANCE[k]); await sleep(150); }
      }
      // the part's last click
      if (part === '04') { await page.ev(`goTo(51)`); await page.ev(`s57Continue(); s57Continue();`); }
      else if (part === '06' || part === '07') { await page.ev(`vqSubmit(${JSON.stringify(part === '06' ? 's71' : 's76')})`); }
      else await page.ev(`document.getElementById(XAPI_END_BTN).click()`);
      await sleep(300);
      const st = await page.ev(`__stmts()`);
      // per question
      for (const e of expect) {
        const mine = st.filter(s => s.opts && s.opts.questionId === e.qid);
        const answers = mine.filter(s => /^answered/.test(s.verb));
        const last = answers.filter(s => s.verb === 'answered.last');
        ok(answers.length >= 1, `${part} ${walk} ${e.k}: no answered for ${e.qid}`);
        ok(last.length === 1, `${part} ${walk} ${e.k}: ${last.length} answered.last`);
        ok(answers.every(s => s.opts.parentId === e.item), `${part} ${walk} ${e.k}: parent is not the item ${e.item}`);
        ok(answers.every(s => !/ \| |=/.test(s.result.response)), `${part} ${walk} ${e.k}: old joiner in response ${answers.map(s => s.result.response)}`);
        if (last[0]) {
          ok(last[0].result.success === (walk === 'right') && last[0].result.score.scaled === (walk === 'right' ? 1 : 0),
            `${part} ${walk} ${e.k}: answered.last success=${last[0].result.success}`);
          if (walk === 'right') ok(last[0].result.response === pattern(e.q),
            `${part} right ${e.k}: response ${JSON.stringify(last[0].result.response)} != pattern ${JSON.stringify(pattern(e.q))}`);
        }
        if (process.env.DUMP && last[0]) console.log(`    ${walk} ${e.k} ${e.q.questionType} ${e.qid.split('/').slice(-2).join('/')} response=${JSON.stringify(last[0].result.response)}`);
        if (walk === 'wrong') {
          const hints = mine.filter(s => /^requested/.test(s.verb));
          ok(hints.length <= 1, `${part} wrong ${e.k}: ${hints.length} requested`);
        }
      }
      // per part
      const items = [...new Set(st.filter(s => s.objectType === 'question' && /^(initialized|completed)$/.test(s.verb)).map(s => s.objectId))];
      items.forEach(id => {
        const ini = st.filter(s => s.verb === 'initialized' && s.objectId === id).length, com = st.filter(s => s.verb === 'completed' && s.objectId === id).length;
        ok(ini >= 1 && com === 1, `${part} ${walk}: item ${id.split('/').slice(-2)[0]} initialized ${ini} / completed ${com}`);
      });
      const compDone = st.filter(s => s.verb === 'completed' && s.objectType === 'onlinelesson');
      ok(compDone.length === 1, `${part} ${walk}: ${compDone.length} component completed`);
      if (compDone[0] && cfg.qs.length) {
        const sc = compDone[0].result && compDone[0].result.score && compDone[0].result.score.scaled;
        ok(sc === (walk === 'right' ? 1 : 0), `${part} ${walk}: component scaled ${sc}`);
      }
      const warns = page.logs.filter(l => /\[xAPI\]/.test(l.text) && /warn|error/.test(l.type) || l.type === 'exception');
      ok(warns.length === 0, `${part} ${walk}: ${warns.length} warnings — ${warns.slice(0, 3).map(w => w.text).join(' || ')}`);
      console.log(`${part} ${walk}: ${expect.length} questions, ${st.length} statements`);

      // ── resume round trip: the finished part, reloaded, must come back exactly ──
      const before = await page.ev(`__fp()`);
      const beforeTable = part === '01' ? await page.ev(`(() => { const s = currentScreen; goTo(8);
        const gp = window.lomdaState.guidedPractice.battery; let r = null;
        if (gp.step === 1) { goBack(); r = __fpScreen(8); s7GoToStep(1); s7RestoreFormulaStep(); }
        goTo(s); return r; })()`) : null;
      const n0 = (await page.ev(`__stmts()`)).length;
      await page.open();
      await page.ev(`__settle()`);
      const after = await page.ev(`__fp()`);
      const d = firstDiff(before, after);
      ok(!d, `${part} ${walk} resume: restored part differs at ${d}`);
      if (part === '01') {
        // s7's table step, hidden on the formula step, comes back through Back exactly as it was left
        const table = fp => fp.dom.filter(r => /^s7-(pct-partial|val-known|pct-whole)$/.test(r.k));
        const back = await page.ev(`(goTo(8), window.lomdaState.guidedPractice.battery.step === 1 ? (goBack(), __fpScreen(8)) : null)`);
        ok(back && !firstDiff(table(beforeTable), table(back)), `${part} ${walk} resume: s7 table after Back differs at ${back && firstDiff(table(beforeTable), table(back))}`);
      }
      const again = (await page.ev(`__stmts()`)).slice(n0).filter(s => /^(answered|requested)/.test(s.verb));
      ok(!again.length, `${part} ${walk} resume: the reload re-sent ${again.map(s => s.verb).join(', ')}`);
      const dupes = await page.ev(`__dupes()`);
      ok(!dupes.length, `${part} ${walk} resume: duplicate completed ${dupes.join(', ')}`);
      ok(await page.ev(`(goTo(SPLIT_LAST), document.getElementById(XAPI_END_BTN).disabled)`),
        `${part} ${walk} resume: the part's last button is live again after the reload (D-8)`);
      const doc = await page.ev(`__state()`);
      ok(after.ch === 'char2' && doc && doc.ui && doc.ui.character === 'char2', `${part} ${walk} resume: character ${after.ch} / document ${doc && doc.ui && doc.ui.character}`);
      const pj = JSON.stringify(doc.payload);
      ok(!/mjx-/.test(pj), `${part} ${walk} resume: typeset MathJax markup in the saved payload at ${pj.slice(Math.max(0, pj.indexOf("mjx-") - 300), pj.indexOf("mjx-") + 60)}`);
      if (walk === 'wrong' && /^0[1235]$/.test(part)) ok(pj.includes('\\\\('),`${part} wrong resume: no TeX source in the saved feedback`);
      ok(after.cs === before.cs, `${part} ${walk} resume: landed on ${after.cs}, left on ${before.cs}`);
      console.log(`${part} ${walk} resume: ${Object.keys(after.screens).length} screens restored, payload ${JSON.stringify(doc.payload).length} bytes`);
    }

    // ── retry gate across a reload: one wrong attempt, then reload ──
    if (RETRY_KEY[part]) {
      const k = RETRY_KEY[part];
      await page.ev(`_resumeReady = false; __reset()`);
      await page.open();
      const [item, qk] = await page.ev(`XAPI_QUESTIONS[${JSON.stringify(k)}]`);
      const q = qmeta[`${meta.id}${slug}-${item}/${qk}`];
      const scr = SCREEN_OF[k] ?? await page.ev(`+document.getElementById(${JSON.stringify(k)}).dataset.screen`);
      await page.ev(`goTo(${scr})`); await sleep(120);
      await page.ev(`(${ANSWER[kind(k)]})(${JSON.stringify(k)}, ${JSON.stringify({ right: false, q })})`);
      await page.ev(`__settle()`); await sleep(200);
      const btn = `document.getElementById(${JSON.stringify(k + '-action-btn')}).disabled`;
      const b1 = await page.ev(`__fpScreen(${scr})`);
      ok(await page.ev(btn), `${part} retry ${k}: check button live on the untouched wrong answer before the reload`);
      const n0 = (await page.ev(`__stmts()`)).length;
      await page.open();
      await page.ev(`__settle()`);
      ok(await page.ev(`currentScreen`) === scr, `${part} retry ${k}: landed on ${await page.ev('currentScreen')}, not ${scr}`);
      const b2 = await page.ev(`__fpScreen(${scr})`);
      const d = firstDiff(b1, b2);
      ok(!d, `${part} retry ${k}: screen differs after the reload at ${d}`);
      ok(await page.ev(btn), `${part} retry ${k}: check button live on the untouched wrong answer after the reload (D-14)`);
      ok(b2.logic && b2.logic.attempts === 1 && !b2.logic.done, `${part} retry ${k}: logic after the reload ${JSON.stringify(b2.logic)}`);
      const again = (await page.ev(`__stmts()`)).slice(n0).filter(s => /^(answered|requested)/.test(s.verb));
      ok(!again.length, `${part} retry ${k}: the reload re-sent ${again.map(s => s.verb).join(', ')}`);
      console.log(`${part} retry ${k}: attempt 1 restored, gate held`);
    }
    page.ws.close();
  }

  // ═══ write-guard (BOOT-AND-RESUME-HARDENING-2026-11-03.md §2.6) — part 01, on the stub ═══
  // The tester's scenario: progress saved on screen 25 (s31 answered), reload, then a card picked and a
  // screen changed while stage B has not run yet. The drain check below fails on the pre-fix layer
  // (the drain wrote captureUnitState() of the un-restored page over the saved payload).
  if (PARTS.includes('01')) {
    const slug = 'methodica-math-percent-03-01';
    const meta = JSON.parse(readFileSync(join(ROOT, 'metadata', slug + '.json'), 'utf8'));
    const q31 = meta.subContent.flatMap(sc => sc.questions || []).find(q => /-005\/q1$/.test(q.questionId));
    const page = await cdp(`${baseUrl}/${slug}/index.html?xapiLib=../_test/xapi-720-l.js`);
    await page.open();
    await page.ev(`_resumeReady = false; __reset()`);
    await page.open();
    await page.ev(`selectOption(document.querySelector('#s0 .option-card[data-value="char1"]'))`);
    await page.ev(`goTo(25)`); await sleep(120);
    await page.ev(`(${ANSWER.plain})('s31', ${JSON.stringify({ right: true, q: q31 })})`);
    await sleep(1000);
    const saved = await page.ev(`__state()`);
    ok(saved && saved.payload && saved.payload.currentScreen === 25, `write-guard: saved screen ${saved && saved.payload && saved.payload.currentScreen}, expected 25`);
    await page.open();
    await page.ev(`__settle()`);
    ok(await page.ev(`currentScreen`) === 25, `write-guard: the reload restored screen ${await page.ev('currentScreen')}, expected 25`);
    await page.ev(`window.__w = 0; (function () { const o = window.saveState720; window.saveState720 = function () { __w++; return o.apply(this, arguments); }; })()`);
    // the replay: stage B not yet run, a pick and a navigation
    await page.ev(`_resumeReady = false; setUnitCharacter('char2'); goTo(1); 1`);
    await sleep(1000);
    const replay = await page.ev(`(() => { _resumeReady = true; drainPendingUnitState(); return __state(); })()`);
    ok(replay.payload && replay.payload.currentScreen === 25 && replay.payload.ssm && replay.payload.ssm.s31,
      `write-guard: the drain replaced the saved payload (screen ${replay.payload && replay.payload.currentScreen}) — A1`);
    ok(replay.ui && replay.ui.character === 'char2', `write-guard: the drain did not carry the new character (${replay.ui && replay.ui.character})`);
    ok(await page.ev(`__w`) === 1, `write-guard: ${await page.ev('__w')} writes for the pick + navigation + drain, expected 1 (the drain's)`);
    await page.ev(`applyExecutionState(_unitState.payload); 1`);
    ok(await page.ev(`currentScreen`) === 25, `write-guard: the restore after the drain landed on ${await page.ev('currentScreen')}`);
    await sleep(1000);
    const later = await page.ev(`__state()`);
    ok(later.payload.currentScreen === 25 && later.payload.ssm.s31 && later.payload.ssm.s31.logic.done === true,
      `write-guard: the debounced document lost the saved payload (${JSON.stringify(later.payload && later.payload.ssm && later.payload.ssm.s31 && later.payload.ssm.s31.logic)})`);
    // markSent before stage B: memory only; the key rides the next save — A2
    const ms = await page.ev(`(() => { _resumeReady = false; __w = 0; markSent('hints', 'zz/q9');
      const r = { w: __w, mem: _unitState.hints['zz/q9'] === true }; _resumeReady = true; flushResumeSave();
      r.doc = __state().hints['zz/q9'] === true; return r; })()`);
    ok(ms.w === 0 && ms.mem && ms.doc, `write-guard: markSent before stage B ${JSON.stringify(ms)} — A2`);
    // a failed read closes every write; a later success opens them; a 404 is not a failure — A3/A4
    const fr = await page.ev(`(async () => {
      const L = window.loadState720, R = window.stateLastResult720;
      window.loadState720 = () => null;
      window.stateLastResult720 = () => ({ op: 'load', status: 500, ok: false, reason: 'http-500' });
      readUnitState(); const failed = _resumeReadFailed;
      __w = 0; const p = persistUnitState(_unitState); scheduleResumeSave(); flushResumeSave(); setUnitCharacter('char1'); goTo(26);
      await new Promise(r => setTimeout(r, 1000)); const w = __w;
      window.loadState720 = L; window.stateLastResult720 = R;
      readUnitState(); const cleared = !_resumeReadFailed;
      Object.keys(sessionStorage).filter(k => k.indexOf('__test_state') === 0).forEach(k => sessionStorage.removeItem(k));
      readUnitState(); const absent = !_resumeReadFailed;
      return { failed, p, w, cleared, absent }; })()`).catch(e => ({ error: String(e).split('\n')[0] }));
    ok(!fr.error, `write-guard: the failed-read probe threw — ${fr.error} (pre-fix layer: no _resumeReadFailed)`);
    ok(fr.failed === true, `write-guard: a failed read was not flagged — A3`);
    ok(fr.p === false && fr.w === 0, `write-guard: ${fr.w} writes after a failed read (persist returned ${fr.p}) — A4`);
    ok(fr.cleared, `write-guard: a successful read did not clear the flag`);
    ok(fr.absent, `write-guard: a 404 was taken as a failed read`);
    await page.ev(`_resumeReady = false; __reset()`);
    page.ws.close();
    console.log('write-guard: done');
  }

  // ═══ shape — the hardened layer, read from source (A1–A4, B2–B5) ═══
  {
    const r40 = readFileSync(join(ROOT, 'unit-js', '40-resume.js'), 'utf8').replace(/\r\n/g, '\n');
    const r50 = readFileSync(join(ROOT, 'unit-js', '50-loader.js'), 'utf8').replace(/\r\n/g, '\n');
    const body = (src, name) => { const i = src.indexOf('function ' + name + '('); return i < 0 ? '' : src.slice(i, src.indexOf('\n}', i)); };
    const drain = body(r40, 'drainPendingUnitState');
    ok(/persistUnitState\(_unitState\)/.test(drain) && !/captureUnitState/.test(drain.replace(/\/\*[\s\S]*?\*\//g, '')), 'shape: A1 the drain persists the document as read');
    ok(/if \(!_resumeReady\) return;\s*try \{ persistUnitState/.test(body(r40, 'markSent')), 'shape: A2 markSent persists only once _resumeReady');
    ok(/_lr\.op === 'load' && _lr\.ok === false\)[\s\S]{0,40}_resumeReadFailed = true/.test(body(r40, 'readUnitState')), 'shape: A3 a failed read sets _resumeReadFailed');
    ok(/if \(_resumeReadFailed\)/.test(body(r40, 'persistUnitState')), 'shape: A4 persistUnitState refuses after a failed read');
    ok(/_resumeReadFailed\) return;/.test(body(r40, 'scheduleResumeSave')) && /_resumeReadFailed\) return;/.test(body(r40, 'flushResumeSave')), 'shape: A4 schedule/flush bail after a failed read');
    ok(/if \(!_payload && !_resumeReadFailed\) dropBootCover\(\);/.test(r50), 'shape: B2 stage A keeps the cover on a failed read');
    ok(/if \(_resumeReadFailed\) \{\s*_saved = readUnitState\(\);/.test(r50), 'shape: B3 stage B retries the read once');
    ok(/_resumeReady = !_resumeReadFailed;/.test(r50), 'shape: B4 the stage-B catch keeps a failed session closed');
    ok(/if \(!_resumed && currentScreen !== 0\) \{ try \{ scheduleResumeSave\(\); \}/.test(r50), 'shape: B5 a screen reached during the window is saved');
    const leaving = body(r40, 'flushResumeSaveLeaving');
    ok(/_resumeReadFailed\) return;/.test(leaving) && /typeof window\.saveState720OnLeave === 'function'/.test(leaving), 'shape: the leave flush has the write guards and typeof-guards saveState720OnLeave');
    ok(/flushResumeSaveLeaving\(\)/.test(body(r40, 'flushResumeSaveOnLeave')), 'shape: the leave handler goes through flushResumeSaveLeaving');
  }

  // ═══ leave — the leave save goes through xapi-720-l.js's saveState720OnLeave (2026-11-04) ═══
  // A screen change and an immediate reload (inside the 800 ms debounce): the leave handler's write
  // must carry the new screen — through saveState720OnLeave on -l, through saveState720 on -k (the
  // unit typeof-guards the new function; that is the rollback path). The Chrome refusal itself
  // cannot happen on sessionStorage; it is tested live against Kata.
  if (PARTS.includes('01')) {
    for (const lib of ['l', 'k']) {
      const page = await cdp(`${baseUrl}/methodica-math-percent-03-01/index.html?xapiLib=../_test/xapi-720-${lib}.js`);
      await page.open();
      await page.ev(`_resumeReady = false; __reset()`);
      await page.open();
      await page.ev(`selectOption(document.querySelector('#s0 .option-card[data-value="char1"]'))`);
      await page.ev(`goTo(22)`); await sleep(1200);          // this debounced write lands…
      await page.ev(`goTo(23); 1`);                          // …this one is still pending at the reload
      await page.open();
      await page.ev(`__settle()`);
      const cs = await page.ev(`currentScreen`);
      ok(cs === 23, `leave -${lib}: a reload right after goTo(23) landed on ${cs}`);
      const lw = await page.ev(`typeof __leaveWrites === 'function' ? __leaveWrites() : null`);
      if (lib === 'l') ok(lw && lw.length >= 1 && lw[lw.length - 1].cs === 23 && lw[lw.length - 1].ok, `leave -l: the leave write did not go through saveState720OnLeave (${JSON.stringify(lw)})`);
      else ok(lw === null, `leave -k: the -k stub has a saveState720OnLeave`);
      const ex = page.logs.filter(l => l.type === 'exception');
      ok(!ex.length, `leave -${lib}: exception ${ex.map(l => l.text).join(' | ')}`);
      await page.ev(`_resumeReady = false; __reset()`);
      page.ws.close();
    }
    console.log('leave: done');
  }

  // ═══ boot markup, per part (C1–C3, C5) ═══
  {
    const CDN = 'https://lomdot.education.gov.il/metodica/720active/common/';
    const ident = readFileSync(join(ROOT, 'unit-js', '10-identity.js'), 'utf8');
    const loader = readFileSync(join(ROOT, 'unit-js', '50-loader.js'), 'utf8');
    const on = /var RESUME_ENABLED = true;/.test(ident);
    const lm = /RESUME_ENABLED \? 'xapi-720-([a-z])\.js' : 'xapi-720-([a-z])\.js'/.exec(loader);
    const letter = lm ? (on ? lm[1] : lm[2]) : '?';
    // the silent failure of a letter change: XAPI_USING_G's character class must list the loaded letter
    const ug = /XAPI_USING_G = \/xapi-720-\[([a-z]+)\]/.exec(loader);
    ok(ug && ug[1].includes(letter), `boot: XAPI_USING_G regex [${ug && ug[1]}] does not list the loaded library -${letter}`);
    const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const vers = {};
    for (const part of ['01', '02', '03', '04', '05', '06', '07']) {
      const html = readFileSync(join(ROOT, `methodica-math-percent-03-${part}`, 'index.html'), 'utf8');
      const nets = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]).filter(t => /boot-cover/.test(t));
      ok(nets.length === 1, `boot ${part}: ${nets.length} inline cover nets`);
      ok(/<div id="boot-cover"/.test(html) && html.indexOf('id="boot-cover"') < html.indexOf('<div id="app">'), `boot ${part}: #boot-cover missing or inside #app`);
      const net = nets[0] || '';
      ok(net.includes('if (/[?&]registration=/.test(location.search)) window.__resumeInFlight = true;') && /< 6000\)/.test(net) && /, 800\)/.test(net),
        `boot ${part}: the inline net does not raise __resumeInFlight on registration= (C1)`);
      for (const [search, want] of [['?registration=abc', true], ['?xapiLib=x', undefined]]) {
        const win = {};
        runInNewContext(net, { window: win, location: { search }, document: { getElementById: () => null }, setTimeout: () => 0, Date });
        ok(win.__resumeInFlight === want, `boot ${part}: inline flag with ${search} is ${win.__resumeInFlight}`);
      }
      const head = html.slice(0, html.indexOf('</head>'));
      for (const f of ['xapiwrapper.min.js', `xapi-720-${letter}.js`]) {
        const tag = (head.match(new RegExp('<link[^>]*href="' + esc(CDN + f) + '"[^>]*>')) || [])[0];
        ok(tag && /rel="preload"/.test(tag) && /as="script"/.test(tag) && !/crossorigin/.test(tag), `boot ${part}: preload of ${f} missing or with crossorigin (C2)`);
      }
      ok((head.match(/xapi-720-[a-z]\.js/g) || []).every(x => x === `xapi-720-${letter}.js`), `boot ${part}: a preload for another library letter than -${letter}`);
      ok(head.includes('<link rel="preconnect" href="https://kata.cet.ac.il">'), `boot ${part}: no preconnect to Kata`);
      const land = /<section class="screen active"[^>]*>/.exec(html);
      const landEnd = html.indexOf('</section>', land.index);
      for (const m of html.matchAll(/<img\b[^>]*>/g)) {
        const src = (/src="([^"]+)"/.exec(m[0]) || [])[1] || '';
        const inLand = m.index > land.index && m.index < landEnd;
        if (inLand) ok(!/loading="lazy"/.test(m[0]), `boot ${part}: landing-screen image ${src} is lazy`);
        else if (src && !/\.svg$/.test(src)) ok(/loading="lazy"/.test(m[0]), `boot ${part}: off-screen image ${src} is not lazy (C3)`);
      }
      for (const m of html.matchAll(/src="\.\.\/unit-js\/([\w-]+\.js)\?v=([^"]+)"/g)) (vers[m[1]] = vers[m[1]] || new Set()).add(m[2]);
    }
    Object.entries(vers).forEach(([f, s]) => ok(s.size === 1, `boot: ${f} has ${s.size} different ?v= across parts (C5)`));
    console.log(`boot: 7 parts, library -${letter}`);
  }
} finally {
  chrome.kill();
}
console.log(`\n${checks - fails}/${checks} checks passed${fails ? ` — ${fails} FAILED` : ''}`);
process.exit(fails ? 1 : 0);
