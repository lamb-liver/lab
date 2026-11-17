import { useCallback, useState } from 'react';
import type p5 from 'p5';
import {
  SAMPLE_INSIDE_X,
  SAMPLE_OUTSIDE,
  clamp01,
  pyramidOf,
  type Vec3,
} from '../../exam/amc12a-2025-22-cube-pyramids/geometry';
import { renderCubePyramidsExam } from '../../systems/rendering/cubePyramidsExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.min(420, Math.max(280, Math.round(width * 0.64))) };
}

type Props = { locale?: 'en' };

const AXIS_NAME = {
  x: { zh: 'x 最大的那一塊', en: 'the pyramid where x is largest' },
  y: { zh: 'y 最大的那一塊', en: 'the pyramid where y is largest' },
  z: { zh: 'z 最大的那一塊', en: 'the pyramid where z is largest' },
} as const;

export default function CubePyramidsExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [point, setPoint] = useState<Vec3>(SAMPLE_INSIDE_X);
  const [yaw, setYaw] = useState(0.85);
  const [onlyX, setOnlyX] = useState(true);
  const [x, y, z] = point;
  const axis = pyramidOf(x, y, z);

  const draw = useCallback(
    (p: p5) => renderCubePyramidsExam(p, { width: p.width, height: p.height, x, y, z, yaw, onlyX }),
    [x, y, z, yaw, onlyX],
  );
  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: `${x}|${y}|${z}|${yaw}|${onlyX}`,
  });

  const setAxis = (index: 0 | 1 | 2, value: number) => {
    const next: [number, number, number] = [x, y, z];
    next[index] = clamp01(value);
    setPoint(next);
  };

  let status: string;
  if (!axis) {
    status = en
      ? 'The point is in the cube, and in none of the three pyramids.'
      : '點在正立方體裡，三塊錐體都不含它。';
  } else if (onlyX && axis !== 'x') {
    status = en
      ? `The condition holds, on ${AXIS_NAME[axis].en}, which is not drawn.`
      : `條件成立，點在 ${AXIS_NAME[axis].zh}，畫面沒有畫出那一塊。`;
  } else {
    status = en
      ? `The condition holds, on ${AXIS_NAME[axis].en}.`
      : `條件成立，點在 ${AXIS_NAME[axis].zh}。`;
  }
  const volume = onlyX
    ? en
      ? 'This one pyramid has volume 1/12.'
      : '這一塊的體積是 1/12。'
    : en
      ? 'Three pyramids, 1/12 each, together 1/4.'
      : '三塊各是 1/12，合起來是 1/4。';

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Three pyramids in the unit cube' : '單位正立方體裡的三塊錐體'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'The pyramid where x is largest has volume 1/12. Do the other two get added?'
              : 'x 最大的那一塊體積是 1/12。另外兩塊要不要加進去？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {onlyX
              ? en
                ? 'Gold is the pyramid where x is largest. Its base is the square of side 1/2 on the face x = 1, and the apex is the origin.'
                : '金色是 x 最大的那一塊。底在 x=1 這面、是邊長 1/2 的正方形，錐尖在原點。'
              : en
                ? 'Gold, blue, and purple sit on the faces x = 1, y = 1, and z = 1. All three apexes are the origin.'
                : '金、藍、紫分別貼在 x=1、y=1、z=1 三個面上，錐尖都在原點。'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Unit cube, sample point (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)}). ${status}`
                : `單位正立方體，樣本點 (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})。${status}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Sample point' : '樣本點'}</p>
            {(['x', 'y', 'z'] as const).map((name, index) => (
              <label key={name} className="exam-interactive-explore__range">
                <span>{name}</span>
                <output>{point[index].toFixed(2)}</output>
                <input
                  id={`pyramid-${name}`}
                  type="range"
                  aria-label={name}
                  min={0}
                  max={1}
                  step={0.01}
                  value={point[index]}
                  onInput={(event) => setAxis(index as 0 | 1 | 2, Number(event.currentTarget.value))}
                />
              </label>
            ))}
            <label className="exam-interactive-explore__range">
              <span>{en ? 'Turn' : '轉動'}</span>
              <output>{Math.round((yaw * 180) / Math.PI)}°</output>
              <input
                id="pyramid-yaw"
                type="range"
                aria-label={en ? 'Turn the cube' : '轉動正立方體'}
                min={0}
                max={Math.PI * 2}
                step={0.01}
                value={yaw}
                onInput={(event) => setYaw(Number(event.currentTarget.value))}
              />
            </label>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Which pyramids' : '畫出哪幾塊'}</p>
            <div className="exam-interactive-explore__modes">
              <button
                type="button"
                id="pyramid-only-one"
                className="exam-interactive-explore__mode-button"
                data-active={onlyX ? 'true' : 'false'}
                aria-pressed={onlyX}
                onClick={() => setOnlyX(true)}
              >
                {en ? 'Only x' : '只留一塊'}
              </button>
              <button
                type="button"
                id="pyramid-all-three"
                className="exam-interactive-explore__mode-button"
                data-active={onlyX ? 'false' : 'true'}
                aria-pressed={!onlyX}
                onClick={() => setOnlyX(false)}
              >
                {en ? 'All three' : '補上另外兩塊'}
              </button>
              <button type="button" className="exam-interactive-explore__mode-button" onClick={() => setPoint(SAMPLE_INSIDE_X)}>
                {en ? 'Inside' : '放進一塊裡'}
              </button>
              <button type="button" id="pyramid-outside" className="exam-interactive-explore__mode-button" onClick={() => setPoint(SAMPLE_OUTSIDE)}>
                {en ? 'Outside' : '放在三塊外面'}
              </button>
            </div>
            <p id="pyramid-readout" className="exam-interactive-explore__result" aria-live="polite">
              {status} {volume}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
