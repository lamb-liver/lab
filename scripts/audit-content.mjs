#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export const EXPLORE_CATEGORIES = ['幾何', '代數', '統計', '拓樸', '分析'];
export const EXAM_SUBJECTS = ['學測數A', '學測數B', '分科數甲'];
const COLLECTIONS = ['works', 'explore', 'exam'];
const REQUIRED_FIELDS = {
  works: ['title', 'description', 'tags', 'date', 'order', 'draft'],
  explore: ['title', 'description', 'category', 'date', 'order', 'draft'],
  exam: [
    'title',
    'description',
    'subject',
    'year',
    'questionType',
    'questionNo',
    'unit',
    'concepts',
    'date',
    'order',
    'draft',
  ],
};
const DESCRIPTION_MAX_LENGTH = 80;
const PLACEHOLDER_PATTERN = /\b(?:TODO|FIXME|placeholder|debug|lorem)\b|待補|暫定|測試用/i;
function usage() {
  return [
    'Usage:',
    '  npm run audit:content',
    '  npm run audit:content -- --json',
    '',
    'Checks content release readiness for src/content/works, src/content/explore, and src/content/exam.',
    'Draft entries are checked for schema, but release-only checks apply only to published entries.',
  ].join('\n');
}

export function readContentFiles(root = repoRoot) {
  return COLLECTIONS.flatMap((collection) => {
    const dir = resolve(root, 'src/content', collection);
    return readdirSync(dir)
      .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
      .sort()
      .map((name) => {
        const path = join('src/content', collection, name);
        return {
          collection,
          slug: basename(name).replace(/\.mdx?$/, ''),
          path,
          body: readFileSync(resolve(root, path), 'utf8'),
        };
      });
  });
}

export function auditContent(files = readContentFiles(), options = {}) {
  const root = options.root ?? repoRoot;
  const fileExists = options.fileExists ?? ((path) => existsSync(path));
  const issues = [];
  const byCollection = new Map(COLLECTIONS.map((collection) => [collection, new Map()]));
  const publishedOrders = new Map(COLLECTIONS.map((collection) => [collection, new Map()]));

  for (const file of files) {
    const slugs = byCollection.get(file.collection);
    if (slugs.has(file.slug)) {
      addIssue(issues, file, 1, `duplicate ${file.collection} slug: ${file.slug}`);
    } else {
      slugs.set(file.slug, file);
    }
  }

  for (const file of files) {
    const parsed = parseFrontmatter(file.body);
    if (!parsed) {
      addIssue(issues, file, 1, 'missing YAML frontmatter block');
      continue;
    }

    checkFrontmatter(file, parsed, issues);
    checkDescription(file, parsed, issues);
    if (file.collection === 'explore' || file.collection === 'exam') {
      checkStaticCover(file, parsed, issues, root, fileExists);
    }

    const draft = fieldValue(parsed, 'draft') === 'true';
    if (!draft) {
      checkPublishedOrder(file, parsed, publishedOrders, issues);
      checkPublishedPlaceholders(file, parsed, issues);
      checkPublishedReferences(file, parsed, byCollection, issues);
    }
  }

  return {
    checked: files.length,
    issues,
  };
}

function checkFrontmatter(file, parsed, issues) {
  const required = REQUIRED_FIELDS[file.collection];

  for (const key of required) {
    if (!parsed.fields.has(key)) {
      addIssue(issues, file, 1, `missing required frontmatter field: ${key}`);
    }
  }

  const draft = fieldValue(parsed, 'draft');
  if (draft && draft !== 'true' && draft !== 'false') {
    addIssue(issues, file, fieldLine(parsed, 'draft'), 'draft must be true or false');
  }

  const date = fieldValue(parsed, 'date');
  if (date && !isValidDate(date)) {
    addIssue(issues, file, fieldLine(parsed, 'date'), 'date must use a valid YYYY-MM-DD value');
  }

  const order = fieldValue(parsed, 'order');
  if (order && !/^\d+$/.test(order)) {
    addIssue(issues, file, fieldLine(parsed, 'order'), 'order must be a non-negative integer');
  }

  if (file.collection === 'works') {
    const tags = parsed.arrays.get('tags') ?? [];
    if (parsed.fields.has('tags') && tags.length === 0) {
      addIssue(issues, file, fieldLine(parsed, 'tags'), 'tags must include at least one item');
    }
  }

  if (file.collection === 'exam') {
    const subject = fieldValue(parsed, 'subject');
    if (subject && !EXAM_SUBJECTS.includes(subject)) {
      addIssue(
        issues,
        file,
        fieldLine(parsed, 'subject'),
        `subject must be one of: ${EXAM_SUBJECTS.join(', ')}`,
      );
    }

    const year = fieldValue(parsed, 'year');
    if (year && !/^\d{3}$/.test(year)) {
      addIssue(issues, file, fieldLine(parsed, 'year'), 'year must be a 3-digit ROC year');
    }

    const concepts = parsed.arrays.get('concepts') ?? [];
    if (parsed.fields.has('concepts') && concepts.length === 0) {
      addIssue(issues, file, fieldLine(parsed, 'concepts'), 'concepts must include at least one item');
    }
  }

  if (file.collection === 'explore') {
    const category = fieldValue(parsed, 'category');
    if (category && !EXPLORE_CATEGORIES.includes(category)) {
      addIssue(
        issues,
        file,
        fieldLine(parsed, 'category'),
        `category must be one of: ${EXPLORE_CATEGORIES.join(', ')}`,
      );
    }
  }
}

function checkDescription(file, parsed, issues) {
  const description = fieldValue(parsed, 'description');
  if (!description) return;
  if (description.length > DESCRIPTION_MAX_LENGTH) {
    addIssue(
      issues,
      file,
      fieldLine(parsed, 'description'),
      `description must be ${DESCRIPTION_MAX_LENGTH} characters or fewer`,
    );
  }
}

function checkPublishedPlaceholders(file, parsed, issues) {
  const lines = file.body.split('\n');
  lines.forEach((line, index) => {
    if (!PLACEHOLDER_PATTERN.test(line)) return;
    addIssue(issues, file, index + 1, 'published content contains placeholder/debug text');
  });
}

function checkPublishedOrder(file, parsed, publishedOrders, issues) {
  const rawOrder = fieldValue(parsed, 'order');
  if (!rawOrder || !/^\d+$/.test(rawOrder)) return;

  const order = Number(rawOrder);
  if (order === 0) {
    addIssue(issues, file, fieldLine(parsed, 'order'), 'published content order must be greater than 0');
    return;
  }

  const collectionOrders = publishedOrders.get(file.collection);
  const previous = collectionOrders.get(order);
  if (previous) {
    addIssue(
      issues,
      file,
      fieldLine(parsed, 'order'),
      `duplicate published ${file.collection} order: ${order} already used by ${previous.slug}`,
    );
    return;
  }

  collectionOrders.set(order, file);
}

function checkStaticCover(file, parsed, issues, root, fileExists) {
  const coverImage = fieldValue(parsed, 'coverImage');
  if (!coverImage) {
    if (fieldValue(parsed, 'draft') !== 'true') {
      addIssue(issues, file, 1, `published ${file.collection} content must define coverImage`);
    }
    return;
  }

  if (!coverImage.startsWith('/')) {
    addIssue(issues, file, fieldLine(parsed, 'coverImage'), 'coverImage must be an absolute public path');
    return;
  }

  const publicPath = resolve(root, 'public', coverImage.slice(1));
  if (!fileExists(publicPath)) {
    addIssue(issues, file, fieldLine(parsed, 'coverImage'), `coverImage asset is missing: ${coverImage}`);
  }
}

function checkPublishedReferences(file, parsed, byCollection, issues) {
  const references = new Map();
  for (const match of file.body.matchAll(/\]\(\/(works|explore)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/?\)/g)) {
    references.set(`${match[1]}/${match[2]}`, {
      collection: match[1],
      slug: match[2],
      line: 1,
      label: 'published content links to',
    });
  }

  if (file.collection === 'exam') {
    for (const [field, collection] of [['relatedWorks', 'works'], ['relatedExplore', 'explore']]) {
      for (const slug of parsed.arrays.get(field) ?? []) {
        references.set(`${collection}/${slug}`, {
          collection,
          slug,
          line: fieldLine(parsed, field),
          label: 'published exam references',
        });
      }
    }
  }

  for (const reference of references.values()) {
    const target = byCollection.get(reference.collection)?.get(reference.slug);
    if (!target) {
      addIssue(
        issues,
        file,
        reference.line,
        `${reference.label} missing ${singular(reference.collection)}: ${reference.slug}`,
      );
      continue;
    }

    const targetFrontmatter = parseFrontmatter(target.body);
    if (targetFrontmatter && fieldValue(targetFrontmatter, 'draft') === 'true') {
      addIssue(
        issues,
        file,
        reference.line,
        `${reference.label} draft ${singular(reference.collection)}: ${reference.slug}`,
      );
    }
  }
}

function singular(collection) {
  return collection === 'works' ? 'work' : 'explore';
}

export function parseFrontmatter(body) {
  const lines = body.split('\n');
  if (lines[0] !== '---') return null;

  const fields = new Map();
  const arrays = new Map();
  let activeArrayKey = null;

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === '---') {
      return {
        fields,
        arrays,
        endLine: i + 1,
      };
    }

    const arrayItem = line.match(/^\s+-\s+(.+?)\s*$/);
    if (arrayItem && activeArrayKey) {
      arrays.get(activeArrayKey).push(stripYamlString(arrayItem[1]));
      continue;
    }

    const field = line.match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/);
    if (!field) {
      activeArrayKey = null;
      continue;
    }

    const key = field[1];
    const raw = field[2] ?? '';
    const value = stripYamlString(raw);
    fields.set(key, {
      value,
      line: i + 1,
    });

    if (raw.trim() === '') {
      activeArrayKey = key;
      arrays.set(key, []);
    } else {
      activeArrayKey = null;
    }
  }

  return null;
}

function fieldValue(parsed, key) {
  return parsed.fields.get(key)?.value ?? null;
}

function fieldLine(parsed, key) {
  return parsed.fields.get(key)?.line ?? 1;
}

function stripYamlString(value) {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function isValidDate(value) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function addIssue(issues, file, line, message) {
  issues.push({
    collection: file.collection,
    slug: file.slug,
    file: file.path,
    line,
    message,
  });
}

function main() {
  const args = process.argv.slice(2);
  if (args.includes('--help') || args.includes('-h')) {
    console.log(usage());
    return;
  }

  const result = auditContent();
  if (args.includes('--json')) {
    console.log(JSON.stringify(result, null, 2));
  } else if (result.issues.length === 0) {
    console.log(`Content release audit passed (${result.checked} files).`);
  } else {
    console.error(`Content release audit failed (${result.issues.length} issues):`);
    for (const issue of result.issues) {
      console.error(`- ${issue.file}:${issue.line}: ${issue.message}`);
    }
  }

  if (result.issues.length > 0) process.exitCode = 1;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
