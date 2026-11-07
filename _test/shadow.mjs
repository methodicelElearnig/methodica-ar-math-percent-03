// Shadow deployment for the live tests: the DEPLOYED pages, real Kata link, real token and LRS — but
// the browser is served this working tree's text files (and, optionally, a local library build) in
// place of the CDN copies, through DevTools request interception (Fetch domain). Nothing is uploaded.
//
//   const sh = shadow(ROOT, { lib: '<path to 720-common-lib/xapi-720-l.js>' });
//   await sh.install(send);            // after Runtime/Page enable, before navigating
//   onEvent: if (m.method === 'Fetch.requestPaused') sh.paused(m.params, send);
//
// What is swapped: every .html/.js/.css/.json under the unit folder on the CDN whose file exists in
// this tree (media is identical and stays on the CDN), and the library letter named by `lib`.
// sh.served lists what was actually swapped, so a run can prove the shadow was in effect.
import { readFileSync, existsSync } from 'node:fs';
import { join, basename } from 'node:path';

const PROD = 'https://lomdot.education.gov.il/metodica/720/math/percent/03/';
const COMMON = 'https://lomdot.education.gov.il/metodica/720active/common/';
const TYPES = { html: 'text/html; charset=utf-8', js: 'application/javascript; charset=utf-8', css: 'text/css; charset=utf-8', json: 'application/json; charset=utf-8' };

export function shadow(root, { lib } = {}) {
  const served = new Set();
  function local(url) {
    const u = url.split('#')[0].split('?')[0];
    if (lib && u === COMMON + basename(lib)) return lib;
    if (!u.startsWith(PROD)) return null;
    const rel = decodeURIComponent(u.slice(PROD.length));
    if (!/\.(html|js|css|json)$/.test(rel) || rel.includes('..')) return null;
    const p = join(root, rel);
    return existsSync(p) ? p : null;
  }
  return {
    served,
    async install(send) {
      await send('Fetch.enable', { patterns: [
        { urlPattern: PROD + '*', requestStage: 'Request' },
        { urlPattern: COMMON + '*', requestStage: 'Request' }] });
    },
    async paused(p, send) {
      const file = local(p.request.url);
      if (!file) return send('Fetch.continueRequest', { requestId: p.requestId });
      served.add(file === lib ? 'lib:' + basename(lib) : file.slice(root.length + 1).replace(/\\/g, '/'));
      const ext = file.split('.').pop();
      return send('Fetch.fulfillRequest', { requestId: p.requestId, responseCode: 200,
        responseHeaders: [{ name: 'Content-Type', value: TYPES[ext] }, { name: 'Cache-Control', value: 'no-store' },
          { name: 'Access-Control-Allow-Origin', value: '*' }],
        body: readFileSync(file).toString('base64') });
    }
  };
}
