# Architecture

This document is the system map for AI agents and maintainers. It does not replace the canonical runtime code or the domain specifications linked from [`AGENTS.md`](AGENTS.md).

## Runtime Truth

`src/` is the final authority. When Markdown and implementation disagree, inspect the implementation first, then update the stale document if the task includes documentation cleanup.

## Main Systems

| System | Owns | Canonical detail |
|--------|------|------------------|
| Works content | `src/content/works/*.md` | `textstyle.md`, `content-interaction-contract.md` |
| Explore content | `src/content/explore/*.md` | `textstyle.md`, `content-interaction-contract.md` |
| Site shell UX | Astro layouts, list filter, nav/footer | `site-ux.md` |
| Work geometry modules | `src/curve/modules/*` | `p5toreact.md` |
| Work runtime mounting | `src/components/works/*CurveRoot.tsx`, `WorkInteractiveStage.tsx` | `p5toreact.md`, `reactkey.md` |
| Shared rendering | `src/systems/rendering/*` | `art.md`, `workart.md`, `exploreart.md`, `p5toreact.md` |
| Work thumbnails | `src/lib/curveThumbnail.ts`, `src/curve/registry.ts` | `workart.md`, `p5toreact.md` |
| Explore interactives | `src/explore/*`, `src/components/explore/*ExploreRoot.tsx` | `exploreart.md`, `p5toreact.md` |
| 3D 空間向量共用層 | `src/curve/projection3d.ts`, `src/systems/rendering/scene3d.ts`, `src/components/curve/useOrbitViewP5.ts` | 本文件下節 |

## Works Data Flow

```text
src/content/works/{slug}.md
    -> route /works/[slug]
    -> isWorkInteractive(slug)
    -> WorkInteractiveStage
    -> *CurveRoot
    -> p5 hook
    -> renderer snapshot
    -> src/systems/rendering/*
```

Geometry and rendering are intentionally separated:

```text
CurveModule.sample()
    -> CurvePoint[] or ThumbnailSpec
    -> runtime renderer or build-time thumbnail
```

For morph curves:

```text
React targetParams
    -> targetParamsRef
    -> p5 draw
    -> executeMorphDrawFrame
    -> module.sample(anim.params)
    -> renderFrame(p, snap, renderPreset)
```

The detailed lifecycle contract is in `reactkey.md`.

Both interactive stages code-split per slug: `rootBySlug` maps each slug to `lazy(() => import('./XxxRoot'))`, so a detail page downloads only its own root chunk plus shared chunks. p5 itself is loaded on demand inside `useRectP5CanvasHost`. Keep new registry entries in this lazy form; a static root import would pull that root into every page's stage bundle again.

## Explore Data Flow

Explore pages are separate from Works. They do not use `CurveModule`, `WorkInteractiveStage`, or the Works portal controls.

```text
src/content/explore/{slug}.md
    -> route /explore/[slug]
    -> isExploreInteractive(slug)
    -> ExploreInteractiveStage
    -> *ExploreRoot
    -> src/explore/{topic}/*
    -> src/systems/rendering/*
```

Explore list cards use static `coverImage` assets, not `curveThumbnail.ts`.

## Site Shell and List Filter

List and search UX is intentionally split:

```text
src/lib/listFilter.ts              # pure filter/count/URL helpers
src/components/ListSearchFilterScript.astro   # search + DOM events + scroll fade
src/pages/works/index.astro
src/pages/explore/index.astro
```

Detail pages use `Breadcrumb.astro` + `.detail-top-nav` for context navigation vs quick back links. Full contract: `site-ux.md`.

## Registry Relationships

Keep these synchronized when adding an interactive work:

- `src/content/works/{slug}.md`
- `src/curve/registry.ts` for thumbnail generation
- `src/works/interactiveRegistry.ts`
- `src/components/works/WorkInteractiveStage.tsx`

Keep these synchronized when adding an interactive explore page:

- `src/content/explore/{slug}.md`
- `src/explore/interactiveRegistry.ts`
- `src/components/explore/ExploreInteractiveStage.tsx`
- optional `public/images/explore-covers/*` cover image and frontmatter `coverImage`

## 3D 空間向量共用層

空間向量主題（1 篇 explore + 4 件 works）共用一條投影管線。要做新的 3D 頁面時從這裡接，
不要另外造一套。

| 檔案 | 職責 |
|------|------|
| `src/curve/projection3d.ts` | 純數學：`Vec3` 運算、正交投影、`directionFromAngles`、`planeBasis`／`planeQuad`、`formatVec3` |
| `src/systems/rendering/scene3d.ts` | 繪製骨架：layout、`screenOf`、`drawArrow`／`drawLabel`／`drawAxes`／`drawReadout` |
| `src/components/curve/useOrbitViewP5.ts` | 拖曳旋轉視角（含觸控）；`measure` 可覆寫，explore 舞台較寬要自己傳 |
| `src/components/curve/OrbitViewControls.tsx` | 視角 yaw／pitch 滑桿，提供不依賴手勢的操作路徑 |

**不引入 three.js。** `CurveModule.sample()` 的契約是回傳 2D `CurvePoint[]`，
縮圖管線（`curveThumbnail.ts`）建立在這個契約上；加一套 WebGL 場景等於開第二個渲染世界，
而縮圖、OG 圖與既有 renderer 都無法沿用。

`screenOf` 收 `ViewAngles` 而不是 params：呼叫端每幀算一次 `viewFromParams`，
不要讓每個投影點都重算角度轉換。

縮圖尺度要自己驗邊界：`BASE_CANVAS_SIZE / 2 = 300`，模組測試應涵蓋極端參數。
這一組有兩件在開發途中因尺度過大而超界（518、310），都是被測試擋下來的。

## Stable Boundaries

- Do not move p5 or React dependencies into `src/curve/modules/*`.
- Do not make renderers read React state directly.
- Do not route Explore interactives through the Works portal model.
- Do not replace established glow, grid, reveal, or thumbnail behavior for one-off convenience.
- Add abstractions only when they remove real duplication or match an existing local pattern.

## Historical Documents

Thumbnail implementation history is not a runtime contract. The active thumbnail contract lives in `workart.md`, `p5toreact.md`, and `src/lib/curveThumbnail.ts`.
