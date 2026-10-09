import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  createConicDynamicAnimState,
  stepConicDynamicAnimation,
  type ConicDynamicParams,
} from '../../curve/modules/conic-dynamic-geometry/animation';
import { CANVAS_ASPECT, E_MAX, E_MIN } from '../../curve/modules/conic-dynamic-geometry/constants';
import {
  getEccentricityKind,
  pickPointClockFromWorld,
  screenToWorld,
} from '../../curve/modules/conic-dynamic-geometry/geometry';
import type { ConicMode, FocusCurveType } from '../../curve/modules/conic-dynamic-geometry/types';
import {
  buildSidebarState,
  renderConicDynamicGeometryScene,
} from '../../systems/rendering/conicDynamicGeometryRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/conic-dynamic-geometry-explore.css';
import { wireTouchToMouse } from '../curve/touchToMouse';

const CANVAS_MIN_W = 280;
const CANVAS_MAX_W = 720;

const SIDEBAR_UPDATE_INTERVAL_MS = 120;

const TEXT = {
  zh: {
    title: '二次曲線動態幾何',
    aria: '二次曲線的幾何動態軌跡',
    switchTitle: '切換',
    mode: '模式',
    modeEccentricity: '離心率模式',
    modeFocus: '焦點軌跡模式',
    eccentricityTitle: '離心率',
    showConstruction: '顯示焦點 / 準線',
    focusTitle: '焦點軌跡',
    curve: '曲線',
    ellipse: '橢圓',
    parabola: '拋物線',
    hyperbola: '雙曲線',
    animate: '動點 P 自動移動',
    status: '狀態',
    formula: '公式',
  },
  en: {
    title: 'Conics by eccentricity',
    aria: 'Conics by eccentricity: a near-circle ellipse, a parabola, then one hyperbola branch',
    switchTitle: 'Switch',
    mode: 'Mode',
    modeEccentricity: 'Eccentricity',
    modeFocus: 'Focus locus',
    eccentricityTitle: 'Eccentricity',
    showConstruction: 'Show focus / directrix',
    focusTitle: 'Focus locus',
    curve: 'Curve',
    ellipse: 'Ellipse',
    parabola: 'Parabola',
    hyperbola: 'Hyperbola',
    animate: 'Animate point P',
    status: 'Status',
    formula: 'Formula',
  },
} as const;

const DEFAULT_PARAMS: ConicDynamicParams = {
  mode: 'eccentricity',
  focusCurve: 'ellipse',
  eccentricity: 0.65,
  showConstruction: true,
  animatePoint: true,
};

type Props = {
  locale?: 'en';
};

function measureConicCanvas(host: HTMLElement): CanvasSize {
  const w = Math.min(
    CANVAS_MAX_W,
    Math.max(CANVAS_MIN_W, Math.round(host.clientWidth || CANVAS_MIN_W)),
  );
  return { width: w, height: Math.max(220, Math.round(w * CANVAS_ASPECT)) };
}

type SidebarState = {
  modeLabel: string;
  valueLabel: string;
  noteLabel: string;
  formulaLabel: string;
  subtitle: string;
};

export default function ConicDynamicGeometryExploreRoot({ locale }: Props) {
  const text = locale === 'en' ? TEXT.en : TEXT.zh;
  const [params, setParams] = useState<ConicDynamicParams>(DEFAULT_PARAMS);
  const [sidebar, setSidebar] = useState<SidebarState>(() =>
    locale === 'en'
      ? {
          ...buildSidebarState(
            {
              width: 1,
              height: 1,
              mode: DEFAULT_PARAMS.mode,
              focusCurve: DEFAULT_PARAMS.focusCurve,
              smoothE: DEFAULT_PARAMS.eccentricity,
              reveal: 1,
              pointClock: 0,
              showConstruction: DEFAULT_PARAMS.showConstruction,
            },
            locale,
          ),
          subtitle: getEccentricityKind(DEFAULT_PARAMS.eccentricity, locale),
        }
      : {
          modeLabel: '模式：離心率',
          valueLabel: 'e = 0.65 · 橢圓',
          noteLabel: '',
          formulaLabel: 'PF / Pd = e',
          subtitle: '橢圓',
        },
  );

  const paramsRef = useRef(params);
  const localeRef = useRef(locale);
  const animRef = useRef(createConicDynamicAnimState(DEFAULT_PARAMS));
  const lastSidebarKeyRef = useRef('');
  const lastSidebarUpdateAtRef = useRef(0);

  useEffect(() => {
    paramsRef.current = params;
    lastSidebarUpdateAtRef.current = 0;
  }, [params]);

  useEffect(() => {
    localeRef.current = locale;
  }, [locale]);

  const updatePointFromMouse = useCallback((p: p5) => {
    const anim = animRef.current;
    const target = paramsRef.current;

    if (
      p.mouseX < 0 ||
      p.mouseX > p.width ||
      p.mouseY < 0 ||
      p.mouseY > p.height
    ) {
      return;
    }

    if (!anim.activeMetricPoints.length) return;

    const world = screenToWorld(p.mouseX, p.mouseY, p.width, p.height);
    const nextClock = pickPointClockFromWorld(
      world,
      anim.activeMetricPoints,
      target.mode,
      target.focusCurve,
    );

    paramsRef.current = { ...target, animatePoint: false };
    setParams((prev) => ({ ...prev, animatePoint: false }));

    animRef.current = {
      ...anim,
      pointClock: nextClock,
      targetParams: { ...target, animatePoint: false },
    };
  }, []);

  const draw = useCallback((p: p5) => {
    animRef.current = stepConicDynamicAnimation(
      animRef.current,
      paramsRef.current,
      p.deltaTime,
      localeRef.current,
    );

    const anim = animRef.current;
    const snap = {
      width: p.width,
      height: p.height,
      mode: anim.targetParams.mode,
      focusCurve: anim.targetParams.focusCurve,
      smoothE: anim.smoothE,
      reveal: anim.reveal,
      pointClock: anim.pointClock,
      showConstruction: anim.targetParams.showConstruction,
    };

    renderConicDynamicGeometryScene(p, snap);

    const now = p.millis();
    if (now - lastSidebarUpdateAtRef.current >= SIDEBAR_UPDATE_INTERVAL_MS) {
      lastSidebarUpdateAtRef.current = now;

      const panel = buildSidebarState(snap, localeRef.current);
      const sidebarKey = `${panel.modeLabel}|${panel.valueLabel}|${panel.noteLabel}|${anim.subtitle}`;
      if (sidebarKey !== lastSidebarKeyRef.current) {
        lastSidebarKeyRef.current = sidebarKey;
        setSidebar({
          ...panel,
          subtitle: anim.subtitle,
        });
      }
    }
  }, []);

  const extendSketch = useCallback((p: p5, host?: HTMLElement) => {
    p.mousePressed = () => updatePointFromMouse(p);
    p.mouseDragged = () => updatePointFromMouse(p);

    wireTouchToMouse(p, host);
  }, [updatePointFromMouse]);

  const canvasHostRef = useRectP5CanvasHost(
    draw,
    [draw, extendSketch],
    measureConicCanvas,
    extendSketch,
  );

  const setMode = (mode: ConicMode) => {
    setParams((prev) => ({ ...prev, mode }));
  };

  const setFocusCurve = (focusCurve: FocusCurveType) => {
    setParams((prev) => ({ ...prev, focusCurve }));
  };

  const formulaLines = useMemo(
    () => sidebar.formulaLabel.split('\n'),
    [sidebar.formulaLabel],
  );

  const noteLines = useMemo(
    () => sidebar.noteLabel.split('\n'),
    [sidebar.noteLabel],
  );

  return (
    <div className="conic-dynamic-explore">
      <div className="conic-dynamic-explore__stage">
        <div className="conic-dynamic-explore__visual">
          <p className="conic-dynamic-explore__visual-title">{text.title}</p>
          <p className="conic-dynamic-explore__visual-sub">{sidebar.subtitle}</p>
          <div
            ref={canvasHostRef}
            className="conic-dynamic-explore__canvas"
            role="img"
            aria-label={text.aria}
          />
        </div>

        <aside className="conic-dynamic-explore__sidebar">
          <div className="conic-dynamic-explore__block">
            <p className="conic-dynamic-explore__block-title">{text.switchTitle}</p>
            <label className="conic-dynamic-explore__field">
              <span className="conic-dynamic-explore__field-label">{text.mode}</span>
              <select
                className="conic-dynamic-explore__select"
                value={params.mode}
                onChange={(e) => setMode(e.target.value as ConicMode)}
              >
                <option value="eccentricity">{text.modeEccentricity}</option>
                <option value="focus">{text.modeFocus}</option>
              </select>
            </label>
          </div>

          {params.mode === 'eccentricity' ? (
            <div className="conic-dynamic-explore__block">
              <p className="conic-dynamic-explore__block-title">{text.eccentricityTitle}</p>
              <div className="control-field">
                <label htmlFor="conic-e">
                  e
                  <span className="conic-dynamic-explore__val">
                    {params.eccentricity.toFixed(2)}
                  </span>
                </label>
                <div className="range-wrap">
                  <input
                    id="conic-e"
                    type="range"
                    className="range"
                    min={E_MIN}
                    max={E_MAX}
                    step={0.01}
                    value={params.eccentricity}
                    onInput={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        eccentricity: Number(
                          (e.target as HTMLInputElement).value,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
              <label className="conic-dynamic-explore__check">
                <input
                  type="checkbox"
                  checked={params.showConstruction}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      showConstruction: e.target.checked,
                    }))
                  }
                />
                {text.showConstruction}
              </label>
            </div>
          ) : (
            <div className="conic-dynamic-explore__block">
              <p className="conic-dynamic-explore__block-title">{text.focusTitle}</p>
              <label className="conic-dynamic-explore__field">
                <span className="conic-dynamic-explore__field-label">{text.curve}</span>
                <select
                  className="conic-dynamic-explore__select"
                  value={params.focusCurve}
                  onChange={(e) =>
                    setFocusCurve(e.target.value as FocusCurveType)
                  }
                >
                  <option value="ellipse">{text.ellipse}</option>
                  <option value="parabola">{text.parabola}</option>
                  <option value="hyperbola">{text.hyperbola}</option>
                </select>
              </label>
            </div>
          )}

          <label className="conic-dynamic-explore__check">
            <input
              type="checkbox"
              checked={params.animatePoint}
              onChange={(e) =>
                setParams((prev) => ({
                  ...prev,
                  animatePoint: e.target.checked,
                }))
              }
            />
            {text.animate}
          </label>

          <div className="conic-dynamic-explore__block">
            <p className="conic-dynamic-explore__block-title">{text.status}</p>
            <p className="conic-dynamic-explore__muted" aria-live="polite">
              {sidebar.modeLabel}
            </p>
            <p className="conic-dynamic-explore__accent">{sidebar.valueLabel}</p>
            {noteLines.map((line) => (
              <p key={line} className="conic-dynamic-explore__muted">
                {line}
              </p>
            ))}
          </div>

          <div className="conic-dynamic-explore__block conic-dynamic-explore__formula-block">
            <p className="conic-dynamic-explore__block-title">{text.formula}</p>
            {formulaLines.map((line) => (
              <p key={line} className="conic-dynamic-explore__formula">
                {line}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
