#!/usr/bin/env python3
"""Rebuild public/fonts/*.woff2 subsets from full sources in /tmp/lab-fonts."""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = Path('/tmp/lab-fonts')
OUT = ROOT / 'public' / 'fonts'

CJK_RE = re.compile(r'[\u3000-\u303F\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]')
BLOCK_COMMENT_RE = re.compile(r'/\*.*?\*/', re.S)
LINE_COMMENT_RE = re.compile(r'(^|[^:])//.*?$', re.M)
HTML_COMMENT_RE = re.compile(r'<!--.*?-->', re.S)

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
    'src/styles/**/*.css',
    'public/fonts/README.md',
]

FORCE_CJK = '思源黑體源雲明體霞鶩文楷月版丹版'


def strip_comments(text: str, suffix: str) -> str:
    if suffix == '.css':
        return BLOCK_COMMENT_RE.sub(' ', text)
    if suffix in {'.ts', '.tsx', '.js', '.jsx', '.mjs'}:
        text = BLOCK_COMMENT_RE.sub(' ', text)
        return LINE_COMMENT_RE.sub(r'\1', text)
    if suffix == '.astro':
        text = HTML_COMMENT_RE.sub(' ', text)
        text = BLOCK_COMMENT_RE.sub(' ', text)
        return LINE_COMMENT_RE.sub(r'\1', text)
    return text


def collect_text() -> str:
    files: list[Path] = []
    for g in GLOBS:
        files.extend(ROOT.glob(g))
    files = [f for f in files if 'test' not in f.name.lower() and '.test.' not in str(f)]
    chunks: list[str] = []
    for f in files:
        try:
            raw = f.read_text(encoding='utf-8')
        except OSError:
            continue
        chunks.append(strip_comments(raw, f.suffix))
    return '\n'.join(chunks)


def build_subset_text(raw: str) -> str:
    cjk = set(CJK_RE.findall(raw)) | set(CJK_RE.findall(FORCE_CJK))
    ascii_ = ''.join(chr(i) for i in range(0x20, 0x7F))
    latin1 = ''.join(chr(i) for i in range(0xA0, 0x100))
    greek = 'αβγδεζηθικλμνξοπρστυφχψωΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩ'
    extra = '—–…·•°±×÷≤≥≠≈∞√∫∑∏∂∇πμσθλ→←↔⇒⇐⇔∈∉⊂⊃∪∩′″²³⁴₀₁₂₃₄'
    return ascii_ + latin1 + greek + extra + ''.join(sorted(cjk))


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
