import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { descriptionHasRawMath } from './descriptionMath';

export type ContentCollectionName = 'works' | 'explore' | 'exam';

export type ContentAuditIssue = {
  file: string;
  line: number;
  message: string;
};

type ContentFile = {
  collection: ContentCollectionName;
  path: string;
  body: string;
};

const CONTENT_COLLECTIONS: ContentCollectionName[] = ['works', 'explore', 'exam'];

/** exam 的章節範本與 works／explore 不同，見 textstyle.md §2.3 */
const EXAM_SECTIONS = ['題意', '為什麼會錯', '觀念', '互動怎麼看'];

const INTERACTION_SIGNAL =
  /(滑桿|拖動|調整|切換|模式|顯示|可選|開啟|關閉|控制|輸入|標示|標註|標記|高亮|比較|觀察|選擇|同步|即時|改變|增大|增減|提高|限制|驅動|繪製|疊加|生成|累計|記錄|對照|隨時間|連續|動畫|著色|調大|重算|更新|移動|平移|縮放|旋轉|逼近|收斂|面積表|連結|步數|可調|排列|趨近|開門|組合|積分|累積|細節)/;

const OBSERVATION_CONTROL_TERMS =
  /(滑桿|拖動|切換|可選|開啟|關閉|控制|輸入|按下|點擊)/;

export function readContentFiles(root = process.cwd()): ContentFile[] {
  return CONTENT_COLLECTIONS.flatMap((collection) => {
    const dir = join(root, 'src/content', collection);
    return readdirSync(dir)
      .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
      .sort()
      .map((name) => {
        const filePath = join(dir, name);
        return {
          collection,
          path: join('src/content', collection, name),
          body: readFileSync(filePath, 'utf8'),
        };
      });
  });
}

export function auditContentFiles(files = readContentFiles()): ContentAuditIssue[] {
  const issues: ContentAuditIssue[] = [];

  for (const file of files) {
    const description = readFrontmatterString(file.body, 'description');
    if (description && descriptionHasRawMath(description.value)) {
      issues.push({
        file: file.path,
        line: description.line,
        message:
          'frontmatter description must use plain-text math (Unicode or words), not LaTeX delimiters or commands',
      });
    }

    if (file.collection === 'exam') {
      for (const section of EXAM_SECTIONS) {
        if (!extractSection(file.body, section)) {
          issues.push({
            file: file.path,
            line: 1,
            message: `exam content must include ## ${section}`,
          });
        }
      }
      continue;
    }

    const interaction = extractSection(file.body, '互動說明');
    if (!interaction) {
      issues.push({
        file: file.path,
        line: 1,
        message: 'missing ## 互動說明 section',
      });
    } else {
      for (const bullet of readBullets(interaction)) {
        if (!INTERACTION_SIGNAL.test(bullet.text)) {
          issues.push({
            file: file.path,
            line: bullet.line,
            message: '互動說明 bullet should describe an operation, mode, or visible change',
          });
        }
      }
    }

    const observation = extractSection(file.body, '觀察重點');
    if (!observation && file.collection === 'explore') {
      issues.push({
        file: file.path,
        line: 1,
        message: 'explore content must include ## 觀察重點',
      });
    }

    if (observation) {
      for (const bullet of readBullets(observation)) {
        if (OBSERVATION_CONTROL_TERMS.test(bullet.text)) {
          issues.push({
            file: file.path,
            line: bullet.line,
            message: '觀察重點 should avoid control-operation wording; move it to 互動說明',
          });
        }
      }
    }
  }

  return issues;
}

function readFrontmatterString(
  body: string,
  key: string,
): { value: string; line: number } | null {
  const lines = body.split('\n');
  if (lines[0] !== '---') return null;

  for (let i = 1; i < lines.length; i += 1) {
    const line = lines[i];
    if (line === '---') return null;
    const match = line.match(new RegExp(`^${key}:\\s*(.*)$`));
    if (!match) continue;
    return {
      value: stripYamlString(match[1] ?? ''),
      line: i + 1,
    };
  }

  return null;
}

function stripYamlString(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function extractSection(
  body: string,
  heading: string,
): { content: string; startLine: number } | null {
  const lines = body.split('\n');
  const headingLine = `## ${heading}`;
  const startIndex = lines.findIndex((line) => line.trim() === headingLine);
  if (startIndex < 0) return null;

  let endIndex = lines.length;
  for (let i = startIndex + 1; i < lines.length; i += 1) {
    if (/^##\s+/.test(lines[i])) {
      endIndex = i;
      break;
    }
  }

  return {
    content: lines.slice(startIndex + 1, endIndex).join('\n'),
    startLine: startIndex + 2,
  };
}

function readBullets(section: { content: string; startLine: number }): Array<{
  text: string;
  line: number;
}> {
  return section.content
    .split('\n')
    .map((line, index) => ({
      text: line.trim(),
      line: section.startLine + index,
    }))
    .filter((line) => line.text.startsWith('- '));
}
