// Visual + text snapshot of every screen of every part, for the consolidation
// regression gate (plan Phase 1c). Drives the installed Chrome over the DevTools
// protocol with Node's built-in WebSocket — no npm dependency.
//
//   node _test/visual-snapshot.mjs <baseUrl> <outDir> [parts=01,02,...] [WxH=1280x710]
//
// <baseUrl> serves the repo root (e.g. `python -m http.server 8803 --bind 127.0.0.1`).
// Writes <outDir>/<part>/<screen>.png, <outDir>/<part>/text.json (innerText of the
// active screen per data-screen) and <outDir>/<part>/console.json (errors + warnings).
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, mkdtempSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

const [baseUrl, outDir, partsArg, sizeArg] = process.argv.slice(2);
if (!baseUrl || !outDir) { console.error('usage: visual-snapshot.mjs <baseUrl> <outDir> [parts] [WxH]'); process.exit(2); }
const PARTS = (partsArg || '01,02,03,04,05,06,07').split(',');
const [W, H] = (sizeArg || '1280x710').split('x').map(Number);
const CHROME = process.env.CHROME || 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333 + Math.floor(Math.random() * 500);
const sleep = ms => new Promise(r => setTimeout(r, ms));

const profile = mkdtempSync(join(tmpdir(), 'p03-snap-'));
const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${profile}`,
  '--no-first-run', '--no-default-browser-check', '--autoplay-policy=no-user-gesture-required',
  '--hide-scrollbars', '--force-device-scale-factor=1', 'about:blank'], { stdio: 'ignore' });

async function json(path) {
  for (let i = 0; i < 50; i++) {
    try { const r = await fetch(`http://127.0.0.1:${PORT}${path}`, { method: path.startsWith('/json/new') ? 'PUT' : 'GET' }); return await r.json(); }
    catch { await sleep(200); }
  }
  throw new Error('chrome did not start');
}

function connect(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0; const pending = new Map(); const listeners = [];
  ws.onmessage = ev => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(m.error.message)) : p.res(m.result); }
    else listeners.forEach(f => f(m));
  };
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  return new Promise(r => { ws.onopen = () => r({ send, on: f => listeners.push(f), close: () => ws.close() }); });
}

const FREEZE = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}video{visibility:hidden!important}`;

// What is compared besides pixels: the active screen, its text, and the state
// classes / values / disabled flags of its controls.
const STATE = `(()=>{const a=document.querySelector('section[data-screen].active');if(!a)return {active:null};
  const ctl=[...a.querySelectorAll('input,select,button,.vq-opt,.option-card,[role=radio]')].filter(e=>e.offsetParent!==null)
    .map(e=>[e.id||e.className,e.className,e.value===undefined?'':e.value,!!e.disabled,e.hidden].join('|'));
  return {active:+a.dataset.screen,text:a.innerText.replace(/\\s+/g,' ').trim(),ctl};})()`;

// One step of the generic answer walk, run in the page.
const ACT = `function(step){
  const a=document.querySelector('section[data-screen].active'); if(!a) return;
  const vis=e=>e.offsetParent!==null&&!e.disabled&&!e.hidden;
  const fire=(e,t)=>e.dispatchEvent(new Event(t,{bubbles:true}));
  if(step==='fill1'||step==='fill2'){
    const v=step==='fill1'?'1':'2';
    a.querySelectorAll('input[type=text],input:not([type]),input[type=number]').forEach(i=>{if(vis(i)){i.value=v;fire(i,'input');fire(i,'change');}});
    a.querySelectorAll('select').forEach(s=>{if(!s.disabled&&s.options.length>1){s.selectedIndex=step==='fill1'?1:Math.min(2,s.options.length-1);fire(s,'change');}});
    const opts=[...a.querySelectorAll('.vq-opt,.scq-option,.option-card,[role=radio],.s39-opt,.s47-opt')].filter(vis);
    const o=opts[step==='fill1'?0:Math.min(1,opts.length-1)]; if(o) o.click();
  } else if(step==='check'){
    const b=[...a.querySelectorAll('button')].filter(vis).find(b=>/action-btn|submit|check/i.test(b.id+' '+(b.getAttribute('onclick')||'')));
    if(b) b.click();
  } else if(step==='hint'){
    const b=[...a.querySelectorAll('button')].filter(vis).find(b=>/hint/i.test(b.id+' '+b.className+' '+(b.getAttribute('onclick')||'')));
    if(b) b.click();
  } else if(step==='toggle'){
    const b=[...a.querySelectorAll('button')].filter(vis).find(b=>/fbtToggle/.test(b.getAttribute('onclick')||''));
    if(b) b.click();
  }
}`;

// MEASURE mode: the box every visible image / video is drawn in, in 1280x710
// canvas px (object-fit applied: 'contain' lists the pixels the image occupies,
// 'cover' the frame), keyed by the file's path from the repo root.
const BOXES = `(()=>{
  const app=document.getElementById('app')||document.body;
  const k=app.getBoundingClientRect().width/(app.offsetWidth||1)||1;
  const out=[];
  const add=(url,w,h)=>{ if(!url||url.startsWith('data:')||w<2||h<2) return;
    const u=new URL(url,location.href); out.push([decodeURIComponent(u.pathname),Math.round(w),Math.round(h)]); };
  document.querySelectorAll('img,video').forEach(e=>{
    if(e.offsetParent===null && getComputedStyle(e).position!=='fixed') return;
    const r=e.getBoundingClientRect(); if(!r.width) return;
    const bw=r.width/k, bh=r.height/k;
    const url=e.tagName==='IMG'?(e.currentSrc||e.src):(e.currentSrc||e.src||(e.querySelector('source')||{}).src);
    const nw=e.naturalWidth||e.videoWidth, nh=e.naturalHeight||e.videoHeight;
    const fit=getComputedStyle(e).objectFit;
    if(fit==='contain'&&nw&&nh){ const s=Math.min(bw/nw,bh/nh); add(url,nw*s,nh*s); }
    else add(url,bw,bh);
    if(e.tagName==='VIDEO'&&e.poster) add(e.poster,bw,bh);
  });
  document.querySelectorAll('*').forEach(e=>{ const bg=getComputedStyle(e).backgroundImage;
    if(!bg||bg==='none'||e.offsetParent===null) return;
    for(const m of bg.matchAll(/url\\("?([^")]+)"?\\)/g)){ const r=e.getBoundingClientRect(); add(m[1],r.width/k,r.height/k); } });
  return out; })()`;

async function evaluate(s, expr) {
  const r = await s.send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
  return r.result.value;
}

try {
  await json('/json/version');
  for (const part of PARTS) {
    const dir = join(outDir, part); mkdirSync(dir, { recursive: true });
    const tgt = await json('/json/new?about:blank');
    const s = await connect(tgt.webSocketDebuggerUrl);
    const logs = [];
    s.on(m => {
      if (m.method === 'Runtime.exceptionThrown') logs.push({ type: 'exception', text: m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text });
      if (m.method === 'Runtime.consoleAPICalled' && /error|warn/.test(m.params.type)) logs.push({ type: m.params.type, text: m.params.args.map(a => a.value ?? a.description).join(' ') });
      if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') logs.push({ type: 'log', text: m.params.entry.text + ' ' + (m.params.entry.url || '') });
    });
    await s.send('Runtime.enable'); await s.send('Page.enable'); await s.send('Log.enable');
    await s.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: W < 768 });
    await s.send('Page.navigate', { url: `${baseUrl.replace(/\/$/, '')}/methodica-math-percent-03-${part}/index.html` });
    for (let i = 0; i < 100; i++) { await sleep(150); try { if (await evaluate(s, 'document.readyState') === 'complete') break; } catch {} }
    await sleep(1500);
    await evaluate(s, `(()=>{const st=document.createElement('style');st.textContent=${JSON.stringify(FREEZE)};document.head.appendChild(st);})()`);
    if (process.env.CHAR) await evaluate(s, `window.lomdaState.selectedCharacter=${JSON.stringify(process.env.CHAR)}`);
    const screens = await evaluate(s, `[...document.querySelectorAll('section[data-screen]')].map(e=>+e.dataset.screen)`);
    const text = {};
    const boxes = [];
    const measure = async () => {
      if (!process.env.MEASURE) return;
      await sleep(400);   // let lazy media decode so natural sizes are known
      boxes.push(...await evaluate(s, BOXES));
      const openers = await evaluate(s, `[...document.querySelectorAll('section[data-screen].active [data-zoom-src]')].filter(e=>e.offsetParent!==null).length`);
      for (let i = 0; i < openers; i++) {
        await evaluate(s, `[...document.querySelectorAll('section[data-screen].active [data-zoom-src]')].filter(e=>e.offsetParent!==null)[${i}].click()`);
        await sleep(600);
        boxes.push(...await evaluate(s, BOXES));
        await evaluate(s, `typeof closeImgZoomModal==='function'?closeImgZoomModal():document.dispatchEvent(new KeyboardEvent('keydown',{key:'Escape',bubbles:true}))`);
        await sleep(200);
      }
    };
    for (const n of screens) {
      await evaluate(s, `goTo(${n})`);
      await sleep(700);
      await evaluate(s, `(window.MathJax&&MathJax.startup&&MathJax.startup.promise)?MathJax.startup.promise.then(()=>MathJax.typesetPromise&&MathJax.typesetPromise()).catch(()=>{}):null`);
      await evaluate(s, `document.fonts.ready.then(()=>1)`);
      await sleep(250);
      const shot = await s.send('Page.captureScreenshot', { format: 'png' });
      writeFileSync(join(dir, `${String(n).padStart(2, '0')}.png`), Buffer.from(shot.data, 'base64'));
      text[n] = await evaluate(s, STATE);
      await measure();
      if (process.env.INTERACT) {
        // Generic answer walk: fill every field / pick an option, check; a second
        // attempt with other values; open the hint; flip the answer toggle.
        const steps = ['fill1', 'check', 'fill2', 'check', 'hint', 'toggle'];
        for (let i = 0; i < steps.length; i++) {
          await evaluate(s, `(${ACT})(${JSON.stringify(steps[i])})`);
          await sleep(450);
          const shot2 = await s.send('Page.captureScreenshot', { format: 'png' });
          const tag = `${String(n).padStart(2, '0')}-${i + 1}${steps[i]}`;
          writeFileSync(join(dir, `${tag}.png`), Buffer.from(shot2.data, 'base64'));
          text[tag] = await evaluate(s, STATE);
          await measure();
        }
      }
    }
    writeFileSync(join(dir, 'text.json'), JSON.stringify(text, null, 1));
    writeFileSync(join(dir, 'console.json'), JSON.stringify(logs, null, 1));
    if (process.env.MEASURE) writeFileSync(join(dir, 'boxes.json'), JSON.stringify(boxes));
    console.log(`${part}: ${screens.length} screens, ${logs.length} console issues`);
    s.close();
  }
} finally {
  chrome.kill();
}
