/** 疊代動力學 explore：共用常數。純資料，無 p5／React 依賴。 */

export const R_MIN = 1;
export const R_MAX = 4;
export const R_STEP = 0.01;
export const R_DEFAULT = 3.2; // 週期-2 區，視覺上最能看出疊代的非平凡行為

export const X0_MIN = 0.05;
export const X0_MAX = 0.95;
export const X0_STEP = 0.01;
export const X0_DEFAULT = 0.2;

/** 蛛網圖描繪的疊代步數（每步一段垂直 + 一段水平） */
export const COBWEB_STEPS = 48;
/** 邏輯斯蒂拋物線取樣點數 */
export const CURVE_SAMPLES = 240;

/** 行為分類時丟棄的暫態步數與檢查的尾段長度 */
export const CLASSIFY_TRANSIENT = 400;
export const CLASSIFY_TAIL = 64;
export const CLASSIFY_MAX_PERIOD = 8;
export const CLASSIFY_EPS = 1e-4;

/** 分岔圖取樣：欄數（r 掃描）、每欄丟棄暫態、每欄收集吸引子點數 */
export const BIF_COLUMNS = 280;
export const BIF_TRANSIENT = 250;
export const BIF_SAMPLES = 40;

/** 混沌遊戲：三角形頂點（[0,1]² 座標）、總點數、暖機、種子、跳躍比例 */
export const CHAOS_VERTICES = [
  [0.5, 0.06],
  [0.06, 0.94],
  [0.94, 0.94],
] as const;
export const CHAOS_STEPS = 12000;
export const CHAOS_WARMUP = 20;
export const CHAOS_SEED = 1;
export const CHAOS_RATIO_MIN = 0.3;
export const CHAOS_RATIO_MAX = 0.6;
export const CHAOS_RATIO_STEP = 0.01;
export const CHAOS_RATIO_DEFAULT = 0.5; // 0.5 + 三頂點 = 謝爾賓斯基三角形
/** 每幀新增的點數（漸進累積動畫） */
export const CHAOS_POINTS_PER_FRAME = 240;

export const CHAOS_STYLE = {
  point: 'rgba(212, 184, 122, 0.7)', // 散點
  vertex: 'rgb(120, 200, 180)', // 三角形頂點
} as const;

export const BIF_STYLE = {
  point: 'rgba(212, 184, 122, 0.55)', // 吸引子散點
  axis: 'rgba(150, 150, 160, 0.5)',
  marker: 'rgb(120, 200, 180)', // 目前 r 的垂直標記
} as const;

export const COBWEB_STYLE = {
  curve: 'rgb(212, 184, 122)', // 邏輯斯蒂拋物線 y = r x(1-x)
  diagonal: 'rgba(180, 180, 190, 0.45)', // y = x
  web: 'rgba(232, 232, 240, 0.85)', // 蛛網階梯
  axis: 'rgba(150, 150, 160, 0.5)',
  start: 'rgb(120, 200, 180)', // 起點 x0
} as const;
