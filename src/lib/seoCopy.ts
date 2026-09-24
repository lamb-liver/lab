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
