import { useCallback, useState } from "react";
import type p5 from "p5";
import {
  DEFAULT_L,
  L_MAX,
  L_MIN,
  clampL,
  readPyramid,
} from "../../exam/gaokao-2022-i-pyramid-in-sphere-volume/geometry";
import { renderPyramidInSphereExam } from "../../systems/rendering/pyramidInSphereExamRender";
import {
  useRectP5CanvasHost,
  type CanvasSize,
} from "../curve/useRectP5CanvasHost";
import "../../styles/components/exam/exam-interactive.css";

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return {
    width,
    height:
      width < 560
        ? Math.round(width * 1.25)
        : Math.max(340, Math.round(width * 0.55)),
  };
}

type Props = { locale?: "en" };

export default function PyramidInSphereVolumeExamRoot({ locale }: Props) {
  const en = locale === "en";
  const [l, setL] = useState(DEFAULT_L);
  const r = readPyramid(l);

  const draw = useCallback(
    (p: p5) =>
      renderPyramidInSphereExam(p, { width: p.width, height: p.height, l }),
    [l],
  );
  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [],
    measureCanvas,
    undefined,
    { loop: false, redrawKey: l },
  );

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? "Axial section and the volume curve" : "軸截面與體積曲線"}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? "Think first" : "先想一想"}</strong>
            {en
              ? " l runs from 3 to 3√3. Is the largest volume at the long end?"
              : "l 從 3 走到 3√3。體積最大的時候，是 l 最長的時候嗎？"}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? "The apex and the base corners sit on the sphere, so h = l²/6. A longer edge makes the pyramid taller but its base narrower."
              : "頂點和底面四角都在球面上，所以 h = l²/6。側棱越長，錐越高，底面卻越窄"}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Pyramid in a sphere of radius 3, l = ${r.l.toFixed(2)}, volume ${r.volume.toFixed(2)}`
                : `半徑 3 的球內正四棱錐，l = ${r.l.toFixed(2)}，體積 ${r.volume.toFixed(2)}`
            }
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? "Lateral edge" : "側棱長"}
            </p>
            <label className="exam-interactive-explore__range">
              <span>l</span>
              <output>{r.l.toFixed(2)}</output>
              <input
                id="pyramid-l"
                type="range"
                aria-label={en ? "Lateral edge l" : "側棱長 l"}
                min={L_MIN}
                max={L_MAX}
                step={0.01}
                value={l}
                onInput={(event) =>
                  setL(clampL(Number(event.currentTarget.value)))
                }
              />
            </label>
            <p className="exam-interactive-explore__note">
              h = {r.height.toFixed(3)}，{en ? "base side" : "底面邊長"} ={" "}
              {r.side.toFixed(3)}
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">
              {en ? "Volume" : "體積"}
            </p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              V ≈ {r.volume.toFixed(3)}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? "l = 3 gives 27/4 = 6.75, l = 3√3 gives 81/4 = 20.25, but l = 2√6 (h = 4) gives 64/3 ≈ 21.33. The range is [27/4, 64/3]."
                : "l = 3 時 27/4 = 6.75，l = 3√3 時 81/4 = 20.25，但 l = 2√6（h = 4）時是 64/3 ≈ 21.33。範圍是 [27/4, 64/3]。"}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
