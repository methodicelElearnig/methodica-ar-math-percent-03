'use strict';
/* ═══════════════════ BOOT ═══════════════════
   The only file in unit-js/ with top-level side effects, and the LAST script tag of every part, so
   every function it calls already exists. A separate tag on purpose: a throw in the lesson engine's
   own top-level code cannot stop reporting from starting (science units learned this the hard way).

   Order is load-bearing (from methodica-science-mass-density-01/unit-js/90-boot.js):
     1. initResumeResetHatch()   — strips ?resetState before anyone reads the query or the document;
     2. initResumeLeaveHandlers() — the pagehide/visibility net; inert while RESUME_ENABLED is false;
     3. bootXAPI() last          — loads the two CDN scripts and reports the component 'initialized'.
   The issue-report modal is wired by main.js itself (its own markup); there is no cross-part Back to
   hide (the engine's goBack never leaves the part's range). Each step is isolated. */
(function boot() {
  try { initResumeResetHatch(); }    catch (e) { console.error('[boot] initResumeResetHatch', e); }
  try { initResumeLeaveHandlers(); } catch (e) { console.error('[boot] initResumeLeaveHandlers', e); }
  bootXAPI();
})();
