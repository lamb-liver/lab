# 站點 UX 規格（Site UX）

> 適用範圍：全站 Astro 殼層（導覽、列表、詳情頂部、首頁、Footer、a11y token）。  
> **不含** p5 畫布渲染、CurveModule 幾何、Explore 主視覺構圖——那些見 [`art.md`](art.md)、[`workart.md`](workart.md)、[`exploreart.md`](exploreart.md)。  
> 互動掛載與 portal 契約見 [`p5toreact.md`](p5toreact.md)。

當文件與 `src/` 衝突時，以 runtime 為準；本文件描述應維持的 UX 契約。

---

## 1. 設計決策（已確認）

| 議題 | 決策 | 不做 |
|------|------|------|
| Works vs Explore 詳情版型 | **Works 互動優先**（舞台在 prose 前）；Explore **標題優先** | 不強行統一兩者資訊順序 |
| Works 標題 | 舞台**上方** compact header（`h1` + tags） | 不在 prose 區重複大標 |
| 上下篇 | label 為 **較早一篇 / 較新一篇** | 不改 `getCollectionPagerNeighbors` 排序 |
| Explore 複雜頁（vectors 等） | 統一觸控區即可 | Phase 3 不做 bottom sheet / tab 重構 |
| Breadcrumb vs 返回 | **並存、分工明確**（見 §3） | 不以 breadcrumb 取代快速返回 |

---

## 2. 斷點與共用 token

定義於 `src/styles/tokens.css`：

| Token / 斷點 | 值 | 用途 |
|--------------|-----|------|
| `--touch-target-min` | `2.75rem`（44px） | filter 按鈕、range 滑桿、手機選單、Explore mode 按鈕 |
| `--nav-height` | `64px` | sticky nav、Explore sidebar offset |
| 手機 | `max-width: 767px` | 手機選單、filter 橫滑、Footer 堆疊、搜尋框 16px |
| 平板 / 舞台 | `max-width: 1023px` / `min-width: 1024px` | Works 舞台單欄、控制 accordion；與全站 tablet 切換一致 |
| 首頁精選 grid | `auto-fill` + `minmax(min(100%, 320px), 1fr)` | 不另設 1100px 斷點，避免 1024–1100px 與 nav/舞台 desktop 混搭不同 grid 規則 |

Explore 共用 CSS token（`src/styles/components/explore/explore-toolbar.css`）：

- `--explore-accent: rgb(212, 184, 122)`
- `--explore-toolbar-bg`、`--explore-mode-font-size`、`--explore-mode-pad`

---

## 3. 詳情頁頂部導覽

### 3.1 分工

| 元件 | 角色 | 實作 |
|------|------|------|
| **Breadcrumb** | 脈絡導覽；可點任一上層 | `Breadcrumb.astro` + `.breadcrumb` |
| **返回連結** | 快速操作；一鍵回列表 | `.back-link.back-link--top` |

兩者包在 **`.detail-top-nav`**（`src/styles/components/breadcrumb.css`）：

- **手機**：breadcrumb 上、返回下（皆左對齊）
- **桌面（≥768px）**：同一列；breadcrumb 左（`flex: 1`）、返回右（細框快速按鈕）

Works / Explore 詳情皆使用此 pattern。JSON-LD `BreadcrumbList` 維持在 `[slug].astro` structured data，與可見 breadcrumb 一致。

### 3.2 Works 詳情資訊順序

```text
.detail-top-nav          ← breadcrumb + 返回
.work-detail__header    ← compact h1 + tags（單一 h1）
.work-detail__stage      ← canvas + 控制（互動優先）
.container.work-detail   ← prose + pager + 底部返回
```

Explore 詳情維持 **標題 → 互動 → prose**；頂部同樣有 `.detail-top-nav`。

---

## 4. Works 互動舞台

規格細節亦見 [`workart.md`](workart.md) §5、[`p5toreact.md`](p5toreact.md)「舞台佈局」。

### 4.1 桌面（≥1024px）

- `.work-detail__stage`：grid，canvas 左、`min(320px, 34vw)` 控制右
- `.controls-panel--stage`：`sticky` + `max-height: calc(100vh - var(--nav-height))`
- React `createPortal` → `#\{slug\}-controls`（`works/interactiveRegistry.ts`）

### 4.2 手機（<1024px）

- canvas 上、控制下（仍在 prose 之前）
- 控制區包在 `<details class="work-detail__controls">`：
  - `<summary>調整參數</summary>` + 收合時提示「點開後向下滑動」；展開後自動 `scrollIntoView` 至控制面板
  - canvas 下方手機專用滑動提示列；canvas 區 `touch-action: pan-y` 不攔截垂直捲動
  - **預設收合**，減少滑到 prose 前的垂直深度

### 4.3 Accordion 與 portal 安全

- `<details>` 收合只隱藏**視覺**；`<aside id="…">` **仍在 DOM**
- 參數初始值來自 React `module.defaultParams` / `useState`，**不**依賴 `<input>` 初值
- 桌面以 CSS 強制 `.controls-panel--stage { display: flex !important; }`，summary 隱藏
- Accordion open/close 由 `src/pages/works/[slug].astro` 的 `[data-work-controls]` script 管理；個別 `*CurveRoot` 不自行 `closest('details')` 或改 `details.open`。

### 4.4 控制面板分組

- **`CurveWorkRoot`（Rose 的通用 root 路徑）**：`meta` → `ParamControls` → `StatsPanel`；**不加**「參數」小標（單一群組，避免噪音）。
- **標準 `ParamControls`**：數值調整用 native range，且只保留一條更新路徑；不要用 wrapper 假軌道取代原生 track；按鈕只用於模式切換、重置、顯示開關等離散命令。
- **自訂 `*CurveRoot`**（含 `curve-work-mode-toggle`、多段控件）：當面板有 **≥2 個語意群組**（例如「模式」+「參數」、「顯示」+「播放」）時，用 `.controls-panel__section` + `.controls-panel__section-label` 分隔；樣式見 `work-detail.css`。
- 常見多群組作品：`LogisticBifurcationCurveRoot`、`TrigAngleIdentitiesCurveRoot`、`BaselProblemCurveRoot` 等（含多個 `curve-work-mode-toggle`）。

---

## 5. Explore 互動控件 CSS

> **適用範圍**：`explore-toolbar.css` / `explore-touch.css` 是 **toolbar 型** Explore（canvas 下工具列、或 mode 按鈕列）的共用 token，**不是**所有 Explore 詳情頁的唯一標準。  
> **新 Explore 優先**採 **stage + sidebar**（visual 左、控件右；手機 canvas 上、sidebar 下）——見 [`exploreart.md`](exploreart.md) §3.1、§3.3 Wave 等。僅在 layout 確實為 toolbar 時才對齊 §5.1 命名約定；sidebar 型主題寫主題 CSS，勿強改 toolbar 佈局。

Explore 詳情頁引入（`explore/[slug].astro`）：

| 檔案 | 職責 |
|------|------|
| `explore/explore-toolbar.css` | toolbar 間距、mode 按鈕字級/邊框、`--explore-accent` |
| `explore-touch.css` | mode 按鈕最小觸控區（≥44px） |

### 5.1 命名約定（D8，刻意零配置）

`explore-toolbar.css` 以 **attribute selector** 自動套用符合慣例的 class（specificity 等同 class）：

| 約定 | 範例 |
|------|------|
| class 以 `-explore__toolbar` **結尾** | `.fourier-explore__toolbar` |
| mode 按鈕含 `-explore__mode-btn` | `.fourier-explore__mode-btn` |
| 或 `<button class="…__mode">` | `.vectors-explore__mode` |

**優點**：新 Explore 只要遵守 BEM suffix 即繼承共用 token，無需改 Astro import。  
**代價**：某主題若要**刻意不同**樣式，須在該主題 CSS（於 `explore-toolbar.css` **之後**）用更具體 selector 覆寫，或**不要**使用上述 suffix。

檔案頂部 comment 與 [`exploreart.md`](exploreart.md) §3.1 為 canonical 說明；修改 selector 前必讀。

各 `*ExploreRoot` **保留** layout 專屬規則（如 wave sidebar grid）。**先選 layout 型態**（stage/sidebar vs toolbar），再決定是否沿用本節 token；sidebar 內的 mode 按鈕仍可共用 `explore-touch.css` 觸控區，但不代表要把控件移到 canvas 下方。

---

## 6. 列表頁（`/works`、`/explore`）

### 6.1 邏輯 vs DOM 分工

| 層 | 檔案 | 職責 |
|----|------|------|
| 純邏輯 | `src/lib/listFilter.ts` | tag/category 比對、grid 顯示計數、URL param、`clearListFilters` |
| 客戶端 | `ListSearchFilterScript.astro` | 搜尋、事件、filter 橫滑 fade、`ResizeObserver` |

**不要**在 `listFilter.ts` 讀 DOM；**不要**在 script 內重寫 filter 比對邏輯。

### 6.2 結果回饋

- `[data-filter-count]`：未篩選 → `共 N 篇` / `共 N 個主題`（Explore 用 `data-filter-count-unit="個主題"`）
- 有篩選 → `顯示 X / N 篇`
- 空結果：`[data-filter-empty]` + **清除篩選**（`data-filter-clear`）

### 6.3 手機 filter 橫滑

- `FilterBar` 外包 `.filter-scroll[data-filter-scroll]`
- ≤767px：橫向 scroll + scroll-snap；右側 **fade gradient**（`data-can-scroll-end="true"` 时显示）
- iOS 搜尋框：`list-search__input` 在 ≤767px 使用 `font-size: 1rem`（避免 focus 縮放）

---

## 7. 首頁與 Footer

### 7.1 首頁

- 精選 grid：`.home-featured-grid` 使用 `repeat(auto-fill, minmax(min(100%, 320px), 1fr))`，在約 ≤1024px 容器寬自然降為 2 欄；≤767px 強制 1 欄（`home.css`）。**不**使用獨立 1100px 斷點，以免與全站 1023/1024 行為不一致。
- `.home-section-header`：手機縱向堆疊標題與「查看全部 →」

### 7.2 Footer

- `.site-footer__nav`：作品集 / 主題導覽 / 關於（站內連結）
- 與頂部 `#site-nav-links` **文字可能相同**；Playwright 斷言 nav 連結時須 **限定 `#site-nav-links` 範圍**

---

## 8. 無障礙與動效

| 項目 | 行為 |
|------|------|
| `prefers-reduced-motion: reduce` | 關閉 `.page-enter` 淡入、`.interactive-loading` 動畫；Hero 不掛 p5（`HeroCanvas.tsx`）。**Phase 4**：補靜態 Hero 佔位（同尺寸、不動畫、不掛 p5），避免首頁 Hero 區空白 |
| `:focus-visible` | 全站 accent outline（`base.css`） |
| 手機選單 | `aria-expanded`、Escape 關閉、點外關閉（`Nav.astro`） |

---

## 9. 刻意延後（非現行規格）

- Hero reduced motion **靜態佔位**（金色幾何 SVG/CSS，維持 hero 高度）
- Skip link / 可見 TOC
- 上下篇依 tag 相鄰
- Explore vectors 等 **bottom sheet** 重構
- Works / Explore 詳情版型完全統一

---

## 10. 檔案對照

| UX 區塊 | 主要檔案 |
|---------|----------|
| Breadcrumb / detail-top-nav | `components/Breadcrumb.astro`, `styles/components/breadcrumb.css` |
| Works 舞台 | `pages/works/[slug].astro`, `styles/pages/work-detail.css` |
| Explore 殼層 | `pages/explore/[slug].astro`, `styles/pages/explore-detail.css` |
| 列表 filter | `lib/listFilter.ts`, `components/ListSearchFilterScript.astro`, `styles/components/filter.css` |
| 首頁 | `styles/pages/home.css` |
| Footer | `components/Footer.astro`, `styles/components/footer.css` |
| UX 回歸測試 | `tests/seo-ux.spec.ts` |

---

## 11. 驗收

修改站點 UX 後：

1. `npm run build`
2. `npm test` + `npm run test:seo-ux`
3. 目視：`/works/{slug}`（桌面 sticky + 手機 accordion）、`/works`、`/explore`、`/`、Footer
4. 若改 nav/footer 連結文案，同步檢查 `seo-ux.spec.ts` 是否需限定 `#site-nav-links`
