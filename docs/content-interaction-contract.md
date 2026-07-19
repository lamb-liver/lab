# Content ↔ Interaction Contract

`## 互動說明` 描述的控制項，必須真的存在於頁面上。

這份文件記錄這個契約、強制它的閘門，以及新增例外時的規矩。寫作風格規則在
`textstyle.md` §5／§7／§8；本文只談「文案與實作是否一致」。

## 為什麼需要

2026-07-19 的一次普查發現：18 篇已上線 explore 有 5 篇的 `## 互動說明` 描述了介面上
不存在的控制項。最嚴重的一篇（`exponential-logarithm`）列了 4 個並列模式，實際只有 3 個；
其中「對數尺度」根本不是模式，而是第一個模式裡的座標切換鈕，還跟《對數尺度》那件作品同名。
`probability-statistics` 則把「條件機率」模式寫成「貝氏定理」。

這類漂移現有閘門都抓不到：`audit:content` 只驗 frontmatter 與連結，smoke test 只驗互動有掛載。
讀者卻會照著文案在畫面上找一個不存在的按鈕。

## 契約

`## 互動說明` 每一條的**粗體標籤**若指涉具名控制項，讀者必須能在頁面上找到它。

- **標籤要用讀者看得到的字**。用按鈕上的文字，不要用程式內部的 mode 名稱、
  型別值或側欄區塊標題。這三者經常不一樣：`matrix-linear-transform` 的
  `modeTitle()` 回傳「反函數與座標」，但按鈕寫的是「指數與對數」。
- **面板區塊不是控制項**。「狀態讀數」「統計區」「主畫面」描述的是版面，不是讀者能操作的東西，
  不該當粗體標籤（`textstyle.md` §5 已禁止工程名詞）。
- **Works 允許畫面元素導讀**。works 的 `## 互動說明` 可以有「黃金矩形標示」「隨機投針動畫」
  這類描述畫布內容的條目。判準見下方「檢查範圍」。

## 閘門

| 指令 | 範圍 |
|------|------|
| `npm run audit:explore-controls [-- slug,slug]` | 全部 explore 互動頁 |
| `npm run audit:work-controls [-- slug,slug]` | 已發布的 works 互動頁 |

`validate:changed` 會在下列檔案變動時自動選中對應頁：`src/content/{explore,works}/*.md`、
`*ExploreRoot.tsx`、work root／hook，以及它們相依的 renderer 與 geometry。

實作在 `tests/explore-controls.spec.ts`、`tests/work-controls.spec.ts`，
共用 `tests/helpers/controlLabels.ts`。

### 檢查範圍

- **Explore**：所有粗體標籤都檢查。
- **Works**：只檢查「帶符號 token」的標籤（拉丁字母／希臘字母／下標），例如「花瓣數 k」「階數 n」。
  純中文敘述（「黃金矩形標示」）視為畫面導讀放行；以「拖動／拖曳／點擊」開頭的是畫布手勢，同樣放行。
  這是刻意的取捨：works 大量依賴畫布拖曳與畫面元素，全面檢查的雜訊會蓋過訊號。
- **草稿不檢查**。draft content 描述的是「打算做成什麼」，此時模組通常還是佔位幾何。

### 比對規則

標籤與控制項採一對一配對，每個標籤必須配到專屬的控制項。這一點很重要：
早期版本用 `some()`，結果「貝氏定理」靠共用的「定理」兩字對上「中央極限定理」而被放行，
即使介面上根本沒有貝氏定理這個模式。

比對前會正規化 LaTeX：`$r_1,\theta_1$` → `r₁,θ₁`，才對得上介面的「Z₁ 模長 r₁」。

## 新增例外

畫布內的互動沒有 DOM 節點，檢查掃不到。這類條目寫進 spec 的 `canvasOnlyInteractions`，
**但必須先在實作裡找到那段程式碼**，並把行為寫在註解裡：

```ts
// useInverseFunctionReflectionP5.ts: draggingPointRef + p.mousePressed
'inverse-function-reflection': ['動點 $P$'],
```

不要因為檢查紅了就加白名單。先確認那個互動真的存在。

## 已知未解

- `taylor-polynomial-approximation` 的模組 schema 有 `{ key: 'a', label: '展開中心 a' }`，
  但該頁用客製 hook root，不吃 module 的 `paramSchema`，所以介面上沒有這個滑桿。
  目前文案已不再宣稱它。要補控制項需要動互動。
- 站內「棣美弗」（介面）與「棣莫弗」（維基連結、`binomial-to-normal`）並存，尚未統一。

## 相關文件

- `textstyle.md` — `## 互動說明` 的寫作格式與用字
- `frontend-validation.md` — 驗證順序，以及 p5 驅動介面的截圖規則
- `exploreplan.md` — explore 與 works 的定位分工
