# Screen → item → question map (draft, 2026-11-03)

Source: `metadata/*.json` (after the BASELINE.md shape fixes), `translation/translation-screen-manifest.csv`, and the
screen code. This drives `SCREEN_TO_SUBCONTENT` / `XAPI_SCREEN_QUESTIONS` per part. Item = `<component>-NNN`. Response
format follows the metadata `questionType` (MOE / xAPI-Data response patterns; strings byte-equal to the metadata).

| Part | Screens | Item | Questions (screen → q, type, correct) |
|---|---|---|---|
| 01 | s0, s1, s2 | 001 | s2 → q1 `choice` "200 דקות". The screen is ungraded in the UI; success comes from the catalogue |
| 01 | s3, s4, s6b | 002 | — |
| 01 | s7 | 003 | s7 step 0 (table) → q1 `performance` זמן בדקות=30, אחוז חלקי=15, אחוז שלם=100; s7 step 1 → q2 `numeric` 200 |
| 01 | s8, s16–s29 | 004 | — (guided s20/s21/s23 choices and the s18 reflection are uncatalogued: no `answered`) |
| 01 | s30, s31, s32 | 005 | s31 → q1 `numeric` 20; s32 → q2 `numeric` 400 |
| 02 | s33, s34 | 001 | s34 → q1 `numeric` 200 |
| 02 | s35 | 002 | q1 `numeric` 44 |
| 02 | s36 | 003 | q1 `numeric` 2000 |
| 02 | s37 | 004 | phase A → q1 `numeric` 15; phase B → q2 `numeric` 300 |
| 02 | s38 | 005 | q1 `performance` (2 inputs: 25, 18) |
| 02 | s39 | 006 | sections א/ב/ג → q1/q2/q3 `choice` |
| 03 | s42, s43 | 001 | s43 → q1 `numeric` 500 |
| 03 | s44 | 002 | q1 `numeric` 120 |
| 03 | s45 | 003 | q1 `numeric` 300 |
| 03 | s46 | 004 | q1 `numeric` 400 |
| 03 | s47 | 005 | section a → q1 `choice` "40%"; b → q2 `numeric` 75; c → q3 `choice` "כן" (was true-false) |
| 03 | s50, s51, s52 | 006 | s51 → q1 `numeric` 24; s52 → q2 `choice` "208.3 סמ\"ר" |
| 03 | s53, s54 | 007 | s53 → q1 `numeric` 50; s54 → q2 `choice` "1:4" |
| 04 | s55, s56, s57 | 001 | — (project task, s57 survey ungraded; the component completes on s57 continue) |
| 05 | s58, s59, s60, s61 | 001 | s59 → q1 `numeric` 25000; s60 → q2 `numeric` 4800; s61 → q3 `performance` (input 6000 + select "אותו סכום") |
| 05 | s62, s63 | 002 | q1 `numeric` 250; q2 `numeric` 210 |
| 05 | s64, s65 | 003 | s64 → q1 `fill-in` (accepts 9:11 / 9 : 11 / 9/11); s65 → q2 `numeric` 200 |
| 06 | s66–s71 | 001 | s68 → q1 `numeric` 300; s69 → q2 24; s70 → q3 84; s71 → q4 `performance` (30, 330, 324, select "לא מעולה") |
| 07 | s72–s76 | 001 | s74 → q1 `choice` "טועה"; s75 → q2 `numeric` 400; s76 → q3 `choice` multi (3 of 5) |

## To confirm while wiring

- s7, s38, s61, s71: the performance responses are emitted in the metadata's step order, not DOM order. Check each step's
  input id when the hooks are written.
- s61 / s71 selects: the reported value must be the metadata string ("אותו סכום", "לא מעולה"), not the option `value`.
- 01/s2: the UI never grades this screen. `answered` still reports success against the catalogue answer (decision
  recorded here; MOE's v2.7 requires `answered` for every catalogued question).
- 05-003/q1 `fill-in`: success uses the code's check. The response is the learner text with `[,]` / `[.]` blanked.
