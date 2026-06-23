#!/usr/bin/env node
import { auditContent, parseFrontmatter, readContentFiles } from './audit-content.mjs';
import { auditExploreCovers } from './audit-explore-covers.mjs';

function fieldValue(parsed, key) {
  return parsed?.fields.get(key)?.value ?? null;
}

function contentSummary(files) {
  const summary = {
    works: { public: [], draft: [] },
    explore: { public: [], draft: [] },
  };

  for (const file of files) {
    const parsed = parseFrontmatter(file.body);
    const target = fieldValue(parsed, 'draft') === 'true' ? 'draft' : 'public';
    summary[file.collection][target].push({
      slug: file.slug,
      title: fieldValue(parsed, 'title') ?? file.slug,
      category: fieldValue(parsed, 'category'),
    });
  }

  for (const collection of Object.values(summary)) {
    collection.public.sort((a, b) => a.slug.localeCompare(b.slug));
    collection.draft.sort((a, b) => a.slug.localeCompare(b.slug));
  }

  return summary;
}

function names(entries) {
  return entries.map((entry) => entry.slug).join(', ') || '(none)';
}

function printMarkdown(summary, contentResult, coverResult) {
  console.log('# Public Pages Audit');
  console.log('');
  console.log('## Live Scope');
  console.log('');
  console.log(`- Public Works: ${summary.works.public.length}`);
  console.log(`- Draft Works: ${summary.works.draft.length}`);
  console.log(`- Public Explore: ${summary.explore.public.length}`);
  console.log(`- Draft Explore: ${summary.explore.draft.length}`);
  console.log('');
  console.log('## Checks');
  console.log('');
  console.log(`- Content audit: ${contentResult.issues.length === 0 ? 'pass' : 'fail'}`);
  console.log(`- Explore cover audit: ${coverResult.issues.length === 0 ? 'pass' : 'fail'}`);
  console.log('');
  console.log('## Public Pages');
  console.log('');
  console.log(`- Works: ${names(summary.works.public)}`);
  console.log(`- Explore: ${names(summary.explore.public)}`);
  console.log('');
  console.log('## Draft Pages');
  console.log('');
  console.log(`- Works: ${names(summary.works.draft)}`);
  console.log(`- Explore: ${names(summary.explore.draft)}`);

  const issues = [
    ...contentResult.issues.map((issue) => `${issue.file}:${issue.line}: ${issue.message}`),
    ...coverResult.issues.map((issue) => `${issue.file}: ${issue.message}`),
  ];

  if (issues.length > 0) {
    console.log('');
    console.log('## Issues');
    console.log('');
    for (const issue of issues) console.log(`- ${issue}`);
  }
}

function main() {
  const files = readContentFiles();
  const summary = contentSummary(files);
  const contentResult = auditContent(files);
  const coverResult = auditExploreCovers();
  const result = { summary, content: contentResult, exploreCovers: coverResult };

  if (process.argv.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else {
    printMarkdown(summary, contentResult, coverResult);
  }

  if (contentResult.issues.length > 0 || coverResult.issues.length > 0) {
    process.exitCode = 1;
  }
}

main();
