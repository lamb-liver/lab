# 視覺風格入口（Art System）

本文件是視覺規格入口。實際規則依頁面系統拆分：

| 系統 | 規格 |
|------|------|
| `/works` 作品、`CurveModule` runtime、作品縮圖 | [`workart.md`](workart.md) |
| `/explore` 視覺化頁、Explore 靜態封面 | [`exploreart.md`](exploreart.md) |
| 全站殼層 UX（導覽、列表、詳情頂部、a11y） | [`site-ux.md`](site-ux.md) |

當文件或假設衝突時，仍以 `src/` runtime code 為最終事實；本文件與子文件負責描述應維持的視覺語言。

## 共通原則

- 暗色畫布，背景接近 `rgb(10, 10, 10)`。
- 金色主線是主要識別，接近 `rgb(212, 184, 122)`。
- 曲線、解軌跡、主向量永遠比 guide、grid、projection、UI 更亮更粗。
- 不重做每個主題自己的 UI / glow / hierarchy；只替換 geometry 或主題構圖。
- 列表封面是概念入口，不是完整 UI 截圖，也不是 debug 視圖。
- Works runtime 線寬與 Explore 靜態封面線寬屬於不同輸出尺度，不互相套用。
- 互動控件最小觸控區 `--touch-target-min`（44px）；`prefers-reduced-motion` 時 Hero / loading / 頁面淡入降級。詳見 [`site-ux.md`](site-ux.md)。

## 閱讀路徑

- 新增或調整 Works：先讀 [`workart.md`](workart.md)，再讀 [`p5toreact.md`](p5toreact.md)。
- 新增或調整 Explore：先讀 [`exploreart.md`](exploreart.md)，再讀 [`p5toreact.md`](p5toreact.md)。
- 調整列表、導覽、詳情頂部、Footer：讀 [`site-ux.md`](site-ux.md)。
- Morph lifecycle / refs / identity：讀 [`reactkey.md`](reactkey.md)。
