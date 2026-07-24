# Public Pages Audit

This report is generated live. Do not maintain page counts or slug snapshots by hand.

Run:

```bash
npm run audit:public-pages
npm run audit:public-pages -- --json
```

The command computes current public/draft Works, Explore, and Exam counts from `src/content/`, then runs the existing content and Explore cover audits. It does not change `draft`, registry wiring, generator behavior, analytics, comments, or DOM validation defaults.

For the full release gate, use `docs/lab-release-system.md`.
