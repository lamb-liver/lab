# Lab Release System

This document is the source checklist for creating the GitHub Project and Issues for the Lab release workflow.

## GitHub Project Fields

Use these fields for the Lab release Project:

- `type`: `bug` / `feature` / `content` / `audit` / `release`
- `project`: `lab`
- `priority`: `P0` / `P1` / `P2`
- `status`: `inbox` / `next` / `doing` / `blocked` / `done`
- `release`: `社團發布前`

## P0 Issues

### Create Lab release backlog

- type: `release`
- project: `lab`
- priority: `P0`
- status: `inbox`
- release: `社團發布前`

Done:

- GitHub Project exists.
- Project fields include `type / project / priority / status / release`.
- All Lab release-system issues are in the backlog.

### Implement audit:content base

- type: `audit`
- project: `lab`
- priority: `P0`
- status: `done`
- release: `社團發布前`

Done:

- `npm run audit:content` scans `src/content/works` and `src/content/explore`.
- Audit failures exit with code `1`.

### Audit frontmatter schema

- type: `audit`
- project: `lab`
- priority: `P0`
- status: `done`
- release: `社團發布前`

Done:

- Works require `title / description / tags / date / order / draft`.
- Explore requires `title / description / category / date / order / draft`.
- Explore categories are limited to `幾何 / 代數 / 統計 / 拓樸 / 分析`.

### Audit cover assets

- type: `audit`
- project: `lab`
- priority: `P0`
- status: `done`
- release: `社團發布前`

Done:

- Published Explore entries must define `coverImage`.
- The referenced public asset must exist.

### Audit draft/published relation

- type: `audit`
- project: `lab`
- priority: `P0`
- status: `done`
- release: `社團發布前`

Done:

- Published Explore entries cannot link to missing Works.
- Published Explore entries cannot link to draft Works.

### Audit placeholder/debug text

- type: `audit`
- project: `lab`
- priority: `P0`
- status: `done`
- release: `社團發布前`

Done:

- Published content fails when it contains `TODO`, `FIXME`, `placeholder`, `debug`, `lorem`, `待補`, `暫定`, or `測試用`.
- Draft content can still contain placeholders.

## P1 Issues

### Create new:work generator

- type: `feature`
- project: `lab`
- priority: `P1`
- status: `done`
- release: `社團發布前`

Done:

- `npm run new:work -- <slug>` creates `src/content/works/<slug>.md`.
- It creates `src/components/works/<PascalSlug>.tsx`.
- Generated content defaults to `draft: true`.

### Create new:explore generator

- type: `feature`
- project: `lab`
- priority: `P1`
- status: `done`
- release: `社團發布前`

Done:

- `npm run new:explore -- <slug>` creates `src/content/explore/<slug>.md`.
- Generated content defaults to `draft: true`.
- Terminal output reminds the editor to add a cover before publishing.

### Add registry guidance to generator

- type: `feature`
- project: `lab`
- priority: `P1`
- status: `done`
- release: `社團發布前`

Done:

- Generators do not edit registries automatically.
- Terminal output tells the editor to add registry wiring only when needed.

### Add generator tests

- type: `audit`
- project: `lab`
- priority: `P1`
- status: `done`
- release: `社團發布前`

Done:

- Tests cover slug validation, generated paths, default draft state, and duplicate-file protection.

### Integrate audit into validation flow

- type: `audit`
- project: `lab`
- priority: `P1`
- status: `done`
- release: `社團發布前`

Done:

- `npm run validate:frontend -- --skip-dom` runs `audit:content`, tests, and build.
- DOM checks remain opt-in through `--url` until that flow is stabilized.

## P2 Issues

### Add Umami analytics

- type: `feature`
- project: `lab`
- priority: `P2`
- status: `inbox`
- release: `社團發布前`

Done:

- Only published pages are tracked.
- Pageviews are visible in Umami.

### Add giscus comments

- type: `feature`
- project: `lab`
- priority: `P2`
- status: `inbox`
- release: `社團發布前`

Done:

- Comments are enabled first on Explore or Works detail pages.
- Comments are written to GitHub Discussions.

### Create feedback-to-issue workflow

- type: `feature`
- project: `lab`
- priority: `P2`
- status: `inbox`
- release: `社團發布前`

Done:

- Feedback can be turned into GitHub Issues.
- Feedback issues use the `feedback` label.

### Prepare 社團發布前 release checklist

- type: `release`
- project: `lab`
- priority: `P2`
- status: `done`
- release: `社團發布前`

Done:

- The `社團發布前 Release Checklist` section exists in this document.
- The checklist covers validation, content publication, mobile checks, release scope, post-release checks, and rollback.
- DOM smoke stays opt-in through `--url`.

## Release Gate

Before the `社團發布前` release:

- `npm run audit:content` passes.
- `npm test` passes.
- `npm run build` passes.
- `npm run validate:frontend -- --skip-dom` passes.
- Published Explore entries have covers.
- Published pages do not contain placeholder/debug text.
- Main pages work at 390px mobile width.
- Home, works, explore, and representative detail pages open correctly.

See `public-pages-audit.md` for the current post-release audit of public Works and Explore pages.

For math semantics, use `math-content-review-checklist.md`; `audit:content` only covers structural release readiness.

## 社團發布前 Release Checklist

Use this checklist before publishing Lab content. Do not rely on memory.

### 1. Basic validation

Run these commands before release:

```bash
npm run audit:content
npm test
npm run build
npm run validate:frontend -- --skip-dom
```

Expected result:

- `audit:content` passes.
- Tests pass.
- Build passes.
- `validate:frontend -- --skip-dom` runs the first-stage gate: content audit, tests, then build.

DOM smoke and screenshots are opt-in:

- Use DOM smoke only when checking a local or deployed route:
  `npm run validate:frontend -- --url <local-or-deployed-route>`
- Add screenshot capture only when visual evidence is needed.
- Do not make DOM smoke mandatory by default.

### 2. Content publication checks

Before changing any item from draft to public:

- List every Work and Explore item intended for this release.
- Confirm unfinished items remain `draft: true`.
- Confirm published items use the intended `draft: false` state.
- Confirm every published Explore item has `coverImage`.
- Confirm every published Explore cover points to an existing public asset.
- Confirm published pages do not contain placeholder/debug text such as `TODO`, `FIXME`, `placeholder`, `debug`, `lorem`, `待補`, `暫定`, or `測試用`.
- Confirm Works and Explore links are reasonable: published Explore pages should not link to missing or draft Works.
- Confirm descriptions are concise enough for lists and metadata; rewrite long descriptions before release.
- For math semantics, run the manual `math-content-review-checklist.md`; do not rely on `audit:content` for definitions, formulas, edge cases, or overclaims.
- Confirm Explore `category` is one of `幾何`, `代數`, `統計`, `拓樸`, or `分析`.
- Confirm `new:work` and `new:explore` output remains draft skeleton content until manually completed.
- Do not publish generated skeletons or placeholder content.

### 3. Mobile checks

Check the main release surfaces at 390px and 430px widths:

- Home page opens and does not break layout.
- Works list opens and cards, filters, and search remain usable.
- Explore list opens and cards, filters, and search remain usable.
- Representative Work detail pages open correctly.
- Representative Explore detail pages open correctly.
- DOM controls do not cover the canvas or main content.
- Canvas, stats, controls, and article content remain readable without horizontal overflow.

### 4. Release scope checks

Before publishing:

- Write down the exact Works and Explore entries included in this release.
- Keep unfinished content as draft.
- Keep experimental, incomplete, or placeholder entries out of public entry points.
- Do not auto-edit registries from generator output.
- Only add registry wiring when the interactive surface is ready and intentionally public.
- Use `npm run validate:changed -- --dry-run` to confirm the focused validation tasks selected for the current diff are reasonable.

### 5. Post-release checks

After deployment:

- Open the formal production URL.
- Open Home, Works list, Explore list, and representative detail pages.
- Check sitemap output and canonical URLs for obvious mistakes.
- If Umami is not connected yet, keep it marked as a P2 follow-up.
- If giscus is not connected yet, keep it marked as a P2 follow-up.
- If Umami is connected, confirm pageviews are recorded.
- If giscus is connected, confirm comments can load and post in the intended GitHub Discussions area.

### 6. Rollback or correction

If a release gate fails:

- Do not publish.
- Fix the failed audit, test, build, or content issue first.
- Re-run the relevant focused check, then re-run `npm run validate:frontend -- --skip-dom`.

If a content error is found after deployment:

- Prefer changing the affected item back to `draft: true` when the page should disappear from public surfaces.
- Revert the related commit when the released change is broadly unsafe or wrong.
- For small wording or metadata mistakes, patch the content directly and re-run the release gate.

## Non-Goals

This phase does not include:

- Notion CMS
- custom admin backend
- user login
- custom analytics
- custom comments
- local-first starter
- card-tool game tools
- broad Lab UI refactors
