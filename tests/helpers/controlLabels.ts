import type { Page } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * 共用於 explore-controls / work-controls 兩個 spec。
 *
 * 目的是擋住「文案描述了介面上不存在的控制項」這類漂移：`## 互動說明` 的粗體標籤依
 * textstyle.md §5 只標控件／模式名，所以每個標籤都應該在頁面上找得到對應的按鈕或欄位。
 */

const repoRoot = resolve(import.meta.dirname, '..', '..');

/** 取出 `## 互動說明` 的粗體標籤；括號註記如「（預設）」不列入比對 */
export function readInteractionLabels(
  collection: 'explore' | 'works',
  slug: string,
): string[] {
  const body = readFileSync(
    resolve(repoRoot, 'src/content', collection, `${slug}.md`),
    'utf8',
  );
  const section = body.split('## 互動說明')[1]?.split(/^## /m)[0] ?? '';
  return [...section.matchAll(/^- \*\*([^*]+)\*\*/gm)].map((match) =>
    match[1].replace(/（[^）]*）/g, '').trim(),
  );
}

/** 頁面上所有可見的控件文字：按鈕內文、欄位標籤、下拉選單的每個選項 */
export async function readControlTexts(page: Page, scopeSelector: string): Promise<string[]> {
  return page.evaluate((selector) => {
    const scope = document.querySelector(selector) ?? document.body;
    const stripValue = (text: string) =>
      text.replace(/\s+/g, ' ').replace(/[\d.−-]+$/, '').trim();

    /** label 內若包住 select/input/數值，textContent 會把它們一起串進來，要先剝掉 */
    const ownText = (label: Element | null | undefined): string => {
      if (!label) return '';
      const clone = label.cloneNode(true) as Element;
      clone
        .querySelectorAll('select, option, input, .control-field__value')
        .forEach((node) => node.remove());
      return stripValue(clone.textContent ?? '');
    };

    const labelOf = (field: Element): string => {
      const labelFor = field.id
        ? document.querySelector(`label[for="${CSS.escape(field.id)}"]`)
        : null;
      return (
        ownText(labelFor) ||
        ownText(field.closest('label')) ||
        stripValue(field.getAttribute('aria-label') ?? '') ||
        ownText(field.closest('.control-field')?.querySelector('label'))
      );
    };

    const buttons = [...scope.querySelectorAll('button')].map((button) =>
      stripValue(button.textContent ?? ''),
    );
    const fields = [...scope.querySelectorAll('input')].map(labelOf);

    // 下拉選單的每個選項都是一個獨立的模式，不能併成一條字串
    const selects = [...scope.querySelectorAll('select')].flatMap((select) => [
      labelOf(select),
      ...[...(select as HTMLSelectElement).options].map((option) => stripValue(option.text)),
    ]);

    return [...buttons, ...fields, ...selects].filter(Boolean);
  }, scopeSelector);
}

/**
 * Works 的 `## 互動說明` 混了兩種條目：真的控制項（「花瓣數 k」）與畫面元素導讀
 * （「黃金矩形標示」「隨機投針動畫」）。後者沒有 DOM 節點，拿來比對只會產生雜訊。
 *
 * 判準：帶符號 token（拉丁字母／希臘字母／下標）的標籤是在指涉某個具名參數或模式，
 * 應該找得到；純中文敘述視為畫面導讀放行。以「拖動／拖曳／點擊」開頭的是畫布手勢，
 * 同樣沒有 DOM 控制項。
 */
export function looksLikeControlReference(label: string): boolean {
  if (/拖動|拖曳|點擊|滑動/.test(label)) return false;
  return /[A-Za-zα-ωΑ-Ω₀-₉]/.test(label);
}

const GREEK: Record<string, string> = {
  alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', Delta: 'Δ', theta: 'θ',
  lambda: 'λ', mu: 'μ', pi: 'π', sigma: 'σ', phi: 'φ', omega: 'ω', varphi: 'φ',
};
const SUBSCRIPT = '₀₁₂₃₄₅₆₇₈₉';

/**
 * 文案寫 `$r_1,\theta_1$`，介面寫「Z₁ 模長 r₁」——同一個東西，字串卻對不上。
 * 比對前先把 LaTeX 拆成與介面同一種寫法。
 */
function normalize(text: string): string {
  return text
    .replace(/\$/g, '')
    .replace(/\\([a-zA-Z]+)/g, (_, name: string) => GREEK[name] ?? '')
    .replace(/_\{?(\d)\}?/g, (_, digit: string) => SUBSCRIPT[Number(digit)]!)
    .replace(/[{}\\]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/** 中文短語逐字比對太脆弱；共用連續兩字視為同一個東西 */
function sharesBigram(a: string, b: string): boolean {
  for (let i = 0; i + 2 <= a.length; i += 1) {
    if (b.includes(a.slice(i, i + 2))) return true;
  }
  return false;
}

function couldMatch(rawLabel: string, rawControl: string): boolean {
  const label = normalize(rawLabel);
  const control = normalize(rawControl);
  if (!label || !control) return false;
  return control.includes(label) || label.includes(control) || sharesBigram(control, label);
}

/**
 * 每個標籤必須配到「自己專屬」的控制項。
 * 只做 some() 會讓錯誤標籤被別的控制項吃掉——例如「貝氏定理」靠共用的「定理」
 * 兩字對上「中央極限定理」，即使介面上根本沒有貝氏定理這個模式。
 */
export function unmatchedLabels(labels: string[], controls: string[]): string[] {
  const assigned = new Map<number, number>();

  const assign = (labelIndex: number, blocked: Set<number>): boolean => {
    for (let i = 0; i < controls.length; i += 1) {
      if (blocked.has(i) || !couldMatch(labels[labelIndex]!, controls[i]!)) continue;
      blocked.add(i);
      const holder = assigned.get(i);
      if (holder === undefined || assign(holder, blocked)) {
        assigned.set(i, labelIndex);
        return true;
      }
    }
    return false;
  };

  return labels.filter((_, index) => !assign(index, new Set()));
}

/** 逐一點過每個按鈕：有些控制項只在特定模式下才掛載 */
export async function collectControlsAcrossModes(
  page: Page,
  scopeSelector: string,
): Promise<string[]> {
  const seen = new Set(await readControlTexts(page, scopeSelector));

  const buttonNames = await page
    .locator(`${scopeSelector} button`)
    .evaluateAll((nodes) =>
      nodes.map((node) => (node.textContent ?? '').replace(/\s+/g, ' ').trim()).filter(Boolean),
    );

  for (const name of buttonNames) {
    const button = page.locator(`${scopeSelector} button`).filter({ hasText: name }).first();
    if (!(await button.isVisible().catch(() => false))) continue;
    await button.click({ timeout: 2000 }).catch(() => undefined);
    for (const control of await readControlTexts(page, scopeSelector)) seen.add(control);
  }

  return [...seen];
}
