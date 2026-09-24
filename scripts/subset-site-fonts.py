#!/usr/bin/env python3
"""Rebuild public/fonts/*.woff2 subsets from full sources in /tmp/lab-fonts.

Text sources are shared with scripts/check-font-glyphs.py (scripts/font_text_sources.py).
Run the checker afterwards: python3 scripts/check-font-glyphs.py
"""
from __future__ import annotations

import subprocess
import sys
from pathlib import Path

from font_text_sources import ROOT, collect_files, is_visible_non_ascii, visible_text

SRC_ROOT = Path('/tmp/lab-fonts')
OUT = ROOT / 'public' / 'fonts'

FORCE_CJK = '思源黑體源雲明體霞鶩文楷月版丹版'


def collect_text() -> str:
    return '\n'.join(visible_text(f) for f in collect_files())


def build_subset_text(raw: str) -> str:
    ascii_ = ''.join(chr(i) for i in range(0x20, 0x7F))
    latin1 = ''.join(chr(i) for i in range(0xA0, 0x100))
    greek = 'αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
    extra = '—–…·•°±×÷≤≥≠≈∞√∫∑∏∂∇πμσθλ→←↔⇒⇐⇔∈∉⊂⊃∪∩′″²³⁴₀₁₂₃₄'
    # Every visible non-ASCII character found in the sources (CJK and symbols alike);
    # pyftsubset silently skips code points a source font does not have.
    found = {ch for ch in raw + FORCE_CJK if is_visible_non_ascii(ch)}
    return ascii_ + latin1 + greek + extra + ''.join(sorted(found))


def subset(src: Path, dst: Path, text_file: Path) -> None:
    dst.parent.mkdir(parents=True, exist_ok=True)
    cmd = [
        'pyftsubset', str(src), f'--text-file={text_file}',
        '--layout-features=*', '--glyph-names', '--symbol-cmap', '--legacy-cmap',
        '--notdef-glyph', '--notdef-outline', '--recommended-glyphs',
        '--name-IDs=*', '--name-legacy', '--name-languages=*',
        '--flavor=woff2', f'--output-file={dst}',
    ]
    print('+', ' '.join(cmd))
    subprocess.check_call(cmd)


def main() -> int:
    if not SRC_ROOT.exists():
        print('Missing', SRC_ROOT, file=sys.stderr)
        return 1
    text_file = SRC_ROOT / 'subset-chars.txt'
    text_file.write_text(build_subset_text(collect_text()), encoding='utf-8')
    jobs = [
        (SRC_ROOT / 'noto-sans-tc/SourceHanSansTC-Regular.otf', OUT / 'noto-sans-tc/NotoSansTC-Regular.woff2'),
        (SRC_ROOT / 'noto-sans-tc/SourceHanSansTC-Medium.otf', OUT / 'noto-sans-tc/NotoSansTC-Medium.woff2'),
        (SRC_ROOT / 'noto-sans-tc/SourceHanSansTC-Bold.otf', OUT / 'noto-sans-tc/NotoSansTC-Bold.woff2'),
        (SRC_ROOT / 'genwan/GenWanMin2TW-R.otf', OUT / 'genwanmin-tw/GenWanMin2TW-R.woff2'),
        (SRC_ROOT / 'genwan/GenWanMin2TW-M.otf', OUT / 'genwanmin-tw/GenWanMin2TW-M.woff2'),
        (SRC_ROOT / 'LXGWWenKaiTC-Regular.ttf', OUT / 'lxgw-wenkai-tc/LXGWWenKaiTC-Regular.woff2'),
        (SRC_ROOT / 'LXGWWenKaiTC-Medium.ttf', OUT / 'lxgw-wenkai-tc/LXGWWenKaiTC-Medium.woff2'),
    ]
    for src, dst in jobs:
        if not src.exists():
            print('missing source', src, file=sys.stderr)
            return 1
        subset(src, dst, text_file)
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
