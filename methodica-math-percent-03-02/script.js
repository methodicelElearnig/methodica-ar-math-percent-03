'use strict';

// ============================================================
//  PART 03-02 — screens S33–S39 (original data-screen 27–33)
// ============================================================
// The lesson engine is shared by all seven parts (../unit-js/main.js, loaded
// next). This file only says which range of the lesson this part holds and how
// the part differs; see the header of main.js for the meaning of each field.
const SPLIT_FIRST = 27;
const SPLIT_LAST  = 33;
const TOTAL_SCREENS = 7; // screens present in this part

var PART_CONFIG = {
  numericInput: 'none',
  legacyRetry:  false,
  boot: function () {
    s33Init();
  }
};

/* ═══════════════════ xAPI (720) — this part's seams ═══════════════════
   Data only, read at call time by ../unit-js/ (guide §6.1). Item map: docs-and-tools/XAPI-MAP.md.
   SCREEN_TO_SUBCONTENT: data-screen -> [item suffix, page in item]; every screen of the part is mapped
   (D-2: transition/narrative screens belong to the item they introduce). */
var XAPI_COMP_SLUG = 'methodica-math-percent-03-02';
var XAPI_COMP_ID   = XAPI_ID_PREFIX + XAPI_COMP_SLUG + '/';
var XAPI_METADATA_FILE = '../metadata/methodica-math-percent-03-02.json';
var SCREEN_TO_SUBCONTENT = {
  27: ['001', 1],   // s33
  28: ['001', 2],   // s34
  29: ['002', 1],   // s35
  30: ['003', 1],   // s36
  31: ['004', 1],   // s37
  32: ['005', 1],   // s38
  33: ['006', 1]    // s39
};
var XAPI_EVAL_ITEMS = { '001': 1, '002': 1, '003': 1, '004': 1, '005': 1, '006': 1 };   /* items whose questions are graded in code */
var XAPI_PART_QUESTIONS = ['001/q1', '002/q1', '003/q1', '004/q1', '004/q2', '005/q1', '006/q1', '006/q2', '006/q3'];   /* the denominator of the part result */
var XAPI_END_BTN = 's39-action-btn';   /* the part's last button: 'completed' goes out from it (partFinish) */
