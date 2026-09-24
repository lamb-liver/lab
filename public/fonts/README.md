# Self-hosted TC webfonts

Site typography roles (see `src/styles/fonts.css` + `src/styles/tokens.css`):

| Role | CSS token | Family | Source |
| --- | --- | --- | --- |
| UI / body / nav / cards | `--font-sans` | 思源黑體 **Noto Sans TC** (`Source Han Sans TC`) | [adobe-fonts/source-han-sans](https://github.com/adobe-fonts/source-han-sans) 2.005R TC OTFs |
| Large headings / display | `--font-display` | 源雲明體 **TW 月版** (`GenWanMin2TW`) | [ButTaiwan/genwan-font](https://github.com/ButTaiwan/genwan-font) v2.100 |
| Concept / educational prose | `--font-concept` | 霞鶩文楷 TC | [lxgw/LxgwWenkaiTC](https://github.com/lxgw/LxgwWenkaiTC) v1.522 |

Applied via `.prose` (works / explore / exam long-form), `.page-lead`, concept aggregation copy (`.concept-detail` / `.concept-index` leads & path links), and `.path-step__note`. Homepage preloads UI + display only; pages that need WenKai pass `preloadConceptFont` to `BaseLayout`.

## Why 思源黑體 for UI

Noto Sans TC / Source Han Sans TC is a neutral gothic (sans) with full Traditional Chinese coverage. It keeps UI chrome readable and less 「q」than the previous Kaisei-based 宇文天穹 cut, while display headings stay GenWanMin TW and concept/prose stay LXGW WenKai TC.

Shipped weights: **Regular (400)**, **Medium (500)**, **Bold (700)** — subsetted from Adobe Source Han Sans TC OTFs; CSS family name is `Noto Sans TC` (Google naming; same design).

## Why GenWanMin TW（月）not TC（丹）

TW（月版）uses contemporary Taiwan character forms (e.g. 「者」without the classical dot), which matches this zh-Hant Taiwan site better than TC（丹版）letterpress forms.

## Subsetting

Shipped `.woff2` files are subsets of site-used CJK + Latin/punctuation (built with `fonttools` `pyftsubset`). Rebuild with `scripts/subset-site-fonts.py` if content adds many new characters. Sources live under `/tmp/lab-fonts` (see script).

Both `scripts/subset-site-fonts.py` and `scripts/check-font-glyphs.py` read the same text sources (`scripts/font_text_sources.py`: every `.astro/.ts/.tsx/.js/.mjs/.md/.mdx/.json/.css` under `src/`, minus real test files). CI runs the checker, so new copy with characters outside the shipped subsets fails until the fonts are rebuilt.

Licenses: Noto/Source Han Sans, GenWanMin & WenKai are SIL OFL (`*/OFL.txt`).
