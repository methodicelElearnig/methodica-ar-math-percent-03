// parked from methodica-math-percent-03-06/script.js
// CHAR_ENTRY_REGISTRY entry:
  s66a: {
    dataScreen: 59.1, sectionId: 's66a',
    elementType: 'video', elementId: 's66a-char-img',
    poseKey: 'trash',   positionClass: 's30-char-img',
    bubble: false, bubbleText: null
  },
// CHAR_SIZE_REGISTRY:
  s66a: { char1: 372, char2: 400 },
// CHAR_POS_REGISTRY:
  s66a: { char1: { right: 460, bottom: 74 }, char2: { right: 460, bottom: 74 } },
// backMap entries:
  59.2: 59.1, // s66b → s66a (n-1 doesn't exist for this new decimal pair)
  60:   59.2  // s66  → s66b (n-1 = 59 is a screen in a different split)
// goTo() init hook:
  if (n === 59.1) { transInit('s66a-char-img'); } // s66a enrichment intro (slide 82)

// s66b — the plastic-island comic iframe posts PLASTIC_COMIC_DONE once the
// learner has viewed all 8 panels; only then does המשך unlock.
window.addEventListener('message', function(e) {
  if (!e.data || e.data.type !== 'PLASTIC_COMIC_DONE') return;
  var btn = document.getElementById('s66b-continue');
  if (btn) btn.disabled = false;
});
