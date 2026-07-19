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
