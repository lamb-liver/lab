# Self-hosted TC webfonts

Site typography roles (see `src/styles/fonts.css` + `src/styles/tokens.css`):

| Role | CSS token | Family | Source |
| --- | --- | --- | --- |
| UI / body / nav / cards | `--font-sans` | 解星／**宇文天穹** (`UoqMunThenKhung`) — Kaisei TC sibling | [MoonlitOwen/ThenKhung](https://github.com/MoonlitOwen/ThenKhung) v1.005 |
| Large headings / display | `--font-display` | 源雲明體 **TW 月版** (`GenWanMin2TW`) | [ButTaiwan/genwan-font](https://github.com/ButTaiwan/genwan-font) v2.100 |
| Concept / educational prose | `--font-concept` | 霞鶩文楷 TC | [lxgw/LxgwWenkaiTC](https://github.com/lxgw/LxgwWenkaiTC) v1.522 |

Applied via `.prose` (works / explore / exam long-form), `.page-lead`, concept aggregation copy (`.concept-detail` / `.concept-index` leads & path links), and `.path-step__note`. Homepage preloads UI + display only; pages that need WenKai pass `preloadConceptFont` to `BaseLayout`.

## Why 宇文天穹 instead of Google Fonts Kaisei (Opti / Decol / …)

Upstream 解星 (Kaisei Opti / Decol / HarunoUmi / Tokumin) is Adobe-Japan1-3 Japanese. Shared kanji cover many site glyphs, but not full Traditional Chinese (e.g. Kaisei Opti misses **值** U+503C among former Glow gaps). **宇文天穹** is the open-source Kaisei-based TC cut (inherited glyph forms + Big-5 common set), so `--font-sans` can cover site CJK without system-sans fallbacks for missing glyphs.

Only **Regular** ships upstream; the same Regular file is registered at weights 400/500/700 to avoid browser faux-bold.

## Why GenWanMin TW（月）not TC（丹）

TW（月版）uses contemporary Taiwan character forms (e.g. 「者」without the classical dot), which matches this zh-Hant Taiwan site better than TC（丹版）letterpress forms.

## Subsetting

Shipped `.woff2` files are subsets of site-used CJK + Latin/punctuation (built with `fonttools` `pyftsubset`). Rebuild with `scripts/subset-site-fonts.py` if content adds many new characters.

Licenses: UoqMunThenKhung, GenWanMin & WenKai are SIL OFL (`*/OFL.txt`).
