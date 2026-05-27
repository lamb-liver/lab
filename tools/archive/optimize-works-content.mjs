/**
 * Historical one-shot migration tool (2026-05-27).
 * 依 textstyle.md 批次優化 src/content/works/*.md
 * 執行：node tools/archive/optimize-works-content.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const WORKS_DIR = fileURLToPath(new URL('../../src/content/works/', import.meta.url));

const INTERACTIVE = {
  'rose-curve': {
    interact: [
      '- **花瓣數 k**：拖動滑桿改變整數 k，觀察奇數 k 得 k 瓣、偶數 k 得 2k 瓣',
      '- **漸顯生長**：曲線沿極角逐步畫出；切換 k 時重新由中心向外生長',
    ],
    observe: [
      '- $r=a\\cos(k\\theta)$ 在極座標下呈現對稱花瓣',
      '- 花瓣交會處對應 $\\cos(k\\theta)=0$ 的方向',
      '- 同一 k 下曲線對原點呈旋轉對稱',
    ],
    related: [
      '[利薩茹曲線](/works/lissajous-curve)',
      '[繁花曲線](/works/spirograph-curve)',
      '[諧振圖](/works/harmonograph-curve)',
    ],
  },
  'lissajous-curve': {
    interact: [
      '- **頻率 a、b**：改變比值 $a:b$，觀察軌道結節數與圖形複雜度',
      '- **相位 δ**：拖動相位差，軌道在鎖定與扭曲之間連續變形',
    ],
    observe: [
      '- 頻率互質時軌道較易填滿矩形區域；比例簡單時圖形更對稱',
      '- $\\delta$ 決定圖形相對座標軸的旋轉感，不改變頻率比本身',
      '- $A=B$ 時軌道落在正方形邊界內，便於比較不同 $a:b$',
    ],
    related: [
      '[玫瑰曲線](/works/rose-curve)',
      '[諧振圖](/works/harmonograph-curve)',
      '[三角函數的疊加與波的干涉](/explore/trig-wave-interference)',
    ],
  },
  'harmonograph-curve': {
    interact: [
      '- **頻率 a、b**：切換整數頻率比，軌道結構瞬間更新並重新漸顯',
      '- **相位 δ**：連續調整起始相位，觀察軌道扭轉',
      '- **阻尼 d**：增大 d 時軌道更快向中心收斂',
    ],
    observe: [
      '- 阻尼因子 $e^{-dt}$ 使振幅隨時間衰減，軌道呈螺旋收斂',
      '- 不同 $a:b$ 與 $\\delta$ 組合產生互不重疊的幾何花紋',
      '- 長時間取樣後軌道密集處即視覺上的「圖案密度」',
    ],
    related: [
      '[利薩茹曲線](/works/lissajous-curve)',
      '[繁花曲線](/works/spirograph-curve)',
    ],
  },
  'spirograph-curve': {
    interact: [
      '- **大圓 R、小圓 r**：改變內擺線角數結構；切換時圖形重新漸顯',
      '- **筆尖 d**：調整筆尖離小圓中心距離，花瓣尖銳度與交錯感連續變化',
    ],
    observe: [
      '- 閉合軌道週期與 $\\gcd(R,r)$ 有關；比例互質時圖案較豐富',
      '- $d$ 接近 $r$ 時易出現尖瓣；$d$ 較小時圖形更內斂',
      '- 內擺線是「小圓在大圓內滾動」的幾何結果',
    ],
    related: [
      '[玫瑰曲線](/works/rose-curve)',
      '[利薩茹曲線](/works/lissajous-curve)',
      '[傅立葉級數](/explore/fourier-series)',
    ],
  },
  'standing-wave': {
    interact: [
      '- **振幅 A**：調大時波峰升高，上下包絡隨之張開',
      '- **空間頻率 k**：改變波節與波腹數量；切換時波形由中心重新漸顯',
      '- **時間速度 ω**：控制駐波振盪快慢',
    ],
    observe: [
      '- 節點處位移恆為零，腹點振幅最大',
      '- 包絡線 $\\pm 2A\\sin(kx)$ 不隨時間平移',
      '- 兩列反向行進波疊加才形成駐波，不是單一行進波',
    ],
    related: [
      '[三角函數的疊加與波的干涉](/explore/trig-wave-interference)',
      '[干涉條紋](/works/interference-fringes)',
      '[克拉尼圖形](/works/chladni-figures)',
    ],
  },
  'interference-fringes': {
    interact: [
      '- **波源距離 d**：改變雙曲線包絡族的開口與疏密',
      '- **波長 λ**：調整條紋間距；切換時圖形由內向外重新漸顯',
      '- **時間速度 ω**：驅動波動相位，亮紋位置隨時間起伏',
    ],
    observe: [
      '- 亮紋軌跡為雙曲線；波程差 $\\Delta r=n\\lambda$ 決定相長干涉',
      '- $d$ 與 $\\lambda$ 共同決定條紋密度，非單一參數',
      '- 雙源對稱時，干涉圖樣關於中垂線對稱',
    ],
    related: [
      '[三角函數的疊加與波的干涉](/explore/trig-wave-interference)',
      '[駐波圖](/works/standing-wave)',
      '[克拉尼圖形](/works/chladni-figures)',
    ],
  },
  'chladni-figures': {
    interact: [
      '- **模態 m、n**：調整正整數模態，波節線圖案即時改變',
      '- **振動速度 ω**：控制沙粒重新分布的快慢',
    ],
    observe: [
      '- 沙粒停駐於振幅為零的波節線，而非腹點',
      '- $(m,n)$ 與 $(n,m)$ 給出不同對稱性的圖案',
      '- 圖案是薄板本征振動在平面上的節線結構',
    ],
    related: [
      '[三角函數的疊加與波的干涉](/explore/trig-wave-interference)',
      '[駐波圖](/works/standing-wave)',
      '[干涉條紋](/works/interference-fringes)',
    ],
  },
  'parabolic-reflection': {
    interact: [
      '- **焦距 p**：改變拋物線開口；焦點位置隨之移動',
      '- **光束數**：增減從焦點出發的反射線數量',
      '- **掃描速度 ω**：控制入射光束繞焦點旋轉的快慢',
    ],
    observe: [
      '- 自焦點發出的光線經拋物面反射後彼此平行',
      '- 拋物線形狀與焦距 $p$ 直接決定反射後光束的匯聚／平行關係',
      '- 旋轉掃描時可見整束平行光被「掃過」鏡面',
    ],
    related: [
      '[二次曲線包絡線](/works/conic-envelope)',
      '[焦點軌跡](/works/conic-focus-locus)',
      '[二次曲線的幾何動態軌跡](/explore/conic-dynamic-geometry)',
    ],
  },
  'conic-envelope': {
    interact: [
      '- **直線密度**：增減包絡線族中直線數量，觀察輪廓清晰度',
      '- **變形比例**：連續改變截距比，包絡線呼吸式形變',
      '- **時間速度 ω**：驅動直線族動態，包絡輪廓隨之起伏',
    ],
    observe: [
      '- 一族直線的包絡可形成拋物線型輪廓',
      '- 截距比連續變化時，包絡線平滑變形而非跳變',
      '- 包絡線是「每一瞬間與族中某直線相切」的軌跡',
    ],
    related: [
      '[焦點軌跡](/works/conic-focus-locus)',
      '[拋物線反射](/works/parabolic-reflection)',
    ],
  },
  'conic-focus-locus': {
    interact: [
      '- **半長軸 a**：改變橢圓大小；軌道點仍滿足 $PF_1+PF_2=2a$',
      '- **離心率 e**：調整橢圓扁率，雙焦點間距隨 $c=ae$ 改變',
      '- **軌道速度 ω**：控制動點繞橢圓運行的快慢',
    ],
    observe: [
      '- 橢圓上任一點到兩焦點距離之和恆為 $2a$',
      '- $e$ 愈大橢圓愈扁，焦點愈靠近邊界',
      '- 焦點連線與動點軌跡共同固定橢圓的幾何定義',
    ],
    related: [
      '[二次曲線包絡線](/works/conic-envelope)',
      '[拋物線反射](/works/parabolic-reflection)',
      '[二次曲線的幾何動態軌跡](/explore/conic-dynamic-geometry)',
    ],
  },
  'linear-transform-grid': {
    interact: [
      '- **X 剪切 b**：拖動滑桿使垂直線傾斜，觀察平行四邊形格變形',
      '- **Y 伸縮 d**：控制垂直方向拉伸或壓縮',
      '- **變換速度 ω**：網格隨時間微幅呼吸，仍保持直線映射為直線',
    ],
    observe: [
      '- 線性變換下原點固定，直線仍映射為直線',
      '- 剪切改變角度但不改變平行性',
      '- 同時剪切與伸縮可產生一般仿射網格，預覽矩陣作用效果',
    ],
    related: [
      '[矩陣與線性變換](/explore/matrix-linear-transform)',
      '[仿射變換圖樣](/works/affine-transform-pattern)',
      '[旋轉縮放疊加](/works/rotation-scale-composition)',
    ],
  },
  'affine-transform-pattern': {
    interact: [
      '- **旋轉角度 θ**：改變每次疊代的旋轉量，圖樣對稱性隨之改變',
      '- **平移距離 e**：控制圖樣在平面上的間距與密度',
      '- **演變速度 ω**：驅動參數週期變化，圖樣連續演化',
    ],
    observe: [
      '- 反覆仿射映射可產生週期或準週期圖樣',
      '- 平移與旋轉組合決定圖樣的格子結構',
      '- 參數連續變化時圖樣平滑變形，而非瞬間替換',
    ],
    related: [
      '[線性變換網格](/works/linear-transform-grid)',
      '[碎形仿射疊代](/works/affine-ifs-fractal)',
      '[旋轉縮放疊加](/works/rotation-scale-composition)',
    ],
  },
  'rotation-scale-composition': {
    interact: [
      '- **旋轉步進 θ**：每次疊加方塊的旋轉角；改變螺旋感',
      '- **縮放比例 s**：控制每步縮放，影響圖樣向中心收斂或發散',
      '- **演變速度 ω**：驅動參數週期變化，觀察螺旋圖樣演化',
    ],
    observe: [
      '- 旋轉與縮放複合對應矩陣乘法，順序影響結果',
      '- 縮放因子接近 1 時圖樣更密集；過小則快速收斂至中心',
      '- 反覆疊代產生對數螺線型的視覺結構',
    ],
    related: [
      '[線性變換網格](/works/linear-transform-grid)',
      '[仿射變換圖樣](/works/affine-transform-pattern)',
      '[等角螺線](/works/equiangular-spiral)',
    ],
  },
  'affine-ifs-fractal': {
    interact: [
      '- **葉片彎曲 b**：調整仿射映射的剪切，改變葉片彎度',
      '- **側枝高度 d**：控制分支位置，影響整體輪廓',
      '- **生成速度 ω**：加快點雲累積，觀察碎形輪廓浮現',
    ],
    observe: [
      '- 隨機迭代多組仿射映射，點雲趨向自相似結構',
      '- 參數微調即可在「樹狀／蕨類」輪廓間連續過渡',
      '- 邊界由大量軌跡點的分布密度決定，非單一曲線',
    ],
    related: [
      '[仿射變換圖樣](/works/affine-transform-pattern)',
      '[謝爾賓斯基三角形](/works/sierpinski-triangle)',
    ],
  },
  'riemann-sum': {
    interact: [
      '- **分割數 n**：增加矩形條數，觀察面積和逼近曲線下方區域',
      '- **區間端點**：改變積分上下限，矩形區域隨之平移伸縮',
    ],
    observe: [
      '- 矩形高度取函數在子區間的值，面積和即黎曼和',
      '- $n$ 增大時和式一般更接近定積分（對可積函數）',
      '- 曲線彎曲愈劇，有限 $n$ 的誤差愈明顯',
    ],
    related: [
      '[切線逼近動畫](/works/tangent-approximation)',
      '[極限與黎曼和](/explore/limits-riemann-sum)',
    ],
  },
  'tangent-approximation': {
    interact: [
      '- **目標跨度 Δx**：縮小割線對應的 $x$ 間距，觀察割線逼近切線',
      '- **波動頻率 k**：改變曲線彎曲程度，切線斜率隨位置變化',
      '- **時間速度 ω**：驅動割線端點沿曲線移動',
    ],
    observe: [
      '- 割線斜率 $\\Delta y/\\Delta x$ 在 $\\Delta x\\to 0$ 時趨近切線斜率',
      '- 曲率大的區段，相同 $\\Delta x$ 下割線與切線差異更明顯',
      '- 導數是瞬時變化率，不是平均變化率',
    ],
    related: [
      '[黎曼和動態圖](/works/riemann-sum)',
      '[極限與黎曼和](/explore/limits-riemann-sum)',
      '[曳物線](/works/catenary)',
    ],
  },
  'catenary': {
    interact: [
      '- **固定繩長 L**：改變繩索長度，雙軌下垂程度隨之改變',
      '- **歷史範圍 t**：拉長可視時間窗，觀察更多曳物線軌跡',
      '- **時間速度 ω**：控制追蹤點沿軌道移動的快慢',
    ],
    observe: [
      '- 曳物線是「後端被等速拉動的端點」之軌跡',
      '- 繩長不足時下垂更明顯；繩長接近跨度時曲線較平',
      '- 上下對稱雙軌反映同一參數方程的正負分支',
    ],
    related: [
      '[切線逼近動畫](/works/tangent-approximation)',
      '[等角螺線](/works/equiangular-spiral)',
    ],
  },
  'equiangular-spiral': {
    interact: [
      '- **增長係數 b**：控制螺線向外開展的快慢',
      '- **最大幅角 θ_max**：限制可見螺線範圍；曲線沿角度漸顯',
      '- **旋轉速度 ω**：整體圖形繞原點緩慢旋轉',
    ],
    observe: [
      '- 極徑 $r=ae^{b\\theta}$ 使任意過原點射線與曲線交角恆定',
      '- $\\theta$ 增大時螺線圈距指數級擴張',
      '- 旋轉視角不改變交角性質，只改變觀看方向',
    ],
    related: [
      '[費波那契螺線](/works/fibonacci-spiral)',
      '[旋轉縮放疊加](/works/rotation-scale-composition)',
    ],
  },
  'vector-field-streamlines': {
    interact: [
      '- **流線數量**：增減同時積分的流線條數',
      '- **積分步數**：步數愈多單條流線愈長、細節愈多',
      '- **流動速度 ω**：驅動向量場隨時間變化，流線形狀連續更新',
    ],
    observe: [
      '- 流線切向對齊向量場，可視為微分方程的幾何解',
      '- 漩渦中心附近流線密集環繞',
      '- 同一場中不同起點的流線互不相交（除奇點外）',
    ],
    related: [
      '[向量場的基本圖樣](/works/vector-field-patterns)',
      '[微分方程的幾何視覺化](/explore/differential-equations-geometry)',
    ],
  },
  'complex-arithmetic-geometry': {
    interact: [
      '- **$r_1,\\theta_1$ 與 $r_2,\\theta_2$**：分別控制 $z_1$、$z_2$ 的模長與幅角',
      '- **加法向量**：觀察 $z_1+z_2$ 與平行四邊形對角線重合',
      '- **乘法向量**：觀察 $z_1 z_2$ 的模長相乘、幅角相加',
    ],
    observe: [
      '- 複數加法即平面向量加法',
      '- 複數乘法在極形式下為伸縮與旋轉的複合',
      '- 單位圓提供模長 1 的參考尺度',
    ],
    related: [
      '[複數的極座標形式](/works/complex-polar-form)',
      '[尤拉公式旋轉動畫](/works/euler-formula-rotation)',
      '[複數與尤拉公式](/explore/complex-euler-formula)',
    ],
  },
  'complex-polar-form': {
    interact: [
      '- **模長 r**：拖動滑桿改變向量長度',
      '- **幅角 θ**：旋轉向量，同步更新實部、虛部投影與 $\\theta$ 弧線',
    ],
    observe: [
      '- $x=r\\cos\\theta$、$y=r\\sin\\theta$ 為直角與極座標的對應',
      '- 模長 $r$ 決定離原點距離，幅角 $\\theta$ 決定方向',
      '- 同一 $z$ 可在直角形式 $x+yi$ 與極形式 $re^{i\\theta}$ 間對照',
    ],
    related: [
      '[複數四則運算的幾何意義](/works/complex-arithmetic-geometry)',
      '[尤拉公式旋轉動畫](/works/euler-formula-rotation)',
    ],
  },
  'euler-formula-rotation': {
    interact: [
      '- **振幅 A**：改變旋轉向量長度與右側正弦波振幅',
      '- **角頻率 ω**：控制旋轉快慢與波形疏密',
      '- **初相位 δ**：平移旋轉起點與波形相位',
    ],
    observe: [
      '- 複平面上旋轉向量的虛部，對應時域正弦波高度',
      '- $e^{i(\\omega t+\\delta)}$ 將圓周運動與三角函數寫在同一式中',
      '- 角頻率同時決定旋轉週期與波形空間週期',
    ],
    related: [
      '[複數的極座標形式](/works/complex-polar-form)',
      '[複數與尤拉公式](/explore/complex-euler-formula)',
      '[朱利亞集合](/works/julia-set)',
    ],
  },
  'julia-set': {
    interact: [
      '- **參數漂移**：開啟時 $c$ 沿曼德博集邊界附近緩慢移動，分形拓撲持續演化',
      '- **Re(c)、Im(c)**：關閉漂移後手動調整 $c$，邊界即時重算',
      '- **最大迭代**：提高迭代上限可細化邊界，但計算較慢',
    ],
    observe: [
      '- 對固定 $c$，有界軌跡的邊界即朱利亞集',
      '- $|z_n|>2$ 時迭代發散；發散快慢決定外圍色帶',
      '- 不同 $c$ 可在連通枝狀結構與康托爾型碎形間過渡',
    ],
    related: [
      '[尤拉公式旋轉動畫](/works/euler-formula-rotation)',
      '[謝爾賓斯基三角形](/works/sierpinski-triangle)',
      '[邏輯斯諦映射分岔圖](/works/logistic-bifurcation)',
    ],
    paramsIntro:
      '對固定複常數 $c$，朱利亞集 $J_c$ 為迭代 $f(z)=z^2+c$ 下有界軌跡的邊界。若 $|z_n|>2$ 則視為發散；逃逸快慢映射為色帶，內部保持黑色。',
  },
};

const ENGINEERING_RE =
  /lerp|reveal|描點|直接產出|函式庫|像素|步長|gcd|採樣上限|笛卡爾|極座標轉換|8000|ImageData|tile|零配置|out 參數|Progressive|離屏|noLoop|deltaTime|函數庫/i;

function parseSections(body) {
  const parts = body.split(/^## /m).filter(Boolean);
  const sections = new Map();
  for (const part of parts) {
    const nl = part.indexOf('\n');
    const title = part.slice(0, nl).trim();
    const content = part.slice(nl + 1).trim();
    sections.set(title, content);
  }
  return sections;
}

function sectionsToBody(sections, order) {
  return order
    .filter((k) => sections.has(k))
    .map((k) => `## ${k}\n\n${sections.get(k).trim()}`)
    .join('\n\n') + '\n';
}

function parseLinksBlock(text) {
  const links = [];
  const exploreRe =
    /(?:視覺化主題：)?\[([^\]]+)\]\((\/explore\/[^)]+)\)/g;
  const worksRe = /\[([^\]]+)\]\((\/works\/[^)]+)\)/g;
  let m;
  while ((m = exploreRe.exec(text))) links.push({ label: m[1], href: m[2] });
  while ((m = worksRe.exec(text))) links.push({ label: m[1], href: m[2] });
  return links;
}

function formatRelated(links) {
  if (links.length === 0) return '';
  return links.map((l) => `- [${l.label}](${l.href})`).join('\n');
}

function cleanInteractBullets(text) {
  return text
    .split('\n')
    .filter((line) => line.trim().startsWith('-'))
    .filter((line) => !ENGINEERING_RE.test(line))
    .map((line) => line.replace(/^- \*\*實作\*\*：/, '- **互動**：'));
}

function tcFix(text) {
  return text
    .replace(/Cantor/g, '康托爾')
    .replace(/Standing Wave/g, '駐波')
    .replace(/Interference Fringes/g, '干涉條紋')
    .replace(/Chladni Figures/g, '克拉尼圖形')
    .replace(/Harmonograph/g, '諧振記錄器')
    .replace(/Spirograph \/ Hypotrochoid/g, '內擺線')
    .replace(/Spirograph \/ 內擺線/g, '內擺線')
    .replace(/（Standing Wave）/g, '')
    .replace(/歐拉公式/g, '尤拉公式');
}

function optimizeFile(filePath) {
  const slug = path.basename(filePath, '.md');
  const raw = fs.readFileSync(filePath, 'utf8');
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return false;

  let fm = fmMatch[1];
  let body = fmMatch[2].trimStart();

  fm = fm.replace(/Harmonograph/g, '諧振記錄器').replace(/Spirograph/g, '內擺線');

  const sections = parseSections(body);

  if (sections.has('概述')) {
    const overview = sections.get('概述').trim();
    const params = sections.get('參數方程') ?? '';
    const merged = params.startsWith(overview)
      ? params
      : `${overview}\n\n${params}`.trim();
    sections.set('參數方程', tcFix(merged));
    sections.delete('概述');
  }

  if (sections.has('參數方程')) {
    sections.set('參數方程', tcFix(sections.get('參數方程')));
  }

  const oldRelated =
    sections.get('相關連結') ?? sections.get('相關作品') ?? '';
  let relatedLinks = parseLinksBlock(oldRelated);
  sections.delete('相關連結');

  const spec = INTERACTIVE[slug];
  if (spec) {
    if (spec.paramsIntro && sections.has('參數方程')) {
      const p = sections.get('參數方程');
      if (!p.includes(spec.paramsIntro.slice(0, 20))) {
        sections.set(
          '參數方程',
          `${spec.paramsIntro}\n\n${p.replace(/^逃逸判斷：[^\n]+\n?/m, '')}`.trim(),
        );
      }
    }
    sections.set('互動說明', spec.interact.join('\n'));
    sections.set('觀察重點', spec.observe.join('\n'));
    relatedLinks = spec.related.map((line) => {
      const m = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
      return { label: m[1], href: m[2] };
    });
  } else {
    const oldImpl = sections.get('實作要點') ?? sections.get('互動說明') ?? '';
    let bullets = cleanInteractBullets(oldImpl);
    if (bullets.length === 0) {
      bullets = ['- **參數滑桿**：拖動滑桿，觀察圖形或數值如何隨參數連續變化'];
    }
    sections.set('互動說明', bullets.join('\n'));
    sections.delete('實作要點');
    sections.delete('觀察重點');
  }

  sections.delete('實作要點');

  if (relatedLinks.length > 0) {
    sections.set('相關作品', formatRelated(relatedLinks));
  }

  if (sections.has('延伸閱讀')) {
    sections.set('延伸閱讀', tcFix(sections.get('延伸閱讀')));
  }

  const order = [
    '參數方程',
    '互動說明',
    '觀察重點',
    '相關作品',
    '延伸閱讀',
  ];
  const newBody = sectionsToBody(sections, order);
  fs.writeFileSync(filePath, `---\n${fm}\n---\n\n${newBody}`, 'utf8');
  return true;
}

const files = fs.readdirSync(WORKS_DIR).filter((f) => f.endsWith('.md'));
let count = 0;
for (const f of files) {
  if (optimizeFile(path.join(WORKS_DIR, f))) count++;
}
console.log(`Optimized ${count} works files.`);
