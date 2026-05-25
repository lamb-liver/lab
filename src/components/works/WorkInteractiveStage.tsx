import type { ComponentType } from 'react';
import type { WorkInteractiveSlug } from '../../works/interactiveRegistry';
import { isWorkInteractive, workControlsMountId } from '../../works/interactiveRegistry';
import ChladniFiguresCurveRoot from './ChladniFiguresCurveRoot';
import ConicEnvelopeCurveRoot from './ConicEnvelopeCurveRoot';
import ConicFocusLocusCurveRoot from './ConicFocusLocusCurveRoot';
import HarmonographCurveRoot from './HarmonographCurveRoot';
import InterferenceFringesCurveRoot from './InterferenceFringesCurveRoot';
import LissajousCurveRoot from './LissajousCurveRoot';
import ParabolicReflectionCurveRoot from './ParabolicReflectionCurveRoot';
import RoseCurveRoot from './RoseCurveRoot';
import SpirographCurveRoot from './SpirographCurveRoot';
import AffineIfsFractalCurveRoot from './AffineIfsFractalCurveRoot';
import AffineTransformPatternCurveRoot from './AffineTransformPatternCurveRoot';
import RiemannSumCurveRoot from './RiemannSumCurveRoot';
import RotationScaleCompositionCurveRoot from './RotationScaleCompositionCurveRoot';
import CatenaryCurveRoot from './CatenaryCurveRoot';
import TangentApproximationCurveRoot from './TangentApproximationCurveRoot';
import LinearTransformGridCurveRoot from './LinearTransformGridCurveRoot';
import StandingWaveCurveRoot from './StandingWaveCurveRoot';
import EquiangularSpiralCurveRoot from './EquiangularSpiralCurveRoot';
import VectorFieldStreamlinesCurveRoot from './VectorFieldStreamlinesCurveRoot';

type RootProps = { controlsMountId?: string };

const rootBySlug = {
  'rose-curve': RoseCurveRoot,
  'lissajous-curve': LissajousCurveRoot,
  'harmonograph-curve': HarmonographCurveRoot,
  'spirograph-curve': SpirographCurveRoot,
  'standing-wave': StandingWaveCurveRoot,
  'interference-fringes': InterferenceFringesCurveRoot,
  'chladni-figures': ChladniFiguresCurveRoot,
  'parabolic-reflection': ParabolicReflectionCurveRoot,
  'conic-envelope': ConicEnvelopeCurveRoot,
  'conic-focus-locus': ConicFocusLocusCurveRoot,
  'linear-transform-grid': LinearTransformGridCurveRoot,
  'affine-transform-pattern': AffineTransformPatternCurveRoot,
  'rotation-scale-composition': RotationScaleCompositionCurveRoot,
  'affine-ifs-fractal': AffineIfsFractalCurveRoot,
  'riemann-sum': RiemannSumCurveRoot,
  'tangent-approximation': TangentApproximationCurveRoot,
  'catenary': CatenaryCurveRoot,
  'equiangular-spiral': EquiangularSpiralCurveRoot,
  'vector-field-streamlines': VectorFieldStreamlinesCurveRoot,
} satisfies Record<WorkInteractiveSlug, ComponentType<RootProps>>;

type Props = {
  slug: string;
};

export default function WorkInteractiveStage({ slug }: Props) {
  if (!isWorkInteractive(slug)) return null;

  const Root = rootBySlug[slug];
  return <Root controlsMountId={workControlsMountId(slug)} />;
}
