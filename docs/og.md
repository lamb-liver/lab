# 社群預覽圖（OG 卡片）

> **目前狀態已完成並驗收，不需重做。** 2026-10-10 依序合併 #78–#82，正式站抽查通過。
>
> 只有在改動 **OG 產生器**（`src/lib/*Og*.ts`、`scripts/generate-*-og*.ts`）、**OG 字型**，或**作品／試題／主題的標題、公式**時，才需要針對改動範圍重新檢查（見文末「何時需要重新檢查」）。

## 總覽

所有卡片都是 1200×630 PNG，在 build 前由 `scripts/generate-work-og.mjs`（`npm run build`＝`scripts/lab.mjs build` 的第一步；單獨產生用 `npm run og:works`）以 satori＋sharp 產生到 `public/`，不進 git（`.gitignore`）。版面相同：左邊品牌「羊·實驗」＋（小字）＋標題（＋公式），右邊作品縮圖或試題／主題封面。

| 頁面 | og:image 路徑 | 產生程式 | 版面 |
|------|---------------|----------|------|
| 中文作品 `/works/<slug>/` | `/og/works/<slug>.png` | `scripts/generate-work-og.vitest.ts` → `src/lib/workOgImage.ts`、`workOgSatori.ts` | 品牌＋標題＋公式＋縮圖 |
| 中文試題 `/exam/<slug>/` | `/og/zh/exam/<slug>.png` | `scripts/generate-zh-og.vitest.ts` → `src/lib/zhOgImage.ts` | 品牌＋官方出處＋標題＋封面 |
| 中文主題 `/explore/<slug>/` | `/og/zh/explore/<slug>.png` | 同上 | 品牌＋「主題導覽・分類」＋標題＋封面 |
| 英文作品 `/en/works/<slug>/` | `/og/en/works/<slug>.png` | `scripts/generate-en-og.vitest.ts` → `src/lib/enOgImage.ts`、`enOgSatori.ts` | 品牌＋英文標題＋公式＋縮圖 |
| 英文試題 `/en/exam/<slug>/` | `/og/en/exam/<slug>.png` | 同上 | 品牌＋英文出處＋英文標題＋封面 |
| 英文主題 `/en/explore/<slug>/` | `/og/en/explore/<slug>.png` | 同上 | 品牌＋「Math topics · 分類」＋英文標題＋封面 |
| 中文首頁與其他頁 | `DEFAULT_OG_IMAGE`（`src/lib/defaultOg.ts`） | — | 沿用原預設圖 |
| 英文首頁與其他頁 | `/og/en/works/spirograph-curve.png`（`DEFAULT_OG_IMAGE_EN`，alt「Spirograph curve」） | — | 英文繁花曲線卡 |

- 路徑函式：`getWorkOgImagePath`、`getEnOgImagePath`（`src/lib/enOgPaths.ts`）、`getZhOgImagePath`（`src/lib/zhOgPaths.ts`）。
- `src/layouts/BaseLayout.astro` 對 `/og/works/`、`/og/en/`、`/og/zh/` 開頭的圖補上 `og:image:width=1200`、`og:image:height=630`；中文頁 `og:locale=zh_TW`、英文頁 `en_US`（互為 `og:locale:alternate`）。
- 試題／主題頁的 JSON-LD `image` 也沿用 OG 卡片（中英文相同做法）。
- 試題與主題封面本身（`public/images/{exam,explore}-covers/*.png`，無字）不變，只是被嵌進卡片右側。

## 版面規則

### 標題

- **中文**（作品、試題、主題共用 `src/lib/zhOgTitle.ts` 的 `zhTitleLayout`）：
  - 字寬：中文字與全形標點算 1，其他字元算 0.55；標題欄寬 528px（以 520px 計算留餘裕）。
  - 一行以 **52px 以上**放得下就排一行。
  - 否則斷成兩行，**只在標點（，、：；）或「的」「與」之後，或全形括號「（」「「」之前**斷開，選兩行中較長那行最短的斷點；字級取兩行都放得下的最大值。
  - 沒有斷行點時寧可一行縮小字級，**不在詞中間斷開**（只有最小字級也放不下時才從中間斷；目前沒有這種標題）。
  - 字級：作品卡 72／64／60／56／52／48／44px（短標題維持 72px）；試題／主題卡 64／56／52／48／44px。
- **英文**（`enTitleFontSize`）：依字數 64／56／48／42px，自動換行。

### 公式（作品卡）

- 中英文都**只排一行**（`white-space: nowrap`），字級 22–34px 取一行放得下的最大值（`ogFormulaFontSize`，欄寬 528px、等寬字 0.6em、中文字與全形標點約 1/0.6 個等寬字）。
- 不得有 TeX／插入符號寫法（`_`、`^`、`\`、`x{`），長度不得超過一行（`ogFormulaProblems`）。
- 公式對照表在 `src/lib/ogFormula.ts`：
  - `OG_FORMULA_SHARED`：中英文共用，只有數學符號。把 `z_{n+1}` 這類寫法改成 Unicode 上下標（`zₙ₊₁ = zₙ² + c`），太長的只留一行放得下的部分（例如尤拉公式、諧振圖、繁花曲線）。
  - `EN_OG_FORMULA`：共用表＋四個模組公式含中文的英文譯文（lp-objective-level-curves、lp-vertex-optimum、poincare-triangle、row-op-solution-space），用語依 [`i18n-glossary.md`](i18n-glossary.md)。英文卡另把全形「，；」換成半形。
  - 中文卡用 `toZhOgFormula`：套共用表，中文用語與全形標點保留原樣。
  - **新增作品時**：若模組 `formula` 含 TeX 寫法或太長，build 會失敗並指出 slug，請在 `OG_FORMULA_SHARED` 加一筆（含中文的再到 `EN_OG_FORMULA` 加英文版）。

### 小字（試題出處、主題分類）

- 中文試題：`examSourceLabel(data)`，例如「114 分科數甲・非選17」「2023 AMC 12B・第21題」（與詳情頁出處相同）。
- 英文試題：`examSourceLabel(data, 'en')`，例如「2025 Advanced Math A, Non-multiple-choice 17」「2023 AMC 12B, Problem #21」。
- 中文主題：「主題導覽・<分類>」（`zhExploreKicker`，與導覽列、麵包屑的「主題導覽」及試題出處的「・」一致）。
- 英文主題：「Math topics · <category>」。
- 作品卡不放小字。

### 品牌

英文卡片也保留中文品牌「羊·實驗」（使用者決定：品牌名不翻譯）。英文卡片除品牌外不得出現中文（build 檢查）。

## 字型

| 用途 | 字型檔 | 授權／來源 |
|------|--------|-----------|
| 中文字 | `@fontsource/noto-sans-tc` chinese-traditional 400（woff） | OFL，既有相依套件 |
| 英文卡片拉丁字 | `@fontsource/noto-sans-tc` latin 400（命名為 Noto Sans） | 同上 |
| 全形標點「・」「，」「：」「；」 | `@fontsource/noto-sans-tc` 114、115、119 號子集 | 同上（繁中子集不含這些標點） |
| 公式等寬字 | `@fontsource/jetbrains-mono` latin 400 | OFL，既有相依套件 |
| 公式符號備援（希臘字母、上下標、數學運算子、箭頭） | `scripts/og-fonts/NotoSansMono-OgSymbols.woff`、`NotoSansMath-OgSymbols.woff` | OFL（`scripts/og-fonts/OFL.txt`）；子集範圍見 `scripts/og-fonts/README.md` |

- `scripts/og-fonts/` **只用於產生圖片**，不會送到瀏覽器；放在 `scripts/` 而不是 `src/`，因為 `scripts/check-font-glyphs.py` 會掃 `src/` 下所有文字檔的中文字，中文 README 放在 `src/` 會被判定缺字。
- 公式字型順序：JetBrains Mono → Noto Sans Mono → Noto Sans Math → Noto Sans TC → 全形標點。
- satori 不支援 woff2，所以沿用 fontsource 的 woff，而不是網站本身 `public/fonts` 的 woff2 子集。

## Build 時的檢查（失敗就讓 build 失敗）

| 檢查 | 位置 |
|------|------|
| **缺字**：satori 的 `loadAdditionalAsset` 被呼叫（任何字元所有字型都沒有）就丟錯，列出缺的字；中文作品、中文試題／主題、英文卡片三條路徑都有 | `workOgImage.ts`、`zhOgImage.ts`、`enOgImage.ts` |
| **英文卡片含中文**（品牌除外） | `enOgImage.ts` `renderEnOgCard` |
| **公式含 TeX 寫法或太長**（中英文作品卡） | `ogFormula.ts` `ogFormulaProblems`，由 `workOgImage.ts`、`enOgImage.ts` 呼叫 |
| **每頁都有卡片**：作品 ≥ 門檻、英文 works／exam／explore 與中文 exam／explore 每篇一張 | `scripts/audit-work-og.mjs`（build 最後一步） |
| OG 產生檔案存在 | `scripts/audit-integration.mjs` `workOgPipeline` |
| 單元測試：路徑、標題斷行與字級、公式對照、缺字會丟錯 | `src/lib/enOg.test.ts`、`zhOg.test.ts`、`workOgImage.test.ts`、`defaultOg.test.ts` |
| e2e：og:image／twitter:image／alt／寬高／locale 與圖檔回應 | `tests/seo-ux.spec.ts`（「English pages expose English OG cards and en_US locale」、「Chinese exam and explore pages expose titled OG cards」、「explore detail exposes article OG metadata」等） |

## 使用者的決定與理由

| 決定 | 理由 |
|------|------|
| 英文頁要有英文 OG（#78） | 英文頁分享出去原本是中文卡片 |
| 英文卡片保留品牌「羊·實驗」 | 品牌名不翻譯 |
| 英文主題小字「Math topics · 分類」、四個含中文公式的英文譯法照建議 | 與英文頁用語一致 |
| 公式只排一行、不在式子中間換行、用 Unicode 上下標（先英文 #78，後中文 #81） | 式子中間斷開與 `z_{n+1}` 寫法不易閱讀 |
| 中文試題／主題改用含標題卡片（#80），JSON-LD image 也改用卡片 | 無字封面分享出去看不出是哪一題、哪個主題，且比例不是 1200×630；與英文頁一致 |
| 修正中文作品卡豆腐字並加缺字檢查（#79） | 40 張公式（與一張標題）有豆腐字，satori 缺字時不會報錯 |
| 中文作品卡標題斷行比照試題／主題卡（#82） | 原本會在詞中間斷開（例如「二項式展開的幾／何意義」） |

## PR 紀錄（皆為 squash merge，時間為台北時間 2026-10-10）

| PR | 內容 | merge SHA | 合併 | 正式站部署 |
|----|------|-----------|------|-----------|
| #78 | 英文頁英文 OG 卡片（作品、試題、主題、預設圖）、en_US、公式單行 | `55b2bc6d48961a6ccb665edc32a8590c757fa72c` | 00:16 | `dpl_4vKGX1K6ZDrnZqJ8VTfR9TmaBQVn` |
| #79 | 中文作品卡公式補符號字型、缺字檢查 | `22ec7ff7bf7c0440b5f2697e3d22f309435c6b00` | 00:54 | `dpl_DqrRRsgsNL4RL62SECWcw9Ayy1XE` |
| #80 | 中文試題／主題含標題卡片 | `c58c0c99046cb15007afcc35b83ba92d8bdc9f8a` | 00:59 | `dpl_CFGgB7USShrcwR59D3Uuq4BXEFWc`（自動部署未觸發，手動部署同一 commit） |
| #81 | 中文作品卡公式單行、Unicode 上下標（共用 #78 對照表） | `6b502ed71cb319f5c99aa0914cf00be2da5cedc5` | 01:21 | `dpl_ATPfsGUwLsZhDrLPGcqdS7TYhukR` |
| #82 | 中文作品卡標題斷行規則 | `58b63314afc34f4db518006d243e4ed72e48dfc0` | 01:29 | `dpl_ES5pLsnpeN2qLiyLcfSBspPmc7h4` |

每個 PR 合併前：CI（build、e2e、Vercel）全綠；在 preview 下載全部受影響圖檔，確認 200、image/png、1200×630，且與本機產生的圖逐像素相同；未受影響的卡片（例如改中文時的英文卡片）位元組完全相同。

## 正式站抽查結果

- #78 後（00:17）：英文頁 /en/、/en/works/、/en/works/julia-set/、/en/works/spirograph-curve/、/en/exam/ast-114-solid-of-revolution/、/en/explore/vectors/、/en/concept/、/en/about/ 的 og:image 皆在 `/og/en/`，200、image/png、1200×630；中文頁 zh_TW 與圖不變。
- #80 後（01:13）：中文作品 5 頁（rose-curve、julia-set、euler-formula-rotation、trig-angle-identities、gradient-level-curves）無豆腐字；中文試題 3 頁、主題 3 頁指向 `/og/zh/…` 含標題卡片；英文頁不變。全部 200、image/png、1200×630，且與驗收過的圖逐像素相同。
- #82 後（01:31）：中文作品 6 頁（rose-curve、julia-set、euler-formula-rotation、binomial-expansion-geometry、sinusoid-amplitude-period-phase、sierpinski-triangle）公式單行、標題斷行正確；/explore/vectors/ 標題卡；英文 /en/、/en/works/julia-set/、/en/exam/ast-114-solid-of-revolution/ 不變。全部 200、image/png、1200×630，與驗收過的圖逐像素相同。

## 已完成、不需重做

- [x] 英文頁全部使用英文 OG 卡片，`og:locale=en_US`，中文頁維持 `zh_TW`
- [x] 中文試題／主題頁使用含標題卡片，寬高 meta 正確
- [x] 中文作品卡無豆腐字（78 張）、公式單行、無 TeX 寫法
- [x] 中英文卡片標題不在詞中間斷開
- [x] 缺字檢查、英文卡片中文檢查、公式檢查、每頁卡片 audit、e2e meta 檢查都已接進 build／CI
- [x] 正式站抽查通過（見上）
- [x] 2026-10-09 的中英文全站驗收（[`i18n-verification.md`](i18n-verification.md)）不因 OG 變更而需重跑：OG 只改 meta 與圖檔，頁面內容不變

## 何時需要重新檢查

| 改動 | 需要做的事 |
|------|-----------|
| 新增或修改作品的標題、`formula` | 跑 `npm run build`；公式含 TeX 或太長會失敗，依提示在 `ogFormula.ts` 加對照；看一下該作品的 `public/og/works/<slug>.png`（與英文版） |
| 新增或修改試題／主題的標題、出處、分類 | 跑 `npm run build`；看 `public/og/zh/…` 與 `public/og/en/…` 該篇的卡片 |
| 改 OG 產生器、版面或字型 | 重新產生全部卡片，與改動前逐張比對（只應改到預期的卡片），並在 preview 抽查 |
| 其他改動（內容正文、互動、樣式） | 不需檢查 OG |

缺字時 build 會直接失敗並列出缺的字：中文字或標點請先找 `@fontsource/noto-sans-tc` 哪個號碼子集有這個字並加進字型清單；數學符號請擴充 `scripts/og-fonts` 子集（範圍見該目錄 README）。
