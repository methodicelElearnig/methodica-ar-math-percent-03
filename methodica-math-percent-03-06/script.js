'use strict';

// ============================================================
//  PART 03-06 — screens S66–S71 (original data-screen 60–65)
// ============================================================
// The lesson engine is shared by all seven parts (../unit-js/main.js, loaded
// next). This file only says which range of the lesson this part holds and how
// the part differs; see the header of main.js for the meaning of each field.
const SPLIT_FIRST = 60;
const SPLIT_LAST  = 65;
const TOTAL_SCREENS = 6; // screens present in this part

var PART_CONFIG = {
  numericInput: 'digits',
  legacyRetry:  false,
  boot: function () {
    transInit('s66-char-img');
  }
};

/* ═══════════════════ xAPI (720) — this part's seams ═══════════════════
   Data only, read at call time by ../unit-js/ (guide §6.1). Item map: docs-and-tools/XAPI-MAP.md.
   SCREEN_TO_SUBCONTENT: data-screen -> [item suffix, page in item]; every screen of the part is mapped
   (D-2: transition/narrative screens belong to the item they introduce). */
var XAPI_COMP_SLUG = 'methodica-math-percent-03-06';
var XAPI_COMP_ID   = XAPI_ID_PREFIX + XAPI_COMP_SLUG + '/';
var XAPI_METADATA_FILE = '../metadata/methodica-math-percent-03-06.json';
var SCREEN_TO_SUBCONTENT = {
  60: ['001', 1],   // s66
  61: ['001', 2],   // s67
  62: ['001', 3],   // s68
  63: ['001', 4],   // s69
  64: ['001', 5],   // s70
  65: ['001', 6]    // s71
};
var XAPI_EVAL_ITEMS = { '001': 1 };   /* items whose questions are graded in code */
var XAPI_PART_QUESTIONS = ['001/q1', '001/q2', '001/q3', '001/q4'];   /* the denominator of the part result */
var XAPI_END_BTN = 's71-action-btn';   /* the part's last button: 'completed' goes out from it (partFinish) */
