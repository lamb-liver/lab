import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  createMatrixLinearAnimState,
  stepMatrixLinearAnimation,
  type MatrixLinearParams,
} from '../../curve/modules/matrix-linear-transform/animation';
import {
  CANVAS_ASPECT,
  CANVAS_MAX_W,
  CANVAS_MIN_W,
} from '../../curve/modules/matrix-linear-transform/constants';
import { getSpecialParam } from '../../curve/modules/matrix-linear-transform/matrix';
import type { MatrixMode, SpecialType } from '../../curve/modules/matrix-linear-transform/types';
import {
  buildMatrixSidebarState,
  renderMatrixLinearTransformScene,
} from '../../systems/rendering/matrixLinearTransformRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import '../../styles/components/explore/matrix-linear-transform-explore.css';

const DEFAULT_PARAMS: MatrixLinearParams = {
  mode: 'free',
  free: { a: 1, b: 0, c: 0, d: 1 },
  specialType: 'rotation',
  specialParamRaw: 35,
  composeAngleDeg: 45,
  composeShear: 0.8,
};

const SIDEBAR_UPDATE_INTERVAL_MS = 120;

function measureMatrixCanvas(host: HTMLElement): CanvasSize {
  const w = Math.min(
    CANVAS_MAX_W,
    Math.max(CANVAS_MIN_W, Math.round(host.clientWidth || CANVAS_MIN_W)),
  );
  return { width: w, height: Math.max(220, Math.round(w * CANVAS_ASPECT)) };
}

type SidebarState = {
  modeLabel: string;
  matrixLabel: string;
  detLabel: string;
  noteLabel: string;
  formulaLabel: string;
  detWarning: boolean;
  subtitle: string;
};

const FREE_KEYS = ['a', 'b', 'c', 'd'] as const;

export default function MatrixLinearTransformExploreRoot() {
  const [params, setParams] = useState<MatrixLinearParams>(DEFAULT_PARAMS);
  const [sidebar, setSidebar] = useState<SidebarState>({
    modeLabel: '模式：自由變換',
    matrixLabel: '[1.00 0.00; 0.00 1.00]',
    detLabel: 'det ≈ 1.000',
    noteLabel: '欄向量就是 î、ĵ 被送去的位置。',
    formulaLabel: '[a b; c d] · [x; y]\n= [ax + by; cx + dy]',
    detWarning: false,
    subtitle: '自由變換',
  });

  const paramsRef = useRef(params);
  const animRef = useRef(createMatrixLinearAnimState());
  const lastSidebarKeyRef = useRef('');
  const lastSidebarUpdateAtRef = useRef(0);

  useEffect(() => {
    paramsRef.current = params;
    lastSidebarUpdateAtRef.current = 0;
  }, [params]);

  const specialParamLabel = useMemo(
    () => getSpecialParam(params.specialType, params.specialParamRaw).label,
    [params.specialType, params.specialParamRaw],
  );

  const draw = useCallback((p: p5) => {
    animRef.current = stepMatrixLinearAnimation(
      animRef.current,
      paramsRef.current,
      p.deltaTime,
    );

    const snap = {
      width: p.width,
      height: p.height,
      mode: paramsRef.current.mode,
      currentMatrix: animRef.current.currentMatrix,
      specialType: paramsRef.current.specialType,
      composeAngleDeg: paramsRef.current.composeAngleDeg,
      composeShear: paramsRef.current.composeShear,
    };

    renderMatrixLinearTransformScene(p, snap);

    const now = p.millis();
    if (now - lastSidebarUpdateAtRef.current >= SIDEBAR_UPDATE_INTERVAL_MS) {
      lastSidebarUpdateAtRef.current = now;

      const panel = buildMatrixSidebarState(snap);
      const sidebarKey = `${panel.modeLabel}|${panel.matrixLabel}|${panel.detLabel}|${panel.subtitle}`;
      if (sidebarKey !== lastSidebarKeyRef.current) {
        lastSidebarKeyRef.current = sidebarKey;
        setSidebar(panel);
      }
    }
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw], measureMatrixCanvas);

  const setMode = (mode: MatrixMode) => {
    setParams((prev) => ({ ...prev, mode }));
  };

  const formulaLines = useMemo(
    () => sidebar.formulaLabel.split('\n'),
    [sidebar.formulaLabel],
  );

  const visualTitle =
    params.mode === 'compose'
      ? '矩陣疊加'
      : params.mode === 'special'
        ? '幾何到矩陣'
        : '矩陣線性變換';

  return (
    <div className="matrix-linear-explore">
      <div className="matrix-linear-explore__stage">
        <div className="matrix-linear-explore__visual">
          <p className="matrix-linear-explore__visual-title">{visualTitle}</p>
          <p className="matrix-linear-explore__visual-sub">{sidebar.subtitle}</p>
          <div
            ref={canvasHostRef}
            className="matrix-linear-explore__canvas"
            role="img"
            aria-label="矩陣與線性變換"
          />
        </div>

        <aside className="matrix-linear-explore__sidebar">
          <div className="matrix-linear-explore__block">
            <p className="matrix-linear-explore__block-title">切換</p>
            <label className="matrix-linear-explore__field">
              <span className="matrix-linear-explore__field-label">模式</span>
              <select
                className="matrix-linear-explore__select"
                value={params.mode}
                onChange={(e) => setMode(e.target.value as MatrixMode)}
              >
                <option value="free">自由變換</option>
                <option value="special">特殊變換</option>
                <option value="compose">變換疊加</option>
              </select>
            </label>
          </div>

          {params.mode === 'free' && (
            <div className="matrix-linear-explore__block">
              <p className="matrix-linear-explore__block-title">矩陣元素</p>
              {FREE_KEYS.map((key) => (
                <div key={key} className="control-field">
                  <label htmlFor={`matrix-${key}`}>
                    {key}
                    <span className="matrix-linear-explore__val">
                      {params.free[key].toFixed(2)}
                    </span>
                  </label>
                  <div className="range-wrap">
                    <input
                      id={`matrix-${key}`}
                      type="range"
                      className="range"
                      min={-2}
                      max={2}
                      step={0.01}
                      value={params.free[key]}
                      onInput={(e) =>
                        setParams((prev) => ({
                          ...prev,
                          free: {
                            ...prev.free,
                            [key]: Number(
                              (e.target as HTMLInputElement).value,
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {params.mode === 'special' && (
            <div className="matrix-linear-explore__block">
              <p className="matrix-linear-explore__block-title">特殊變換</p>
              <label className="matrix-linear-explore__field">
                <span className="matrix-linear-explore__field-label">類型</span>
                <select
                  className="matrix-linear-explore__select"
                  value={params.specialType}
                  onChange={(e) =>
                    setParams((prev) => ({
                      ...prev,
                      specialType: e.target.value as SpecialType,
                    }))
                  }
                >
                  <option value="rotation">旋轉</option>
                  <option value="scale">縮放</option>
                  <option value="shear">剪切</option>
                  <option value="reflection">反射</option>
                </select>
              </label>
              <div className="control-field">
                <label htmlFor="matrix-special-param">
                  參數
                  <span className="matrix-linear-explore__val">
                    {specialParamLabel}
                  </span>
                </label>
                <div className="range-wrap">
                  <input
                    id="matrix-special-param"
                    type="range"
                    className="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={params.specialParamRaw}
                    onInput={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        specialParamRaw: Number(
                          (e.target as HTMLInputElement).value,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {params.mode === 'compose' && (
            <div className="matrix-linear-explore__block">
              <p className="matrix-linear-explore__block-title">疊加參數</p>
              <div className="control-field">
                <label htmlFor="matrix-compose-angle">
                  A 旋轉角
                  <span className="matrix-linear-explore__val">
                    {params.composeAngleDeg.toFixed(0)}°
                  </span>
                </label>
                <div className="range-wrap">
                  <input
                    id="matrix-compose-angle"
                    type="range"
                    className="range"
                    min={-180}
                    max={180}
                    step={1}
                    value={params.composeAngleDeg}
                    onInput={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        composeAngleDeg: Number(
                          (e.target as HTMLInputElement).value,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
              <div className="control-field">
                <label htmlFor="matrix-compose-shear">
                  B 剪切量
                  <span className="matrix-linear-explore__val">
                    {params.composeShear.toFixed(2)}
                  </span>
                </label>
                <div className="range-wrap">
                  <input
                    id="matrix-compose-shear"
                    type="range"
                    className="range"
                    min={-1.8}
                    max={1.8}
                    step={0.01}
                    value={params.composeShear}
                    onInput={(e) =>
                      setParams((prev) => ({
                        ...prev,
                        composeShear: Number(
                          (e.target as HTMLInputElement).value,
                        ),
                      }))
                    }
                  />
                </div>
              </div>
            </div>
          )}

          <div className="matrix-linear-explore__block">
            <p className="matrix-linear-explore__block-title">狀態</p>
            <p className="matrix-linear-explore__muted" aria-live="polite">
              {sidebar.modeLabel}
            </p>
            <p className="matrix-linear-explore__accent">{sidebar.matrixLabel}</p>
            <p
              className={`matrix-linear-explore__muted${sidebar.detWarning ? ' matrix-linear-explore__det--warn' : ''}`}
            >
              {sidebar.detLabel}
            </p>
            <p className="matrix-linear-explore__muted">{sidebar.noteLabel}</p>
          </div>

          <div className="matrix-linear-explore__block matrix-linear-explore__formula-block">
            <p className="matrix-linear-explore__block-title">公式</p>
            {formulaLines.map((line) => (
              <p key={line} className="matrix-linear-explore__formula">
                {line}
              </p>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
