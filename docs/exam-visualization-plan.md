# 試題視覺化（/exam）企劃

第三個內容集合，與 Works（單一數學對象的深度作品）、Explore（主題導覽）並列。
進入點是**一道具體的歷屆試題**，出口是「為什麼這題會錯」的互動解釋。

- 顯示名稱：試題視覺化
- 路由：`/exam`、`/exam/[slug]`
- Nav 位置：`作品集｜主題導覽｜試題視覺化｜關於`

## 為什麼獨立成一個集合

Works 的敘事是「這個數學對象長什麼樣」，Explore 是「這個單元怎麼串起來」。
試題視覺化的敘事是「這題全體考生都卡在哪個心智步驟」——需要三種現有集合沒有的欄位：
考科、年份、題號、原題連結、答對率／誘答分析、以及回連到對應的 Explore 單元與 Works 作品。
硬塞進 `works` 的 tag 會讓列表篩選與 SEO 都失焦。

## 內容模型

新增 `src/content.config.ts` 的第三個 collection：

```ts
export const examSubjects = ['學測數A', '學測數B', '分科數甲'] as const;
export const examQuestionTypes = ['單選', '多選', '選填', '非選'] as const;

const exam = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/exam' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    subject: z.enum(examSubjects),      // 考科
    year: z.number().int(),             // 民國年：112 / 113 / 114
    questionType: z.enum(examQuestionTypes),
    questionNo: z.string(),             // '11'、'17'
    unit: z.string(),                   // '高三選修數A・矩陣與線性變換'
    concepts: z.array(z.string()),      // 篩選與搜尋用的觀念標籤
    sourceUrl: z.string().url().optional(),   // 大考中心原卷 PDF
    analysisUrl: z.string().url().optional(), // 答對率／解析出處
    relatedExplore: z.array(z.string()).default([]),
    relatedWorks: z.array(z.string()).default([]),
    coverImage: z.string().optional(),
    date: z.coerce.date(),
    order: z.number().int().nonnegative(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});
```

**版權界線**：只寫改寫過的題意敘述與觀念拆解，附 `sourceUrl` 連回大考中心原卷，
不整段轉載題目文字或選項，不重製試卷圖檔。

## 頁面結構

列表 `/exam`：沿用 `ListSearchFilterScript` + `FilterBar` 單維度篩選，
`data-filter-param="subject"`，選項由已發布條目收集（`collectExamSubjects`）。
卡片標題左上掛 `112 學測數A・多選11` 的來源標記。

詳情 `/exam/[slug]`：
1. 題目卡（改寫題意 + 原卷連結 + 考科年份題號）
2. 互動舞台 `ExamInteractiveStage`
3. 為什麼會錯（答對率／誘答選項分析）
4. 觀念拆解（KaTeX）
5. 延伸：`relatedExplore` / `relatedWorks` 連結

## 公開狀態

`/exam` 已是正式內容集合：

1. 頁面位於 `src/pages/exam/`，一般 `npm run build` 會產生列表與所有已發布題目的 HTML。
2. `draft: true` 的新題只在本地 dev 產生詳情 route，不會出現在正式列表或 production build。
3. `/exam` 已加入 Nav、Footer 與 sitemap；頁面使用正常索引規則。

## 需要新增的檔案

跟著 Explore 的形狀走，不走 Works 的 portal 控制模型：

```text
src/content/exam/{slug}.md
src/pages/exam/index.astro
src/pages/exam/[slug].astro
src/exam/interactiveSlugs.ts
src/exam/interactiveRegistry.ts
src/exam/{slug}/*                      # 幾何與狀態
src/components/exam/ExamInteractiveStage.tsx
src/components/exam/{Xxx}ExamRoot.tsx
src/components/exam/ExamCard.astro
src/components/curve/use{Xxx}P5.ts     # p5 hook 沿用既有位置
src/systems/rendering/{xxx}Render.ts
scripts/new-exam.mjs                   # 比照 new-explore.mjs，加 --interactive
scripts/exam-covers/{slug}.svg         # 可重現的封面來源
public/images/exam-covers/{slug}.png   # 1600×1000 列表封面
```

同步清單（比照 `architecture.md` 的 registry relationships）：
`src/content/exam/{slug}.md`、`src/exam/interactiveRegistry.ts`、
`src/components/exam/ExamInteractiveStage.tsx`、封面 SVG／PNG 與 frontmatter `coverImage`。
`registry.sync.test.ts` 要加上 exam 的對應斷言。

## Exam 封面

公開 Exam 必須有靜態封面，沿用 Explore 的生成方式與 16:10 卡片比例：

```text
scripts/exam-covers/{slug}.svg
    -> npm run covers:exam
    -> public/images/exam-covers/{slug}.png
    -> coverImage: /images/exam-covers/{slug}.png
```

- SVG 與 PNG 固定為 1600×1000；深色背景、金色主體，最多一種輔助色。
- 封面只保留題目的核心數學關係，不放題目文字、答案、控制項或完整舞台 UI。
- 主體放在中央安全區，縮至 375px 寬仍能辨識，並與相鄰 Exam 卡片一起檢查。
- 發布前執行 `npm run audit:exam-covers`，確認來源、PNG、尺寸與 frontmatter 完整同步。

## 3D 題目的技術決定

`#3 歪斜線距離` 與 `#4 旋轉體體積` 原構想寫 three.js。**不引入 three.js**：
現有 `CurveModule.sample()` 回傳 2D `CurvePoint[]`，縮圖管線與 `src/systems/rendering/*`
都建立在這個契約上，加一個 WebGL 場景等於開第二套渲染世界。

改用 p5 2D + 自寫 3D→2D 正交投影（`project3d(x,y,z) -> {x,y}` + 拖曳控制 yaw/pitch），
與 `space-vectors-planes-lines` 系列共用同一組投影工具。旋轉體用投影後的線框
（母線 × n 條經線）表現掃掠，切片數滑桿疊圓盤，效果足夠且縮圖能直接沿用。

投影工具沿用既有的 `src/curve/projection3d.ts`，供 exam 與空間向量 works 共用；
場景骨架沿用 `src/systems/rendering/scene3d.ts`。

## 首批五題

| # | slug | 來源 | 單元 | 核心觀念 | 形式 | 難度 |
|---|------|------|------|----------|------|------|
| E1 | `gsat-112-rotation-composition` | 112 學測數A 多選11 | 矩陣與線性變換 | 旋轉與鏡射矩陣、反矩陣、變換合成 | p5 2D，並排比較旋轉／鏡射的合成矩陣與圖形方向 | 中偏易 |
| E2 | `gsat-112-sinusoid-superposition` | 112 學測數A 多選12 | 三角函數圖形 | 疊合公式、對稱軸 f(a−x)=f(a+x)、半角 | p5 2D，a/b 滑桿即時疊合 + 對稱軸虛線 + 平移動畫 | 難 |
| E3 | `gsat-112-skew-line-distance` | 112 學測數A 選填17 | 空間向量 | 外積求公垂向量、投影長 \|AB·n\|/\|n\| | p5 2D + 自寫投影，拖曳視角，動態公垂線段 | 高 |
| E4 | `ast-114-solid-of-revolution` | 114 分科數甲非選17 | 積分應用 | 圓盤法 V=π∫f(x)²dx、黎曼和 | p5 2D + 投影線框，掃掠動畫 + 切片數 n 滑桿 | 高 |
| E5 | `ast-113-geometric-distribution` | 113 分科數甲 多選4 | 機率分佈 | 幾何分佈 P(X=n)=0.9ⁿ⁻¹·0.1、無窮級數、大數法則 | Monte Carlo，一萬次直方圖累積 + 均值收斂折線 | 中 |

選題理由（答對率／鑑別度依據）記在各自的 `.md` 內文「為什麼會錯」段落，附 `analysisUrl`。

E2 與既有三角疊合系列、E5 與機率／數列級數系列、E3 與空間向量系列
都應該互相 `relatedExplore` / `relatedWorks` 對接。

## 實作順序

1. ~~**基礎建設**：collection schema、`/exam` 兩個路由、ExamCard、`new-exam.mjs`、封鎖機制。~~
   ✅ 2026-07-19 完成。E1 內容骨架已可在 dev 預覽，`npm run build` 不產出 `/exam`。
   （Nav 條目與 registry sync 測試留到有互動、要公開時再加。）
2. ~~**E1**：純 2D、觀念最集中，當成集合的樣板頁（文案結構、互動節奏、控制項位置都在這頁定型）。~~
   ✅ 2026-07-24 完成。以官方原卷校正為 A/B 旋轉、C/D 鏡射，建立 Exam registry、互動舞台與 E1 樣板。
3. ~~**E2、E5**：可沿用既有渲染工具，成本最低。~~
   ✅ 2026-07-24 完成。E2 加入係數疊合、相位平移與對稱軸；E5 加入可重現的一萬次幾何分佈模擬與均值收斂。
4. ~~**`projection3d.ts`**：抽出投影工具。~~
   ✅ 既有 `src/curve/projection3d.ts`、`scene3d.ts` 與 `useOrbitViewP5` 已是唯一共用管線，不另建第二份。
5. ~~**E3、E4**：3D 題，最後做。~~
   ✅ 2026-07-24 完成。E3 以可旋轉公垂線拆解三個正交分量；E4 以線框掃掠與圓盤中點和連結積分。

## Exam 上線審查 Gate（每題必走）

任何 Exam 在改成 `draft: false` 或移入公開路由前，都必須完成以下審查。任一項未通過就不得上線；
修正後要重新跑完整 Gate，不能只重測修改處。

### 1. 題源、版權與高中範圍

- [ ] `sourceUrl` 可開啟且指向大考中心原卷，`analysisUrl` 可支持「為什麼會錯」的敘述
- [ ] 題意為改寫，未整段轉載題目、選項或試卷圖檔
- [ ] 學生可見的定義、公式、符號與推導只使用該考科的高中數學；投影、渲染等內部實作不能成為理解前提
- [ ] 由只具高中數學知識的審查者從「先想一想」開始閱讀，能說明圖形變化、公式與答案的關係
- [ ] `relatedExplore` / `relatedWorks` 的 slug 都已發布（非 draft）

### 2. 互動與可讀性

- [ ] 舞台先指出常見誤解，再讓控制項直接改變對應的數學量
- [ ] 原題答案與關鍵量保留精確值；小數只能放在 `≈` 後，不能取代根式、分數或 π
- [ ] 圖形標籤、顏色、公式、控制項數值與內文使用同一組符號，沒有互相矛盾
- [ ] Canvas 有描述內容的 `role="img"`／`aria-label`，所有滑桿與按鈕都有可存取名稱，動態答案使用 `aria-live`
- [ ] 桌面版與 390×844 手機版都沒有水平溢位，視覺舞台先於控制區，文字與標籤不重疊
- [ ] 逐一操作滑桿、按鈕、拖曳與重播；畫面會更新，瀏覽器 console 沒有錯誤或警告

### 3. 程式與內容驗證

- [ ] 純數學邏輯至少測試官方答案與每個非平凡分支／邊界
- [ ] Exam content、interactive registry 與 `ExamInteractiveStage` 的 slug 完全同步
- [ ] 列表篩選 `subject` 選項與實際條目一致
- [ ] 以下指令全部成功：

```bash
npm run typecheck
npm test
npm run audit:integration
npm run audit:content
npm run audit:exam-covers
npm run test:content-audit
npm run build
```

### 4. 公開面與封鎖驗證

- [ ] 新題維持 `draft: true` 時，production build 不產出該 slug；改為 `draft: false` 後才出現在列表與 sitemap
- [ ] `scripts/exam-covers/{slug}.svg`、生成的 1600×1000 PNG 與 `coverImage` 路徑一致，且縮至 375px 仍清楚
- [ ] `/exam` 路由位於 `src/pages/exam/`，頁面沒有 `noindex`，Nav 與 Footer 都有入口
- [ ] 公開 `/exam` 列表看得到該題，卡片可點入，`/exam/[slug]` 直接開啟為 200
- [ ] 原卷、解析、相關 Explore 與 Works 連結都能從公開頁實際點開

### 5. 獨立複審

- [ ] 實作者完成修正與上述驗證後，再進行一次不依賴原實作假設的 code review
- [ ] 複審重新核對數學、學生可讀性、無障礙、手機版與正式封鎖；所有 finding 關閉後才可上線
