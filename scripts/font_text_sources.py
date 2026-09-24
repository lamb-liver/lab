"""Shared file collection for scripts/subset-site-fonts.py and scripts/check-font-glyphs.py.

Both scripts must see exactly the same user-visible text, otherwise the checker can
pass while the shipped subsets miss glyphs. Rules:

- Scan every file under src/ with a text suffix (astro, ts, tsx, js, jsx, mjs, md,
  mdx, json, css). Suffixes are matched explicitly: Python's Path.glob does not
  expand brace patterns such as ``**/*.{astro,ts,tsx}``.
- Also scan text data under public/ that the site could render (json, md, html),
  excluding public/fonts (licence files and the README are not rendered).
- Skip only real test code: files named *.test.* / *.spec.*, type declarations
  (*.d.ts), and anything inside a test/, tests/, __tests__/, e2e/ or __mocks__
  directory. Do not match substrings of names ("shortest", "contest", "ast-114").
- Strip comments from code and CSS (they are not rendered). Markdown and JSON are
  used as-is: frontmatter (title / description) is rendered, and extra characters
  from markdown syntax only make the subset slightly larger, never smaller.
"""
from __future__ import annotations

import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

SRC_SUFFIXES = {'.astro', '.ts', '.tsx', '.js', '.jsx', '.mjs', '.md', '.mdx', '.json', '.css'}
PUBLIC_SUFFIXES = {'.json', '.md', '.html'}
PUBLIC_EXCLUDE_DIRS = {'fonts'}
TEST_DIRS = {'test', 'tests', '__tests__', 'e2e', '__mocks__'}
TEST_FILE_RE = re.compile(r'\.(test|spec)\.[^.]+$')

# CJK ideographs, CJK symbols/punctuation, kana (・), and full-width forms (？！（）).
# These have no acceptable system fallback on the site, so they must be in every role font.
CJK_RE = re.compile(r'[\u3000-\u30FF\u3400-\u4DBF\u4E00-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]')

BLOCK_COMMENT_RE = re.compile(r'/\*.*?\*/', re.S)
LINE_COMMENT_RE = re.compile(r'(^|[^:])//.*?$', re.M)
HTML_COMMENT_RE = re.compile(r'<!--.*?-->', re.S)


def is_test_path(path: Path) -> bool:
    rel = path.relative_to(ROOT)
    if TEST_DIRS.intersection(rel.parts[:-1]):
        return True
    name = rel.name
    return bool(TEST_FILE_RE.search(name)) or name.endswith('.d.ts')


def collect_files(root: Path = ROOT) -> list[Path]:
    files: list[Path] = []
    for path in (root / 'src').rglob('*'):
        if path.is_file() and path.suffix in SRC_SUFFIXES and not is_test_path(path):
            files.append(path)
    public = root / 'public'
    for path in public.rglob('*'):
        if not path.is_file() or path.suffix not in PUBLIC_SUFFIXES:
            continue
        if PUBLIC_EXCLUDE_DIRS.intersection(path.relative_to(public).parts[:-1]):
            continue
        files.append(path)
    return sorted(files)


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
    if suffix in {'.md', '.mdx', '.html'}:
        return HTML_COMMENT_RE.sub(' ', text)
    return text


def visible_text(path: Path) -> str:
    return strip_comments(path.read_text(encoding='utf-8'), path.suffix)


def is_visible_non_ascii(ch: str) -> bool:
    cp = ord(ch)
    return cp > 0x7E and not (0x80 <= cp <= 0x9F) and ch not in '\ufeff\u200b\u200c\u200d\u2060'
