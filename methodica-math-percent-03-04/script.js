'use strict';

// ============================================================
//  PART 03-04 — screens S55–S57 (original data-screen 49–51)
// ============================================================
// The lesson engine is shared by all seven parts (../unit-js/main.js, loaded
// next). This file only says which range of the lesson this part holds and how
// the part differs; see the header of main.js for the meaning of each field.
const SPLIT_FIRST = 49;
const SPLIT_LAST  = 51;
const TOTAL_SCREENS = 3; // screens present in this part

var PART_CONFIG = {
  numericInput: 'none',
  legacyRetry:  false,
  boot: function () {
    transInit('s55-char-img');
  }
};

/* ═══════════════════ xAPI (720) — this part's seams ═══════════════════
   Data only, read at call time by ../unit-js/ (guide §6.1). Item map: docs-and-tools/XAPI-MAP.md.
   SCREEN_TO_SUBCONTENT: data-screen -> [item suffix, page in item]; every screen of the part is mapped
   (D-2: transition/narrative screens belong to the item they introduce). */
var XAPI_COMP_SLUG = 'methodica-math-percent-03-04';
var XAPI_COMP_ID   = XAPI_ID_PREFIX + XAPI_COMP_SLUG + '/';
var XAPI_METADATA_FILE = '../metadata/methodica-math-percent-03-04.json';
var SCREEN_TO_SUBCONTENT = {
  49: ['001', 1],   // s55
  50: ['001', 2],   // s56
  51: ['001', 3]    // s57
};
var XAPI_EVAL_ITEMS = {  };   /* items whose questions are graded in code */
var XAPI_PART_QUESTIONS = [];   /* the denominator of the part result */
var XAPI_END_BTN = 's57-continue';   /* the part's last button: 'completed' goes out from it (partFinish) */
