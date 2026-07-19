# AGENTS.md

This is the AI entry point for this repository. Keep it short, authoritative, and stable. Do not copy large rules from the domain documents into this file; link to the canonical source instead.

## Authority Order

When documents or assumptions conflict, follow this order:

1. `src/` runtime code
2. `art.md` for visual language entrypoint (`workart.md` for Works, `exploreart.md` for Explore)
3. `p5toreact.md` for p5, React, CurveModule, rendering, and thumbnail integration
4. `reactkey.md` for morph curve lifecycle, refs, identity, and animation contracts
5. `textstyle.md` for content Markdown structure, wording, and Traditional Chinese language rules
6. `docs/` (this directory) for system maps, editing workflow, and historical design notes
7. `.cursor/rules/` for editor workflow guidance only

Cursor rules are not canonical runtime specifications.

## Editing Principles

- Prefer minimal edits.
- Preserve the rendering architecture.
- Avoid speculative abstractions.
- Keep registry systems synchronized.
- Do not rewrite stable rendering, lifecycle, or thumbnail pipelines unless the task explicitly requires it.
- For rendering logic changes, keep replacement blocks complete enough to preserve local invariants.
- Treat `src/` behavior as the final source of truth when Markdown is stale.

## Architecture Entry Points

| Need | Read |
|------|------|
| System map and ownership boundaries | `architecture.md` |
| Editing and validation rules | `editing-rules.md` |
| Visual language entrypoint | `art.md` |
| Works visual language | `workart.md` |
| Explore visual language | `exploreart.md` |
| Explore planning and anti-duplication | `exploreplan.md` |
| p5 to React integration and rendering pipeline | `p5toreact.md` |
| Morph animation lifecycle | `reactkey.md` |
| Content writing style | `textstyle.md` |
| Content ↔ interaction consistency | `content-interaction-contract.md` |
| Site shell UX (nav, lists, detail chrome) | `site-ux.md` |

## Validation

Before modifying rendering systems:

- Check work and explore registry synchronization.
- Check thumbnail generation assumptions when `CurveModule.sample()` changes.
- Check animation lifecycle stability when refs, `draw`, or p5 hooks change.
- Run focused tests first, then `npm run build` for cross-file integration changes.
For frontend changes, use `frontend-validation.md` as the default gate:

- Run `npm run validate:frontend -- --url <local-route>` for build, test, and DOM verification.
- Add `--screenshot` only when visual evidence is needed.
- If DOM is verified by a browser tool instead of the script, report the route and checked elements/interactions.

## Boundaries

- Works use `CurveModule` + work registries + `WorkInteractiveStage`.
- Explore interactives use `src/explore/*` + explore registries; they do not use the Works portal architecture.
- `curve/modules/*` should stay free of p5 and React dependencies.
- `systems/rendering/*` renders snapshots and should not read React state.
