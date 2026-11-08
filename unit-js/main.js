'use strict';

// ============================================================
//  SHARED LESSON ENGINE — all seven parts (03-01 … 03-07)
// ============================================================
// One lesson, split into seven components. Each part's index.html contains
// ONLY the sections of its range; the ORIGINAL absolute data-screen numbering
// is kept, so every goTo(n) literal, VQ cfg.next, backMap entry and
// resetScreenState(n) branch means the same thing in every part. goTo()
// addresses screens by their data-screen attribute and refuses to leave the
// range, so navigation can never reach a screen that is not in the part.
//
// Loaded after the part's own script.js, which declares the range
// (SPLIT_FIRST / SPLIT_LAST / TOTAL_SCREENS) and PART_CONFIG:
//   numericInput  'none' | 'digits' | 'thousands' — what typing may leave in
//                 a numeric answer field (vqSanitizeNumeric)
//   legacyRetry   true in 03: the wrong pick/value itself carries the retry
//                 mark (no vqMarkRetry / vqClearRetryMarks)
//   boot          runs once on DOMContentLoaded for the part's first screen
let currentScreen = SPLIT_FIRST;

window.lomdaState = {
  selectedCharacter:   null,   // 'char1' | 'char2'
  practiceResults:     {},     // q1–q6: 'correct' | 'incorrect'
  guidedPractice: {
    battery: {
      step:            0,
      tableAttempts:   0,
      tableValues:     { pctPartial: '', valKnown: '', pctWhole: '' },
      tableDone:       false,
      formulaAttempts: 0,
      formulaValue:    '',
      formulaDone:     false,
      completed:       false
    },
    candy: {
      step:         0,
      yesNoAnswer:  null,
      choiceAnswer: null,
      completed:    false
    }
  }
};

// The learner picks a character once, in component 1 (s0). Every component is
// a separate page with its own state document, so the choice lives in the
// document's `ui` (40-resume.js: setUnitCharacter / getUnitCharacter /
// adoptUnitCharacter) with UI_CHARACTER_KEY in localStorage as the synchronous
// cache read here, before any screen syncs its character — otherwise
// components 2–7 fell back to char1 regardless of the learner's choice.
// CHAR_STORAGE_KEY is the cache key used before resume (2026-11-03 and
// earlier); a value found only there is carried over once.
var CHAR_STORAGE_KEY = 'methodica-math-percent-03:selectedCharacter';

function saveSelectedCharacter(cId) {
  if (typeof setUnitCharacter === 'function') { setUnitCharacter(cId); return; }
  try { localStorage.setItem(CHAR_STORAGE_KEY, cId); } catch (e) {}
}

(function() {
  try {
    if (typeof UI_CHARACTER_KEY !== 'undefined' && !localStorage.getItem(UI_CHARACTER_KEY)) {
      var old = localStorage.getItem(CHAR_STORAGE_KEY);
      if (old === 'char1' || old === 'char2') localStorage.setItem(UI_CHARACTER_KEY, old);
    }
  } catch (e) {}
  // Component 1 shows the picker unselected; the document (or the cache,
  // adopted in the loader's stage A) repaints s0 when it has a choice.
  if (SPLIT_FIRST === 0) return;
  var saved = null;
  try {
    saved = (typeof getUnitCharacter === 'function') ? getUnitCharacter() : localStorage.getItem(CHAR_STORAGE_KEY);
  } catch (e) {}
  if (saved === 'char1' || saved === 'char2') window.lomdaState.selectedCharacter = saved;
})();

var CHAR_ASSETS = {
  char1: {
    poses: {
      still:     '../unit-assets/img/char-1-opt.png',
      reading:   '../unit-assets/video/yellow_read-opt.mp4',
      phone:     '../unit-assets/video/yellow_phone-opt.mp4',
      readVideo: '../unit-assets/video/yellow_read-opt.mp4',
      thinkVideo: '../unit-assets/video/yellow_think-opt.mp4',
      train:     '../unit-assets/img/yellow_train-opt.png',
      thumbsUpVideo: '../unit-assets/video/Yellow_thumbs_up-opt.mp4',
      please:    '../unit-assets/video/yellow_please-opt.mp4',
      happy:     '../unit-assets/video/Yellow_happy-opt.mp4',
      trainVideo: '../unit-assets/video/yellow_train-opt.mp4'
    }
  },
  char2: {
    poses: {
      still:     '../unit-assets/img/char-2-opt.png',
      reading:   '../unit-assets/video/green_read-opt.mp4',
      phone:     '../unit-assets/video/green_phone-opt.mp4',
      readVideo: '../unit-assets/video/green_read-opt.mp4',
      thinkVideo: '../unit-assets/img/green_think-opt.png',
      train:     '../unit-assets/video/green_read-opt.mp4',
      thumbsUpVideo: '../unit-assets/img/Green_thumbs_up-opt.png',
      please:    '../unit-assets/video/blue_please-opt.mp4',
      happy:     '../unit-assets/video/Green_happy-opt.mp4',
      trainVideo: '../unit-assets/video/Green_train-opt.mp4'
    }
  }
};

// ── CHARACTER SCREEN REGISTRY ────────────────────────────────────────────────
// מרשם מרכזי של כל הופעת דמות בלומדה.
// לשינוי pose במסך: שנה את poseKey לkey שקיים ב-CHAR_ASSETS.charX.poses.
// לשינוי קובץ של pose: שנה את ה-path ב-CHAR_ASSETS בלבד.
var CHARACTER_SCREEN_REGISTRY = {
  s1: {
    dataScreen: 1,  sectionId: 's1',
    elementType: 'video', elementId: 'intro-video',
    poseKey: 'phone', positionClass: 'intro-video',
    bubble: true,  bubbleSelector: '.speech-bubble .speech-text',
    bubbleText: 'هل معكم شاحن سريع؟'
  },
  s2: {
    dataScreen: 2,  sectionId: 's2',
    elementType: 'image', elementId: 's2-feedback-character',
    poseKey: 'still',   positionClass: 's2-feedback-character',
    bubble: true,  bubbleSelector: '.s2-feedback-bubble p',
    bubbleText: 'لا تقلقوا، سنصل إلى الإجابة لاحقًا في الوحدة.'
  },
  s4: {
    dataScreen: 4,  sectionId: 's4',
    elementType: 'video', elementId: 's4-character-video',
    poseKey: 'reading', positionClass: 's4-character-video',
    bubble: true,  bubbleSelector: '.s4-speech-bubble .s4-speech-text',
    bubbleText: 'هل تتذكرون التناسب؟ لنرَ كيف نفعل ذلك باستخدامه!'
  },
  s7: {
    dataScreen: 8,  sectionId: 's7',
    elementType: 'image', elementId: 's7-char-img-bubble',
    poseKey: 'still',   positionClass: 's7-char-img',
    bubble: true,  bubbleSelector: '#s7-char-bubble',
    bubbleText: '(dynamic)'
  },
  s8: {
    dataScreen: 9,  sectionId: 's8',
    elementType: 'image', elementId: 's8-char-img',
    poseKey: 'still',   positionClass: 's8-char-img',
    bubble: false, bubbleText: null
  },
  s16: {
    dataScreen: 10, sectionId: 's16',
    elementType: 'image', elementId: 's16-char-img',
    poseKey: 'still',   positionClass: 's16-char-img',
    bubble: true,  bubbleSelector: '.s16-speech-bubble .s16-bubble-text',
    bubbleText: 'هيا نحلّ معًا'
  },
  s29: {
    dataScreen: 23, sectionId: 's29',
    elementType: 'image', elementId: 's29-char-img',
    poseKey: 'still',   positionClass: 's29-char-img',
    bubble: true,  bubbleSelector: '.s29-speech-bubble .s29-bubble-text',
    bubbleText: '(static)'
  },
  s30: {
    dataScreen: 24, sectionId: 's30',
    elementType: 'video', elementId: 's30-char-img',
    poseKey: 'readVideo', positionClass: 's30-char-img',
    bubble: false, bubbleText: null
  },
  s33: {
    dataScreen: 27, sectionId: 's33',
    elementType: 'video', elementId: 's33-char-img',
    poseKey: 'thinkVideo',   positionClass: 's30-char-img',
    bubble: false, bubbleText: null
  },
  s42: {
    dataScreen: 36, sectionId: 's42',
    elementType: 'video', elementId: 's42-char-img',
    poseKey: 'trainVideo',   positionClass: 's42-char-img',
    bubble: true,  bubbleSelector: '.s42-speech-bubble',
    bubbleText: 'كل شيء على ما يرام، خذوا لحظة لالتقاط أنفاسكم وهيا نكمل معًا!'
  },
  s50: {
    dataScreen: 44, sectionId: 's50',
    elementType: 'video', elementId: 's50-char-img',
    poseKey: 'trainVideo',   positionClass: 's30-char-img',
    bubble: false, bubbleText: null
  },
  s55: {
    dataScreen: 49, sectionId: 's55',
    elementType: 'video', elementId: 's55-char-img',
    poseKey: 'train',   positionClass: 's30-char-img',
    bubble: false, bubbleText: null
  },
  s56: {
    dataScreen: 50, sectionId: 's56',
    elementType: 'video', elementId: 's56-char-img',
    poseKey: 'happy',   positionClass: 's56-char-img',
    bubble: false, bubbleText: null
  },
  s57: {
    dataScreen: 51, sectionId: 's57',
    elementType: 'video', elementId: 's57-char-img',
    poseKey: 'please',   positionClass: 's57-char-img',
    bubble: false, bubbleText: null
  },
  s58: {
    dataScreen: 52, sectionId: 's58',
    elementType: 'video', elementId: 's58-char-img',
    poseKey: 'thumbsUpVideo',   positionClass: 's30-char-img',
    bubble: false, bubbleText: null
  },
  s66: {
    dataScreen: 60, sectionId: 's66',
    elementType: 'video', elementId: 's66-char-img',
    poseKey: 'happy',   positionClass: 's30-char-img',
    bubble: false, bubbleText: null
  },
  s72: {
    dataScreen: 66, sectionId: 's72',
    elementType: 'video', elementId: 's72-char-img',
    poseKey: 'happy'    , positionClass: 's30-char-img',
    bubble: false, bubbleText: null
  }
};

// ────────────────────────────────────────────────────────────────────────────

// ── CHARACTER SIZE REGISTRY ───────────────────────────────────────────────────
// מקום יחיד לשליטה בגובה התצוגה של כל דמות, לכל מסך, בנפרד לצהוב (char1) ולירוק (char2).
// לשינוי גודל דמות במסך: שנה את המספר (בפיקסלים) כאן בלבד — אין צורך לגעת ב-CSS.
//
// המסכים הבאים מתומחרים דרך האובייקט הזה (JS מציב width/height inline בכניסה למסך):
// s30, s33, s40, s55, s57, s65, s71, s76, s77 — כולם חולקים את אותה מבנה עוגן
// (position:absolute + right/bottom ב-CSS, עם width:auto כדי לשמור על יחס-רוחב-גובה טבעי).
//
// מסכים עם עיצוב ייחודי (קופסה קבועה + object-fit, שורת flex עם בועה, או דמות מוסתרת)
// ממשיכים להיות מתומחרים ב-CSS ישירות — הם מופיעים כאן רק לתיעוד/עיון, ושינוי המספר
// שלהם לא ישפיע (ראה note לכל אחד לאן לגשת בפועל).
var CHAR_SIZE_REGISTRY = {
  // ── JS-driven (inline height, width:auto) ──────────────────────────────────
  s30: { char1: 446, char2: 400 },
  s33: { char1: 400, char2: 370 },
  s55: { char1: 372, char2: 400 },
  s57: { note: 'CSS: .s57-char-img — width 150px, height:auto, object-fit:contain' },
  // ── CSS-driven (reference only — edit the noted rule in styles.css) ────────
  s1:  { note: 'CSS: .intro-video' },
  s2:  { note: 'CSS: .s2-feedback-character — fixed 197×270 box, object-fit:contain (same box, both characters)' },
  s4:  { note: 'CSS: #s4 .s4-character-video — fixed 563px × 76% box, object-fit:contain' },
  s7:  { note: 'CSS: #s7 .s7-char-img — width 132px, height:auto' },
  s8:  { note: 'character hidden on this screen (display:none)' },
  s42: { note: 'CSS: #s42 .s42-char-img — fixed height 350px, object-fit:contain (protected, do not change)' },
  s50: { note: 'CSS: #s50 .s50-char-img — fixed height 450px, object-fit:contain' },
  s56: { note: 'CSS: .s56-char-img — width 150px, height:auto, object-fit:contain' },
  s58: { char1: 390, char2: 400 },
  s66: { char1: 360, char2: 350 },
  s72: { char1: 360, char2: 350 }
};

// ────────────────────────────────────────────────────────────────────────────

// ── CHARACTER POSITION REGISTRY ───────────────────────────────────────────────
// מקום יחיד לשליטה במיקום (right/bottom, בפיקסלים) של הדמות במסכים s30-group,
// בנפרד לצהוב (char1) ולירוק (char2) — בדיוק כמו CHAR_SIZE_REGISTRY.
// right גבוה יותר  = מזיז את הדמות שמאלה   |  right נמוך יותר  = מזיז את הדמות ימינה
// bottom גבוה יותר = מזיז את הדמות למעלה   |  bottom נמוך יותר = מזיז את הדמות למטה
// לשינוי מיקום דמות במסך: שנה את המספרים כאן בלבד — אין צורך לגעת ב-CSS.
var CHAR_POSITION_REGISTRY = {
  s30: { char1: { right: 413, bottom: 74 }, char2: { right: 413, bottom: 74 } },
  s33: { char1: { right: 567, bottom: 74 }, char2: { right: 511, bottom: 74 } },
  s55: { char1: { right: 460, bottom: 74 }, char2: { right: 460, bottom: 74 } },
  s58: { char1: { right: 423, bottom: 74 }, char2: { right: 439, bottom: 74 } },
  s66: { char1: { right: 439, bottom: 45 }, char2: { right: 464, bottom: 50 } },
  s72: { char1: { right: 448, bottom: 74 }, char2: { right: 448, bottom: 74 } }
};

// ────────────────────────────────────────────────────────────────────────────

// Low-level helpers (used by updateCharacterGuide and screens that manage their own video elements)
function syncCharacterVideo(videoEl, srcEl, charId) {
  if (!videoEl || !srcEl) return;
  var p = (CHAR_ASSETS[charId] || CHAR_ASSETS.char1).poses;
  videoEl.poster = p.still;
  srcEl.setAttribute('src', p.reading);
  videoEl.load();
  videoEl.play().catch(function() {});
}

function syncCharacterImage(imgEl, charId) {
  if (!imgEl) return;
  imgEl.src = (CHAR_ASSETS[charId] || CHAR_ASSETS.char1).poses.still;
}

// Apply CHAR_SIZE_REGISTRY (JS-driven entries only — see comment on the table)
function applyCharSize(el, sectionId, cId) {
  if (!el) return;
  var sizeEntry = CHAR_SIZE_REGISTRY[sectionId];
  var px = sizeEntry && sizeEntry[cId];
  if (typeof px === 'number') {
    el.style.width  = 'auto';
    el.style.height = px + 'px';
  }
}

// Apply CHAR_POSITION_REGISTRY — same character element as CHAR_SIZE_REGISTRY,
// works for both img and video since it only sets absolute-position properties.
// Position is per-character (char1/char2), same split as CHAR_SIZE_REGISTRY.
function applyCharPosition(screenId, cId) {
  var posEntry = CHAR_POSITION_REGISTRY[screenId];
  var pos = posEntry && posEntry[cId];
  if (!pos) return;
  var reg = CHARACTER_SCREEN_REGISTRY[screenId];
  var el  = document.getElementById(reg ? reg.elementId : screenId + '-char-img');
  if (!el) return;
  el.style.position = 'absolute';
  // Horizontal: center the character on the canvas — do NOT anchor it to the
  // right edge. #app stretches wider than the 1280 design grid on wide /
  // maximized viewports (R2); anchoring by `right` (even relative to center)
  // left the character off the page center because the registry values place
  // the character's RIGHT EDGE, not its center. left:50% + translateX(-50%)
  // puts the character's own center on the canvas center at any width,
  // matching the centered heading/body text above it. bottom stays from the
  // registry (vertical position was never the issue).
  // (CHAR_POSITION_REGISTRY.right is retained as historical data but no
  // longer drives horizontal placement — every screen in this family is a
  // single centered character.)
  el.style.left      = '50%';
  el.style.right     = 'auto';
  el.style.transform = 'translateX(-50%)';
  el.style.bottom    = pos.bottom + 'px';
}

// Primary character sync — reads poseKey and elementId from CHARACTER_SCREEN_REGISTRY
function syncCharFromRegistry(sectionId, charId) {
  var cId   = charId || window.lomdaState.selectedCharacter || 'char1';
  var poses = (CHAR_ASSETS[cId] || CHAR_ASSETS.char1).poses;
  var reg   = CHARACTER_SCREEN_REGISTRY[sectionId];
  var assetPath = poses[(reg && reg.poseKey) || 'still'] || poses.still;

  applyCharPosition(sectionId, cId);

  if (reg && reg.elementType === 'video') {
    var videoEl = document.getElementById(reg.elementId);
    var srcEl   = document.getElementById(reg.elementId + '-src');
    if (!videoEl || !srcEl) return;
    videoEl.setAttribute('data-char', cId);
    applyCharSize(videoEl, sectionId, cId);
    if (/\.(png|gif|jpe?g|webp)$/i.test(assetPath)) {
      // static image in a video slot — show as poster, clear src
      videoEl.poster = assetPath;
      videoEl.style.visibility = '';
      srcEl.setAttribute('src', '');
      videoEl.load();
    } else {
      // Every character video slot: no poster, and the video stays invisible
      // (layout space kept via visibility) until its own first frame is
      // ready. A poster (the HTML default char-1.png, or the "still" pose)
      // painted a different pose — or the other character — for the first
      // moment of the screen before the real clip replaced it.
      videoEl.removeAttribute('poster');
      videoEl.style.visibility = 'hidden';
      var revealVideo = function() {
        videoEl.style.visibility = '';
        videoEl.removeEventListener('loadeddata', revealVideo);
        videoEl.removeEventListener('error', revealVideo);
        videoEl.play().catch(function() {});
      };
      videoEl.addEventListener('loadeddata', revealVideo);
      videoEl.addEventListener('error', revealVideo);
      srcEl.setAttribute('src', assetPath);
      videoEl.load();
      videoEl.play().catch(function() {});
    }
  } else {
    var imgEl = document.getElementById(reg ? reg.elementId : sectionId + '-char-img');
    if (imgEl) {
      // Same rule for still images: when the pose/character changes, keep the
      // old picture hidden until the new one has loaded.
      if (imgEl.getAttribute('src') !== assetPath) {
        imgEl.style.visibility = 'hidden';
        var revealImg = function() {
          imgEl.style.visibility = '';
          imgEl.removeEventListener('load', revealImg);
          imgEl.removeEventListener('error', revealImg);
        };
        imgEl.addEventListener('load', revealImg);
        imgEl.addEventListener('error', revealImg);
        imgEl.src = assetPath;
        if (imgEl.complete) revealImg();
      }
      imgEl.setAttribute('data-char', cId);
      applyCharSize(imgEl, sectionId, cId);
    }
  }
}

// Apply CHAR_ASSETS to s0 selection-screen cards (s0 cards are not in the registry)
document.addEventListener('DOMContentLoaded', function() {
  var s0Cards = document.querySelectorAll('#s0 .option-card[data-value]');
  s0Cards.forEach(function(card) {
    var img = card.querySelector('img.char-img');
    if (img && CHAR_ASSETS[card.dataset.value]) {
      img.src = CHAR_ASSETS[card.dataset.value].poses.still;
    }
  });
});

document.addEventListener('DOMContentLoaded', function() {
  vqInitScopedZoomTargets();
});

// Part bootstrap: the part's first screen loads statically "active" instead of
// being reached via goTo(), so whatever goTo() would have run for it (pose,
// size and position via transInit / the screen's own init) runs once here.
// Each part's script.js supplies it as PART_CONFIG.boot.
document.addEventListener('DOMContentLoaded', function() {
  if (typeof PART_CONFIG.boot === 'function') PART_CONFIG.boot();
});

// Back button routing overrides (deviates from n-1)
var backMap = {
  9:  8,
  // s8  (index 9)  → s7
  11: 10,
  // s17 (index 11) → s16
  12: 11,
  // s18 (index 12) → s17
  13: 12,
  // s19 (index 13) → s18
  14: 13,
  // s20 (index 14) → s19
  15: 14
};

// Screen 2 — SingleChoiceQuestion state
var s2State = {
  selected:  null,   // selected option value string
  submitted: false   // whether "צדקתי?" was clicked
};

// ============================================================
//  SCALING — fit 1280×710 canvas into any viewport
// ============================================================
function scaleApp() {
  var app    = document.getElementById('app');
  var scaleX = window.innerWidth  / 1280;
  var scaleY = window.innerHeight / 710;
  // (a) never distort — scale uniformly to fit the smaller axis
  var scale  = Math.min(scaleX, scaleY);
  // (b) extend the canvas in design coords so it fills the viewport
  //     (transform-origin is top-left, so anchor at 0,0 — do NOT center)
  app.style.transform = 'scale(' + scale + ')';
  app.style.width     = (window.innerWidth  / scale) + 'px';
  app.style.height    = (window.innerHeight / scale) + 'px';
  app.style.left      = '0px';
  app.style.top       = '0px';
}

window.addEventListener('resize', scaleApp);

scaleApp();

// ============================================================
//  SCREEN STATE MEMORY — remember what the learner already did
// ============================================================
// Every screen family's init() is a full RESET. Moving away and coming back
// (המשך / חזרה / the dev DEV_GOTO bridge) therefore wiped work already done:
// selections vanished, V/X markers cleared, dropdowns reverted, the
// "התשובה הנכונה" reveal was gone, and a resolved question became answerable
// again. This module remembers each screen and replays it on re-entry.
//
// One record per screen id, in two halves:
//   • dom   — a verbatim snapshot of the screen's interaction-bearing
//             elements: field values, classes, disabled/hidden, and the
//             already-rendered feedback markup. Restoring replays exactly
//             what was on screen, so no question text, feedback wording,
//             formula, answer or verdict is ever re-derived here.
//   • logic — the screen's own JS state object (vqState[id], sNNState,
//             lomdaState[sNN]), cloned, so the done/answered/sectionDone
//             flags that block re-answering come back with it.
//
// Wiring: goTo() snapshots the outgoing screen (the single navigation funnel),
// and a delegated click/change/input listener re-snapshots the active screen
// after any meaningful action, so state is never held only until the next
// navigation. Each family's init() calls ssmRestore() as its LAST step, so
// everything init derives from global state — progress banners, nav V/X icons,
// character swap, countdown gates — still runs exactly as before, and only the
// learner's own interaction state is layered back on top.
var screenStateMemory = {};

// Interaction-bearing elements, matched within one screen section. Anything
// not listed here (character videos/images, layout, countdown gates, progress
// banners) stays under the screen init's control, unchanged.
var SSM_SEL = [
  'input', 'select', 'textarea',                    // value fields + dropdowns
  '.vq-opt', '.s39-opt', '.guided-btn',             // option buttons
  '[id*="-btn-"]',                                  // s18 yes/no + guided button ids
  '.guided-correct-mark', '[id$="-correct-mark"]',  // V markers
  '.feedback-panel', '.s38-feedback', '.s39-feedback',
  '[id*="-hint-"]',                                 // hint button / panel / popup (incl. -a/-b)
  '[id*="-sec-"]', '[id*="-phase-"]',               // s39 sections, s37 phases
  '[id$="-action-btn"]', '[id$="-continue"]',
  '[id$="-blank"]',                                 // s56 fill-in-the-blank
  '#s39-img'                                        // s39 per-section illustration
].join(', ');

var SSM_FB_SEL   = '.feedback-panel, .s38-feedback, .s39-feedback';

var SSM_TEXT_SEL = '[id$="-action-btn"], [id$="-continue"], [id$="-blank"]';

// Positional fallback key for the few matched elements that carry no id.
// Stable because nothing inside a screen is structurally rebuilt except
// feedback markup, whose descendants are excluded from the snapshot below.
function ssmKey(el, i) { return el.id || ('@' + i); }

function ssmEls(root) {
  var out = [];
  root.querySelectorAll(SSM_SEL).forEach(function (el) {
    // Never snapshot anything *inside* a feedback popup: the popup's own
    // innerHTML already carries it, and that markup is rebuilt on every
    // attempt (close/reveal buttons), so it has no stable identity.
    if (el.parentElement && el.parentElement.closest(SSM_FB_SEL)) return;
    out.push(el);
  });
  return out;
}

function ssmCapture(root) {
  var snap = [];
  ssmEls(root).forEach(function (el, i) {
    var rec = { k: ssmKey(el, i), cls: el.getAttribute('class'), hidden: el.hidden };
    if ('disabled' in el)         rec.disabled = el.disabled;
    if ('value' in el)            rec.value    = el.value;
    if (el.tagName === 'SELECT')  rec.selIdx   = el.selectedIndex;
    if (el.matches(SSM_FB_SEL))   rec.html     = el.innerHTML;
    if (el.matches(SSM_TEXT_SEL)) rec.text     = el.textContent;
    if (el.tagName === 'IMG')   { rec.src      = el.getAttribute('src'); rec.alt = el.alt; }
    snap.push(rec);
  });
  return snap;
}

function ssmApply(root, snap) {
  var byKey = {};
  ssmEls(root).forEach(function (el, i) { byKey[ssmKey(el, i)] = el; });
  snap.forEach(function (rec) {
    var el = byKey[rec.k];
    if (!el) return;
    if (rec.html !== undefined) el.innerHTML = rec.html;
    if (rec.cls === null) el.removeAttribute('class');
    else el.setAttribute('class', rec.cls);
    el.hidden = rec.hidden;
    if (rec.disabled !== undefined) el.disabled = rec.disabled;
    if (rec.text  !== undefined) el.textContent = rec.text;
    if (rec.value !== undefined) el.value = rec.value;
    if (rec.selIdx !== undefined && rec.selIdx >= 0) el.selectedIndex = rec.selIdx;
    if (rec.src) { el.setAttribute('src', rec.src); if (rec.alt !== undefined) el.alt = rec.alt; }
  });
}

// Feedback markup is normally snapshotted after MathJax has rendered it, so
// the restored HTML already contains the typeset math. Only if a snapshot was
// taken before typesetting settled would raw \(...\) come back — re-typeset
// in that case alone.
function ssmTypesetIfRaw(root) {
  root.querySelectorAll(SSM_FB_SEL).forEach(function (fb) {
    if (!fb.hidden && /\\\(|\\\[/.test(fb.innerHTML)) vqTypeset(fb);
  });
}

// Markup saved for resume carries every typeset formula as its TeX source
// (\(…\) inline, \[…\] display), never the typeset markup: MathJax CHTML writes
// its glyph CSS per page load, so markup replayed in a new page would draw
// broken math; the source is re-typeset on entry (ssmTypesetIfRaw, and the
// screens' own vqTypeset) like any snapshot taken before typesetting settled.
// In-session back navigation keeps replaying the typeset markup as before.
//
// The source comes from the container itself: every formula is stamped with
// data-tex / data-display as MathJax typesets it (the render action below), so
// the stamp survives in any copy of the markup — a snapshot replayed by
// ssmApply, or the fbHtml a multi-section screen keeps in its state object —
// long after MathJax stopped tracking that node. A container without a stamp
// (typeset before the action was registered) leaves the markup as it is.
function ssmTexHtml(html) {
  if (typeof html !== 'string' || html.indexOf('<mjx-container') === -1) return html;
  var t = document.createElement('template');
  t.innerHTML = html;
  // Top-level formulas only: a second typeset of the same panel (s34's final
  // wrong runs two) nests a container inside the screen-reader copy, which
  // goes away with its parent.
  var conts = Array.prototype.filter.call(t.content.querySelectorAll('mjx-container'),
    function (c) { return !c.parentElement || !c.parentElement.closest('mjx-container'); });
  for (var i = 0; i < conts.length; i++) {
    if (conts[i].getAttribute('data-tex') === null) return html;
  }
  conts.forEach(function (c) {
    var tex = c.getAttribute('data-tex');
    c.replaceWith(document.createTextNode(c.getAttribute('data-display') === '1' ? '\\[' + tex + '\\]' : '\\(' + tex + '\\)'));
  });
  return t.innerHTML;
}

// Every string in a logic object, converted (fbHtml of s37 / s47 sections).
function ssmTexDeep(v) {
  if (typeof v === 'string') return ssmTexHtml(v);
  if (Array.isArray(v)) return v.map(ssmTexDeep);
  if (v && typeof v === 'object') {
    var out = {};
    Object.keys(v).forEach(function (k) { out[k] = ssmTexDeep(v[k]); });
    return out;
  }
  return v;
}

(function () {
  function stamp(m) {
    var r = m && m.typesetRoot;
    if (r && r.setAttribute && typeof m.math === 'string') {
      r.setAttribute('data-tex', m.math);
      r.setAttribute('data-display', m.display ? '1' : '0');
    }
  }
  try {
    // After 'typeset' (150, typesetRoot exists), before 'update' inserts it (200).
    MathJax.startup.promise.then(function () {
      MathJax.startup.document.addRenderAction('stampTex', 160,
        function (doc) { Array.from(doc.math).forEach(stamp); }, stamp);
    });
  } catch (e) {}
})();

function ssmClone(obj) {
  var out = {};
  Object.keys(obj).forEach(function (k) {
    var v = obj[k];
    if (Array.isArray(v))                out[k] = v.slice();
    else if (v && typeof v === 'object')  out[k] = ssmClone(v);
    else                                  out[k] = v;
  });
  return out;
}

function ssmAssign(target, src) {
  Object.keys(src).forEach(function (k) {
    var v = src[k];
    if (Array.isArray(v))               target[k] = v.slice();
    else if (v && typeof v === 'object') target[k] = ssmClone(v);
    else                                 target[k] = v;
  });
}

// The screen's own JS state object, whichever convention it uses. Mutated in
// place on restore, so no reference anywhere needs re-binding.
function ssmLogicTarget(screenId) {
  // vq-family screens keep their state in vqState[id] (created by vqInit).
  if (vqState[screenId]) return vqState[screenId];
  var own = window[screenId + 'State'];
  if (own && typeof own === 'object') return own;
  var shared = window.lomdaState[screenId];
  if (shared && typeof shared === 'object') return shared;
  return null;
}

function ssmSave(screenId) {
  var root = document.getElementById(screenId);
  if (!root) return;
  var rec = screenStateMemory[screenId] || (screenStateMemory[screenId] = {});
  rec.dom = ssmCapture(root);
  var logic = ssmLogicTarget(screenId);
  if (logic) rec.logic = ssmClone(logic);
}

// Whole-screen "the learner is finished here" flags, across the families'
// different naming conventions. Deliberately excludes s37's doneA (phase A
// done still leaves phase B to answer) — s37's finished flag is doneB.
// s39's sectionDone counts: the button then reads המשך and advances to the
// next section, which is exactly the forward action.
var SSM_DONE_FLAGS = ['done', 'answered', 'allDone', 'sectionDone', 'doneB', 'completed', 'submitted'];

function ssmIsCompleted(logic) {
  if (!logic) return false;
  for (var i = 0; i < SSM_DONE_FLAGS.length; i++) {
    if (logic[SSM_DONE_FLAGS[i]] === true) return true;
  }
  return false;
}

// A restored screen the learner already completed must always be able to move
// FORWARD. Re-answering stays blocked by the done/answered flags plus the
// disabled inputs/options/buttons — this only ever re-enables the one forward
// button, and only on a screen whose own state says it is finished. Never
// enables anything on an unanswered screen.
function ssmUnblockForward(screenId, logic) {
  if (!ssmIsCompleted(logic)) return;
  var btn = document.getElementById(screenId + '-action-btn') ||
            document.getElementById(screenId + '-continue');
  if (btn && btn.disabled) btn.disabled = false;
}

// Called as the last step of a screen's init(). No-ops on first entry.
function ssmRestore(screenId) {
  var rec  = screenStateMemory[screenId];
  var root = document.getElementById(screenId);
  if (!rec || !rec.dom || !root) return false;
  var logic = ssmLogicTarget(screenId);
  if (logic && rec.logic) ssmAssign(logic, rec.logic);
  ssmApply(root, rec.dom);
  ssmTypesetIfRaw(root);
  ssmUnblockForward(screenId, logic);
  fbtOnRestore(screenId);   // a toggled question comes back on its solution view
  return true;
}

// Forget remembered state — intentional resets only (s54Reset / unitReset).
// No arguments = forget every screen.
function ssmForget(ids) {
  if (!ids) { screenStateMemory = {}; return; }
  ids.forEach(function (id) { delete screenStateMemory[id]; });
}

// Save on every meaningful action, not only on navigation. Deferred a tick so
// the snapshot is taken *after* the screen's own handler finished mutating the
// DOM (select, submit, reveal-toggle, answer, dropdown change, typing).
//
// The screen is re-checked for .active inside the timeout: if the click also
// navigated away, goTo() has already snapshotted it and this deferred pass
// must stay out of the way — otherwise a reset button that clears memory would
// see the screen re-saved a tick later.
(function () {
  var pending = null;
  function scheduleSave(e) {
    var t = e.target;
    if (!t || !t.closest) return;
    var section = t.closest('.screen');
    if (!section || !section.id || !section.classList.contains('active')) return;
    var id = section.id;
    clearTimeout(pending);
    pending = setTimeout(function () {
      var el = document.getElementById(id);
      if (el && el.classList.contains('active')) ssmSave(id);
      // Pending picks and typing reach the state document too (debounced;
      // inert until the restore has run — 40-resume.js).
      try { if (typeof scheduleResumeSave === 'function') scheduleResumeSave(); } catch (e) {}
    }, 0);
  }
  ['click', 'change', 'input'].forEach(function (type) {
    document.addEventListener(type, scheduleSave, true);
  });
})();

// ============================================================
//  RESUME — the four per-part seams (../unit-js/40-resume.js)
// ============================================================
// The saved payload is the screen state memory above, i.e. exactly what
// in-session back navigation replays: every screen's interaction DOM and its
// logic object (attempts, done, lastWrong — the Retry gate — selected …), plus
// the few states that live outside it. Nothing is re-derived and no painter
// is written per screen: every screen family's init ends in ssmRestore(), so
// the restore and every later navigation paint through that one path (guide
// §8.4a, §8.8 rules 4/8/10: what live play left on screen, pending input
// included, wrong marks only where the learner left them).
//   ssm   — screenStateMemory, feedback math as TeX source (ssmTexHtml)
//   lomda — lomdaState.practiceResults / guidedPractice (s7) / carouselProgress (s6b)
//   q     — XAPI_Q_RESULTS (item and component results after a reload)
//   fbt   — the View My Answer toggles (render hooks by name)
// The character is not here: it is the document's `ui`, beside the payload.
var RESUME_SSM_V = 1;

function capturePartPayload() {
  var active = document.querySelector('.screen.active');
  if (active && active.id) ssmSave(active.id);
  var ssm = {};
  Object.keys(screenStateMemory).forEach(function (id) {
    var rec = screenStateMemory[id];
    var out = {};
    if (rec.dom) out.dom = rec.dom.map(function (r) {
      var c = {};
      Object.keys(r).forEach(function (k) { c[k] = r[k]; });
      if (r.html !== undefined) c.html = ssmTexHtml(r.html);
      return c;
    });
    if (rec.logic) out.logic = ssmTexDeep(rec.logic);
    ssm[id] = out;
  });
  var fbt = {};
  Object.keys(fbtRegistry).forEach(function (k) {
    var e = fbtRegistry[k];
    fbt[k] = { screen: e.screen, fbId: e.fbId, title: e.title, body: e.body, fields: e.fields,
               view: e.view, render: (e.render && e.render.name) || null };
  });
  var ls = window.lomdaState;
  return {
    currentScreen: currentScreen,
    ssmV: RESUME_SSM_V,
    ssm: ssm,
    lomda: {
      practiceResults: ssmClone(ls.practiceResults || {}),
      guidedPractice:  ssmClone(ls.guidedPractice || {}),
      carouselProgress: ls.carouselProgress ? ssmClone(ls.carouselProgress) : null
    },
    q: ssmClone(typeof XAPI_Q_RESULTS !== 'undefined' ? XAPI_Q_RESULTS : {}),
    fbt: fbt
  };
}

// Puts every variable back. Called twice by applyExecutionState (before and
// after its goTo), so it only assigns — in place, never by re-binding an
// object something else holds.
function applyResumeVars(st) {
  if (!st) return;
  var ls = window.lomdaState;
  if (st.lomda) {
    if (st.lomda.practiceResults) ssmAssign(ls.practiceResults, st.lomda.practiceResults);
    if (st.lomda.guidedPractice) ssmAssign(ls.guidedPractice, st.lomda.guidedPractice);
    if (st.lomda.carouselProgress) ls.carouselProgress = ssmClone(st.lomda.carouselProgress);
  }
  if (st.q && typeof XAPI_Q_RESULTS !== 'undefined') ssmAssign(XAPI_Q_RESULTS, st.q);
  if (st.ssmV === RESUME_SSM_V && st.ssm) {
    screenStateMemory = {};
    Object.keys(st.ssm).forEach(function (id) {
      var rec = st.ssm[id];
      screenStateMemory[id] = { dom: rec.dom || [], logic: rec.logic ? ssmClone(rec.logic) : undefined };
      if (!rec.logic) delete screenStateMemory[id].logic;
      // Screens that paint from their own state object instead of from
      // memory (s2 resetS2Display) need it back before their init runs; for
      // the others the init's ssmRestore assigns it again. vqState[id] is
      // created by vqInit, which restores it itself.
      if (rec.logic && !vqState[id]) {
        var own = window[id + 'State'];
        if (own && typeof own === 'object') ssmAssign(own, rec.logic);
      }
    });
  }
  if (st.fbt) {
    Object.keys(st.fbt).forEach(function (k) {
      var e = st.fbt[k];
      var r = e.render && typeof window[e.render] === 'function' ? window[e.render] : null;
      fbtRegistry[k] = { screen: e.screen, fbId: e.fbId, title: e.title, body: e.body,
                         fields: (e.fields || []).map(function (f) { return { id: f.id, correct: f.correct, own: f.own }; }),
                         render: r, after: null, view: e.view === 'answer' ? 'answer' : 'solution' };
    });
  }
}

// The DOM comes back through memory when each screen's init runs (goTo →
// resetScreenState → … → ssmRestore), so there is nothing to write here.
function applyResumeDom(st) {}

// The landing screen was painted by its own init during the restore's goTo
// (ssmRestore); later navigations paint the same way. Kept as the layer's
// seam; the ended button is re-disabled by the layer (restoreEndedButton).
function restoreScreenUI(n) {}

// An answer was just committed: write it now, not on the next screen change
// (D-13). Deferred one tick so the submit handler has finished drawing its
// feedback, which the capture snapshots.
function resumeCommit() {
  setTimeout(function () {
    try { if (typeof flushResumeSave === 'function') flushResumeSave(); } catch (e) {}
  }, 0);
}

// ============================================================
//  NAVIGATION
// ============================================================
// Entrance keyframes (fade/float-in) — replaying them on a return visit makes
// the screen look like it reloaded. Jump them straight to their end state;
// any other animation (countdown pop, playing pulse…) is left alone.
var ENTRANCE_KEYFRAMES = /^(s0-enter-fade-down|entrance-soft-fade|s5CardIn)$/;

function skipEntranceAnimations(root) {
  if (!root.getAnimations) return;
  root.getAnimations({ subtree: true }).forEach(function(a) {
    if (a.animationName && ENTRANCE_KEYFRAMES.test(a.animationName)) {
      try { a.finish(); } catch (e) {}
    }
  });
}

// ============================================================
//  xAPI REPORTING — the engine's call sites (../unit-js/20-xapi.js)
// ============================================================
// Every graded catalogue question, by the engine's own key (a screen id, or a
// screen id + section letter for the multi-question screens s7/s37/s39/s47).
// Screen ids are unique across the unit, so one table serves all seven parts;
// the item suffix is relative to the part's own XAPI_COMP_SLUG. The METADATA
// questionType decides the response format (xapiResponse). Map:
// docs-and-tools/XAPI-MAP.md; _test/verify-report.js checks every entry
// against metadata/.
var XAPI_QUESTIONS = {
  // 03-01
  s2:   ['001', 'q1'],                       // hook — ungraded on screen, graded in the catalogue
  s7a:  ['003', 'q1'], s7b: ['003', 'q2'],   // guided practice: table (performance), formula
  s31:  ['005', 'q1'], s32: ['005', 'q2'],
  // 03-02
  s34:  ['001', 'q1'], s35: ['002', 'q1'], s36: ['003', 'q1'],
  s37a: ['004', 'q1'], s37b: ['004', 'q2'],
  s38:  ['005', 'q1'],                       // two-cell table (performance)
  s39a: ['006', 'q1'], s39b: ['006', 'q2'], s39c: ['006', 'q3'],
  // 03-03
  s43:  ['001', 'q1'], s44: ['002', 'q1'], s45: ['003', 'q1'], s46: ['004', 'q1'],
  s47a: ['005', 'q1'], s47b: ['005', 'q2'], s47c: ['005', 'q3'],
  s51:  ['006', 'q1'], s52: ['006', 'q2'], s53: ['007', 'q1'], s54: ['007', 'q2'],
  // 03-05
  s59:  ['001', 'q1'], s60: ['001', 'q2'], s61: ['001', 'q3'],   // s61: input + select (performance)
  s62:  ['002', 'q1'], s63: ['002', 'q2'], s64: ['003', 'q1'], s65: ['003', 'q2'],
  // 03-06
  s68:  ['001', 'q1'], s69: ['001', 'q2'], s70: ['001', 'q3'], s71: ['001', 'q4'],   // s71: 3 inputs + select
  // 03-07
  s74:  ['001', 'q1'], s75: ['001', 'q2'], s76: ['001', 'q3']
};

// One graded answer. isLast: correct, or no attempt left — only that one counts
// toward the part's score. The reporting layer is absent in a bare local copy.
function xapiReport(key, correct, isLast, spec) {
  var q = XAPI_QUESTIONS[key];
  if (!q) { console.warn('[xAPI] no catalogue question for', key); return; }
  if (typeof xapiAnswered === 'function') xapiAnswered(q[0], q[1], !!correct, !!isLast, spec);
  resumeCommit();
}

// A hint opened. Reported once per question (the layer's hints ledger).
function xapiHint(key) {
  var q = XAPI_QUESTIONS[key];
  if (q && typeof xapiRequestedHint === 'function') xapiRequestedHint(q[0], q[1]);
}

// The visible label of an option button (its *-opt-text / *-option-text span
// when it has one) — matched to the catalogue's answers[] by xapiResponse.
function xapiOptText(el) {
  if (!el) return '';
  var t = el.querySelector('[class$="-opt-text"], [class$="-option-text"]') || el;
  return typeof xapiAnswerText === 'function' ? xapiAnswerText(t) : t.textContent.trim();
}

// A typed number as the catalogue writes it: thousands commas are display-only.
function xapiNumber(raw) { return String(raw == null ? '' : raw).trim().replace(/,/g, ''); }

// The response of a vq screen, shaped for xapiResponse.
function vqXapiSpec(id, cfg, st) {
  var opt = function(i) { return xapiOptText(document.querySelector('#' + id + ' .vq-opt[data-index="' + i + '"]')); };
  if (cfg.type === 'choice') return { choices: [opt(st.selected)] };
  if (cfg.type === 'multi') return { choices: st.multi.map(opt) };
  if (cfg.check) {
    // Multi-field screens (s61, s71): one step per field, in DOM order — the
    // catalogue's step order. A select reports its visible option text.
    return { steps: Array.prototype.map.call(
      document.querySelectorAll('#' + id + ' .s31-answer-box, #' + id + ' .vq-select'),
      function(el) {
        return el.tagName === 'SELECT' ? (el.selectedIndex > 0 ? el.options[el.selectedIndex].text : '') : xapiNumber(el.value);
      }) };
  }
  var raw = (document.getElementById(id + '-answer') || {}).value || '';
  return { value: xapiNumber(raw), text: raw.trim() };
}

// The part's 'completed' result (guide §6.4): correct / every catalogue question
// the part reports (unanswered = wrong), success at XAPI_PASS. A part with no
// question (04) completes without a result.
var XAPI_PASS = 0.6;
function xapiPartResult() {
  var qs = (typeof XAPI_PART_QUESTIONS !== 'undefined') ? XAPI_PART_QUESTIONS : [];
  if (!qs.length || typeof XAPI_Q_RESULTS === 'undefined') return null;
  var ok = qs.filter(function(k) { return XAPI_Q_RESULTS[k] === true; }).length;
  return { success: ok / qs.length >= XAPI_PASS, score: { scaled: Math.round((ok / qs.length) * 1000) / 1000 } };
}

// The part's last click: 'completed' goes out and the button is disabled. The
// platform removes the component and routes on (guide §6.5, §8.12); there is
// no navigation here.
function partFinish(btn) {
  if (typeof xapiEndComponent !== 'function') return;
  try {
    var b = btn || (typeof XAPI_END_BTN !== 'undefined' ? document.getElementById(XAPI_END_BTN) : null);
    xapiEndComponent(xapiPartResult(), b);
  } catch (e) { console.error('[xAPI] partFinish', e); }
}

function goTo(n) {
  // Split bound: never navigate outside this split's screen range.
  if (n < SPLIT_FIRST || n > SPLIT_LAST) {
    // Forward past the last screen is the part's last click: report it done.
    if (n > SPLIT_LAST) partFinish();
    // The target lives in a neighbouring component build. Inside the dev
    // navigator (dev-nav.html) ask it to load that component at screen n;
    // anywhere else (standalone, or on the platform) nothing happens.
    if (DEV_BRIDGE && window.parent !== window) {
      window.parent.postMessage({ type: 'DEV_LEAVE_SPLIT', screen: n }, '*');
    }
    return;
  }
  // Address by data-screen, not DOM position, so the original absolute
  // numbering keeps working even though earlier screens are absent.
  var target = document.querySelector('.screen[data-screen="' + n + '"]');
  if (!target) return;
  var leaving = document.querySelector('.screen[data-screen="' + currentScreen + '"]');
  closeEmbedZoom();
  // Remember what the learner did here before the screen goes away — but not
  // during a resume restore: the page is then still the fresh boot screen,
  // and its snapshot would replace the restored record of that screen.
  var painting = typeof resumeIsPainting === 'function' && resumeIsPainting();
  if (leaving && leaving.id && !painting) ssmSave(leaving.id);
  if (leaving) { leaving.classList.remove('active'); leaving.dataset.seen = '1'; }
  currentScreen = n;
  target.classList.add('active');
  mountDeferredMedia(target);
  // Entrance animations play on a screen's FIRST visit only.
  if (target.dataset.seen) skipEntranceAnimations(target);
  updateBackButton();
  resetScreenState(n);
  // A finished part's last button stays disabled after any re-entry (D-8):
  // ssmRestore re-enables a completed screen's forward button.
  try { if (typeof restoreEndedButton === 'function') restoreEndedButton(); } catch (e) {}
  try { if (typeof xapiOnScreen === 'function') xapiOnScreen(n); } catch (e) {}
  try { if (typeof scheduleResumeSave === 'function') scheduleResumeSave(); } catch (e) {}
}

// Media a hidden screen must not fetch at page load carries its source in
// data-src (on <source>) / data-poster (on <video>); entering the screen mounts
// it once. Images rely on loading="lazy" instead.
function mountDeferredMedia(screen) {
  screen.querySelectorAll('video[data-poster]').forEach(function(v) {
    v.poster = v.getAttribute('data-poster');
    v.removeAttribute('data-poster');
  });
  screen.querySelectorAll('source[data-src]').forEach(function(src) {
    src.setAttribute('src', src.getAttribute('data-src'));
    src.removeAttribute('data-src');
    var v = src.parentNode;
    v.load();
    if (v.autoplay) { var p = v.play(); if (p && p.catch) p.catch(function() {}); }
  });
}

function goBack() {
  if (currentScreen <= SPLIT_FIRST) return;
  // s37 (index 31) — phases א/ב share one screen: step back a phase first
  if (currentScreen === 31 && s37GoBackPhase()) return;
  // s39 (index 33) — sections א/ב/ג share one screen: step back a section first
  if (currentScreen === 33 && s39GoBackSection()) return;
  // s47 (index 41) — Q5א/ב/ג share one screen: step back a section first
  if (currentScreen === 41 && s47GoBackSection()) return;
  // s6b (index 7) — carousel internal step takes priority
  if (currentScreen === 7) {
    var cp = window.lomdaState.carouselProgress && window.lomdaState.carouselProgress.s6b;
    if (cp && cp.currentStep > 0) {
      s6bGoToStep(cp.currentStep - 1);
      return;
    }
    goTo(4); // step 0: back to s4
    return;
  }
  // s7 (index 8) — internal step takes priority
  if (currentScreen === 8) {
    var gp = window.lomdaState.guidedPractice.battery;
    if (gp.step > 0) {
      // Keep an unsubmitted formula answer for when "המשך" returns to step 1.
      if (!gp.formulaDone) gp.formulaDraft = document.getElementById('s7-formula-answer').value;
      // Back to step 0 must rebuild its saved state (final feedback +
      // "המשך"), not just unhide it — s7GoToStep() clears all feedback.
      s7GoToStep(0);
      s7RestoreTableStep();
      return;
    }
    goTo(7); // back to s6b (carousel)
    return;
  }
  var target = backMap.hasOwnProperty(currentScreen)
    ? backMap[currentScreen]
    : currentScreen - 1;
  // Screens merged/removed from the DOM (e.g. s48/s49 folded into s47) leave
  // gaps in the numbering — fall back to the nearest existing earlier screen
  // instead of silently doing nothing.
  if (!document.querySelector('.screen[data-screen="' + target + '"]')) {
    var best = null;
    document.querySelectorAll('.screen[data-screen]').forEach(function(s) {
      var v = parseFloat(s.dataset.screen);
      if (v <= target && v >= SPLIT_FIRST && (best === null || v > best)) best = v;
    });
    if (best !== null) target = best;
  }
  goTo(target);
}

function updateBackButton() {
  var backBtn = document.getElementById('global-back-btn');
  if (!backBtn) return;
  if (currentScreen <= SPLIT_FIRST) {
    backBtn.setAttribute('hidden', '');
  } else {
    backBtn.removeAttribute('hidden');
  }
}

function resetScreenState(n) {
  if (n === 0) {
    var cards = document.querySelectorAll('#s0 .option-card');
    cards.forEach(function(card) {
      var isSelected = card.dataset.value === window.lomdaState.selectedCharacter;
      card.classList.toggle('selected', isSelected);
      card.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
    document.getElementById('s0-continue').disabled =
      window.lomdaState.selectedCharacter === null;
  }
  if (n === 1) {
    syncCharFromRegistry('s1', window.lomdaState.selectedCharacter || 'char1');
  }
  if (n === 2) {
    syncCharFromRegistry('s2', window.lomdaState.selectedCharacter || 'char1');
    resetS2Display();
  }
  if (n === 4) {
    s4Init();
  }
  if (n === 7) {
    s6bRestoreState();
  }
  if (n === 8) {
    s7RestoreState();
  }
  if (n === 9)  { s8Init(); }
  if (n === 10) { s16Init(); syncCharFromRegistry('s16', window.lomdaState.selectedCharacter || 'char1'); }
  if (n === 11) { s17Init(); }
  if (n === 12) { s18Init(); }
  if (n >= 13 && n <= 23) { guidedScreenInit(n + 6); }
  if (n === 23) { syncCharFromRegistry('s29', window.lomdaState.selectedCharacter || 'char1'); }
  if (n === 24) { s30Init(); }
  if (n === 25) { s31Init(); }
  if (n === 26) { s32Init(); }
  // ── Part 02 (s33–s39 / data-screen 27–33) ──
  if (n === 27) { s33Init(); }
  if (n === 28) { s34Init(); }
  if (n === 29) { s35Init(); }
  if (n === 30) { s36Init(); }
  if (n === 31) { s37Init(); }
  if (n === 32) { s38Init(); }
  if (n === 33) { s39Init(); }
  // ── Part 03 (s42–s54 / data-screen 36–48) ──
  if (n === 36) { transInit('s42-char-img'); }   // s42 transition (slide 124)
  if (n === 37) { vqInit('s43'); }                // Basic Q1 (125–129)
  if (n === 38) { vqInit('s44'); }                // Basic Q2 (130–134)
  if (n === 39) { vqInit('s45'); }                // Basic Q3 (135–139)
  if (n === 40) { vqInit('s46'); }                // Basic Q4 (140–144)
  if (n === 41) { s47Init(); }                    // Basic Q5א/ב/ג — one scrolling screen (145–158)
  if (n === 44) { transInit('s50-char-img'); }   // s50 transition (slide 160)
  if (n === 45) { vqInit('s51'); }                // Std-B Q1א (161–165)
  if (n === 46) { vqInit('s52'); }                // Std-B Q1ב (166–170)
  if (n === 47) { vqInit('s53'); }                // Std-B Q2א (171–175)
  if (n === 48) { vqInit('s54'); }                // Std-B Q2ב (176–180)
  // ── Parts 04–07 (s55–s76 / data-screen 49–70) ──
  if (n === 49) { transInit('s55-char-img'); }   // s55 transition (slide 183)
  if (n === 50) { s56Init(); }                    // s56 class survey intro (slide 184)
  if (n === 51) { s57Init(); }                    // s57 class survey conclusion — dropdown (slide 184b)
  if (n === 52) { transInit('s58-char-img'); }   // s58 transition (slide 187)
  if (n === 53) { vqInit('s59'); }                // Advanced Q1א (188–192)
  if (n === 54) { vqInit('s60'); }                // Advanced Q1ב (193–197)
  if (n === 55) { vqInit('s61'); }                // Advanced Q1ג (198–202)
  if (n === 56) { vqInit('s62'); }                // Advanced Q2א (203–207)
  if (n === 57) { vqInit('s63'); }                // Advanced Q2ב (208–212)
  if (n === 58) { vqInit('s64'); }                // Advanced Q3א (213–217)
  if (n === 59) { vqInit('s65'); }                // Advanced Q3ב (218–222)
  if (n === 60) { transInit('s66-char-img'); }   // s66 transition (slide 224)
  if (n === 62) { vqInit('s68'); }                // Peak Q1א (226–230)
  if (n === 63) { vqInit('s69'); }                // Peak Q1ב (231–235)
  if (n === 64) { vqInit('s70'); }                // Peak Q1ג (236–240)
  if (n === 65) { vqInit('s71'); }                // Peak Q1ד (241–245)
  if (n === 66) { transInit('s72-char-img'); }   // s72 transition (slide 246)
  if (n === 68) { vqInit('s74'); }                // Peak Q2א (248–251)
  if (n === 69) { vqInit('s75'); }                // Peak Q2ב (252–256)
  if (n === 70) { vqInit('s76'); }                // Peak Q2ג (257–261)
  // Close any open hotspot tooltips on every navigation
  hideAllHotspots();
}

// ============================================================
//  SCREEN 0 — Character Selection
// ============================================================
function selectOption(cardEl) {
  var cards = document.querySelectorAll('#s0 .option-card');
  cards.forEach(function(c) {
    c.classList.remove('selected');
    c.setAttribute('aria-checked', 'false');
  });
  cardEl.classList.add('selected');
  cardEl.setAttribute('aria-checked', 'true');
  window.lomdaState.selectedCharacter = cardEl.dataset.value;
  saveSelectedCharacter(cardEl.dataset.value);   // also writes the state document (resume)
  document.getElementById('s0-continue').disabled = false;
}

function cardKeyHandler(event, cardEl) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    selectOption(cardEl);
  }
}

function advanceFromS0() {
  if (window.lomdaState.selectedCharacter === null) return;
  goTo(1);
}

// ============================================================
//  SCREEN 1 — Character Intro
// ============================================================
function advanceFromS1() {
  goTo(2);
}

// ============================================================
//  SCREEN 2 — Hook Question (SingleChoiceQuestion)
// ============================================================
function s2SelectOption(optionEl) {
  if (s2State.submitted) return;

  var options = document.querySelectorAll('#s2 .s2-option');
  options.forEach(function(o) {
    o.classList.remove('selected');
    o.setAttribute('aria-checked', 'false');
  });
  optionEl.classList.add('selected');
  optionEl.setAttribute('aria-checked', 'true');
  s2State.selected = optionEl.dataset.value;

  document.getElementById('s2-continue').disabled = false;
}

function advanceFromS2() {
  if (!s2State.submitted) {
    // First click: "צדקתי?" → show feedback, lock options
    s2State.submitted = true;
    xapiReport('s2', s2State.selected === '200', true,
      { choices: [xapiOptText(document.querySelector('#s2 .s2-option.selected'))] });

    var options = document.querySelectorAll('#s2 .s2-option');
    options.forEach(function(o) { o.disabled = true; });

    document.getElementById('s2-feedback').removeAttribute('hidden');

    var btn = document.getElementById('s2-continue');
    var feedback = { innerHTML: '' };
    var explanationHtml = '';
    btn.textContent = 'متابعة';
    feedback.innerHTML = scqFeedbackHtml('s36-feedback', '× ×›×•×Ÿ ×ž××•×“!', explanationHtml);
    btn.disabled = false;
  } else {
    // Second click: "המשך" → go to s3
    goTo(3);
  }
}

function resetS2Display() {
  var options  = document.querySelectorAll('#s2 .s2-option');
  var feedback = document.getElementById('s2-feedback');
  var btn      = document.getElementById('s2-continue');

  if (s2State.submitted) {
    options.forEach(function(o) {
      o.disabled = true;
      var isSelected = o.dataset.value === s2State.selected;
      o.classList.toggle('selected', isSelected);
      o.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
    feedback.removeAttribute('hidden');
    btn.textContent = 'متابعة';
    btn.disabled = false;
  } else if (s2State.selected) {
    options.forEach(function(o) {
      o.disabled = false;
      var isSelected = o.dataset.value === s2State.selected;
      o.classList.toggle('selected', isSelected);
      o.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });
    feedback.setAttribute('hidden', '');
    btn.textContent = 'هل إجابتي صحيحة؟';
    btn.disabled = false;
  } else {
    options.forEach(function(o) {
      o.disabled = false;
      o.classList.remove('selected');
      o.setAttribute('aria-checked', 'false');
    });
    feedback.setAttribute('hidden', '');
    btn.textContent = 'هل إجابتي صحيحة؟';
    btn.disabled = true;
  }
}

// ============================================================
//  SCREEN 3 — Context Cards
// ============================================================
function advanceFromS3() {
  goTo(4);
}

// ============================================================
//  SCREEN 4 — Three Methods (TextHotspotScreen)
// ============================================================
function s4Init() {
  syncCharFromRegistry('s4', window.lomdaState.selectedCharacter || 'char1');
}

function advanceFromS4() {
  goTo(7); // → s6b (carousel)
}

function toggleHotspot(btnEl) {
  var wrapper = btnEl.parentElement;
  var isOpen  = wrapper.classList.contains('tooltip-open');

  // Close all first
  hideAllHotspots();

  if (!isOpen) {
    wrapper.classList.add('tooltip-open');
    btnEl.setAttribute('aria-expanded', 'true');
  }
}

function hideAllHotspots() {
  var wrappers = document.querySelectorAll('.info-hotspot-wrapper.tooltip-open');
  wrappers.forEach(function(w) {
    w.classList.remove('tooltip-open');
    var btn = w.querySelector('.info-hotspot');
    if (btn) btn.setAttribute('aria-expanded', 'false');
  });
}

// ============================================================
//  CHARACTER GUIDE — sync video / image to selected character
// ============================================================
function updateCharacterGuide(videoId, imgId) {
  var charId = window.lomdaState.selectedCharacter || 'char1';
  if (videoId) {
    var videoEl = document.getElementById(videoId);
    var srcEl   = document.getElementById(videoId + '-src');
    syncCharacterVideo(videoEl, srcEl, charId);
  }
  if (imgId) {
    var imgEl = document.getElementById(imgId);
    syncCharacterImage(imgEl, charId);
  }
}

// ============================================================
//  SCREEN 6b — CarouselLearningScreen (slides 25–33)
// ============================================================
var S6B_TOTAL_STEPS = 9;

// Each step maps to one PPTX slide (25–33).
// lines[] — text paragraphs; cls = CSS class name
// annotatedLine — sentence with highlighted numbers + arrows to labels (slide 27 only)
// table — triple-value table rows (slides 28–32); each row = [pct, qty]
// formula[] — typeset fraction formula tokens (slides 32–33)
// calc — calculation display (slides 31–32)
// answer — highlighted answer text (slide 32 only)
var S6B_STEPS = [
  // Step 0 — slide 25 — intro
  {
    badge: '',
    lines: [
      { text: 'علينا أن نجد الكمية الكاملة عندما تكون لدينا ثلاثة معطيات تخصّ جزءًا من الكلّ.', cls: 's6b-body-text' },
      { text: 'نعرف النسبة المئوية التي يُشكّلها الجزء من الـ ‎100%، ونريد أن نكتشف ما هي الكمية الكاملة (‎100%).', cls: 's6b-body-text' },
      { text: 'هيا نتعلم كيف نفعل ذلك.', cls: 's6b-body-text' }
    ]
  },
  // Step 1 — slide 26 — reading the data
  {
  badge: '1',
  lines: [
    { text: '<strong>في المرحلة الأولى</strong> سنقرأ المعطيات ونحدّد الكميات والنسب المئوية:', cls: 's6b-body-text' },
    { text: 'لدينا العدد <span class="s6b-num-hl">50</span>، وهو يساوي <span class="s6b-num-hl">‎20%</span> من المجموع الكلي (<span class="s6b-num-hl">‎100%</span>).', cls: 's6b-body-text' },
    { text: 'السؤال هو: ما العدد الذي يقابل الكلّ بالنسبة المئوية (‎100%)؟', cls: 's6b-body-text' }
  ]
},
  // Step 2 — slide 27 — highlighted numbers with arrows pointing to labels
  {
    badge: '1',
    lines: [
      { text: '<strong>في المرحلة الأولى</strong> سنقرأ المعطيات ونحدّد الكميات والنسب المئوية:', cls: 's6b-body-text' }
    ],
    // Arrows point down from each number straight to its label — reading order
    // (right→left): 50 · 20% · 100%.
    annotatedLine: [
      { text: 'لدينا العدد ' },
      { value: '50', label: '50 - الكمية الجزئية' },
      { text: '، وهو يساوي ' },
      { value: '20%', label: '‎20% - الجزء النسبي' },
      { text: ' من المجموع الكلي (الذي يشكّل ' },
      { value: '100%', label: '‎100% - الكلّ بالنسبة المئوية' },
      { text: ').' }
    ]
  },
  // Step 3 — slide 28 — empty table
  {
    badge: '2',
    lines: [
      { text: '<strong>في المرحلة الثانية</strong> سنضع المعطيات التي لدينا في جدول التناسب.', cls: 's6b-body-text' }
    ],
    table: { rows: [['', ''], ['', '']] }
  },
  // Step 4 — slide 29 — כמות column filled
  {
  badge: '2',
  lines: [
    { text: 'نضع <strong>الكمية</strong> الجزئية فوق <strong>الكمية</strong> الكاملة (التي نبحث عنها).', cls: 's6b-body-text' },
    { text: 'في هذا المثال، <strong>الكمية الكاملة</strong> هي المجهول، ونرمز لها بالحرف x.', cls: 's6b-body-text' }
  ],
  table: { rows: [['', '50'], ['', 'x']] }
},
  // Step 5 — slide 30 — both columns filled
  {
    badge: '2',
    lines: [
      { text: 'نضع <strong>النسبة المئوية</strong> المعطاة فوق الكلّ بالنسبة المئوية.', cls: 's6b-body-text' }
    ],
    table: { rows: [['20%', '50'], ['100%', 'x']] }
  },
  // Step 6 — slide 31 — write the proportion equation (equation method,
  // replaces the slide's diagonal multiplication)
  {
    badge: '3',
    lines: [
      { text: '<strong>في المرحلة الثالثة</strong> سنكتب معادلة التناسب:', cls: 's6b-body-text' },
      { text: 'نقسم الكمية على الكمية والنسبة المئوية على النسبة المئوية، بالترتيب نفسه في الطرفين، ونساوي بين النسبتين:', cls: 's6b-body-text' }
    ],
    table: { rows: [['20%', '50'], ['100%', 'x']] },
    hideTableArrow: true,
    mathjax: '$$\\frac{x}{50} = \\frac{100\\%}{20\\%}$$'
  },
  // Step 7 — slide 32 — solve the equation. The "250!" line is the
  // conclusion drawn FROM the calculation, so it renders after the
  // formula (via linesAfter) rather than before it — same right alignment
  // as the line above, just lower in the column.
  {
    badge: '3',
    lines: [
      { text: 'الآن لنحلّ المعادلة:', cls: 's6b-body-text' }
    ],
    // Reserve the previous step's text height so the formula sits at the
    // same height as on slide 31.
    reserveLinesOf: 6,
    linesAfter: [
      { text: '<strong>الكمية الكاملة هي 250!</strong>', cls: 's6b-emphasis-text mm-purple-bold' }
    ],
    table: { rows: [['20%', '50'], ['100%', 'x']] },
    mathjax: '$$\\frac{x}{50} = \\frac{100\\%}{20\\%} \\quad\\longrightarrow\\quad x = 250$$'
  },
  // Step 8 — slide 33 — verification (last step; המשך enabled)
  // The formula is the literal continuation of "...לפי אומדן:" — rendered
  // inline right after that line (mathjaxAfterLine), with the explanatory
  // sentence still following underneath as its own line.
  {
    badge: '4',
    lines: [
      { text: '<strong>لنتحقّق</strong>: هل النتيجة التي حصلنا عليها منطقية؟', cls: 's6b-body-text' },
      { text: 'نتحقّق بأي طريقة تناسبنا، مثلًا بواسطة التقدير:', cls: 's6b-body-text' },
      { text: '50 مقسومًا على 250 يساوي خُمسًا، أي ‎20%.', cls: 's6b-body-text' }
    ],
    mathjax: '$$\\frac{50}{250} = \\frac{1}{5} = 20\\%$$',
    mathjaxAfterLine: 1,
    answer: 'رائع! لقد كنّا على حق!'
  }
];

function s6bInitState() {
  if (!window.lomdaState.carouselProgress) {
    window.lomdaState.carouselProgress = {};
  }
  if (!window.lomdaState.carouselProgress.s6b) {
    window.lomdaState.carouselProgress.s6b = {
      currentStep: 0,
      maxReached:  0,
      completed:   false
    };
  }
}

function s6bGoToStep(n) {
  s6bInitState();
  var cp = window.lomdaState.carouselProgress.s6b;
  cp.currentStep = n;
  if (n > cp.maxReached) {
    cp.maxReached = n;
  }
  if (cp.maxReached >= S6B_TOTAL_STEPS - 1) {
    cp.completed = true;
  }
  s6bRenderStep(n);
  s6bUpdateControls();
}

function s6bNextStep() {
  s6bInitState();
  var cp = window.lomdaState.carouselProgress.s6b;
  if (cp.currentStep < S6B_TOTAL_STEPS - 1) {
    s6bGoToStep(cp.currentStep + 1);
  }
}

function s6bPrevStep() {
  s6bInitState();
  var cp = window.lomdaState.carouselProgress.s6b;
  if (cp.currentStep > 0) {
    s6bGoToStep(cp.currentStep - 1);
  }
}

function s6bRenderStep(n) {
  var step = S6B_STEPS[n];
  if (!step) return;

  var badgeEl    = document.getElementById('s6b-badge');
  var progressEl = document.getElementById('s6b-progress');
  var contentEl  = document.getElementById('s6b-content');
  var tableSlotEl = document.getElementById('s6b-table-slot');

  if (badgeEl) {
    badgeEl.textContent = step.badge || '';
    badgeEl.style.display = step.badge ? '' : 'none';
  }
  var dotsHtml = '';
  for (var d = 0; d < S6B_TOTAL_STEPS; d++) {
    dotsHtml += '<span class="s6b-dot' + (d === n ? ' s6b-dot--active' : '') + '"></span>';
  }
  progressEl.innerHTML = dotsHtml;

  var html = '';

  // Text lines. When step.mathjaxAfterLine is set (a line index), the
  // formula is the literal continuation of THAT line's sentence — render
  // it in the same row as that line instead of as a separate paragraph;
  // any further lines (e.g. a trailing explanation) still follow beneath.
  var mathjaxRendered = false;
  // step.reserveLinesOf: stack this step's lines over an invisible copy of
  // another step's lines (same grid cell), so the block is as tall as the
  // taller of the two and whatever follows starts at the same height.
  var reserveStep = step.reserveLinesOf != null ? S6B_STEPS[step.reserveLinesOf] : null;
  if (reserveStep) {
    html += '<div class="s6b-lines-stack"><div class="s6b-lines-ghost" aria-hidden="true">';
    for (var g = 0; g < reserveStep.lines.length; g++) {
      html += '<p class="' + reserveStep.lines[g].cls + '">' + reserveStep.lines[g].text + '</p>';
    }
    html += '</div><div class="s6b-lines-group">';
  }
  if (step.lines) {
    for (var i = 0; i < step.lines.length; i++) {
      var attachHere = step.mathjax && step.mathjaxAfterLine === i;
      if (attachHere) {
        html += '<div class="s6b-inline-row">';
        html += '<p class="' + step.lines[i].cls + '">' + step.lines[i].text + '</p>';
        html += s6bBuildMathjaxWrap(step, false);
        html += '</div>';
        mathjaxRendered = true;
      } else {
        html += '<p class="' + step.lines[i].cls + '">' + step.lines[i].text + '</p>';
      }
    }
  }
  if (reserveStep) html += '</div></div>';

  // Sentence with numbers highlighted + arrows pointing to labels (slide 27)
  if (step.annotatedLine) {
    html += s6bBuildAnnotatedLine(step.annotatedLine);
  }

  // MathJax formula block (slides 31–33), when not already rendered inline
  // above — when a table is also shown on this step, add a purple arrow
  // pointing from the formula back to it. Skip the connector arrow on the
  // step that already has its own row arrow inside the table (slide 32) —
  // a second arrow there is redundant.
  if (step.mathjax && !mathjaxRendered) {
    html += s6bBuildMathjaxWrap(step, true);
  }

  // Lines that read as the conclusion drawn FROM the formula above (slide 32)
  if (step.linesAfter) {
    for (var j = 0; j < step.linesAfter.length; j++) {
      html += '<p class="' + step.linesAfter[j].cls + '">' + step.linesAfter[j].text + '</p>';
    }
  }

  // Answer highlight (slide 33)
  if (step.answer) {
    html += '<p class="s6b-answer-text">' + step.answer + '</p>';
  }

  contentEl.innerHTML = html;

  // Triple-value table (slides 28–32) — rendered in its own fixed-position
  // column so it never shifts vertically/horizontally as text length varies
  // between steps.
  tableSlotEl.innerHTML = step.table ? s6bBuildTable(step.table.rows, step.table.arrow) : '';
  // With a table, the text column fills the space up to it, so its left edge
  // (and the formula + arrow anchored there) stays put between steps 31–32.
  contentEl.classList.toggle('s6b-content--with-table', !!step.table);

  // Typeset MathJax after inserting dynamic content.
  // This container is re-typeset on every step change (same #s6b-content element,
  // different formula each time) — clear MathJax's previous typeset record for it
  // first, per MathJax's own guidance for repeatedly-changing content, so stale
  // state from an earlier step can't cause a partial/incorrect render of the next.
  if (step.mathjax && window.MathJax && window.MathJax.typesetPromise) {
    if (window.MathJax.typesetClear) window.MathJax.typesetClear([contentEl]);
    window.MathJax.typesetPromise([contentEl]).catch(function () {});
  }
}

// Arrow pointing down from a value to its label.
var S6B_ARROW_DOWN_SVG =
  '<svg class="s6b-inline-arrow-svg" viewBox="0 0 22 31" aria-hidden="true">' +
    '<path d="M11 2 V25 M5 19 L11 25 L17 19" fill="none" stroke="var(--subject-500)" ' +
          'stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg>';

// One sentence, some words are numbers highlighted in bold purple with an
// arrow pointing down from the number to its label. The arrow + label sit in
// an absolutely-positioned wrapper below the number (out of the text flow)
// so they never widen the number's own inline box or disturb the sentence's
// reading order/spacing.
function s6bBuildAnnotatedLine(parts) {
  var h = '<p class="s6b-body-text s6b-annotated-line">';
  for (var i = 0; i < parts.length; i++) {
    var p = parts[i];
    if (p.value) {
      h += '<span class="s6b-inline-annot">' +
             '<span class="s6b-inline-value">' + p.value + '</span>' +
             '<span class="s6b-inline-below">' +
               '<span class="s6b-inline-arrow">' + S6B_ARROW_DOWN_SVG + '</span>' +
               '<span class="s6b-inline-label">' + p.label + '</span>' +
             '</span>' +
           '</span>';
    } else {
      h += p.text;
    }
  }
  h += '</p>';
  return h;
}

function s6bBuildFormula(tokens) {
  var h = '<div class="s6b-formula-block">';
  for (var i = 0; i < tokens.length; i++) {
    var t = tokens[i];
    if (t.frac) {
      h += '<span class="s6b-frac">' +
           '<span class="s6b-frac-num">' + t.frac[0] + '</span>' +
           '<span class="s6b-frac-den">' + t.frac[1] + '</span>' +
           '</span>';
    } else if (t.op) {
      h += '<span class="s6b-formula-op">' + t.op + '</span>';
    } else if (t.result) {
      h += '<span class="s6b-formula-result">' + t.result + '</span>';
    }
  }
  h += '</div>';
  return h;
}

// Subject-accent arrow overlaid between the two top-row values (division step —
// from 50 toward 20%). Inline SVG, so the stroke binds the Subject/500 token
// directly and follows a theme switch.
var S6B_TBL_ROW_ARROW =
  '<svg class="s6b-tbl-row-arrow" viewBox="0 0 60 16" aria-hidden="true">' +
    '<path d="M56 8 H12 M20 2 L12 8 L20 14" fill="none" stroke="var(--subject-500)" ' +
          'stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg>';

// Diagonal cross-multiplication arrow (slide 31 / step 6): from the known
// "100%" cell (bottom-left) up to the known "50" cell (top-right) — the two
// values being multiplied across the diagonal. viewBox matches the table's
// own authored content box (2 cols × 120px, header + 2 rows × 54px); the
// endpoints are pulled in from the cell centers (60,135)/(180,81) along the
// line so the shaft and arrowhead stop short of both numbers instead of
// drawing over them.
var S6B_TBL_DIAG_ARROW =
  '<svg class="s6b-tbl-diag-arrow" viewBox="0 0 240 162" aria-hidden="true">' +
    '<path d="M80 126 L160 90 M149 104 L160 90 L142 89" fill="none" stroke="var(--subject-500)" ' +
          'stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg>';

// Purple arrow pointing left from the formula back toward the table
// (steps that show both) — same shape/token as the row arrow above.
var S6B_MATHJAX_ARROW =
  '<svg class="s6b-mathjax-arrow" viewBox="0 0 60 16" aria-hidden="true">' +
    '<path d="M56 8 H12 M20 2 L12 8 L20 14" fill="none" stroke="var(--subject-500)" ' +
          'stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
  '</svg>';

// Builds the arrow (when applicable) + formula wrapper. `standalone` picks
// the modifier that positions it as its own block (bottom-left, used when
// step.mathjaxInline is not set); inline usage (inside .s6b-inline-row)
// skips that modifier and just sizes to content on the same line as the text.
function s6bBuildMathjaxWrap(step, standalone) {
  var cls = 's6b-mathjax-wrap' + (standalone ? ' s6b-mathjax-wrap--standalone' : '');
  var h = '<div class="' + cls + '">';
  if (step.table && !step.table.arrow) {
    // hideTableArrow: no arrow shown, but its slot is kept so the formula
    // stays at the same spot as on the neighbouring steps.
    h += step.hideTableArrow
      ? S6B_MATHJAX_ARROW.replace('<svg ', '<svg style="visibility:hidden" ')
      : S6B_MATHJAX_ARROW;
  }
  h += '<div class="s6b-mathjax-block">' + step.mathjax + '</div>';
  h += '</div>';
  return h;
}

function s6bBuildTable(rows, arrow) {
  var h = '<div class="s6b-table-wrap">';
  h += '<table class="s6b-triple-table">';
  h += '<thead><tr><th>النسبة المئوية</th><th>الكمية</th></tr></thead>';
  h += '<tbody>';
  for (var i = 0; i < rows.length; i++) {
    var pct = rows[i][0], qty = rows[i][1];
    var pctCls = pct === '' ? 'cell-empty' : 'cell-value';
    var qtyCls = (qty === 'x' || qty === '?') ? 'cell-unknown' : (qty === '' ? 'cell-empty' : 'cell-value');
    h += '<tr>';
    h += '<td class="' + pctCls + '">' + (pct === '' ? '—' : pct) + '</td>';
    h += '<td class="' + qtyCls + '">' + (qty === '' ? '—' : qty) + '</td>';
    h += '</tr>';
  }
  h += '</tbody></table>';
  if (arrow === 'row-top') h += S6B_TBL_ROW_ARROW;
  if (arrow === 'diagonal') h += S6B_TBL_DIAG_ARROW;
  h += '</div>';
  return h;
}

function s6bUpdateControls() {
  s6bInitState();
  var cp      = window.lomdaState.carouselProgress.s6b;
  var prevBtn = document.getElementById('s6b-prev-btn');
  var nextBtn = document.getElementById('s6b-next-btn');
  var contBtn = document.getElementById('s6b-continue');

  if (prevBtn) prevBtn.disabled = (cp.currentStep === 0);
  if (nextBtn) {
    nextBtn.disabled = (cp.currentStep >= S6B_TOTAL_STEPS - 1);
    // Last step: nowhere further to go inside the carousel — hide the arrow
    // (visibility keeps its slot, so the slide area doesn't shift).
    nextBtn.style.visibility = nextBtn.disabled ? 'hidden' : '';
  }
  if (contBtn) contBtn.disabled = !cp.completed;
}

function s6bRestoreState() {
  s6bInitState();
  var cp = window.lomdaState.carouselProgress.s6b;
  s6bRenderStep(cp.currentStep);
  s6bUpdateControls();
}

function advanceFromS6b() {
  goTo(8); // → s7
}

// ============================================================
//  SCREEN 7 — s7: GuidedPracticeScreen (Battery, slides 34–43)
// ============================================================
var S7_CORRECT = { pctPartial: 15, valKnown: 30, pctWhole: 100 };

var S7_FORMULA_CORRECT = 200;

// ── Step routing ──────────────────────────────────────────────
function s7GoToStep(n) {
  var gp = window.lomdaState.guidedPractice.battery;
  gp.step = n;
  document.getElementById('s7-step-0').hidden = (n !== 0);
  document.getElementById('s7-step-1').hidden = (n !== 1);
  document.getElementById('s7-hint-btn').hidden = true;
  document.getElementById('s7-hint-panel').hidden = true;
  document.getElementById('s7-char-bubble').hidden = true;
  document.getElementById('s7-table-feedback').hidden = true;
  document.getElementById('s7-formula-feedback').hidden = true;
}

// ── Full state restore on back-navigation ────────────────────

// Rebuilding a final-wrong feedback re-runs fbtStart(), which opens on the
// solution view. Put back the view (solution / my answer) the learner left.
function s7KeepToggleView(key, show) {
  var prev = fbtRegistry[key] && fbtRegistry[key].view;
  show();
  var e = fbtRegistry[key];
  if (prev && e && e.view !== prev) { e.view = prev; fbtApply(key); }
}

function s7RestoreState() {
  var gp = window.lomdaState.guidedPractice.battery;
  var charId = window.lomdaState.selectedCharacter || 'char1';
  var bubbleImg = document.getElementById('s7-char-img-bubble');
  if (bubbleImg) {
    bubbleImg.src = (CHAR_ASSETS[charId] || CHAR_ASSETS.char1).poses.still;
  }
  s7GoToStep(gp.step);
  if (gp.step === 0) {
    s7RestoreTableStep();
  } else {
    s7RestoreFormulaStep();
  }
}

function s7RestoreTableStep() {
  var gp = window.lomdaState.guidedPractice.battery;
  var ids = ['s7-pct-partial', 's7-val-known', 's7-pct-whole'];
  var keys = ['pctPartial', 'valKnown', 'pctWhole'];
  ids.forEach(function(id, i) {
    var el = document.getElementById(id);
    el.value = gp.tableValues[keys[i]];
    el.disabled = gp.tableDone;
    el.classList.remove('input-correct', 'input-wrong');
  });
  document.getElementById('s7-table-validation').hidden = true;
  document.getElementById('s7-table-feedback').hidden = true;
  document.getElementById('s7-table-feedback').innerHTML = '';
  // The hint button appears on the first wrong attempt and stays for the step.
  document.getElementById('s7-hint-btn').hidden = !(gp.tableAttempts >= 1);
  var btn = document.getElementById('s7-action-btn');

  if (gp.tableDone) {
    // Show the final feedback (correct / pending / revealed) and "המשך" button
    if (gp.tableAttempts === 0 || gp.tableValues.pctPartial !== '') {
      // Re-apply final visual state
      if (gp.tableAttempts > 0) {
        var allCorrect = parseInt(gp.tableValues.pctPartial) === 15 &&
                         parseInt(gp.tableValues.valKnown)   === 30 &&
                         parseInt(gp.tableValues.pctWhole)   === 100;
        if (allCorrect) {
          // Same per-cell marking as the live-submit success path, so
          // returning to this step still shows the V icons.
          s7ApplyTableFieldStyles();
          s7ShowTableFeedback('success');
        } else {
          // Final wrong — back on the view the learner left (View My Answer Toggle).
          s7KeepToggleView('s7-table', function() { s7ShowTableFeedback('error-2'); });
        }
      }
    }
    btn.textContent = 'متابعة';
    btn.disabled = false;
  } else {
    btn.textContent = 'هل إجابتي صحيحة؟';
    // Retry gate: the restored values are the ones just marked wrong.
    btn.disabled = gp.tableAttempts === 1 ||
                   !(gp.tableValues.pctPartial !== '' &&
                     gp.tableValues.valKnown   !== '' &&
                     gp.tableValues.pctWhole   !== '');
    if (gp.tableAttempts === 1) {
      s7ShowTableFeedback('error-1');
      s7ApplyTableFieldStyles(); // retry ✓/✕ per cell
      document.getElementById('s7-hint-btn').hidden = false;
    }
  }
}

function s7RestoreFormulaStep() {
  var gp = window.lomdaState.guidedPractice.battery;
  var inp = document.getElementById('s7-formula-answer');
  inp.value = gp.formulaValue;
  inp.disabled = gp.formulaDone;
  inp.classList.remove('input-correct', 'input-wrong');
  document.getElementById('s7-formula-validation').hidden = true;
  document.getElementById('s7-formula-feedback').hidden = true;
  document.getElementById('s7-formula-feedback').innerHTML = '';
  // The hint button appears on the first wrong attempt and stays for the step.
  document.getElementById('s7-hint-btn').hidden = !(gp.formulaAttempts >= 1);
  var btn = document.getElementById('s7-action-btn');

  if (gp.formulaDone) {
    var wasCorrect = parseInt(gp.formulaValue) === S7_FORMULA_CORRECT;
    if (wasCorrect) {
      s7ShowFormulaFeedback('success');
    } else {
      // Final wrong — back on the view the learner left (View My Answer Toggle).
      s7KeepToggleView('s7-formula', function() { s7ShowFormulaFeedback('error-2'); });
    }
    btn.textContent = 'متابعة';
    btn.disabled = false;
  } else {
    btn.textContent = 'هل إجابتي صحيحة؟';
    // An answer typed but not yet submitted before Back comes back as typed.
    var draft = (gp.formulaDraft != null) ? gp.formulaDraft : gp.formulaValue;
    inp.value = draft;
    // Retry gate: the value just marked wrong stays disabled.
    btn.disabled = draft === '' || (gp.formulaAttempts === 1 && draft === gp.formulaValue);
    if (gp.formulaAttempts === 1) {
      // (The first-wrong feedback was already dismissed once the answer was edited.)
      if (draft === gp.formulaValue) {
        s7ShowFormulaFeedback('error-1');
        inp.classList.add('input-wrong'); // retry ✕
      }
      document.getElementById('s7-hint-btn').hidden = false;
    }
  }
}

// ── Step 0: table input handlers ─────────────────────────────
function s7TableChanged() {
  var ids = ['s7-pct-partial', 's7-val-known', 's7-pct-whole'];
  var hasNonNumeric = false;
  var gpm = window.lomdaState.guidedPractice.battery;
  var tvKeys = { 's7-pct-partial': 'pctPartial', 's7-val-known': 'valKnown', 's7-pct-whole': 'pctWhole' };
  ids.forEach(function(id) {
    var el = document.getElementById(id);
    var cleaned = el.value.replace(/[^\d]/g, '');
    if (el.value !== cleaned) { el.value = cleaned; hasNonNumeric = true; }
    // Retry state: a cell keeps its ✓/✕ only while it holds the judged value.
    var judged = gpm.tableAttempts === 1 && !gpm.tableDone &&
                 String(parseInt(el.value.trim(), 10)) === gpm.tableValues[tvKeys[id]];
    if (!judged) el.classList.remove('input-correct', 'input-wrong');
  });
  document.getElementById('s7-table-validation').hidden = !hasNonNumeric;

  // Hide first-attempt feedback when user edits
  var fb = document.getElementById('s7-table-feedback');
  if (!fb.hidden && window.lomdaState.guidedPractice.battery.tableAttempts < 2) {
    fb.hidden = true;
  }

  var allFilled = ids.every(function(id) {
    return document.getElementById(id).value.trim() !== '';
  });
  // Retry gate: after the first wrong attempt the check button stays
  // disabled until at least one cell differs from the values just submitted.
  var gp = window.lomdaState.guidedPractice.battery;
  var keys = ['pctPartial', 'valKnown', 'pctWhole'];
  var retryLocked = gp.tableAttempts === 1 && !gp.tableDone && ids.every(function(id, i) {
    return String(parseInt(document.getElementById(id).value.trim(), 10)) === gp.tableValues[keys[i]];
  });
  var btn = document.getElementById('s7-action-btn');
  if (btn.textContent !== 'متابعة') btn.disabled = !allFilled || retryLocked;
}

// Pilot: hide the still-visible first-attempt table feedback the moment the
// learner refocuses a cell — before they've typed anything (oninput above
// already hides it once they edit; this closes the click/focus gap called
// for by the pilot spec). Touches only the feedback panel's hidden state —
// no classList, validation-message, or button changes, so nothing else
// about the question's state is altered. Same attempts<2 gate as
// s7TableChanged, so it's a no-op once the table is locked/final.
function s7HideTableFeedbackOnFocus() {
  var fb = document.getElementById('s7-table-feedback');
  if (!fb.hidden && window.lomdaState.guidedPractice.battery.tableAttempts < 2) {
    fb.hidden = true;
  }
}

function s7Step0Submit() {
  var gp = window.lomdaState.guidedPractice.battery;
  var pctP = parseInt(document.getElementById('s7-pct-partial').value.trim(), 10);
  var valK = parseInt(document.getElementById('s7-val-known').value.trim(),   10);
  var pctW = parseInt(document.getElementById('s7-pct-whole').value.trim(),   10);

  // Persist values
  gp.tableValues = {
    pctPartial: String(pctP),
    valKnown:   String(valK),
    pctWhole:   String(pctW)
  };

  var allCorrect = pctP === 15 && valK === 30 && pctW === 100;
  gp.tableAttempts++;
  xapiReport('s7a', allCorrect, allCorrect || gp.tableAttempts >= 2, { steps: {
    'الزمن بالدقائق': document.getElementById('s7-val-known').value.trim(),
    'نسبة مئوية جزئية': document.getElementById('s7-pct-partial').value.trim(),
    'النسبة المئوية الكاملة':  document.getElementById('s7-pct-whole').value.trim() } });

  if (allCorrect) {
    gp.tableDone = true;
    // Mark each cell input-correct so the V icon shows per-cell, same as the
    // input-wrong path below drives the X icon (script.js#L1580-ish).
    s7ApplyTableFieldStyles();
    s7ShowTableFeedback('success');
    s7LockTableInputs();
    var btn = document.getElementById('s7-action-btn');
    btn.textContent = 'متابعة';
    btn.disabled = false;
  } else if (gp.tableAttempts === 1) {
    s7ShowTableFeedback('error-1');
    s7ApplyTableFieldStyles(); // retry ✓/✕ per cell
    document.getElementById('s7-hint-btn').hidden = false;
    // Retry gate: disabled until the learner changes a cell (s7TableChanged).
    document.getElementById('s7-action-btn').disabled = true;
  } else {
    // Final wrong — the correct table shows at once, with
    // "מעבר לתשובה שלי" to bring back the learner's own (View My Answer Toggle).
    gp.tableDone = true;
    s7LockTableInputs();
    s7ShowTableFeedback('error-2');
    var btn2 = document.getElementById('s7-action-btn');
    btn2.textContent = 'متابعة';
    btn2.disabled = false;
  }
}

function s7LockTableInputs() {
  ['s7-pct-partial', 's7-val-known', 's7-pct-whole'].forEach(function(id) {
    document.getElementById(id).disabled = true;
  });
}

function s7ApplyTableFieldStyles() {
  var map = { 's7-pct-partial': 15, 's7-val-known': 30, 's7-pct-whole': 100 };
  Object.keys(map).forEach(function(id) {
    var el = document.getElementById(id);
    el.classList.remove('input-correct', 'input-wrong');
    el.classList.add(parseInt(el.value, 10) === map[id] ? 'input-correct' : 'input-wrong');
  });
}

// S7 feedback popup markup — the shared card (bold title + body), plus the
// optional trailing markup.
function s7FeedbackMarkup(panelId, title, bodyHtml, variant, extraHtml) {
  return scqFeedbackHtml(panelId, title, bodyHtml, variant, extraHtml);
}

function s7CloseFeedback(panelId) {
  var fb = document.getElementById(panelId);
  if (fb) fb.hidden = true;
}

function s7ShowTableFeedback(type) {
  var fb = document.getElementById('s7-table-feedback');
  fb.className = 'feedback-panel';
  fb.hidden = false;

  // הטקסט המעודכן מחולק לפסקאות להצגה נקייה
  var correctText = '<p>30 دقيقة هي الكمية المعروفة – نضعها على اليمين في عمود الزمن (بالدقائق).</p>' +
    '<p>‎15% هي النسبة المئوية المعطاة، نضعها على اليسار، مقابل الكمية التي تخصّها (30 دقيقة).</p>' +
    '<p>‎100% هي الكلّ بالنسبة المئوية.</p>' +
    '<p>x هو الكمية الكاملة (بالدقائق) التي نريد إيجادها.</p>';
  var partialText = '<p>30 دقيقة هي الكمية المعروفة (الزمن بالدقائق) – نضعها على اليمين.</p>' +
    '<p>‎15% هي النسبة المئوية المعطاة، نضعها على اليسار، مقابل عدد الدقائق المعطى.</p>' +
    '<p>‎100% هي النسبة المئوية الكاملة.</p>' +
    '<p>x هو الكمية الكاملة (بالدقائق) التي نريد إيجادها.</p>';

  // Partly right = at least one of the three cells is correct; judged on the
  // submitted values, so a restored popup keeps the same title.
  var tv = window.lomdaState.guidedPractice.battery.tableValues;
  var s7TableIsPartial = parseInt(tv.pctPartial, 10) === 15 ||
                         parseInt(tv.valKnown, 10) === 30 ||
                         parseInt(tv.pctWhole, 10) === 100;
  var wrongTitle = s7TableIsPartial ? 'الإجابة ليست صحيحة بالكامل.' : 'الإجابة غير صحيحة.';

  var title, body, cls;
  if (type === 'success') {
    cls = 'feedback-success';
    title = 'صحيح تمامًا!';
    body = correctText;
  } else if (type === 'error-1') {
    cls = 'feedback-error';
    title = wrongTitle;
    body = '<p>هل نحاول مجددًا؟</p>';
  } else {
    // Final wrong — View My Answer Toggle: the learner's own cells are
    // snapshotted, then the correct table is written into them.
    fb.classList.add('feedback-partial');
    fbtStart('s7-table', { screen: 's7', fbId: 's7-table-feedback',
      title: wrongTitle + '<br>الإجابة الصحيحة مُعلَّمة.', body: partialText,
      fields: [{ id: 's7-pct-partial', correct: 15 },
               { id: 's7-val-known',   correct: 30 },
               { id: 's7-pct-whole',   correct: 100 }] });
    return;
  }
  fb.classList.add(cls);
  fb.innerHTML = s7FeedbackMarkup('s7-table-feedback', title, body);
}

// ── Step 1: formula input handlers ───────────────────────────
function s7FormulaChanged() {
  var inp = document.getElementById('s7-formula-answer');
  var cleaned = inp.value.replace(/[^\d]/g, '');
  if (inp.value !== cleaned) { inp.value = cleaned; }
  document.getElementById('s7-formula-validation').hidden =
    (inp.value === cleaned);

  // Retry ✕ stays only while the field still holds the judged value.
  var gpf = window.lomdaState.guidedPractice.battery;
  inp.classList.remove('input-correct');
  inp.classList.toggle('input-wrong', gpf.formulaAttempts === 1 && !gpf.formulaDone &&
                                      inp.value.trim() === gpf.formulaValue);

  // Hide first-attempt feedback when user edits
  var fb = document.getElementById('s7-formula-feedback');
  if (!fb.hidden && window.lomdaState.guidedPractice.battery.formulaAttempts < 2) {
    fb.hidden = true;
  }

  // Retry gate: same value as the one just marked wrong stays disabled.
  var gp = window.lomdaState.guidedPractice.battery;
  var retryLocked = gp.formulaAttempts === 1 && !gp.formulaDone &&
                    inp.value.trim() === gp.formulaValue;
  var btn = document.getElementById('s7-action-btn');
  if (btn.textContent !== 'متابعة') btn.disabled = inp.value.trim() === '' || retryLocked;
}

// Pilot: same click/focus gap fix as s7HideTableFeedbackOnFocus, for the
// formula-step input. Only touches the feedback panel's hidden state.
function s7HideFormulaFeedbackOnFocus() {
  var fb = document.getElementById('s7-formula-feedback');
  if (!fb.hidden && window.lomdaState.guidedPractice.battery.formulaAttempts < 2) {
    fb.hidden = true;
  }
}

function s7Step1Submit() {
  var gp = window.lomdaState.guidedPractice.battery;
  var inp = document.getElementById('s7-formula-answer');
  var answer = parseInt(inp.value.trim(), 10);
  gp.formulaValue = inp.value.trim();
  gp.formulaDraft = null;
  var isCorrect = answer === S7_FORMULA_CORRECT;
  gp.formulaAttempts++;
  xapiReport('s7b', isCorrect, isCorrect || gp.formulaAttempts >= 2, { value: xapiNumber(inp.value) });

  var explanationHtml = '';

  if (isCorrect) {
    gp.formulaDone = true;
    gp.completed   = true;
    s7ShowFormulaFeedback('success');
    inp.disabled = true;
    var btn = document.getElementById('s7-action-btn');
    btn.textContent = 'متابعة';
    btn.disabled = false;
  } else if (gp.formulaAttempts === 1) {
    s7ShowFormulaFeedback('error-1');
    inp.classList.add('input-wrong'); // retry ✕
    document.getElementById('s7-hint-btn').hidden = false;
    // Retry gate: disabled until the learner changes the value (s7FormulaChanged).
    document.getElementById('s7-action-btn').disabled = true;
  } else {
    // Final wrong — the correct value shows at once, with
    // "מעבר לתשובה שלי" to bring back the learner's own (View My Answer Toggle).
    gp.formulaDone = true;
    inp.disabled = true;
    s7ShowFormulaFeedback('error-2');
    var btn2 = document.getElementById('s7-action-btn');
    btn2.textContent = 'متابعة';
    btn2.disabled = false;
  }
}

function s7ShowFormulaFeedback(type) {
  var fb = document.getElementById('s7-formula-feedback');
  fb.className = 'feedback-panel';
  fb.hidden = false;
  // PPTX slide 25: both end "= 200"; the unit (דקות) is carried by s7Sentence below.
  var s7Sentence = '<p>البطارية المشحونة بنسبة ‎100% تكفي لمدة 200 دقيقة.</p>';
  var sharedResult = '<p class="feedback-formula">$$\\frac{x}{30} = \\frac{100\\%}{15\\%} \\quad\\longrightarrow\\quad x = 200$$</p>' + s7Sentence;
  var wrongResult = sharedResult;
  var title, body, cls;
  if (type === 'success') {
    cls = 'feedback-success';
    title = 'صحيح تمامًا!';
    body = '<p>المعادلة هي:</p>' + sharedResult;
  } else if (type === 'error-1') {
    cls = 'feedback-error';
    title = 'الإجابة غير صحيحة.';
    body = '<p>هل نحاول مجددًا؟</p>';
  } else {
    // Final wrong — View My Answer Toggle (see the table step above).
    fb.classList.add('feedback-error');
    document.getElementById('s7-char-bubble').hidden = true;
    fbtStart('s7-formula', { screen: 's7', fbId: 's7-formula-feedback',
      title: 'هذا خطأ، تعالوا نتعلم منه:', body: '<p>نعوّض المعطيات في المعادلة:</p>' + wrongResult,
      fields: [{ id: 's7-formula-answer', correct: S7_FORMULA_CORRECT }] });
    return;
  }
  fb.classList.add(cls);
  fb.innerHTML = s7FeedbackMarkup('s7-formula-feedback', title, body);
  // No character / speech bubble on this screen's formula feedback.
  document.getElementById('s7-char-bubble').hidden = true;
  if (window.MathJax) MathJax.typesetPromise([fb]);
}

// Character + bubble placement for the formula feedback: the character
// stands on the bottom bar right of the feedback card, in front of it
// (z-index above the card). Placement follows the character's real outline
// (alpha silhouette, sampled per horizontal band), so it may overlap the
// card's empty margins and the space under the answer row but never covers
// any text, button or field of the card or of the question. It grows up to
// 300px wide. The bubble sits left of the face, tail level with the mouth,
// never lower than just above the card. Re-run whenever the card or the
// screen changes size (MathJax typesetting, the View-My-Answer toggle,
// viewport resize).
var S7_CHAR_MOUTH = { 'char-1-opt.png': 0.235, 'char-2-opt.png': 0.37 };

  // mouth height, fraction of image height
var s7CharProfiles = {};

// Leftmost/rightmost opaque x (fraction of width) per horizontal band.
function s7CharProfile(img) {
  var key = img.currentSrc || img.src;
  if (s7CharProfiles[key]) return s7CharProfiles[key];
  var N = 40, L = [], R = [];
  try {
    var c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight;
    var ctx = c.getContext('2d');
    ctx.drawImage(img, 0, 0);
    var d = ctx.getImageData(0, 0, c.width, c.height).data;
    for (var i = 0; i < N; i++) {
      var y0 = Math.round(i * c.height / N), y1 = Math.round((i + 1) * c.height / N);
      var lo = c.width, hi = -1;
      for (var y = y0; y < y1; y += 2) {
        for (var x = 0; x < c.width; x += 2) {
          if (d[(y * c.width + x) * 4 + 3] > 40) { if (x < lo) lo = x; if (x > hi) hi = x; }
        }
      }
      L.push(hi < 0 ? 1 : lo / c.width); R.push(hi < 0 ? 0 : (hi + 1) / c.width);
    }
  } catch (e) {                       // canvas unavailable/tainted — use the full box
    L = []; R = [];
    for (var j = 0; j < N; j++) { L.push(0); R.push(1); }
  }
  return (s7CharProfiles[key] = { L: L, R: R, N: N });
}

// Rects (screen coords) of every text run, button and field inside root.
function s7ContentRects(root, origin, scale) {
  var out = [];
  function add(r) {
    if (r.width && r.height) out.push({
      left: (r.left - origin.left) / scale, right: (r.right - origin.left) / scale,
      top: (r.top - origin.top) / scale, bottom: (r.bottom - origin.top) / scale });
  }
  var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  var range = document.createRange();
  while (walker.nextNode()) {
    if (!walker.currentNode.nodeValue.trim()) continue;
    range.selectNodeContents(walker.currentNode);
    Array.prototype.forEach.call(range.getClientRects(), add);
  }
  root.querySelectorAll('button, input, table, svg, img, mjx-container').forEach(function (el) {
    if (el.offsetParent !== null || el.getClientRects().length) add(el.getBoundingClientRect());
  });
  return out;
}

function s7PlaceCharBubble() {
  var wrap  = document.getElementById('s7-char-bubble');
  var fb    = document.getElementById('s7-formula-feedback');
  var step  = document.getElementById('s7-step-1');
  if (!wrap || wrap.hidden || !fb || fb.hidden || !step) return;
  var img    = document.getElementById('s7-char-img-bubble');
  if (!img.naturalWidth) return;                         // re-run on load
  var bubble = wrap.querySelector('.s7-speech-bubble');
  var origin = wrap.getBoundingClientRect();
  var scale  = origin.width / wrap.offsetWidth || 1;
  var f = fb.getBoundingClientRect();
  var fbLeft  = (f.left - origin.left) / scale;
  var fbRight = (f.right - origin.left) / scale;
  var fbTop   = (f.top - origin.top) / scale;
  var GAP = 6;
  var leftObs  = s7ContentRects(fb, origin, scale);     // character must stay right of these
  var rightObs = s7ContentRects(step, origin, scale);   // ...and left of these
  var prof  = s7CharProfile(img);
  var ratio = img.naturalHeight / img.naturalWidth;
  var feet  = wrap.offsetHeight - 78;                    // bottom: 78px (CSS)
  var best = null;
  for (var w = 300; w >= 80; w -= 4) {
    var h = w * ratio, top = feet - h;
    if (top < 16) continue;
    var lo = fbRight - w, hi = Infinity;                 // keep the character's box right of the card's left part
    for (var i = 0; i < prof.N; i++) {
      var b0 = top + h * i / prof.N, b1 = top + h * (i + 1) / prof.N;
      leftObs.forEach(function (r) {
        if (r.bottom > b0 && r.top < b1) lo = Math.max(lo, r.right + GAP - prof.L[i] * w);
      });
      rightObs.forEach(function (r) {
        if (r.bottom > b0 && r.top < b1) hi = Math.min(hi, r.left - GAP - prof.R[i] * w);
      });
    }
    if (lo <= hi) { best = { w: w, left: lo, h: h }; break; }
  }
  if (!best) best = { w: 80, left: fbRight + GAP, h: 80 * ratio };
  img.style.width = best.w + 'px';
  img.style.left  = best.left + 'px';
  // Bubble tail tip just inside the face's left edge, level with the mouth.
  var file  = (img.currentSrc || img.src).split('/').pop();
  var mouth = S7_CHAR_MOUTH[file] || 0.25;
  var bw = bubble.offsetWidth, bh = bubble.offsetHeight;
  var mouthY = feet - best.h * (1 - mouth);
  var bubbleBottom = Math.max(wrap.offsetHeight - mouthY - bh / 2, wrap.offsetHeight - fbTop + 8);
  bubble.style.left   = Math.max(fbLeft, best.left + best.w * 0.27 - bw - 14) + 'px';
  bubble.style.bottom = bubbleBottom + 'px';
}

(function s7WatchCharBubble() {
  var fb = document.getElementById('s7-formula-feedback');
  var scr = document.getElementById('s7');
  if (!fb || !scr || !window.ResizeObserver) return;
  var ro = new ResizeObserver(function () { s7PlaceCharBubble(); });
  ro.observe(fb);
  ro.observe(scr);
  var img = document.getElementById('s7-char-img-bubble');
  if (img) img.addEventListener('load', s7PlaceCharBubble);
})();

// ── Shared action button dispatcher ──────────────────────────
function s7MainAction() {
  var btn = document.getElementById('s7-action-btn');
  if (btn.textContent === 'متابعة') {
    var gp = window.lomdaState.guidedPractice.battery;
    if (gp.step === 0) {
      s7GoToStep(1);
      s7RestoreFormulaStep();
    } else {
      advanceFromS7();
    }
    return;
  }
  // Submit
  var gp = window.lomdaState.guidedPractice.battery;
  if (gp.step === 0) s7Step0Submit();
  else               s7Step1Submit();
}

// ── Hint ──────────────────────────────────────────────────────
var s7HintTexts = {
  table: '<p><strong>المرحلتان الأولى والثانية في الحساب باستخدام جدول التناسب هما تحديد المعطيات ووضعها في الجدول</strong></p>' +
         '<p>ما هي <strong>الكمية</strong> الجزئية؟</p>' +
         '<p>ما هي <strong>النسبة المئوية</strong> المعطاة؟</p>' +
         '<p>انظروا مرة أخرى إلى السؤال.</p>',
  formula: '<p class="hint-one-line"><strong>المرحلة الثالثة في الحساب باستخدام التناسب هي كتابة المعادلة وحلّها:</strong></p>' +
'<ol>' +
  '<li>نقسم الكمية على الكمية، والنسبة المئوية على النسبة المئوية، بالترتيب نفسه في الطرفين.</li>' +
  '<li>نساوي بين النسبتين ونحلّ المعادلة لإيجاد x.</li>' +
'</ol>'
};

function s7ShowHint() {
  var gp = window.lomdaState.guidedPractice.battery;
  var key = gp.step === 0 ? 'table' : 'formula';
  document.getElementById('s7-hint-content').innerHTML = s7HintTexts[key];
  document.getElementById('s7-hint-panel').hidden = false;
  xapiHint(gp.step === 0 ? 's7a' : 's7b');
}

function s7CloseHint() {
  document.getElementById('s7-hint-panel').hidden = true;
}

// ── Advance ───────────────────────────────────────────────────
function advanceFromS7() {
  goTo(9); // → s8
}

// ============================================================
//  SCREEN 9 — s8: TransitionScreen (PPTX slide 45, new script 180626)
//  methodica-math-percent-03-01-004
// ============================================================
function s8Init() {
  // Swap character image to match selected character
  syncCharFromRegistry('s8', window.lomdaState.selectedCharacter || 'char1');

  // Continue is active immediately (no delay)
  var btn = document.getElementById('s8-continue');
  if (btn) btn.disabled = false;
}

function advanceFromS8() {
  goTo(10);
}

// ============================================================
//  SCREENS 16–18 — בחירות למועצת תלמידים (PPTX slides 45–47)
// ============================================================
function s16Init() {
  var cont = document.getElementById('s16-continue');
  if (cont) cont.disabled = false;
}

function s17Init() {
  var cont = document.getElementById('s17-continue');
  if (cont) cont.disabled = false;
}

function s18Init() {
  window.lomdaState.s18 = { answered: false };
  var yesBtn = document.getElementById('s18-btn-yes');
  var noBtn  = document.getElementById('s18-btn-no');
  if (yesBtn) { yesBtn.disabled = false; yesBtn.classList.remove('s18-btn-selected'); }
  if (noBtn)  { noBtn.disabled = false; noBtn.classList.remove('s18-btn-selected'); }
  var cont = document.getElementById('s18-continue');
  if (cont) cont.disabled = true;
  ssmRestore('s18');
}

// Slide 29: this reflection has no correct answer. Both choices use the
// same neutral selected state; answering still unlocks Continue.
function s18Answer(answer) {
  var st = window.lomdaState.s18;
  if (!st || st.answered) return;
  st.answered = true;
  var yesBtn = document.getElementById('s18-btn-yes');
  var noBtn  = document.getElementById('s18-btn-no');
  if (yesBtn) yesBtn.disabled = true;
  if (noBtn)  noBtn.disabled = true;
  var selectedBtn = (answer === 'yes') ? yesBtn : noBtn;
  if (selectedBtn) selectedBtn.classList.add('s18-btn-selected');
  var cont = document.getElementById('s18-continue');
  if (cont) cont.disabled = false;
}

// ============================================================
//  SCREENS 19–29 — generic guided exercise helpers
// ============================================================
var GUIDED_ANSWER_SCREENS = [20, 21, 23, 27];

function guidedScreenInit(n) {
  var screenId = 's' + n;
  var cont = document.getElementById(screenId + '-continue');
  if (GUIDED_ANSWER_SCREENS.indexOf(n) === -1) {
    // Text/info screen — continue always enabled
    if (cont) cont.disabled = false;
  } else {
    // Answer screen — reset state
    if (!window.lomdaState[screenId]) window.lomdaState[screenId] = {};
    window.lomdaState[screenId].answered = false;
    if (cont) cont.disabled = true;
    // Re-enable all buttons and hide marks
    var section = document.getElementById(screenId);
    if (section) {
      var btns = section.querySelectorAll('.guided-btn');
      btns.forEach(function(b) { b.disabled = false; b.classList.remove('guided-btn-selected'); });
      var marks = section.querySelectorAll('.guided-correct-mark');
      marks.forEach(function(m) { m.classList.remove('guided-mark-visible'); });
    }
  }
  // Screen state memory — restores the answered flag, the locked buttons and
  // the revealed V markers for the guided answer screens (S20/S21/S23/S27).
  ssmRestore(screenId);
}

function guidedAnswer(screenId, btnId, isCorrect) {
  var st = window.lomdaState[screenId];
  if (!st || st.answered) return;
  st.answered = true;
  // Disable all buttons in this screen
  var section = document.getElementById(screenId);
  if (section) {
    var btns = section.querySelectorAll('.guided-btn');
    btns.forEach(function(b) { b.disabled = true; });
    // The learner's pick gets the purple "selected" fill (Figma behaviour
    // notes); correctness styling comes from data-correct in the CSS.
    var picked = document.getElementById(btnId);
    if (picked) picked.classList.add('guided-btn-selected');
    // Always reveal the V on every correct option in this screen (e.g. S20
    // marks both "גם וגם" and "חיסור") — including after a wrong answer, so
    // the learner sees the correct option clearly marked either way.
    var correctBtns = section.querySelectorAll('.guided-btn[data-correct="1"]');
    correctBtns.forEach(function(b) {
      var mark = document.getElementById(b.id.replace('-btn-', '-mark-'));
      if (mark) mark.classList.add('guided-mark-visible');
    });
  }
  // Enable continue
  var contId = screenId + '-continue';
  var cont = document.getElementById(contId);
  if (cont) cont.disabled = false;
}

// ============================================================
//  REPORT MODAL
//  Figma: 720 - UI Templates › ReportIssueModal - State 01–09.
//  Both fields are required. "שליחת דיווח" looks disabled until both are
//  filled; a field that was visited and left empty shows its red error.
//  Clicking the disabled button reveals the errors instead of submitting.
// ============================================================
var reportTouched = { type: false, text: false };

function reportTypeValue() {
  return document.getElementById('report-type').getAttribute('data-value') || '';
}

function reportTextValue() {
  return document.getElementById('report-text').value.trim();
}

function reportIsComplete() {
  return reportTypeValue() !== '' && reportTextValue() !== '';
}

function updateReportState() {
  var typeErr = reportTouched.type && reportTypeValue() === '';
  var textErr = reportTouched.text && reportTextValue() === '';
  document.getElementById('report-type-field').classList.toggle('has-error', typeErr);
  document.getElementById('report-type-error').hidden = !typeErr;
  document.getElementById('report-type').setAttribute('aria-invalid', typeErr ? 'true' : 'false');
  document.getElementById('report-text-field').classList.toggle('has-error', textErr);
  document.getElementById('report-text-error').hidden = !textErr;
  document.getElementById('report-text').setAttribute('aria-invalid', textErr ? 'true' : 'false');
  document.getElementById('report-submit').setAttribute('aria-disabled', reportIsComplete() ? 'false' : 'true');
}

function openReportModal() {
  document.getElementById('report-modal').removeAttribute('hidden');
  setTimeout(function() {
    var el = document.getElementById('report-type');
    if (el) el.focus();
  }, 40);
}

function tryCloseReportModal() {
  closeReportTypeList(false);
  document.getElementById('report-modal').setAttribute('hidden', '');
  document.getElementById('report-confirm-modal').removeAttribute('hidden');
}

function forceCloseReportModal() {
  document.getElementById('report-modal').setAttribute('hidden', '');
  document.getElementById('report-confirm-modal').setAttribute('hidden', '');
  resetReportForm();
}

function backToReportForm() {
  document.getElementById('report-confirm-modal').setAttribute('hidden', '');
  document.getElementById('report-modal').removeAttribute('hidden');
  setTimeout(function() {
    var el = document.getElementById('report-type');
    if (el) el.focus();
  }, 40);
}

function submitReport() {
  if (!reportIsComplete()) {
    reportTouched.type = true;
    reportTouched.text = true;
    updateReportState();
    var firstEmpty = reportTypeValue() === '' ? 'report-type' : 'report-text';
    document.getElementById(firstEmpty).focus();
    return;
  }
  // The shared 720 form (../unit-js/25-report.js) records the readable label.
  var picked = document.querySelector('#report-type-list [aria-selected="true"]');
  var label = picked ? picked.textContent.trim() : reportTypeValue();
  if (typeof sendIssueReport === 'function') sendIssueReport(label, reportTextValue());
  else console.log('[Report Issue]', { type: label, text: reportTextValue(), screen: currentScreen });
  forceCloseReportModal();
}

function resetReportForm() {
  closeReportTypeList(false);
  setReportType(null);
  document.getElementById('report-text').value = '';
  reportTouched.type = false;
  reportTouched.text = false;
  updateReportState();
}

// ── Issue-type dropdown (custom listbox — Figma State 02/03) ──
function reportTypeOptions() {
  return Array.prototype.slice.call(document.querySelectorAll('#report-type-list [role="option"]'));
}

function setReportType(opt) {
  var btn = document.getElementById('report-type');
  var label = document.getElementById('report-type-value');
  reportTypeOptions().forEach(function(o) {
    o.setAttribute('aria-selected', o === opt ? 'true' : 'false');
  });
  btn.setAttribute('data-value', opt ? opt.getAttribute('data-value') : '');
  label.textContent = opt ? opt.textContent : 'اختاروا خيارًا';
  label.classList.toggle('is-placeholder', !opt);
}

function setReportActiveOption(opt) {
  var list = document.getElementById('report-type-list');
  reportTypeOptions().forEach(function(o) { o.classList.toggle('is-active', o === opt); });
  if (opt) list.setAttribute('aria-activedescendant', opt.id);
  else list.removeAttribute('aria-activedescendant');
}

function openReportTypeList() {
  var btn = document.getElementById('report-type');
  var list = document.getElementById('report-type-list');
  list.hidden = false;
  btn.setAttribute('aria-expanded', 'true');
  btn.classList.add('is-open');
  var selected = list.querySelector('[aria-selected="true"]');
  setReportActiveOption(selected || reportTypeOptions()[0]);
  list.focus();
}

// returnFocus: move focus back to the trigger (keyboard close / selection)
function closeReportTypeList(returnFocus) {
  var btn = document.getElementById('report-type');
  var list = document.getElementById('report-type-list');
  if (!btn || list.hidden) return;
  list.hidden = true;
  btn.setAttribute('aria-expanded', 'false');
  btn.classList.remove('is-open');
  setReportActiveOption(null);
  reportTouched.type = true;
  updateReportState();
  if (returnFocus) btn.focus();
}

(function initReportForm() {
  var btn = document.getElementById('report-type');
  var list = document.getElementById('report-type-list');
  var textarea = document.getElementById('report-text');
  if (!btn || !list || !textarea) return;

  // Keep focus on the open list so clicking the trigger toggles it closed
  btn.addEventListener('mousedown', function(e) { if (!list.hidden) e.preventDefault(); });
  btn.addEventListener('click', function() {
    if (list.hidden) openReportTypeList();
    else closeReportTypeList(true);
  });
  btn.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      openReportTypeList();
    }
  });

  reportTypeOptions().forEach(function(opt) {
    opt.addEventListener('mouseenter', function() { setReportActiveOption(opt); });
    opt.addEventListener('mousedown', function(e) { e.preventDefault(); });
    opt.addEventListener('click', function() {
      setReportType(opt);
      closeReportTypeList(true);
    });
  });

  list.addEventListener('keydown', function(e) {
    var opts = reportTypeOptions();
    var active = list.querySelector('.is-active');
    var i = opts.indexOf(active);
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setReportActiveOption(opts[Math.min(i + 1, opts.length - 1)]);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setReportActiveOption(opts[Math.max(i - 1, 0)]);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setReportActiveOption(opts[0]);
    } else if (e.key === 'End') {
      e.preventDefault();
      setReportActiveOption(opts[opts.length - 1]);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (active) setReportType(active);
      closeReportTypeList(true);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      closeReportTypeList(true);
    } else if (e.key === 'Tab') {
      closeReportTypeList(false);
    }
  });
  list.addEventListener('blur', function() { closeReportTypeList(false); });

  // Close when clicking anywhere else inside the modal
  document.getElementById('report-modal').addEventListener('mousedown', function(e) {
    if (!list.hidden && !e.target.closest('.report-select-wrap')) closeReportTypeList(false);
  });

  textarea.addEventListener('input', updateReportState);
  textarea.addEventListener('blur', function() {
    reportTouched.text = true;
    updateReportState();
  });

  updateReportState();
})();

document.addEventListener('keydown', function(event) {
  // s6b carousel: right = next step, left = prev step
  if (currentScreen === 7) {
    if (event.key === 'ArrowRight') { event.preventDefault(); s6bNextStep(); return; }
    if (event.key === 'ArrowLeft')  { event.preventDefault(); s6bPrevStep(); return; }
  }

  if (event.key !== 'Escape') return;

  var confirmModal = document.getElementById('report-confirm-modal');
  var reportModal  = document.getElementById('report-modal');

  if (!confirmModal.hasAttribute('hidden')) {
    backToReportForm();
    return;
  }
  if (!reportModal.hasAttribute('hidden')) {
    tryCloseReportModal();
    return;
  }
  // Close s7 hint panel
  var hintPanel = document.getElementById('s7-hint-panel');
  if (hintPanel && !hintPanel.hasAttribute('hidden')) {
    s7CloseHint();
    return;
  }
  var vqZoomModal = document.getElementById('vq-zoom-modal');
  if (vqZoomModal && !vqZoomModal.hasAttribute('hidden')) {
    vqCloseZoom();
    return;
  }
  if (closeEmbedZoom()) return;
  var imgZoomModal = document.getElementById('img-zoom-modal');
  if (imgZoomModal && !imgZoomModal.classList.contains('hidden')) {
    closeImgZoomModal();
    return;
  }
  hideAllHotspots();
});

// ============================================================
//  CLICK-OUTSIDE — close hotspot tooltips
// ============================================================
document.addEventListener('click', function(event) {
  if (!event.target.closest('.info-hotspot-wrapper')) {
    hideAllHotspots();
  }
});

// ============================================================
//  SCREEN 30 — s30: TransitionScreen (PPTX slide 60)
// ============================================================
var s30TimerId = null;

function s30Init() {
  clearTimeout(s30TimerId);
  syncCharFromRegistry('s30', window.lomdaState.selectedCharacter || 'char1');
  var overlay = document.getElementById('s30-countdown-overlay');
  if (overlay) overlay.hidden = true;
  var btn = document.getElementById('s30-start-btn');
  if (btn) { btn.hidden = false; btn.disabled = false; }
}

function s30Start() {
  var btn = document.getElementById('s30-start-btn');
  if (btn) btn.hidden = true;
  goTo(25);
}

// ============================================================
//  SCREEN 31 — s31: ValueInputQuestion — warmup ice cream (PPTX slide 61)
// ============================================================
var s31State = { attempts: 0, done: false };

// SVG check/✕ badges (s38/s39 approved feedback-icon pattern), reused for s31/s32.
var S31_CORRECT_SVG = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#219653"/><path d="M9 16.5L13.5 21L23 11" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

var S31_WRONG_SVG   = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#B20010"/><path d="M11 11L21 21M21 11L11 21" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function s31Init() {
  s31State.attempts = 0;
  s31State.lastWrong = null;
  s31State.done = false;
  var input = document.getElementById('s31-answer');
  if (input) { input.value = ''; input.disabled = false; input.classList.remove('input-correct', 'input-wrong'); }
  var feedback = document.getElementById('s31-feedback');
  if (feedback) { feedback.hidden = true; feedback.className = 'feedback-panel'; }
  var hintBtn = document.getElementById('s31-hint-btn');
  if (hintBtn) hintBtn.hidden = true;
  var hintPanel = document.getElementById('s31-hint-panel');
  if (hintPanel) hintPanel.hidden = true;
  var btn = document.getElementById('s31-action-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'هل إجابتي صحيحة؟'; }
  ssmRestore('s31');
}

function s31InputChanged() {
  var input = document.getElementById('s31-answer');
  var cleaned = input ? input.value.replace(/[^\d]/g, '') : '';
  var hasNonNumeric = !!input && input.value !== cleaned;
  if (input && hasNonNumeric) input.value = cleaned;
  var validation = document.getElementById('s31-validation');
  if (validation) validation.hidden = !hasNonNumeric;
  var val = cleaned;
  if (!s31State.done) {
    var fb = document.getElementById('s31-feedback');
    if (fb && !fb.hidden) fb.hidden = true;
  }
  document.getElementById('s31-action-btn').disabled = (val === '' || s31State.done || val === s31State.lastWrong);
  // Retry ✕ stays only while the field still holds the judged value.
  var retryInp = document.getElementById('s31-answer');
  if (retryInp && !s31State.done) retryInp.classList.toggle('input-wrong', retryInp.value.trim() === s31State.lastWrong);
}

function s31Submit() {
  if (s31State.done) { advanceFromS31(); return; }
  var input = document.getElementById('s31-answer');
  var raw = input ? input.value.trim().replace(/[^0-9]/g, '') : '';
  var isCorrect = (parseInt(raw, 10) === 20);
  s31State.attempts++;
  xapiReport('s31', isCorrect, isCorrect || s31State.attempts >= 2, { value: xapiNumber(raw) });
  var feedback = document.getElementById('s31-feedback');
  var explanation =
    '<p><span class="nowrap">‎80% من المثلّجات بنكهة الشوكولاتة، وهناك نكهتان فقط.</span><br/>' +
    'إذن لا بدّ أن تكون البقية بنكهة الفانيليا!<br>' +
    '\\(100\\% - 80\\% = 20\\%\\)<br>' +
    'الاستنتاج:</p>' +
    '<p>‎20% من المثلّجات بنكهة الفانيليا.</p>';
  if (isCorrect) {
    s31State.done = true;
    if (input) { input.disabled = true; input.classList.remove('input-wrong'); input.classList.add('input-correct'); }
    feedback.className = 'feedback-panel scq-popup feedback-success';
    feedback.innerHTML = scqFeedbackHtml('s31-feedback', 'صحيح!', explanation);
    feedback.hidden = false;
    if (window.MathJax) MathJax.typesetPromise([feedback]);
    var btn = document.getElementById('s31-action-btn');
    btn.textContent = 'متابعة';
    btn.disabled = false;
  } else if (s31State.attempts === 1) {
    // Retry gate: keep the check button disabled until the answer changes.
    s31State.lastWrong = document.getElementById('s31-answer').value.trim();
    document.getElementById('s31-answer').classList.add('input-wrong'); // retry ✕
    document.getElementById('s31-action-btn').disabled = true;
    feedback.className = 'feedback-panel scq-popup feedback-error';
    feedback.innerHTML = scqFeedbackHtml('s31-feedback', 'ليس تمامًا، حاولوا مرة أخرى.', '');
    feedback.hidden = false;
    document.getElementById('s31-hint-btn').hidden = false;
  } else {
    // Final wrong — View My Answer Toggle.
    s31State.done = true;
    feedback.className = 'feedback-panel scq-popup feedback-error';
    fbtStart('s31', { screen: 's31', fbId: 's31-feedback',
      title: 'هذا خطأ، لكنّ المهمّ أنكم حاولتم!', body: explanation,
      fields: [{ id: 's31-answer', correct: '20' }] });
    var btn = document.getElementById('s31-action-btn');
    btn.textContent = 'متابعة';
    btn.disabled = false;
  }
}

function s31ShowHint()  { document.getElementById('s31-hint-panel').hidden = false; xapiHint('s31'); }

function s31CloseHint() { document.getElementById('s31-hint-panel').hidden = true;  }

function advanceFromS31() { goTo(26); }

// ============================================================
//  SCREEN 32 — s32 | PPTX slides 66–70 | ValueInputQuestion b
//  States: initial → incorrect-1 → (hint) → correct | incorrect-final
// ============================================================
var s32State = { attempts: 0, done: false };

function s32Init() {
  s32State.attempts = 0;
  s32State.lastWrong = null;
  s32State.done = false;
  var inp = document.getElementById('s32-answer');
  if (inp) { inp.value = ''; inp.classList.remove('input-correct', 'input-wrong'); }
  var feedback = document.getElementById('s32-feedback');
  if (feedback) { feedback.hidden = true; feedback.innerHTML = ''; feedback.className = 'feedback-panel'; }
  var hintBtn = document.getElementById('s32-hint-btn');
  if (hintBtn) hintBtn.hidden = true;
  var hintPanel = document.getElementById('s32-hint-panel');
  if (hintPanel) hintPanel.hidden = true;
  var btn = document.getElementById('s32-action-btn');
  if (btn) { btn.textContent = 'هل إجابتي صحيحة؟'; btn.disabled = true; }
  ssmRestore('s32');
}

function s32InputChanged() {
  var inp = document.getElementById('s32-answer');
  var btn = document.getElementById('s32-action-btn');
  if (!inp || !btn) return;
  var cleaned = inp.value.replace(/[^\d]/g, '');
  var hasNonNumeric = inp.value !== cleaned;
  if (hasNonNumeric) inp.value = cleaned;
  var validation = document.getElementById('s32-validation');
  if (validation) validation.hidden = !hasNonNumeric;
  if (!s32State.done) {
    var fb = document.getElementById('s32-feedback');
    if (fb && !fb.hidden) fb.hidden = true;
  }
  btn.disabled = (inp.value.trim() === '' || s32State.done || inp.value.trim() === s32State.lastWrong);
  // Retry ✕ stays only while the field still holds the judged value.
  var retryInp = document.getElementById('s32-answer');
  if (retryInp && !s32State.done) retryInp.classList.toggle('input-wrong', retryInp.value.trim() === s32State.lastWrong);
}

function s32ShowHint() { document.getElementById('s32-hint-panel').hidden = false; xapiHint('s32'); }

function s32CloseHint() { document.getElementById('s32-hint-panel').hidden = true; }

function s32Submit() {
  var btn = document.getElementById('s32-action-btn');
  if (s32State.done) { goTo(27); return; }

  var inp = document.getElementById('s32-answer');
  var raw = inp ? inp.value.trim() : '';
  var isCorrect = (parseInt(raw, 10) === 400);
  s32State.attempts++;
  xapiReport('s32', isCorrect, isCorrect || s32State.attempts >= 2, { value: xapiNumber(raw) });

  var feedback = document.getElementById('s32-feedback');
  var hintBtn  = document.getElementById('s32-hint-btn');

  // RTL table: first column renders on the RIGHT — so כמות ארטיקים first
  // (right side), אחוז second (left side), matching the hint table.
  var tableHtml =
'<table class="guided-table s32-fb-table" dir="rtl">' +
  '<thead><tr><th>عدد المثلّجات</th><th>النسبة المئوية</th></tr></thead>' +
  '<tbody>' +
    '<tr><td>80</td><td>20%</td></tr>' +
    '<tr><td>x</td><td>100%</td></tr>' +
  '</tbody>' +
'</table>';
  var calcHtml =
    tableHtml +
    '<p><strong>\\(\\displaystyle \\frac{x}{80} = \\frac{100\\%}{20\\%} \\quad\\longrightarrow\\quad x = 400\\)</strong></p>' +
    '<p>يوجد في محل البوظة 400 مثلّجة في المجموع.</p>';

  if (isCorrect) {
    // Slide 69 — correct feedback with table and calculation
    s32State.done = true;
    if (inp) { inp.classList.remove('input-wrong'); inp.classList.add('input-correct'); }
    feedback.className = 'feedback-panel scq-popup feedback-success';
    feedback.innerHTML = scqFeedbackHtml('s32-feedback', 'صحيح!',
      '<p>المثلّجات بنكهة الفانيليا تشكّل ‎20% من الكمية. بواسطة جدول التناسب نحسب الكلّ:</p>' + calcHtml);
    feedback.hidden = false;
    if (window.MathJax) MathJax.typesetPromise([feedback]);
    btn.textContent = 'متابعة';
    btn.disabled = false;

  } else if (s32State.attempts === 1) {
    // Retry gate: keep the check button disabled until the answer changes.
    s32State.lastWrong = document.getElementById('s32-answer').value.trim();
    document.getElementById('s32-answer').classList.add('input-wrong'); // retry ✕
    document.getElementById('s32-action-btn').disabled = true;
    // Slide 67 — first incorrect attempt
    feedback.className = 'feedback-panel scq-popup feedback-error';
    feedback.innerHTML = scqFeedbackHtml('s32-feedback', 'هذا خطأ، هل نحاول مجددًا؟', '');
    feedback.hidden = false;
    hintBtn.hidden = false;

  } else {
    // Slide 70 — final incorrect feedback with table and calculation.
    // View My Answer Toggle: 400 goes into the field at once.
    s32State.done = true;
    feedback.className = 'feedback-panel scq-popup feedback-error';
    fbtStart('s32', { screen: 's32', fbId: 's32-feedback',
      title: 'هذا خطأ، لكنّ المهمّ أنكم حاولتم!',
      body: '<p>المثلّجات بنكهة الفانيليا تشكّل ‎20% من الكمية. بواسطة جدول التناسب نحسب الكلّ:</p>' + calcHtml,
      fields: [{ id: 's32-answer', correct: '400' }] });
    btn.textContent = 'متابعة';
    btn.disabled = false;
  }
}

// ============================================================
//  SCREEN 33 — s33 | PPTX slide 72 | TransitionScreen (S30 pattern)
// ============================================================
var s33TimerId = null;

function s33Init() {
  clearTimeout(s33TimerId);
  syncCharFromRegistry('s33', window.lomdaState.selectedCharacter || 'char1');
  var overlay = document.getElementById('s33-countdown-overlay');
  if (overlay) overlay.hidden = true;
  var btn = document.getElementById('s33-start-btn');
  if (btn) { btn.hidden = false; btn.disabled = false; }
}

function s33Start() {
  var btn = document.getElementById('s33-start-btn');
  if (btn) btn.hidden = true;
  var overlay = document.getElementById('s33-countdown-overlay');
  var digit   = document.getElementById('s33-countdown-digit');
  if (!overlay || !digit) { goTo(28); return; }
  var count = 3;
  digit.textContent = count;
  digit.classList.remove('s30-anim');
  void digit.offsetWidth;
  digit.classList.add('s30-anim');
  overlay.hidden = false;
  clearTimeout(s33TimerId);
  function s33Tick() {
    count--;
    if (count <= 0) {
      overlay.hidden = true;
      goTo(28);
      return;
    }
    digit.textContent = count;
    digit.classList.remove('s30-anim');
    void digit.offsetWidth;
    digit.classList.add('s30-anim');
    s33TimerId = setTimeout(s33Tick, 1000);
  }
  s33TimerId = setTimeout(s33Tick, 1000);
}

// ============================================================
//  Shared feedback popup card (reference S17 "scq-popup"):
//  bold title + body. Used by every question screen.
// ============================================================
function scqCloseFeedback(id) {
  var f = document.getElementById(id);
  if (f) f.hidden = true;
}

// Formerly the ✕ close-button markup for s31/s32; feedback popups have no
// manual close any more.
function fbCloseBtn(id) {
  return '';   // no manual close on feedback popups (see scqFeedbackHtml)
}

// V (green check) / X (red) feedback badges — identical to the approved
// s38/s39 feedback-icon SVGs, so scq-popup feedback matches the rest of the lomda.
var SCQ_CORRECT_SVG = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#609E12"/><path d="M9 16.5L13.5 21L23 11" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

var SCQ_WRONG_SVG   = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#B20010"/><path d="M11 11L21 21M21 11L11 21" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Shared feedback popup card: bold title + body (720 "Popup Feedback").
// No ✕ and no V/X badge — the popup has no manual close (720-templates →
// Feedback popup system → No manual close) and the icons aren't in Figma.
// `variant` is accepted for the existing callers and ignored.
// extraHtml: optional markup appended after the body (e.g. the View My
// Answer Toggle actions row from fbtActionsHtml()).
function scqFeedbackHtml(feedbackId, title, bodyHtml, variant, extraHtml) {
  return '<div class="scq-popup-header">' +
           '<p class="scq-popup-title">' + title + '</p>' +
         '</div>' +
         '<div class="scq-popup-body">' + (bodyHtml || '') + '</div>' +
         (extraHtml || '');
}

// ============================================================
//  SCREEN 34 — s34 | PPTX slides 73–77 | ValueInputQuestion 1/6
//  States: initial → incorrect-1 → (hint) → correct | incorrect-final
// ============================================================
var s34State = { attempts: 0, done: false };

function s34Init() {
  s34State.attempts = 0;
  s34State.lastWrong = null;
  s34State.done = false;
  var inp = document.getElementById('s34-answer');
  if (inp) { inp.value = ''; inp.classList.remove('input-correct', 'input-wrong'); }
  var feedback = document.getElementById('s34-feedback');
  if (feedback) { feedback.hidden = true; feedback.innerHTML = ''; feedback.className = 'feedback-panel'; }
  var hintBtn = document.getElementById('s34-hint-btn');
  if (hintBtn) hintBtn.hidden = true;
  var hintPanel = document.getElementById('s34-hint-panel');
  if (hintPanel) hintPanel.hidden = true;
  var btn = document.getElementById('s34-action-btn');
  if (btn) { btn.textContent = 'هل إجابتي صحيحة؟'; btn.disabled = true; }
  ssmRestore('s34');
}

function s34InputChanged() {
  var inp = document.getElementById('s34-answer');
  var btn = document.getElementById('s34-action-btn');
  if (!inp || !btn) return;
  var digitsOnly = inp.value.replace(/[^\d]/g, '');
  if (inp.value !== digitsOnly) inp.value = digitsOnly;
  if (!s34State.done) {
    var fb = document.getElementById('s34-feedback');
    if (fb && !fb.hidden) fb.hidden = true;
  }
  btn.disabled = (inp.value.trim() === '' || s34State.done || inp.value.trim() === s34State.lastWrong);
  // Retry ✕ stays only while the field still holds the judged value.
  var retryInp = document.getElementById('s34-answer');
  if (retryInp && !s34State.done) retryInp.classList.toggle('input-wrong', retryInp.value.trim() === s34State.lastWrong);
}

function s34ShowHint() { document.getElementById('s34-hint-panel').hidden = false; xapiHint('s34'); }

function s34CloseHint() { document.getElementById('s34-hint-panel').hidden = true; }

function s34Submit() {
  var btn = document.getElementById('s34-action-btn');
  if (s34State.done) { goTo(29); return; }

  var inp = document.getElementById('s34-answer');
  var raw = inp ? inp.value.trim() : '';
  var isCorrect = (parseInt(raw, 10) === 200);
  s34State.attempts++;
  xapiReport('s34', isCorrect, isCorrect || s34State.attempts >= 2, { value: xapiNumber(raw) });

  var feedback = document.getElementById('s34-feedback');
  var hintBtn  = document.getElementById('s34-hint-btn');

  var tableHtml =
'<table class="guided-table s34-fb-table" dir="rtl">' +
  '<thead><tr><th>الكمية</th><th>النسبة المئوية</th></tr></thead>' +
  '<tbody>' +
    '<tr><td>150</td><td>75%</td></tr>' +
    '<tr><td>x</td><td>100%</td></tr>' +
  '</tbody>' +
'</table>';

  var calcHtml =
'<div class="fb-calc-row">' +
  '\\(\\displaystyle \\frac{x}{150} = \\frac{100\\%}{75\\%}\\quad\\longrightarrow\\quad x = 200\\)' +
'</div>';

  if (isCorrect) {
    // Slide 76 — correct feedback with table and calculation
    s34State.done = true;
    if (inp) { inp.classList.remove('input-wrong'); inp.classList.add('input-correct'); }
    window.lomdaState.practiceResults.q1 = 'correct';
    feedback.className = 'feedback-panel scq-popup feedback-success';
    feedback.innerHTML = scqFeedbackHtml('s34-feedback', 'صحيح تمامًا!',
        '<p>نحسب باستخدام جدول التناسب:</p>' +
        tableHtml +
        calcHtml +
        '<p>العدد الناقص هو 200.</p>', 'success');
    feedback.hidden = false;
    if (window.MathJax) MathJax.typesetPromise([feedback]);
    btn.textContent = 'متابعة';
    btn.disabled = false;

  } else if (s34State.attempts === 1) {
    // Retry gate: keep the check button disabled until the answer changes.
    s34State.lastWrong = document.getElementById('s34-answer').value.trim();
    document.getElementById('s34-answer').classList.add('input-wrong'); // retry ✕
    document.getElementById('s34-action-btn').disabled = true;
    // Slide 74 — first incorrect
    feedback.className = 'feedback-panel scq-popup feedback-error';
    feedback.innerHTML = scqFeedbackHtml('s34-feedback', 'هذا خطأ، هل نحاول مجددًا؟', '', 'error');
    feedback.hidden = false;
    hintBtn.hidden = false;

  } else {
    // Slide 77 — final incorrect with table and calculation
    s34State.done = true;
    if (inp) { inp.classList.remove('input-correct'); inp.classList.add('input-wrong'); }
    window.lomdaState.practiceResults.q1 = 'incorrect';
    feedback.className = 'feedback-panel scq-popup feedback-error';
    fbtStart('s34', { screen: 's34', fbId: 's34-feedback',
      title: 'هذا خطأ، إليكم الشرح', fields: [{ id: 's34-answer', correct: '200' }],
      body:
        '<p>نحسب باستخدام جدول التناسب:</p>' +
        tableHtml +
        calcHtml +
        '<p>العدد الناقص هو 200.</p>' });  // View My Answer Toggle
    if (window.MathJax) MathJax.typesetPromise([feedback]);
    btn.textContent = 'متابعة';
    btn.disabled = false;
  }
}

// ============================================================
//  SCREEN 35 — s35 | PPTX slides 78–82 | ValueInputQuestion 2/6
//  States: initial → incorrect-1 → (hint) → correct | incorrect-final
// ============================================================
var s35State = { attempts: 0, done: false };

function s35Init() {
  s35State.attempts = 0;
  s35State.lastWrong = null;
  s35State.done = false;
  var inp = document.getElementById('s35-answer');
  if (inp) { inp.value = ''; inp.classList.remove('input-correct', 'input-wrong'); }
  var feedback = document.getElementById('s35-feedback');
  if (feedback) { feedback.hidden = true; feedback.innerHTML = ''; feedback.className = 'feedback-panel'; }
  var hintBtn = document.getElementById('s35-hint-btn');
  if (hintBtn) hintBtn.hidden = true;
  var hintPanel = document.getElementById('s35-hint-panel');
  if (hintPanel) hintPanel.hidden = true;
  var btn = document.getElementById('s35-action-btn');
  if (btn) { btn.textContent = 'هل إجابتي صحيحة؟'; btn.disabled = true; }

  // Set Q1 nav icon based on s34 result
  var q1Result = window.lomdaState.practiceResults.q1;
  var q1Icon  = document.getElementById('s35-nav-q1-icon');
  var q1Label = document.getElementById('s35-nav-q1-label');
  if (q1Icon) {
    if (q1Result === 'correct') {
      q1Icon.className = 's35-nav-icon s35-nav-icon--done';
    } else if (q1Result === 'incorrect') {
      q1Icon.className = 's35-nav-icon s35-nav-icon--wrong';
    } else {
      q1Icon.className = 's35-nav-icon s35-nav-icon--off';
    }
  }
  if (q1Label) {
    q1Label.className = q1Result
      ? 's35-nav-label s35-nav-label--on'
      : 's35-nav-label s35-nav-label--off';
  }
  ssmRestore('s35');
}

function s35InputChanged() {
  var inp = document.getElementById('s35-answer');
  var btn = document.getElementById('s35-action-btn');
  if (!inp || !btn) return;
  var digitsOnly = inp.value.replace(/[^\d]/g, '');
  if (inp.value !== digitsOnly) inp.value = digitsOnly;
  if (!s35State.done) {
    var fb = document.getElementById('s35-feedback');
    if (fb && !fb.hidden) fb.hidden = true;
  }
  btn.disabled = (inp.value.trim() === '' || s35State.done || inp.value.trim() === s35State.lastWrong);
  // Retry ✕ stays only while the field still holds the judged value.
  var retryInp = document.getElementById('s35-answer');
  if (retryInp && !s35State.done) retryInp.classList.toggle('input-wrong', retryInp.value.trim() === s35State.lastWrong);
}

function s35ShowHint() { document.getElementById('s35-hint-panel').hidden = false; xapiHint('s35'); }

function s35CloseHint() { document.getElementById('s35-hint-panel').hidden = true; }

function s35Submit() {
  var btn = document.getElementById('s35-action-btn');
  if (s35State.done) { goTo(30); return; }

  var inp = document.getElementById('s35-answer');
  var raw = inp ? inp.value.trim() : '';
  var isCorrect = (parseInt(raw, 10) === 44);
  s35State.attempts++;
  xapiReport('s35', isCorrect, isCorrect || s35State.attempts >= 2, { value: xapiNumber(raw) });

  var feedback = document.getElementById('s35-feedback');
  var hintBtn  = document.getElementById('s35-hint-btn');

  var tableHtml =
    '<table class="guided-table s35-fb-table" dir="rtl">' +
      '<thead><tr><th>النسبة المئوية</th><th>عدد الطلبات</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>50%</td><td>22</td></tr>' +
        '<tr><td>100%</td><td>x</td></tr>' +
      '</tbody>' +
    '</table>';

  var calcHtml =
    '<div class="fb-calc-row">' +
      '\\(\\displaystyle \\frac{x}{22} = \\frac{100\\%}{50\\%} \\quad\\longrightarrow\\quad x = 44\\)' +
    '</div>';

  if (isCorrect) {
    // Slide 81 — correct feedback
    s35State.done = true;
    if (inp) { inp.classList.remove('input-wrong'); inp.classList.add('input-correct'); }
    window.lomdaState.practiceResults.q2 = 'correct';
    feedback.className = 'feedback-panel scq-popup feedback-success';
    feedback.innerHTML = scqFeedbackHtml('s35-feedback', 'صحيح تمامًا!',
        '<p>يمكننا أن نحسب بالتقدير، لأنّ النسبة المئوية هنا هي ‎50%.</p><p>ومع ذلك، سنعرض الحساب أيضًا باستخدام جدول التناسب.</p>' +
      tableHtml +
      calcHtml +
    '<p>تلقّى المطعم حتى نهاية ذلك المساء 44 طلبًا.</p>', 'success');
    feedback.hidden = false;
    if (window.MathJax) MathJax.typesetPromise([feedback]);
    btn.textContent = 'متابعة';
    btn.disabled = false;

  } else if (s35State.attempts === 1) {
    // Retry gate: keep the check button disabled until the answer changes.
    s35State.lastWrong = document.getElementById('s35-answer').value.trim();
    document.getElementById('s35-answer').classList.add('input-wrong'); // retry ✕
    document.getElementById('s35-action-btn').disabled = true;
    // Slide 79 — first incorrect
    feedback.className = 'feedback-panel scq-popup feedback-error';
    feedback.innerHTML = scqFeedbackHtml('s35-feedback', 'هذا خطأ، هل نحاول مجددًا؟', '', 'error');
    feedback.hidden = false;
    hintBtn.hidden = false;

  } else {
    // Slide 82 — final incorrect with table and calculation
    s35State.done = true;
    if (inp) { inp.classList.remove('input-correct'); inp.classList.add('input-wrong'); }
    window.lomdaState.practiceResults.q2 = 'incorrect';
    feedback.className = 'feedback-panel scq-popup feedback-error';
    fbtStart('s35', { screen: 's35', fbId: 's35-feedback',
      title: 'هذا خطأ، هيا نفهم معًا:', fields: [{ id: 's35-answer', correct: '44' }],
      body:
        '<p>يمكننا أن نحسب بالتقدير، لأنّ النسبة المئوية هنا هي ‎50%.</p><p>ومع ذلك، سنعرض الحساب أيضًا باستخدام جدول التناسب.</p>' +
       tableHtml +
       calcHtml +
'<p>تلقّى المطعم حتى نهاية ذلك المساء 44 طلبًا.</p>' });  // View My Answer Toggle
    if (window.MathJax) MathJax.typesetPromise([feedback]);
    btn.textContent = 'متابعة';
    btn.disabled = false;
  }
}

// ============================================================
//  SCREEN 36 — s36 | PPTX slides 83–87 | ValueInputQuestion 3/6
//  Question: school party fund (1300 ₪ = 65%, find 100%)
//  Correct answer: 2000 (also accept "2,000")
// ============================================================
var s36State = { attempts: 0, done: false };

function s36Init() {
  s36State.attempts = 0;
  s36State.lastWrong = null;
  s36State.done = false;
  var inp = document.getElementById('s36-answer');
  if (inp) { inp.value = ''; inp.classList.remove('input-correct', 'input-wrong'); }
  var feedback = document.getElementById('s36-feedback');
  if (feedback) { feedback.hidden = true; feedback.innerHTML = ''; feedback.className = 'feedback-panel'; }
  var hintBtn = document.getElementById('s36-hint-btn');
  if (hintBtn) hintBtn.hidden = true;
  var hintPanel = document.getElementById('s36-hint-panel');
  if (hintPanel) hintPanel.hidden = true;
  var btn = document.getElementById('s36-action-btn');
  if (btn) { btn.textContent = 'هل إجابتي صحيحة؟'; btn.disabled = true; }

  // Q1 nav icon from s34 result
  var q1Result = window.lomdaState.practiceResults.q1;
  var q1Icon  = document.getElementById('s36-nav-q1-icon');
  var q1Label = document.getElementById('s36-nav-q1-label');
  if (q1Icon) {
    if (q1Result === 'correct')        q1Icon.className = 's36-nav-icon s36-nav-icon--done';
    else if (q1Result === 'incorrect') q1Icon.className = 's36-nav-icon s36-nav-icon--wrong';
    else                               q1Icon.className = 's36-nav-icon s36-nav-icon--off';
  }
  if (q1Label) {
    q1Label.className = q1Result ? 's36-nav-label s36-nav-label--on' : 's36-nav-label s36-nav-label--off';
  }

  // Q2 nav icon from s35 result
  var q2Result = window.lomdaState.practiceResults.q2;
  var q2Icon  = document.getElementById('s36-nav-q2-icon');
  var q2Label = document.getElementById('s36-nav-q2-label');
  if (q2Icon) {
    if (q2Result === 'correct')        q2Icon.className = 's36-nav-icon s36-nav-icon--done';
    else if (q2Result === 'incorrect') q2Icon.className = 's36-nav-icon s36-nav-icon--wrong';
    else                               q2Icon.className = 's36-nav-icon s36-nav-icon--off';
  }
  if (q2Label) {
    q2Label.className = q2Result ? 's36-nav-label s36-nav-label--on' : 's36-nav-label s36-nav-label--off';
  }
  ssmRestore('s36');
}

function s36InputChanged() {
  var inp = document.getElementById('s36-answer');
  var btn = document.getElementById('s36-action-btn');
  if (!inp || !btn) return;
  var digitsOnly = inp.value.replace(/[^\d]/g, '');
  if (inp.value !== digitsOnly) inp.value = digitsOnly;
  if (!s36State.done) {
    var fb = document.getElementById('s36-feedback');
    if (fb && !fb.hidden) fb.hidden = true;
  }
  btn.disabled = (inp.value.trim() === '' || s36State.done || inp.value.trim() === s36State.lastWrong);
  // Retry ✕ stays only while the field still holds the judged value.
  var retryInp = document.getElementById('s36-answer');
  if (retryInp && !s36State.done) retryInp.classList.toggle('input-wrong', retryInp.value.trim() === s36State.lastWrong);
}

function s36ShowHint() { document.getElementById('s36-hint-panel').hidden = false; xapiHint('s36'); }

function s36CloseHint() { document.getElementById('s36-hint-panel').hidden = true; }

function s36Submit() {
  var btn = document.getElementById('s36-action-btn');
  if (s36State.done) { goTo(31); return; }

  var inp = document.getElementById('s36-answer');
  var raw = inp ? inp.value.trim() : '';
  var normalized = parseInt(raw.replace(/,/g, ''), 10);
  var isCorrect = (normalized === 2000);
  s36State.attempts++;
  xapiReport('s36', isCorrect, isCorrect || s36State.attempts >= 2, { value: xapiNumber(raw) });

  var feedback = document.getElementById('s36-feedback');
  var hintBtn  = document.getElementById('s36-hint-btn');

  var tableHtml =
    '<table class="guided-table s36-fb-table" dir="rtl">' +
      '<thead><tr><th>النسبة المئوية</th><th>المبلغ (بالشيكل)</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>65%</td><td>1300</td></tr>' +
        '<tr><td>100%</td><td>x</td></tr>' +
      '</tbody>' +
    '</table>';

  // Slides 86/87 — both calculation steps, one LTR line (s35 pattern)
  var calcHtml =
    '<div class="fb-calc-row">' +
      '\\(\\displaystyle \\frac{x}{1{,}300} = \\frac{100\\%}{65\\%} \\quad\\longrightarrow\\quad x = 2{,}000\\)' +
    '</div>';

  if (isCorrect) {
    // Slide 86 — correct feedback
    s36State.done = true;
    if (inp) { inp.classList.remove('input-wrong'); inp.classList.add('input-correct'); }
    window.lomdaState.practiceResults.q3 = 'correct';
    feedback.className = 'feedback-panel scq-popup feedback-success';
    feedback.innerHTML = scqFeedbackHtml('s36-feedback', 'صحيح تمامًا!',
        '<p>مبلغ 1300 ₪ يشكّل ‎65% من المبلغ المطلوب.</p>' +
        '<p>نحسب المبلغ الكامل (‎100%) باستخدام جدول التناسب:</p>' +
        '<div class="s36-fb-work">' + tableHtml + calcHtml + '</div>' +
        '<p>المبلغ الكامل الذي يجب أن يجمعه الطلاب هو 2,000 ₪.</p>', 'success');
    feedback.hidden = false;
    if (window.MathJax) MathJax.typesetPromise([feedback]);
    btn.textContent = 'متابعة';
    btn.disabled = false;

  } else if (s36State.attempts === 1) {
    // Retry gate: keep the check button disabled until the answer changes.
    s36State.lastWrong = document.getElementById('s36-answer').value.trim();
    document.getElementById('s36-answer').classList.add('input-wrong'); // retry ✕
    document.getElementById('s36-action-btn').disabled = true;
    // Slide 84 — first incorrect
    feedback.className = 'feedback-panel scq-popup feedback-error';
    feedback.innerHTML = scqFeedbackHtml('s36-feedback', 'هذا خطأ، هل نحاول مجددًا؟', '', 'error');
    feedback.hidden = false;
    hintBtn.hidden = false;

  } else {
    // Slide 87 — final incorrect with table
    s36State.done = true;
    if (inp) { inp.classList.remove('input-correct'); inp.classList.add('input-wrong'); }
    window.lomdaState.practiceResults.q3 = 'incorrect';
    feedback.className = 'feedback-panel scq-popup feedback-error';
    fbtStart('s36', { screen: 's36', fbId: 's36-feedback',
      title: 'أخطأتم، لا بأس، فنحن نتعلّم من أخطائنا', fields: [{ id: 's36-answer', correct: '2000' }],
      body:
        '<p>مبلغ 1300 ₪ يشكّل ‎65% من المبلغ المطلوب.</p>' +
        '<p>نحسب المبلغ الكامل (‎100%) باستخدام جدول التناسب:</p>' +
        '<div class="s36-fb-work">' + tableHtml + calcHtml + '</div>' +
        '<p>المبلغ الكامل الذي يجب أن يجمعه الطلاب هو 2,000 ₪.</p>' });  // View My Answer Toggle
    if (window.MathJax) MathJax.typesetPromise([feedback]);
    btn.textContent = 'متابعة';
    btn.disabled = false;
  }
}

// ============================================================
//  SCREEN 37 — s37 | PPTX slides 88–97 | ValueInputQuestion 4/6 (two-phase)
//  Phase A (slides 88–92): gray sector % → correct: 15
//  Phase B (slides 93–97): total area   → correct: 300
// ============================================================
var s37State = {
  phase:     'A',
  attemptsA: 0,
  attemptsB: 0,
  doneA:     false,
  doneB:     false,
  aCorrect:  false
};

function s37Init() {
  s37State.phase     = 'A';
  s37State.attemptsA = 0;
  s37State.attemptsB = 0;
  s37State.lastWrongA = null;
  s37State.lastWrongB = null;
  s37State.doneA     = false;
  s37State.doneB     = false;
  s37State.aCorrect  = false;
  s37State.bar       = {}; // per-phase snapshot of the shared bar (s37SaveBar)

  var inpA = document.getElementById('s37a-answer');
  if (inpA) { inpA.value = ''; inpA.disabled = false; inpA.classList.remove('input-correct', 'input-wrong'); }
  var inpB = document.getElementById('s37b-answer');
  if (inpB) { inpB.value = ''; inpB.disabled = false; inpB.classList.remove('input-correct', 'input-wrong'); }

  var phaseA = document.getElementById('s37-phase-a');
  if (phaseA) phaseA.hidden = false;
  var phaseB = document.getElementById('s37-phase-b');
  if (phaseB) phaseB.hidden = true;

  var feedback = document.getElementById('s37-feedback');
  if (feedback) { feedback.hidden = true; feedback.innerHTML = ''; feedback.className = 'feedback-panel'; }
  var hintBtn = document.getElementById('s37-hint-btn');
  if (hintBtn) hintBtn.hidden = true;
  var hintPanelA = document.getElementById('s37-hint-panel-a');
  if (hintPanelA) hintPanelA.hidden = true;
  var hintPanelB = document.getElementById('s37-hint-panel-b');
  if (hintPanelB) hintPanelB.hidden = true;
  var btn = document.getElementById('s37-action-btn');
  if (btn) { btn.textContent = 'هل إجابتي صحيحة؟'; btn.disabled = true; }

  // Nav Q1 from s34 result
  var q1Result = window.lomdaState.practiceResults.q1;
  var q1Icon  = document.getElementById('s37-nav-q1-icon');
  var q1Label = document.getElementById('s37-nav-q1-label');
  if (q1Icon) {
    if (q1Result === 'correct')        q1Icon.className = 's37-nav-icon s37-nav-icon--done';
    else if (q1Result === 'incorrect') q1Icon.className = 's37-nav-icon s37-nav-icon--wrong';
    else                               q1Icon.className = 's37-nav-icon s37-nav-icon--off';
  }
  if (q1Label) q1Label.className = q1Result ? 's37-nav-label s37-nav-label--on' : 's37-nav-label s37-nav-label--off';

  // Nav Q2 from s35 result
  var q2Result = window.lomdaState.practiceResults.q2;
  var q2Icon  = document.getElementById('s37-nav-q2-icon');
  var q2Label = document.getElementById('s37-nav-q2-label');
  if (q2Icon) {
    if (q2Result === 'correct')        q2Icon.className = 's37-nav-icon s37-nav-icon--done';
    else if (q2Result === 'incorrect') q2Icon.className = 's37-nav-icon s37-nav-icon--wrong';
    else                               q2Icon.className = 's37-nav-icon s37-nav-icon--off';
  }
  if (q2Label) q2Label.className = q2Result ? 's37-nav-label s37-nav-label--on' : 's37-nav-label s37-nav-label--off';

  // Nav Q3 from s36 result
  var q3Result = window.lomdaState.practiceResults.q3;
  var q3Icon  = document.getElementById('s37-nav-q3-icon');
  var q3Label = document.getElementById('s37-nav-q3-label');
  if (q3Icon) {
    if (q3Result === 'correct')        q3Icon.className = 's37-nav-icon s37-nav-icon--done';
    else if (q3Result === 'incorrect') q3Icon.className = 's37-nav-icon s37-nav-icon--wrong';
    else                               q3Icon.className = 's37-nav-icon s37-nav-icon--off';
  }
  if (q3Label) q3Label.className = q3Result ? 's37-nav-label s37-nav-label--on' : 's37-nav-label s37-nav-label--off';
  // Restores phase A/B visibility, both inputs and s37State.doneA/doneB.
  ssmRestore('s37');
}

function s37InputChanged() {
  var btn = document.getElementById('s37-action-btn');
  if (!btn) return;
  var fb = document.getElementById('s37-feedback');
  if (s37State.phase === 'A') {
    var inpA = document.getElementById('s37a-answer');
    if (inpA) {
      var digitsOnlyA = inpA.value.replace(/[^\d]/g, '');
      if (inpA.value !== digitsOnlyA) inpA.value = digitsOnlyA;
    }
    if (fb && !fb.hidden && !s37State.doneA) fb.hidden = true;
    btn.disabled = (s37State.doneA || !inpA || inpA.value.trim() === '' || inpA.value.trim() === s37State.lastWrongA);
  } else {
    var inpB = document.getElementById('s37b-answer');
    if (inpB) {
      var digitsOnlyB = inpB.value.replace(/[^\d]/g, '');
      if (inpB.value !== digitsOnlyB) inpB.value = digitsOnlyB;
    }
    if (fb && !fb.hidden && !s37State.doneB) fb.hidden = true;
    btn.disabled = (s37State.doneB || !inpB || inpB.value.trim() === '' || inpB.value.trim() === s37State.lastWrongB);
  }
  // Retry ✕ stays only while the field still holds the judged value.
  var retryInpA = document.getElementById('s37a-answer');
  if (retryInpA && !s37State.doneA) retryInpA.classList.toggle('input-wrong', retryInpA.value.trim() === s37State.lastWrongA);
  var retryInpB = document.getElementById('s37b-answer');
  if (retryInpB && !s37State.doneB) retryInpB.classList.toggle('input-wrong', retryInpB.value.trim() === s37State.lastWrongB);
}

function s37ShowHint() {
  if (s37State.phase === 'A') {
    document.getElementById('s37-hint-panel-a').hidden = false;
  } else {
    document.getElementById('s37-hint-panel-b').hidden = false;
  }
  xapiHint(s37State.phase === 'A' ? 's37a' : 's37b');
}

function s37CloseHint() {
  document.getElementById('s37-hint-panel-a').hidden = true;
  document.getElementById('s37-hint-panel-b').hidden = true;
}

// The feedback/hint/action bar is shared by both phases, so each phase's bar
// is snapshotted when the learner leaves it and put back when they return —
// via Back from phase ב, or forward again with "המשך". The inputs live inside
// each phase's own (hidden) DOM and keep their state untouched.
function s37SaveBar(phase) {
  var fb = document.getElementById('s37-feedback');
  var hintBtn = document.getElementById('s37-hint-btn');
  var btn = document.getElementById('s37-action-btn');
  if (!fb || !btn) return;
  if (!s37State.bar) s37State.bar = {};
  s37State.bar[phase] = {
    fbHtml: fb.innerHTML, fbClass: fb.className, fbHidden: fb.hidden,
    hintHidden: hintBtn ? hintBtn.hidden : true,
    btnText: btn.textContent, btnDisabled: btn.disabled
  };
}

function s37RestoreBar(phase) {
  var b = s37State.bar && s37State.bar[phase];
  if (!b) return false;
  var fb = document.getElementById('s37-feedback');
  var hintBtn = document.getElementById('s37-hint-btn');
  var btn = document.getElementById('s37-action-btn');
  fb.innerHTML = b.fbHtml; fb.className = b.fbClass; fb.hidden = b.fbHidden;
  if (hintBtn) hintBtn.hidden = b.hintHidden;
  btn.textContent = b.btnText;
  // A resolved phase must always be able to move forward again.
  var done = phase === 'A' ? s37State.doneA : s37State.doneB;
  btn.disabled = done ? false : b.btnDisabled;
  ssmTypesetIfRaw(document.getElementById('s37'));
  return true;
}

function s37ShowPhase(phase) {
  s37SaveBar(s37State.phase);
  s37CloseHint();
  s37State.phase = phase;
  document.getElementById('s37-phase-a').hidden = (phase !== 'A');
  document.getElementById('s37-phase-b').hidden = (phase !== 'B');
  return s37RestoreBar(phase);
}

// Back from phase ב → phase א (restored, not reset). Returns false on phase א
// so goBack() leaves the screen as usual.
function s37GoBackPhase() {
  if (s37State.phase !== 'B') return false;
  s37ShowPhase('A');
  ssmSave('s37');
  return true;
}

function s37StartPhaseB() {
  // Phase ב was already visited (learner went Back to א) — return to it as left.
  if (s37ShowPhase('B')) { ssmSave('s37'); return; }
  var inpB = document.getElementById('s37b-answer');
  if (inpB) { inpB.value = ''; inpB.disabled = false; inpB.classList.remove('input-correct', 'input-wrong'); }
  var feedback = document.getElementById('s37-feedback');
  feedback.hidden = true;
  feedback.innerHTML = '';
  feedback.className = 'feedback-panel';
  var hintBtn = document.getElementById('s37-hint-btn');
  hintBtn.hidden = true;
  var btn = document.getElementById('s37-action-btn');
  btn.textContent = 'هل إجابتي صحيحة؟';
  btn.disabled = true;
}

function s37Submit() {
  var btn = document.getElementById('s37-action-btn');

  /* ── Phase A ── */
  if (s37State.phase === 'A') {
    if (s37State.doneA) { s37StartPhaseB(); return; }

    var inpA = document.getElementById('s37a-answer');
    var raw  = inpA ? inpA.value.trim() : '';
    var isCorrect = (parseInt(raw, 10) === 15);
    s37State.attemptsA++;
    xapiReport('s37a', isCorrect, isCorrect || s37State.attemptsA >= 2, { value: xapiNumber(raw) });

    var feedback = document.getElementById('s37-feedback');
    var hintBtn  = document.getElementById('s37-hint-btn');

    if (isCorrect) {
      // Slide 91 — correct
      s37State.doneA    = true;
      s37State.aCorrect = true;
      if (inpA) { inpA.disabled = true; inpA.classList.remove('input-wrong'); inpA.classList.add('input-correct'); }
      feedback.className = 'feedback-panel scq-popup feedback-success';
      feedback.innerHTML = scqFeedbackHtml('s37-feedback', 'صحيح تمامًا!',
          '<p>علينا أن نكمل إلى ‎100%.</p>' +
          '<p>لذلك نطرح النسب المئوية المعروفة من ‎100%.</p>' +
          '<div class="s37-formula-stack">' +
          '<p class="guided-formula">$$ 100\\% - (31\\% + 24\\% + 18\\% + 12\\%) = $$</p>' +
          '<p class="guided-formula">$$ 100\\% - 85\\% = 15\\% $$</p>' +
          '</div>' +
          '<p>القطاع الرمادي يشكّل ‎15% من الدائرة.</p>', 'success');
      feedback.hidden = false;
      if (window.MathJax) {
        if (MathJax.typesetClear) MathJax.typesetClear([feedback]);
        MathJax.typesetPromise([feedback]);
      }
      btn.textContent = 'متابعة';
      btn.disabled    = false;

    } else if (s37State.attemptsA === 1) {
      // Retry gate: keep the check button disabled until the answer changes.
      s37State.lastWrongA = document.getElementById('s37a-answer').value.trim();
      document.getElementById('s37a-answer').classList.add('input-wrong'); // retry ✕
      btn.disabled = true;
      // Slide 89 — first incorrect
      feedback.className = 'feedback-panel scq-popup feedback-error';
      feedback.innerHTML = scqFeedbackHtml('s37-feedback', 'هذا خطأ، هل نحاول مجددًا؟', '', 'error');
      feedback.hidden  = false;
      hintBtn.hidden   = false;

    } else {
      // Slide 92 — final incorrect
      s37State.doneA    = true;
      s37State.aCorrect = false;
      if (inpA) { inpA.disabled = true; inpA.classList.remove('input-correct'); inpA.classList.add('input-wrong'); }
      feedback.className = 'feedback-panel scq-popup feedback-error';
      fbtStart('s37a', { screen: 's37', fbId: 's37-feedback',
        title: 'أخطأتم، انتبهوا:', fields: [{ id: 's37a-answer', correct: '15' }],
        body:
          '<p>علينا أن نكمل إلى ‎100%.</p>' +
          '<p>لذلك نطرح النسب المئوية المعروفة من ‎100%.</p>' +
          '<div class="s37-formula-stack">' +
          '<p class="guided-formula">$$ 100\\% - (31\\% + 24\\% + 18\\% + 12\\%) = $$</p>' +
          '<p class="guided-formula">$$ 100\\% - 85\\% = 15\\% $$</p>' +
          '</div>' +
          '<p>القطاع الرمادي يشكّل ‎15% من الدائرة.</p>' });  // View My Answer Toggle
      if (window.MathJax) {
        if (MathJax.typesetClear) MathJax.typesetClear([feedback]);
        MathJax.typesetPromise([feedback]);
      }
      btn.textContent = 'متابعة';
      btn.disabled    = false;
    }
    return;
  }

  /* ── Phase B ── */
  if (s37State.doneB) { goTo(32); return; }

  var inpB = document.getElementById('s37b-answer');
  var raw  = inpB ? inpB.value.trim() : '';
  var isCorrect = (parseInt(raw.replace(/,/g, ''), 10) === 300);
  s37State.attemptsB++;
  xapiReport('s37b', isCorrect, isCorrect || s37State.attemptsB >= 2, { value: xapiNumber(raw) });

  var feedback = document.getElementById('s37-feedback');
  var hintBtn  = document.getElementById('s37-hint-btn');

  var tableHtml =
    '<table class="guided-table s37-fb-table" dir="rtl">' +
      '<thead><tr><th>النسبة المئوية</th><th>المساحة (سم²)</th></tr></thead>' +
      '<tbody>' +
        '<tr><td>15%</td><td>45</td></tr>' +
        '<tr><td>100%</td><td>x</td></tr>' +
      '</tbody>' +
    '</table>';

  // Both calculation steps on one LTR line (s35/s36 pattern)
  var calcHtml =
    '<div class="fb-calc-row">' +
      '\\(\\displaystyle \\frac{x}{45} = \\frac{100\\%}{15\\%} \\quad\\longrightarrow\\quad x = 300\\)' +
    '</div>';

  if (isCorrect) {
    // Slide 96 — correct
    s37State.doneB = true;
    window.lomdaState.practiceResults.q4 = s37State.aCorrect ? 'correct' : 'incorrect';
    if (inpB) { inpB.disabled = true; inpB.classList.remove('input-wrong'); inpB.classList.add('input-correct'); }
    feedback.className = 'feedback-panel scq-popup feedback-success';
    feedback.innerHTML = scqFeedbackHtml('s37-feedback', 'صحيح تمامًا!',
        '<p>نضع المعطيات في جدول التناسب:</p>' +
        '<div class="s37-fb-work">' + tableHtml + calcHtml + '</div>' +
        '<p>مساحة الدائرة كلها هي 300 سم².</p>', 'success');
    feedback.hidden = false;
    if (window.MathJax) {
      if (MathJax.typesetClear) MathJax.typesetClear([feedback]);
      MathJax.typesetPromise([feedback]);
    }
    btn.textContent = 'متابعة';
    btn.disabled    = false;

  } else if (s37State.attemptsB === 1) {
    // Retry gate: keep the check button disabled until the answer changes.
    s37State.lastWrongB = document.getElementById('s37b-answer').value.trim();
    document.getElementById('s37b-answer').classList.add('input-wrong'); // retry ✕
    btn.disabled = true;
    // Slide 94 — first incorrect
    feedback.className = 'feedback-panel scq-popup feedback-error';
    feedback.innerHTML = scqFeedbackHtml('s37-feedback', 'هذا خطأ، هل نحاول مجددًا؟', '', 'error');
    feedback.hidden = false;
    hintBtn.hidden  = false;

  } else {
    // Slide 97 — final incorrect
    s37State.doneB = true;
    window.lomdaState.practiceResults.q4 = 'incorrect';
    if (inpB) { inpB.disabled = true; inpB.classList.remove('input-correct'); inpB.classList.add('input-wrong'); }
    feedback.className = 'feedback-panel scq-popup feedback-error';
    fbtStart('s37b', { screen: 's37', fbId: 's37-feedback',
      title: 'أخطأتم، هيا نتعلّم من ذلك:', fields: [{ id: 's37b-answer', correct: '300' }],
      body:
        '<p>نضع المعطيات في جدول التناسب:</p>' +
        '<div class="s37-fb-work">' + tableHtml + calcHtml + '</div>' +
        '<p>مساحة الدائرة كلها هي 300 سم².</p>' });  // View My Answer Toggle
    if (window.MathJax) {
      if (MathJax.typesetClear) MathJax.typesetClear([feedback]);
      MathJax.typesetPromise([feedback]);
    }
    btn.textContent = 'متابعة';
    btn.disabled    = false;
  }
}

// ============================================================
//  SCREEN 38 — s38 | PPTX slides 98–102 | ValueInputQuestion 5/6
//  Two-input table completion.
//  Answer 1 (% החברה להגנת הטבע): 25
//  Answer 2 (count צער בעלי חיים): 18
//  Both must be correct for 'correct' state.
// ============================================================
var S38_CORRECT_SVG = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#609E12"/><path d="M9 16.5L13.5 21L23 11" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

var S38_WRONG_SVG   = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#B20010"/><path d="M11 11L21 21M21 11L11 21" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

// Shared solution tables — used by the correct feedback AND the (S8-pilot)
// reveal-toggle feedback, so both stay byte-identical without duplication.
var S38_TABLE1_HTML =
  '<table class="guided-table s38-fb-table" dir="rtl">' +
    '<thead><tr><th>النسبة المئوية</th><th>عدد الطلاب</th></tr></thead>' +
    '<tbody>' +
      '<tr><td>x</td><td>30</td></tr>' +
      '<tr><td>100%</td><td>120</td></tr>' +
    '</tbody>' +
  '</table>';

var S38_TABLE2_HTML =
  '<table class="guided-table s38-fb-table" dir="rtl">' +
    '<thead><tr><th>النسبة المئوية</th><th>عدد الطلاب</th></tr></thead>' +
    '<tbody>' +
      '<tr><td>15%</td><td>x</td></tr>' +
      '<tr><td>100%</td><td>120</td></tr>' +
    '</tbody>' +
  '</table>';

var s38State = { attempts: 0, done: false };

// s38's popup renders into its own #s38-fb-text slot.
function s38RenderFeedback(fb, title, bodyHtml, actionsHtml) {
  document.getElementById('s38-fb-icon').innerHTML = '';
  document.getElementById('s38-fb-text').innerHTML =
    '<p class="scq-popup-title">' + title + '</p>' + bodyHtml + (actionsHtml || '');
}

// Partly right = one of the two fields is correct (25 / 18).
function s38IsPartial(v1, v2) {
  return parseInt(v1.trim(), 10) === 25 || parseInt(v2.trim(), 10) === 18;
}

function s38Init() {
  s38State.attempts = 0;
  s38State.lastWrong = null;
  s38State.done     = false;
  s38State.revealed = false;

  var inp1 = document.getElementById('s38-answer1');
  if (inp1) { inp1.value = ''; inp1.disabled = false; inp1.classList.remove('input-correct', 'input-wrong'); }
  var inp2 = document.getElementById('s38-answer2');
  if (inp2) { inp2.value = ''; inp2.disabled = false; inp2.classList.remove('input-correct', 'input-wrong'); }

  var feedback = document.getElementById('s38-feedback');
  if (feedback) {
    feedback.hidden = true;
    feedback.className = 's38-feedback';
    document.getElementById('s38-fb-icon').innerHTML = '';
    document.getElementById('s38-fb-text').innerHTML = '';
  }
  var hintBtn = document.getElementById('s38-hint-btn');
  if (hintBtn) hintBtn.hidden = true;
  var hintPopup = document.getElementById('s38-hint-popup');
  if (hintPopup) hintPopup.hidden = true;
  var btn = document.getElementById('s38-action-btn');
  if (btn) { btn.textContent = 'هل إجابتي صحيحة؟'; btn.disabled = true; }

  // Nav icons Q1–Q4 from stored results
  var qKeys = ['q1', 'q2', 'q3', 'q4'];
  var pfx   = 's38';
  qKeys.forEach(function(q) {
    var result = window.lomdaState.practiceResults[q];
    var icon   = document.getElementById(pfx + '-nav-' + q + '-icon');
    var label  = document.getElementById(pfx + '-nav-' + q + '-label');
    if (icon) {
      if (result === 'correct')        icon.className = pfx + '-nav-icon ' + pfx + '-nav-icon--done';
      else if (result === 'incorrect') icon.className = pfx + '-nav-icon ' + pfx + '-nav-icon--wrong';
      else                             icon.className = pfx + '-nav-icon ' + pfx + '-nav-icon--off';
    }
    if (label) label.className = result ? pfx + '-nav-label ' + pfx + '-nav-label--on' : pfx + '-nav-label ' + pfx + '-nav-label--off';
  });

  // Restores both inputs, their V/X marking, the rendered feedback and
  // s38State.done/revealed (so the reveal toggle stays where it was left).
  ssmRestore('s38');
}

function s38InputChanged() {
  var btn = document.getElementById('s38-action-btn');
  if (!btn || s38State.done) return;
  var fb = document.getElementById('s38-feedback');
  if (fb && !fb.hidden) fb.hidden = true;
  var inp1 = document.getElementById('s38-answer1');
  var inp2 = document.getElementById('s38-answer2');
  if (inp1) {
    var digitsOnly1 = inp1.value.replace(/[^\d]/g, '');
    if (inp1.value !== digitsOnly1) inp1.value = digitsOnly1;
  }
  if (inp2) {
    var digitsOnly2 = inp2.value.replace(/[^\d]/g, '');
    if (inp2.value !== digitsOnly2) inp2.value = digitsOnly2;
  }
  var v1 = (inp1 || {}).value || '';
  var v2 = (inp2 || {}).value || '';
  // A field's ✓/✕ clears once it differs from the judged value.
  var judged = (s38State.lastWrong || '').split('|');
  if (inp1 && v1.trim() !== judged[0]) inp1.classList.remove('input-correct', 'input-wrong');
  if (inp2 && v2.trim() !== judged[1]) inp2.classList.remove('input-correct', 'input-wrong');
  btn.disabled = (v1.trim() === '' || v2.trim() === '' ||
                  (v1.trim() + '|' + v2.trim()) === s38State.lastWrong);
}

function s38ShowHint() { document.getElementById('s38-hint-popup').hidden = false; xapiHint('s38'); }

function s38CloseHint() { document.getElementById('s38-hint-popup').hidden = true; }

function s38Submit() {
  var btn = document.getElementById('s38-action-btn');
  if (s38State.done) { goTo(33); return; }

  var v1 = (document.getElementById('s38-answer1') || {}).value || '';
  var v2 = (document.getElementById('s38-answer2') || {}).value || '';
  var isCorrect = (parseInt(v1.trim(), 10) === 25 && parseInt(v2.trim(), 10) === 18);
  s38State.attempts++;
  xapiReport('s38', isCorrect, isCorrect || s38State.attempts >= 2, { steps: [xapiNumber(v1), xapiNumber(v2)] });

  var feedback = document.getElementById('s38-feedback');
  var fbIcon   = document.getElementById('s38-fb-icon');
  var fbText   = document.getElementById('s38-fb-text');
  var hintBtn  = document.getElementById('s38-hint-btn');

  if (isCorrect) {
    // Slide 101 — correct
    s38State.done = true;
    window.lomdaState.practiceResults.q5 = 'correct';
    var okInp1 = document.getElementById('s38-answer1');
    var okInp2 = document.getElementById('s38-answer2');
    okInp1.disabled = true; okInp2.disabled = true;
    okInp1.classList.remove('input-wrong'); okInp1.classList.add('input-correct');
    okInp2.classList.remove('input-wrong'); okInp2.classList.add('input-correct');
    feedback.className = 's38-feedback s5-fb--correct';
    fbIcon.innerHTML = S38_CORRECT_SVG;
    fbText.innerHTML =
      '<p><strong>صحيح تمامًا!</strong></p>' +
      '<p>لإيجاد النسبة المئوية للمتطوعين في جمعية حماية الطبيعة، نبني الجدول التالي:</p>' +
      S38_TABLE1_HTML +
      '<p class="guided-formula">$$ \\frac{x}{100\\%} = \\frac{30}{120} \\quad\\longrightarrow\\quad x = 25\\% $$</p>' +
      '<p>نسبة المتطوعين في جمعية حماية الطبيعة هي ‎25%.</p>' +
      '<p>لإيجاد عدد المتطوعين في جمعية الرفق بالحيوان، نبني الجدول التالي:</p>' +
      S38_TABLE2_HTML +
      '<p class="guided-formula">$$ \\frac{x}{120} = \\frac{15\\%}{100\\%} \\quad\\longrightarrow\\quad x = 18 $$</p>' +
      '<p>يتطوّع 18 طالبًا في جمعية الرفق بالحيوان.</p>';
    feedback.hidden = false;
    if (window.MathJax) {
      if (MathJax.typesetClear) MathJax.typesetClear([feedback]);
      MathJax.typesetPromise([feedback]);
    }
    btn.textContent = 'متابعة';
    btn.disabled    = false;

  } else if (s38State.attempts === 1) {
    // Retry gate: keep the check button disabled until the answer changes.
    s38State.lastWrong = v1.trim() + '|' + v2.trim();
    // Per-field verdict: each field judged against its own value (25 / 18).
    var rInp1 = document.getElementById('s38-answer1');
    var rInp2 = document.getElementById('s38-answer2');
    rInp1.classList.remove('input-correct', 'input-wrong');
    rInp1.classList.add(parseInt(v1.trim(), 10) === 25 ? 'input-correct' : 'input-wrong');
    rInp2.classList.remove('input-correct', 'input-wrong');
    rInp2.classList.add(parseInt(v2.trim(), 10) === 18 ? 'input-correct' : 'input-wrong');
    btn.disabled = true;
    // Slide 99 — first incorrect
    feedback.className = 's38-feedback s5-fb--incorrect';
    fbIcon.innerHTML = S38_WRONG_SVG;
    fbText.innerHTML = '<p><strong>' + (s38IsPartial(v1, v2) ? 'الإجابة ليست صحيحة بالكامل.' : 'الإجابة غير صحيحة.') +
      '</strong></p><p>هل نحاول مجددًا؟</p>';
    feedback.hidden = false;
    hintBtn.hidden  = false;

  } else {
    // Slide 102 — final incorrect. View My Answer Toggle: 25 / 18 go into
    // the fields at once; "מעבר לתשובה שלי" restores the learner's own.
    s38State.done = true;
    window.lomdaState.practiceResults.q5 = 'incorrect';
    feedback.className = 's38-feedback s5-fb--incorrect';
    fbtStart('s38', { screen: 's38', fbId: 's38-feedback',
      title: (s38IsPartial(v1, v2) ? 'الإجابة ليست صحيحة بالكامل.' : 'الإجابة غير صحيحة.') + '<br>انتبهوا إلى الحل:',
      body:
        '<p>لإيجاد النسبة المئوية للمتطوعين في جمعية حماية الطبيعة، نبني الجدول التالي:</p>' +
        S38_TABLE1_HTML +
        '<p class="guided-formula">$$ \\frac{x}{100\\%} = \\frac{30}{120} \\quad\\longrightarrow\\quad x = 25\\% $$</p>' +
        '<p>نسبة المتطوعين في جمعية حماية الطبيعة هي ‎25%.</p>' +
        '<p>لإيجاد عدد المتطوعين في جمعية الرفق بالحيوان، نبني الجدول التالي:</p>' +
        S38_TABLE2_HTML +
        '<p class="guided-formula">$$ \\frac{x}{120} = \\frac{15\\%}{100\\%} \\quad\\longrightarrow\\quad x = 18 $$</p>' +
        '<p>يتطوّع 18 طالبًا في جمعية الرفق بالحيوان.</p>',
      fields: [{ id: 's38-answer1', correct: '25' }, { id: 's38-answer2', correct: '18' }],
      render: s38RenderFeedback });
    btn.textContent = 'متابعة';
    btn.disabled    = false;
  }
}

// ============================================================
//  SCREEN 39 — s39 | SingleChoiceQuestion 6/6 (slides 103–117)
//  Three-section authentic question (שאלה אוריינית) — cottage cheese:
//  Section א (103–107): 5% fat → 250g per container
//  Section ב (108–112): 5 containers → 1,250g total
//  Section ג (113–117): compare 9% vs 5% container → 9% is smaller
// ============================================================
var S39_CORRECT_SVG = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#219653"/><path d="M9 16.5L13.5 21L23 11" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

var S39_WRONG_SVG   = '<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="16" cy="16" r="16" fill="#B20010"/><path d="M11 11L21 21M21 11L11 21" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';

var s39State = { section: 0, selected: -1, attempts: 0, sectionDone: false, allDone: false, hadWrong: false };

var S39_SECTIONS = [
  {
    secElId:      's39-sec-a',
    correctIndex: 3,
    img:          'assets/images/standard_6-opt.png',
    imgAlt:       'علبة جبنة كوتج ‎5% دهون من ماركة "لاكتوزيكا" على طاولة خشبية، وفي الخلفية وعاء وكوب ماء وشرائح خبز',
    // Slide 52: "הפעם אין רמז" — section א has no hint, unlike ב/ג below.
    hintHtml:     null,
    wrong1Html:   '<p>هذا خطأ، هل نحاول مجددًا؟</p>',
    correctHtml: function() {
      var t = '<table class="guided-table s39-fb-table" dir="rtl"><thead><tr><th>النسبة المئوية</th><th>الكمية (بالغرامات)</th></tr></thead><tbody><tr><td>5%</td><td>12.5</td></tr><tr><td>100%</td><td>x</td></tr></tbody></table>';
      var f = '<div class="s39-formula">$$\\frac{x}{12.5} = \\frac{100\\%}{5\\%} \\quad\\longrightarrow\\quad x = 250$$</div>';
      return '<p><strong>صحيح تمامًا!</strong></p><p>نضع المعطيات في جدول التناسب:</p>' + t + f + '<p>تحتوي علبة الكوتج على 250 غرامًا من الجبنة.</p>';
    },
    wrongFinalHtml: function() {
      var t = '<table class="guided-table s39-fb-table" dir="rtl"><thead><tr><th>النسبة المئوية</th><th>الكمية (بالغرامات)</th></tr></thead><tbody><tr><td>5%</td><td>12.5</td></tr><tr><td>100%</td><td>x</td></tr></tbody></table>';
      var f = '<div class="s39-formula">$$\\frac{x}{12.5} = \\frac{100\\%}{5\\%} \\quad\\longrightarrow\\quad x = 250$$</div>';
      return '<p><strong>أخطأتم، لكننا نتعلّم من الأخطاء:</strong></p><p>نضع المعطيات في جدول التناسب:</p>' + t + f + '<p>تحتوي علبة الكوتج على 250 غرامًا من الجبنة.</p>';
    }
  },
  {
    secElId:      's39-sec-b',
    correctIndex: 3,
    img:          'assets/images/standard_6_b-opt.png',
    imgAlt:       'وعاء كبير مليء بجبنة الكوتج مع ملعقة خشبية، وبجانبه علبة كوتج ‎5% دهون، على طاولة خشبية، وفي الخلفية كوب ماء وخبز',
    hintHtml:     'استخدم خالد 5 علب كوتج.<br>ما كمية الكوتج في علبة واحدة؟',
    wrong1Html:   '<p>هذا خطأ، هل نحاول مجددًا؟</p>',
    correctHtml: function() {
      var f = '<div class="s39-formula">$$250 \\cdot 5 = 1{,}250$$</div>';
      return '<p><strong>صحيح تمامًا!</strong></p><p>إذا كانت علبة الكوتج تحتوي على 250 غرامًا من الجبنة،<br/>واستخدمنا 5 علب، فما علينا إلا أن نضرب:</p>' + f + '<p>يوجد في الوعاء 1,250 غرامًا من الكوتج.</p>';
    },
    wrongFinalHtml: function() {
      var f = '<div class="s39-formula">$$250 \\cdot 5 = 1{,}250$$</div>';
      return '<p><strong>هذا خطأ، لكن لا بأس:</strong></p><p>إذا كانت علبة الكوتج تحتوي على 250 غرامًا من الجبنة،<br/>واستخدمنا 5 علب، فما علينا إلا أن نضرب:</p>' + f + '<p>يوجد في الوعاء 1,250 غرامًا من الكوتج.</p>';
    }
  },
  {
    secElId:      's39-sec-c',
    correctIndex: 1,
    img:          'assets/images/standard_6_c.jpeg',
    imgAlt:       'علبة جبنة كوتج ‎9% دهون من ماركة "لاكتوزيكا" على طاولة خشبية',
    hintHtml:     '<strong>حدّدوا المعطيات في العلبة الجديدة:</strong><br>ما هي الكمية الجزئية؟<br>ما هي النسبة المئوية المعطاة؟<br>استعينوا بجدول التناسب – ثم قارنوا النتيجة بكمية العلبة الأولى!',
    wrong1Html:   '<p>هذا خطأ، هل نحاول مجددًا؟</p>',
    correctHtml: function() {
      var t = '<table class="guided-table s39-fb-table" dir="rtl"><thead><tr><th>النسبة المئوية</th><th>الكمية (بالغرامات)</th></tr></thead><tbody><tr><td>9%</td><td>18</td></tr><tr><td>100%</td><td>x</td></tr></tbody></table>';
      var f = '<div class="s39-formula">$$\\frac{x}{18} = \\frac{100\\%}{9\\%} \\quad\\longrightarrow\\quad x = 200$$</div>';
      return '<p><strong>صحيح تمامًا!</strong></p><p>العلبة التي فيها ‎9% دهون أصغر من العلبة التي فيها ‎5% دهون.</p><p>نضع المعطيات في جدول التناسب:</p>' + t + f + '<p>تحتوي العلبة التي فيها ‎9% دهون على 200 غرام.</p><p>هذا أقل مما تحتويه العلبة التي فيها ‎5% دهون، وهو 250 غرامًا.</p>';
    },
    wrongFinalHtml: function() {
      var t = '<table class="guided-table s39-fb-table" dir="rtl"><thead><tr><th>النسبة المئوية</th><th>الكمية (بالغرامات)</th></tr></thead><tbody><tr><td>9%</td><td>18</td></tr><tr><td>100%</td><td>x</td></tr></tbody></table>';
      var f = '<div class="s39-formula">$$\\frac{x}{18} = \\frac{100\\%}{9\\%} \\quad\\longrightarrow\\quad x = 200$$</div>';
      return '<p><strong>هذا خطأ، هيا نشرح:</strong></p><p>العلبة التي فيها ‎9% دهون أصغر من العلبة التي فيها ‎5% دهون.</p><p>نضع المعطيات في جدول التناسب:</p>' + t + f + '<p>تحتوي العلبة التي فيها ‎9% دهون على 200 غرام.</p><p>هذا أقل مما تحتويه العلبة التي فيها ‎5% دهون، وهو 250 غرامًا.</p>';
    }
  }
];

function s39Init() {
  s39State.section     = 0;
  s39State.selected    = -1;
  s39State.attempts    = 0;
  s39State.lastWrong   = null;
  s39State.sectionDone = false;
  s39State.allDone     = false;
  s39State.hadWrong    = false;
  s39State.parts       = {}; // per-section snapshot, kept while moving between sections

  // Show section א, hide ב and ג
  document.getElementById('s39-sec-a').hidden = false;
  document.getElementById('s39-sec-b').hidden = true;
  document.getElementById('s39-sec-c').hidden = true;

  // Reset image to section א
  var img = document.getElementById('s39-img');
  if (img) { img.src = S39_SECTIONS[0].img; img.alt = S39_SECTIONS[0].imgAlt; }

  // Reset all option buttons across all sections
  var allOpts = document.querySelectorAll('#s39 .s39-opt');
  allOpts.forEach(function(btn) { btn.className = 's39-opt'; btn.disabled = false; });

  // Reset feedback
  var fb = document.getElementById('s39-feedback');
  if (fb) {
    fb.hidden = true;
    fb.className = 's39-feedback';
    document.getElementById('s39-fb-icon').innerHTML = '';
    document.getElementById('s39-fb-text').innerHTML = '';
  }

  // Reset hint
  var hintBtn = document.getElementById('s39-hint-btn');
  if (hintBtn) hintBtn.hidden = true;
  var hintPopup = document.getElementById('s39-hint-popup');
  if (hintPopup) hintPopup.hidden = true;

  // Reset action button
  var btn = document.getElementById('s39-action-btn');
  if (btn) { btn.textContent = 'هل إجابتي صحيحة؟'; btn.disabled = true; }

  // Nav Q1–Q5 icons from stored results
  var qKeys = ['q1', 'q2', 'q3', 'q4', 'q5'];
  var pfx   = 's39';
  qKeys.forEach(function(q) {
    var result = window.lomdaState.practiceResults[q];
    var icon   = document.getElementById(pfx + '-nav-' + q + '-icon');
    var label  = document.getElementById(pfx + '-nav-' + q + '-label');
    if (icon) {
      if (result === 'correct')        icon.className = pfx + '-nav-icon ' + pfx + '-nav-icon--done';
      else if (result === 'incorrect') icon.className = pfx + '-nav-icon ' + pfx + '-nav-icon--wrong';
      else                             icon.className = pfx + '-nav-icon ' + pfx + '-nav-icon--off';
    }
    if (label) label.className = result ? pfx + '-nav-label ' + pfx + '-nav-label--on' : pfx + '-nav-label ' + pfx + '-nav-label--off';
  });

  // Restores which section (א/ב/ג) the learner reached, its illustration, the
  // V/X option marking, the rendered feedback and s39State's section/done
  // flags — so a resolved section cannot be answered a second time.
  ssmRestore('s39');
}

function s39Select(idx) {
  if (s39State.sectionDone || s39State.allDone) return;
  s39State.selected = idx;

  var fb = document.getElementById('s39-feedback');
  if (fb && !fb.hidden) fb.hidden = true;

  var secEl = document.getElementById(S39_SECTIONS[s39State.section].secElId);
  if (!secEl) return;
  secEl.querySelectorAll('.s39-opt').forEach(function(btn) {
    btn.classList.remove('selected', 'wrong');
    if (parseInt(btn.dataset.index, 10) === idx) btn.classList.add('selected');
  });

  var btn = document.getElementById('s39-action-btn');
  if (btn) btn.disabled = (idx === s39State.lastWrong);
}

function s39ShowHint() {
  var hintTextEl = document.getElementById('s39-hint-text');
  if (hintTextEl) hintTextEl.innerHTML = S39_SECTIONS[s39State.section].hintHtml;
  document.getElementById('s39-hint-popup').hidden = false;
  xapiHint('s39' + 'abc'.charAt(s39State.section));
}

function s39CloseHint() {
  document.getElementById('s39-hint-popup').hidden = true;
}

function s39Submit() {
  var btn = document.getElementById('s39-action-btn');

  // All sections done → navigate away (s40/41 moved out; this is now the
  // component's last local screen, so it hands off the same way s41 used to)
  // (Only from section ג — after Back, an earlier resolved section moves on to
  // the next section, not out of the screen.)
  if (s39State.allDone && s39State.section === 2) { goTo(36); return; }

  // Current section resolved → advance to next
  if (s39State.sectionDone) { s39AdvanceSection(); return; }

  var sec       = S39_SECTIONS[s39State.section];
  var isCorrect = (s39State.selected === sec.correctIndex);
  s39State.attempts++;
  xapiReport('s39' + 'abc'.charAt(s39State.section), isCorrect, isCorrect || s39State.attempts >= 2,
    { choices: [xapiOptText(document.querySelector('#' + sec.secElId + ' .s39-opt[data-index="' + s39State.selected + '"]'))] });

  var fb      = document.getElementById('s39-feedback');
  var fbIcon  = document.getElementById('s39-fb-icon');
  var fbText  = document.getElementById('s39-fb-text');
  var hintBtn = document.getElementById('s39-hint-btn');
  var secEl   = document.getElementById(sec.secElId);

  if (isCorrect) {
    s39State.sectionDone = true;
    secEl.querySelectorAll('.s39-opt').forEach(function(b) {
      var i = parseInt(b.dataset.index, 10);
      b.className = 's39-opt' + (i === sec.correctIndex ? ' correct' : ' opt-disabled');
      b.disabled  = true;
    });
    fb.className    = 's39-feedback s5-fb--correct';
    fbIcon.innerHTML = S39_CORRECT_SVG;
    fbText.innerHTML = sec.correctHtml();
    fb.hidden        = false;
    btn.textContent  = 'متابعة';
    btn.disabled     = false;
    if (window.MathJax) {
      if (MathJax.typesetClear) MathJax.typesetClear([fb]);
      MathJax.typesetPromise([fb]);
    }

  } else if (s39State.attempts === 1) {
    // Retry gate: keep the check button disabled until the answer changes.
    s39State.lastWrong = s39State.selected;
    // retry ✕ on the pick (the correct option is not revealed yet)
    secEl.querySelectorAll('.s39-opt').forEach(function(b) {
      var isPick = parseInt(b.dataset.index, 10) === s39State.selected;
      b.classList.toggle('wrong', isPick);
      if (isPick) b.classList.remove('selected');
    });
    btn.disabled = true;
    // First wrong — show feedback, reveal hint button
    fb.className    = 's39-feedback s5-fb--incorrect';
    fbIcon.innerHTML = S39_WRONG_SVG;
    fbText.innerHTML = sec.wrong1Html;
    fb.hidden        = false;
    hintBtn.hidden   = !sec.hintHtml;

  } else {
    // Second wrong — show final solution, lock options
    s39State.sectionDone = true;
    s39State.hadWrong    = true;
    secEl.querySelectorAll('.s39-opt').forEach(function(b) {
      var i = parseInt(b.dataset.index, 10);
      if (i === sec.correctIndex) {
        b.className = 's39-opt correct';
      } else if (i === s39State.selected) {
        b.className = 's39-opt wrong';
      } else {
        b.className = 's39-opt opt-disabled';
      }
      b.disabled = true;
    });
    fb.className    = 's39-feedback s5-fb--incorrect';
    fbIcon.innerHTML = S39_WRONG_SVG;
    fbText.innerHTML = sec.wrongFinalHtml();
    fb.hidden        = false;
    btn.textContent  = 'متابعة';
    btn.disabled     = false;
    if (window.MathJax) {
      if (MathJax.typesetClear) MathJax.typesetClear([fb]);
      MathJax.typesetPromise([fb]);
    }
  }
  // No-scroll fix applies ONLY to section ג (index 2); sections א/ב unchanged.
  fb.classList.toggle('s39-fb--secc', s39State.section === 2);
}

// The feedback/hint/action bar and the section's answer state (selection,
// attempts, retry gate, resolved flag) are shared by all three sections, so
// each section's copy is snapshotted when the learner leaves it and put back
// when they return — via Back, or forward again with "המשך". The option
// buttons live inside each section's own (hidden) DOM and keep their state.
function s39SavePart(i) {
  var fb = document.getElementById('s39-feedback');
  var hintBtn = document.getElementById('s39-hint-btn');
  var btn = document.getElementById('s39-action-btn');
  if (!fb || !btn) return;
  if (!s39State.parts) s39State.parts = {};
  s39State.parts[i] = {
    selected: s39State.selected, attempts: s39State.attempts,
    lastWrong: s39State.lastWrong, sectionDone: s39State.sectionDone,
    fbHtml: fb.innerHTML, fbClass: fb.className, fbHidden: fb.hidden,
    hintHidden: hintBtn ? hintBtn.hidden : true,
    btnText: btn.textContent, btnDisabled: btn.disabled
  };
}

// Shows section i (and its illustration). Returns true when section i was
// visited before and its saved state was put back; false on a first visit,
// leaving the caller to set the section up fresh.
function s39ShowSection(i) {
  s39SavePart(s39State.section);
  s39CloseHint();
  s39State.section = i;
  ['s39-sec-a', 's39-sec-b', 's39-sec-c'].forEach(function(id, k) {
    document.getElementById(id).hidden = (k !== i);
  });
  var img = document.getElementById('s39-img');
  if (img) { img.src = S39_SECTIONS[i].img; img.alt = S39_SECTIONS[i].imgAlt; }
  var p = s39State.parts && s39State.parts[i];
  if (!p) return false;
  s39State.selected    = p.selected;
  s39State.attempts    = p.attempts;
  s39State.lastWrong   = p.lastWrong;
  s39State.sectionDone = p.sectionDone;
  var fb = document.getElementById('s39-feedback');
  var hintBtn = document.getElementById('s39-hint-btn');
  var btn = document.getElementById('s39-action-btn');
  fb.innerHTML = p.fbHtml; fb.className = p.fbClass; fb.hidden = p.fbHidden;
  if (hintBtn) hintBtn.hidden = p.hintHidden;
  btn.textContent = p.btnText;
  // A resolved section must always be able to move forward again.
  btn.disabled = p.sectionDone ? false : p.btnDisabled;
  ssmTypesetIfRaw(document.getElementById('s39'));
  return true;
}

// Back from section ב/ג → the previous section (restored, not reset).
// Returns false on section א so goBack() leaves the screen as usual.
function s39GoBackSection() {
  if (s39State.section <= 0) return false;
  s39ShowSection(s39State.section - 1);
  ssmSave('s39');
  return true;
}

function s39AdvanceSection() {
  var next = s39State.section + 1;

  if (next > 2) {
    // All three sections complete — store result and hand off (s40/41 moved
    // out; s39 is now this component's last local screen)
    s39State.allDone = true;
    window.lomdaState.practiceResults.q6 = s39State.hadWrong ? 'incorrect' : 'correct';
    goTo(36);
    return;
  }

  // Section already visited (learner went Back) — return to it as left.
  if (s39ShowSection(next)) { ssmSave('s39'); return; }

  s39State.section     = next;
  s39State.selected    = -1;
  s39State.attempts    = 0;
  s39State.lastWrong   = null;
  s39State.sectionDone = false;

  // Show next section, hide others
  var ids = ['s39-sec-a', 's39-sec-b', 's39-sec-c'];
  ids.forEach(function(id, i) { document.getElementById(id).hidden = (i !== next); });

  // Reset option buttons for new section
  var secEl = document.getElementById(S39_SECTIONS[next].secElId);
  secEl.querySelectorAll('.s39-opt').forEach(function(b) { b.className = 's39-opt'; b.disabled = false; });

  // Update image
  var img = document.getElementById('s39-img');
  var sec = S39_SECTIONS[next];
  if (img) { img.src = sec.img; img.alt = sec.imgAlt; }

  // Clear feedback
  var fb = document.getElementById('s39-feedback');
  fb.hidden    = true;
  fb.className = 's39-feedback';
  document.getElementById('s39-fb-icon').innerHTML = '';
  document.getElementById('s39-fb-text').innerHTML = '';

  // Reset hint
  document.getElementById('s39-hint-btn').hidden   = true;
  document.getElementById('s39-hint-popup').hidden = true;

  // Reset action button
  var btn = document.getElementById('s39-action-btn');
  btn.textContent = 'هل إجابتي صحيحة؟';
  btn.disabled    = true;
}

// ============================================================
//  SCREEN 47 — s47 | Q5א/ב/ג (רון ויהל) — one scrolling screen
//  Slides 145–158. Production note on slide 61: "גלילה לאורך כל סעיפי
//  השאלה" — the three sections live in one shared scroll area instead of
//  three separate screens chained by a continue button, but only ONE
//  section is visible at a time: revealing the next section hides the
//  previous one and resets scroll to the top (see s47RevealSection), so the
//  newly revealed section always lands flush at the top rather than merely
//  peeking in below the one before it. Section א/ג are SingleChoiceQuestion
//  (2-attempt, wrong pick marked + retry-gated, see vqSubmit); section ב is
//  ValueInputQuestion with the same 2-attempt contract.
// ============================================================
var S47_ORDER = ['a', 'b', 'c'];

var s47State = {
  current: 'a', // which section (א/ב/ג) the shared feedback/hint/continue bar targets
  bar: {},      // per-section snapshot of the shared bar, kept while moving between sections
  a: { attempts: 0, done: false, selected: null, lastWrong: null },
  b: { attempts: 0, done: false, lastWrong: null },
  c: { attempts: 0, done: false, selected: null, lastWrong: null }
};

var S47_SECTIONS = {
  a: { // Q5א — אחוז שנותר
    type: 'choice', correctIndex: 2, result: 'b5a',
    correct: { title: 'صحيح تمامًا!',
      body: '<p>النسبة المئوية للتمارين التي حلّها عمر وهدى حتى الآن هي ‎60%<br/>لذلك فإن النسبة المئوية للتمارين التي بقي عليهما حلّها هي:</p>' +
            '<p dir="ltr" style="text-align: center;">$$100\\% - 60\\% = 40\\%$$</p>' +
            '<p>بقي لهما ‎40% من كرّاسة التمارين.</p>' },
    finalWrong: { title: 'هذا خطأ. لنوضّح ذلك:',
      body: '<p>النسبة المئوية للتمارين التي حلّها عمر وهدى حتى الآن هي ‎60%<br/>لذلك فإن النسبة المئوية للتمارين التي بقي عليهما حلّها هي:</p>' +
            '<p dir="ltr" style="text-align: center;">$$100\\% - 60\\% = 40\\%$$</p>' +
            '<p>بقي لهما ‎40% من كرّاسة التمارين.</p>' }
  },
  b: { // Q5ב — סך התרגילים בחוברת
    type: 'input',
    answer: function(r) { return parseInt(r, 10) === 75; },
    solution: '75',
    result: 'b5b',
    correct: { title: 'صحيح تمامًا!',
      body: '<p>إليكم الشرح:</p><p>وجدنا في البند أ أنّه بقي لهما 30 تمرينًا،<br/>وهي تمثّل ‎40% من تمارين الكرّاسة.</p>' +
            '<p>لنحسب باستخدام جدول التناسب:</p>' +
            vqTri('عدد التمارين', '40%', '30', '100%', 'x') +
            '<p>$$\\frac{x}{30} = \\frac{100\\%}{40\\%} \\quad\\longrightarrow\\quad x = 75$$</p>' +
            '<p>تحتوي كرّاسة التحضير للامتحان على 75 تمرينًا.</p>' },
    finalWrong: { title: 'الإجابة غير صحيحة، لا بأس، هيا نتعلّم من ذلك:',
      body: '<p>وجدنا في البند أ أنّه بقي لهما 30 تمرينًا،<br/>وهي تمثّل ‎40% من تمارين الكرّاسة.</p>' +
            '<p>لنحسب باستخدام جدول التناسب:</p>' +
            vqTri('عدد التمارين', '40%', '30', '100%', 'x') +
            '<p>$$\\frac{x}{30} = \\frac{100\\%}{40\\%} \\quad\\longrightarrow\\quad x = 75$$</p>' +
            '<p>تحتوي كرّاسة التحضير للامتحان على 75 تمرينًا.</p>' }
  },
  c: { // Q5ג — slide 63: one attempt, then the final feedback.
    type: 'choice', correctIndex: 0, oneAttempt: true, result: 'b5c',
    correct: { title: 'صحيح تمامًا!',
      body: '<p>حلّ عمر وهدى ‎60% من 75 تمرينًا.</p>' +
            '<p dir="ltr" style="text-align: center;">$$60\\% \\cdot 75 = 45$$</p>' +
            '<p>لقد حلّا 45 تمرينًا، ونضيف إليها التمارين الـ 30 المتبقية.</p>' +
            '<p dir="ltr" style="text-align: center;">$$45 + 30 = 75$$</p>' +
            '<p>75 تمرينًا في الكرّاسة!</p>' +
            '<p>الفحص يؤكد أننا كنا على حق.</p>' },
    finalWrong: { title: 'هذا خطأ، لا بأس، فنحن نتعلّم من الأخطاء أيضًا',
      body: '<p>حلّ عمر وهدى ‎60% من 75 تمرينًا.</p>' +
            '<p dir="ltr" style="text-align: center;">$$60\\% \\cdot 75 = 45$$</p>' +
            '<p>لقد حلّا 45 تمرينًا، ونضيف إليها التمارين الـ 30 المتبقية.</p>' +
            '<p dir="ltr" style="text-align: center;">$$45 + 30 = 75$$</p>' +
            '<p>75 تمرينًا في الكرّاسة!</p>' +
            '<p>الفحص يؤكد أننا كنا على حق.</p>' }
  }
};

function s47Init() {
  S47_ORDER.forEach(function(part) {
    s47State[part] = { attempts: 0, done: false, selected: null, lastWrong: null };
  });
  s47State.current = 'a';
  s47State.bar = {};

  vqRenderNav('s47'); // outer Q1–Q5 progress banner (unchanged)

  S47_ORDER.forEach(function(part, i) {
    var sec = document.getElementById('s47-sec-' + part);
    if (sec) sec.hidden = (i !== 0); // only section א starts visible

    document.querySelectorAll('#s47-sec-' + part + ' .vq-opt').forEach(function(b) {
      b.classList.remove('vq-opt--selected', 'vq-opt--correct', 'vq-opt--wrong');
      b.disabled = false;
    });
    var inp = document.getElementById('s47' + part + '-answer');
    if (inp) { inp.value = ''; inp.disabled = false; inp.classList.remove('input-correct', 'input-wrong'); }

    var hintPanel = document.getElementById('s47' + part + '-hint-panel');
    if (hintPanel) hintPanel.hidden = true;
  });

  s47ResetSharedControls();

  // Restores which sections were reached/resolved (hidden state), their
  // option/input marking, s47State incl. .current (via ssmLogicTarget('s47')
  // → window.s47State), and the shared feedback/hint/continue bar's own DOM
  // (part of #s47's subtree, captured/applied generically) — so a resolved
  // section can never be answered a second time and the bar reopens already
  // targeting whichever section was in progress. Same mechanism s39Init()
  // uses above.
  ssmRestore('s47');
}

// Shared feedback/hint/continue bar (one instance, matches every other
// .vq-screen via the standard floating bottom-left rule) — reset to the
// "nothing answered yet" state for whichever section is about to be current.
function s47ResetSharedControls() {
  var fb = document.getElementById('s47-feedback');
  if (fb) { fb.hidden = true; fb.innerHTML = ''; fb.className = 'feedback-panel scq-popup'; }
  var hintBtn = document.getElementById('s47-hint-btn');
  if (hintBtn) hintBtn.hidden = true;
  var actionBtn = document.getElementById('s47-action-btn');
  if (actionBtn) { actionBtn.textContent = 'هل إجابتي صحيحة؟'; actionBtn.disabled = true; }
}

function s47Select(part, idx) {
  var st = s47State[part];
  if (!st || st.done) return;
  var fb = document.getElementById('s47-feedback');
  if (fb && !fb.hidden) fb.hidden = true;
  st.selected = idx;
  // Retry gate: re-picking the exact option just marked wrong on a
  // non-final attempt keeps the check button disabled (see vqSelect).
  var retryLocked = st.lastWrong !== null && idx === st.lastWrong;
  document.querySelectorAll('#s47-sec-' + part + ' .vq-opt').forEach(function(b) {
    var i = parseInt(b.dataset.index, 10);
    b.classList.toggle('vq-opt--selected', i === idx);
    b.classList.toggle('vq-opt--wrong', i === idx && retryLocked);
  });
  var btn = document.getElementById('s47-action-btn');
  if (btn) btn.disabled = retryLocked;
}

function s47Input(part) {
  var inp = document.getElementById('s47' + part + '-answer');
  var btn = document.getElementById('s47-action-btn');
  var st  = s47State[part];
  if (!inp || !btn || !st) return;
  if (inp.getAttribute('inputmode') === 'numeric') {
    var digitsOnly = inp.value.replace(/[^\d]/g, '');
    if (inp.value !== digitsOnly) inp.value = digitsOnly;
  }
  var fb = document.getElementById('s47-feedback');
  if (fb && !fb.hidden && !st.done) fb.hidden = true;
  var val = inp.value.trim();
  var retryLocked = st.lastWrong !== null && val === st.lastWrong;
  inp.classList.toggle('input-wrong', retryLocked && val !== '');
  btn.disabled = (val === '' || st.done || retryLocked);
}

function s47ShowHint(part)  { var p = document.getElementById('s47' + part + '-hint-panel');  if (p) { p.hidden = false; xapiHint('s47' + part); } }

function s47CloseHint(part) { var p = document.getElementById('s47' + part + '-hint-panel');  if (p) p.hidden = true; }

// Shared hint button → whichever section is currently active.
function s47Hint() { s47ShowHint(s47State.current); }

// The feedback/hint/continue bar is one shared instance, so each section's
// bar (feedback incl. the toggle label, hint button, action button) is
// snapshotted when the learner leaves that section and put back when they
// return — via Back or forward again with "המשך". Options/inputs live inside
// each section's own (hidden) DOM and keep their state untouched.
function s47SaveBar(part) {
  var fb = document.getElementById('s47-feedback');
  var hintBtn = document.getElementById('s47-hint-btn');
  var btn = document.getElementById('s47-action-btn');
  if (!fb || !btn) return;
  s47State.bar[part] = {
    fbHtml: fb.innerHTML, fbClass: fb.className, fbHidden: fb.hidden,
    hintHidden: hintBtn ? hintBtn.hidden : true,
    btnText: btn.textContent, btnDisabled: btn.disabled
  };
}

function s47RestoreBar(part) {
  var b = s47State.bar[part];
  if (!b) return false;
  var fb = document.getElementById('s47-feedback');
  var hintBtn = document.getElementById('s47-hint-btn');
  var btn = document.getElementById('s47-action-btn');
  fb.innerHTML = b.fbHtml; fb.className = b.fbClass; fb.hidden = b.fbHidden;
  if (hintBtn) hintBtn.hidden = b.hintHidden;
  btn.textContent = b.btnText;
  // A resolved section must always be able to move forward again.
  btn.disabled = s47State[part].done ? false : b.btnDisabled;
  ssmTypesetIfRaw(document.getElementById('s47'));
  return true;
}

// Back from section ב/ג → the previous section (restored, not reset).
// Returns false on section א so goBack() leaves the screen as usual.
function s47GoBackSection() {
  var i = S47_ORDER.indexOf(s47State.current);
  if (i <= 0) return false;
  s47RevealSection(S47_ORDER[i - 1]);
  ssmSave('s47');
  return true;
}

function s47RevealSection(part) {
  var sec = document.getElementById('s47-sec-' + part);
  if (!sec) return;
  if (s47State.current && s47State.current !== part) s47SaveBar(s47State.current);
  S47_ORDER.forEach(function(p) { s47CloseHint(p); });
  // Only the current section stays visible — the previous one(s) are hidden
  // rather than accumulating in the scroll area, so the newly revealed
  // section lands at the very top of .s47-scroll-area instead of merely
  // peeking in below whatever came before it.
  S47_ORDER.forEach(function(p) {
    if (p === part) return;
    var other = document.getElementById('s47-sec-' + p);
    if (other) other.hidden = true;
  });
  sec.hidden = false;
  s47State.current = part;
  if (!s47RestoreBar(part)) s47ResetSharedControls();
  var scrollArea = document.querySelector('#s47 .s47-scroll-area');
  if (scrollArea) scrollArea.scrollTop = 0;
  else if (sec.scrollIntoView) sec.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Shared continue/check button → whichever section is currently active.
function s47SubmitCurrent() { s47Submit(s47State.current); }

function s47Submit(part) {
  var sec = S47_SECTIONS[part];
  var st  = s47State[part];
  var btn = document.getElementById('s47-action-btn');
  if (!sec || !st) return;

  // Resolved → reveal the next section, or (section ג) advance for real.
  if (st.done) {
    var nextPart = S47_ORDER[S47_ORDER.indexOf(part) + 1];
    if (nextPart) s47RevealSection(nextPart);
    else goTo(44); // s50 — this component's own next real screen
    return;
  }

  var isCorrect, raw, inp;
  if (sec.type === 'choice') {
    isCorrect = (st.selected === sec.correctIndex);
  } else {
    inp = document.getElementById('s47' + part + '-answer');
    raw = inp ? inp.value.trim() : '';
    isCorrect = sec.answer(raw);
  }
  st.attempts++;
  xapiReport('s47' + part, isCorrect, isCorrect || sec.oneAttempt || st.attempts >= 2,
    sec.type === 'choice'
      ? { choices: [xapiOptText(document.querySelector('#s47-sec-' + part + ' .vq-opt[data-index="' + st.selected + '"]'))] }
      : { value: xapiNumber(raw), text: raw });

  var fb      = document.getElementById('s47-feedback');
  var hintBtn = document.getElementById('s47-hint-btn');

  function lockOptions() {
    document.querySelectorAll('#s47-sec-' + part + ' .vq-opt').forEach(function(b) { b.disabled = true; });
  }

  if (isCorrect) {
    st.done = true;
    if (sec.result) window.lomdaState.practiceResults[sec.result] = 'correct';
    fb.className = 'feedback-panel scq-popup feedback-success';
    fb.innerHTML = scqFeedbackHtml('s47-feedback', sec.correct.title, sec.correct.body, 'success');
    fb.hidden = false;
    vqTypeset(fb);
    if (sec.type === 'choice') {
      lockOptions();
      document.querySelectorAll('#s47-sec-' + part + ' .vq-opt').forEach(function(b) {
        if (parseInt(b.dataset.index, 10) === sec.correctIndex) b.classList.add('vq-opt--correct');
      });
    } else {
      inp.disabled = true;
      inp.classList.remove('input-wrong');
      inp.classList.add('input-correct');
    }
    btn.textContent = 'متابعة'; btn.disabled = false;

  } else if (st.attempts === 1 && !sec.oneAttempt) {
    fb.className = 'feedback-panel scq-popup feedback-error';
    fb.innerHTML = scqFeedbackHtml('s47-feedback', sec.firstWrong || 'هذا خطأ، هل نحاول مجددًا؟', '', 'error');
    fb.hidden = false;
    if (hintBtn) hintBtn.hidden = false;

    if (sec.type === 'choice') {
      st.lastWrong = st.selected;
      document.querySelectorAll('#s47-sec-' + part + ' .vq-opt').forEach(function(b) {
        b.classList.toggle('vq-opt--wrong', parseInt(b.dataset.index, 10) === st.selected);
      });
    } else {
      st.lastWrong = raw;
      inp.classList.remove('input-correct');
      inp.classList.add('input-wrong');
    }
    btn.disabled = true;

  } else {
    st.done = true;
    if (sec.result) window.lomdaState.practiceResults[sec.result] = 'incorrect';
    if (sec.type === 'choice') {
      lockOptions();
      document.querySelectorAll('#s47-sec-' + part + ' .vq-opt').forEach(function(b) {
        var i = parseInt(b.dataset.index, 10);
        if (i === sec.correctIndex) b.classList.add('vq-opt--correct');
        else if (b.classList.contains('vq-opt--selected')) b.classList.add('vq-opt--wrong');
      });
    }
    fb.className = 'feedback-panel scq-popup feedback-error';
    if (sec.type === 'choice') {
      fb.innerHTML = scqFeedbackHtml('s47-feedback', sec.finalWrong.title, sec.finalWrong.body);
      fb.hidden = false;
      vqTypeset(fb);
    } else {
      // Value-input section — View My Answer Toggle.
      fbtStart('s47' + part, { screen: 's47', fbId: 's47-feedback',
        title: sec.finalWrong.title, body: sec.finalWrong.body,
        fields: [{ id: 's47' + part + '-answer', correct: sec.solution }] });
    }
    btn.textContent = 'متابعة'; btn.disabled = false;
  }
}

// ============================================================
//  COMPONENT 02 — TRANSITIONS (s40, s42, s50) | slides 119, 124, 160
// ============================================================
function transInit(charImgId) {
  var sectionId = charImgId.replace('-char-img', '');
  syncCharFromRegistry(sectionId);
}

// ============================================================
//  GENERIC ValueInput / MultipleChoice ENGINE  (s43–s54)
//  Slides 125–158, 161–180. One-screen state machine:
//  initial → first-wrong (+hint) → correct | final-wrong.
//  Feedback uses the approved scq-popup card. All text is verbatim
//  from the PPTX (מתמטיקה_יעד 4.3 ... לתיקוף). Calculations via MathJax.
// ============================================================

// Value-triangle (ערך משולש) helper — builds the 2-row table shown in feedback.
function vqTri(qtyCol, p1, v1, p2, v2) {
  return '<table class="guided-table vq-fb-table" dir="rtl">' +
    '<thead><tr><th>النسبة المئوية</th><th>' + qtyCol + '</th></tr></thead>' +
    '<tbody>' +
      '<tr><td>' + p1 + '</td><td>' + v1 + '</td></tr>' +
      '<tr><td>' + p2 + '</td><td>' + v2 + '</td></tr>' +
    '</tbody></table>';
}

var VQ = {
  // ════ Basic questions (slides 125–158) ════
  's43': { // Q1 — נועם / סרטון חתולים (125–129) — ValueInput
    answer: function(r) { return parseInt(r, 10) === 500; },
    solution: '500',
    result: 'b1', next: 38,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>لننظر إلى طريقة الحساب باستخدام جدول التناسب:</p>' + vqTri('عدد المشاهدات', '36%', '180', '100%', 'x') +
            '<p>$$\\frac{x}{180} = \\frac{100\\%}{36\\%} \\quad\\longrightarrow\\quad x = 500$$</p>' +
            '<p>حصل الفيديو على 500 مشاهدة.</p>' },
    finalWrong: { title: 'هذا خطأ، هيا نفهمه معًا:',
      body: '<p>لننظر إلى طريقة الحساب باستخدام جدول التناسب:</p>' + vqTri('عدد المشاهدات', '36%', '180', '100%', 'x') +
            '<p>$$\\frac{x}{180} = \\frac{100\\%}{36\\%} \\quad\\longrightarrow\\quad x = 500$$</p>' +
            '<p>حصل الفيديو على 500 مشاهدة.</p>' }
  },
  's44': { // Q2 — גל / סטיקרים (130–134) — ValueInput
    answer: function(r) { return parseInt(r, 10) === 120; },
    solution: '120',
    result: 'b2', next: 39,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>عدد الملصقات التي تخطط سلمى لإعدادها هو 120.</p><p>لننظر إلى طريقة الحساب باستخدام جدول التناسب:</p>' +
            vqTri('عدد الملصقات', '35%', '42', '100%', 'x') +
            '<p>$$\\frac{x}{42} = \\frac{100\\%}{35\\%} \\quad\\longrightarrow\\quad x = 120$$</p>' +
            '<p>أي أن سلمى تخطط لإعداد <strong>120 ملصقًا</strong>.</p>' },
    finalWrong: { title: 'أخطأتم، هيا نراجع طريقة الحساب:',
      body: '<p>عدد الملصقات التي تخطط سلمى لإعدادها هو 120.</p><p>لننظر إلى طريقة الحساب باستخدام جدول التناسب:</p>' +
            vqTri('عدد الملصقات', '35%', '42', '100%', 'x') +
            '<p>$$\\frac{x}{42} = \\frac{100\\%}{35\\%} \\quad\\longrightarrow\\quad x = 120$$</p>' +
            '<p>أي أن سلمى تخطط لإعداد <strong>120 ملصقًا</strong>.</p>' }
  },
  's45': { // Q3 — ניר / מגנטים (135–139) — ValueInput
    answer: function(r) { return parseInt(r, 10) === 300; },
    solution: '300',
    result: 'b3', next: 40,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>يوجد في المجموع 300 مغناطيس.</p><p>لننظر إلى طريقة الحساب باستخدام جدول التناسب:</p>' +
            vqTri('عدد المغناطيسات', '15%', '45', '100%', 'x') +
            '<p>$$\\frac{x}{45} = \\frac{100\\%}{15\\%} \\quad\\longrightarrow\\quad x = 300$$</p>' +
            '<p>أي أنه يوجد في المجموع <strong>300 مغناطيس</strong>.</p>' },
    finalWrong: { title: 'أخطأتم، لكن الخطأ جزء من التعلّم!',
      body: '<p><strong>إليكم الشرح:</strong></p><p>يوجد في المجموع 300 مغناطيس.</p><p>هذه طريقة الحساب باستخدام جدول التناسب:</p>' +
            vqTri('عدد المغناطيسات', '15%', '45', '100%', 'x') +
            '<p>$$\\frac{x}{45} = \\frac{100\\%}{15\\%} \\quad\\longrightarrow\\quad x = 300$$</p>' +
            '<p>أي أنه يوجد في المجموع <strong>300 مغناطيس</strong>.</p>' }
  },
  's46': { // Q4 — יום כדור הארץ / בקבוקים (140–144) — ValueInput
    answer: function(r) { return parseInt(r, 10) === 400; },
    solution: '400',
    result: 'b4', next: 41,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>جمع طلاب الصف الثامن 400 زجاجة في يوم واحد!</p><p>لنحسب باستخدام جدول التناسب:</p>' +
            vqTri('عدد الزجاجات', '30%', '120', '100%', 'x') +
            '<p>$$\\frac{x}{120} = \\frac{100\\%}{30\\%} \\quad\\longrightarrow\\quad x = 400$$</p>' +
            '<p>أي أن طلاب الصف الثامن جمعوا <strong>400 زجاجة</strong>.</p>' },
    finalWrong: { title: 'هذا خطأ، لنفهم السبب:',
      body: '<p>جمع طلاب الصف الثامن 400 زجاجة في يوم واحد!</p><p>لنحسب باستخدام جدول التناسب:</p>' +
            vqTri('عدد الزجاجات', '30%', '120', '100%', 'x') +
            '<p>$$\\frac{x}{120} = \\frac{100\\%}{30\\%} \\quad\\longrightarrow\\quad x = 400$$</p>' +
            '<p>أي أن طلاب الصف الثامن جمعوا <strong>400 زجاجة</strong>.</p>' }
  },
  // s47/s48/s49 (Q5א/ב/ג — Ron & Yael) moved to the S47_SECTIONS engine below:
  // production note on slide 61 ("גלילה לאורך כל סעיפי השאלה") calls for the
  // three sections to live in one scrolling screen, not three separate
  // screens chained by a continue button. See S47_SECTIONS + s47Init() etc.
  // ════ Standard B questions (slides 161–180) ════
  's51': { // Q1א — אחוז שיער חום (161–165) — ValueInput (%)
    answer: function(r) { return parseInt(r.replace('%', ''), 10) === 24; },
    solution: '24',
    result: 'st1a', next: 46,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>علينا أن نكمل المجموع إلى ‎100%.</p>' +
            '<p>لذلك نطرح النسب المئوية المعروفة من ‎100%.</p>' +
            '<div class="eq-chain" dir="ltr"><div>$$100\\% - (40\\% + 24\\% + 12\\%) =$$</div>' +
            '<div>$$100\\% - 76\\% = 24\\%$$</div></div>' +
            '<p>‎24% من الطلاب شعرهم بني.</p>' },
    finalWrong: { title: 'هذا خطأ، انتبهوا:',
      body: '<p>علينا أن نكمل المجموع إلى ‎100%.</p>' +
            '<p>لذلك نطرح النسب المئوية المعروفة من ‎100%.</p>' +
            '<div class="eq-chain" dir="ltr"><div>$$100\\% - (40\\% + 24\\% + 12\\%) =$$</div>' +
            '<div>$$100\\% - 76\\% = 24\\%$$</div></div>' +
            '<p>‎24% من الطلاب شعرهم بني.</p>' }
  },
  's52': { // Q1ב — שטח העיגול הכולל (166–170) — MultipleChoice
    type: 'choice', correctIndex: 3, result: 'st1b', next: 47,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>لنحسب باستخدام جدول التناسب:</p>' +
            vqTri('المساحة (سم²)', '24%', '50', '100%', 'x') +
            '<div dir="ltr">$$\\frac{x}{50} = \\frac{100\\%}{24\\%} \\quad\\longrightarrow\\quad x = 208.3$$</div>' +
            '<p>مساحة المخطط الدائري كله هي 208.3 سم².</p>' },
    finalWrong: { title: 'هذا خطأ، لنحلّ السؤال معًا:',
      body: '<p>لنحسب باستخدام جدول التناسب:</p>' +
            vqTri('المساحة (سم²)', '24%', '50', '100%', 'x') +
            '<div dir="ltr">$$\\frac{x}{50} = \\frac{100\\%}{24\\%} \\quad\\longrightarrow\\quad x = 208.3$$</div>' +
            '<p>مساحة المخطط الدائري كله هي 208.3 سم².</p>' }
  },
  's53': { // Q2א — יעד משלוחי מנות (171–175) — ValueInput
    answer: function(r) { return parseInt(r, 10) === 50; },
    solution: '50',
    result: 'st2a', next: 48,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>هذه المرة، من الأسهل أن نستخدم التقدير:</p>' +
            '<p>على زياد وطارق وجنى أن يجمعوا ‎20% أخرى من العدد المطلوب من سلال الهدايا، وهذه النسبة هي ربع ما جمعوه حتى الآن (‎80%)،</p>' +
            '<p>أي أن عليهم جمع 10 سلال هدايا أخرى.</p>' +
            '<p>نأخذ سلال الهدايا الـ 40 التي جمعوها حتى الآن ونضيف إليها 10:</p>' +
            '<p>عليهم جمع 50 سلة هدايا في المجموع.</p>' },
    finalWrong: { title: 'الإجابة غير صحيحة. هيا نشرح.',
      body: '<p>هذه المرة، من الأسهل أن نستخدم التقدير:</p>' +
            '<p>على زياد وطارق وجنى أن يجمعوا ‎20% أخرى من العدد المطلوب من سلال الهدايا، وهذه النسبة هي ربع ما جمعوه حتى الآن (‎80%)،</p>' +
            '<p>أي أن عليهم جمع 10 سلال هدايا أخرى.</p>' +
            '<p>نأخذ سلال الهدايا الـ 40 التي جمعوها حتى الآن ونضيف إليها 10:</p>' +
            '<p>عليهم جمع 50 سلة هدايا في المجموع.</p>' }
  },
  's54': { // Q2ב — יחס מצומצם (176–180) — MultipleChoice (routes on to component 03)
    type: 'choice', correctIndex: 2, result: 'st2b', next: 49,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>النسبة بين عدد سلال الهدايا التي لم يتمكّنوا من جمعها بعد وعدد سلال الهدايا التي جمعوها حتى الآن هي \\(10:40\\).</p>' +
            '<p>بعد الاختصار تصبح النسبة \\(1:4\\).</p>' },
    finalWrong: { title: 'هذا خطأ، لكنه جزء من التعلّم!',
      body: '<p>النسبة بين عدد سلال الهدايا التي لم يتمكّنوا من جمعها بعد وعدد سلال الهدايا التي جمعوها حتى الآن هي \\(10:40\\).</p>' +
            '<p>بعد الاختصار تصبح النسبة \\(1:4\\).</p>' }
  },
  // ════ Component 04 — ADVANCED questions (slides 188–222) ════
  // Feedback text below is verbatim from the PPTX (slides 191/192, 196/197, 201/202,
  // 206/207, 211/212, 216/217, 221/222). MathJax calc kept as a separate line.
  's59': { // Q1א — מחיר הריהוט (188–192)
    answer: function(r) { return parseInt(String(r).replace(/[,\s]/g, ''), 10) === 25000; },
    solution: '25000',
    result: 'adv1a', next: 54,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>لنحسب باستخدام جدول التناسب:</p>' +
            vqTri('السعر (ش.ج)', '4%', '1,000', '100%', 'x') +
            '<div dir="ltr">$$\\frac{x}{1{,}000} = \\frac{100\\%}{4\\%} \\quad\\longrightarrow\\quad x = 25{,}000$$</div>' +
            '<p>سعر الأثاث كله هو: 25,000 ش.ج.</p>' },
    finalWrong: { title: 'هذا خطأ، لنحسب باستخدام جدول التناسب:',
      body: vqTri('السعر (ش.ج)', '4%', '1,000', '100%', 'x') +
            '<div dir="ltr">$$\\frac{x}{1{,}000} = \\frac{100\\%}{4\\%} \\quad\\longrightarrow\\quad x = 25{,}000$$</div>' +
            '<p>سعر الأثاث كله هو: 25,000 ₪.</p>' }
  },
  's60': { // Q1ב — סכום כל תשלום (193–197)
    answer: function(r) { return parseInt(String(r).replace(/[,\s]/g, ''), 10) === 4800; },
    solution: '4800',
    result: 'adv1b', next: 55,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>سعر الأثاث كله 25,000 ₪، وقد دفع والداه حتى الآن 1,000 ₪.</p>' +
            '<p>هذا يعني أن المبلغ المتبقي هو:</p>' +
            '<div class="fb-math-right" dir="ltr">$$25,000 - 1,000 = 24,000$$</div>' +
            '<p>المبلغ المتبقي هو 24,000 ₪، وقد قسّماه إلى 5 دفعات.</p>' +
            '<div class="fb-math-right" dir="ltr">$$24,000 : 5 = 4,800$$</div>' +
            '<p>دفع والدا ياسين 4,800 ₪ في كل دفعة.</p>' },
    finalWrong: { title: 'هذا خطأ، تعالوا نتعلم منه:',
      body: '<p>سعر الأثاث كله 25,000 ₪، وقد دفع والداه حتى الآن 1,000 ₪.</p>' +
            '<p>هذا يعني أن المبلغ المتبقي هو:</p>' +
            '<div class="fb-math-right" dir="ltr">$$25,000 - 1,000 = 24,000$$</div>' +
            '<p>المبلغ المتبقي هو 24,000 ₪، وقد قسّماه إلى 5 دفعات.</p>' +
            '<div class="fb-math-right" dir="ltr">$$24,000 : 5 = 4,800$$</div>' +
            '<p>دفع والدا ياسين 4,800 ₪ في كل دفعة.</p>' }
  },
  's61': { // Q1ג — 4 תשלומים (value + dropdown) (198–202)
    reveal: true, // S8-style pilot rollout: "התשובה הנכונה" toggle
    revealValues: { 's61-answer': '6000', 's61-dd': 'المبلغ نفسه' },
    check: function() {
      var v = parseInt(String((document.getElementById('s61-answer') || {}).value || '').replace(/[,\s]/g, ''), 10);
      var dd = (document.getElementById('s61-dd') || {}).value;
      return v === 6000 && dd === 'المبلغ نفسه';
    },
    result: 'adv1c', next: 56,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>سبق أن وجدنا أنه بقي بعد العربون 24,000 ش.ج</p><p>على أربع دفعات:</p>' +
            '<div class="fb-math-right" dir="ltr">$$24,000 : 4 = 6,000$$</div>' +
            '<p>6,000 ₪ في كل دفعة.</p>' +
            '<p>غيّرنا عدد الدفعات من 5 إلى 4، لكن المبلغ الإجمالي بقي 25,000 ₪.</p>' +
            '<div class="fb-math-right" dir="ltr">$$1,000 + (6,000 \\cdot 4) = 25,000$$</div>' },
    finalWrong: { title: 'أوه، الإجابة غير صحيحة', partialTitle: 'الإجابة ليست صحيحة بالكامل.',
      body: '<p>سبق أن وجدنا أنه بقي بعد العربون 24,000 ش.ج</p><p>على أربع دفعات:</p>' +
            '<div class="fb-math-right" dir="ltr">$$24,000 : 4 = 6,000$$</div>' +
            '<p>6,000 ₪ في كل دفعة.</p>' +
            '<p>غيّرنا عدد الدفعات من 5 إلى 4، لكن المبلغ الإجمالي بقي 25,000 ₪.</p>' +
            '<div class="fb-math-right" dir="ltr">$$1,000 + (6,000 \\cdot 4) = 25,000$$</div>' }
  },
  's62': { // Q2א — כמה תלמידים בשכבה (203–207)
    answer: function(r) { return parseInt(r, 10) === 250; },
    solution: '250',
    result: 'adv2a', next: 57,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>لنحسب باستخدام جدول التناسب، والكلّ هو المجهول:</p>' +
            vqTri('عدد الطلاب', '16%', '40', '100%', 'x') + 
            '<div class="fb-math-right" dir="ltr">$$\\frac{x}{40} = \\frac{100\\%}{16\\%} \\quad\\longrightarrow\\quad x = 250$$</div>' +
            '<p>في الصف الثامن 250 طالبًا.</p>' },
    finalWrong: { title: 'أخطأتم. لا بأس، فالمزيد من التدريب سيساعدكم على التقدّم!',
      body: '<p>إليكم الشرح: لنحسب باستخدام جدول التناسب، والكلّ هو المجهول:</p>' +
            vqTri('عدد الطلاب', '16%', '40', '100%', 'x') + 
            '<div class="fb-math-right" dir="ltr">$$\\frac{x}{40} = \\frac{100\\%}{16\\%} \\quad\\longrightarrow\\quad x = 250$$</div>' +
            '<p>في الصف الثامن 250 طالبًا.</p>' }
  },
  's63': { // Q2ב — כמה הגיעו למבחן (208–212)
    answer: function(r) { return parseInt(r, 10) === 210; },
    solution: '210',
    result: 'adv2b', next: 58,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>في الصف الثامن 250 طالبًا.</p><p>إذا تغيّب 40 طالبًا، فهذا يعني أن 210 طلاب حضروا الامتحان:</p><div class="fb-math-right" dir="ltr">$$250 - 40 = 210$$</div>' },
    finalWrong: { title: 'هذا خطأ. المطلوب هنا عملية طرح',
      body: '<p>في الصف الثامن 250 طالبًا.</p><p>إذا تغيّب 40 طالبًا، فهذا يعني أن 210 طلاب حضروا الامتحان:</p><div class="fb-math-right" dir="ltr">$$250 - 40 = 210$$</div>' }
  },
  's64': { // Q3א — סככה:גידולים, 9:11 — approved by user 2026-10-22 (PPTX slide 80 wording conflict resolved).
    answer: function(r) { return /^\s*9\s*[:\/]\s*11\s*$/.test(String(r)); },
    solution: '9:11',
    result: 'adv3a', next: 59,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>تُكتب النسبة من اليسار إلى اليمين.</p><p>النسبة بين مساحة المظلّة ومساحة المزروعات هي: \\(45:55\\).</p><p>بعد الاختصار على 5 تصبح النسبة: \\(9:11\\).</p>' },
    finalWrong: { title: 'هذا خطأ. تعلّموا من الحل:',
      body: '<p>تُكتب النسبة من اليسار إلى اليمين.</p><p>النسبة بين مساحة المظلّة ومساحة المزروعات هي: \\(45:55\\).</p><p>بعد الاختصار على 5 تصبح النسبة: \\(9:11\\).</p>' }
  },
  // ════ Component 04 — PEAK question 1 (slides 226–245) ════
  's68': { // Peak Q1א — מינימום נקודות (226–230)
    answer: function(r) { return parseInt(r, 10) === 300; },
    solution: '300',
    result: 'p1a', next: 63,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>نحسب باستخدام جدول التناسب:</p>' +
            vqTri('النقاط', '16%', '48', '100%', 'x') +
            '<div class="eq-chain" dir="ltr">$$\\frac{x}{48} = \\frac{100\\%}{16\\%} \\quad\\longrightarrow\\quad x = 300$$</div>' +
            '<p>حسب الفحص، يلزم 300 نقطة على الأقل ليكون استهلاك البطارية سليمًا.</p>' },
    finalWrong: { title: 'هذا خطأ، هيا نضع المعطيات معًا في جدول التناسب:',
      body: vqTri('النقاط', '16%', '48', '100%', 'x') +
            '<div class="eq-chain" dir="ltr">$$\\frac{x}{48} = \\frac{100\\%}{16\\%} \\quad\\longrightarrow\\quad x = 300$$</div>' +
            '<p>حسب الفحص، يلزم 300 نقطة على الأقل ليكون استهلاك البطارية سليمًا.</p>' }
  },
  's69': { // Peak Q1ב — אחוז התחממות (231–235)
    answer: function(r) { return parseInt(r.replace('%', ''), 10) === 24; },
    solution: '24',
    result: 'p1b', next: 64,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>نحسب انطلاقًا من ‎100%:</p>' +
            '<div class="eq-chain" dir="ltr"><div>$$100\\% - (16\\% + 32\\% + 28\\%) =$$</div>' +
            '<div>$$100\\% - 76\\% = 24\\%$$</div></div>' +
            '<p>تستهلك سخونة البطارية ‎24% من مجموع استهلاك البطارية.</p>' },
    finalWrong: { title: 'هذا خطأ، لا بأس، تعالوا نتعلّم منه:',
      body: '<p>نحسب انطلاقًا من ‎100%:</p>' +
            '<div class="eq-chain" dir="ltr"><div>$$100\\% - (16\\% + 32\\% + 28\\%) =$$</div>' +
            '<div>$$100\\% - 76\\% = 24\\%$$</div></div>' +
            '<p>تستهلك سخونة البطارية ‎24% من مجموع استهلاك البطارية.</p>' }
  },
  's70': { // Peak Q1ג — נקודות בהירות המסך (236–240)
    answer: function(r) { return parseInt(r, 10) === 84; },
    solution: '84',
    result: 'p1c', next: 65,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>سطوع الشاشة يستهلك ‎28%</p><p>المجموع الكلّي المطلوب كحدّ أدنى هو 300 نقطة.</p><p>نحسب القيمة المقابلة للنسبة المئوية:</p>' +
            '<div class="eq-chain" dir="ltr">$$\\frac{x}{300} = \\frac{28\\%}{100\\%} \\quad\\longrightarrow\\quad x = 84$$</div>' +
            '<p>حصّة سطوع الشاشة هي 84 نقطة.</p>' },
    finalWrong: { title: 'أخطأتم، لكن لا بأس، هيا نتعلّم معًا:',
      body: '<p>سطوع الشاشة يستهلك ‎28%</p><p>المجموع الكلّي المطلوب كحدّ أدنى هو 300 نقطة.</p><p>نحسب القيمة المقابلة للنسبة المئوية:</p>' +
            '<div class="eq-chain" dir="ltr">$$\\frac{x}{300} = \\frac{28\\%}{100\\%} \\quad\\longrightarrow\\quad x = 84$$</div>' +
            '<p>حصّة سطوع الشاشة هي 84 نقطة.</p>' }
  },
  // ════ Component 04 — PEAK question 2 (slides 248–261) ════
  's74': { // Peak Q2א — צודקת/טועה (248–251) — ONE attempt
    type: 'choice', correctIndex: 0, oneAttempt: true, alwaysHint: true, result: 'p2a', next: 69,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>رنا مخطئة.</p>' +
            '<p>صحيح أنها حدّدت المعطيات بدقّة ووضعتها في أماكنها كما يجب، لكنّ ترتيب الحساب خاطئ.</p>' +
            vqTri('النقاط', '14%', '56', '100%', 'x') +
            '<p>بعد قليل ستتمكّنون من حساب ذلك.</p>' },
    finalWrong: { title: 'هذا خطأ، لكنه جزء من التعلّم!',
      body: '<p>رنا مخطئة.</p>' +
            '<p>صحيح أنها حدّدت المعطيات بدقّة ووضعتها في أماكنها كما يجب، لكنّ ترتيب الحساب خاطئ.</p>' +
            vqTri('النقاط', '14%', '56', '100%', 'x') +
            '<p>بعد قليل ستتمكّنون من حساب ذلك.</p>' }
  },
  's75': { // Peak Q2ב — סך הנקודות (252–256)
    answer: function(r) { return parseInt(r, 10) === 400; },
    solution: '400',
    result: 'p2b', next: 70,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>نحسب باستخدام جدول التناسب:</p>' + vqTri('النقاط', '14%', '56', '100%', 'x') +
            '<div dir="ltr">$$\\frac{x}{56} = \\frac{100\\%}{14\\%} \\quad\\longrightarrow\\quad x = 400$$</div><p>مجموع النقاط في اللعبة هو 400.</p>' },
    finalWrong: { title: 'هذا خطأ، لكن لا تنزعجوا، هيا نفهم معًا.',
      body: '<p>نحسب باستخدام جدول التناسب:</p>' + vqTri('النقاط', '14%', '56', '100%', 'x') +
            '<div dir="ltr">$$\\frac{x}{56} = \\frac{100\\%}{14\\%} \\quad\\longrightarrow\\quad x = 400$$</div><p>مجموع النقاط في اللعبة هو 400.</p>' }
  },
  's65': { // Q3ב — שטח הגינה (218–222)
    answer: function(r) { return parseInt(r, 10) === 200; },
    solution: '200',
    result: 'adv3b', next: 60,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>نحسب باستخدام جدول التناسب:</p>' +
            vqTri('المساحة (م²)', '45%', '90', '100%', 'x') +
            '<div dir="ltr">$$\\frac{x}{90} = \\frac{100\\%}{45\\%} \\quad\\longrightarrow\\quad x = 200$$</div>' +
            '<p>مساحة الحديقة المجتمعية هي 200 م².</p>' },
    finalWrong: { title: 'أخطأتم. لا بأس، فهذا يحدث لنا جميعًا',
      body: '<p>نحسب باستخدام جدول التناسب:</p>' +
            vqTri('المساحة (م²)', '45%', '90', '100%', 'x') +
            '<div dir="ltr">$$\\frac{x}{90} = \\frac{100\\%}{45\\%} \\quad\\longrightarrow\\quad x = 200$$</div>' +
            '<p>مساحة الحديقة المجتمعية هي 200 م².</p>' }
  },
  's71': { // Peak Q1ד — verdict (3 inputs + dropdown) (241–245)
    doneLabel: 'انتهيت', // last section of the peak question — shown after the final feedback
    reveal: true, // S8-style pilot rollout: "התשובה הנכונה" toggle
    revealValues: { 's71-a1': '30', 's71-a2': '330', 's71-a3': '324', 's71-dd': 'ليس ممتازًا' },
    check: function() {
      var v1 = parseInt(String((document.getElementById('s71-a1') || {}).value || '').replace(/[,\s]/g, ''), 10);
      var v2 = parseInt(String((document.getElementById('s71-a2') || {}).value || '').replace(/[,\s]/g, ''), 10);
      var v3 = parseInt(String((document.getElementById('s71-a3') || {}).value || '').replace(/[,\s]/g, ''), 10);
      var dd = (document.getElementById('s71-dd') || {}).value;
      return v1 === 30 && v2 === 330 && v3 === 324 && dd === 'ليس ممتازًا';
    },
    result: 'p1d', next: 66,
    correct: { title: 'صحيح تمامًا!',
      body: '<p>‎10% من 300 نقطة تساوي 30 نقطة.</p>' +
            '<p>لكي تكون الزيادة ‎10% أو أكثر، يجب الوصول إلى 330 نقطة.</p>' +
            '<p>حصل هاتفنا على 324 نقطة.</p>' +
            '<p>استهلاك البطارية سليم لكنه ليس ممتازًا... للأسف.</p>' },
    finalWrong: { title: 'الإجابة غير صحيحة.<br>هيا نفهم السبب:', partialTitle: 'الإجابة ليست صحيحة بالكامل.<br>هيا نفهم السبب:',
      body: '<p>‎10% من 300 نقطة تساوي 30 نقطة.</p>' +
            '<p>لكي تكون الزيادة ‎10% أو أكثر، يجب الوصول إلى 330 نقطة.</p>' +
            '<p>حصل هاتفنا على 324 نقطة.</p>' +
            '<p>استهلاك البطارية سليم لكنه ليس ممتازًا... للأسف.</p>' }
  },
  's76': { // Peak Q2ג — multi-select (correct: 0,1,3; distractors: 2,4) (257–261)
    doneLabel: 'انتهيت', // last section of the peak question — shown after the final feedback
    reveal: true, // S8-style pilot rollout: "התשובה הנכונה" toggle
    type: 'multi', correctIndices: [0, 1, 3],
    result: 'p2c', next: null, // last screen of the unit — the s78 end screen was removed
    correct: { title: 'صحيح تمامًا!',
      body: '<p>كل الإجابات التي اخترتموها صحيحة.</p><p>الآن نعرف نحن أيضًا أن استخدام جدول التناسب طريقة ممتازة!</p>' },
    finalWrong: { title: 'الإجابة غير صحيحة.', partialTitle: 'الإجابة ليست صحيحة بالكامل.',
      body: '<p>انتبهوا، الإجابات الصحيحة مُعلَّمة باللون الأخضر.</p><p>الآن نعرف نحن أيضًا أن استخدام جدول التناسب طريقة ممتازة!</p>' }
  }
};

var vqState = {};

// V/X feedback badge — only for the QA-targeted vq screens. Other vq
// screens (e.g. s75) keep the unchanged (icon-less) feedback. Hoisted to
// module scope so both vqSubmit and vqToggleReveal share one definition.
var ICON_SCREENS = {
  s43:1,
  s44:1,
  s45:1,
  s46:1,
  s47:1,
  // basic practice (QA round 1) — s47's own sections (a/b/c) use scqFeedbackHtml directly in s47Submit()
  s51:1,
  s52:1,
  s53:1,
  s54:1,
  // standard practice
  s59:1,
  s60:1,
  s61:1,
  s62:1,
  s63:1,
  s64:1,
  // advanced practice
  s68:1,
  s69:1,
  s70:1,
  s74:1,
  s65:1,
  s71:1,
  s75:1
};

// Progress-banner position per screen (Fix 7): [step, total].
// Basic practice = 5 questions (Q1–Q5; Q5 spans a/b/c). Standard-B = 4 sections.
var VQ_NAV = {
  s43: [1, 5],
  s44: [2, 5],
  s45: [3, 5],
  s46: [4, 5],
  s47: [5, 5],
  s51: [1, 2],
  s52: [1, 2],
  s53: [2, 2],
  s54: [2, 2],
  // Advanced section = 3 questions (Q1 spans א/ב/ג, Q2 spans א/ב, Q3 spans א/ב)
  s59: [1, 3],
  s60: [1, 3],
  s61: [1, 3],
  s62: [2, 3],
  s63: [2, 3],
  s64: [3, 3],
  s65: [3, 3]
};

// QA round 1 (S43–S49 only): practiceResults key for each completed nav
// position, so the banner can show done (correct) vs wrong (incorrect) —
// reference behavior from s34–s39. Position 5 (b5a/b5b/b5c) is never a
// *completed* item within s43–s49, so it needs no entry here.
var VQ_NAV_RESULT_KEYS = {
  s43: ['b1', 'b2', 'b3', 'b4'],
  s44: ['b1', 'b2', 'b3', 'b4'],
  s45: ['b1', 'b2', 'b3', 'b4'],
  s46: ['b1', 'b2', 'b3', 'b4'],
  s47: ['b1', 'b2', 'b3', 'b4']
};

// QA round 3 (S58–S64 only): each nav position there is itself a multi-part
// question (Q1 = adv1a/b/c across s58–s60, Q2 = adv2a/b, Q3 = adv3a/b) — no
// single practiceResults key represents the whole position, so a position
// is 'wrong' if ANY of its sub-part keys is incorrect, else 'done'.
var VQ_NAV_RESULT_GROUPS = {
  s59: [['adv1a', 'adv1b', 'adv1c'], ['adv2a', 'adv2b'], ['adv3a', 'adv3b']],
  s60: [['adv1a', 'adv1b', 'adv1c'], ['adv2a', 'adv2b'], ['adv3a', 'adv3b']],
  s61: [['adv1a', 'adv1b', 'adv1c'], ['adv2a', 'adv2b'], ['adv3a', 'adv3b']],
  s62: [['adv1a', 'adv1b', 'adv1c'], ['adv2a', 'adv2b'], ['adv3a', 'adv3b']],
  s63: [['adv1a', 'adv1b', 'adv1c'], ['adv2a', 'adv2b'], ['adv3a', 'adv3b']],
  s64: [['adv1a', 'adv1b', 'adv1c'], ['adv2a', 'adv2b'], ['adv3a', 'adv3b']],
  // Standard-B: Q1 = st1a/st1b (s51–s52), Q2 = st2a/st2b (s53–s54).
  s51: [['st1a', 'st1b'], ['st2a', 'st2b']],
  s52: [['st1a', 'st1b'], ['st2a', 'st2b']],
  s53: [['st1a', 'st1b'], ['st2a', 'st2b']],
  s54: [['st1a', 'st1b'], ['st2a', 'st2b']],
  s65: [['adv1a', 'adv1b', 'adv1c'], ['adv2a', 'adv2b'], ['adv3a', 'adv3b']]
};

// Done/wrong class for a completed (i < step) nav position — shared by the
// S43–S49 (round 1), S51–S54 (round 2) and S58–S64 (round 3) banners.
function vqNavDoneClass(id, i) {
  var resultKeys = VQ_NAV_RESULT_KEYS[id];
  if (resultKeys) {
    var key = resultKeys[i - 1];
    var result = key ? window.lomdaState.practiceResults[key] : undefined;
    return (result === 'incorrect') ? 'vq-nav-dot--wrong' : 'vq-nav-dot--done';
  }
  var groups = VQ_NAV_RESULT_GROUPS[id];
  if (groups) {
    var keys = groups[i - 1] || [];
    var anyWrong = false;
    for (var k = 0; k < keys.length; k++) {
      if (window.lomdaState.practiceResults[keys[k]] === 'incorrect') { anyWrong = true; break; }
    }
    return anyWrong ? 'vq-nav-dot--wrong' : 'vq-nav-dot--done';
  }
  return 'vq-nav-dot--done';
}

function vqRenderNav(id) {
  var holder = document.getElementById(id + '-nav');
  var nav = VQ_NAV[id];
  if (!holder || !nav) return;
  var step = nav[0], total = nav[1], html = '';
  for (var i = 1; i <= total; i++) {
    if (i > 1) html += '<div class="vq-nav-line' + (i <= step ? ' vq-nav-line--done' : '') + '"></div>';
    var dotCls;
    if (i < step) {
      dotCls = vqNavDoneClass(id, i);
    } else if (i === step) {
      dotCls = 'vq-nav-dot--active';
    } else {
      dotCls = 'vq-nav-dot--off';
    }
    var lblCls = i <= step ? 'vq-nav-label--on' : 'vq-nav-label--off';
    html += '<div class="vq-nav-item"><span class="vq-nav-dot ' + dotCls + '"></span>' +
            '<span class="vq-nav-label ' + lblCls + '">' + i + '</span></div>';
  }
  holder.innerHTML = html;
}

// Image-zoom modal (Fix 8) — purple-themed, shared chrome.
function vqOpenZoom(src, alt) {
  var modal = document.getElementById('vq-zoom-modal');
  var stage = document.getElementById('vq-zoom-stage');
  if (!modal || !stage) return;
  var img = document.createElement('img');
  img.className = 'vq-zoom-img';
  img.src = src;
  img.alt = alt || '';
  stage.innerHTML = '';
  stage.appendChild(img);
  modal.hidden = false;
}

function vqCloseZoom() {
  var modal = document.getElementById('vq-zoom-modal');
  var stage = document.getElementById('vq-zoom-stage');
  if (modal) modal.hidden = true;
  if (stage) stage.innerHTML = '';
}

// Image zoom — 720-templates global component (spec-compliant, currently
// wired to S2, S31, and S43). One delegated handler: any [data-zoom-src] opens by
// cloning its image wrapper (".vq-img-frame") into the shared modal so
// in-frame overlays are captured too; any [data-zoom-close] closes.
document.addEventListener('click', function(event) {
  var opener = event.target.closest('[data-zoom-src]');
  if (opener) {
    openImgZoomModal(opener);
    return;
  }
  if (event.target.closest('[data-zoom-close]')) {
    closeImgZoomModal();
  }
});

function openImgZoomModal(opener) {
  var modal   = document.getElementById('img-zoom-modal');
  var stage   = document.getElementById('img-zoom-modal-stage');
  var wrapper = opener.closest('.vq-img-frame');
  if (!modal || !stage || !wrapper) return;
  var clone = wrapper.cloneNode(true);
  var btnInClone = clone.querySelector('.img-zoom-btn');
  if (btnInClone) btnInClone.remove();
  stage.innerHTML = '';
  stage.appendChild(clone);
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeImgZoomModal() {
  var modal = document.getElementById('img-zoom-modal');
  var stage = document.getElementById('img-zoom-modal-stage');
  if (modal) { modal.classList.add('hidden'); modal.setAttribute('aria-hidden', 'true'); }
  if (stage) stage.innerHTML = '';
}

// Applet (iframe widget) zoom — S51/S52 pie chart. The iframe can't be cloned
// or moved into the shared image modal without reloading and losing the
// learner's slider state, so the wrap itself is enlarged in place over the
// canvas (CSS: .screen.embed-zoomed) with its own backdrop and close button.
document.addEventListener('click', function(event) {
  var opener = event.target.closest('[data-embed-zoom-open]');
  if (opener) {
    var screen = opener.closest('.screen');
    if (screen) screen.classList.add('embed-zoomed');
    return;
  }
  if (event.target.closest('[data-embed-zoom-close]')) closeEmbedZoom();
});

function closeEmbedZoom() {
  var zoomed = document.querySelectorAll('.screen.embed-zoomed');
  zoomed.forEach(function(el) { el.classList.remove('embed-zoomed'); });
  return zoomed.length > 0;
}

function vqInitScopedZoomTargets() {
  var targets = document.querySelectorAll(
    '#s67 .vq-zoom-target, #s68 .vq-zoom-target, #s69 .vq-zoom-target, #s70 .vq-zoom-target, #s71 .vq-zoom-target'
  );
  targets.forEach(function(img) {
    if (img.dataset.zoomBound === 'true') return;
    img.dataset.zoomBound = 'true';
    img.addEventListener('click', function() {
      vqOpenZoom(img.currentSrc || img.src, img.alt || '');
    });
  });
}

function vqInit(id) {
  var cfg = VQ[id];
  vqState[id] = { attempts: 0, done: false, selected: null, multi: [], revealed: false, lastWrong: null };

  vqRenderNav(id);

  // Sync any in-screen character image to the chosen character (e.g. s52).
  var charImg = document.getElementById(id + '-char-img');
  if (charImg) {
    syncCharFromRegistry(id);
  }

  // Reset every input + dropdown in the screen (covers combos s61/s71).
  document.querySelectorAll('#' + id + ' .s31-answer-box').forEach(function(i) {
    i.value = ''; i.disabled = false; i.classList.remove('input-correct', 'input-wrong');
  });
  document.querySelectorAll('#' + id + ' .vq-select').forEach(function(s) {
    s.selectedIndex = 0; s.disabled = false; s.classList.remove('input-correct', 'input-wrong');
  });

  var opts = document.querySelectorAll('#' + id + ' .vq-opt');
  opts.forEach(function(b) {
    b.classList.remove('vq-opt--selected', 'vq-opt--correct', 'vq-opt--wrong');
    b.disabled = false;
  });

  var fb = document.getElementById(id + '-feedback');
  if (fb) { fb.hidden = true; fb.innerHTML = ''; fb.className = 'feedback-panel scq-popup'; }

  // Hint button: hidden on load unless cfg.alwaysHint (PPTX: "הרמז זמין תמיד").
  var hintBtn = document.getElementById(id + '-hint-btn');
  if (hintBtn) hintBtn.hidden = !cfg.alwaysHint;

  var hintPanel = document.getElementById(id + '-hint-panel');
  if (hintPanel) hintPanel.hidden = true;

  var btn = document.getElementById(id + '-action-btn');
  if (btn) { btn.textContent = 'هل إجابتي صحيحة؟'; btn.disabled = true; }

  // Screen state memory — covers the whole vq family (S43–S76): selections,
  // typed values, dropdown choices, V/X field marking, option correct/wrong
  // colouring, the rendered feedback, the "התשובה הנכונה" reveal state, and
  // st.done (which blocks re-answering). No-ops on first entry.
  ssmRestore(id);
}

// Global feedback-hide pass (extends the #s7 pilot to every generic VQ
// screen): hide a still-visible non-final feedback the moment the learner
// starts interacting with their answer again — typing, focusing, selecting
// an option, or changing a dropdown. No-ops once vqState[id].done (the
// input/select/opt buttons are disabled by then anyway, via lockInputs()/
// vqMarkChoice(), so this naturally never fires post-final in practice —
// the explicit check is just defensive). Does not touch attempts, done,
// scoring, or the feedback's own content/classes.
function vqHideFeedbackIfRetryable(id) {
  var st = vqState[id];
  var fb = document.getElementById(id + '-feedback');
  if (fb && !fb.hidden && st && !st.done) fb.hidden = true;
}

// Retry gate: a snapshot of everything the learner has answered on a vq
// screen (typed fields, dropdowns, single pick, multi picks). After a
// non-final wrong attempt the check button stays disabled while the current
// snapshot still equals the one that was just marked wrong.
function vqAnswerKey(id) {
  var st = vqState[id];
  var parts = [];
  document.querySelectorAll('#' + id + ' .s31-answer-box, #' + id + ' .vq-select').forEach(function(el) {
    parts.push(el.value.trim());
  });
  parts.push(st.selected === null ? '' : String(st.selected));
  parts.push(st.multi.slice().sort(function(a, b) { return a - b; }).join(','));
  return parts.join('|');
}

function vqRetryLocked(id) {
  var st = vqState[id];
  return !!st && st.lastWrong !== null && vqAnswerKey(id) === st.lastWrong;
}

// Numeric answer fields: digits only, grouped with thousands commas as the
// learner types (24000 → 24,000). The caret stays after the same digit.
// Grading strips the commas, so "24000" and "24,000" are the same answer.
function vqGroupThousands(v) {
  return String(v).replace(/[^\d]/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function vqFormatNumericInput(el) {
  var formatted = vqGroupThousands(el.value);
  if (el.value === formatted) return;
  var caret = el.selectionStart == null ? el.value.length : el.selectionStart;
  var digitsBefore = el.value.slice(0, caret).replace(/[^\d]/g, '').length;
  el.value = formatted;
  var pos = 0, seen = 0;
  while (pos < formatted.length && seen < digitsBefore) {
    if (/\d/.test(formatted[pos])) seen++;
    pos++;
  }
  try { el.setSelectionRange(pos, pos); } catch (e) {}
}

// Numeric-answer fields: what typing may leave in the box differs per part
// (PART_CONFIG.numericInput) — 'digits' strips anything but digits,
// 'thousands' also keeps grouping commas, 'none' leaves the value alone.
function vqSanitizeNumeric(el) {
  if (!el || el.tagName !== 'INPUT' || el.getAttribute('inputmode') !== 'numeric') return;
  if (PART_CONFIG.numericInput === 'thousands') { vqFormatNumericInput(el); return; }
  if (PART_CONFIG.numericInput !== 'digits') return;
  var digitsOnly = el.value.replace(/[^\d]/g, '');
  if (el.value !== digitsOnly) el.value = digitsOnly;
}

function vqInput(id) {
  var inp = document.getElementById(id + '-answer');
  var btn = document.getElementById(id + '-action-btn');
  if (!inp || !btn) return;
  vqSanitizeNumeric(inp);
  vqHideFeedbackIfRetryable(id);
  if (PART_CONFIG.legacyRetry) {
    // Retry gate (template default): re-typing the exact value just marked
    // wrong on a non-final attempt must keep the check button disabled.
    var st = vqState[id];
    var val = inp.value.trim();
    var retryLocked = st.lastWrong !== null && val === st.lastWrong;
    inp.classList.toggle('input-wrong', retryLocked && val !== '');
    btn.disabled = (val === '' || st.done || retryLocked);
    return;
  }
  vqClearRetryMarks(id);
  btn.disabled = (inp.value.trim() === '' || vqState[id].done || vqRetryLocked(id));
}

function vqSelect(id, idx) {
  var st = vqState[id];
  if (!st || st.done) return;
  vqHideFeedbackIfRetryable(id);
  if (!PART_CONFIG.legacyRetry) vqClearRetryMarks(id);
  st.selected = idx;
  // Legacy retry gate: re-picking the exact option just marked wrong on a
  // non-final attempt keeps the check button disabled; any other pick clears
  // the wrong mark and re-enables it.
  var legacyLocked = PART_CONFIG.legacyRetry && st.lastWrong !== null && idx === st.lastWrong;
  document.querySelectorAll('#' + id + ' .vq-opt').forEach(function(b) {
    var i = parseInt(b.dataset.index, 10);
    b.classList.toggle('vq-opt--selected', i === idx);
    if (PART_CONFIG.legacyRetry) b.classList.toggle('vq-opt--wrong', i === idx && legacyLocked);
  });
  var btn = document.getElementById(id + '-action-btn');
  if (btn) btn.disabled = PART_CONFIG.legacyRetry ? legacyLocked : vqRetryLocked(id);
}

// `el` is the specific field when a screen has more than one (falls back to
// the id+'-answer' convention for single-field screens).
function vqEnable(id, el) {
  var st = vqState[id];
  var btn = document.getElementById(id + '-action-btn');
  vqSanitizeNumeric(el || document.getElementById(id + '-answer'));
  if (btn && st && !st.done) {
    vqHideFeedbackIfRetryable(id);
    if (PART_CONFIG.legacyRetry) { btn.disabled = false; return; }
    vqClearRetryMarks(id);
    btn.disabled = vqRetryLocked(id);
  }
}

function vqMultiToggle(id, idx) {
  var st = vqState[id];
  if (!st || st.done) return;
  vqHideFeedbackIfRetryable(id);
  if (!PART_CONFIG.legacyRetry) vqClearRetryMarks(id);
  var pos = st.multi.indexOf(idx);
  if (pos === -1) st.multi.push(idx); else st.multi.splice(pos, 1);
  document.querySelectorAll('#' + id + ' .vq-opt').forEach(function(b) {
    b.classList.toggle('vq-opt--selected', st.multi.indexOf(parseInt(b.dataset.index, 10)) !== -1);
  });
  var btn = document.getElementById(id + '-action-btn');
  if (btn) btn.disabled = (st.multi.length === 0 || (!PART_CONFIG.legacyRetry && vqRetryLocked(id)));
}

function vqHint(id)      { var p = document.getElementById(id + '-hint-panel'); if (p) { p.hidden = false; xapiHint(id); } }

function vqHintClose(id) { var p = document.getElementById(id + '-hint-panel'); if (p) p.hidden = true; }

// colorize: pass false to disable the option buttons without applying
// correct/wrong coloring yet — used by cfg.reveal screens (S8-style pilot
// rollout) so the reveal-toggle button is what visibly marks the answer.
// Omitted (default) preserves the original behavior for every other caller.
function vqMarkChoice(id, cfg, isCorrect, colorize) {
  document.querySelectorAll('#' + id + ' .vq-opt').forEach(function(b) { b.disabled = true; });
  if (!cfg || colorize === false) return;
  if (cfg.type === 'choice') {
    document.querySelectorAll('#' + id + ' .vq-opt').forEach(function(b) {
      var i = parseInt(b.dataset.index, 10);
      if (i === cfg.correctIndex) b.classList.add('vq-opt--correct');
      else if (!isCorrect && b.classList.contains('vq-opt--selected')) b.classList.add('vq-opt--wrong');
    });
  } else if (cfg.type === 'multi') {
    if (cfg.correctIndices) {
      // Mark the correct options green; selected distractors red.
      document.querySelectorAll('#' + id + ' .vq-opt').forEach(function(b) {
        var i = parseInt(b.dataset.index, 10);
        if (cfg.correctIndices.indexOf(i) !== -1) b.classList.add('vq-opt--correct');
        else if (b.classList.contains('vq-opt--selected')) b.classList.add('vq-opt--wrong');
      });
    } else {
      // Every option is a correct answer — mark them all correct on resolution.
      document.querySelectorAll('#' + id + ' .vq-opt').forEach(function(b) { b.classList.add('vq-opt--correct'); });
    }
  }
}

// Per-field V/X marking for the main submit path (correct or final-wrong),
// for cfg.revealValues screens (S60/S70) — same comparison as vqRevealValues
// below, but never overwrites the field's value (that's reveal-only
// behavior). Each field/control is judged independently: no blanket class
// from the combined isCorrect/cfg.check() boolean.
function vqMarkRevealFields(cfg) {
  if (!cfg.revealValues) return;
  Object.keys(cfg.revealValues).forEach(function(elId) {
    var el = document.getElementById(elId);
    if (!el) return;
    var correct = cfg.revealValues[elId];
    var isSelect = el.tagName === 'SELECT';
    var ok = isSelect
      ? (el.value === correct)
      : (String(el.value || '').replace(/[,\s]/g, '') === String(correct).replace(/[,\s]/g, ''));
    el.classList.remove('input-correct', 'input-wrong');
    el.classList.add(ok ? 'input-correct' : 'input-wrong');
  });
}

// Typeset MathJax in a freshly-rendered element. Waits for MathJax startup so the
// call never fires before the library is ready (which would leave raw \(...\) visible).
function vqTypeset(el) {
  if (!el || !window.MathJax) return;
  var run = function () {
    if (window.MathJax && typeof window.MathJax.typesetPromise === 'function') {
      window.MathJax.typesetPromise([el]).catch(function () {});
    }
  };
  if (window.MathJax.startup && window.MathJax.startup.promise) {
    window.MathJax.startup.promise.then(run).catch(run);
  } else {
    run();
  }
}

// Reset ONLY the Standard-B set (S51–S54) and return the learner to S51.
function s54Reset() {
  var r = window.lomdaState.practiceResults;
  delete r.st1a; delete r.st1b; delete r.st2a; delete r.st2b;
  goTo(45); // s51
  // Intentional reset — drop the remembered answers for this set (goTo has
  // already snapshotted the outgoing s54), then re-init s51 so it comes up
  // blank instead of restored.
  ssmForget(['s51', 's52', 's53', 's54']);
  vqInit('s51');
}

// Reset the whole unit (end-screen "איפוס היחידה") and return to the start.
function unitReset() {
  window.lomdaState.practiceResults = {};
  goTo(SPLIT_FIRST);
  // Intentional whole-unit reset — forget every screen, so each one resets
  // normally on its next entry.
  ssmForget();
}

// ── s56 class survey intro (slide 184) — reflection instructions, non-interactive ──
function s56Init() {
  if (document.getElementById('s56-char-img')) {
    syncCharFromRegistry('s56');
  }
  ssmRestore('s56');
}

// ── s57 class survey conclusion (slide 184b) — dropdown question, ungraded, non-blocking nudge ──
var s57State = { selected: null, nudged: false };

var s57ListenerRegistered = false;

function s57Init() {
  s57State = { selected: null, nudged: false };
  if (document.getElementById('s57-char-img')) {
    syncCharFromRegistry('s57');
  }
  s57CloseDropdown();
  var sel = document.getElementById('s57-dd-selected'); if (sel) sel.textContent = 'اختاروا إجابة';
  var btn = document.getElementById('s57-dd-btn'); if (btn) btn.setAttribute('data-empty', 'true');
  s57HideNudge();
  if (!s57ListenerRegistered) {
    document.addEventListener('click', s57OutsideClick);
    s57ListenerRegistered = true;
  }
  ssmRestore('s57');
  // The reminder belongs to this visit. Memory restores the answer, but a
  // previous visit's nudge must not skip the now-hidden reminder on Continue.
  s57State.nudged = false;
  if (s57State.selected) {
    if (sel) sel.textContent = s57State.selected;
    if (btn) btn.removeAttribute('data-empty');
  }
  s57HideNudge();
}

function s57CloseDropdown() {
  var list = document.getElementById('s57-dd-list'); if (list) list.classList.add('hidden');
  var btn  = document.getElementById('s57-dd-btn');  if (btn)  btn.setAttribute('aria-expanded', 'false');
}

function s57Toggle() {
  var list = document.getElementById('s57-dd-list');
  if (!list) return;
  var isOpen = !list.classList.contains('hidden');
  s57CloseDropdown();
  if (!isOpen) {
    list.classList.remove('hidden');
    var btn = document.getElementById('s57-dd-btn'); if (btn) btn.setAttribute('aria-expanded', 'true');
  }
}

function s57OutsideClick(e) {
  if (currentScreen !== 51) return;
  if (!e.target.closest('.dq-dropdown-wrap')) s57CloseDropdown();
}

function s57Select(val) {
  s57State.selected = val;
  var sel = document.getElementById('s57-dd-selected'); if (sel) sel.textContent = val;
  var btn = document.getElementById('s57-dd-btn'); if (btn) btn.removeAttribute('data-empty');
  s57CloseDropdown();
  s57HideNudge();
}

// Slide 184b: the character + bubble are not on screen until an empty
// Continue — then they pop up together (the nudge), and go away once an
// answer is chosen.
function s57HideNudge() {
  var scene  = document.getElementById('s57-char-scene'); if (scene)  scene.hidden  = true;
  var bubble = document.getElementById('s57-bubble');     if (bubble) bubble.hidden = true;
}

function s57ShowNudge() {
  var scene  = document.getElementById('s57-char-scene'); if (scene)  scene.hidden  = false;
  var bubble = document.getElementById('s57-bubble');     if (bubble) bubble.hidden = false;
  var vid = document.getElementById('s57-char-img');
  if (vid && vid.play) { try { vid.currentTime = 0; var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); } catch (e) {} }
}

function s57Continue() {
  if (!s57State.selected && !s57State.nudged) {
    s57State.nudged = true; // nudge once, but never block progress
    s57ShowNudge();
    return;
  }
  goTo(52);
}

// Fields a final-wrong reveal writes the correct answer into — the View My
// Answer Toggle applies exactly when there are some: cfg.revealValues
// (multi-field screens) or the single answer field + cfg.solution. Choice /
// multi-choice screens mark the chosen and the correct option together, so
// they return null and never get the toggle.
function vqRevealFields(id, cfg) {
  if (cfg.type === 'choice' || cfg.type === 'multi') return null;
  if (cfg.revealValues) {
    return Object.keys(cfg.revealValues).map(function (elId) {
      return { id: elId, correct: cfg.revealValues[elId] };
    });
  }
  if (cfg.solution !== undefined) return [{ id: id + '-answer', correct: cfg.solution }];
  return null;
}

// Multi-answer VQ screens (several fields, or a multi-select): the wrong-answer
// title says plainly whether the answer is partly right ('התשובה אינה נכונה במלואה.')
// or wholly wrong ('התשובה אינה נכונה.') — 720 "partly right" rule.
// Retry state (720 "Per-answer verdict after a non-final wrong attempt"):
// after the first wrong attempt every answer unit shows its own verdict —
// ✓ on a correct one, ✕ on a wrong one. Multi-select marks only the options
// the learner picked; an unpicked correct option stays neutral until the
// final attempt. st.judged keeps each field's judged value so a field's mark
// clears only once that field actually changes.
function vqMarkRetry(id, cfg) {
  var st = vqState[id];
  st.judged = {};
  document.querySelectorAll('#' + id + ' .s31-answer-box, #' + id + ' .vq-select').forEach(function(el) {
    if (el.id) st.judged[el.id] = el.value;
  });
  if (cfg.type === 'choice' || cfg.type === 'multi') {
    document.querySelectorAll('#' + id + ' .vq-opt').forEach(function(b) {
      var i = parseInt(b.dataset.index, 10);
      var picked = cfg.type === 'choice' ? i === st.selected : st.multi.indexOf(i) !== -1;
      var ok = cfg.type === 'choice' ? i === cfg.correctIndex
             : (!cfg.correctIndices || cfg.correctIndices.indexOf(i) !== -1);
      b.classList.toggle('vq-opt--correct', picked && ok);
      b.classList.toggle('vq-opt--wrong', picked && !ok);
    });
  } else if (cfg.revealValues) {
    vqMarkRevealFields(cfg);
  } else {
    var inp = document.getElementById(id + '-answer');
    if (inp) { inp.classList.remove('input-correct'); inp.classList.add('input-wrong'); }
  }
}

// The learner is changing the answer after a retry: option marks clear on any
// re-pick; a field's mark clears once its value differs from the judged one.
function vqClearRetryMarks(id) {
  var st = vqState[id];
  if (!st || st.done || !st.judged) return;
  document.querySelectorAll('#' + id + ' .vq-opt').forEach(function(b) {
    b.classList.remove('vq-opt--correct', 'vq-opt--wrong');
  });
  document.querySelectorAll('#' + id + ' .s31-answer-box, #' + id + ' .vq-select').forEach(function(el) {
    if (el.value !== st.judged[el.id]) el.classList.remove('input-correct', 'input-wrong');
  });
}

function vqIsMultiAnswer(cfg) {
  return !!cfg.revealValues || (cfg.type === 'multi' && !!cfg.correctIndices);
}

// At least one thing the learner chose is correct. Judged on the answer as
// submitted — call before a reveal overwrites the fields.
function vqIsPartial(id, cfg) {
  if (cfg.type === 'multi' && cfg.correctIndices) {
    return vqState[id].multi.some(function(i) { return cfg.correctIndices.indexOf(i) !== -1; });
  }
  if (!cfg.revealValues) return false;
  return Object.keys(cfg.revealValues).some(function(elId) {
    var el = document.getElementById(elId);
    if (!el) return false;
    var correct = cfg.revealValues[elId];
    return el.tagName === 'SELECT'
      ? (el.value === correct)
      : (String(el.value || '').replace(/[,\s]/g, '') === String(correct).replace(/[,\s]/g, ''));
  });
}

function vqSubmit(id) {
  var cfg = VQ[id];
  var st  = vqState[id];
  var btn = document.getElementById(id + '-action-btn');
  if (!cfg || !st) return;

  // Resolved → advance. A "סיימתי" button (doneLabel) closes the peak
  // question: it greys out once clicked and the screen stays put.
  if (st.done) {
    if (cfg.doneLabel) { if (btn) btn.disabled = true; partFinish(btn); return; }
    if (typeof cfg.next === 'number') goTo(cfg.next);
    return;
  }

  var isCorrect;
  // Plain single-text-answer screens (cfg.answer, no cfg.check/type) — the
  // Family-C ValueInputQuestion set. Tracked separately from cfg.check
  // (S61/S71) so per-field V/X marking below only applies to this single-
  // input shape, not the multi-field check()-based screens.
  var plainAnswerInput = null;
  if (cfg.check) isCorrect = cfg.check(id);
  else if (cfg.type === 'multi') {
    if (cfg.correctIndices) {
      // Exact set match: every correct option selected, no distractor selected.
      isCorrect = (st.multi.length === cfg.correctIndices.length) &&
                  cfg.correctIndices.every(function(i) { return st.multi.indexOf(i) !== -1; });
    } else {
      isCorrect = (st.multi.length === cfg.correctCount);
    }
  }
  else if (cfg.type === 'choice') isCorrect = (st.selected === cfg.correctIndex);
  else {
    var inp = document.getElementById(id + '-answer');
    var raw = inp ? inp.value.trim() : '';
    // Thousands commas are display-only — grade the bare number.
    if (PART_CONFIG.numericInput === 'thousands' && inp && inp.getAttribute('inputmode') === 'numeric') raw = raw.replace(/,/g, '');
    isCorrect = cfg.answer(raw);
    plainAnswerInput = inp;
  }
  st.attempts++;

  var fb      = document.getElementById(id + '-feedback');
  var hintBtn = document.getElementById(id + '-hint-btn');

  var okVar  = ICON_SCREENS[id] ? 'success' : undefined;
  var errVar = ICON_SCREENS[id] ? 'error'   : undefined;

  function lockInputs() {
    document.querySelectorAll('#' + id + ' .s31-answer-box').forEach(function(i) { i.disabled = true; });
    document.querySelectorAll('#' + id + ' .vq-select').forEach(function(s) { s.disabled = true; });
  }

  if (isCorrect) {
    st.done = true;
    if (cfg.result) window.lomdaState.practiceResults[cfg.result] = 'correct';
    fb.className = 'feedback-panel scq-popup feedback-success';
    fb.innerHTML = scqFeedbackHtml(id + '-feedback', cfg.correct.title, cfg.correct.body, okVar);
    fb.hidden = false;
    vqTypeset(fb);
    vqMarkChoice(id, cfg, true);
    if (plainAnswerInput) {
      plainAnswerInput.classList.remove('input-correct', 'input-wrong');
      plainAnswerInput.classList.add('input-correct');
    }
    // cfg.revealValues screens (S61/S71): every field is correct here (the
    // combined check() passed), but mark each independently via the shared
    // per-field comparison rather than a blanket class.
    vqMarkRevealFields(cfg);
    lockInputs();
    btn.textContent = cfg.doneLabel || 'متابعة'; btn.disabled = false;

  } else if (st.attempts === 1 && !cfg.oneAttempt) {
    fb.className = 'feedback-panel scq-popup feedback-error';
    if (vqIsMultiAnswer(cfg)) {
      fb.innerHTML = scqFeedbackHtml(id + '-feedback',
        vqIsPartial(id, cfg) ? 'الإجابة ليست صحيحة بالكامل.' : 'الإجابة غير صحيحة.', '<p>هل نحاول مجددًا؟</p>', errVar);
    } else {
      fb.innerHTML = scqFeedbackHtml(id + '-feedback', cfg.firstWrong || 'هذا خطأ، هل نحاول مجددًا؟', '', errVar);
    }
    fb.hidden = false;
    if (hintBtn) hintBtn.hidden = false;

    if (PART_CONFIG.legacyRetry) {
      // Template default (SingleChoiceQuestion / ValueInputQuestion "Try Again"
      // state): the wrong pick/value itself is marked, not just the banner —
      // and the retry gate keeps the button disabled until it actually changes.
      if (cfg.type === 'choice') {
        st.lastWrong = st.selected;
        document.querySelectorAll('#' + id + ' .vq-opt').forEach(function(b) {
          b.classList.toggle('vq-opt--wrong', parseInt(b.dataset.index, 10) === st.selected);
        });
      } else if (plainAnswerInput) {
        st.lastWrong = raw;
        plainAnswerInput.classList.remove('input-correct');
        plainAnswerInput.classList.add('input-wrong');
      }
    } else {
      // Retry gate: the check button stays disabled until the answer changes
      // (see vqRetryLocked).
      st.lastWrong = vqAnswerKey(id);
      vqMarkRetry(id, cfg);
    }
    btn.disabled = true;

  } else {
    // Final wrong — or the single allowed attempt (oneAttempt) was wrong.
    st.done = true;
    if (cfg.result) window.lomdaState.practiceResults[cfg.result] = 'incorrect';
    lockInputs();
    fb.className = 'feedback-panel scq-popup feedback-error';
    var finalTitle = (cfg.finalWrong.partialTitle && vqIsPartial(id, cfg))
      ? cfg.finalWrong.partialTitle : cfg.finalWrong.title;
    var revealFields = vqRevealFields(id, cfg);
    if (revealFields) {
      // View My Answer Toggle — the correct value(s) go straight into the
      // learner's own field(s); "מעבר לתשובה שלי" brings theirs back.
      fbtStart(id, { screen: id, fbId: id + '-feedback',
        title: finalTitle, body: cfg.finalWrong.body, fields: revealFields });
    } else {
      vqMarkChoice(id, cfg, false);
      if (plainAnswerInput) {
        plainAnswerInput.classList.remove('input-correct', 'input-wrong');
        plainAnswerInput.classList.add('input-wrong');
      }
      fb.innerHTML = scqFeedbackHtml(id + '-feedback', finalTitle, cfg.finalWrong.body);
      fb.hidden = false;
      vqTypeset(fb);
    }
    if (cfg.oneAttempt && hintBtn) hintBtn.hidden = false; // reveal hint per manual decision
    btn.textContent = cfg.doneLabel || 'متابعة'; btn.disabled = false;
  }
  // Peak Q1 only: retire the hint once the section is resolved.
  if (st.done && hintBtn && ['s68', 's69', 's70', 's71'].indexOf(id) !== -1) {
    hintBtn.hidden = true;
  }
  // Last screen of the unit (no next) — nothing to continue to, unless the
  // screen closes with a "סיימתי" button (doneLabel), which stays visible.
  if (st.done && cfg.next == null && !cfg.doneLabel) btn.hidden = true;
  xapiReport(id, isCorrect, st.done, vqXapiSpec(id, cfg, st));
}

// ============================================================
//  DEV MODE — postMessage bridge for dev-nav.html / index_dev.html
// ============================================================
// Live only when the dev wrapper loads the part with ?dev=1: on the platform
// the part runs in the platform's frame and must neither take navigation
// orders from it nor post to it.
var DEV_BRIDGE = /[?&]dev=1(&|$)/.test(location.search);

if (DEV_BRIDGE) window.addEventListener('message', function(e) {
  if (!e.data || e.data.type !== 'DEV_GOTO') return;
  var n = parseFloat(e.data.screen);
  if (!isNaN(n)) goTo(n);
});

if (DEV_BRIDGE && window.parent !== window) {
  var screenCount = document.querySelectorAll('.screen').length;
  window.parent.postMessage({ type: 'DEV_READY', total: screenCount }, '*');
}

// ============================================================
//  DRAGGABLE + CLOSEABLE FEEDBACK POPUPS
//  Mirrors the reference lomda (scq-popup): every feedback popup
//  can be dragged anywhere over the 1280×710 canvas and closed via
//  its ✕ button. A single delegated pointer handler covers ALL
//  feedback popups — including feedbacks whose content is rendered
//  dynamically (innerHTML rebuilt on each attempt). Positioning is
//  computed against the scaled #app so drag tracks the cursor 1:1.
//  Only drag + close are added here — content/formulas untouched.
// ============================================================
(function () {
  var FB_SELECTOR    = '.feedback-panel, .s38-feedback, .s39-feedback';
  var CLOSE_SELECTOR = '.scq-popup-close';
  // View My Answer Toggle button: must be excluded from drag-start, or a
  // tap on it gets "hijacked" as a drag on touch devices.
  var REVEAL_SELECTOR = '.popup-action';
  var CANVAS_W = 1280, CANVAS_H = 710;

  var dragEl = null, offX = 0, offY = 0;

  function appMetrics() {
    var app = document.getElementById('app');
    if (!app) return null;
    var rect = app.getBoundingClientRect();
    var m = app.style.transform.match(/scale\(([^)]+)\)/);
    return { left: rect.left, top: rect.top, scale: m ? parseFloat(m[1]) : 1 };
  }

  // Restore a popup to its CSS-defined default position, so a popup dragged
  // during one attempt reopens where the design intends (reference parity).
  function fbResetPosition(popup) {
    popup.style.left = '';
    popup.style.top = '';
    popup.style.right = '';
    popup.style.bottom = '';
    popup.style.transform = '';
  }

  document.addEventListener('pointerdown', function (e) {
    var popup = e.target.closest(FB_SELECTOR);
    if (!popup) return;
    if (e.target.closest(CLOSE_SELECTOR)) return;   // ✕ handles its own click
    if (e.target.closest(REVEAL_SELECTOR)) return;  // reveal-toggle handles its own click
    var am = appMetrics();
    if (!am) return;
    var pRect   = popup.getBoundingClientRect();
    var curLeft = (pRect.left - am.left) / am.scale;
    var curTop  = (pRect.top  - am.top)  / am.scale;
    // Pin to explicit coords, dropping any CSS anchoring (bottom/right/transform).
    popup.style.transform = 'none';
    popup.style.right     = 'auto';
    popup.style.bottom    = 'auto';
    popup.style.left      = curLeft + 'px';
    popup.style.top       = curTop  + 'px';
    offX = (e.clientX - am.left) / am.scale - curLeft;
    offY = (e.clientY - am.top)  / am.scale - curTop;
    dragEl = popup;
    e.preventDefault();
  });

  document.addEventListener('pointermove', function (e) {
    if (!dragEl) return;
    var am = appMetrics();
    if (!am) return;
    var newX = (e.clientX - am.left) / am.scale - offX;
    var newY = (e.clientY - am.top)  / am.scale - offY;
    newX = Math.max(0, Math.min(newX, CANVAS_W - dragEl.offsetWidth));
    newY = Math.max(0, Math.min(newY, CANVAS_H - dragEl.offsetHeight));
    dragEl.style.left = newX + 'px';
    dragEl.style.top  = newY + 'px';
  });

  function endDrag() { dragEl = null; }
  document.addEventListener('pointerup', endDrag);
  document.addEventListener('pointercancel', endDrag);

  // Reset a popup's position whenever it (re)appears or its content is
  // re-rendered, unless it is the one currently being dragged.
  function watch(popup) {
    var mo = new MutationObserver(function () {
      if (dragEl === popup) return;
      if (popup.hasAttribute('hidden')) return;
      fbResetPosition(popup);
    });
    mo.observe(popup, { attributes: true, attributeFilter: ['hidden'], childList: true });
  }

  var popups = document.querySelectorAll(FB_SELECTOR);
  for (var i = 0; i < popups.length; i++) watch(popups[i]);
})();

// ============================================================
//  CUSTOM LISTBOX (S61, S71) — presentation layer only
//  ------------------------------------------------------------
//  A native <select>'s option list is painted by the OS, so the Figma panel
//  (radius, 8/20 item padding, 24px type, 6px gap) cannot be reached from
//  CSS. This renders that panel as real DOM instead.
//
//  IMPORTANT: no answer logic changes. Each <select> stays in the DOM and
//  remains the single source of truth — vqInit's `selectedIndex = 0` reset,
//  vqRevealValues / vqRestoreValues writing `.value`, `.disabled`, the
//  input-correct / input-wrong classes and every `.vq-select` querySelectorAll
//  sweep all keep working untouched. This layer only MIRRORS that state, and
//  writes back through the native value setter + a real `change` event so the
//  existing onchange/vqEnable path fires exactly as before.
//
//  Progressive: the wrapper this builds is what CSS keys the native select's
//  display:none off, so if this never runs the original control still shows.
// ============================================================
(function vqListboxes() {
  var proto = window.HTMLSelectElement.prototype;
  var nativeValue = Object.getOwnPropertyDescriptor(proto, 'value');
  var nativeIndex = Object.getOwnPropertyDescriptor(proto, 'selectedIndex');

  function build(screenId) {
    var sel = document.getElementById(screenId + '-dd');
    if (!sel || sel.dataset.lbReady) return;
    sel.dataset.lbReady = '1';

    var wrap = document.createElement('div');
    wrap.className = 'vq-lb';

    var field = document.createElement('button');
    field.type = 'button';
    field.className = 'vq-lb-field';
    field.setAttribute('aria-haspopup', 'listbox');
    field.setAttribute('aria-expanded', 'false');
    if (sel.getAttribute('aria-label')) field.setAttribute('aria-label', sel.getAttribute('aria-label'));

    var valueEl = document.createElement('span');
    valueEl.className = 'vq-lb-value';
    var arrow = document.createElement('span');
    arrow.className = 'vq-lb-arrow';
    field.appendChild(valueEl);
    field.appendChild(arrow);

    var list = document.createElement('ul');
    list.className = 'vq-lb-list';
    list.setAttribute('role', 'listbox');
    list.hidden = true;

    Array.prototype.forEach.call(sel.options, function (opt) {
      if (opt.disabled) return;               // skip the "בחרו תשובה" placeholder
      var li = document.createElement('li');
      li.className = 'vq-lb-item';
      li.setAttribute('role', 'option');
      li.textContent = opt.textContent;
      li.addEventListener('click', function (e) {
        e.stopPropagation();
        if (sel.disabled) return;
        nativeValue.set.call(sel, opt.value);
        sel.dispatchEvent(new Event('change', { bubbles: true }));
        close();
        sync();
      });
      list.appendChild(li);
    });

    sel.parentNode.insertBefore(wrap, sel);
    wrap.appendChild(field);
    wrap.appendChild(list);
    wrap.appendChild(sel);

    // Flip the panel above the field when it would overflow the canvas.
    // S71's dropdown sits on the last line of its screen, so a downward panel
    // runs under the bottom bar and clips the final option. Measured against
    // the .screen box (not the window) because the canvas is scaled. The
    // usable bottom is the top of the 74px bottom bar (.screen::after), which
    // paints over the question content — not the screen's own bottom edge.
    function place() {
      wrap.classList.remove('is-up');
      var screenEl = wrap.closest('.screen');
      if (!screenEl) return;
      var f = field.getBoundingClientRect();
      var s = screenEl.getBoundingClientRect();
      var scale = s.height / (screenEl.offsetHeight || s.height);
      var barTop = s.bottom - 74 * scale;
      var need = (list.offsetHeight + 6) * scale;
      if (f.bottom + need > barTop && f.top - need >= s.top) wrap.classList.add('is-up');
    }

    function open() {
      if (sel.disabled) return;
      list.hidden = false;
      place();
      field.classList.add('is-open');
      field.setAttribute('aria-expanded', 'true');
      if (typeof vqEnable === 'function') vqEnable(screenId);   // was the select's onfocus
    }
    function close() {
      list.hidden = true;
      field.classList.remove('is-open');
      field.setAttribute('aria-expanded', 'false');
    }
    function sync() {
      var opt = sel.options[nativeIndex.get.call(sel)];
      valueEl.textContent = opt ? opt.textContent : '';
      field.disabled = sel.disabled;
      field.classList.toggle('input-correct', sel.classList.contains('input-correct'));
      field.classList.toggle('input-wrong', sel.classList.contains('input-wrong'));
      if (sel.disabled) close();
    }

    field.addEventListener('click', function (e) {
      e.stopPropagation();
      if (list.hidden) open(); else close();
    });
    document.addEventListener('click', close);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

    // Mirror programmatic writes made by the existing answer logic.
    Object.defineProperty(sel, 'value', {
      configurable: true,
      get: function () { return nativeValue.get.call(this); },
      set: function (v) { nativeValue.set.call(this, v); sync(); }
    });
    Object.defineProperty(sel, 'selectedIndex', {
      configurable: true,
      get: function () { return nativeIndex.get.call(this); },
      set: function (v) { nativeIndex.set.call(this, v); sync(); }
    });
    new MutationObserver(sync).observe(sel, {
      attributes: true, attributeFilter: ['class', 'disabled']
    });
    sel.addEventListener('change', sync);

    sync();
  }

  ['s61', 's71'].forEach(build);
})();

// ============================================================
//  VIEW MY ANSWER TOGGLE — unit-wide, aligned to 4.2
//  (methodica-math-percent-02) and 720-templates → _global-components.md →
//  Feedback popup system → "View My Answer Toggle".
//
//  Applies to every question whose final-wrong reveal writes the correct
//  answer into the SAME field(s) the learner typed/selected into (value
//  inputs, dropdowns, table cells). Choice / multi-choice questions mark the
//  chosen and the correct option at once and never get the toggle.
//
//  Flow: the final wrong attempt shows the SOLUTION immediately (correct
//  values in the fields, marked correct) with the question's own
//  explanation + "מעבר לתשובה שלי". That button restores exactly the
//  learner's submitted values (wrong ones marked wrong); the feedback text
//  stays exactly as it is and only the button label flips to "התשובה הנכונה". Unlimited, lossless, and it
//  never touches attempts / done / results. Back-navigation onto the screen
//  returns to the view the learner left (fbtOnRestore, called by ssmRestore).
// ============================================================
var FBT_TO_ANSWER    = 'الانتقال إلى إجابتي';

var FBT_TO_SOLUTION  = 'الإجابة الصحيحة';

var fbtRegistry = {};

// Same value? Numbers ignore thousands separators, spaces and a trailing %.
function fbtSame(el, a, b) {
  if (el && el.tagName === 'SELECT') return String(a) === String(b);
  var norm = function (v) { return String(v == null ? '' : v).replace(/[,\s%]/g, ''); };
  return norm(a) === norm(b);
}

// key     — unique toggle id (usually the screen id)
// opts.screen — screen section id (for Back-navigation reset)
// opts.fbId   — feedback popup element id
// opts.title / opts.body — the question's own final-wrong title + explanation HTML
// opts.fields — [{ id, correct }] every field the reveal writes into
// opts.render(fb, title, bodyHtml, actionsHtml) — optional, for popups whose
//              markup is not the shared scqFeedbackHtml() card
// opts.after(view) — optional per-screen hook after fields are written
function fbtStart(key, opts) {
  var fields = (opts.fields || []).map(function (f) {
    var el = document.getElementById(f.id);
    return { id: f.id, correct: String(f.correct), own: el ? el.value : '' };
  });
  fbtRegistry[key] = {
    screen: opts.screen, fbId: opts.fbId, title: opts.title, body: opts.body || '',
    fields: fields, render: opts.render || null, after: opts.after || null,
    view: 'solution'
  };
  fbtApply(key);
}

function fbtActionsHtml(key, view) {
  var label = view === 'solution' ? FBT_TO_ANSWER : FBT_TO_SOLUTION;
  return '<div class="scq-popup-actions">' +
           '<button class="popup-action" type="button" data-label="' + label + '" onclick="fbtToggle(\'' + key + '\')">' + label + '</button>' +
         '</div>';
}

function fbtApply(key) {
  var e = fbtRegistry[key];
  if (!e) return;
  var sol = e.view === 'solution';
  e.fields.forEach(function (f) {
    var el = document.getElementById(f.id);
    if (!el) return;
    var ownOk = fbtSame(el, f.own, f.correct);
    el.value = sol
      ? (PART_CONFIG.numericInput === 'thousands' && el.tagName === 'INPUT' && el.getAttribute('inputmode') === 'numeric' ? vqGroupThousands(f.correct) : f.correct)
      : f.own;
    el.disabled = true;
    el.classList.remove('input-correct', 'input-wrong');
    // (Custom listboxes mirror these value/class writes on their own.)
    el.classList.add(sol || ownOk ? 'input-correct' : 'input-wrong');
  });
  if (e.after) e.after(e.view);
  var fb = document.getElementById(e.fbId);
  if (!fb) return;
  // The feedback never changes with the view — only the toggle's label does.
  // Relabel in place when the popup is already showing this toggle, so the
  // popup keeps its position and content.
  var btn = fb.querySelector('[onclick="fbtToggle(\'' + key + '\')"]');
  if (btn && !fb.hidden) {
    var label = sol ? FBT_TO_ANSWER : FBT_TO_SOLUTION;
    btn.textContent = label;
    btn.setAttribute('data-label', label);
    return;
  }
  var title = e.title;
  var body  = e.body;
  var actions = fbtActionsHtml(key, e.view);
  // Re-rendering the content re-anchors the popup to its default position
  // (the drag module's MutationObserver) — intentional per the toggle spec.
  if (e.render) e.render(fb, title, body, actions);
  else fb.innerHTML = scqFeedbackHtml(e.fbId, title, body) + actions;
  fb.hidden = false;
  if (typeof vqTypeset === 'function') vqTypeset(fb);
  else if (window.MathJax && MathJax.typesetPromise) MathJax.typesetPromise([fb]);
}

// Pure view switch — never re-runs a submit, never touches attempts/done/results.
function fbtToggle(key) {
  var e = fbtRegistry[key];
  if (!e) return;
  e.view = (e.view === 'solution') ? 'answer' : 'solution';
  fbtApply(key);
}

// Back-navigation returns to whichever view (solution / my answer) the
// learner left the question on. Only toggles whose popup is actually the
// one on screen are re-applied (s37 has two phases).
function fbtOnRestore(screenId) {
  Object.keys(fbtRegistry).forEach(function (key) {
    var e = fbtRegistry[key];
    if (e.screen !== screenId) return;
    var fb = document.getElementById(e.fbId);
    if (!fb || fb.hidden || fb.innerHTML.indexOf("fbtToggle('" + key + "')") === -1) return;
    fbtApply(key);
  });
}
