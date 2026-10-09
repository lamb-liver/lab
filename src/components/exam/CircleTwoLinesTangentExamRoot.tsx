import { useCallback, useMemo, useState } from 'react';
import type p5 from 'p5';
import {
  clampCenterA,
  minDistances,
  radiusForRatio,
  ratioIsThreeToOne,
  tangentSlopesFromOrigin,
} from '../../exam/ast-115-circle-two-lines-tangent/geometry';
import { renderCircleTwoLinesTangentExamScene } from '../../systems/rendering/circleTwoLinesTangentExamRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(340, Math.round(width * 0.62)) };
}

type Props = { locale?: 'en' };

export default function CircleTwoLinesTangentExamRoot({ locale }: Props) {
  const en = locale === 'en';
  const [a, setA] = useState(2);
  const radius = radiusForRatio(a);
  const feasible = ratioIsThreeToOne(a, radius);
  const { d1, d2 } = useMemo(() => minDistances(a, radius), [a, radius]);
  const slopes = tangentSlopesFromOrigin(a);

  const draw = useCallback(
    (p: p5) => {
      renderCircleTwoLinesTangentExamScene(p, {
        width: p.width,
        height: p.height,
        a,
      });
    },
    [a],
  );

  const canvasHostRef = useRectP5CanvasHost(draw, [], measureCanvas, undefined, {
    loop: false,
    redrawKey: a,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'A distance ratio, then tangents from the origin' : '距離比定圓 → 原點切線'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'The two lines are perpendicular and the center is on the x-axis. Why is the tangent slope independent of |a|?'
              : '兩直線互相垂直時，圓心在 x 軸上，為什麼切線斜率會跟 |a| 無關？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'Gold dashes are the tangents through the origin. The short blue and purple segments are the shortest distances from the circle to L₁ and L₂.'
              : '金色虛線是過原點的切線；藍、紫短線段是圓到 L₁、L₂ 的最短距離'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Circle centered at (${a.toFixed(1)}, 0) with radius ${radius.toFixed(2)}, showing the two perpendicular lines and the tangents from the origin`
                : `圓心在 (${a.toFixed(1)},0)、半徑 ${radius.toFixed(2)}，顯示兩垂線與原點切線`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Move the center' : '移動圓心'}
            </p>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'a (x-coordinate of the center)' : 'a（圓心橫坐標）'}</span>
              <output>{a.toFixed(1)}</output>
              <input
                type="range"
                aria-label={en ? 'x-coordinate a of the center on the x-axis' : '圓心在 x 軸上的橫坐標 a'}
                min="-6"
                max="6"
                step="0.1"
                value={a}
                onInput={(event) => setA(clampCenterA(Number(event.currentTarget.value)))}
              />
            </label>
            <p className="exam-interactive-explore__note">
              {en
                ? 'To miss both lines, |a| stays in the feasible range. Then r = |a|/2 makes d₁ = 3d₂.'
                : '為保持與兩線不相交，|a| 會被夾在可行區間；此時 r=|a|/2 恰使 d₁=3d₂。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Distance condition' : '距離條件'}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {feasible
                ? en
                  ? `d₁ = ${d1.toFixed(2)}, d₂ = ${d2.toFixed(2)}, ratio about 3:1`
                  : `d₁=${d1.toFixed(2)}，d₂=${d2.toFixed(2)}，比約 3:1`
                : en
                  ? 'Not yet in the non-meeting state with d₁:d₂ = 3:1'
                  : '尚未落在 d₁:d₂=3:1 的不相交狀態'}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'The shortest distance is the center-to-line distance minus the radius. d₁ and d₂ are positive only when the circle misses the line.'
                : '最短距離是圓心到直線距離減半徑；不相交才有正的 d₁、d₂。'}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? 'Tangent slopes' : '切線斜率'}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {slopes
                ? en
                  ? `m = ±√3/3 ≈ ±${slopes[0].toFixed(4)}`
                  : `m=±√3/3≈±${slopes[0].toFixed(4)}`
                : en
                  ? 'Move a until the circle misses both lines'
                  : '調整 a 使圓與兩線不相交'}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'A line through the origin is tangent when its distance from the center equals the radius. That simplifies to |m| = 1/√3, independent of the sign of a.'
                : '過原點的直線到圓心距離等於半徑，化簡後 |m|=1/√3，與 a 的正負無關。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
