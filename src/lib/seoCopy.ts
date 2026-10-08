/** Canonical title/description for section pages (also used as OG text via BaseLayout). */
export const siteSeo = {
  home: {
    title: '羊·實驗',
    description:
      '羊·實驗：以互動視覺化呈現數學公式、曲線與演算法。從直觀探索接到高中與大學概念；作品集展示單一主題，主題導覽串連跨概念實驗。',
  },
  works: {
    title: '作品集',
    description: '單一數學對象的深度作品集：每篇含公式、可調參數互動與完整 Markdown 說明。',
  },
  explore: {
    title: '數學主題導覽',
    description:
      '從幾何、代數、分析到機率統計，透過互動視覺化理解每個數學主題的核心圖像。',
  },
  exam: {
    title: '試題視覺化',
    description:
      '從歷屆學測、分科與 AMC 12 試題出發，用互動視覺化拆開考生最常卡住的那一個心智步驟。',
  },
  concept: {
    title: '概念索引',
    description:
      '依數學概念橫向串連作品集、主題導覽與試題視覺化——從同一個概念看見它在不同內容裡的樣貌。',
  },
  about: {
    title: '關於',
    description:
      '關於羊·實驗：用程式做數學形狀與演算法的互動實驗，從直觀探索接到高中與大學概念。',
  },
  path: {
    title: '策展路徑',
    description: '從已知起點走到圖像延伸：可停在高中應用，也可接到大學概念。',
  },
} as const;

/** English section pages under /en/. Titles double as the visible h1 where noted. */
export const siteSeoEn = {
  home: {
    title: '羊·實驗',
    description:
      'Interactive visualizations of mathematical formulas, curves, and algorithms, from intuitive exploration to high-school and university concepts. Works focus on one object each; Explore links experiments across a topic.',
  },
  works: {
    title: 'Works',
    description:
      'In-depth works on single mathematical objects: each has the formula, an interactive figure with adjustable parameters, and a full write-up.',
  },
  explore: {
    title: 'Math topics',
    description:
      'From geometry and algebra to analysis and statistics, interactive visualizations that build the core picture of each topic.',
  },
  exam: {
    title: 'Exam visualizations',
    description:
      'Past GSAT, AST, and AMC 12 problems, with an interactive figure that takes apart the one step most students get stuck on.',
  },
  path: {
    title: 'Curated paths',
    description:
      'Walk from a familiar starting point to a visual extension: stop at a high-school application, or keep going to a university concept.',
  },
  concept: {
    title: 'Concept index',
    description:
      'Works, topic guides, and exam visualizations linked by mathematical concept, so one concept can be seen across different pieces.',
  },
} as const;
