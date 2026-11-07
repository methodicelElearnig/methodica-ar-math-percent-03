// Shared by verify-report.mjs (the stub library) and live-kata.mjs (the real one on Kata):
// how each question is answered in the page, the resume fingerprint, and Kata's right-answer pattern.

// ── the answer scripts: how each question is answered on screen (runs in the page) ──
// step(n) = goTo; ans.* fill / pick by the catalogue value (right) or a wrong one, then submit.
export const DRIVER = String.raw`
window.__drv = (function () {
  const fire = (el, t) => el.dispatchEvent(new Event(t, { bubbles: true }));
  const type = (id, v) => { const el = document.getElementById(id); el.value = v; fire(el, 'input'); fire(el, 'change'); };
  const norm = s => String(s).replace(/\s+/g, ' ').trim();
  // Options are found by the label the reporting layer reads (a <br> is a space), exact match.
  const optIdx = (sel, text) => { const els = [...document.querySelectorAll(sel)];
    const i = els.findIndex(b => norm(xapiOptText(b)) === norm(text));
    return i < 0 ? i : +(els[i].dataset.index ?? i); };
  const pickSelect = (el, text) => { const i = [...el.options].findIndex(o => norm(o.text) === norm(text)); el.selectedIndex = i < 0 ? 1 : i; fire(el, 'change'); };
  const wrongSelect = (el, right) => { const i = [...el.options].findIndex((o, k) => k > 0 && norm(o.text) !== norm(right)); el.selectedIndex = i; fire(el, 'change'); };
  return { fire, type, norm, optIdx, pickSelect, wrongSelect };
})();`;

// Per question key: how to answer. v = {right: bool, q: metadata question}. Return nothing.
export const ANSWER = {
  vq: `(id, v) => {
    const cfg = VQ[id], q = v.q, d = __drv;
    if (cfg.type === 'choice') {
      const target = v.right ? q.correctAnswers[0] : q.answers.find(a => !q.correctAnswers.includes(a));
      vqSelect(id, d.optIdx('#' + id + ' .vq-opt', target));
    } else if (cfg.type === 'multi') {
      const want = v.right ? q.correctAnswers : [q.answers.find(a => !q.correctAnswers.includes(a))];
      want.forEach(t => vqMultiToggle(id, d.optIdx('#' + id + ' .vq-opt', t)));
    } else if (cfg.check) {
      const fields = [...document.querySelectorAll('#' + id + ' .s31-answer-box, #' + id + ' .vq-select')];
      fields.forEach((el, i) => {
        const r = q.correctAnswers[i].response;
        if (el.tagName === 'SELECT') { v.right ? d.pickSelect(el, r) : d.wrongSelect(el, r); }
        else { el.value = v.right ? r : '1'; d.fire(el, 'input'); }
        if (typeof vqEnable === 'function') vqEnable(id, el);
      });
    } else {
      d.type(id + '-answer', v.right ? String(q.correctAnswers[0]) : '1');
    }
    vqSubmit(id);
  }`,
  s2: `(k, v) => { const d = __drv; const t = v.right ? v.q.correctAnswers[0] : v.q.answers.find(a => !v.q.correctAnswers.includes(a));
    s2SelectOption(document.querySelectorAll('#s2 .s2-option')[d.optIdx('#s2 .s2-option', t)]); advanceFromS2(); }`,
  s7a: `(k, v) => { const d = __drv, c = v.q.correctAnswers, by = n => c.find(x => x.stepId === n).response;
    d.type('s7-val-known', v.right ? by('זמן בדקות') : '1'); d.type('s7-pct-partial', v.right ? by('אחוז חלקי') : '1'); d.type('s7-pct-whole', v.right ? by('אחוז שלם') : '1');
    s7Step0Submit(); }`,
  s7b: `(k, v) => { __drv.type('s7-formula-answer', v.right ? String(v.q.correctAnswers[0]) : '1'); s7Step1Submit(); }`,
  plain: `(k, v) => { __drv.type(k + '-answer', v.right ? String(v.q.correctAnswers[0]) : '1'); window[k + 'Submit'](); }`,
  s37a: `(k, v) => { __drv.type('s37a-answer', v.right ? String(v.q.correctAnswers[0]) : '1'); s37Submit(); }`,
  s37b: `(k, v) => { __drv.type('s37b-answer', v.right ? String(v.q.correctAnswers[0]) : '1'); s37Submit(); }`,
  s38: `(k, v) => { const c = v.q.correctAnswers; __drv.type('s38-answer1', v.right ? c[0].response : '1'); __drv.type('s38-answer2', v.right ? c[1].response : '1'); s38Submit(); }`,
  s39: `(k, v) => { const d = __drv, q = v.q; const t = v.right ? q.correctAnswers[0] : q.answers.find(a => !q.correctAnswers.includes(a));
    s39Select(d.optIdx('#' + S39_SECTIONS[s39State.section].secElId + ' .s39-opt', t)); s39Submit(); }`,
  s47: `(k, v) => { const d = __drv, q = v.q, part = k.slice(3), sec = S47_SECTIONS[part];
    if (sec.type === 'choice') { const t = v.right ? q.correctAnswers[0] : q.answers.find(a => !q.correctAnswers.includes(a));
      s47Select(part, d.optIdx('#s47-sec-' + part + ' .vq-opt', t)); }
    else { d.type('s47' + part + '-answer', v.right ? String(q.correctAnswers[0]) : '1'); s47Input(part); }
    s47Submit(part); }`
};
export const HINT = {
  vq: `(id) => vqHint(id)`, s7a: `() => s7ShowHint()`, s7b: `() => s7ShowHint()`, plain: `(k) => window[k + 'ShowHint']()`,
  s37a: `() => s37ShowHint()`, s37b: `() => s37ShowHint()`, s38: `() => s38ShowHint()`, s39: `() => s39ShowHint()`, s47: `(k) => s47ShowHint(k.slice(3))`
};
export const kind = k => /^s(31|32|34|35|36)$/.test(k) ? 'plain' : /^s39/.test(k) ? 's39' : /^s47/.test(k) ? 's47' : ANSWER[k] ? k : 'vq';
// The screen each question is on, and the click(s) that leave a resolved question (to the next one / the part's end).
export const SCREEN_OF = { s2: 2, s7a: 8, s7b: 8, s31: 25, s32: 26, s34: 28, s35: 29, s36: 30, s37a: 31, s37b: 31, s38: 32, s39a: 33, s39b: 33, s39c: 33, s47a: 41, s47b: 41, s47c: 41 };
export const ADVANCE = { s2: 'advanceFromS2()', s7a: "document.getElementById('s7-action-btn').click()", s37a: 's37Submit()', s39a: 's39Submit()', s39b: 's39Submit()', s47a: "s47Submit('a')", s47b: "s47Submit('b')" };

// ── resume fingerprint (runs in the page): every screen of the part, visited through goTo ──
// Interaction elements as screenStateMemory sees them, feedback as text without the math plus the
// number of typeset formulas (waits for MathJax), the screen's logic object, and the part-wide state.
export const FP_JS = String.raw`
window.__fpScreen = function (n) {
  const el = document.querySelector('.screen[data-screen="' + n + '"]');
  const noMath = e => { const c = e.cloneNode(true); c.querySelectorAll('mjx-container').forEach(m => m.remove());
    return c.textContent.replace(/\\\(.*?\\\)|\\\[.*?\\\]|\$\$.*?\$\$/gs, '').replace(/\s+/g, ' ').trim(); };
  // Hidden content counts only as hidden: whatever reveals it repaints it (a feedback popup is
  // rebuilt on submit; s7's table step and its feedback by goBack → s7RestoreTableStep, which the
  // round trip checks separately).
  const dom = [...el.querySelectorAll(SSM_SEL)].filter(e => !(e.parentElement && e.parentElement.closest(SSM_FB_SEL))).map(e => {
    if (e.closest('[hidden]')) return { k: e.id || e.tagName, hidden: true };
    const r = { k: e.id || e.tagName, c: e.getAttribute('class'), h: e.hidden, d: !!e.disabled };
    if ('value' in e && e.tagName !== 'BUTTON') r.v = e.value;
    if (e.tagName === 'SELECT') r.s = e.selectedIndex;
    // top-level formulas: a double typeset nests an invisible copy in the screen-reader markup
    if (e.matches(SSM_FB_SEL)) { r.t = noMath(e); r.m = [...e.querySelectorAll('mjx-container')].filter(c => !c.parentElement.closest('mjx-container')).length; }
    if (e.matches(SSM_TEXT_SEL)) r.x = e.textContent.trim();
    return r; });
  const lg = ssmLogicTarget(el.id);
  // saved feedback markup in a logic object (s37/s39/s47 fbHtml) compared as its TeX source: the screen
  // re-typesets it when it puts it back (ssmTypesetIfRaw)
  return { id: el.id, dom, logic: lg ? JSON.parse(JSON.stringify(ssmTexDeep(lg))) : null };
};
window.__settle = async function () {
  await new Promise(r => setTimeout(r, 60));
  if (window.MathJax && MathJax.startup && MathJax.startup.promise) { try { await MathJax.startup.promise; } catch (e) {} }
  await new Promise(r => setTimeout(r, 40));
};
window.__fp = async function () {
  const start = currentScreen, out = { screens: {} };
  const ids = [...document.querySelectorAll('.screen[data-screen]')].map(s => +s.dataset.screen).sort((a, b) => a - b);
  for (const n of ids) { goTo(n); await __settle(); out.screens[n] = __fpScreen(n); }
  goTo(start); await __settle();
  out.cs = start;
  out.ch = window.lomdaState.selectedCharacter;
  out.pr = JSON.parse(JSON.stringify(window.lomdaState.practiceResults));
  out.gp = JSON.parse(JSON.stringify(window.lomdaState.guidedPractice));
  out.cp = JSON.parse(JSON.stringify(window.lomdaState.carouselProgress || null));
  out.q = JSON.parse(JSON.stringify(XAPI_Q_RESULTS));
  out.fbt = Object.fromEntries(Object.entries(fbtRegistry).map(([k, e]) => [k, e.view]));
  return out;
};`;

// The first difference between two fingerprints, as a readable path (null when equal).
export function firstDiff(a, b, path = '') {
  if (JSON.stringify(a) === JSON.stringify(b)) return null;
  if (a && b && typeof a === 'object' && typeof b === 'object') {
    for (const k of new Set([...Object.keys(a), ...Object.keys(b)])) {
      const d = firstDiff(a[k], b[k], path + '/' + (Array.isArray(a) && a[k] && a[k].k ? a[k].k : k));
      if (d) return d;
    }
  }
  return `${path}: ${JSON.stringify(a)?.slice(0, 140)} != ${JSON.stringify(b)?.slice(0, 140)}`;
}

// The question per part whose single wrong attempt is reloaded (two attempts allowed).
export const RETRY_KEY = { '01': 's31', '02': 's34', '03': 's43', '05': 's59', '06': 's68', '07': 's75' };   // s74 has one attempt

// Kata's correct pattern for a question (what a right answer must equal byte for byte).
export function pattern(q) {
  const ca = q.correctAnswers || [];
  switch (q.questionType) {
    case 'choice': return q.answers.filter(a => ca.includes(a)).join('[,]');
    case 'performance': return ca.map(c => c.stepId + '[.]' + c.response).join('[,]');
    case 'numeric': return String(Number(ca[0]));
    default: return String(ca[0]);
  }
}
