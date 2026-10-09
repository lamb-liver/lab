import { learningPaths, type LearningPath } from './learningPaths';

/**
 * 策展路徑的英文文案（/en/path 用）。步驟順序與連結沿用 learningPaths.ts；
 * 這裡只放英文標題、描述與每一步的承接敘述（依步驟順序）。
 */
interface LearningPathCopyEn {
  title: string;
  description: string;
  notes: string[];
}

export const learningPathCopyEn: Record<string, LearningPathCopyEn> = {
  'trig-to-fourier': {
    title: 'From trigonometric functions to Fourier',
    description:
      'Start from trigonometric functions on the unit circle and watch single sine waves add up to a wide range of periodic signals. The path begins with high-school trigonometry and ends at Fourier series, a university topic.',
    notes: [
      'Define sin and cos on the unit circle: the geometric starting point for the whole path.',
      'Radians give periodicity a natural scale.',
      'Angle sums and identities: the algebra behind combining sine and cosine.',
      'Read the amplitude, period, and phase of a single sine wave.',
      'Exam problem: combine a sin x + b cos x into one sine wave, the first real step into superposition.',
      'Adding two waves becomes interference, from one dimension to two.',
      'A steady special case of superposition: the stationary wave.',
      'The end point: a well-behaved (for example, piecewise smooth) periodic function is a constant plus infinitely many sine waves; at a jump the series converges to the average of the two one-sided limits.',
    ],
  },
  'vectors-to-space': {
    title: 'From plane vectors to three-dimensional geometry',
    description:
      'Start from the basic operations on plane vectors and extend the dot product and projection to three dimensions. The cross product, normal vectors, and the distance from a point to a plane lead to a GSAT problem on distance in space.',
    notes: [
      'The two most basic vector operations: addition and scalar multiplication.',
      'Dot product = projection × length, which brings in angles and projection.',
      'Projection and decomposition deepen the geometry of the dot product.',
      'Up to three dimensions: vectors, planes, and lines in space.',
      'Cross product: the vector product that exists only in three dimensions.',
      'Normal vectors and the distance from a point to a plane, toward measuring distance in space.',
      'An exam problem to finish: use the whole path on a distance in space.',
    ],
  },
};

/** 英文版路徑：沿用 slug、concepts、steps，換上英文文案 */
export interface LearningPathEn extends Omit<LearningPath, 'title' | 'description'> {
  title: string;
  description: string;
}

export function learningPathEn(path: LearningPath): LearningPathEn {
  const copy = learningPathCopyEn[path.slug];
  if (!copy) throw new Error(`learning path "${path.slug}" has no English copy`);
  return {
    ...path,
    title: copy.title,
    description: copy.description,
    steps: path.steps.map((step, i) => ({ ...step, note: copy.notes[i] ?? '' })),
  };
}

export const learningPathsEn = (): LearningPathEn[] => learningPaths.map(learningPathEn);
