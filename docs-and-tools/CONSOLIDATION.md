# Engine consolidation (2026-11-03)

## What changed

Before: seven `script.js` files, each a full copy of the 5,200–5,700-line lesson, limited by `SPLIT_FIRST`/`SPLIT_LAST`.
Every part had fixed only its own screens.

Now:
- **`unit-js/main.js`** (≈5,500 lines) is one engine for all seven parts.
- **Each part's `script.js`** (≈20 lines) declares its range and a `PART_CONFIG`.
- **Each `index.html`** loads `script.js`, then `../unit-js/main.js`.

## How the engine was built

The merge was mechanical, by ownership. A screen's owner is the part whose `index.html` holds its section.

| Kind of code | Taken from |
|---|---|
| Statements identical in every part where present (170 of 348) | that text |
| Screen functions and state (`s47Init`, `S39_SECTIONS`, `s7Step0Submit` …) | the owner part's version |
| Screen-keyed tables (`VQ`, `CHARACTER_SCREEN_REGISTRY`, `CHAR_SIZE_/POSITION_REGISTRY`, `ICON_SCREENS`, `VQ_NAV*`, `backMap`) | entry by entry, from the owner part. Part 01's copies had the 05–07 screens under old ids (s58–s64 for s59–s65) |
| `resetScreenState` | each data-screen range from its owner part |
| `goBack` | 01 version, plus the in-screen step-back lines of s37/s39 (02) and s47 (03) |
| `goTo` | 03 version (closes the embed zoom; a no-op elsewhere) |
| `vqInput` / `vqEnable` / `vqSelect` / `vqMultiToggle` / `vqSubmit` / `fbtApply` | merged; the per-part differences are kept through `PART_CONFIG` (below) |
| `CHAR_ASSETS` | union of the poses the parts added (`thinkVideo` 02, `please` 04). s58's thumbs-up **clip** (05) is now the pose `thumbsUpVideo`; s30 (01) keeps the still `thumbsUp` |
| Dropdown positioning (`vqListboxes`) | 06 version (measures against the bottom bar); s61 renders the same |

`PART_CONFIG` holds the differences between parts, unchanged from before:

| | 01 | 02 | 03 | 04 | 05 | 06 | 07 |
|---|---|---|---|---|---|---|---|
| `numericInput` | none | none | digits | none | thousands | digits | digits |
| `legacyRetry` | – | – | **yes** | – | – | – | – |
| `boot` (first screen) | – | `s33Init` | `transInit` s42 | s55 | s58 | s66 | s72 |

Unifying these is a content decision, not a refactor. Part 03 never received the 2026-10-14 retry-mark helper
(`vqMarkRetry`). Numeric fields accept different input per part.

## Removed

- s5 (method choice) and s6a (playlist / YouTube): `learningVideos`, the IFrame API loader that ran on every page of 02–07,
  `s6a*`, `s5*`, `switchLearningMethod`, `advanceFromS5/S6a`, and their branches in `resetScreenState`, `goBack` and the
  Esc handler.
- `peakFinish` and the s77/s78 end-screen branches (screens removed earlier).
- `s56Pick` / `s56Continue` / `s56State`: the owner part 04 had already replaced them.
- `s7Toggle*Reveal` and `s38ToggleReveal`: the owners had moved to the View My Answer toggle.
- The s6a placeholder comment in 02–07.

## Other changes in this step

- The dev `postMessage` bridge (`DEV_GOTO` / `DEV_READY` / `DEV_LEAVE_SPLIT`) is live only with `?dev=1`, which
  `dev-nav.html` and `index_dev.html` now pass. On the platform the page neither listens to nor posts to its frame.
- Page titles were "מדעים". They are now the component title plus the unit.

## Not done: `styles.css`

The seven stylesheets are still per part. Each part trimmed the shared multi-screen selector lists to its own screens, so
the same rule differs per part. 146 screen-scoped rules survive only outside their owner part, and the order is the cascade.
A correct merge means judging about 200 rules by hand. Reporting and resume do not need it, because the new shared UI
(report modal, boot cover) gets its own `unit-css/` files.

## Verification

`_test/visual-snapshot.mjs` drives the installed Chrome over the DevTools protocol (no dependencies). The pre-merge build
was frozen in a worktree. Both builds were compared:
- **Initial render** of all 63 screens at 1280×710 and 390×844: pixels and text identical. The phone run of part 06
  showed anti-aliasing noise, and a fresh render of the old build matched the new one exactly.
- **Interaction walk** (`INTERACT=1`): on every screen, fill and pick, check, fill again, check, hint, then the answer
  toggle. That is 378 steps, 183 of which change state. Pixels, text and the class, value and disabled state of every
  control are identical, with no new console errors.
- No undeclared calls in `main.js`, and every markup handler in every part resolves.
