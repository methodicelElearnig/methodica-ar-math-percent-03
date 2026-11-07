'use strict';
/* ═══════════════════ xAPI (720) — identity ═══════════════════
   Shared by the seven parts of methodica-math-percent-03. Definition-only.
   methodica-math-percent-03 (2026-11-03): from methodica-science-mass-density-01/unit-js/10-identity.js
   (2026-11-02), values replaced. Procedure: 2026/Documentation/reporting-and-resume/ADDING-REPORTING-AND-RESUME.md.

   Every id the lomda reports is built from these values and must match metadata/*.json byte for byte,
   including the trailing slash this catalogue carries on component and item ids (not on questions,
   not on the bare-slug unit id). _test/verify-report.js asserts it, and 50-loader.js compares
   XAPI_COMP_ID with window.METADATA.id on every load. Lowercase everywhere. */
var XAPI_ID_PREFIX = 'https://lomdot.education.gov.il/metodica/720active/math/percent/03/';

/* The unit id: a bare SLUG (MOE v2.5 §2.7), equal to metadata/methodica-math-percent-03_unit.json `id`
   and to every component's `learningUnitId`. Never the prefix alone ("03" would collide in Kata). */
window.XAPI_UNIT_ID = 'methodica-math-percent-03';

/* The last segment of a canonical id — the short slug the issue-report form records. */
function shortId(u) { return String(u || '').replace(/\/+$/, '').split('/').pop(); }

/* Resume (Kata xAPI State API). ON since 2026-11-04, built hardened (docs-and-tools/REPORTING-RESUME.md).
   ⚠️ The flag also picks the library: 50-loader.js loads xapi-720-l.js when on, xapi-720-i.js when off —
   and every part's <head> preloads that exact URL (C2), so the two change together. */
var RESUME_ENABLED = true;
