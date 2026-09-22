import { useCallback, useState } from 'react';
import {
  DEFAULT_DEMOIVRE_NTH_ROOTS_PARAMS,
  N_MAX,
  N_MIN,
  demoivreNthRootsModule,
  demoivreNthRootsParamsForMetadata,
  type DemoivreMode,
  type DemoivreNthRootsParams,
} from '../../curve/modules/demoivre-nth-roots';
import { useDemoivreNthRootsP5 } from '../curve/useDemoivreNthRootsP5';
import WorkControlsPortal from '../curve/WorkControlsPortal';
import '../../styles/components/works/curve-work-demo.css';

type Props = {
  controlsMountId: string;
};

const MODE_LABELS: Array<{ mode: DemoivreMode; label: string }> = [
  { mode: 'power', label: '乘冪 zⁿ' },
  { mode: 'roots', label: '方根' },
];

export default function DemoivreNthRootsCurveRoot({ controlsMountId }: Props) {
  const [params, setParams] = useState<DemoivreNthRootsParams>(
    DEFAULT_DEMOIVRE_NTH_ROOTS_PARAMS,
  );

  const onParamsChange = useCallback((patch: Partial<DemoivreNthRootsParams>) => {
    setParams((prev) => ({ ...prev, ...patch }));
  }, []);

  const { canvasHostRef } = useDemoivreNthRootsP5({ params, onParamsChange });
  const metadata = demoivreNthRootsModule.getMetadata(
    demoivreNthRootsParamsForMetadata(params),
  );

  const controls = (
    <WorkControlsPortal controlsMountId={controlsMountId} metadata={metadata}>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        {MODE_LABELS.map((item) => (
          <button
            key={item.mode}
            type="button"
            className="curve-work-mode-button"
            aria-pressed={params.mode === item.mode}
            onClick={() => onParamsChange({ mode: item.mode })}
          >
            {item.label}
          </button>
        ))}
      </div>
      <div className="control-field">
        <label htmlFor="demoivre-n">
          <span>次數 n</span>
          <span className="control-field__value">{params.n}</span>
        </label>
        <div className="range-wrap">
          <input
            id="demoivre-n"
            type="range"
            className="range"
            min={N_MIN}
            max={N_MAX}
            step={1}
            value={params.n}
            onInput={(event) => onParamsChange({ n: Number(event.currentTarget.value) })}
          />
        </div>
      </div>
      <div className="curve-work-mode-toggle curve-work-mode-toggle--dense">
        <button
          type="button"
          className="curve-work-mode-button"
          aria-pressed="false"
          onClick={() => setParams(DEFAULT_DEMOIVRE_NTH_ROOTS_PARAMS)}
        >
          重設
        </button>
      </div>
    </WorkControlsPortal>
  );

  return (
    <>
      <div
        ref={canvasHostRef}
        className="curve-work-canvas-host work-canvas"
        aria-label="棣美弗定理與 n 次方根互動：可拖動複數 z"
      />
      {controls}
    </>
  );
}
