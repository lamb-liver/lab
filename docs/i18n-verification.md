# 中英文雙語正式站驗收紀錄

> **本次已確認無問題，不需重複執行。**
>
> 之後只有在改動英文／中文內容、語言切換或字型子集時，才需要針對改動範圍重新檢查。

## 基本資訊

| 項目 | 內容 |
|------|------|
| 驗收時間 | 2026-10-09 11:50–12:00（台北時間，UTC+8） |
| 對象 | 正式站 https://lab.lambliver.dev |
| main commit | `b1f6ea7a77c8a151da83da669cce3d6522493cd6`（#76 squash merge） |
| Vercel 部署 | `dpl_Bx2YvB7T6A12efULhG65GKDw6kdr`（production，READY 於 11:50 台北時間；alias `lab.lambliver.dev`） |
| 瀏覽器 | Google Chrome 154.0.8037.57（Playwright 1.60.0 驅動，headless） |
| 路由來源 | 正式站 `sitemap-0.xml`：336 條（中文 168、英文 168） |
| 寬度 | 1440（桌機）與 390（手機，`isMobile` + `hasTouch`） |

## 檢查項目與結果

| 檢查 | 範圍 | 結果 |
|------|------|------|
| HTTP 200、無轉址 | 336 條路由 × 2 寬度 = 672 次載入 | 672/672 通過 |
| `<html lang>` | 中文頁 `zh-Hant`、英文頁 `en` | 672/672 通過 |
| console error／page error／請求失敗 | 同上（排除 umami、Google、giscus 等第三方分析與留言服務） | 0 筆 |
| 水平溢出（`scrollWidth − innerWidth > 0`） | 1440、390 兩種寬度 | 0 頁 |
| 英文頁殘留中文 | 168 條英文路由 × 2 寬度的 `body.innerText`（允許品牌「羊·實驗」與語言切換「中文」） | 0 頁 |
| canvas 繪製 | 238 頁共 240 個 canvas／寬度；檢查尺寸非零且取樣像素超過單一顏色 | 全部通過 |
| 字型載入 | 每頁 `document.fonts.status` | 全部 `loaded` |
| 語言切換來回與記憶 | 3 組樣本頁 × 2 寬度：英→中切換、記憶後開英文網址自動轉中文、中→英切換、記憶後開中文網址自動轉英文、重新整理維持英文；同時確認 `localStorage lab-lang` | 6/6 組、30/30 步通過 |
| 字型子集缺字 | `python3 scripts/check-font-glyphs.py`（main `b1f6ea7`，7 個字型檔） | 每檔 CJK 缺字 0 / 1078，OK |
| 正式站字型檔 | `/fonts/**/*.woff2` 7 檔 | 全部 HTTP 200，且與 repo 檔案 md5 相同 |
| 修正字串上線 | #75、#76 的 40 個關鍵字串（如 20%／47%、Grade 11 Mathematics A · Plane vectors、Phasor diagram、直線與平面相交、新 CEEC 連結、P=(−10,1)、correct rate、7π/3、∣c∣≤2、Bayes' theorem、stationary-wave nodes、General Scholastic Ability Test） | 40/40 存在 |

失敗項目：無，因此沒有重跑。

語言切換樣本：

- `/en/works/julia-set/` → `/works/julia-set/`；`/en/explore/vectors/` → `/explore/vectors/`；`/exam/ast-114-parallelogram-direction-area/` → `/en/exam/ast-114-parallelogram-direction-area/`
- `/en/concept/` → `/concept/`；`/en/path/trig-to-fourier/` → `/path/trig-to-fourier/`；`/about/` → `/en/about/`
- `/en/` → `/`；`/en/exam/` → `/exam/`；`/works/` → `/en/works/`

## 本輪審查修正

英文逐頁審查對照官方用語與原始試卷／來源，修正分兩個 PR 合併。

### #75（squash `0dc513c9`）：blocker、should-fix、斷連結

- gsat-115 拋物線：答對率改為師大解析第 16 題的 20%／47%／3%（中英）。
- ast-111 拋物線：直角三角形 $F'B'B$ 與內錯角的說明（中英）。
- ast-112 等腰 120°：題意依試卷原文；連結文字改 CEEC item statistics；直角位置由畢氏關係推得。
- ast-114 平行四邊形：圖形 $P$ 位置修正為 $(-10,1)$，四組符號解畫同一個平行四邊形，測試同步更新。
- 斷連結：114 分科數甲試卷、113 分科試題特色分析改為有效的大考中心網址。
- 英文課綱單元依 MOE 108 課綱英文版（Grade 11 Mathematics A、Grade 10 required mathematics），中文不動。
- complex-phase-portrait：Phasor diagram；function-derivative-graph：stationary point of inflection。
- lissajous、lp-vertex-optimum、sierpinski（維度恰為 log3/log2）、taylor（在 x=a 處）用語與數學修正。
- complex-powers-roots（等角螺線）、space-vectors-planes-lines（直線與平面相交的判斷與狀態標籤）。
- trig-to-fourier 路徑：分段平滑週期函數與跳躍點收斂說明。

### #76（squash `b1f6ea7a`）：剩餘全部 nit

- CEEC 用詞：單選／選填題 P 為「答對率／correct rate」（ast-112 第 9 題、ast-113 增廣矩陣第 9 題）；多選題維持「得分率」。
- ast-111 複數：以上半平面與 $|w|=|z^2|=1$ 推得 $z^2=w$。
- ast-113 幾何分佈：補選項 (3) $0.9^{10}\approx0.349>0.1$。
- ast-114 旋轉體：面積固定時 $f$ 愈不平均 $\int f^2$ 愈大；英文連結文字改 CEEC scoring guidelines。
- gsat-112 旋轉：標明解析非大考中心資料；gsat-112 疊合：補選項 (4) 兩解和 $\frac{7\pi}{3}>2\pi$。
- amc12a-2024-20：beyond Taiwan's high-school curriculum。
- Works：arithmetic-geometric、binomial-geometric、chladni、conic-envelope、demoivre、eigenvector、gradient、julia（$|c|\le2$）、lp-feasible、poincare、radian-arc-length、sierpinski、vector-field-streamlines。
- Explore：trig-wave-interference（stationary-wave nodes、暗紋）、complex-powers-roots（開方與乘方的還原）。
- 概念 Bayes' theorem；路徑「外積：三維空間的向量積」；About 補 GSAT、AST 全名。

## 用語表與來源

- 英文用語表：[`i18n-glossary.md`](i18n-glossary.md)（來源優先序：CEEC／MOE／MAA → 國家教育研究院樂詞網「高中以下數學名詞」→「數學名詞」）。
- 主要來源：
  - 大考中心（CEEC）英文頁：學測 https://www.ceec.edu.tw/en/xmdoc/cont?xsmsid=0J180519762978782512 、分科 https://www.ceec.edu.tw/en/xmdoc/cont?xsmsid=0J180520257949680510
  - 108 課綱數學領域英文版（MOE）：https://englishcenter.ntpc.edu.tw/uploads/16767043725953AafXiFc.pdf
  - 樂詞網：https://terms.naer.edu.tw/
  - MAA AMC 引用規範：https://maa.org/student-programs/amc/maa-amc-policies/
  - 各題試卷、解答與試題分析：見各題 frontmatter 的 `sourceUrl`／`analysisUrl`。
- 程式內的英文字串：`src/lib/conceptLabels.ts`、`src/lib/learningPathsEn.ts`、`src/pages/en/about.astro`、`src/lib/seoCopy.ts`。
