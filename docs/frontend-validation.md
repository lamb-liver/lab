# Frontend Validation

This project follows a fixed frontend verification order:

1. Content audit
2. Test
3. Build
4. DOM verification when `--url` is provided
5. Screenshot only when visual evidence is needed

## Command

```bash
npm run validate:frontend -- --url http://127.0.0.1:4321/
```

Use the changed route or preview URL instead of the default route when the change is route-specific.

## DOM Verification

DOM verification is part of the default gate. It should prove the changed user-facing surface rendered and behaved correctly.

Check at least:

- The target route loads.
- The main changed UI exists in the DOM.
- Critical text, controls, links, images, or canvases are present.
- The primary interaction still works if interaction changed.
- There are no relevant console errors, hydration failures, or empty rendered states.

The wrapper uses Playwright automatically when the project has it installed. If Playwright is not installed, verify DOM through a browser tool and report the route plus checked elements/interactions.

## Screenshot Policy

Do not take screenshots by default.

Use `--screenshot` only when any of these are true:

- Visual layout, spacing, typography, color, animation, canvas, image, or responsive behavior changed.
- The bug report is visual and needs before/after evidence.
- The change targets mobile/tablet/desktop layout.
- DOM assertions cannot prove the user-facing result.
- The reviewer explicitly asks for screenshot evidence.

Examples:

- Metadata or data-only change: audit/test/build/DOM, screenshot skipped.
- Button/form behavior: audit/test/build/DOM, screenshot only if appearance changed.
- CSS, chart, canvas, responsive layout, hero, image, or visual polish: audit/test/build/DOM plus screenshot.

## p5 驅動的介面：截圖是必要的，不是可選的

有些頁面的側欄讀數由 p5 的 draw loop 推動，而不是直接來自 React state
（`matrix-linear-transform`、`exponential-logarithm` 的狀態區都是這樣：
draw 每隔 `SIDEBAR_UPDATE_INTERVAL_MS` 呼叫一次 `setSidebar`）。

瀏覽器在沒有實際繪製時會節流 `requestAnimationFrame`。**只用 JavaScript 求值而不觸發繪製時，
draw loop 不會跑**，於是：

- 側欄讀數停在初始值，看起來像「切換模式沒有反應」
- `canvas.getContext('2d').getImageData()` 讀回全黑，看起來像「畫布沒有內容」

2026-07-19 就因此誤判 `matrix-linear-transform` 有 bug 並回報出去。實際上一截圖強制繪製，
模式切換、矩陣讀數、AB／BA 並列全部正常。

規則：

- 驗證 p5 驅動的狀態時，**先截圖再下結論**。截圖會強制一次繪製。
- 不要只根據 DOM 文字或 `getImageData` 就宣告 canvas 頁面有 bug。
- 純 React state 的讀數（值隨 props 改變而更新）不受影響，DOM 讀取可信。
- 若 DOM 與截圖不一致，以截圖為準，並懷疑自己的驗證方式而不是產品程式碼。

## 自動驗證 canvas 頁面的四個陷阱

2026-07-21 為了確認觸控與 RWD，寫了四版掃描腳本，**前三版都先報出假缺陷**。
下次要寫類似工具時直接用這裡的結論，不要重走一遍。

### 1. 合成事件不是可信任事件

`new MouseEvent(...)` / `new TouchEvent(...)` 的 `isTrusted` 為 false，p5 不見得會處理。
結果會自相矛盾（有接觸控的頁面顯示失敗、沒接的顯示成功）。

用真實輸入：Playwright 的 `page.mouse.*`，觸控用 CDP 的 `Input.dispatchTouchEvent`。
但要知道 CDP 觸控**繞過瀏覽器的手勢仲裁**，所以測不出 `touch-action` 造成的接管——
那一項只能靠讀 CSS 與程式碼判斷。

### 2. 畫布像素數不能跨頁面比較

同一個門檻套全站一定會誤判：`rose-curve` 是黑底一條細金線，`cross-product-geometry`
是填色平行四邊形，亮像素數差兩個數量級。用像素數判斷「畫布是否空白」只在同一頁前後比較時有效。

**更可靠的訊號是側欄讀數（DOM 文字）**：動畫沉澱後是確定值，且正是使用者實際會讀的東西。

### 3. 動畫式畫布要取多次取樣的最大值

`catalan-numbers` 的 `reveal` 每幀 +0.035，一個週期約 4 秒。單次取樣抓到低 reveal 的瞬間，
會看到「幾乎空白」。連續取樣 12 次後是 55 → 979，完全正常。

有 reveal / 動畫的頁面：取樣多次取 max，或改用 DOM 讀數。

### 4. 元素溢出要看是否被裁切

`getBoundingClientRect().right > innerWidth` 會抓到 KaTeX 根號的 SVG
（`viewBox="0 0 400000 1944"`，父層 `overflow: hidden` 完全裁切）。
判斷橫向溢出請用 `document.body.scrollWidth > window.innerWidth`。

## 手機與平板檢查

桌機全綠不代表沒事。2026-07-21 有兩個缺陷只在 375px 下出現：畫布被側欄擠成 150px、
畫布上的讀數換行後與下一行重疊。**上線前必須在 375px 實際看過截圖**，檢查：

- 畫布沒有被側欄擠壓（explore 兩欄要堆疊）
- 無橫向捲動
- 畫布上的文字換行後不重疊

Explore 的兩欄堆疊要在**該 slug 自己的 CSS** 寫 `@media (max-width: 768px)`——
`explore-stage.css` 沒有共用的 RWD，漏寫就會維持兩欄。

## 文案與控制項一致性

`## 互動說明` 的粗體標籤必須對應真實存在的控制項。這條由
`audit:explore-controls` 與 `audit:work-controls` 強制，契約與例外規則見
`content-interaction-contract.md`。

## Report Format

```text
Validation:
- content audit: pass (`npm run audit:content`)
- test: pass (`npm test`)
- build: pass (`npm run build`)
- DOM: pass (`http://127.0.0.1:4321/`, checked target elements/interactions)
- screenshot: skipped, DOM evidence was sufficient
```

If screenshots were needed:

```text
Validation:
- content audit: pass (`npm run audit:content`)
- test: pass (`npm test`)
- build: pass (`npm run build`)
- DOM: pass (`http://127.0.0.1:4321/`, checked target elements/interactions)
- screenshot: pass (visual layout changed)
```
