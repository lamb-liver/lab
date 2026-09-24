#!/usr/bin/env python3
"""Verify user-facing site glyphs exist in every shipped role font (public/fonts/*.woff2).

Text sources are shared with scripts/subset-site-fonts.py (scripts/font_text_sources.py).

- CJK ideographs, CJK punctuation, kana and full-width forms must be covered by every
  shipped weight; any gap fails (exit 1) and prints where the character is used.
- Other non-ASCII symbols (√, π, subscripts, …) are listed as notes: some are not in
  the source fonts at all and fall back to system fonts. Pass --strict to fail on them.
"""
from __future__ import annotations

import sys
import unicodedata
from collections import Counter
from pathlib import Path

from fontTools.ttLib import TTFont

from font_text_sources import CJK_RE, ROOT, collect_files, is_visible_non_ascii, visible_text

FONTS_DIR = ROOT / 'public/fonts'
ROLE_FONTS = {
    'Noto Sans TC (UI)': ['noto-sans-tc/NotoSansTC-Regular.woff2', 'noto-sans-tc/NotoSansTC-Medium.woff2',
                          'noto-sans-tc/NotoSansTC-Bold.woff2'],
    'GenWanMin2TW (display)': ['genwanmin-tw/GenWanMin2TW-R.woff2', 'genwanmin-tw/GenWanMin2TW-M.woff2'],
    'LXGWWenKaiTC (concept)': ['lxgw-wenkai-tc/LXGWWenKaiTC-Regular.woff2',
                               'lxgw-wenkai-tc/LXGWWenKaiTC-Medium.woff2'],
}
# Guard against the collector silently matching nothing (e.g. an unexpanded brace glob).
REQUIRED_SUFFIXES = {'.astro', '.ts', '.tsx', '.md'}

Loc = tuple[Path, int, str]


def collect_chars() -> tuple[set[str], dict[str, list[Loc]], list[Path]]:
    files = collect_files()
    locs: dict[str, list[Loc]] = {}
    for f in files:
        for i, line in enumerate(visible_text(f).splitlines(), 1):
            for ch in line:
                if not is_visible_non_ascii(ch):
                    continue
                bucket = locs.setdefault(ch, [])
                if len(bucket) < 2:
                    bucket.append((f, i, line.strip()[:100]))
    return set(locs), locs, files


def cmap_of(path: Path) -> set[int]:
    font = TTFont(str(path))
    best = font.getBestCmap() or {}
    font.close()
    return set(best.keys())


def describe(ch: str, locs: dict[str, list[Loc]]) -> list[str]:
    lines = [f'  {ch} U+{ord(ch):04X} {unicodedata.name(ch, "?")}']
    for f, i, snip in locs.get(ch, []):
        lines.append(f'    {f.relative_to(ROOT)}:{i}: {snip}')
    return lines


def main() -> int:
    strict = '--strict' in sys.argv[1:]
    chars, locs, files = collect_chars()
    by_suffix = Counter(f.suffix for f in files)
    print(f'scanned {len(files)} files: ' + ', '.join(f'{s} {n}' for s, n in sorted(by_suffix.items())))
    missing_suffixes = REQUIRED_SUFFIXES - set(by_suffix)
    if missing_suffixes:
        print(f'FAIL collector found no {sorted(missing_suffixes)} files; source scan is broken')
        return 1
    cjk = sorted(ch for ch in chars if CJK_RE.match(ch))
    symbols = sorted(ch for ch in chars if not CJK_RE.match(ch))
    print(f'unique visible CJK: {len(cjk)}; other non-ASCII: {len(symbols)}')

    exit_code = 0
    for role, rels in ROLE_FONTS.items():
        for rel in rels:
            path = FONTS_DIR / rel
            print(f'\n=== {role} @ {path.relative_to(ROOT)} ===')
            if not path.exists():
                print('FAIL missing font file')
                exit_code = 1
                continue
            covered = cmap_of(path)
            missing_cjk = [ch for ch in cjk if ord(ch) not in covered]
            missing_sym = [ch for ch in symbols if ord(ch) not in covered]
            print(f'CJK missing {len(missing_cjk)} / {len(cjk)}')
            for ch in missing_cjk:
                print('\n'.join(describe(ch, locs)))
            if missing_cjk:
                exit_code = 1
            if missing_sym:
                label = 'FAIL' if strict else 'note (system fallback)'
                print(f'{label}: symbols not in this font: {"".join(missing_sym)}')
                if strict:
                    exit_code = 1
    print('\nOK' if exit_code == 0 else '\nFAIL: regenerate with scripts/subset-site-fonts.py')
    return exit_code


if __name__ == '__main__':
    raise SystemExit(main())
