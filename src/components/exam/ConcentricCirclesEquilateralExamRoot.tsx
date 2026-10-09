import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import { prefersReducedMotion } from '../../lib/reducedMotion';
import {
  OFFICIAL_SIDE_SQUARED,
  distance,
  polar,
  solutionBAngle,
  uniqueConfiguration,
  type Turn,
} from '../../exam/amc12b-2025-25-concentric-circles-equilateral/geometry';
import {
  concentricPlot,
  renderConcentricCirclesEquilateralExamScene,
  toScreen,
  worldFromScreen,
} from '../../systems/rendering/concentricCirclesEquilateralExamRender';
import {
  useRectP5CanvasHost,
  type CanvasSize,
  type ExtendSketch,
} from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

const ROTATE_MS = 1400;

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(400, Math.round(width * 0.86)) };
}

function toDeg(rad: number): number {
  return ((((rad * 180) / Math.PI) % 360) + 360) % 360;
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

export default function ConcentricCirclesEquilateralExamRoot({ locale }: { locale?: 'en' }) {
  const en = locale === 'en';
  const [aAngle, setAAngle] = useState(toRad(200));
  const [bAngle, setBAngle] = useState(toRad(20));
  const [progress, setProgress] = useState(0);
  const [turn, setTurn] = useState<Turn>(-1);
  const [playing, setPlaying] = useState(false);
  const progressRef = useRef(progress);
  progressRef.current = progress;
  const stateRef = useRef({ aAngle, bAngle });
  stateRef.current = { aAngle, bAngle };
  const dragRef = useRef<'a' | 'b' | null>(null);

  const config = useMemo(() => uniqueConfiguration(aAngle, turn), [aAngle, turn]);
  const done = progress >= 0.999;

  useEffect(() => {
    if (!playing) return;
    const from = progressRef.current >= 0.999 ? 0 : progressRef.current;
    const start = performance.now();
    // 減少動態：直接跳到終點
    const duration = prefersReducedMotion() ? 0 : ROTATE_MS * (1 - from);
    let frame = 0;
    const tick = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      setProgress(from + (1 - from) * t);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const draw = useCallback(
    (p: p5) => {
      renderConcentricCirclesEquilateralExamScene(p, {
        width: p.width,
        height: p.height,
        aAngle,
        bAngle,
        progress,
        turn,
        locale,
      });
    },
    [aAngle, bAngle, progress, turn, locale],
  );

  const extendSketch = useMemo<ExtendSketch>(() => {
    return (p) => {
      const inside = () => p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
      const pick = () => {
        const plot = concentricPlot(p.width, p.height);
        const { aAngle: a, bAngle: b } = stateRef.current;
        const mouse = { x: p.mouseX, y: p.mouseY };
        const da = distance(toScreen(plot, polar(1, a)), mouse);
        const db = distance(toScreen(plot, polar(2, b)), mouse);
        if (Math.min(da, db) > 40) {
          dragRef.current = null;
          return;
        }
        dragRef.current = da <= db + 6 ? 'a' : 'b';
      };
      const update = () => {
        const plot = concentricPlot(p.width, p.height);
        const world = worldFromScreen(plot, p.mouseX, p.mouseY);
        const angle = Math.atan2(world.y, world.x);
        if (dragRef.current === 'a') setAAngle(angle);
        else if (dragRef.current === 'b') setBAngle(angle);
      };
      const press = () => {
        if (!inside()) return;
        pick();
        if (!dragRef.current) return;
        update();
        return false;
      };
      const move = () => {
        if (!dragRef.current || !inside()) return;
        update();
        return false;
      };
      const release = () => {
        dragRef.current = null;
      };
      p.mousePressed = press;
      p.mouseDragged = move;
      p.mouseReleased = release;
      p.touchStarted = press;
      p.touchMoved = move;
      p.touchEnded = release;
    };
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [extendSketch], measureCanvas, extendSketch, {
    loop: false,
    redrawKey: `${aAngle}|${bAngle}|${progress}|${turn}`,
  });

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">
            {en ? 'Turn 60° to find the third vertex' : '轉 60° 找第三個頂點'}
          </p>
          <p className="exam-interactive-explore__prompt">
            <strong>{en ? 'Think first' : '先想一想'}</strong>
            {en
              ? 'In an equilateral triangle, one vertex is the image of another under a 60° turn about the third. Where does the radius-2 circle land after a 60° turn?'
              : '正三角形的一個頂點，是另一個頂點繞第三個頂點轉 60° 的像。那麼「半徑 2 的圓」轉 60° 後會落在哪裡？'}
          </p>
          <p className="exam-interactive-explore__visual-sub">
            {en
              ? 'The gold dashed circle is the image of the radius-2 circle rotated about A; drag A (on the small circle) or B (on the blue circle)'
              : '金色虛線圓是半徑 2 的圓繞 A 旋轉的像；拖曳 A（小圓上）或 B（藍色圓上）'}
          </p>
          <div
            ref={canvasHostRef}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={
              en
                ? `Three concentric circles, A on the radius-1 circle; the radius-2 circle turned ${Math.round(progress * 60)} degrees about A${done ? ', internally tangent to the radius-3 circle; the squared side of the equilateral triangle is 7' : ''}`
                : `三個同心圓，A 在半徑 1 的圓上；半徑 2 的圓繞 A 轉 ${Math.round(progress * 60)} 度${done ? '，與半徑 3 的圓內切，正三角形邊長平方為 7' : ''}`
            }
            style={{ cursor: 'grab', touchAction: 'none' }}
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Rotation' : '旋轉'}</p>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'Angle about A' : '繞 A 旋轉的角度'}</span>
              <output>{`${Math.round(progress * 60)}°`}</output>
              <input
                type="range"
                aria-label={en ? 'Angle of the radius-2 circle about A' : '半徑 2 的圓繞 A 旋轉的角度'}
                min="0"
                max="60"
                step="1"
                value={Math.round(progress * 60)}
                onInput={(event) => {
                  setPlaying(false);
                  setProgress(Number(event.currentTarget.value) / 60);
                }}
              />
            </label>
            <button
              type="button"
              className="exam-interactive-explore__mode-button"
              onClick={() => setPlaying(true)}
              disabled={playing}
            >
              {done
                ? en
                  ? 'Replay the 60° turn'
                  : '重新旋轉 60°'
                : en
                  ? 'Play the 60° turn'
                  : '播放旋轉 60°'}
            </button>
            <div className="exam-interactive-explore__modes">
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={turn === -1}
                aria-pressed={turn === -1}
                onClick={() => setTurn(-1)}
              >
                {en ? 'Clockwise' : '順時針轉'}
              </button>
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={turn === 1}
                aria-pressed={turn === 1}
                onClick={() => setTurn(1)}
              >
                {en ? 'Counterclockwise' : '逆時針轉'}
              </button>
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Vertex positions' : '頂點位置'}</p>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'A on the radius-1 circle' : 'A 在半徑 1 的圓上'}</span>
              <output>{`${Math.round(toDeg(aAngle))}°`}</output>
              <input
                type="range"
                aria-label={en ? 'Angle of vertex A on the radius-1 circle' : '頂點 A 在半徑 1 的圓上的角度'}
                min="0"
                max="359"
                step="1"
                value={Math.round(toDeg(aAngle))}
                onInput={(event) => setAAngle(toRad(Number(event.currentTarget.value)))}
              />
            </label>
            <label className="exam-interactive-explore__range">
              <span>{en ? 'Trial B on the radius-2 circle' : '試探 B 在半徑 2 的圓上'}</span>
              <output>{`${Math.round(toDeg(bAngle))}°`}</output>
              <input
                type="range"
                aria-label={en ? 'Angle of trial point B on the radius-2 circle' : '試探點 B 在半徑 2 的圓上的角度'}
                min="0"
                max="359"
                step="1"
                value={Math.round(toDeg(bAngle))}
                onInput={(event) => setBAngle(toRad(Number(event.currentTarget.value)))}
              />
            </label>
            <button
              type="button"
              className="exam-interactive-explore__mode-button"
              onClick={() => {
                setPlaying(false);
                setProgress(1);
                setBAngle(solutionBAngle(aAngle, turn));
              }}
            >
              {en ? 'Snap B to the unique solution' : '把 B 對到唯一解'}
            </button>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">{en ? 'Squared side' : '邊長平方'}</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {done
                ? en
                  ? `s²=${config.sideSquared.toFixed(4)} (official ${OFFICIAL_SIDE_SQUARED})`
                  : `s²=${config.sideSquared.toFixed(4)}（官方 ${OFFICIAL_SIDE_SQUARED}）`
                : en
                  ? 'Turn the angle up to 60° first'
                  : '先把旋轉角推到 60°'}
            </p>
            <p className="exam-interactive-explore__note">
              {en
                ? 'Wherever A is on the small circle, |OO′| is 1: the image circle (radius 2) is internally tangent to the large circle (radius 3), and the point of tangency is the unique C.'
                : '不論 A 在小圓哪裡，|OO′| 都是 1：像圓（半徑 2）恰好內切大圓（半徑 3），切點就是唯一的 C。'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
