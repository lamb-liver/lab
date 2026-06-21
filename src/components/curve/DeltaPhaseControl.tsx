import '../../styles/components/works/lissajous-delta-control.css';

const DELTA_TICKS = [
  { value: 0, label: '0' },
  { value: Math.PI / 2, label: 'π/2' },
  { value: Math.PI, label: 'π' },
  { value: (3 * Math.PI) / 2, label: '3π/2' },
  { value: 2 * Math.PI, label: '2π' },
] as const;

const TWO_PI = 2 * Math.PI;
const SNAP_THRESHOLD = 0.12;

function snapDelta(value: number): number {
  let best = value;
  let bestDist = SNAP_THRESHOLD;

  for (const tick of DELTA_TICKS) {
    const d = Math.abs(value - tick.value);
    if (d < bestDist) {
      bestDist = d;
      best = tick.value;
    }
  }

  if (Math.abs(value - TWO_PI) < SNAP_THRESHOLD) {
    return TWO_PI;
  }

  return best;
}

type Props = {
  moduleId: string;
  targetDelta: number;
  displayDelta: number;
  onTargetChange: (delta: number) => void;
};

export default function DeltaPhaseControl({
  moduleId,
  targetDelta,
  displayDelta,
  onTargetChange,
}: Props) {
  const nearTick = DELTA_TICKS.find((t) => Math.abs(displayDelta - t.value) < SNAP_THRESHOLD)?.value;

  const handleInput = (raw: number) => {
    onTargetChange(snapDelta(raw));
  };

  return (
    <div className="delta-phase-control">
      <label className="delta-phase-control__label" htmlFor={`${moduleId}-delta`}>
        相位 δ
      </label>
      <div className="delta-phase-wrap range-wrap">
        <div className="delta-phase-ticks" aria-hidden>
          {DELTA_TICKS.map((tick) => (
            <span
              key={tick.label}
              className={`delta-phase-tick${nearTick === tick.value ? ' delta-phase-tick--near' : ''}`}
              style={{ left: `${(tick.value / TWO_PI) * 100}%` }}
            />
          ))}
        </div>
        <input
          id={`${moduleId}-delta`}
          type="range"
          className="range"
          min={0}
          max={TWO_PI}
          step={0.01}
          value={targetDelta}
          onInput={(e) => handleInput(Number(e.currentTarget.value))}
        />
      </div>
      <div className="delta-phase-buttons" role="group" aria-label="δ 快速定點">
        {DELTA_TICKS.map((tick) => (
          <button
            key={tick.label}
            type="button"
            className={`delta-phase-btn${Math.abs(targetDelta - tick.value) < 0.02 ? ' delta-phase-btn--active' : ''}`}
            onClick={() => onTargetChange(tick.value)}
          >
            {tick.label}
          </button>
        ))}
      </div>
    </div>
  );
}
