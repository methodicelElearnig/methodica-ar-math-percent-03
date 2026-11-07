#!/usr/bin/env python3
"""
extract_translations.py — יעד 4.3 (methodica-math-percent-03): translation export (he → ar).

Reads every learner-facing Hebrew string in the build and writes, into translation/:
  methodica-math-percent-03-he-ar.xlf    XLIFF 1.2, one <trans-unit> per string, empty <target>
  methodica-math-percent-03-he-ar.xlsx   the same units as a spreadsheet for the translator
  translation-screen-manifest.csv        one row per screen
  translation-excluded-js.csv            JS strings left out as dead code (they belong to another part's screens)

Read-only against the build. Run from the repo root:
    python3 translation/tools/extract_translations.py

Where the text lives in this unit
  Seven parts (methodica-math-percent-03-01 … -07), each a standalone page: index.html holds the
  static screens (<section class="screen" id="sNN">) and the part-wide chrome (page title, report
  dialog, hint/zoom dialogs); script.js holds feedback, hints, button relabels and generated
  content. script.js began as one file for the whole unit and was split per part, so every part's
  copy still carries code (and Hebrew) for screens that live in other parts. That code never runs.

What counts as a unit
  HTML  Each run of Hebrew text with inline markup only (b, br, span…) is one unit, tags kept;
        each Hebrew attribute (aria-label, alt, placeholder, title…) is a unit. Comments,
        <script> and <style> are skipped. The pie-chart widgets loaded in iframes are included.
  JS    Every string literal (', ", `) holding Hebrew, comments skipped. Literals holding block
        markup (div, p…) are split like HTML. Concatenated pieces stay separate units; the note
        says so.

Screen attribution for JS
  Each literal goes to the screen named by the nearest screen token (s34, s7Table…, 's31-fb',
  '#s47-x') before it in the same top-level block of code (comments ignored), else the nearest
  after it. Tokens resolve through the section ids and the element ids inside each section. A
  literal whose screen is in another part is dead code here and is written to
  translation-excluded-js.csv instead of the export; one with no screen token is part-wide (99).

IDs are 03-PP-SS-NNN: unit 03, part (01–07), screen (position of the section in the part's
index.html, 00-based; 99 = text not tied to one screen), running number.
"""
import bisect
import csv
import re
import sys
from collections import Counter
from pathlib import Path
from xml.sax.saxutils import escape

from bs4 import BeautifulSoup, Comment, NavigableString, Tag

ROOT = Path(__file__).resolve().parents[2]
OUT = ROOT / "translation"
SLUG = "methodica-math-percent-03"
TARGET = "03"
PARTS = ["01", "02", "03", "04", "05", "06", "07"]

HEB = re.compile(r"[֐-׿]")
WS = re.compile(r"\s+")
MARKUP = re.compile(r"<[a-zA-Z/!]")
INLINE = {"span", "b", "strong", "em", "i", "u", "sup", "sub", "br", "wbr", "small", "a",
          "bdi", "bdo", "mark", "s", "q", "abbr", "code", "kbd"}
SKIP_TAGS = {"script", "style", "noscript"}
SKIP_ATTRS = {"class", "id", "style", "src", "href"}
TOKEN = re.compile(r"(?<![\w$])(s\d{1,2}[a-z]?)(?![a-z\d])")
# screens whose code is still in script.js but whose <section> exists in no part (removed or
# never-built placeholders, e.g. s6a "PlaylistLearningScreen (future-ready placeholder)").
# The extractor stops with a message if script.js names an unknown screen not listed here.
REMOVED = {"s5", "s6a", "s40", "s48", "s49", "s77", "s78"}

ROLE_BY_TAG = {
    "h1": "heading", "h2": "heading", "h3": "subheading", "h4": "subheading", "p": "paragraph",
    "li": "list-item", "button": "button-label", "label": "label", "option": "option",
    "title": "page-title", "th": "table-header", "td": "table-cell", "figcaption": "caption",
    "legend": "label", "text": "svg-text", "tspan": "svg-text",
}
ROLE_BY_ATTR = {"alt": "image-alt", "aria-label": "aria-label", "title": "tooltip",
                "placeholder": "placeholder", "data-tip": "tooltip-text",
                "aria-roledescription": "aria-roledescription"}


def norm(s):
    return WS.sub(" ", s).strip()


def has_heb(s):
    return bool(s) and bool(HEB.search(s))


def inline_only(el):
    return all(d.name in INLINE for d in el.descendants if isinstance(d, Tag))


def selector(el):
    s = el.name
    if el.get("id"):
        s += "#" + el["id"]
    cls = el.get("class") or []
    if cls:
        s += "." + ".".join(cls[:2])
    return s


def heb_attrs_inside(el):
    return any(has_heb(" ".join(v) if isinstance(v, list) else v)
               for d in [el] + el.find_all(True) for k, v in d.attrs.items() if k not in SKIP_ATTRS)


class Unit:
    def __init__(self, part, screen, source, role, loc, element="", context=""):
        self.part, self.screen, self.source = part, screen, source
        self.role, self.loc, self.element, self.context = role, loc, element, context
        self.notes = []
        self.id = ""


# ── markup splitting (HTML pages and markup-bearing JS literals) ──────────────────────────────
def markup_pieces(root, top=True):
    """Yield (source, role, element, note, line) for every Hebrew text run / attribute under root."""
    out = []

    def line(el):
        return getattr(el, "sourceline", None) or 0

    def emit_attrs(el):
        for k, v in el.attrs.items():
            if k in SKIP_ATTRS or k.startswith("on"):
                continue
            v = " ".join(v) if isinstance(v, list) else v
            if has_heb(v):
                out.append((norm(v), ROLE_BY_ATTR.get(k, "attribute:" + k), selector(el) + f"[{k}]", "",
                            line(el)))

    def visit(el, top=False):
        if not top:
            emit_attrs(el)
        if not has_heb(el.get_text()):
            for d in el.find_all(True):
                emit_attrs(d)
            return
        if not top and el.name not in ("html", "body", "head") and inline_only(el):
            note = "attr" if any(heb_attrs_inside(c) for c in el.find_all(True)) else ""
            out.append((norm(el.decode_contents()), ROLE_BY_TAG.get(el.name, "text"), selector(el), note,
                        line(el)))
            return
        for ch in el.children:
            if isinstance(ch, Tag):
                visit(ch)
            elif isinstance(ch, NavigableString) and has_heb(str(ch)):
                out.append((norm(str(ch)), "text", ("" if top else selector(el) + " (loose text)"), "",
                            line(el)))

    visit(root, top=top)
    return out


def clean_soup(text):
    soup = BeautifulSoup(text, "html.parser")
    for c in soup.find_all(string=lambda s: isinstance(s, Comment)):
        c.extract()
    for t in soup.find_all(SKIP_TAGS):
        t.decompose()
    return soup


ATTR = re.compile(r'([\w:-]+)="([^"]*)"')
LEAD = re.compile(r"^([^<]*?)>")
TRAIL = re.compile(r"<[^>]*$")
VOID = {"br", "wbr", "img", "input", "hr", "source"}


def fragment_pieces(text):
    """A JS literal cut mid-tag ('-back">חזרה</button>', '<nav aria-label="…" data-x="'):
    take the Hebrew attributes from the partial tags at either end, split the rest normally."""
    out, body = [], text
    m = LEAD.match(body)
    if m and ('"' in m.group(1) or not m.group(1).strip()):
        head = m.group(1)
        for k, v in ATTR.findall(head):
            if has_heb(v):
                out.append((norm(v), ROLE_BY_ATTR.get(k, "attribute:" + k), f"(partial tag)[{k}]", "", 0))
        rest = ATTR.sub("", head)
        if has_heb(rest):
            out.append((norm(rest.strip().strip('"')), "attribute-fragment", "(partial tag)", "", 0))
        body = body[m.end():]
    m = TRAIL.search(body)
    if m:
        for k, v in ATTR.findall(m.group(0)):
            if has_heb(v):
                out.append((norm(v), ROLE_BY_ATTR.get(k, "attribute:" + k), f"(partial tag)[{k}]", "", 0))
        body = body[:m.start()]
    if not MARKUP.search(body):
        for k, v in ATTR.findall(body):
            if has_heb(v):
                out.append((norm(v), ROLE_BY_ATTR.get(k, "attribute:" + k), f"(attribute)[{k}]", "", 0))
        body = ATTR.sub("", body)
        if has_heb(body):
            out.append((norm(body), "text", "", "", 0))
        return out
    return out + markup_pieces(clean_soup(body))


def is_fragment(text):
    t = text.strip()
    lead = LEAD.match(t)
    opened = [n for n in re.findall(r"<([a-zA-Z][\w-]*)", t) if n.lower() not in VOID]
    closed = re.findall(r"</([a-zA-Z][\w-]*)", t)
    return bool((lead and ('"' in lead.group(1) or not lead.group(1).strip())) or TRAIL.search(t)
                or (not MARKUP.search(t) and ATTR.search(t)) or len(opened) != len(closed))


# ── JS lexing ─────────────────────────────────────────────────────────────────────────────────
REGEX_PRE = set("(,=:[!&|?{};+-*%<>~^")
KEY_BEFORE = re.compile(r"([A-Za-z_$][\w$-]*)'?\s*:\s*\[?\s*$")
COMPARE = re.compile(r"(?:[!=]==?)\s*$")
COMPARE_AFTER = re.compile(r"^\s*[!=]==?")
CSS_CTX = re.compile(r"""(\.|class(?:Name)?\s*\+?=\s*\\?['"][^'"]*|classList\.\w+\(\s*['"][^'"]*|class=\\?"[^"]*)$""")


def js_scan(src):
    """Yield ('str', start, end, text) for string literals and ('cmt', start, end, '') for comments."""
    i, n, prev = 0, len(src), ""
    while i < n:
        c = src[i]
        if c == "/" and i + 1 < n and src[i + 1] == "/":
            j = src.find("\n", i)
            j = n if j < 0 else j
            yield "cmt", i, j, ""
            i = j
            continue
        if c == "/" and i + 1 < n and src[i + 1] == "*":
            j = src.find("*/", i + 2)
            j = n if j < 0 else j + 2
            yield "cmt", i, j, ""
            i = j
            continue
        if c == "/" and (prev in REGEX_PRE or prev == ""):
            j, in_cls = i + 1, False
            while j < n and src[j] != "\n":
                if src[j] == "\\":
                    j += 2
                    continue
                if src[j] == "[":
                    in_cls = True
                elif src[j] == "]":
                    in_cls = False
                elif src[j] == "/" and not in_cls:
                    break
                j += 1
            i, prev = j + 1, "x"
            continue
        if c in "'\"`":
            j, buf = i + 1, []
            while j < n and src[j] != c:
                if src[j] == "\\" and j + 1 < n:
                    buf.append(src[j:j + 2])
                    j += 2
                    continue
                if c == "`" and src[j] == "$" and j + 1 < n and src[j + 1] == "{":
                    depth, k = 1, j + 2
                    while k < n and depth:
                        depth += {"{": 1, "}": -1}.get(src[k], 0)
                        k += 1
                    buf.append(src[j:k])
                    j = k
                    continue
                buf.append(src[j])
                j += 1
            yield "str", i, j + 1, "".join(buf)
            i, prev = j + 1, "x"
            continue
        if not c.isspace():
            prev = c
        i += 1


def unescape_js(s):
    s = s.replace("\\n", "\n").replace("\\'", "'").replace('\\"', '"').replace("\\`", "`")
    s = re.sub(r"\\u([0-9A-Fa-f]{4})", lambda m: chr(int(m.group(1), 16)), s)
    return s.replace("\\\\", "\\")


def js_units(src, rel, part, resolve=None, line_offset=0):
    """resolve(token) -> ('here', screen_idx) | ('other', 'PP/sNN') | None.
    Returns (units, excluded) where excluded are literals whose screen lives in another part."""
    lines = src.split("\n")
    line_start = [0]
    for ln in lines:
        line_start.append(line_start[-1] + len(ln) + 1)

    scan = list(js_scan(src))
    masked = list(src)
    for kind, a, b, _ in scan:
        if kind == "cmt":
            masked[a:b] = [" "] * (b - a)
    masked = "".join(masked)
    mlines = masked.split("\n")

    # top-level block id per line: a new block starts at a line that begins in column 0 with an
    # identifier (var/function/if/window…). Unindented string continuations ('<p>…' +) do not.
    block, b = [], 0
    for ln in mlines:
        if ln and (ln[0].isalpha() or ln[0] in "_$"):
            b += 1
        block.append(b)
    # resolvable screen tokens: (position, resolution), in order. A token used as a CSS class
    # ('.s31-answer-box', className = 's38-feedback s5-fb--correct', class="s30-body") is template
    # reuse — generic engine code styles every screen with the first screen's classes — so it never
    # ties code to a screen. Only ids, function/variable names and object keys do.
    anchors = []
    if resolve:
        for m in TOKEN.finditer(masked):
            ls = masked.rfind("\n", 0, m.start()) + 1
            if CSS_CTX.search(masked[ls:m.start()]):
                continue
            r = resolve(m.group(1))
            if r:
                anchors.append((m.start(), r))
    apos = [a for a, _ in anchors]
    ablock = [block[bisect.bisect_right(line_start, a) - 1] for a in apos]

    def screen_for(pos, lno):
        """Nearest anchor in the same top-level block: before the literal, else after it."""
        blk = block[lno]
        k = bisect.bisect_right(apos, pos) - 1
        if k >= 0 and ablock[k] == blk:
            return anchors[k][1]
        k += 1
        if k < len(anchors) and ablock[k] == blk:
            return anchors[k][1]
        return None

    units, excluded = [], []
    for kind, start, end, raw in scan:
        if kind != "str" or not has_heb(raw):
            continue
        lno = bisect.bisect_right(line_start, start) - 1
        before = src[line_start[lno]:start]
        nl = src.find("\n", end)
        after = src[end:nl if nl >= 0 else len(src)]
        km = KEY_BEFORE.search(before)
        key = km.group(1) if km else ""
        concat = before.rstrip().endswith("+") or after.lstrip().startswith("+")
        if not concat:
            prev_line = mlines[lno - 1].rstrip() if lno else ""
            concat = prev_line.endswith("+") and before.strip() == ""
        compare = bool(COMPARE.search(before) or COMPARE_AFTER.match(after))
        ctx = norm(lines[lno])[:160]
        res = screen_for(start, lno)
        text = unescape_js(raw)
        loc = f"{rel}:{lno + 1 + line_offset}"

        pieces = []
        if is_fragment(text):
            pieces = [(s, r, e, n, True) for s, r, e, n, _ in fragment_pieces(text)]
        elif MARKUP.search(text) and not inline_only(BeautifulSoup(text, "html.parser")):
            pieces = [(s, r, e, n, True) for s, r, e, n, _ in markup_pieces(clean_soup(text))]
        else:
            soup = BeautifulSoup(text, "html.parser")
            note = "attr" if heb_attrs_inside(soup) and soup.find(True) else ""
            body = norm(text) if "\n" not in text else text.strip()
            pieces = [(body, "js:" + key if key else "js-string", "", note, False)]

        for s, role, el, note, split in pieces:
            u = Unit(part, None, s, role, loc, el, ctx)
            if note:
                u.notes.append("attr")
            if concat:
                u.notes.append("concat")
            if split:
                u.notes.append("split")
            if "${" in s:
                u.notes.append("placeholder")
            if compare:
                u.notes.append("compare")
            if res and res[0] == "other":
                u.screen = res[1]
                excluded.append(u)
            else:
                u.screen = res[1] if res else 99
                units.append(u)
    return units, excluded


# ── HTML ──────────────────────────────────────────────────────────────────────────────────────
TEMPLATES = ["TwoOptionSelection", "SingleChoiceQuestion", "TrueFalseQuestion", "MultipleChoiceQuestion",
             "FlipCardsReveal", "DragAndDropQuestion", "ValueInputQuestion", "DropdownQuestion", "MemoryGame",
             "HookOpenQuestion", "ImageHotspotQuestion", "AccordionText", "Flowchart", "TransitionScreen",
             "FullImageWithTextOverlay", "GuidedMathPracticeScreen", "GuidedPracticeScreen",
             "CarouselLearningScreen"]


def section_meta(raw, sid):
    """(pptx slides, template) from the header comment right before <section … id="sid">."""
    m = re.search(r'<section\b[^>]*\bid="%s"' % re.escape(sid), raw)
    if not m:
        return "", ""
    c = raw.rfind("<!--", 0, m.start())
    head = raw[c:m.start()] if c >= 0 else ""
    sm = re.search(r"PPTX\s+slides?\s+(\d+(?:\s*[–-]\s*\d+)?)", head)
    tm = next((t for t in TEMPLATES if t in head), "")
    return (sm.group(1).replace(" ", "") if sm else ""), tm


def id_token(i):
    m = re.match(r"(s\d{1,2}[a-z]?)(?![a-z\d])", i or "")
    return m.group(1) if m else None


def screen_of_outside(el, tokmap):
    for d in [el] + el.find_all(True):
        t = id_token(d.get("id"))
        if t in tokmap:
            return tokmap[t]
    return 99


def html_units(soup, rel, part, sections_screen=None, fixed_screen=None, tokmap=None):
    """Units for one parsed HTML page. sections_screen maps id(section) -> screen index;
    fixed_screen puts every unit on one screen (iframe widgets)."""
    units = []

    def add(pieces, screen):
        for src, role, el, note, line in pieces:
            u = Unit(part, screen, src, role, f"{rel}:{line}", el)
            if note:
                u.notes.append("attr")
            units.append(u)

    if fixed_screen is not None:
        add(markup_pieces(soup), fixed_screen)
        return units

    sec_ids = set(sections_screen)

    def walk(el):
        for ch in el.children:
            if isinstance(ch, Tag):
                if id(ch) in sec_ids:
                    add(markup_pieces(ch, top=False), sections_screen[id(ch)])
                elif any(id(s) in sec_ids for s in ch.find_all("section")):
                    pieces_self = []
                    for k, v in ch.attrs.items():
                        if k not in SKIP_ATTRS and has_heb(" ".join(v) if isinstance(v, list) else v):
                            pieces_self.append(k)
                    if pieces_self:
                        raise SystemExit(f"unexpected Hebrew attribute on a section wrapper in {rel}")
                    walk(ch)
                else:
                    add(markup_pieces(ch, top=False), screen_of_outside(ch, tokmap))
            elif isinstance(ch, NavigableString) and has_heb(str(ch)):
                add([(norm(str(ch)), "text", selector(el) + " (loose text)", "", el.sourceline or 0)], 99)

    walk(soup)
    return units


# ── main ──────────────────────────────────────────────────────────────────────────────────────
NOTE_HE = {
    "concat": "חלק ממשפט שמחובר בקוד — לתרגם כך שיתחבר נכון עם החלקים הסמוכים",
    "attr": "בתוך הטקסט יש עברית במאפיין (aria-label / title) — לתרגם גם אותה ולהשאיר את התגיות",
    "split": "נלקח מתוך מקטע HTML בקוד",
    "placeholder": "יש ${...} — להשאיר כמו שהוא",
    "compare": "הקוד משווה את הטקסט הזה לתווית של כפתור — התרגום חייב להיות זהה לתרגום התווית בכל מקום",
}
NOTE_EN = {
    "concat": "part of a + concatenation: translate so the joined sentence still reads correctly",
    "attr": "holds Hebrew inside an attribute (aria-label / title): translate it too, keep the tags",
    "split": "taken from a markup fragment inside a JS string",
    "placeholder": "keep ${...} placeholders unchanged",
    "compare": "code compares a label against this exact string: translate it identically everywhere",
}


def main():
    # pass 1: sections and token map for every part
    info = {}
    for p in PARTS:
        d = ROOT / f"{SLUG}-{p}"
        raw = (d / "index.html").read_text(encoding="utf-8")
        soup = clean_soup(raw)
        secs = soup.find_all("section", class_="screen")
        meta = {s["id"]: section_meta(raw, s["id"]) for s in secs}
        tok = {}
        for i, s in enumerate(secs):
            tok.setdefault(s["id"], i)
        for i, s in enumerate(secs):
            for d2 in s.find_all(True):
                t = id_token(d2.get("id"))
                if t:
                    tok.setdefault(t, i)
        info[p] = dict(dir=d, raw=raw, soup=soup, secs=secs, meta=meta, tok=tok)

    owner = {}   # token -> set of parts that own it
    for p in PARTS:
        for t in info[p]["tok"]:
            owner.setdefault(t, set()).add(p)

    units, excluded, screens, unknown = [], [], [], set()
    for p in PARTS:
        I = info[p]
        d, secs, tok = I["dir"], I["secs"], I["tok"]

        def resolve(t, p=p, tok=tok):
            if t in tok:
                return ("here", tok[t])
            if t in owner:
                return ("other", f"{'/'.join(sorted(owner[t]))}:{t}")
            if t in REMOVED:
                return ("other", f"removed:{t}")
            unknown.add(t)
            return None

        sections_screen = {id(s): i for i, s in enumerate(secs)}
        part_units = html_units(I["soup"], f"{d.name}/index.html", p, sections_screen, tokmap=tok)
        # iframe widgets
        for i, s in enumerate(secs):
            for fr in s.find_all("iframe"):
                src = fr.get("src", "")
                if src.endswith(".html") and (d / src).exists():
                    wtext = (d / src).read_text(encoding="utf-8")
                    part_units += html_units(clean_soup(wtext), f"{d.name}/{src}", p, fixed_screen=i)
                    for m in re.finditer(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", wtext, re.S):
                        off = wtext.count("\n", 0, m.start(1))
                        ju, _ = js_units(m.group(1), f"{d.name}/{src}", p, line_offset=off)
                        for u in ju:
                            u.screen = i
                        part_units += ju
        ju, ex = js_units((d / "script.js").read_text(encoding="utf-8"), f"{d.name}/script.js", p, resolve)
        part_units += ju
        excluded += ex
        units += part_units

        for i, s in enumerate(secs):
            h = s.find(["h1", "h2", "h3"]) or s.find("p")
            title = norm(h.get_text(" "))[:70] if h else ""
            slides, ttype = I["meta"].get(s["id"], ("", ""))
            screens.append((p, i, s["id"], ttype, title, slides, f"{d.name}/index.html"))
    if unknown:
        raise SystemExit(f"script.js names screens found in no part and not in REMOVED: {sorted(unknown)}")

    # stable order: part, screen, file, line; number per screen
    files = {k: i for i, k in enumerate(dict.fromkeys(u.loc.rsplit(":", 1)[0] for u in units))}
    units.sort(key=lambda u: (u.part, u.screen, files[u.loc.rsplit(":", 1)[0]], int(u.loc.rsplit(":", 1)[1] or 0)))
    seq = {}
    for u in units:
        k = (u.part, u.screen)
        seq[k] = seq.get(k, 0) + 1
        u.id = f"{TARGET}-{u.part}-{u.screen:02d}-{seq[k]:03d}"

    sinfo = {(p, n): (sid, t, title, slides) for p, n, sid, t, title, slides, _ in screens}

    def sget(u, i, default=""):
        if u.screen == 99:
            return {0: "chrome", 1: "chrome", 2: "Part-wide chrome / strings not tied to one screen", 3: ""}[i]
        return sinfo.get((u.part, u.screen), ("", "", "", ""))[i] or default

    repeats = Counter(u.source for u in units)

    OUT.mkdir(exist_ok=True)
    # XLIFF
    xl = ['<?xml version="1.0" encoding="UTF-8"?>',
          '<xliff version="1.2" xmlns="urn:oasis:names:tc:xliff:document:1.2">',
          f'  <file original="{SLUG}" source-language="he" target-language="ar" datatype="html" '
          'tool-id="claude-code-translation-export">',
          "    <header>",
          "      <note>יעד 4.3 — methodica-math-percent-03 (percent: finding the whole), 720-series Hebrew "
          "e-learning module, parts 01-07. Sources holding HTML tags keep them: translate the text, keep "
          "the tags. No production files were modified to produce this export.</note>",
          "    </header>", "    <body>"]
    for u in units:
        xl.append(f'      <trans-unit id="{u.id}">')
        xl.append(f"        <source>{escape(u.source)}</source>")
        xl.append("        <target></target>")
        xl.append(f'        <note from="screen-id">{TARGET}-{u.part}-{u.screen:02d}</note>')
        xl.append(f'        <note from="screen-key">{escape(sget(u, 0))}</note>')
        if sget(u, 2):
            xl.append(f'        <note from="screen-title">{escape(sget(u, 2))}</note>')
        xl.append(f'        <note from="screen-type">{escape(sget(u, 1, "screen"))}</note>')
        if sget(u, 3):
            xl.append(f'        <note from="pptx-slides">{escape(sget(u, 3))}</note>')
        xl.append(f'        <note from="element-role">{escape(u.role)}</note>')
        if u.element:
            xl.append(f'        <note from="element">{escape(u.element)}</note>')
        if u.context:
            xl.append(f'        <note from="js-context">{escape(u.context)}</note>')
        for n in u.notes:
            xl.append(f'        <note from="translator">{escape(NOTE_EN[n])}</note>')
        xl.append(f'        <note from="source-location">{escape(u.loc)}</note>')
        xl.append("      </trans-unit>")
    xl += ["    </body>", "  </file>", "</xliff>", ""]
    (OUT / f"{SLUG}-he-ar.xlf").write_text("\n".join(xl), encoding="utf-8")

    # manifest
    cnt = Counter((u.part, u.screen) for u in units)
    rows = []
    for p in PARTS:
        rows += [[f"{TARGET}-{p}-{n:02d}", sid, title, t, slides, f, cnt.get((p, n), 0)]
                 for pp, n, sid, t, title, slides, f in screens if pp == p]
        rows.append([f"{TARGET}-{p}-99", "chrome", "Part-wide chrome / strings not tied to one screen", "chrome", "",
                     f"{SLUG}-{p}/index.html + script.js", cnt.get((p, 99), 0)])
    with open(OUT / "translation-screen-manifest.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["screen_id", "screen_key", "screen_title", "screen_type", "pptx_slides", "source_file", "units"])
        w.writerows(rows)

    # excluded dead-code JS (for review)
    live = {(u.part, u.source) for u in units}
    with open(OUT / "translation-excluded-js.csv", "w", newline="", encoding="utf-8") as fh:
        w = csv.writer(fh)
        w.writerow(["part", "belongs_to (part:screen)", "source", "also_in_export_for_this_part", "source_location"])
        for u in excluded:
            w.writerow([u.part, u.screen, u.source, "yes" if (u.part, u.source) in live else "no", u.loc])

    # xlsx
    from openpyxl import Workbook
    from openpyxl.styles import Alignment, Font, PatternFill
    wb = Workbook()
    ws = wb.active
    ws.title = "תרגום"
    ws.sheet_view.rightToLeft = True
    ws.append(["מזהה", "חלק", "מסך", "מסך ב-HTML", "שקפים בתסריט", "תפקיד הטקסט", "טקסט מקור (עברית)",
               "תרגום (ערבית)", "הערות", "מופיע בסה״כ", "מיקום בקוד"])
    for u in units:
        ws.append([u.id, u.part, f"{u.screen:02d}", sget(u, 0), sget(u, 3), u.role, u.source, "",
                   "; ".join(NOTE_HE[n] for n in u.notes), repeats[u.source], u.loc])
    for i, wdt in enumerate([15, 6, 6, 11, 12, 18, 60, 60, 34, 9, 40]):
        ws.column_dimensions[chr(65 + i)].width = wdt
    for c in ws[1]:
        c.font = Font(bold=True, color="FFFFFF")
        c.fill = PatternFill("solid", fgColor="2F6FA3")
    for row in ws.iter_rows(min_row=2):
        for c in row:
            c.alignment = Alignment(wrap_text=True, vertical="top")
        row[7].fill = PatternFill("solid", fgColor="FFF7D6")
    ws.freeze_panes = "A2"
    ws.auto_filter.ref = f"A1:K{len(units) + 1}"
    ms = wb.create_sheet("מסכים")
    ms.sheet_view.rightToLeft = True
    ms.append(["מזהה מסך", "מסך ב-HTML", "כותרת", "סוג", "שקפים בתסריט", "קובץ", "יחידות"])
    for r in rows:
        ms.append(r)
    for i, wdt in enumerate([12, 11, 50, 26, 12, 45, 8]):
        ms.column_dimensions[chr(65 + i)].width = wdt
    wb.save(OUT / f"{SLUG}-he-ar.xlsx")

    by_part = Counter(u.part for u in units)
    ids = [u.id for u in units]
    print(f"units={len(units)} unique_ids={len(set(ids))} distinct_sources={len(repeats)} "
          f"words={sum(len(re.sub(r'<[^>]+>', ' ', u.source).split()) for u in units)}")
    print(f"by_part={dict(sorted(by_part.items()))}")
    print(f"screens={len(screens)} screen99={sum(1 for u in units if u.screen == 99)} "
          f"html_tags={sum(1 for u in units if '<' in u.source)} "
          f"js={sum(1 for u in units if '.js:' in u.loc)} html={sum(1 for u in units if '.html:' in u.loc)}")
    print(f"excluded_dead_js={len(excluded)} not_covered_elsewhere="
          f"{sum(1 for u in excluded if (u.part, u.source) not in live)}")
    for n in NOTE_EN:
        print(f"  note {n}: {sum(1 for u in units if n in u.notes)}")


if __name__ == "__main__":
    sys.exit(main())
