'use strict';

// ============================================================
//  PART 03-05 — screens S58–S65 (original data-screen 52–59)
// ============================================================
// The lesson engine is shared by all seven parts (../unit-js/main.js, loaded
// next). This file only says which range of the lesson this part holds and how
// the part differs; see the header of main.js for the meaning of each field.
const SPLIT_FIRST = 52;
const SPLIT_LAST  = 59;
const TOTAL_SCREENS = 8; // screens present in this part

var PART_CONFIG = {
  numericInput: 'thousands',
  legacyRetry:  false,
  boot: function () {
    transInit('s58-char-img');
  }
};

/* ═══════════════════ xAPI (720) — this part's seams ═══════════════════
   Data only, read at call time by ../unit-js/ (guide §6.1). Item map: docs-and-tools/XAPI-MAP.md.
   SCREEN_TO_SUBCONTENT: data-screen -> [item suffix, page in item]; every screen of the part is mapped
   (D-2: transition/narrative screens belong to the item they introduce). */
var XAPI_COMP_SLUG = 'methodica-math-percent-03-05';
var XAPI_COMP_ID   = XAPI_ID_PREFIX + XAPI_COMP_SLUG + '/';
var XAPI_METADATA_FILE = '../metadata/methodica-math-percent-03-05.json';
var SCREEN_TO_SUBCONTENT = {
  52: ['001', 1],   // s58
  53: ['001', 2],   // s59
  54: ['001', 3],   // s60
  55: ['001', 4],   // s61
  56: ['002', 1],   // s62
  57: ['002', 2],   // s63
  58: ['003', 1],   // s64
  59: ['003', 2]    // s65
};
var XAPI_EVAL_ITEMS = { '001': 1, '002': 1, '003': 1 };   /* items whose questions are graded in code */
var XAPI_PART_QUESTIONS = ['001/q1', '001/q2', '001/q3', '002/q1', '002/q2', '003/q1', '003/q2'];   /* the denominator of the part result */
var XAPI_END_BTN = 's65-action-btn';   /* the part's last button: 'completed' goes out from it (partFinish) */
