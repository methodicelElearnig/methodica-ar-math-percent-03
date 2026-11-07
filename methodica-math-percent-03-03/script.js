'use strict';

// ============================================================
//  PART 03-03 — screens S42–S54 (original data-screen 36–48)
// ============================================================
// The lesson engine is shared by all seven parts (../unit-js/main.js, loaded
// next). This file only says which range of the lesson this part holds and how
// the part differs; see the header of main.js for the meaning of each field.
const SPLIT_FIRST = 36;
const SPLIT_LAST  = 48;
const TOTAL_SCREENS = 13; // screens present in this part

var PART_CONFIG = {
  numericInput: 'digits',
  legacyRetry:  true,
  boot: function () {
    transInit('s42-char-img');
  }
};

/* ═══════════════════ xAPI (720) — this part's seams ═══════════════════
   Data only, read at call time by ../unit-js/ (guide §6.1). Item map: docs-and-tools/XAPI-MAP.md.
   SCREEN_TO_SUBCONTENT: data-screen -> [item suffix, page in item]; every screen of the part is mapped
   (D-2: transition/narrative screens belong to the item they introduce). */
var XAPI_COMP_SLUG = 'methodica-math-percent-03-03';
var XAPI_COMP_ID   = XAPI_ID_PREFIX + XAPI_COMP_SLUG + '/';
var XAPI_METADATA_FILE = '../metadata/methodica-math-percent-03-03.json';
var SCREEN_TO_SUBCONTENT = {
  36: ['001', 1],   // s42
  37: ['001', 2],   // s43
  38: ['002', 1],   // s44
  39: ['003', 1],   // s45
  40: ['004', 1],   // s46
  41: ['005', 1],   // s47
  44: ['006', 1],   // s50
  45: ['006', 2],   // s51
  46: ['006', 3],   // s52
  47: ['007', 1],   // s53
  48: ['007', 2]    // s54
};
var XAPI_EVAL_ITEMS = { '001': 1, '002': 1, '003': 1, '004': 1, '005': 1, '006': 1, '007': 1 };   /* items whose questions are graded in code */
var XAPI_PART_QUESTIONS = ['001/q1', '002/q1', '003/q1', '004/q1', '005/q1', '005/q2', '005/q3', '006/q1', '006/q2', '007/q1', '007/q2'];   /* the denominator of the part result */
var XAPI_END_BTN = 's54-action-btn';   /* the part's last button: 'completed' goes out from it (partFinish) */
