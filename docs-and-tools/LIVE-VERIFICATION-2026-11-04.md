# Live verification — 2026-11-04

The deployed unit, launched from real Kata links, against Kata's LRS with the production library
(`720active/common/xapi-720-k.js`). Package `deployments/2026-11-04`, built from `2382b9e`.

## The upload

Vadim uploaded the package to `https://lomdot.education.gov.il/metodica/720/math/percent/03/` and deleted the
whole previous version first (so DEPLOY.md Step 3 is done too).

- All 91 package files answer with the package's byte size. The CDN answers 200 with length 0 for a missing
  path, so this is checked by size, not by status.
- The 39 text files (pages, scripts, styles, metadata) are MD5-identical to the package.
- None of the 306 superseded paths answers any more.

## Catalogue

`send-metadata.ps1` LIVE, 2026-11-04: the unit, 7 components and 24 items were created, and the
`recommendedAfterFail` link 03 → 02 was set; 0 failed. All 7 components are **draft**. `retrieve-metadata.ps1`
reads back identical to `metadata/` on all 39 questions (type, answers, correct answers).

## How it was run

- `node _test/live-kata.mjs <links A.csv> <links B.csv> [parts] [out.json]` runs headless Chrome. Every
  request the page makes to Kata's xAPI is recorded from the browser's network traffic, together with the
  status Kata returned.
- The answering code is shared with the offline harness (`_test/drive-common.mjs`), which still passes
  905/905 after the split.
- Links come from `Tools/full-kata-link/New-KataLaunchLinks.ps1 -UnitKey methodica-math-percent-03`. The CSVs
  stay in that folder: they carry live tokens and are never committed.
- There were four pseudonymous learners:
  - `VADIM-1234` (A) and `VADIM-1234-B` (B) in run 1;
  - `VADIM-1234-C` (as A) and `VADIM-1234-D` (as B) in run 2.
- Learner A answers every question right. Learner B answers every question wrong, opens the hint, and makes
  a second attempt where one is allowed.
- **Kata reuses one registration per learner and component.** New links for the same learner give the same
  registration, so a test learner can be used only once per component. A shakedown on part 04 had already used
  A and B there, which is why parts 01, 03 and 04 were re-run with learners C and D.

## Results — PASS

- Run 1 covered parts 02, 05, 06 and 07.
- Run 2 covered parts 01, 03 and 04, plus the tester's scenario and the Slow 4G launch: **235/235**.

For every part and learner:
- Every statement was accepted (2xx).
- For each question, the last `answered` carries the right verdict.
- On the right walk, the `response` is byte-equal to the pattern Kata builds from the metadata.
- The parent is the item.
- There is at most one `requested` per question.
- There is one component `completed`, with score 1 (A) or 0 (B).
- There was no `[xAPI]` or `[resume]` warning.

Relaunching the same link (save → relaunch → restore):
- Every screen of the part restores identically (the resume fingerprint), on the screen the learner left.
- Nothing `answered` or `requested` is sent again, and no second component `completed`.
- The state document on Kata carries the component and the character.

| Part | Run | Statements (A right / B wrong) | Question rows | Relaunch: screens, landed, document A / B |
|---|---|---|---|---|
| 01 | 2 | 15 / 23, all 2xx | 5 | 23, 26, 8547 / 11074 bytes |
| 02 | 1 | 23 / 41, all 2xx | 9 | 7, 33, 12819 / 17842 bytes |
| 03 | 2 | 27 / 48, all 2xx | 11 | 11, 48, 12857 / 18379 bytes |
| 04 | 2 | 4 / 4, all 2xx | 0 | 3, 51, 1069 / 1069 bytes |
| 05 | 1 | 15 / 29, all 2xx | 7 | 8, 59, 7899 / 12903 bytes |
| 06 | 1 | 8 / 16, all 2xx | 4 | 6, 65, 5030 / 7891 bytes |
| 07 | 1 | 7 / 12, all 2xx | 3 | 5, 70, 4166 / 5005 bytes |

| Question | Type | A: last `response` (= Kata pattern) | B: answered / requested |
|---|---|---|---|
| `methodica-math-percent-03-01-001/q1` | choice | `200 דקות` | 1 / 0 |
| `methodica-math-percent-03-01-003/q1` | performance | `זמן בדקות[.]30[,]אחוז חלקי[.]15[,]אחוז שלם[.]100` | 2 / 1 |
| `methodica-math-percent-03-01-003/q2` | numeric | `200` | 2 / 1 |
| `methodica-math-percent-03-01-005/q1` | numeric | `20` | 2 / 1 |
| `methodica-math-percent-03-01-005/q2` | numeric | `400` | 2 / 1 |
| `methodica-math-percent-03-02-001/q1` | numeric | `200` | 2 / 1 |
| `methodica-math-percent-03-02-002/q1` | numeric | `44` | 2 / 1 |
| `methodica-math-percent-03-02-003/q1` | numeric | `2000` | 2 / 1 |
| `methodica-math-percent-03-02-004/q1` | numeric | `15` | 2 / 1 |
| `methodica-math-percent-03-02-004/q2` | numeric | `300` | 2 / 1 |
| `methodica-math-percent-03-02-005/q1` | performance | `אחוז המתנדבים בחברה להגנת הטבע[.]25[,]מספר המתנדבים בצער בעלי חיים[.]18` | 2 / 1 |
| `methodica-math-percent-03-02-006/q1` | choice | `250 גרם` | 2 / 1 |
| `methodica-math-percent-03-02-006/q2` | choice | `1,250 גרם` | 2 / 1 |
| `methodica-math-percent-03-02-006/q3` | choice | `קטן יותר` | 2 / 1 |
| `methodica-math-percent-03-03-001/q1` | numeric | `500` | 2 / 1 |
| `methodica-math-percent-03-03-002/q1` | numeric | `120` | 2 / 1 |
| `methodica-math-percent-03-03-003/q1` | numeric | `300` | 2 / 1 |
| `methodica-math-percent-03-03-004/q1` | numeric | `400` | 2 / 1 |
| `methodica-math-percent-03-03-005/q1` | choice | `40%` | 2 / 1 |
| `methodica-math-percent-03-03-005/q2` | numeric | `75` | 2 / 1 |
| `methodica-math-percent-03-03-005/q3` | choice | `כן` | 1 / 1 |
| `methodica-math-percent-03-03-006/q1` | numeric | `24` | 2 / 1 |
| `methodica-math-percent-03-03-006/q2` | choice | `208.3 סמ"ר` | 2 / 1 |
| `methodica-math-percent-03-03-007/q1` | numeric | `50` | 2 / 1 |
| `methodica-math-percent-03-03-007/q2` | choice | `1:4` | 2 / 1 |
| `methodica-math-percent-03-05-001/q1` | numeric | `25000` | 2 / 1 |
| `methodica-math-percent-03-05-001/q2` | numeric | `4800` | 2 / 1 |
| `methodica-math-percent-03-05-001/q3` | performance | `סכום כל תשלום (ש"ח)[.]6000[,]יותר / פחות / אותו סכום[.]אותו סכום` | 2 / 1 |
| `methodica-math-percent-03-05-002/q1` | numeric | `250` | 2 / 1 |
| `methodica-math-percent-03-05-002/q2` | numeric | `210` | 2 / 1 |
| `methodica-math-percent-03-05-003/q1` | fill-in | `9:11` | 2 / 1 |
| `methodica-math-percent-03-05-003/q2` | numeric | `200` | 2 / 1 |
| `methodica-math-percent-03-06-001/q1` | numeric | `300` | 2 / 1 |
| `methodica-math-percent-03-06-001/q2` | numeric | `24` | 2 / 1 |
| `methodica-math-percent-03-06-001/q3` | numeric | `84` | 2 / 1 |
| `methodica-math-percent-03-06-001/q4` | performance | `10% מניקוד המינימום (נקודות)[.]30[,]ניקוד נדרש לצריכה מעולה (יותר מ-, נקודות)[.]330[,]ניקוד הטלפון (נקודות)[.]324[,]מעולה / לא מעולה / לא ניתן לדעת[.]לא מעולה` | 2 / 1 |
| `methodica-math-percent-03-07-001/q1` | choice | `טועה` | 1 / 1 |
| `methodica-math-percent-03-07-001/q2` | numeric | `400` | 2 / 1 |
| `methodica-math-percent-03-07-001/q3` | choice | `טבלת הפרופורציה מאפשרת לפתור כל שאלת אחוזים באופן ישיר, ובלי להיות תלויים ב"מספרים יפים"[,]טבלת הפרופורציה חוסכת את הצורך לחשוב מהו גורם ההרחבה מ-14 ל-100, ומביאה לתשובה הסופית בנוסחה אחת פשוטה[,]טבלת הפרופורציה מאפשרת גם למצוא את החלק כאשר השלם נתון` | 2 / 1 |

`01-001/q1` (the s2 hook) has no hint and a single attempt, and `03-005/q3` and `07-001/q1` allow one attempt,
so B has one `answered` there.

### The tester's scenario (part 01)

A script injected into the page picked a card and navigated to screen 1 at 679 ms, before stage B (the restore)
had run. This reproduces the drain bug's trigger. Result:
- The document on Kata kept screen 26 and all 23 saved screens.
- The page restored to screen 26.
- The picked character (`char1`) won.

The A1 drain fix holds live.

### Slow 4G, cold cache (part 03)

Chrome's Slow 4G preset with the cache disabled:

| Time | What happened |
|---|---|
| 5.7 s | The HTML arrived, and the cover was up from that moment with `__resumeInFlight` raised (C1). |
| 10.5 s | The page reached the part's first screen (36), still under the cover. |
| 11.95 s | The cover dropped with the restore done, on screen 48. |

No sample showed screen 0 or 36 uncovered. **PASS, but with no margin:** the cover held about 6.2 s from when
it appeared, which is the safety net's 6-second ceiling. The library's synchronous state read blocks the page,
so the samples cannot tell whether the loader or the ceiling removed the cover. On a slower link than Slow 4G,
the ceiling would show screen 36 for a moment before the restore moves on.

## Found

1. **Chrome blocks the leave save.** It is the same in every unit on `xapi-720-k.js`.
   - `flushResumeSave` on `pagehide` / `beforeunload` / `visibilitychange` calls `saveState720`, which uses a
     synchronous XHR. Chrome refuses synchronous requests during page dismissal (`NetworkError: Failed to
     execute 'send' on 'XMLHttpRequest'`, seen live).
   - Effect: a screen change in the last 800 ms before the page closes or navigates (the debounce window) is
     lost, and the relaunch lands one screen back.
   - Answers and completion are written synchronously while the page is still alive (`resumeCommit`), so they
     are not affected.
   - A mobile tab sent to the background (hidden without unloading) still saves.
   - Fix: a `keepalive` fetch for the leave path in the shared library. That library is shared, so this needs
     approval and is not changed here.
2. **Cover margin on Slow 4G:** see above. Possible levers are a higher ceiling for `registration=` launches, or
   an earlier and lighter first screen in part 03. Both are open.
3. **The character is cached in the browser.** Learner B's first launch, in the same Chrome profile as learner
   A, showed A's `char2` as its preselected character. This is the known shared-browser behavior: Kata's
   document wins as soon as it has a character.

## Fix for finding 1: `xapi-720-l.js` (branch `vadimr/fix/leave-save-l`, NOT uploaded)

`720-common-lib/xapi-720-l.js` is a byte copy of `-k` with one additive function, `saveState720OnLeave`.
- 58,389 bytes, MD5 `11ce05bd4ae4ddb83480d2e6178cf7f5`.
- `-k` is untouched: MD5 `f8df5d9d4c17a560847c53542e0c9f87`, identical to the CDN copy.

How the function works:
1. It first does exactly what `-k` does, the synchronous `PUT`.
2. Only when that throws (Chrome's refusal while the page is being left) does it send the same request
   as a `keepalive` fetch.
3. It cancels the pending debounced write, skips bodies over 60,000 UTF-8 bytes, sends an identical body
   only once within 2 s, and never throws.
4. Every outcome is recorded with op `leave`.

The unit calls it from its leave handler only (`flushResumeSaveLeaving` in `40-resume.js`), checking first
that the function exists, so the unit still runs on `-k`. Other changes:
- `50-loader.js` loads `-l`, and its `XAPI_USING_G` regex is now `[ghijkl]`. The harness now fails if
  the letter is ever missing.
- The 7 pages preload `-l`.
- `?v=` is bumped to `20261104b` on 10, 40 and 50.

| Check | Result |
|---|---|
| Diff `-k` → `-l` | 3 insertions (header, function, export), 0 lines changed or removed |
| `720-common-lib/_test/state-leave.js` (new) | `-l` 38/38. `-k` fails (negative control). Three mutants of `-l` (keepalive off, dedupe off, retry on HTTP 412) each fail their own checks |
| Existing library tests on `-k` and `-l` | `state-diagnostics` 35, `item-completed-result` 16, `requested-extension` 15, `video-object-id` 23: output identical |
| `_test/verify-report.mjs` | **914/914**: the 905 earlier checks, plus `leave` (a reload right after `goTo` lands there, through `saveState720OnLeave` on `-l` and through `saveState720` on `-k`) and the regex-letter guard. With the leave flush disabled, it fails exactly as live did (24 instead of 26) |
| Live, shadow mode (`_test/live-leave.mjs`, learners E / F) | See below |
| Live, shadow mode, all 7 parts (`SHADOW_LIB=… _test/live-kata.mjs`, learners I / J) | **561/561**. Each relaunch had one keepalive leave `PUT` (answer unobservable after the navigation) and restored identically |

**Shadow mode** (`_test/shadow.mjs`): the deployed pages, a real Kata link, token and LRS. Through DevTools
request interception, the browser is served this tree's text files and the local `-l` instead of the CDN
copies. Nothing was uploaded.

Live leave probe, part 01. The baseline is the deployed `-k` (learner F); the candidate is `-l` in shadow
mode (learner E):

| Scenario | `-k` | `-l` |
|---|---|---|
| `goTo(22)`, 1.5 s, `goTo(23)`, navigate away at once | lands on **22**: the leave `PUT` threw `NetworkError` | lands on **23**: `keepalive` `PUT` after an `OPTIONS` preflight (200) |
| Page hidden but kept alive | synchronous `PUT` 204, then the debounced write as well | the same synchronous `PUT` 204, **no fetch**, debounce cancelled |
| Answer s31, navigate away at once | 25, s31 done | 25, s31 done |
| Close the tab at once | 24 | 24 |

The tab-close row is not conclusive. The headless tab outlived the 800 ms debounce, which is why both builds
pass it. The navigation row is the decisive one.

**Not covered here:**
- Firefox and Safari/iPad. The fallback runs only where the synchronous `PUT` throws, so a browser without
  `keepalive` behaves exactly like `-k`. These are manual checks after the upload.
- Slow 4G timing in shadow mode. The swapped files skip the throttled network, so the earlier CDN run stays
  the timing evidence.

## `-l` deployed — 2026-11-04

Vadim uploaded `xapi-720-l.js` to `720active/common/` (58,389 bytes, MD5 `11ce05bd…`; `-k` unchanged). He
then uploaded the 10 changed percent-03 files from `deployments/2026-11-04-leave-l` (commit `8b63a4f`).
Checked afterwards: all 39 live text files are MD5-identical to the package, and all 91 files match it by
size.

Live, on the deployment itself (no shadow mode):

- **Leave probe** (`_test/live-leave.mjs`, learner K). The page loads `-l` and `saveState720OnLeave` is
  present. Results:
  - **change a screen, navigate away at once:** lands on **23** (on `-k` it landed on 22);
  - **tab hidden but alive:** the synchronous `PUT` 204 only;
  - **answer, leave at once:** 25, with s31 done;
  - **close the tab:** 24.

  DevTools reports the departing page's keepalive `PUT` as `net::ERR_ABORTED`, after an `OPTIONS` 200.
  That is how a keepalive outlives its document: the landing on 23 is the write it carried, because no
  other write had screen 23.
- **All 7 parts** (`_test/live-kata.mjs`, learners L / M): **561/561**. That covers statements, restores,
  no re-sends and the tester's scenario.
  - In this run the relaunch's leave save went out synchronously, before the page was dismissed. In the
    shadow run it went as keepalive. The timing varies, and the restore was identical both ways.
- **Slow 4G, cold cache, real CDN:** unchanged from `-k`. The cover appears at 5.8 s, the page reaches
  screen 36 under it at 10.6 s, and the cover drops with the restore done, on screen 48, at 12.2 s. That
  is about 6.35 s after the cover appeared, so still right at the 6-second ceiling (finding 2, open).

Still to do by hand: Firefox and Safari/iPad. Change a screen, close the tab within a second, then reopen
the link; it must land on the new screen.
