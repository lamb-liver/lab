# Self-hosted TC webfonts

Site typography roles (see `src/styles/fonts.css` + `src/styles/tokens.css`):

| Role | CSS token | Family | Source |
| --- | --- | --- | --- |
| UI / body / nav / cards | `--font-sans` | 未來熒黑 Glow Sans TC (Normal width) | [welai/glow-sans](https://github.com/welai/glow-sans) v0.93 |
| Large headings / display | `--font-display` | 源雲明體 **TW 月版** (`GenWanMin2TW`) | [ButTaiwan/genwan-font](https://github.com/ButTaiwan/genwan-font) v2.100 |
| Concept / educational prose | `--font-concept` | 霞鶩文楷 TC | [lxgw/LxgwWenkaiTC](https://github.com/lxgw/LxgwWenkaiTC) v1.522 |

## Why GenWanMin TW（月）not TC（丹）

TW（月版）uses contemporary Taiwan character forms (e.g. 「者」without the classical dot), which matches this zh-Hant Taiwan site better than TC（丹版）letterpress forms.

## Subsetting

Shipped `.woff2` files are subsets of site-used CJK + Latin/punctuation (built with `fonttools` `pyftsubset`). Rebuild with `scripts/subset-site-fonts.py` if content adds many new characters.

## Glow Sans glyph gaps

Upstream Glow Sans TC v0.93 is missing these site characters in its cmap (confirmed with fontTools):

- 值 U+503C
- 告 U+544A
- 填 U+586B
- 清 U+6E05
- 真 U+771F

`--font-sans` keeps Glow first and falls back to system / Noto Sans TC for those glyphs only. Do not silently replace Glow without an explicit decision.

Licenses: Glow Sans MIT (`glow-sans-tc/LICENSE.txt`); GenWanMin & WenKai SIL OFL (`*/OFL.txt`).
