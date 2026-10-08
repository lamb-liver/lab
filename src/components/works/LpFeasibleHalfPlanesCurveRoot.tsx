import { useCallback, useState } from 'react';
import {
  AXIS_HALF,
  DEFAULT_LP_FEASIBLE_HALF_PLANES_PARAMS,
  angleOf,
  lpFeasibleHalfPlanesModule,
  lpFeasibleHalfPlanesParamsForMetadata,
  offsetOf,
  patchConstraint,
  type LpFeasibleHalfPlanesParams,
} from '../../curve/modules/lp-feasible-half-planes';
import type { CurveMetadata } from '../../curve/types';
import { useLpFeasibleHalfPlanesP5 } from '../curve/useLpFeasibleHalfPlanesP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
  locale?: 'en';
};

const CONSTRAINT_LABELS = ['約束 1', '約束 2', '約束 3'];
const EN_CONSTRAINT_LABELS = ['Constraint 1', 'Constraint 2', 'Constraint 3'];

/**
 * 三種狀態都靠拖滑桿碰得到，但「無解」要兩條約束幾乎正對、「無界」要三條同時背過去，
 * 手動湊都很費事。預設按鈕讓它們一鍵可見。
 */
const PRESETS: Array<{ label: string; en: string; patch: Partial<LpFeasibleHalfPlanesParams> }> = [
  { label: '有界', en: 'Bounded', patch: DEFAULT_LP_FEASIBLE_HALF_PLANES_PARAMS },
  {
    label: '無界',
    en: 'Unbounded',
    patch: { angle0: 200, offset0: 0, angle1: 250, offset1: 0, angle2: 300, offset2: 0 },
  },
  {
    label: '無解',
    en: 'Infeasible',
    patch: { angle0: 30, offset0: 4, angle1: 210, offset1: -9, angle2: 45, offset2: 9 },
  },
];

const EN_STATUS: Record<string, string> = { 有界: 'Bounded', 無界: 'Unbounded', 無解: 'Infeasible' };

function englishMetadata(metadata: CurveMetadata): CurveMetadata {
  return {
    ...metadata,
    title: 'Constraint half-planes and the feasible region',
    stats: metadata.stats.map((stat) => {
      const value = String(stat.value);
      switch (stat.key) {
        case 'status':
          return { ...stat, label: 'Feasible region', value: EN_STATUS[value] ?? value };
        case 'vertices':
          return { ...stat, label: 'Corner points' };
        case 'area':
          return { ...stat, label: 'Area', value: value === '無界，面積不存在' ? 'unbounded, no area' : value };
        case 'redundant':
          return {
            ...stat,
            label: 'Redundant constraints',
            value: value === '無' ? 'none' : value.replace(/約束 /g, 'Constraint ').replace(/、/g, ', '),
          };
        case 'selected':
          return { ...stat, label: 'Selected' };
        default:
          return stat;
      }
    }),
  };
}

export default function LpFeasibleHalfPlanesCurveRoot({ controlsMountId, locale }: Props) {
  const en = locale === 'en';
  const [params, setParams] = useState<LpFeasibleHalfPlanesParams>(
    DEFAULT_LP_FEASIBLE_HALF_PLANES_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<LpFeasibleHalfPlanesParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useLpFeasibleHalfPlanesP5({ params, onParamsChange, locale });

  const rawMetadata = lpFeasibleHalfPlanesModule.getMetadata(
    lpFeasibleHalfPlanesParamsForMetadata(params),
  );
  const metadata = en ? englishMetadata(rawMetadata) : rawMetadata;

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle">
        {(en ? EN_CONSTRAINT_LABELS : CONSTRAINT_LABELS).map((label, index) => (
          <button
            key={label}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={params.selected === index}
            onClick={() => onParamsChange({ selected: index })}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="control-field">
        <label htmlFor="lp-half-planes-angle">
          <span>{en ? 'Normal angle θ' : '法向角度 θ'}</span>
          <span className="control-field__value">
            {angleOf(params, params.selected).toFixed(0)}°
          </span>
        </label>
        <div className="range-wrap">
          <input
            id="lp-half-planes-angle"
            type="range"
            className="range"
            min={0}
            max={360}
            step={1}
            value={angleOf(params, params.selected)}
            onInput={(event) =>
              onParamsChange(
                patchConstraint(params.selected, { angle: Number(event.currentTarget.value) }),
              )
            }
          />
        </div>
      </div>

      <div className="control-field">
        <label htmlFor="lp-half-planes-offset">
          <span>{en ? 'Offset c' : '位移 c'}</span>
          <span className="control-field__value">
            {offsetOf(params, params.selected).toFixed(2)}
          </span>
        </label>
        <div className="range-wrap">
          <input
            id="lp-half-planes-offset"
            type="range"
            className="range"
            min={-AXIS_HALF}
            max={AXIS_HALF}
            step={0.1}
            value={offsetOf(params, params.selected)}
            onInput={(event) =>
              onParamsChange(
                patchConstraint(params.selected, { offset: Number(event.currentTarget.value) }),
              )
            }
          />
        </div>
      </div>

      <div className="curve-work-mode-toggle">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.view === 'region'}
          onClick={() => onParamsChange({ view: 'region' })}
        >
          {en ? 'Feasible region' : '可行域'}
        </button>
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed={params.view === 'mask'}
          onClick={() => onParamsChange({ view: 'mask' })}
        >
          {en ? 'Half-plane mask' : '半平面遮罩'}
        </button>
      </div>

      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            className="curve-work-mode-button"
            aria-pressed="false"
            onClick={() => onParamsChange(preset.patch)}
          >
            {en ? preset.en : preset.label}
          </button>
        ))}
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label={
          en
            ? 'Constraint half-planes and the feasible region. Drag a constraint line to change its offset.'
            : '約束半平面與可行域互動：拖動約束直線可調整位移'
        }
      />
      {controls}
    </>
  );
}
