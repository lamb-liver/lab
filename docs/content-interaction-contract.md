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

### 接受的例外：控制項全為純中文的頁面

若一頁的**所有**控制項都是純中文（沒有符號可用），該頁就沒有標籤會被檢查，整頁跳過。
目前有 3 篇：`law-of-sines-cosines`、`pascals-triangle`、`regression-outlier-influence`。

**這是接受的狀態，不是待辦。** 它們的控制項本來就叫「正弦定理」「模」「槓桿」，
硬把符號塞進標籤只會讓文案變假；而站內也已決定不把既有英文介面詞中文化，
所以這個數字不會再往上跑。改動這三頁時自行核對介面即可。

`npm run audit:work-controls` 的輸出會顯示 skipped 數量。**3 是預期值**；
若變大，代表有新頁面掉進同一個盲區，值得看一眼。

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

- **兩道 content 稽核的覆蓋範圍不一致**：`scripts/audit-content.mjs`（CLI）已涵蓋 exam，
  但 `src/content/contentAudit.ts`（vitest）仍只讀 works 與 explore。exam 的章節結構不同
  （題意／為什麼會錯／觀察／互動怎麼看），要納入得先為它定義規則。exam 目前是單篇草稿且未公開，
  影響有限，但公開前必須補上。

## 教訓：找不到控制項，先確認它是不是畫布互動

`taylor-polynomial-approximation` 的模組 schema 有 `展開中心 a`，但該頁用客製 hook root
不吃 `paramSchema`，側欄也沒有這個滑桿，於是一度被判定為「文案宣稱不存在的控制項」而刪掉條目。

實際上它是**可以在圖上直接拖的**（`useTaylorPolynomialApproximationP5.ts` 的
`draggingRef` + `mousePressed`/`mouseDragged` + `onAChange`），頁面上也寫著
「拖動圖中的展開中心 a」。條目已復原，並登記為畫布互動。

刪掉文案之前，先在 hook 與 renderer 裡找過一遍。

## 名詞不一致時：先問台灣正體怎麼寫

對齊文案與介面時，方向**不是**「一律改文案去追介面」，也不是「一律照譯名表」。
最終依據是 `textstyle.md` §4 的總則——**台灣繁體常用譯名**。譯名表是它的整理，
表本身也可能寫錯。

實例：`complex-euler-formula` 的介面寫「棣美弗定理」，文案與維基連結錨文字寫「棣莫弗」。
處理過程錯了兩次才收斂：

1. 先把文案改成介面的寫法——沒查譯名表就對齊介面。
2. 查到譯名表寫「棣莫弗」，於是反過來改介面——把表當成最終依據。
3. 正解是「棣美弗」：台灣高中教材與正體慣用寫法。**譯名表那一列本身是錯的**，
   連同介面、文案、維基錨文字一起改。

維基外連的 URL 保持 `zh-tw` 原樣（路徑含簡體轉寫不影響），但錨文字用站內統一譯名。

## 相關文件

- `textstyle.md` — `## 互動說明` 的寫作格式與用字
- `frontend-validation.md` — 驗證順序，以及 p5 驅動介面的截圖規則
- `exploreplan.md` — explore 與 works 的定位分工
