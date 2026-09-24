import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import { prefersReducedMotion } from '../../lib/reducedMotion';
import {
  OFFICIAL_LENGTH,
  PATH_SPAN,
  STRAIGHT_LENGTH,
  TANGENT_CONTACT,
  pathMetrics,
} from '../../exam/amc12b-2023-21-lampshade-shortest-path/geometry';
import {
  contactFromNetScreen,
  lampshadeNetPlot,
  renderLampshadeNetScene,
  renderLampshadeShortestPath3dScene,
} from '../../systems/rendering/lampshadeShortestPathExamRender';
import OrbitViewControls from '../curve/OrbitViewControls';
import { useOrbitViewP5 } from '../curve/useOrbitViewP5';
import {
  useRectP5CanvasHost,
  type CanvasSize,
  type ExtendSketch,
} from '../curve/useRectP5CanvasHost';
import '../../styles/components/exam/exam-interactive.css';

type ViewParams = {
  yaw: number;
  pitch: number;
};

const DEFAULT_VIEW: ViewParams = { yaw: -24, pitch: 24 };
const UNROLL_MS = 1600;

function measure3d(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(320, Math.round(width * 0.62)) };
}

function measureNet(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.round(host.clientWidth || 300));
  return { width, height: Math.max(230, Math.round(width * 0.56)) };
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

export default function LampshadeShortestPathExamRoot() {
  const [view, setView] = useState(DEFAULT_VIEW);
  const [unroll, setUnroll] = useState(0);
  const [contact, setContact] = useState(PATH_SPAN);
  const [playing, setPlaying] = useState(false);
  const unrollRef = useRef(unroll);
  unrollRef.current = unroll;

  const metrics = useMemo(() => pathMetrics(contact), [contact]);

  const patchView = useCallback((patch: Partial<ViewParams>) => {
    setView((current) => ({ ...current, ...patch }));
  }, []);

  // 展開動畫：從目前的展開程度走到另一端（全捲或全攤）
  useEffect(() => {
    if (!playing) return;
    const from = unrollRef.current;
    const to = from >= 0.999 ? 0 : 1;
    // 減少動態：直接跳到終點
    const duration = prefersReducedMotion() ? 0 : UNROLL_MS * Math.abs(to - from);
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
      setUnroll(from + (to - from) * eased);
      if (t < 1) frame = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const render3d = useCallback(
    (p: p5, current: ViewParams, rotating: boolean) =>
      renderLampshadeShortestPath3dScene(p, {
        width: p.width,
        height: p.height,
        yaw: current.yaw,
        pitch: current.pitch,
        rotating,
        unroll,
        contact,
      }),
    [unroll, contact],
  );
  const { canvasHostRef: hostRef3d } = useOrbitViewP5({
    params: view,
    onParamsChange: patchView,
    render: render3d,
    redrawKey: `${view.yaw}|${view.pitch}|${unroll.toFixed(4)}|${contact.toFixed(5)}`,
    measure: measure3d,
  });

  const drawNet = useCallback(
    (p: p5) => {
      renderLampshadeNetScene(p, { width: p.width, height: p.height, contact });
    },
    [contact],
  );

  const extendNet = useMemo<ExtendSketch>(() => {
    return (p) => {
      const inside = () => p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height;
      const update = () => {
        const plot = lampshadeNetPlot(p.width, p.height);
        setContact(contactFromNetScreen(plot, p.mouseX, p.mouseY));
      };
      p.mousePressed = () => {
        if (!inside()) return;
        update();
        return false;
      };
      p.mouseDragged = () => {
        if (!inside()) return;
        update();
        return false;
      };
      p.touchStarted = () => {
        if (!inside()) return;
        update();
        return false;
      };
      p.touchMoved = () => {
        if (!inside()) return;
        update();
        return false;
      };
    };
  }, []);

  const hostRefNet = useRectP5CanvasHost(drawNet, [extendNet], measureNet, extendNet, {
    loop: false,
    redrawKey: contact,
  });

  const contactDeg = toDeg(contact);

  return (
    <div className="exam-interactive-explore">
      <div className="exam-interactive-explore__stage">
        <div className="exam-interactive-explore__visual">
          <p className="exam-interactive-explore__visual-title">燈罩展開與最短路徑</p>
          <p className="exam-interactive-explore__prompt">
            <strong>先想一想</strong>
            把燈罩剪開攤平後，蟲和蜂蜜之間直接連一條直線，那條線還在紙上嗎？
          </p>
          <p className="exam-interactive-explore__visual-sub">
            上圖可拖動旋轉視角；下圖是展開後的半圓環，拖動金色把手改變路徑
          </p>
          <div
            ref={hostRef3d}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={`燈罩立體圖，展開 ${Math.round(unroll * 100)}%，路徑${metrics.valid ? '在燈罩上' : '有一段離開燈罩'}；拖動可旋轉視角`}
          />
          <div
            ref={hostRefNet}
            className="exam-interactive-explore__canvas"
            role="img"
            aria-label={`展開圖：內半徑 6、外半徑 12 的半圓環，接觸角 ${contactDeg.toFixed(1)} 度，路徑長 ${metrics.length.toFixed(3)}`}
            style={{ cursor: 'grab', touchAction: 'none', marginTop: '0.75rem' }}
          />
        </div>

        <aside className="exam-interactive-explore__sidebar">
          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">路徑長</p>
            <p className="exam-interactive-explore__result" aria-live="polite">
              {metrics.valid
                ? `L≈${metrics.length.toFixed(4)}`
                : `直線 6√5≈${STRAIGHT_LENGTH.toFixed(4)}（不合法）`}
            </p>
            <p className="exam-interactive-explore__note">
              {metrics.valid
                ? metrics.contact >= TANGENT_CONTACT - 1e-3
                  ? `直線段與內緣相切，這就是最短路徑 6√3+π≈${OFFICIAL_LENGTH.toFixed(4)}。`
                  : '還能把接觸點往蜂蜜那側推，路徑會再變短，直到直線與內緣相切。'
                : `直線離錐頂最近 ${metrics.minRadius.toFixed(3)}，小於內半徑 6：這段走在被切掉的錐頂上。`}
            </p>
            <div className="exam-interactive-explore__modes">
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={contact >= PATH_SPAN - 1e-6}
                aria-pressed={contact >= PATH_SPAN - 1e-6}
                onClick={() => setContact(PATH_SPAN)}
              >
                直接連直線（6√5）
              </button>
              <button
                type="button"
                className="exam-interactive-explore__mode-button"
                data-active={Math.abs(contact - TANGENT_CONTACT) < 1e-6}
                aria-pressed={Math.abs(contact - TANGENT_CONTACT) < 1e-6}
                onClick={() => setContact(TANGENT_CONTACT)}
              >
                切線＋內緣弧（6√3+π）
              </button>
            </div>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">接觸點</p>
            <label className="exam-interactive-explore__range">
              <span>接觸角 a（相對蟲的位置）</span>
              <output>{`${contactDeg.toFixed(1)}°`}</output>
              <input
                type="range"
                aria-label="路徑碰到內緣的接觸角 a"
                min="0"
                max="90"
                step="0.5"
                value={contactDeg}
                onInput={(event) => setContact((Number(event.currentTarget.value) * Math.PI) / 180)}
              />
            </label>
            <p className="exam-interactive-explore__note">
              a=90° 是直接連直線；a 超過 60°，直線就會切進內半徑 6 以內。
            </p>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">展開</p>
            <label className="exam-interactive-explore__range">
              <span>展開程度</span>
              <output>{`${Math.round(unroll * 100)}%`}</output>
              <input
                type="range"
                aria-label="燈罩展開程度"
                min="0"
                max="100"
                step="1"
                value={Math.round(unroll * 100)}
                onInput={(event) => {
                  setPlaying(false);
                  setUnroll(Number(event.currentTarget.value) / 100);
                }}
              />
            </label>
            <button
              type="button"
              className="exam-interactive-explore__mode-button"
              onClick={() => setPlaying(true)}
              disabled={playing}
            >
              {unroll >= 0.999 ? '捲回燈罩' : '播放展開'}
            </button>
          </div>

          <div className="exam-interactive-explore__block">
            <p className="exam-interactive-explore__block-title">視角</p>
            <OrbitViewControls idPrefix="amc12b-2023-21" params={view} onParamsChange={patchView} />
          </div>
        </aside>
      </div>
    </div>
  );
}
