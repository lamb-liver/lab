/**
 * 2025 AMC 12B #21：兩邊 8、9，夾角 θ 與 180°−θ。
 * 面積都是 36 sin θ。第三邊平方和是 290。
 * 1 < t < 17 裡，平方和為 290 的整數只有 11 與 13。
 * cos θ = 1/6 時第三邊是 11，補角是 13，和是 24。
 * t = 1 與 t = 17 對應 cos = ±1，面積是 0，不是三角形。
 */

export const SIDE_U = 8;
export const SIDE_V = 9;
export const COS_PAIR = 1 / 6;

export function acuteTheta(): number {
  return Math.acos(COS_PAIR);
}

export function obtuseTheta(): number {
  return Math.PI - acuteTheta();
}

/** 第三邊。平方是 145 − 144 cos θ。 */
export function thirdSide(theta: number): number {
  const square = SIDE_U ** 2 + SIDE_V ** 2 - 2 * SIDE_U * SIDE_V * Math.cos(theta);
  return Math.sqrt(Math.max(0, square));
}

/** (1/2)·8·9·sin θ */
export function triangleArea(theta: number): number {
  return 0.5 * SIDE_U * SIDE_V * Math.sin(theta);
}

export type Point2 = { x: number; y: number };

/** 夾角在原點，長 9 的邊沿正 x 軸，長 8 的邊張角 θ。 */
export function apex(theta: number): Point2 {
  return { x: SIDE_U * Math.cos(theta), y: SIDE_U * Math.sin(theta) };
}

/** (1, 17) 裡平方和為 290 的整數對。退化的 1 與 17 不在這個開區間。 */
export function integerThirdSides(): [number, number][] {
  const pairs: [number, number][] = [];
  for (let left = 2; left <= 16; left += 1) {
    for (let right = left; right <= 16; right += 1) {
      if (left * left + right * right === 290) pairs.push([left, right]);
    }
  }
  return pairs;
}
