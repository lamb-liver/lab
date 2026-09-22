# Post-change review (automatic)

This is the Lab review gate after a content or interactive update. Do not wait for the user to say「review」. Do not ask whether to fix findings.

## When it fires

Any turn that **adds or edits** Works, Explore, or Exam:

- `src/content/{works,explore,exam}/**`
- `src/curve/modules/**`, `src/curve/registry.ts`
- `src/explore/**`, `src/exam/**`
- `src/components/{works,explore,exam,curve}/**`
- `src/systems/rendering/**`
- `src/works/**`, registries, lazy stage maps, related CSS

Draft pages are in scope. `audit:work-controls` skipping drafts does not skip this review.

Skip only for unrelated edits (docs-only, CI, fonts) that do not touch the paths above.

## What to run (in order)

1. `npm run validate:changed` in the lab repo.
2. Architecture / visual / registry pass using `.cursor/rules/code-review.mdc` (§1–§8).
3. Math pass on every changed Markdown using `docs/math-content-review-checklist.md`. Write the record format from that file. Verdict: `pass` | `concern` | `blocked` | `follow-up`.
4. If the working tree is dirty, a `/review` local pass is the code-review vehicle; if the tree is clean, `/review --main`. Do not skip because tests already passed.

## Fix without asking

Review findings are work, not a question. In the same turn:

- Fix every `bug` / CRITICAL / MAJOR, and every math `concern` that is a wrong claim, missing edge case, or figure/text mismatch.
- Fix nits / suggestions that are one-line (comments, labels, `touch-action`, readout copy).
- Leave only items that need a product decision, would publish a draft, or expand past the finding. Say so in one line.

Do not end with 「要修的話跟我說」 or 「確認後再改」.

## Done means

- Validation finished (or you stated what could not be run).
- Findings were fixed, or the leftover list is only blocked/product items.
- Math records exist for changed pages. `blocked` → do not recommend publishing.
