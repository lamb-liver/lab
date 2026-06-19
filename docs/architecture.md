# Architecture

This document is the system map for AI agents and maintainers. It does not replace the canonical runtime code or the domain specifications linked from [`AGENTS.md`](AGENTS.md).

## Runtime Truth

`src/` is the final authority. When Markdown and implementation disagree, inspect the implementation first, then update the stale document if the task includes documentation cleanup.

## Main Systems

| System | Owns | Canonical detail |
|--------|------|------------------|
| Works content | `src/content/works/*.md` | `textstyle.md` |
| Explore content | `src/content/explore/*.md` | `textstyle.md` |
| Site shell UX | Astro layouts, list filter, nav/footer | `site-ux.md` |
| Work geometry modules | `src/curve/modules/*` | `p5toreact.md` |
| Work runtime mounting | `src/components/works/*CurveRoot.tsx`, `WorkInteractiveStage.tsx` | `p5toreact.md`, `reactkey.md` |
| Shared rendering | `src/systems/rendering/*` | `art.md`, `workart.md`, `exploreart.md`, `p5toreact.md` |
| Work thumbnails | `src/lib/curveThumbnail.ts`, `src/curve/registry.ts` | `workart.md`, `p5toreact.md` |
| Explore interactives | `src/explore/*`, `src/components/explore/*ExploreRoot.tsx` | `exploreart.md`, `p5toreact.md` |

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

## Stable Boundaries

- Do not move p5 or React dependencies into `src/curve/modules/*`.
- Do not make renderers read React state directly.
- Do not route Explore interactives through the Works portal model.
- Do not replace established glow, grid, reveal, or thumbnail behavior for one-off convenience.
- Add abstractions only when they remove real duplication or match an existing local pattern.

## Historical Documents

Thumbnail implementation history is not a runtime contract. The active thumbnail contract lives in `workart.md`, `p5toreact.md`, and `src/lib/curveThumbnail.ts`.
