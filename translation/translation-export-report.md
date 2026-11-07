# Translation Export Report — יעד 4.3, מציאת השלם (100%)

**Module:** methodica-math-percent-03
**Export type:** first export (no earlier translation export existed for this unit)
**Date:** 2026-11-03, against commit `82a8710` (main)
**Languages:** Hebrew (he) → Arabic (ar). Every `<target>` cell is empty.
**Regenerate:** `python3 translation/tools/extract_translations.py` (it only reads the build, never writes to it)

## Files

| File | What it is |
|---|---|
| `methodica-math-percent-03-he-ar.xlsx` | For the translator: one row per string, a yellow column for the Arabic, and a second sheet listing the screens |
| `methodica-math-percent-03-he-ar.xlf` | The same units as XLIFF 1.2, for a CAT tool |
| `translation-screen-manifest.csv` | One row per screen: id, HTML screen id, title, template, PPTX slides, file, number of units |
| `translation-excluded-js.csv` | Hebrew strings left out as dead code (see "Dead code in script.js"). For review only, not for the translator |
| `tools/extract_translations.py` | The extractor |

## Totals

| | Count |
|---|---|
| Units | **1,513** (648 distinct Hebrew strings, ≈ 8,400 words) |
| From HTML (`index.html` per part + the two pie-chart widget pages) | 936 |
| From JS (`script.js` per part: feedback, hints, button labels, generated tables) | 577 |
| Units whose source holds HTML tags (`<strong>`, `<br>`, `<span …>`) | 210 |
| Screens in the manifest | 63 (+ one "99" row per part) |

Units per part: 01 → 388, 02 → 272, 03 → 293, 04 → 69, 05 → 198, 06 → 173, 07 → 120.

## IDs

`03-PP-SS-NNN`: unit 03, part (01–07), screen (the position of the `<section class="screen">` in that part's `index.html`, starting at 00), running number. The HTML screen id (`s34`, `s6b`…) and the PPTX slide range are in their own columns and notes.

**Screen 99** in each part is text that belongs to no single screen: the page title, the "דיווח על בעיה" dialog, back button, image-zoom dialog, the answer toggle labels (`מעבר לתשובה שלי` / `התשובה הנכונה`) and the generic question engine's labels.

## How this unit differs from earlier exports

Each part is a standalone page with its own `index.html` and `script.js`. The text in `index.html` is mapped to its `<section>`. Text in `script.js` is mapped to a screen by the nearest screen reference in the same block of code (function name such as `s34Check`, element id such as `'s34-feedback'`, or a key such as `s34:` in a per-screen table). Template CSS classes (`.s31-answer-box`, `class="s30-body"`) are ignored, because the generic engine reuses them on every screen.

### Dead code in script.js

`script.js` started as one file for the whole unit and was then split per part. Each part's copy still holds the code, and the Hebrew, for screens that live in other parts, plus a few screens that were removed or never built (`s5`, `s6a` playlist placeholder, `s40`, `s48`, `s49`, `s77`, `s78`). That code never runs because those screens are not in the page. **2,652 such strings were left out** and listed in `translation-excluded-js.csv`. Many of them are older wordings that were later fixed only in the part that owns the screen. Translating them would cost money and add stale text.

How this was checked:
- No excluded string sits inside a function or block named after a screen of the same part (0 found).
- Every excluded string sits in a function named after another part's screen, or in a per-screen table (`VQ`, `CHARACTER_SCREEN_REGISTRY`, `S6B_STEPS`, `S39_SECTIONS`).
- Two mapping bugs were found and fixed along the way. A CSS class reused from removed screen `s5` had hidden live s38 feedback in part 02, and the generic engine's `.s31-answer-box` class had hidden its "המשך" label in parts 02–07.

If a part's code is ever consolidated, rerun the extractor. The list will shrink on its own.

## Notes for the translator

1. **HTML tags:** translate the text and keep the tags in place. `<strong>` marks emphasis that has to stay on the matching words, and `<br>` is a line break from the script.
2. **Repeated strings:** 223 Hebrew strings appear more than once (1,088 units), e.g. "המשך" ×67, "צדקתי?" ×55, "חזרה לשאלה" ×35, "אפשר רמז?" ×32, "נכון מאוד!" ×32. The column "מופיע בסה״כ" shows the count. Translate them the same way every time.
3. **Strings the code compares (5 units, "המשך", "אותו סכום", "לא מעולה"):** the code checks a button label or an option against this exact text. Use **exactly** the same Arabic everywhere the same Hebrew appears, or the button logic breaks.
4. **Joined strings (255 units):** pieces of one sentence that the code joins with `+`, e.g. `'נתון לנו מספר '` + number + `', שהוא גם '`. They are marked in the notes column. Translate them so the sentence still reads correctly once the pieces are joined. Note that in Arabic the order of the pieces around the numbers may need to stay the same as in the Hebrew.
5. **`${…}` placeholders (4 units, pie-chart widgets):** keep them unchanged.
6. **Math:** `\(45:55\)` and similar are MathJax formulas. Keep them as they are. Ratios are written left to right on purpose ("יחס כותבים משמאל לימין").
7. **Section labels:** "א." … "ד." and "סעיף א'" mark sub-questions. Use the Arabic letters the curriculum uses (أ/ب/ج/د).
8. **Page title:** the title of every part is "לומדה — מדעים | תכנית 720" (×7). "מדעים" (science) is wrong for a math unit. It is exported as it is in the build. Decide whether to fix the Hebrew first.

## Not covered by this export (needs separate localization)

- **Text inside images.** These content images have Hebrew drawn into the picture and need Arabic copies: `Hook_when_1.jpg`, `Hook_when_2.jpg`, `gaming.png`, `standard_6.png`, `standard_6_b.png`, `standard_6_c.jpeg` (cottage-cheese labels), `warmup.png`, `standard_2.png`, `standard_3.png`, `basic_1.png`, `basic_2.png`, `basic_4.png`, `basic_5.png`, `standard2_2.png`, `advanced_1.png`, `advanced_1_b.png`, `battery_alert_s71.webp`, `battery_status_base.webp`, `see_1*.png` (5 files), `see2_0.png`, `see2_1.png`, `see2_2.png`. `Step-by-step_1/2.png`, `togther.png`, `basic_3.png` and `advanced_3.png` have no Hebrew. They were checked by eye on a contact sheet. Character images, icons and the character videos were not checked.
- **YouTube videos** (s6a playlist, not in the current build) are not covered.
- **Dev files:** `index_dev.html`, `viewer.html`, `dev-nav.html` are developer tools, not shipped. Not included.
- **CSS:** the only Hebrew in the CSS is in comments. Nothing to translate.
- **Metadata / reporting:** not part of this build and not included.

## Verification

| Check | Result |
|---|---|
| XML well-formed | ✅ |
| Duplicate ids | ✅ 0 (1,513 unique) |
| All `<target>` empty | ✅ |
| Comments, `<script>` and `<style>` excluded | ✅ |
| Separate sweep: every Hebrew word in each `index.html`, `script.js` and widget page (outside comments) appears in an exported or excluded unit from the same file | ✅ 0 missed |
| Build files modified | ✅ none (only `translation/` was written) |
