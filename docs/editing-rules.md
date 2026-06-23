# Editing Rules

This document collects the editing principles that should guide AI-assisted changes. It is intentionally practical and short; canonical domain details remain in `art.md`, `workart.md`, `exploreart.md`, `p5toreact.md`, `reactkey.md`, and `textstyle.md`.

## Default Posture

- Make the smallest change that solves the task.
- Preserve existing architecture and naming unless the task is explicitly architectural.
- Avoid speculative abstractions.
- Prefer local helpers and established patterns over new frameworks or new systems.
- Do not refactor unrelated files while fixing a narrow issue.

## Rendering Changes

Before changing rendering code, identify which layer owns the behavior:

| Layer | Files | Rule |
|-------|-------|------|
| Geometry | `src/curve/modules/*`, `src/explore/*` | Keep p5 and React out of pure geometry modules. |
| Runtime lifecycle | `src/components/curve/*`, `src/components/works/*`, `src/components/explore/*` | Preserve p5 mount/unmount and ref synchronization contracts. |
| Renderer | `src/systems/rendering/*` | Render snapshots only; do not read React state. |
| Thumbnail | `src/lib/curveThumbnail.ts`, `src/curve/registry.ts` | Preserve build-time SVG generation and multi-path support. |

Do not rewrite glow, grid, visual hierarchy, or reveal semantics unless the task specifically asks for a visual system change. The visual authority starts at `art.md` and routes to `workart.md` or `exploreart.md`.

## Registry Changes

For a new interactive work, check:

- content Markdown exists in `src/content/works/`
- `src/curve/registry.ts` is updated
- `src/works/interactiveRegistry.ts` is updated
- `WorkInteractiveStage.tsx` maps the slug to a root component
- thumbnail behavior is valid for the slug
- smoke commands use the published route slug, not the module folder or React component suffix

For a new interactive explore page, check:

- content Markdown exists in `src/content/explore/`
- `src/explore/interactiveRegistry.ts` is updated
- `ExploreInteractiveStage.tsx` maps the slug to a root component
- `coverImage` is set only when an actual static cover exists
- Explore cover PNGs follow `exploreart.md` and keep their reproducible source files

## Content Changes

- Follow `textstyle.md`.
- Keep content reader-facing.
- Do not move implementation details such as cache strategy, lerp coefficients, or render passes into content Markdown.
- Use Traditional Chinese wording for public content.

## Work OG images (`sharp`)

- OG PNGs under `/og/works/*.png` are generated at **`astro build` only** (`src/lib/workOgImage.ts`, `src/pages/og/works/[slug].png.ts`). Production is static GitHub Pages (`dist/`); **no Node or `sharp` at request time**.
- `sharp` is a **devDependency** (libvips via `@img/sharp-*` optional binaries). CI/local build must run `npm ci` **with devDependencies** on a host that matches an installed platform package (today: `ubuntu-latest` x64 in `.github/workflows/deploy.yml`).
- Before changing deploy target, confirm the build still emits every OG file:
  - **Edge / serverless runtime** for on-the-fly OG: generally unsuitable unless you verify the provider’s OS/arch (arm64 vs x64, glibc vs musl) and bundle size limits.
  - **Docker**: base image arch must match `npm ci` (e.g. `linux/arm64` runner needs `@img/sharp-linux-arm64`, not only x64).
  - **`npm ci --omit=dev`**: will break OG generation; do not use on the build job.
- Pages with math in Markdown need `import 'katex/dist/katex.min.css'` on that route (removed from global CDN in `BaseLayout`).

## Validation Strategy

Use the narrowest reliable validation first:

- Pure geometry or utility change: run focused Vitest files when available.
- Registry or thumbnail change: run registry and thumbnail tests.
- Rendering lifecycle change: run focused hook tests, then manually inspect the affected page if practical.
- Cross-system change: run `npm test` and `npm run build`.

If a command cannot be run, state that clearly in the final response.

## Dev Runtime Recovery

If several React-backed work pages fail with `jsxDEV is not a function`, treat it as a Vite optimized-deps cache issue before editing source. Check `node_modules/.vite/deps/react_jsx-dev-runtime.js`; if it has a stale or empty `jsxDEV` export, run `npm run dev:recover` to clear Vite deps and restart Astro with `--force`.

## Review Checklist

- Does the change preserve the authority order in [`AGENTS.md`](AGENTS.md)?
- Did it avoid duplicating canonical rules into another file?
- Are Works and Explore boundaries still separate?
- Are registries synchronized?
- Did any deferred review item remain before marking a scan batch complete?
- Are thumbnails still generated at build time?
- Are renderers still snapshot-based?
