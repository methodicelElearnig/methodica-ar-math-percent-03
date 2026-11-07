'use strict';
/* ═══════════════════ Issue report ("מצאתם בעיה?") — the sender ═══════════════════
   Shared by the seven parts. Definition-only.

   This unit keeps its own modal (markup in every index.html, behaviour in main.js: the custom type
   listbox, validation, focus handling). Only the submission is the 720 standard: the same shared
   Google Form, field mapping and payload as every live unit (guide §7.2; source:
   methodica-science-mass-density-01/unit-js/25-report.js, submitReport). Until 2026-11-03 this unit's
   submitReport() only did console.log.

   The form is ONE sheet for all of 720 (owner decision 2026-08-13). The unit and component slugs come
   from window.METADATA, so every row names its unit; reading the sheet means filtering on them. */
var REPORT_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSfFq5XFtH1pPpLgV5RWT4m3NanYPW5GKremqTvkp6zKjEGqcw/formResponse';

/* entry.* keys of that shared form — identical in every unit; changing one breaks all of them. */
var REPORT_FIELDS = {
  dateYear:   'entry.301404029_year',
  dateMonth:  'entry.301404029_month',
  dateDay:    'entry.301404029_day',
  timeHour:   'entry.2066097581_hour',
  timeMinute: 'entry.2066097581_minute',
  unitSlug:   'entry.1933069481',
  compSlug:   'entry.2070680092',
  itemId:     'entry.1555704258',
  itemPage:   'entry.1671046914',
  problemType:'entry.1179822443',
  freeText:   'entry.806447525'
};

/* Sends one report. typeLabel is the readable label the learner picked (the sheet records the label,
   not an internal key); text is the free text. The item and page come from the same screen map the
   xAPI layer uses, so a report and a statement always point at the same place; an unmapped screen
   reports its raw data-screen number. Fire-and-forget: Google answers no-cors with an opaque response,
   and a failure must never block the learner. */
function sendIssueReport(typeLabel, text) {
  var now  = new Date();
  var meta = window.METADATA || {};
  var body = new URLSearchParams();
  body.append(REPORT_FIELDS.dateYear,   now.getFullYear());
  body.append(REPORT_FIELDS.dateMonth,  now.getMonth() + 1);
  body.append(REPORT_FIELDS.dateDay,    now.getDate());
  body.append(REPORT_FIELDS.timeHour,   now.getHours());
  body.append(REPORT_FIELDS.timeMinute, now.getMinutes());
  body.append(REPORT_FIELDS.unitSlug,   shortId(meta.learningUnitId || window.XAPI_UNIT_ID));
  body.append(REPORT_FIELDS.compSlug,   shortId(meta.id || (typeof XAPI_COMP_SLUG !== 'undefined' ? XAPI_COMP_SLUG : '')));
  var map = (typeof SCREEN_TO_SUBCONTENT !== 'undefined') ? SCREEN_TO_SUBCONTENT : null;
  var entry = map ? map[currentScreen] : null;
  body.append(REPORT_FIELDS.itemId,      entry && typeof XAPI_COMP_SLUG !== 'undefined' ? XAPI_COMP_SLUG + '-' + entry[0] : '');
  body.append(REPORT_FIELDS.itemPage,    entry ? String(entry[1]) : String(currentScreen));
  body.append(REPORT_FIELDS.problemType, typeLabel);
  body.append(REPORT_FIELDS.freeText,    text);
  fetch(REPORT_FORM_ACTION, { method: 'POST', mode: 'no-cors', body: body })
    .catch(function (e) { console.error('[Report] send failed', e); });
  console.log('[Report Issue] sent');
}
