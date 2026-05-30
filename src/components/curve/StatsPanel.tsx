import type { CurveMetadata } from '../../curve/types';

type Props = {
  metadata: CurveMetadata;
};

export default function StatsPanel({ metadata }: Props) {
  return (
    <dl className="curve-work-controls__stats">
      {metadata.stats.slice(0, 4).map((stat) => (
        <div key={stat.key}>
          <dt>{stat.label}</dt>
          <dd>{stat.value}</dd>
        </div>
      ))}
    </dl>
  );
}
