# Morph 曲線：React × p5 架構契約（reactkey）

> Agent / 維護者用：**決策與契約**，不是 bug 日誌。  
> 適用：`useMorphCurveP5` 路徑（Lissajous、Harmonograph、Spirograph）。  
> 整合總覽見 [`p5toreact.md`](p5toreact.md)；Works 視覺 reveal 語意見 [`workart.md`](workart.md)。

---

## 模組職責邊界

| 模組 | 職責 | 禁止 |
|------|------|------|
| `src/curve/morphPathCache.ts` | `createMorphPathCache`；`toFixed(4)` key 重用點列 | 幀推進、animation、React ref |
| `src/curve/morphFrame.ts` | `getMorphDisplayPoints`、`executeMorphDrawFrame` | React、ref 解引用、DOM |
| `src/components/curve/useMorphCurveP5.ts` | ref 生命週期、`patchTargetParams`、p5 draw wiring | 把 ref shape 傳進 `morphFrame` |
| `src/components/curve/useP5CanvasHost.ts` | p5 instance 生命週期；`drawRef` 解引用 | 在 sketch 閉包捕獲 stale `draw` |
| `src/components/works/*CurveRoot.tsx` | UI state；`patchTargetParams` + `setTargetParams` | 僅靠 `useEffect` 更新 target ref |

**依賴方向**：`*CurveRoot` → `useMorphCurveP5` → `morphFrame` → `morphPathCache` / `CurveModule`。  
`morphFrame` 可在 Node.js 靜態生成重用（零 React）。

---

## `morphPathCache.ts`

- 僅負責「參數 key 不變時重用 `module.sample` 結果」。
- Key 為 `Object.keys(params).sort()` + 各值 `toFixed(4)`。
- **連續 lerp 參數**（δ、d 等）會在同一 bucket 內碰撞 → **不可**作為省略 `cacheStrategy` 模組的主採樣路徑。

---

## `morphFrame.ts`

純函式，無 React 依賴。

```ts
// 同幀：先 step，再依 nextState.params 採樣
executeMorphDrawFrame(module, cache, animState, targetParams, sampleStep, stepAnimation, revealSpeed)
```

- `getMorphDisplayPoints`：省略 `cacheStrategy` 或 `kind === 'none'` → 直接 `module.sample()`；否則 `cache.getPoints()`。
- 接受 `stepAnimation` **函式值**，不接受 `{ current: fn }`（ref 解引用在 hook 層）。

---

## 省略 `cacheStrategy` 的語意

模組：`harmonograph`、`lissajous`、`spirograph`（連續 morph 參數每幀變化）。

| 宣告 | 執行 |
|------|------|
| 省略 `cacheStrategy` | **每幀** `module.sample(anim.params)` |

`createMorphPathCache` 仍可存在於 hook 內，但省略 `cacheStrategy` 的模組**不得**依賴其點列作為顯示來源。

對照：`rose` 用 `createCurveCache` + `integerBlend`（`CurveWorkRoot` 路徑，非本文件）。

---

## `useMorphCurveP5`

### `patchTargetParams`

```ts
const next = { ...targetParamsRef.current, ...patch };
targetParamsRef.current = next;
return next; // 供 setTargetParams(next)
```

**契約**：

- 僅在 **urgent** DOM 事件 handler 呼叫（`onChange` / `onInput` / `onClick`）。
- **禁止**包在 `startTransition` 內（全 repo 目前無 `useTransition`，新增 morph 曲線時維持此限制）。
- Caller：`setTargetParams(patchTargetParams({ d: value }))` 或 `commitTarget({ d })` 包一層。

### `targetParamsRef` 雙重寫入

| 路徑 | 時機 | 用途 |
|------|------|------|
| `patchTargetParams` | 事件 handler，**setState 前** | 主路徑；p5 rAF 下一幀讀到新 target |
| `targetParamsRef.current = targetParams` | render body | React commit 後 fallback |

不可只依賴 `useEffect` 同步 target（比 p5 draw 晚一幀）。

### `stepAnimationRef` 與 draw

```ts
// draw 內 — 每幀解引用，勿捕獲 closure
stepAnimationRef.current
targetParamsRef.current
```

`useCallback(draw, [module, sampleStep, revealSpeed])` **不含** `stepAnimation`；最新 step 經 ref + `useEffect` 更新。

### 其他 ref（同模式）

`onRevealPctChangeRef`、`smoothSyncRef`：`useEffect` 同步，draw 內讀 `.current`。

---

## `useP5CanvasHost`

p5 sketch 在 mount 時建立一次；`p.draw` **不可**閉包捕獲初始 `draw`。

```ts
const drawRef = useRef(draw);
useEffect(() => { drawRef.current = draw; }, [draw]);

p.draw = () => drawRef.current(p);
```

`useMorphCurveP5` 傳 `[draw]` 為 deps → `draw`  identity 變時 sketch 不重 boot，但每幀走最新 `drawRef`。

---

## Reveal（設計決策）

- `revealProgress` ∈ $[0, 1]$，**比例**非弧長。
- `byArcLength`：`threshold = points.at(-1).arcLength × revealProgress`（每幀依**當前**點列）。
- 連續參數 morph 中改 shape **不** reset reveal → 可能視覺跳變；若產品要消除，在 `stepXxxAnimation` 對特定參數 reset（離 discrete 參數如 a/b 已如此）。

---

## 新增 morph 曲線檢查

- [ ] 省略 `cacheStrategy`
- [ ] `*CurveRoot` 用 `useMorphCurveP5` + 專用 `stepXxxAnimation`
- [ ] 滑桿：`patchTargetParams` → `setTargetParams`（urgent handler）
- [ ] draw 走 `executeMorphDrawFrame`；step / sample 同幀
- [ ] 測試：`morphFrame.test.ts`（採樣、不變量）+ `useMorphCurveP5.draw.test.ts`（ref 解引用契約）

---

## 測試應覆蓋的契約

| 契約 | 檔案 |
|------|------|
| `none` → 每次 `sample()` | `morphFrame.test.ts` |
| 不同 lerp 參數 → 不同幾何（弧長 / 點數） | 同上 |
| draw 呼叫點解引用 `stepAnimationRef.current` | `useMorphCurveP5.draw.test.ts` |
| `morphPathCache` toFixed 碰撞（說明為何 none bypass） | `morphPathCache.test.ts` |

---

## 相關文件

| 文件 | 內容 |
|------|------|
| [`p5toreact.md`](p5toreact.md) | 目錄、Harmonograph 參數表、檢查清單 |
| [`workart.md`](workart.md) | Works glow、reveal 視覺層級 |
| [`README.md`](README.md) | 專案結構、`morphFrame` / `morphPathCache` 路徑 |

---

## 本次縮圖改造問題與決策（2026-05）

| 問題 | 影響 | 決策 |
|------|------|------|
| `CurveModule.sample()` 既有簽名只回傳 `CurvePoint[]` | 無法表達多幾何分支（會被硬接成鬼線） | 擴充 `SampleOptions.purpose` + `ThumbnailSpec(paths[])`；`curveThumbnail` 做 normalize 以維持向下相容 |
| `fitToView` 以所有 path 算 bbox | ghost / 輔助層把主體壓扁 | 新增 `excludeFromBbox`，僅參與繪製不參與定框 |
| 空 path 仍可能進入 SVG path builder | 可能出現 `first` 為 `undefined` 的風險 | `fitToView` 先過濾 `points.length === 0` |
| standing-wave 規格草稿曾寫 `t = π/(2ω)` | 會得到 `cos(π/2)=0` 平線 | 縮圖時間固定 `t=0`（`cos(0)=1` 振幅最大） |
| chladni 既有縮圖採樣是掃描零交叉線 | 非互動頁粒子沉積視覺 | 新增固定 seed 粒子雲採樣（>=2000 點） |
| IFS 既有縮圖步距過大 | 點數不足，不符規格下限 | thumbnail 改為 `iteration=6000, stride=1`（>=5000 點） |
| PRNG 分散在單一模組 | 難共用、易重複實作 | 抽出 `src/curve/prng.ts`（`mulberry32`）供 chladni / IFS 共用 |
| catenary bbox 是否包含 rope | 影響 framing 與互動頁一致性 | 保留 rope 參與 bbox（ghost 排除），對齊 `renderCatenaryScene` 的 framing 邏輯 |

**補充**：`interference-fringes` 的 thumbnail 輔助函式目前位於 `index.ts`（非 `geometry.ts`），功能正確但可測性較弱；下一輪可搬遷以利幾何單測。
