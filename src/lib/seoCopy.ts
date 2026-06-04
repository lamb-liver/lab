/** Canonical title/description for section pages (also used as OG text via BaseLayout). */
export const siteSeo = {
  home: {
    title: '羊·實驗',
    description:
      '羊·實驗：以互動視覺化呈現數學公式、曲線與演算法。作品集展示單一主題，主題導覽串連跨概念實驗。',
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
  about: {
    title: '關於',
    description: '關於羊·實驗與作者背景，記錄以程式呈現數學形狀、演算法與互動作品的原因。',
  },
} as const;
