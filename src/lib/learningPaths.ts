/**
 * 策展學習路徑（B-lite）：人工排序的跨概念旅程。
 * 路徑從讀者已知處出發，可停在高中應用、也可跨到大學概念的圖像延伸——
 * 這是「策展路徑」，非課程系統：不承諾難度分級、學習進度或完整課綱。
 * 順序為策展者寫定（不用 order／audience）。純資料，無 astro:content 依賴。
 */

export type StepCollection = 'works' | 'explore' | 'exam';

export interface LearningPathStep {
  collection: StepCollection;
  slug: string;
  /** 承接敘述：為何這一步接在上一步之後 */
  note: string;
}

export interface LearningPath {
  slug: string;
  title: string;
  /** 寫清楚起點與延伸終點 */
  description: string;
  /** 此路徑涵蓋的概念 slug；用於概念頁入口 */
  concepts: string[];
  steps: LearningPathStep[];
}

export const learningPaths: LearningPath[] = [
  {
    slug: 'trig-to-fourier',
    title: '從三角函數到傅立葉',
    description:
      '從單位圓上的三角函數出發，看「一條正弦波」如何疊加成任意週期訊號——高中三角起步，終點延伸到大學的傅立葉級數。',
    concepts: ['trig-functions', 'trig-identities', 'wave-superposition'],
    steps: [
      { collection: 'works', slug: 'unit-circle-trig-definition', note: '從單位圓定義 sin/cos，全段的幾何起點。' },
      { collection: 'works', slug: 'radian-arc-length', note: '用弧度給週期性一把自然刻度。' },
      { collection: 'works', slug: 'trig-angle-identities', note: '角度合成與恆等式——疊合的代數基礎。' },
      { collection: 'works', slug: 'sinusoid-amplitude-period-phase', note: '讀懂「一條」正弦波的振幅、週期與相位。' },
      { collection: 'exam', slug: 'gsat-112-sinusoid-superposition', note: '考題：a sin x + b cos x 併成單一正弦，正式進入疊加。' },
      { collection: 'explore', slug: 'trig-wave-interference', note: '把兩波相加推廣成干涉，從一維到二維。' },
      { collection: 'works', slug: 'standing-wave', note: '疊加的定態特例：駐波。' },
      { collection: 'explore', slug: 'fourier-series', note: '終點：任意週期函數＝無窮正弦波的疊加。' },
    ],
  },
  {
    slug: 'vectors-to-space',
    title: '從平面向量到空間幾何',
    description:
      '從平面向量的基本運算出發，把內積與投影推廣到三維——外積、法向量與點面距離，收束在空間距離的學測考題。',
    concepts: ['vectors', 'dot-cross-product', 'space-vectors'],
    steps: [
      { collection: 'works', slug: 'vector-addition-scalar', note: '向量最基本的兩種運算：加法與純量乘法。' },
      { collection: 'works', slug: 'dot-product-geometry', note: '內積＝投影×長度，帶出角度與投影。' },
      { collection: 'works', slug: 'vector-projection', note: '投影與分解，深化內積的幾何。' },
      { collection: 'explore', slug: 'space-vectors-planes-lines', note: '升到三維：空間中的向量、平面與直線。' },
      { collection: 'works', slug: 'cross-product-geometry', note: '外積：三維特有的向量積。' },
      { collection: 'works', slug: 'plane-normal-distance', note: '法向量與點面距離，通往空間度量。' },
      { collection: 'exam', slug: 'gsat-112-skew-line-distance', note: '考題收束：把整段用在空間中的距離。' },
    ],
  },
];

export const getLearningPath = (slug: string): LearningPath | undefined =>
  learningPaths.find((p) => p.slug === slug);

/** 回傳涵蓋指定概念的路徑（供概念頁入口） */
export const pathsForConcept = (conceptSlug: string): LearningPath[] =>
  learningPaths.filter((p) => p.concepts.includes(conceptSlug));
