# Media optimization (2026-11-03)

Done before reporting pins any path (guide §15). Rules from `Documentation/reporting-and-resume/BOOT-AND-RESUME-HARDENING-2026-11-03.md`
§2.4–2.5 and §6 rule 4–5.

## Result

| | Before | After |
|---|---|---|
| Media in the repo | 298.7 MB (313 files across 7 parts) | **22.4 MB** |
| Bytes fetched at page load, part 01 / 02 / 03 / 04 / 05 / 06 / 07 (cache off, 1280×710, local) | 11.5 / 18.3 / 36.0 / 1.4 / 9.9 / 1.7 / 10.0 MB | **0.77 / 0.69 / 0.72 / 0.65 / 0.69 / 0.80 / 0.73 MB** |
| Media in those bytes | up to 35.4 MB (part 03) | 123–297 KB |

What is left at load is mostly code: the shared `main.js` and the part's `styles.css`.

## Steps

1. **Dedupe** (`fdd7e71`). The character poses and clips, plus any file used by two or more parts with identical bytes,
   were moved once into `unit-assets/img|video/`. Each part keeps only what its own markup or screens reference: s39's
   `standard_6*` stays in 02, using the owner part's variant. 249 copies were removed (200.8 MB).
2. **Unused media.** The dedupe deleted 19 unreferenced files (s5/s6a playlist art, `see_1*`, the phone-scroll and popcorn
   clips). This step adds:
   - `Step-by-step_1/2.png` (5.3 MB), referenced only by commented-out markup, which was removed too;
   - five dead character poses (`popcoren`, `think`, `victory`, `thumbsUp`, `trash`). After the s5/s6a removal no
     screen's `poseKey` names them, so they and seven files are gone.
3. **Images** (`reencode-media.py`, rows in `reencode-rows.md`): 27 files, 86.0 → 20.5 MB.
   - Type is preserved. Each file is resized to 2× its largest drawn box.
   - PNGs are quantized with libimagequant (quality 70–95) and oxipng. `standard_3`, `basic_4` and `standard2_2` were
     refused by the banding guard and stay 24-bit, resized only.
   - JPEG q82.
   - Changed files get `-opt` names, with every reference rewritten.
4. **Clips** (`reencode-video.py`, rows in `reencode-video-rows.md` (last run only); totals here): 13 clips,
   13.6 → 2.4 MB.
   - 2× the drawn box, H.264 CRF 23, at most 500 kbps, frame rate kept, `+faststart`.
   - **No audio track**: every `<video>` is `autoplay muted loop`.
5. **Lazy loading.**
   - `loading="lazy"` on every raster `<img>` outside the part's first screen (25 tags). The s0 character cards stay
     eager (58 + 80 KB).
   - Hidden screens are `display:none`, so their images are fetched on entry. The zoom clone of a lazy image loads when
     the zoom opens (checked in headless Chrome).
   - 01/s8's clip and poster were the only static `<video>` sources. They moved to `data-src` / `data-poster`, and
     `mountDeferredMedia()` (called by `goTo`) mounts them on entry. Verified: nothing is fetched before s8, and the
     clip plays on entry.
   - All other clips already got their `src` from the character registry on entry.

## Display boxes

`media-display-boxes.json` was **measured** in the running page, not derived from CSS. `_test/visual-snapshot.mjs` with
`MEASURE=1 INTERACT=1` was run for char1 and for char2: every screen, every answer-walk step, every zoom opened, with
`object-fit` applied.

Four clips never appear in the walk, and their boxes are recorded under `_derived`:
- **The s57 nudge clips** (only on Continue without an answer): measured in the browser at 190×338.
- **`yellow_read`**: measured on part 01 for char1, at most 251×446.
- **`standard_6_b`** (s39 section ב): uses section א's frame.

Scene images are drawn at most 800×450, even when zoomed. The 2816×1536 sources became 1650×900.

## Verification

Compared against the build before this step:
- **State:** identical on all screens and through the 378-step answer walk (text, controls, console).
- **Pixels:** the largest change on any screen is 0.12 % of pixels by more than 40 levels (part 03, scene images).
- **Zoom:** a side-by-side of a zoomed scene (`basic_3`, 6.9 MB → 714 KB) shows no visible difference.
