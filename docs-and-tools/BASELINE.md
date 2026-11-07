# Baseline before reporting and resume (2026-11-03)

## Source of truth

`main` at `25b5b9a` (2026-10-22 QA close plus the translation export) is the source. The live CDN copy is older.

Live (`https://lomdot.education.gov.il/metodica/720/math/percent/03/…`) was fetched on 2026-11-03, and each
part's `index.html` / `script.js` / `styles.css` was matched by blob hash against every commit in the
repo. The newest commit holding each live file:

| Part | index.html | script.js | styles.css |
|---|---|---|---|
| 01 | `979795c` (08-10) | `979795c` | `979795c` |
| 02 | `e826669` (09-01) | `979795c` | `e826669` |
| 03 | `8809edd` (09-01) | `8809edd` | `8809edd` |
| 04 | `e91f306` (09-01) | `c1da698` (09-01) | `c1da698` |
| 05 | `881130a` (09-01) | `881130a` | `c1da698` |
| 06 | `b19d346` (09-01) | `b19d346` | `d199325` (09-17) |
| 07 | `2ae41bc` (09-01) | `979795c` | `d199325` |

Every live file exists in history, so nothing was edited on the server. Live is a mixed 08-10 … 09-17 upload. It has none
of the 2026-09-17 … 10-22 content and QA work (22 commits since `979795c` on `main`). The next deployment replaces it
completely.

## Catalogue (Kata)

- `methodica-math-percent-03` is **not registered on Kata**. `GET /api/v1/content-units/methodica-math-percent-03` returns
  404, and the unit is absent from the account's 37 units (2026-11-03). The `metadata/` folder (authored 2026-10-25) has
  never been sent.
- Before sending (with the owner's approval), the metadata was brought to the shape Kata accepts (percent-05 `0e8e68d`):
  - The four `performance` questions (01-003/q1, 02-005/q1, 05-001/q3, 06-001/q4) had an authored `steps[]`. Kata
    rejects that with a 422. They now carry `answers: null` and `correctAnswers: [{stepId, response}]`, one step per input
    in the metadata's step order.
  - 03-005/q3 (`כן` / `לא`) was `true-false`. An xAPI true-false response is the literal `true`/`false` and can never
    equal the catalogue strings, so it is now `choice` (MEMO 2026-10-21 rule).

## Code and media (the reasons for the optimization phase)

- The seven `script.js` files are each a full copy of the 5,200–5,700-line lesson, limited by `SPLIT_FIRST`/`SPLIT_LAST`.
- 02–07 load `https://www.youtube.com/iframe_api` on every page for dead s6a code; no part has the player host. 01 has no
  YouTube code.
- Media totals 313 MB, about 191 MB of it duplicate copies across parts. Nothing is lazy-loaded. Scene PNGs are
  2816×1536. Part 03 fetches 35.7 MB on open.
- There are no drag-and-drop questions. The body-matter-01 pointer-drag change (2026-11-03) does not apply.
