import { useCallback, useState } from "react";
import type p5 from "p5";
import {
  DEFAULT_X,
  X_LEFT,
  X_RIGHT,
  bound,
  clampX,
  distanceToF,
  distanceToLine,
  upperY,
} from "../../exam/gaokao-2024-i-distance-product-curve/geometry";
import { renderDistanceProductCurveExam } from "../../systems/rendering/distanceProductCurveExamRender";
import {
  useRectP5CanvasHost,
  type CanvasSize,
} from "../curve/useRectP5CanvasHost";
import "../../styles/components/exam/exam-interactive.css";

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(300, Math.round(width * 0.62)) };
}

type Props = { locale?: "en" };

export default function DistanceProductCurveExamRoot({ locale }: Props) {
  const en = locale === "en";
  const [x, setX] = useState(DEFAULT_X);
  const [showBound, setShowBound] = useState(false);
  const y = upperY(x) ?? 0;

  const draw = useCallback(
    (p: p5) =>
      renderDistanceProductCurveExam(p, {
        width: p.width,
        height: p.height,
        x,
        showBound,
      }),
    [x, showBound],
  );
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [],
    measureCanvas,
    undefined,
    {
      loop: false,
      redrawKey: `${x}-${showBound}`,
    },
  );

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en
              ? "Distance to F times distance to x = −2"
              : "到 F 的距離乘上到 x = −2 的距離"}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? "Think first" : "先想一想"}</strong>
            {en
              ? " At x = 2 the point is at height 1. Is that the highest point in the first quadrant?"
              : "x = 2 時點的高度是 1。這是第一象限的最高點嗎？"}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? "The curve passes the origin, so a = −2 and y² = 16/(x+2)² − (x−2)²."
              : "曲線過原點，所以 a = −2，y² = 16/(x+2)² − (x−2)²"}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Point P at (${x.toFixed(2)}, ${y.toFixed(3)}) on the curve`
                : `曲線上的點 P（${x.toFixed(2)}, ${y.toFixed(3)}）`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? "Move P" : "移動 P"}
            </p>
            <label className="exam-interactive-explore__range">
              <span>x</span>
              <output>{x.toFixed(2)}</output>
              <input
                id="curve-x"
                type="range"
                aria-label={en ? "x of point P" : "點 P 的 x"}
                min={X_LEFT}
                max={X_RIGHT}
                step={0.005}
                value={x}
                onInput={(event) =>
                  setX(clampX(Number(event.currentTarget.value)))
                }
              />
            </label>
            <div className="exam-interactive-explore__modes">
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={showBound ? "true" : "false"}
                aria-pressed={showBound}
                onClick={() => setShowBound((v) => !v)}
              >
                {en ? "Show y = 4/(x+2)" : "顯示 y = 4/(x+2)"}
              </button>
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? "At P" : "在 P 點"}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              y ≈ {y.toFixed(4)}
            </p>
            <p className="exam-interactive-explore__note">
              PF · d = {distanceToF(x, y).toFixed(3)} ×{" "}
              {distanceToLine(x).toFixed(3)} ={" "}
              {(distanceToF(x, y) * distanceToLine(x)).toFixed(3)}，4/(x+2) ={" "}
              {bound(x).toFixed(3)}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? "Near x ≈ 1.68 the height reaches about 1.039, above 1, so C is false. A, B, D hold."
                : "x ≈ 1.68 附近高度約 1.039，超過 1，所以 C 錯；A、B、D 對。"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
