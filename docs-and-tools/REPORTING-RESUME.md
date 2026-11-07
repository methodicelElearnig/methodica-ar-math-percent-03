# Reporting and resume — methodica-math-percent-03

Guide: `2026/Documentation/reporting-and-resume/ADDING-REPORTING-AND-RESUME.md`.
Boot hardening (the 2026-11-03 rules for new units): `BOOT-AND-RESUME-HARDENING-2026-11-03.md`.

## Status

| Feature | State |
|---|---|
| xAPI reporting | **wired** (2026-11-03). Verified on the stub (`_test/verify-report.mjs`). Not yet run against Kata: the catalogue is not registered there yet (docs-and-tools/BASELINE.md) |
| Issue report | **wired**. The unit's own modal now posts to the shared 720 form |
| Resume | **on** (2026-11-04), **built hardened**: the 2026-11-03 rules (`BOOT-AND-RESUME-HARDENING-2026-11-03.md` §6) from day one. Verified on the stub; not yet live |

`_test/verify-report.mjs`: 905/905 checks (reporting 646; resume and boot 259).

## Layout

Script order in every part:

| File | What it holds |
|---|---|
| `unit-js/10-identity.js` | Prefix, unit slug, resume flag |
| `20-xapi.js` | Item scope, `xapiAnswered`, the MOE `xapiResponse` layer |
| `25-report.js` | Form sender |
| `40-resume.js` | Ledger and state document. Hardened A1–A4 |
| `50-loader.js` | CDN library, metadata, `initialized`, the restore. Hardened B1–B5 |
| `<part>/script.js` | Range, `PART_CONFIG` and the xAPI seams: `XAPI_COMP_SLUG`, `XAPI_METADATA_FILE`, `SCREEN_TO_SUBCONTENT`, `XAPI_EVAL_ITEMS`, `XAPI_PART_QUESTIONS`, `XAPI_END_BTN` |
| `unit-js/main.js` | The engine and the call sites |
| `unit-js/90-boot.js` | Boot, last |

The layer files 10–50 come from `methodica-science-mass-density-01` (2026-11-02, the body-matter-01 lineage). That is the
newest layer with MOE's response formats. None of the math units' layers has them, and no unit shares this engine.

## What is reported

- **Component:** `initialized` on load. `completed` on the part's **last click** (`partFinish`), which also disables that
  button:
  - "המשך" past the last screen, through `goTo`, in parts 01–05;
  - "סיימתי" in parts 06 and 07.

  The result is `scaled` = correct / every catalogue question of the part, with `success` at 0.6 (`XAPI_PASS`). Part 04
  has no question and completes without a result. There is no unit-level statement and no navigation: the platform
  routes.
- **Item:** `initialized` / `completed` when the learner crosses an item boundary (`xapiOnScreen` in `goTo`;
  `SCREEN_TO_SUBCONTENT`). An evaluated item's `completed` carries its own result.
- **Question:** `answered` on every check, and `answered.last` on the final one (right, or no attempt left).
  - `object.id` is the metadata `questionId`, and `parent` is the item.
  - `result` carries `success`, `score.scaled` and `response`.
  - The call sites are in `main.js`: `xapiReport(key, …)` over `XAPI_QUESTIONS`, one table for the whole unit.
- **Hint:** `requested.1` once per question, when the hint opens (`xapiHint`).
- **Not reported:**
  - "View My Answer" (`fbtToggle`), which only switches the view of an answer already reported.
  - The ungraded screens that are not in the catalogue: s18, s20/s21/s23 and the s57 survey.

## `result.response` — MOE's formats (mail "דיוק ביישום תקן XAPI", v2.7)

The metadata `questionType` decides the format, and every piece is the catalogue string byte for byte. Taken from the
harness's right walk:

| Type | Question | `response` |
|---|---|---|
| numeric | 03-05-001/q1 (s59; typed "25,000") | `25000` |
| choice | 03-02-006/q2 (s39 ב) | `1,250 גרם` |
| choice, multiple | 03-07-001/q3 (s76) | `<answer 1>[,]<answer 2>[,]<answer 4>`, in catalogue order, whatever the click order |
| choice (yes/no) | 03-03-005/q3 (s47 ג) | `כן` (catalogued as `choice`: a true-false response could never equal the catalogue strings) |
| fill-in | 03-05-003/q1 (s64) | `9:11` |
| performance | 03-02-005/q1 (s38) | `אחוז המתנדבים בחברה להגנת הטבע[.]25[,]מספר המתנדבים בצער בעלי חיים[.]18` |
| performance + select | 03-06-001/q4 (s71) | `10% מניקוד המינימום (נקודות)[.]30[,]…[,]מעולה / לא מעולה / לא ניתן לדעת[.]לא מעולה` |

- Performance steps are the catalogue's `correctAnswers[].stepId`, in that order. That is the Kata shape (BASELINE.md).
- A right answer equals Kata's correct pattern byte for byte; the harness asserts this for all 39 questions.
- `object.definition` (interactionType, correctResponsesPattern) is not sent; the library drops it. MOE's examples
  carry `object.id` only, and Kata builds the pattern from the catalogue. Open question for MOE, not a defect.

## Decisions to know about

- **01-001/q1 (s2, the hook).** The screen does not grade it, but the catalogue has it as a `choice` with the right
  answer "200 דקות". It is reported against the catalogue, so it counts in part 01's score. If that is unwanted, the
  catalogue should make it ungraded.
- **The last button greys out after the last click.** That is the standard (D-8). On Kata the component is removed
  at that moment anyway.
- **The issue report** records the readable label of the problem type, the component slug, and the item and page from
  `SCREEN_TO_SUBCONTENT`.

## Resume (2026-11-04)

### What is saved

One state document per part, as in every 720 unit (`40-resume.js` header). It holds:
- the shared ledgers (`done`, `doneItems`, `hints`);
- `ui.character`;
- `payload`, written by `capturePartPayload()` in `unit-js/main.js`:

| Key | What |
|---|---|
| `currentScreen` | Where the learner was |
| `ssm` | The engine's **screen state memory**, the same memory that in-session back navigation already replays. For every visited screen it keeps the interaction DOM (field values, classes, disabled / hidden, the rendered feedback) and the screen's logic object (`attempts`, `done`, `lastWrong`, `selected`, section bars …) |
| `lomda` | `practiceResults` (progress banners), `guidedPractice` (s7), `carouselProgress` (s6b) |
| `q` | `XAPI_Q_RESULTS`, so item and part results survive a reload |
| `fbt` | The View My Answer toggles: which view, and the learner's own values. The s38 render hook is saved by name |

Measured on the stub: 0.8–53 KB per part. Part 02 after the wrong walk is the largest. All are far under
Kata's 1 MB cap.

### Why the memory and not per-screen painters

Every screen family's init already ends in `ssmRestore()`. So the restore, and every later navigation,
paint through the path back navigation has used since Phase 1. That path was verified identical to the old
build on all 63 screens.
- **The guide's painter rules hold by construction.** The screen shows what live play left, pending input
  included, and wrong marks only where the learner left them (§8.8 rules 4, 8, 10).
- **The Retry gate (D-14)** is the screens' own `lastWrong`, saved in the logic objects.
- **Rule 6 (hidden views):** s7's table step is repainted by the only path that reveals it (Back →
  `s7RestoreTableStep`). The harness checks this after a reload.
- **Only s2 and s7 paint from their own state** rather than from memory. `applyResumeVars` puts that
  state back before their init runs.

### MathJax: the TeX source is saved, never the typeset markup

MathJax CHTML writes its glyph CSS per page load, so typeset feedback replayed in a new page would draw
broken math.
- **The stamp:** a render action (`stampTex` in `main.js`) stamps every formula with `data-tex` /
  `data-display` as it is typeset. The stamp survives in every copy of the markup: a snapshot replayed by
  `ssmApply`, and the `fbHtml` that s37 / s39 / s47 keep per section.
- **The save:** `capturePartPayload` saves `\(…\)` / `\[…\]` instead (`ssmTexHtml`, `ssmTexDeep`).
- **The restore:** on entry the screens re-typeset raw TeX themselves (`ssmTypesetIfRaw`).
- **The checks:** the harness asserts that no `mjx-` markup reaches the document, and that restored
  feedback shows the same number of formulas.

### When it writes

All of these go through the hardened layer: nothing is written before stage B or after a failed read.

| Moment | Call |
|---|---|
| Screen change | `goTo` → `scheduleResumeSave()` (debounced) |
| Pick, typing, intra-screen step | The engine's deferred action listener → `scheduleResumeSave()` |
| Each graded answer | `xapiReport` → `resumeCommit()`: a synchronous `flushResumeSave()` one tick later, after the feedback is drawn (D-13) |
| Hint, item or part `completed` | The ledger (`markSent`), synchronous, only once `_resumeReady` |
| Character | `selectOption` → `setUnitCharacter`. Queued before stage B, drained as read |
| Leaving the page | `pagehide` / hidden → `flushResumeSave()` |

During a restore, `goTo` skips its leave-snapshot (`resumeIsPainting()`). The page is still the fresh boot
screen then, and its snapshot would replace the restored record.

### The character

The choice moved from the engine's own `localStorage` key into the document's `ui`
(`getUnitCharacter` / `setUnitCharacter`), with `UI_CHARACTER_KEY` as the cache (D-6). A value found only
under the old key `methodica-math-percent-03:selectedCharacter` is carried over once.
- Part 01 still opens with the picker unselected.
- As in every 720 unit, the loader adopts the cached or saved choice in stage A. So a returning learner,
  or the next learner on the same browser, sees that card already picked. This is the shared layer's
  4-step rule (decision 2026-09-16).

### Boot hardening (BOOT-AND-RESUME-HARDENING-2026-11-03.md)

| Rule | Here |
|---|---|
| A1–A4 (`40-resume.js`), B1–B5 (`50-loader.js`) | Ported from mass-measure-01 `422f640`, using `rollout-tools-2026-11-03/patch-resume-layer.py` with anchors adapted to this unit's comments. B1 was already in this lineage |
| C1: inline net | This unit had **no boot cover at all**. Added to every part: `#boot-cover` (page background `#1a2744`) and the inline net. The net waits 800 ms, or up to 6 s while `__resumeInFlight`; the flag is raised on `registration=` |
| C2 | At the top of `<head>`, before the blocking MathJax script: preload of `xapiwrapper.min.js` and `xapi-720-k.js` (the loader's exact URL, no `?v=`, no `crossorigin`), and a preconnect to `kata.cet.ac.il` |
| C3 / C4 | Done in Phase 1: every raster image off the landing screen is lazy; the 01/s8 clip mounts on entry |
| C5 | `10-identity`, `40-resume` and `50-loader` at `?v=20261104a`, `main.js?v=3`; identical in all parts |
| Media budgets (§2.4–2.5) | Done in Phase 1: 0.65–0.8 MB load weight per part |

### Found on the way (not changed — content code)

**A double typeset in five final-wrong branches** (s34, s35, s36, s37a, s37b). `fbtStart` already
typesets the popup, and then the branch calls `MathJax.typesetPromise([feedback])` again.
- **The effect:** the second pass runs MathJax's MathML input over each formula's screen-reader copy, and
  nests a second, invisible formula inside it. Nothing is visible, but a screen reader may read the
  formula twice.
- **After a resume:** the popup is typeset once, without the copy.
- **The fix:** remove the second call, one line per branch. It wasn't made because it is not part of
  resume.

## Leave save, `xapi-720-l.js` (2026-11-04)

The unit loads `-l`, which is `-k` plus `saveState720OnLeave`. It is used only from the leave handler, in
`flushResumeSaveLeaving`, and only when the function exists. The reason is that Chrome refuses the
library's synchronous `PUT` while a page is being left, so on `-k` the last change before closing
(≤ 800 ms) was lost. `-l` tries the same synchronous `PUT` first, and sends it as a `keepalive` fetch only
when it throws. The evidence and the rollback are in `LIVE-VERIFICATION-2026-11-04.md` ("Fix for finding 1").
Rolling back to `-k` means changing three things back: the letter and regex in `50-loader.js`, and the
preload links.

## Verification

```
python -m http.server 8803 --bind 127.0.0.1        # from the repo root
node _test/verify-report.mjs http://127.0.0.1:8803  # 905/905
```

The harness drives headless Chrome on the stub (`_test/xapi-720-k.js`, loaded with `?xapiLib=` on localhost only).
For each part it answers every catalogue question all right and then all wrong, opening the hints along the way, and
checks:
- ids, parent and verdict of every question;
- the right-answer response against the catalogue pattern;
- one `requested` per question;
- the item pairs;
- one component `completed` with score 1 (right walk) and 0 (wrong walk);
- no `[xAPI]` warnings.

It found two bugs before they shipped:
- **s39 ב/ג:** reported section א's option text. The selector was not scoped to the section.
- **Option labels with a `<br>`:** a raw `textContent` read glues the two words together. The layer's `xapiOptText`
  handles this correctly, and the harness now matches labels the same way.

### Resume checks, per part

**Round trip, after each walk:**
- every screen of the part is fingerprinted: the interaction DOM, feedback text, the number of formulas,
  the screen's logic object, results, the View My Answer views and the character;
- the page is reloaded, and the restored part must fingerprint the same;
- the reload sends no `answered` / `requested` and no duplicate `completed`;
- the last button stays disabled (D-8);
- the document carries the character and no `mjx-` markup.

**Retry gate across a reload:** after one wrong attempt and a reload, the learner is on the same screen at
attempt 1. The check button is still disabled on the untouched wrong answer (D-14), and nothing is re-sent.

### Hardening checks, run once

- **`write-guard`** (§2.6), on part 01:
  - the tester's scenario, replayed: save on screen 25 and reload; then, before stage B, a pick and a
    navigation; then drain and restore;
  - `markSent` before stage B;
  - a failed read: every write refused, a later success clears the flag, a 404 is not a failure.
- **`shape`:** A1–A4 and B2–B5, read from the source.
- **`boot`**, per part:
  - one inline net, which raises the flag on `registration=`. Checked statically, and by running it with
    and without a registration;
  - both preload links, matching the loader's library letter, with no `crossorigin`;
  - the preconnect;
  - raster images lazy off the landing screen, and none lazy on it;
  - identical `?v=` across parts.

### Mutation runs (2026-11-04)

- **The pre-fix layer** (40 + 50 from `287b7c8`, resume on) fails the `write-guard` group:
  - the drain wrote screen 1 over the saved screen 25 (A1);
  - `markSent` wrote before stage B (A2);
  - the failed-read probe throws, because there is no `_resumeReadFailed`.
- **A payload without `ssm`** fails the round trip and the Retry-gate checks on part 03.

### UI regression

The UI regression walk (`_test/visual-snapshot.mjs INTERACT=1`) is unchanged against the pre-merge build. It
was re-run on 2026-11-04 with resume on (the `-k` library, the boot cover):
- the same text and control state on all 63 screens;
- pixels within the Phase 1 media noise (at most 0.12 %);
- the only difference is the CDN library's own console line ("not found in URL, reporting disabled"),
  printed locally because there are no launch parameters.

Locally, without `?slxapi`, the CDN library keeps the state document in `localStorage`, so a local or QA run
resumes too. `?resetState` starts clean.
