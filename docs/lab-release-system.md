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

- Works require `title / description / tags / date / draft`.
- Explore requires `title / description / category / date / draft`.
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

### Prepare release: 社團發布前

- type: `release`
- project: `lab`
- priority: `P2`
- status: `inbox`
- release: `社團發布前`

Done:

- Selected public pages pass content audit, tests, build, and smoke checks.
- Home, works, explore, and representative detail pages open correctly.

## Release Gate

Before the `社團發布前` release:

- `npm run audit:content` passes.
- `npm test` passes.
- `npm run build` passes.
- Published Explore entries have covers.
- Published pages do not contain placeholder/debug text.
- Main pages work at 390px mobile width.
- Home, works, explore, and representative detail pages open correctly.

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
