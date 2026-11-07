'use strict';

// ============================================================
//  PART 03-01 — screens S0–S32 (original data-screen 0–26)
// ============================================================
// The lesson engine is shared by all seven parts (../unit-js/main.js, loaded
// next). This file only says which range of the lesson this part holds and how
// the part differs; see the header of main.js for the meaning of each field.
const SPLIT_FIRST = 0;
const SPLIT_LAST  = 26;
const TOTAL_SCREENS = 27; // screens present in this part

var PART_CONFIG = {
  numericInput: 'none',
  legacyRetry:  false,
  boot: null
};

/* ═══════════════════ xAPI (720) — this part's seams ═══════════════════
   Data only, read at call time by ../unit-js/ (guide §6.1). Item map: docs-and-tools/XAPI-MAP.md.
   SCREEN_TO_SUBCONTENT: data-screen -> [item suffix, page in item]; every screen of the part is mapped
   (D-2: transition/narrative screens belong to the item they introduce). */
var XAPI_COMP_SLUG = 'methodica-math-percent-03-01';
var XAPI_COMP_ID   = XAPI_ID_PREFIX + XAPI_COMP_SLUG + '/';
var XAPI_METADATA_FILE = '../metadata/methodica-math-percent-03-01.json';
var SCREEN_TO_SUBCONTENT = {
  0: ['001', 1],   // s0
  1: ['001', 2],   // s1
  2: ['001', 3],   // s2
  3: ['002', 1],   // s3
  4: ['002', 2],   // s4
  7: ['002', 3],   // s6b
  8: ['003', 1],   // s7
  9: ['004', 1],   // s8
  10: ['004', 2],   // s16
  11: ['004', 3],   // s17
  12: ['004', 4],   // s18
  13: ['004', 5],   // s19
  14: ['004', 6],   // s20
  15: ['004', 7],   // s21
  16: ['004', 8],   // s22
  17: ['004', 9],   // s23
  18: ['004', 10],   // s24
  20: ['004', 11],   // s26
  22: ['004', 12],   // s28
  23: ['004', 13],   // s29
  24: ['005', 1],   // s30
  25: ['005', 2],   // s31
  26: ['005', 3]    // s32
};
var XAPI_EVAL_ITEMS = { '001': 1, '003': 1, '005': 1 };   /* items whose questions are graded in code */
var XAPI_PART_QUESTIONS = ['001/q1', '003/q1', '003/q2', '005/q1', '005/q2'];   /* the denominator of the part result */
var XAPI_END_BTN = 's32-action-btn';   /* the part's last button: 'completed' goes out from it (partFinish) */
