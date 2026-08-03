import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type p5 from 'p5';
import {
  DEFAULT_SCALE,
  DEFAULT_SIMPLEX_POINT,
  SCALE_MAX,
  SCALE_MIN,
  SCALE_STEP,
  cartesianToSimplex,
  clampScale,
  computeHomogeneousMetrics,
  formatNumber,
  getSimplexTriangle,
  setSimplexA,
  setSimplexB,
  type SimplexLayer,
  type SimplexPoint,
  type StudyStage,
} from '../../contest/homogeneous-normalization/geometry';
import { renderHomogeneousNormalizationContestScene } from '../../systems/rendering/homogeneousNormalizationContestRender';
import { useRectP5CanvasHost, type CanvasSize } from '../curve/useRectP5CanvasHost';
import { wireTouchToMouse } from '../curve/touchToMouse';
import '../../styles/components/contest/homogeneous-normalization-contest.css';

const STAGES: Array<{ value: StudyStage; label: string }> = [
  { value: 'degrees', label: '看次數' },
  { value: 'homogenize', label: '補回次數' },
  { value: 'scale', label: '只改大小' },
  { value: 'simplex', label: '看比例三角形' },
];

const LAYERS: Array<{ value: SimplexLayer; label: string }> = [
  { value: 'q', label: 'q 的大小' },
  { value: 'r', label: 'r 的大小' },
  { value: 'lower', label: '下界差值' },
  { value: 'upper', label: '上界差值' },
];

function measureCanvas(host: HTMLElement): CanvasSize {
  const width = Math.max(300, Math.min(1000, Math.round(host.clientWidth || 640)));
  return { width, height: Math.max(340, Math.round(width * 0.54)) };
}

export default function HomogeneousNormalizationContestRoot() {
  const [stage, setStage] = useState<StudyStage>('degrees');
  const [point, setPoint] = useState<SimplexPoint>(DEFAULT_SIMPLEX_POINT);
  const [scale, setScale] = useState(DEFAULT_SCALE);
  const [layer, setLayer] = useState<SimplexLayer>('upper');
  const stageRef = useRef(stage);
  const pointRef = useRef(point);
  const scaleRef = useRef(scale);
  const layerRef = useRef(layer);

  useEffect(() => { stageRef.current = stage; }, [stage]);
  useEffect(() => { pointRef.current = point; }, [point]);
  useEffect(() => { scaleRef.current = scale; }, [scale]);
  useEffect(() => { layerRef.current = layer; }, [layer]);

  const updatePointFromMouse = useCallback((p: p5) => {
    if (stageRef.current !== 'simplex') return;
    const next = cartesianToSimplex(
      { x: p.mouseX, y: p.mouseY },
      getSimplexTriangle(p.width, p.height),
    );
    pointRef.current = next;
    setPoint(next);
  }, []);

  const extendSketch = useCallback((p: p5) => {
    p.mousePressed = () => updatePointFromMouse(p);
    p.mouseDragged = () => updatePointFromMouse(p);
    wireTouchToMouse(p);
  }, [updatePointFromMouse]);

  const draw = useCallback((p: p5) => {
    renderHomogeneousNormalizationContestScene(p, {
      width: p.width,
      height: p.height,
      stage: stageRef.current,
      point: pointRef.current,
      scale: scaleRef.current,
      layer: layerRef.current,
    });
  }, []);

  const canvasHostRef = useRectP5CanvasHost(draw, [draw, extendSketch], measureCanvas, extendSketch, {
    loop: false,
    redrawKey: `${stage}|${point.a}|${point.b}|${point.c}|${scale}|${layer}`,
  });

  const metrics = useMemo(() => computeHomogeneousMetrics(point), [point]);

  return (
    <div className="homogeneous-normalization-contest">
      <div className="homogeneous-normalization-contest__stage">
        <div className="homogeneous-normalization-contest__visual">
          <div
            ref={canvasHostRef}
            className="homogeneous-normalization-contest__canvas"
            role="img"
            aria-label="齊次化與標準化互動視覺化"
          />
        </div>

        <aside className="homogeneous-normalization-contest__sidebar">
          <div className="homogeneous-normalization-contest__block">
            <p className="homogeneous-normalization-contest__block-title">研題階段</p>
            <div className="homogeneous-normalization-contest__modes">
              {STAGES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className="homogeneous-normalization-contest__mode-button"
                  data-active={stage === item.value}
                  aria-pressed={stage === item.value}
                  onClick={() => setStage(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {stage === 'scale' ? (
            <div className="homogeneous-normalization-contest__block">
              <p className="homogeneous-normalization-contest__block-title">共同縮放</p>
              <div className="control-field">
                <label htmlFor="contest-scale">
                  <span>倍率 t</span>
                  <span className="control-field__value">{formatNumber(scale, 2)}</span>
                </label>
                <div className="range-wrap">
                  <input
                    id="contest-scale"
                    type="range"
                    className="range"
                    min={SCALE_MIN}
                    max={SCALE_MAX}
                    step={SCALE_STEP}
                    value={scale}
                    onInput={(event) => setScale(clampScale(Number(event.currentTarget.value)))}
                  />
                </div>
              </div>
              <p className="homogeneous-normalization-contest__note">
                兩個差值都乘上 t³；
                正負與等號位置不變。
              </p>
            </div>
          ) : null}

          {stage === 'simplex' ? (
            <>
              <div className="homogeneous-normalization-contest__block">
                <p className="homogeneous-normalization-contest__block-title">一個點代表一組比例</p>
                <p className="homogeneous-normalization-contest__note">
                  拖曳點，或用滑桿調整 a、b；c 會自動補成 1−a−b。
                </p>
                <div className="control-field">
                  <label htmlFor="contest-a">
                    <span>a 比例</span>
                    <span className="control-field__value">{formatNumber(point.a)}</span>
                  </label>
                  <div className="range-wrap">
                    <input
                      id="contest-a"
                      type="range"
                      className="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={point.a}
                      onInput={(event) => setPoint(setSimplexA(point, Number(event.currentTarget.value)))}
                    />
                  </div>
                </div>
                <div className="control-field">
                  <label htmlFor="contest-b">
                    <span>b 比例</span>
                    <span className="control-field__value">{formatNumber(point.b)}</span>
                  </label>
                  <div className="range-wrap">
                    <input
                      id="contest-b"
                      type="range"
                      className="range"
                      min="0"
                      max={1 - point.a}
                      step="0.01"
                      value={point.b}
                      onInput={(event) => setPoint(setSimplexB(point, Number(event.currentTarget.value)))}
                    />
                  </div>
                </div>
              </div>
              <div className="homogeneous-normalization-contest__block">
                <p className="homogeneous-normalization-contest__block-title">圖層</p>
                <div className="homogeneous-normalization-contest__modes homogeneous-normalization-contest__modes--grid">
                  {LAYERS.map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      className="homogeneous-normalization-contest__mode-button"
                      data-active={layer === item.value}
                      aria-pressed={layer === item.value}
                      onClick={() => setLayer(item.value)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="homogeneous-normalization-contest__readings">
                <p><span>a+b+c</span><strong>{formatNumber(point.a + point.b + point.c)}</strong></p>
                <p><span>q</span><strong>{formatNumber(metrics.q)}</strong></p>
                <p><span>r</span><strong>{formatNumber(metrics.r)}</strong></p>
                {layer === 'lower' || layer === 'upper' ? (
                  <p>
                    <span>差值</span>
                    <strong>{formatNumber(layer === 'lower' ? metrics.lowerGap : metrics.upperGap)}</strong>
                  </p>
                ) : null}
              </div>
            </>
          ) : null}

        </aside>
      </div>
    </div>
  );
}
