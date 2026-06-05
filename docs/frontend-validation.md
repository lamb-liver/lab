# Frontend Validation

This project follows a fixed frontend verification order:

1. Build
2. Test
3. DOM verification
4. Screenshot only when visual evidence is needed

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

- Metadata or data-only change: build/test/DOM, screenshot skipped.
- Button/form behavior: build/test/DOM, screenshot only if appearance changed.
- CSS, chart, canvas, responsive layout, hero, image, or visual polish: build/test/DOM plus screenshot.

## Report Format

```text
Validation:
- build: pass (`npm run build`)
- test: pass (`npm test`)
- DOM: pass (`http://127.0.0.1:4321/`, checked target elements/interactions)
- screenshot: skipped, DOM evidence was sufficient
```

If screenshots were needed:

```text
Validation:
- build: pass (`npm run build`)
- test: pass (`npm test`)
- DOM: pass (`http://127.0.0.1:4321/`, checked target elements/interactions)
- screenshot: pass (visual layout changed)
```
