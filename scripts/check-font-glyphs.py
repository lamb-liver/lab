#!/usr/bin/env python3
"""Verify user-facing site CJK glyphs exist in role fonts (shipped woff2)."""
from __future__ import annotations

import re
import sys
import unicodedata
from pathlib import Path

from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parents[1]
CJK_RE = re.compile(r'[\u3000-\u303F\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]')
BLOCK_COMMENT_RE = re.compile(r'/\*.*?\*/', re.S)
LINE_COMMENT_RE = re.compile(r'(^|[^:])//.*?$', re.M)
HTML_COMMENT_RE = re.compile(r'<!--.*?-->', re.S)

# Known upstream Glow Sans TC v0.93 cmap gaps (not introduced by subsetting).
KNOWN_GLOW_GAPS = set('值告填清真')

ROLE_FONTS = {
    'GlowSansTC (UI)': ROOT / 'public/fonts/glow-sans-tc/GlowSansTC-Regular.woff2',
    'GenWanMin2TW (display)': ROOT / 'public/fonts/genwanmin-tw/GenWanMin2TW-R.woff2',
    'LXGWWenKaiTC (concept)': ROOT / 'public/fonts/lxgw-wenkai-tc/LXGWWenKaiTC-Regular.woff2',
}

# User-facing sources (exclude CSS token comments / scripts).
GLOBS = [
    'src/content/**/*.md',
    'src/pages/**/*.{astro,ts,tsx,js,jsx}',
    'src/components/**/*.{astro,ts,tsx,js,jsx}',
    'src/lib/**/*.{ts,tsx,js,jsx}',
    'src/layouts/**/*.{astro,ts}',
    'src/curve/**/*.{ts,tsx}',
    'src/explore/**/*.{ts,tsx}',
    'src/exam/**/*.{ts,tsx}',
    'src/systems/**/*.{ts,tsx}',
    'src/works/**/*.{ts,tsx}',
]


def strip_comments(text: str, suffix: str) -> str:
    if suffix in {'.css'}:
        return BLOCK_COMMENT_RE.sub(' ', text)
    if suffix in {'.ts', '.tsx', '.js', '.jsx', '.mjs'}:
        text = BLOCK_COMMENT_RE.sub(' ', text)
        return LINE_COMMENT_RE.sub(r'\1', text)
    if suffix in {'.astro'}:
        text = HTML_COMMENT_RE.sub(' ', text)
        text = BLOCK_COMMENT_RE.sub(' ', text)
        return LINE_COMMENT_RE.sub(r'\1', text)
    return text


def collect_cjk() -> tuple[str, dict[str, list[tuple[Path, int, str]]]]:
    files: list[Path] = []
    for g in GLOBS:
        files.extend(ROOT.glob(g))
    files = [f for f in files if 'test' not in f.name.lower() and '.test.' not in str(f)]
    locs: dict[str, list[tuple[Path, int, str]]] = {}
    chars: set[str] = set()
    for f in files:
        try:
            raw = f.read_text(encoding='utf-8')
        except OSError:
            continue
        text = strip_comments(raw, f.suffix)
        for i, line in enumerate(text.splitlines(), 1):
            for ch in CJK_RE.findall(line):
                chars.add(ch)
                locs.setdefault(ch, [])
                if len(locs[ch]) < 3:
                    locs[ch].append((f, i, line.strip()[:100]))
    return ''.join(sorted(chars)), locs


def cmap_of(path: Path) -> set[int]:
    font = TTFont(str(path))
    best = font.getBestCmap() or {}
    font.close()
    return set(best.keys())


def main() -> int:
    cjk, locs = collect_cjk()
    print(f'unique user-facing CJK: {len(cjk)}')
    exit_code = 0
    for role, path in ROLE_FONTS.items():
        if not path.exists():
            print(f'FAIL {role}: missing {path}')
            exit_code = 1
            continue
        covered = cmap_of(path)
        missing = [ch for ch in cjk if ord(ch) not in covered]
        print(f'\n=== {role} @ {path.relative_to(ROOT)} ===')
        print(f'missing {len(missing)} / {len(cjk)}')
        for ch in missing:
            cp = ord(ch)
            print(f'  {ch} U+{cp:04X} {unicodedata.name(ch, "?")}')
            for f, i, snip in locs.get(ch, [])[:2]:
                print(f'    {f.relative_to(ROOT)}:{i}: {snip}')
        if role.startswith('GlowSansTC'):
            unexpected = [ch for ch in missing if ch not in KNOWN_GLOW_GAPS]
            if unexpected:
                print('UNEXPECTED Glow gaps beyond known set:', ''.join(unexpected))
                exit_code = 1
            elif missing:
                print('  (known Glow Sans TC v0.93 upstream gaps; CSS system-sans fallback covers)')
        elif missing:
            exit_code = 1
    return exit_code


if __name__ == '__main__':
    raise SystemExit(main())
