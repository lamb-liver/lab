import { useCallback, useMemo, useState } from 'react';
import type p5 from 'p5';
import { offsetPoints } from '../../exam/gsat-112-skew-line-distance/geometry';
import { renderSkewLineDistanceExamScene } from '../../systems/rendering/skewLineDistanceExamRender';
import OrbitViewControls from '../curve/OrbitViewControls';
import { useOrbitViewP5 } from '../curve/useOrbitViewP5';
import type { CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

type Params = {
  yaw: number;
  pitch: number;
  offset: number;
};

const DEFAULT_PARAMS: Params = { yaw: 34, pitch: 24, offset: 3 };

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(330, Math.round(width * 0.64)) };
}

type Props = { locale?: 'en' };

export default function SkewLineDistanceExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [params, setParams] = useState(DEFAULT_PARAMS);
  const patchParams = useCallback((patch: Partial<Params>) => {
    setParams((current) => ({ ...current, ...patch }));
  }, []);
  const render = useCallback(
    (p: p5, current: Params, rotating: boolean) =>
      renderSkewLineDistanceExamScene(p, {
        width: p.width,
        height: p.height,
        ...current,
        rotating,
        locale,
      }),
    [locale],
  );
  const { canvasHostRef } = useOrbitViewP5({
    params,
    onParamsChange: patchParams,
    render,
    redrawKey: `${params.yaw}|${params.pitch}|${params.offset}`,
    measure: measureCanvas,
  });
  const pqDistance = useMemo(() => offsetPoints(params.offset).distance, [params.offset]);
  const pqExact = params.offset === 3 ? '5√2' : '√(32+2d²)';

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'The common perpendicular of skew lines' : '歪斜線的公垂線'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'P and Q are each 3 away from the common perpendicular. Why can’t you just take 3+4√2+3 as PQ?'
              : 'P、Q 各離公垂線 3，為什麼不能直接把 3+4√2+3 當成 PQ？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Drag the canvas to rotate. The gold line is the unique shortest segment between the two lines'
              : '拖動畫布旋轉；金線是兩直線間唯一的最短線段'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? 'Two skew lines, their common perpendicular, and points P and Q in space. Drag to rotate the view'
                : '兩條歪斜線、公垂線與點 P、Q 的空間關係；拖動可旋轉視角'
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Move along the lines' : '沿直線移動'}</p>
            <label className="exam-interactive-explore__range">
              <span>|AP|=|BQ|</span>
              <output>{params.offset.toFixed(1)}</output>
              <input
                type="range"
                aria-label={
                  en
                    ? 'Common distance d from P and Q to the feet of the common perpendicular'
                    : '點 P、Q 到公垂線交點的共同距離 d'
                }
                min="0"
                max="3"
                step="0.25"
                value={params.offset}
                onInput={(event) => patchParams({ offset: Number(event.currentTarget.value) })}
              />
            </label>
            <p className="exam-interactive-explore__result" aria-live="polite">
              |PQ|={pqExact}≈{pqDistance.toFixed(3)}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'The three segments are mutually perpendicular, so PQ²=(4√2)²+d²+d². When d=3, PQ=5√2.'
                : '三段方向互相垂直，所以 PQ²=(4√2)²+d²+d²。d=3 時，PQ=5√2。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'View' : '視角'}</p>
            <OrbitViewControls
              idPrefix="skew-line-distance"
              params={params}
              onParamsChange={patchParams}
              locale={locale}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
