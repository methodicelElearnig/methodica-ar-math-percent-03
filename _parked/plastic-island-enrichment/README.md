# Parked: plastic-island enrichment item (s66a / s66b)

Removed from `methodica-math-percent-03-06` on 2026-10-12 per producer decision
("raises more questions than value"). Kept here in case it comes back.

Original placement: start of 03-06, before the peak-question intro (s66),
script slides 82–83, data-screen 59.1 (s66a intro) and 59.2 (s66b comic).

Files:
- `screens.html` — both `<section>`s, inserted right before `#s66` in index.html
- `styles.css` — s66a char2 layering selector + s66b iframe embed styles
- `script-snippets.js` — CHAR registry/size/position entries, backMap entries,
  goTo() init hook, PLASTIC_COMIC_DONE listener (unlocks s66b's המשך)
- `plastic-island-comic.html` — the comic iframe (was `03-06/assets/images/`)

To restore: put the snippets back, set SPLIT_FIRST = 59.1 / TOTAL_SCREENS = 8,
move `active` from #s66 to #s66a, switch the load-time bootstrap
transInit back to 's66a-char-img', and re-add 59.1/59.2 to SCREENS in
03-06/index_dev.html and the 03-06 entry in dev-nav.html (plus
SCREEN_NAME_OVERRIDES in both).
