#!/usr/bin/env python3
"""Re-encode the unit's MP4 clips to 2 x the box they play in, at most 500 kbps, without audio, under a
NEW name (`<stem>-opt.mp4`) with every reference rewritten (BOOT-AND-RESUME-HARDENING-2026-11-03.md §2.5).

Every <video> in this unit is `autoplay muted loop playsinline`, so the audio track is dead weight.
Boxes come from docs-and-tools/media-display-boxes.json (measured, keyed by path from the repo root).
A clip with no box keeps its size and is only re-encoded. Never upscales; dimensions rounded to even.

    python -I docs-and-tools/reencode-video.py --dry-run
    python -I docs-and-tools/reencode-video.py --apply

Encoder: libx264 high, preset slow, CRF 23, maxrate 500k / bufsize 1000k, yuv420p, -an, +faststart,
frame rate kept. A result larger than its input is discarded. Rows -> docs-and-tools/reencode-video-rows.md.
"""
import json, re, subprocess, sys, tempfile, shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BOXES = {k: v for k, v in json.loads((ROOT / 'docs-and-tools' / 'media-display-boxes.json').read_text('utf-8')).items()
         if not k.startswith('_')}
ROWS_OUT = ROOT / 'docs-and-tools' / 'reencode-video-rows.md'


def clips():
    return sorted(ROOT.glob('unit-assets/video/*.mp4')) + sorted(ROOT.glob('*-0[1-9]/assets/images/*.mp4'))


def ref_files():
    return sorted(ROOT.glob('*-0[1-9]/index.html')) + sorted(ROOT.glob('*-0[1-9]/styles.css')) + \
           sorted(ROOT.glob('unit-js/*.js')) + sorted(ROOT.glob('unit-css/*.css'))


def rel(p):
    return p.relative_to(ROOT).as_posix()


def probe(f):
    out = subprocess.run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=width,height',
                          '-of', 'csv=p=0', str(f)], capture_output=True, text=True, check=True).stdout.strip()
    w, h = (int(x) for x in out.split(',')[:2])
    return w, h


def rewrite_refs(old_name, new_name):
    pat = re.compile(r'(?<=[/"\'(])' + re.escape(old_name) + r'(?=["\'?)])')
    touched = []
    for f in ref_files():
        s = f.read_text('utf-8')
        n, cnt = pat.subn(new_name, s)
        if cnt:
            f.write_text(n, 'utf-8', newline='')
            touched.append(f'{rel(f)}:{cnt}')
    return touched


def main(apply):
    rows, before_all, after_all = [], 0, 0
    for f in clips():
        if f.stem.endswith('-opt'):
            continue
        before = f.stat().st_size
        w, h = probe(f)
        boxes = BOXES.get(rel(f))
        if boxes:
            s = min(1.0, 2.0 * max(max(bw / w, bh / h) for bw, bh in boxes))
            box = max(boxes, key=lambda b: b[0] * b[1])
        else:
            s, box = 1.0, None
        nw, nh = max(2, round(w * s / 2) * 2), max(2, round(h * s / 2) * 2)
        tmp = Path(tempfile.mkdtemp())
        new_name = f.stem + '-opt.mp4'
        out = tmp / new_name
        cmd = ['ffmpeg', '-v', 'error', '-y', '-i', str(f), '-vf', f'scale={nw}:{nh}:flags=lanczos',
               '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '23', '-maxrate', '500k',
               '-bufsize', '1000k', '-pix_fmt', 'yuv420p', '-an', '-movflags', '+faststart', str(out)]
        subprocess.run(cmd, check=True)
        after = out.stat().st_size
        if after >= before:
            verdict, eff, final = 'kept (no gain)', before, f.name
        else:
            verdict, eff, final = 'written', after, new_name
            if apply:
                shutil.copyfile(out, f.with_name(new_name))
                touched = rewrite_refs(f.name, new_name)
                subprocess.run(['git', 'rm', '-q', rel(f)], cwd=ROOT, check=True)
                verdict += ' -> refs: ' + (', '.join(touched) or 'NONE (orphan?)')
        shutil.rmtree(tmp, ignore_errors=True)
        before_all += before; after_all += eff
        boxtxt = f'{box[0]}x{box[1]}' if box else 'none: native kept'
        rows.append(f'| `{rel(f)}` | `{final}` | {before:,} | {eff:,} | {w}x{h} | {nw}x{nh} | {boxtxt} | {verdict} |')
        print(f'{rel(f):60} {before:>10,} -> {eff:>10,}  {w}x{h}->{nw}x{nh}  {verdict}')
    hdr = '| file | new name | bytes before | bytes after | px before | px after | box | verdict |\n|---|---|---|---|---|---|---|---|\n'
    ROWS_OUT.write_text(hdr + '\n'.join(rows) + '\n', 'utf-8')
    print(f'\n{len(rows)} clips, {before_all:,} -> {after_all:,} bytes{" (dry run)" if not apply else ""}')


if __name__ == '__main__':
    if '--apply' not in sys.argv and '--dry-run' not in sys.argv:
        sys.exit(__doc__)
    main('--apply' in sys.argv)
