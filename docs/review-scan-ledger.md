# Review Scan Ledger

本文件只用來輔助接續審查：標記哪些範圍已掃描、已修正、已確認或仍待處理，避免下一輪把同一批項目當成未知範圍重掃。

它不是 runtime 規格。若本文件與 `src/`、`AGENTS.md`、`editing-rules.md` 或其他 canonical 文件衝突，以 canonical 文件為準。

## 使用規則

- 已列為「已掃描並修正」的項目，下一輪審查預設不再重複盤點，除非該檔案之後又被修改。
- 已列為「已確認保留」的項目，下一輪只在相關契約或使用情境改變時重查。
- 已列為「仍待處理」的項目，不得當成已修正。
- 沒列在本文件的檔案，不代表已掃描。
- 新增紀錄時，只寫可驗證的結果；不要寫「可能」、「之後也許」或未完成的推測。

## 全專案掃描進度

更新日：2026-06-22。

口徑：

- 掃描面使用目前 `git ls-files` 加上未被 ignore 的本輪新增檔案。
- `schedule.md`、`.vscode/*`、`content-update-inventory.local.md` 已是 local-only 或刪除面，不列入未掃描清單。
- 「已掃描」只代表本 ledger 已有明確結論；「尚未掃描」不代表有問題。
- 後續每掃完一批檔案，必須把檔案從「尚未掃描」移到「已掃描」，並在下方紀錄表補上結論。

| 狀態 | 檔案數 |
|------|------:|
| 掃描面總數 | 744 |
| 已掃描檔案 | 623 |
| 尚未掃描檔案 | 121 |
| 已掃描但不列入 repo 掃描面 | 8 |

<details open>
<summary>已掃描檔案（623）</summary>

- `.cursor/rules/code-review.mdc`
- `.github/workflows/deploy.yml`
- `.gitignore`
- `AGENTS.md`
- `README.md`
- `astro.config.mjs`
- `docs/AGENTS.md`
- `docs/README.md`
- `docs/architecture.md`
- `docs/archive/visual_math_geometry_review.md`
- `docs/art.md`
- `docs/editing-rules.md`
- `docs/exploreart.md`
- `docs/exploreplan.md`
- `docs/frontend-validation.md`
- `docs/lab-release-system.md`
- `docs/math-content-review-checklist.md`
- `docs/p5toreact.md`
- `docs/public-pages-audit.md`
- `docs/reactkey.md`
- `docs/review-scan-ledger.md`
- `docs/site-ux.md`
- `docs/textstyle.md`
- `docs/workart.md`
- `package-lock.json`
- `package.json`
- `playwright.config.ts`
- `public/.nojekyll`
- `public/CNAME`
- `public/explore/fourier-series-epicycles-cover.png`
- `public/images/explore-covers/complex-euler-formula.png`
- `public/images/explore-covers/conic-dynamic-geometry.png`
- `public/images/explore-covers/data-analysis.png`
- `public/images/explore-covers/differential-equations-geometry.png`
- `public/images/explore-covers/exponential-logarithm.png`
- `public/images/explore-covers/function-equations.png`
- `public/images/explore-covers/limits-riemann-sum.png`
- `public/images/explore-covers/matrix-linear-transform.png`
- `public/images/explore-covers/permutations-combinations.png`
- `public/images/explore-covers/probability-statistics.png`
- `public/images/explore-covers/rational-functions-asymptotes.png`
- `public/images/explore-covers/sequences-and-series.png`
- `public/images/explore-covers/trig-function-graphs.png`
- `public/images/explore-covers/trig-wave-interference.png`
- `public/images/explore-covers/trigonometry-fundamentals.png`
- `public/images/explore-covers/vectors.png`
- `public/lab-favicon-eb-garamond.svg`
- `public/robots.txt`
- `scripts/audit-content.mjs`
- `scripts/audit-explore-covers.mjs`
- `scripts/audit-integration.mjs`
- `scripts/explore-covers/complex-euler-formula.svg`
- `scripts/explore-covers/conic-dynamic-geometry.svg`
- `scripts/explore-covers/data-analysis.svg`
- `scripts/explore-covers/differential-equations-geometry.svg`
- `scripts/explore-covers/exponential-logarithm.svg`
- `scripts/explore-covers/function-equations.svg`
- `scripts/explore-covers/generate.mjs`
- `scripts/explore-covers/limits-riemann-sum.svg`
- `scripts/explore-covers/matrix-linear-transform.svg`
- `scripts/explore-covers/permutations-combinations.svg`
- `scripts/explore-covers/probability-statistics.svg`
- `scripts/explore-covers/rational-functions-asymptotes.svg`
- `scripts/explore-covers/sequences-and-series.svg`
- `scripts/explore-covers/trig-function-graphs.svg`
- `scripts/explore-covers/trig-wave-interference.svg`
- `scripts/explore-covers/trigonometry-fundamentals.svg`
- `scripts/explore-covers/vectors.svg`
- `scripts/lab.mjs`
- `scripts/new-explore.mjs`
- `scripts/new-work.mjs`
- `scripts/run-smoke.mjs`
- `scripts/validate-changed.mjs`
- `scripts/validate-frontend.sh`
- `src/components/Breadcrumb.astro`
- `src/components/CanvasPlaceholder.astro`
- `src/components/CardThumbFallback.astro`
- `src/components/ExploreCard.astro`
- `src/components/FilterBar.astro`
- `src/components/Footer.astro`
- `src/components/HeroCanvas.tsx`
- `src/components/HeroCanvasShell.astro`
- `src/components/ListSearchFilterScript.astro`
- `src/components/Nav.astro`
- `src/components/WorkCard.astro`
- `src/components/curve/CurveHookWorkRoot.tsx`
- `src/components/curve/CurveWorkRoot.tsx`
- `src/components/curve/DeltaPhaseControl.tsx`
- `src/components/curve/ParamControls.tsx`
- `src/components/curve/StatsPanel.tsx`
- `src/components/curve/p5RendererReady.ts`
- `src/components/curve/useAffineIfsFractalP5.ts`
- `src/components/curve/useAffineTransformPatternP5.ts`
- `src/components/curve/useArithmeticGeometricSequencesP5.ts`
- `src/components/curve/useBaselProblemP5.ts`
- `src/components/curve/useBinomialExpansionGeometryP5.ts`
- `src/components/curve/useBinomialToNormalP5.ts`
- `src/components/curve/useBuffonNeedleP5.ts`
- `src/components/curve/useCatalanNumbersP5.ts`
- `src/components/curve/useCatenaryP5.ts`
- `src/components/curve/useChladniP5.ts`
- `src/components/curve/useCombinatorialPathCountingP5.ts`
- `src/components/curve/useComplexArithmeticGeometryP5.ts`
- `src/components/curve/useComplexPhasePortraitP5.ts`
- `src/components/curve/useComplexPolarFormP5.ts`
- `src/components/curve/useConditionalProbabilityBayesP5.ts`
- `src/components/curve/useConicEnvelopeP5.ts`
- `src/components/curve/useConicFocusLocusP5.ts`
- `src/components/curve/useDotProductGeometryP5.ts`
- `src/components/curve/useEigenvectorGeometryP5.ts`
- `src/components/curve/useEquiangularSpiralP5.ts`
- `src/components/curve/useEulerFormulaRotationP5.ts`
- `src/components/curve/useExponentialGrowthDecayP5.ts`
- `src/components/curve/useFibonacciSpiralP5.ts`
- `src/components/curve/useFunctionDerivativeGraphP5.ts`
- `src/components/curve/useFunctionGraphTransformP5.ts`
- `src/components/curve/useInterferenceFringesP5.ts`
- `src/components/curve/useInverseFunctionReflectionP5.ts`
- `src/components/curve/useJuliaP5.ts`
- `src/components/curve/useLawOfSinesCosinesP5.ts`
- `src/components/curve/useLinearTransformGridP5.ts`
- `src/components/curve/useLogarithmicScaleP5.ts`
- `src/components/curve/useLogisticBifurcationP5.ts`
- `src/components/curve/useLogisticCurveP5.ts`
- `src/components/curve/useMorphCurveP5.draw.test.ts`
- `src/components/curve/useMorphCurveP5.ts`
- `src/components/curve/useNaturalLogEGeometryP5.ts`
- `src/components/curve/useP5CanvasHost.ts`
- `src/components/curve/useParabolicReflectionP5.ts`
- `src/components/curve/usePascalsTriangleP5.ts`
- `src/components/curve/usePercentileBoxPlotP5.ts`
- `src/components/curve/usePolynomialRootsMultiplicityP5.ts`
- `src/components/curve/useQuadraticCompletingSquareP5.ts`
- `src/components/curve/useRadianArcLengthP5.ts`
- `src/components/curve/useRationalObliqueAsymptoteP5.ts`
- `src/components/curve/useRationalVerticalHorizontalAsymptotesP5.ts`
- `src/components/curve/useRectP5CanvasHost.ts`
- `src/components/curve/useRegressionOutlierInfluenceP5.ts`
- `src/components/curve/useRiemannSumP5.ts`
- `src/components/curve/useRotationScaleCompositionP5.ts`
- `src/components/curve/useScatterCorrelationRegressionP5.ts`
- `src/components/curve/useSierpinskiTriangleP5.ts`
- `src/components/curve/useSinusoidAmplitudePeriodPhaseP5.ts`
- `src/components/curve/useSmoothParamNotifier.test.ts`
- `src/components/curve/useSmoothParamNotifier.ts`
- `src/components/curve/useStandingWaveP5.ts`
- `src/components/curve/useTangentApproximationP5.ts`
- `src/components/curve/useTaylorPolynomialApproximationP5.ts`
- `src/components/curve/useTrigAngleIdentitiesP5.ts`
- `src/components/curve/useUnitCircleTrigDefinitionP5.ts`
- `src/components/curve/useVectorAdditionScalarP5.ts`
- `src/components/curve/useVectorFieldPatternsP5.ts`
- `src/components/curve/useVectorFieldStreamlinesP5.ts`
- `src/components/curve/useVectorProjectionP5.ts`
- `src/components/explore/ComplexEulerFormulaExploreRoot.tsx`
- `src/components/explore/ConicDynamicGeometryExploreRoot.tsx`
- `src/components/explore/DataAnalysisExploreRoot.tsx`
- `src/components/explore/DifferentialEquationsGeometryExploreRoot.tsx`
- `src/components/explore/ExploreInteractiveStage.tsx`
- `src/components/explore/ExponentialLogarithmExploreRoot.tsx`
- `src/components/explore/FourierSeriesExploreRoot.tsx`
- `src/components/explore/FunctionEquationsExploreRoot.tsx`
- `src/components/explore/LimitsRiemannSumExploreRoot.tsx`
- `src/components/explore/MatrixLinearTransformExploreRoot.tsx`
- `src/components/explore/PermutationsCombinationsExploreRoot.tsx`
- `src/components/explore/ProbabilityStatisticsExploreRoot.tsx`
- `src/components/explore/RationalFunctionsAsymptotesExploreRoot.tsx`
- `src/components/explore/SequencesAndSeriesExploreRoot.tsx`
- `src/components/explore/TrigFunctionGraphsExploreRoot.tsx`
- `src/components/explore/TrigonometryFundamentalsExploreRoot.tsx`
- `src/components/explore/VectorsExploreRoot.tsx`
- `src/components/explore/WaveSuperpositionExploreRoot.tsx`
- `src/components/works/AffineIfsFractalCurveRoot.tsx`
- `src/components/works/AffineTransformPatternCurveRoot.tsx`
- `src/components/works/ArithmeticGeometricSequencesCurveRoot.tsx`
- `src/components/works/BaselProblemCurveRoot.tsx`
- `src/components/works/BinomialExpansionGeometryCurveRoot.tsx`
- `src/components/works/BinomialToNormalCurveRoot.tsx`
- `src/components/works/BuffonNeedleCurveRoot.tsx`
- `src/components/works/CatalanNumbersCurveRoot.tsx`
- `src/components/works/CatenaryCurveRoot.tsx`
- `src/components/works/ChladniFiguresCurveRoot.tsx`
- `src/components/works/ComplexArithmeticGeometryCurveRoot.tsx`
- `src/components/works/ComplexPhasePortraitCurveRoot.tsx`
- `src/components/works/ComplexPolarFormCurveRoot.tsx`
- `src/components/works/CombinatorialPathCountingCurveRoot.tsx`
- `src/components/works/ConditionalProbabilityBayesCurveRoot.tsx`
- `src/components/works/ConicEnvelopeCurveRoot.tsx`
- `src/components/works/ConicFocusLocusCurveRoot.tsx`
- `src/components/works/DotProductGeometryCurveRoot.tsx`
- `src/components/works/EigenvectorGeometryCurveRoot.tsx`
- `src/components/works/EquiangularSpiralCurveRoot.tsx`
- `src/components/works/EulerFormulaRotationCurveRoot.tsx`
- `src/components/works/ExponentialGrowthDecayCurveRoot.tsx`
- `src/components/works/FibonacciSpiralCurveRoot.tsx`
- `src/components/works/FunctionDerivativeGraphCurveRoot.tsx`
- `src/components/works/FunctionGraphTransformCurveRoot.tsx`
- `src/components/works/HarmonographCurveRoot.tsx`
- `src/components/works/InterferenceFringesCurveRoot.tsx`
- `src/components/works/InverseFunctionReflectionCurveRoot.tsx`
- `src/components/works/JuliaSetCurveRoot.tsx`
- `src/components/works/LawOfSinesCosinesCurveRoot.tsx`
- `src/components/works/LinearTransformGridCurveRoot.tsx`
- `src/components/works/LissajousCurveRoot.tsx`
- `src/components/works/LogarithmicScaleCurveRoot.tsx`
- `src/components/works/LogisticBifurcationCurveRoot.tsx`
- `src/components/works/LogisticCurveCurveRoot.tsx`
- `src/components/works/NaturalLogEGeometryCurveRoot.tsx`
- `src/components/works/PascalsTriangleCurveRoot.tsx`
- `src/components/works/ParabolicReflectionCurveRoot.tsx`
- `src/components/works/PercentileBoxPlotCurveRoot.tsx`
- `src/components/works/PolynomialRootsMultiplicityCurveRoot.tsx`
- `src/components/works/QuadraticCompletingSquareCurveRoot.tsx`
- `src/components/works/RadianArcLengthCurveRoot.tsx`
- `src/components/works/RationalObliqueAsymptoteCurveRoot.tsx`
- `src/components/works/RationalVerticalHorizontalAsymptotesCurveRoot.tsx`
- `src/components/works/RegressionOutlierInfluenceCurveRoot.tsx`
- `src/components/works/RiemannSumCurveRoot.tsx`
- `src/components/works/RoseCurveRoot.tsx`
- `src/components/works/RotationScaleCompositionCurveRoot.tsx`
- `src/components/works/ScatterCorrelationRegressionCurveRoot.tsx`
- `src/components/works/SierpinskiTriangleCurveRoot.tsx`
- `src/components/works/SinusoidAmplitudePeriodPhaseCurveRoot.tsx`
- `src/components/works/SpirographCurveRoot.tsx`
- `src/components/works/StandingWaveCurveRoot.tsx`
- `src/components/works/TangentApproximationCurveRoot.tsx`
- `src/components/works/TaylorPolynomialApproximationCurveRoot.tsx`
- `src/components/works/TrigAngleIdentitiesCurveRoot.tsx`
- `src/components/works/UnitCircleTrigDefinitionCurveRoot.tsx`
- `src/components/works/VectorAdditionScalarCurveRoot.tsx`
- `src/components/works/VectorFieldPatternsCurveRoot.tsx`
- `src/components/works/VectorFieldStreamlinesCurveRoot.tsx`
- `src/components/works/VectorProjectionCurveRoot.tsx`
- `src/components/works/WorkInteractiveStage.tsx`
- `src/content.config.ts`
- `src/content/contentAudit.test.ts`
- `src/content/contentAudit.ts`
- `src/content/descriptionMath.test.ts`
- `src/content/descriptionMath.ts`
- `src/content/explore/discrete-random-variables.md`
- `src/content/explore/linear-programming.md`
- `src/content/explore/space-vectors-planes-lines.md`
- `src/content/explore/complex-euler-formula.md`
- `src/content/explore/conic-dynamic-geometry.md`
- `src/content/explore/data-analysis.md`
- `src/content/explore/differential-equations-geometry.md`
- `src/content/explore/exponential-logarithm.md`
- `src/content/explore/fourier-series.md`
- `src/content/explore/function-equations.md`
- `src/content/explore/limits-riemann-sum.md`
- `src/content/explore/matrix-linear-transform.md`
- `src/content/explore/permutations-combinations.md`
- `src/content/explore/probability-statistics.md`
- `src/content/explore/rational-functions-asymptotes.md`
- `src/content/explore/sequences-and-series.md`
- `src/content/explore/trig-function-graphs.md`
- `src/content/explore/trig-wave-interference.md`
- `src/content/explore/trigonometry-fundamentals.md`
- `src/content/explore/vectors.md`
- `src/content/exploreEntries.ts`
- `src/content/explorePager.test.ts`
- `src/content/generatorScripts.test.ts`
- `src/content/releaseAudit.test.ts`
- `src/content/utils.test.ts`
- `src/content/utils.ts`
- `src/content/works/percentile-box-plot.md`
- `src/content/works/regression-outlier-influence.md`
- `src/content/works/scatter-correlation-regression.md`
- `src/content/works/affine-ifs-fractal.md`
- `src/content/works/affine-transform-pattern.md`
- `src/content/works/arithmetic-geometric-sequences.md`
- `src/content/works/basel-problem.md`
- `src/content/works/binomial-expansion-geometry.md`
- `src/content/works/binomial-geometric-distribution.md`
- `src/content/works/binomial-to-normal.md`
- `src/content/works/buffon-needle.md`
- `src/content/works/catalan-numbers.md`
- `src/content/works/catenary.md`
- `src/content/works/chladni-figures.md`
- `src/content/works/combinatorial-path-counting.md`
- `src/content/works/complex-arithmetic-geometry.md`
- `src/content/works/complex-phase-portrait.md`
- `src/content/works/complex-polar-form.md`
- `src/content/works/conditional-probability-bayes.md`
- `src/content/works/conic-envelope.md`
- `src/content/works/conic-focus-locus.md`
- `src/content/works/cross-product-geometry.md`
- `src/content/works/dot-product-geometry.md`
- `src/content/works/eigenvector-geometry.md`
- `src/content/works/equiangular-spiral.md`
- `src/content/works/euler-formula-rotation.md`
- `src/content/works/exponential-growth-decay.md`
- `src/content/works/fibonacci-spiral.md`
- `src/content/works/function-derivative-graph.md`
- `src/content/works/function-graph-transform.md`
- `src/content/works/harmonograph-curve.md`
- `src/content/works/interference-fringes.md`
- `src/content/works/inverse-function-reflection.md`
- `src/content/works/julia-set.md`
- `src/content/works/law-of-sines-cosines.md`
- `src/content/works/line-plane-intersection.md`
- `src/content/works/linear-transform-grid.md`
- `src/content/works/lissajous-curve.md`
- `src/content/works/logarithmic-scale.md`
- `src/content/works/logistic-bifurcation.md`
- `src/content/works/logistic-curve.md`
- `src/content/works/lp-feasible-half-planes.md`
- `src/content/works/lp-objective-level-curves.md`
- `src/content/works/lp-vertex-optimum.md`
- `src/content/works/natural-log-e-geometry.md`
- `src/content/works/parabolic-reflection.md`
- `src/content/works/pascals-triangle.md`
- `src/content/works/plane-normal-distance.md`
- `src/content/works/polynomial-roots-multiplicity.md`
- `src/content/works/quadratic-completing-square.md`
- `src/content/works/radian-arc-length.md`
- `src/content/works/rational-oblique-asymptote.md`
- `src/content/works/rational-vertical-horizontal-asymptotes.md`
- `src/content/works/riemann-sum.md`
- `src/content/works/rose-curve.md`
- `src/content/works/rotation-scale-composition.md`
- `src/content/works/sierpinski-triangle.md`
- `src/content/works/sinusoid-amplitude-period-phase.md`
- `src/content/works/space-vector-three-plane-projection.md`
- `src/content/works/spirograph-curve.md`
- `src/content/works/standing-wave.md`
- `src/content/works/tangent-approximation.md`
- `src/content/works/taylor-polynomial-approximation.md`
- `src/content/works/trig-angle-identities.md`
- `src/content/works/unit-circle-trig-definition.md`
- `src/content/works/vector-addition-scalar.md`
- `src/content/works/vector-field-patterns.md`
- `src/content/works/vector-field-streamlines.md`
- `src/content/works/vector-projection.md`
- `src/curve/animation.ts`
- `src/curve/cache.ts`
- `src/curve/canvasSize.ts`
- `src/curve/cartesianPlot.ts`
- `src/curve/constants.ts`
- `src/curve/defaults.ts`
- `src/curve/modules/affine-ifs-fractal/affine-ifs-fractal.test.ts`
- `src/curve/modules/affine-ifs-fractal/animation.ts`
- `src/curve/modules/affine-ifs-fractal/geometry.ts`
- `src/curve/modules/affine-ifs-fractal/index.ts`
- `src/curve/modules/affine-transform-pattern/affine-transform-pattern.test.ts`
- `src/curve/modules/affine-transform-pattern/animation.ts`
- `src/curve/modules/affine-transform-pattern/geometry.ts`
- `src/curve/modules/affine-transform-pattern/index.ts`
- `src/curve/modules/animationTiming.ts`
- `src/curve/modules/catalan-numbers/geometry.ts`
- `src/curve/modules/combinatorial-path-counting/geometry.ts`
- `src/curve/modules/logistic-curve/animation.ts`
- `src/curve/modules/logistic-curve/geometry.ts`
- `src/curve/modules/logistic-curve/index.ts`
- `src/curve/modules/logistic-curve/logistic-curve.test.ts`
- `src/curve/modules/matrix-linear-transform/animation.test.ts`
- `src/curve/modules/matrix-linear-transform/animation.ts`
- `src/curve/modules/percentile-box-plot/geometry.ts`
- `src/curve/modules/percentile-box-plot/percentile-box-plot.test.ts`
- `src/curve/modules/radian-arc-length/geometry.ts`
- `src/curve/modules/radian-arc-length/radian-arc-length.test.ts`
- `src/curve/modules/scatter-correlation-regression/geometry.ts`
- `src/curve/modules/scatter-correlation-regression/index.ts`
- `src/curve/modules/scatter-correlation-regression/scatter-correlation-regression.test.ts`
- `src/curve/modules/trig-angle-identities/geometry.ts`
- `src/curve/modules/trig-angle-identities/trig-angle-identities.test.ts`
- `src/curve/modules/unit-circle-trig-definition/geometry.ts`
- `src/curve/modules/unit-circle-trig-definition/unit-circle-trig-definition.test.ts`
- `src/curve/morphFrame.test.ts`
- `src/curve/morphFrame.ts`
- `src/curve/prng.ts`
- `src/curve/registry.ts`
- `src/curve/resolveSmoothParams.test.ts`
- `src/curve/resolveSmoothParams.ts`
- `src/curve/thumbnailPointCloud.ts`
- `src/curve/types.ts`
- `src/explore/data-analysis/geometry.test.ts`
- `src/explore/data-analysis/geometry.ts`
- `src/explore/interactiveRegistry.ts`
- `src/layouts/BaseLayout.astro`
- `src/lib/curveThumbnail.registry.test.ts`
- `src/lib/curveThumbnail.test.ts`
- `src/lib/curveThumbnail.ts`
- `src/lib/defaultOg.test.ts`
- `src/lib/defaultOg.ts`
- `src/lib/listFilter.test.ts`
- `src/lib/listFilter.ts`
- `src/lib/seoCopy.test.ts`
- `src/lib/seoCopy.ts`
- `src/lib/siteLinks.ts`
- `src/lib/workOgFonts.ts`
- `src/lib/workOgImage.test.ts`
- `src/lib/workOgImage.ts`
- `src/lib/workOgSatori.tsx`
- `src/pages/about.astro`
- `src/pages/explore/[slug].astro`
- `src/pages/explore/index.astro`
- `src/pages/index.astro`
- `src/pages/og/works/[slug].png.ts`
- `src/pages/thumbs/works/[slug].svg.ts`
- `src/pages/works/[slug].astro`
- `src/pages/works/index.astro`
- `src/registry.sync.test.ts`
- `src/styles/components/card.css`
- `src/styles/components/explore/data-analysis-explore.css`
- `src/styles/components/explore/explore-stage.css`
- `src/styles/base.css`
- `src/styles/components/breadcrumb.css`
- `src/styles/components/canvas.css`
- `src/styles/components/explore-touch.css`
- `src/styles/components/explore/complex-euler-formula-explore.css`
- `src/styles/components/explore/conic-dynamic-geometry-explore.css`
- `src/styles/components/explore/differential-equations-geometry-explore.css`
- `src/styles/components/explore/explore-toolbar.css`
- `src/styles/components/explore/exponential-logarithm-explore.css`
- `src/styles/components/explore/fourier-explore.css`
- `src/styles/components/explore/function-equations-explore.css`
- `src/styles/components/explore/limits-riemann-sum-explore.css`
- `src/styles/components/explore/matrix-linear-transform-explore.css`
- `src/styles/components/explore/permutations-combinations-explore.css`
- `src/styles/components/explore/probability-statistics-explore.css`
- `src/styles/components/explore/rational-functions-asymptotes-explore.css`
- `src/styles/components/explore/sequences-and-series-explore.css`
- `src/styles/components/explore/trig-function-graphs-explore.css`
- `src/styles/components/explore/trigonometry-explore.css`
- `src/styles/components/explore/vectors-explore.css`
- `src/styles/components/explore/wave-superposition-explore.css`
- `src/styles/components/filter.css`
- `src/styles/components/footer.css`
- `src/styles/components/list-search.css`
- `src/styles/components/nav.css`
- `src/styles/components/range.css`
- `src/styles/components/section-badge.css`
- `src/styles/components/works/curve-work-demo.css`
- `src/styles/components/works/lissajous-delta-control.css`
- `src/styles/layout.css`
- `src/styles/pages/about.css`
- `src/styles/pages/explore-detail.css`
- `src/styles/pages/home.css`
- `src/styles/pages/work-detail.css`
- `src/styles/prose.css`
- `src/styles/tokens.css`
- `src/styles/scrollbar.css`
- `src/systems/rendering/affineIfsFractalRender.ts`
- `src/systems/rendering/affineTransformPatternRender.ts`
- `src/systems/rendering/arithmeticGeometricSequencesRender.ts`
- `src/systems/rendering/baselProblemRender.ts`
- `src/systems/rendering/binomialExpansionGeometryRender.ts`
- `src/systems/rendering/binomialToNormalRender.ts`
- `src/systems/rendering/buffonNeedleRender.ts`
- `src/systems/rendering/cartesianGrid.ts`
- `src/systems/rendering/catalanNumbersRender.ts`
- `src/systems/rendering/catenaryRender.ts`
- `src/systems/rendering/chladniRender.ts`
- `src/systems/rendering/combinatorialPathCountingRender.ts`
- `src/systems/rendering/complexArithmeticGeometryRender.ts`
- `src/systems/rendering/complexEulerFormulaRender.ts`
- `src/systems/rendering/complexPhasePortraitRender.ts`
- `src/systems/rendering/complexPolarFormRender.ts`
- `src/systems/rendering/conditionalProbabilityBayesRender.ts`
- `src/systems/rendering/conicDynamicGeometryRender.ts`
- `src/systems/rendering/conicEnvelopeRender.ts`
- `src/systems/rendering/conicFocusLocusRender.ts`
- `src/systems/rendering/differentialEquationsGeometryRender.ts`
- `src/systems/rendering/dotProductGeometryRender.ts`
- `src/systems/rendering/eigenvectorGeometryRender.ts`
- `src/systems/rendering/equiangularSpiralRender.ts`
- `src/systems/rendering/eulerFormulaRotationRender.ts`
- `src/systems/rendering/exponentialGrowthDecayRender.ts`
- `src/systems/rendering/fibonacciSpiralRender.ts`
- `src/systems/rendering/fourierRender.ts`
- `src/systems/rendering/frame.ts`
- `src/systems/rendering/functionDerivativeGraphRender.ts`
- `src/systems/rendering/functionEquationsExploreRender.ts`
- `src/systems/rendering/functionGraphTransformRender.ts`
- `src/systems/rendering/interferenceFringeRender.ts`
- `src/systems/rendering/inverseFunctionReflectionRender.ts`
- `src/systems/rendering/lawOfSinesCosinesRender.ts`
- `src/systems/rendering/limitsRiemannSumRender.ts`
- `src/systems/rendering/linearTransformGridRender.ts`
- `src/systems/rendering/logarithmicScaleRender.ts`
- `src/systems/rendering/logisticBifurcationRender.ts`
- `src/systems/rendering/logisticCurveRender.ts`
- `src/systems/rendering/matrixLinearTransformRender.ts`
- `src/systems/rendering/naturalLogEGeometryRender.ts`
- `src/systems/rendering/parabolicReflectionRender.ts`
- `src/systems/rendering/pascalsTriangleRender.ts`
- `src/systems/rendering/percentileBoxPlotRender.ts`
- `src/systems/rendering/polarGrid.ts`
- `src/systems/rendering/polyline.ts`
- `src/systems/rendering/polynomialRootsMultiplicityRender.ts`
- `src/systems/rendering/presets.ts`
- `src/systems/rendering/quadraticCompletingSquareRender.ts`
- `src/systems/rendering/radianArcLengthRender.ts`
- `src/systems/rendering/rationalFunctionsAsymptotesExploreRender.ts`
- `src/systems/rendering/rationalObliqueAsymptoteRender.ts`
- `src/systems/rendering/rationalVerticalHorizontalAsymptotesRender.ts`
- `src/systems/rendering/reveal.ts`
- `src/systems/rendering/riemannSumRender.ts`
- `src/systems/rendering/rotationScaleCompositionRender.ts`
- `src/systems/rendering/scatterCorrelationRegressionRender.ts`
- `src/systems/rendering/sierpinskiTriangleRender.ts`
- `src/systems/rendering/sinusoidAmplitudePeriodPhaseRender.ts`
- `src/systems/rendering/standingWaveRender.ts`
- `src/systems/rendering/tangentApproximationRender.ts`
- `src/systems/rendering/taylorPolynomialApproximationRender.ts`
- `src/systems/rendering/trigAngleIdentitiesRender.ts`
- `src/systems/rendering/trigFunctionGraphsExploreRender.ts`
- `src/systems/rendering/trigonometryExploreRender.ts`
- `src/systems/rendering/types.ts`
- `src/systems/rendering/unitCircleTrigDefinitionRender.ts`
- `src/systems/rendering/vectorAdditionScalarRender.ts`
- `src/systems/rendering/vectorFieldPatternsRender.ts`
- `src/systems/rendering/vectorFieldStreamlinesRender.ts`
- `src/systems/rendering/vectorProjectionRender.ts`
- `src/systems/rendering/waveSuperpositionRender.ts`
- `src/systems/rendering/p5PlotHelpers.ts`
- `src/systems/rendering/regressionOutlierInfluenceRender.ts`
- `src/test/contentSlugs.test.ts`
- `src/test/contentSlugs.ts`
- `src/works/interactiveRegistry.ts`
- `tsconfig.json`
- `vitest.config.ts`
- `src/curve/modules/arithmetic-geometric-sequences/geometry.ts`
- `src/curve/modules/arithmetic-geometric-sequences/index.ts`
- `src/curve/modules/basel-problem/geometry.ts`
- `src/curve/modules/basel-problem/index.ts`
- `src/curve/modules/binomial-expansion-geometry/geometry.ts`
- `src/curve/modules/binomial-expansion-geometry/index.ts`
- `src/curve/modules/binomial-to-normal/geometry.ts`
- `src/curve/modules/binomial-to-normal/index.ts`
- `src/curve/modules/buffon-needle/geometry.ts`
- `src/curve/modules/buffon-needle/index.ts`
- `src/curve/modules/catalan-numbers/index.ts`
- `src/curve/modules/catenary/animation.ts`
- `src/curve/modules/catenary/camera.ts`
- `src/curve/modules/catenary/catenary.test.ts`
- `src/curve/modules/catenary/geometry.ts`
- `src/curve/modules/catenary/index.ts`
- `src/curve/modules/chladni-figures/animation.ts`
- `src/curve/modules/chladni-figures/chladni-figures.test.ts`
- `src/curve/modules/chladni-figures/geometry.ts`
- `src/curve/modules/chladni-figures/index.ts`
- `src/curve/modules/combinatorial-path-counting/index.ts`
- `src/curve/modules/complex-arithmetic-geometry/animation.ts`
- `src/curve/modules/complex-arithmetic-geometry/geometry.ts`
- `src/curve/modules/complex-arithmetic-geometry/index.ts`
- `src/curve/modules/complex-euler-formula/complex.ts`
- `src/curve/modules/complex-euler-formula/constants.ts`
- `src/curve/modules/complex-euler-formula/layout.ts`
- `src/curve/modules/complex-euler-formula/types.ts`
- `src/curve/modules/complex-phase-portrait/animation.ts`
- `src/curve/modules/complex-phase-portrait/geometry.test.ts`
- `src/curve/modules/complex-phase-portrait/geometry.ts`
- `src/curve/modules/complex-phase-portrait/index.ts`
- `src/curve/modules/complex-polar-form/animation.ts`
- `src/curve/modules/complex-polar-form/geometry.ts`
- `src/curve/modules/complex-polar-form/index.ts`
- `src/curve/modules/conic-dynamic-geometry/animation.ts`
- `src/curve/modules/conic-dynamic-geometry/constants.ts`
- `src/curve/modules/conic-dynamic-geometry/geometry.ts`
- `src/curve/modules/conic-dynamic-geometry/types.ts`
- `src/curve/modules/conic-envelope/animation.ts`
- `src/curve/modules/conic-envelope/conic-envelope.test.ts`
- `src/curve/modules/conic-envelope/geometry.ts`
- `src/curve/modules/conic-envelope/index.ts`
- `src/curve/modules/conic-focus-locus/animation.ts`
- `src/curve/modules/conic-focus-locus/conic-focus-locus.test.ts`
- `src/curve/modules/conic-focus-locus/geometry.ts`
- `src/curve/modules/conic-focus-locus/index.ts`
- `src/curve/modules/conditional-probability-bayes/geometry.ts`
- `src/curve/modules/conditional-probability-bayes/index.ts`
- `src/curve/modules/conditional-probability-bayes/layout.ts`
- `src/curve/modules/differential-equations-geometry/constants.ts`
- `src/curve/modules/differential-equations-geometry/equations.ts`
- `src/curve/modules/differential-equations-geometry/layout.ts`
- `src/curve/modules/differential-equations-geometry/math.ts`
- `src/curve/modules/differential-equations-geometry/types.ts`
- `src/curve/modules/dot-product-geometry/dot-product-geometry.test.ts`
- `src/curve/modules/dot-product-geometry/geometry.ts`
- `src/curve/modules/dot-product-geometry/index.ts`
- `src/curve/modules/harmonograph/animation.ts`
- `src/curve/modules/harmonograph/harmonograph.test.ts`
- `src/curve/modules/harmonograph/index.ts`
- `src/curve/modules/lissajous/animation.ts`
- `src/curve/modules/lissajous/index.ts`
- `src/curve/modules/lissajous/lissajous.test.ts`
- `src/curve/modules/percentile-box-plot/index.ts`
- `src/curve/modules/radian-arc-length/index.ts`
- `src/curve/modules/rose/index.ts`
- `src/curve/modules/rose/rose.test.ts`
- `src/curve/modules/trig-angle-identities/index.ts`
- `src/curve/modules/unit-circle-trig-definition/index.ts`
- `src/explore/fourier/constants.ts`
- `src/explore/fourier/path.test.ts`
- `src/explore/fourier/path.ts`
- `src/explore/function-equations/constants.ts`
- `src/explore/function-equations/geometry.test.ts`
- `src/explore/function-equations/geometry.ts`
- `src/explore/function-equations/types.ts`
- `src/explore/permutations-combinations/geometry.test.ts`
- `src/explore/permutations-combinations/geometry.ts`
- `src/explore/rational-functions-asymptotes/constants.ts`
- `src/explore/rational-functions-asymptotes/geometry.ts`
- `src/explore/rational-functions-asymptotes/types.ts`
- `src/explore/trig-function-graphs/geometry.test.ts`
- `src/explore/trig-function-graphs/geometry.ts`
- `src/explore/trigonometry/constants.ts`
- `src/explore/trigonometry/geometry.test.ts`
- `src/explore/trigonometry/geometry.ts`
- `src/explore/trigonometry/types.ts`
- `src/explore/vectors/geometry.test.ts`
- `src/explore/vectors/geometry.ts`
- `src/explore/wave-superposition/canvasSize.test.ts`
- `src/explore/wave-superposition/canvasSize.ts`
- `src/explore/wave-superposition/constants.ts`
- `src/explore/wave-superposition/geometry.test.ts`
- `src/explore/wave-superposition/geometry.ts`
- `src/lib/trigonometry/triangleGeometry.test.ts`
- `src/lib/trigonometry/triangleGeometry.ts`
- `tests/explore-single.smoke.spec.ts`
- `tests/seo-ux.spec.ts`
- `tests/work-integration.smoke.spec.ts`
</details>

<details>
<summary>已掃描但不列入 repo 掃描面（8）</summary>

- `.vscode/extensions.json` - 已掃描並移出 Git 追蹤；local-only。
- `.vscode/launch.json` - 已掃描並移出 Git 追蹤；local-only。
- `content-update-inventory.local.md` - 已刪除本地過期盤點檔；local-only。
- `schedule.md` - 已掃描並移出 Git 追蹤；local-only。
- `src/curve/morphPathCache.test.ts` - 已刪除並由 `morphFrame` 直接 sample 取代。
- `src/curve/morphPathCache.ts` - 已刪除並由 `morphFrame` 直接 sample 取代。
- `src/content/works/discrete-pmf-expectation.md` - 已保持刪除狀態。
- `src/content/works/variance-spread-visualization.md` - 已保持刪除狀態。

</details>

<details>
<summary>尚未掃描檔案（121）</summary>
- `src/curve/modules/eigenvector-geometry/eigenvector-geometry.test.ts`
- `src/curve/modules/eigenvector-geometry/geometry.ts`
- `src/curve/modules/eigenvector-geometry/index.ts`
- `src/curve/modules/equiangular-spiral/animation.ts`
- `src/curve/modules/equiangular-spiral/camera.ts`
- `src/curve/modules/equiangular-spiral/equiangular-spiral.test.ts`
- `src/curve/modules/equiangular-spiral/geometry.ts`
- `src/curve/modules/equiangular-spiral/index.ts`
- `src/curve/modules/euler-formula-rotation/animation.ts`
- `src/curve/modules/euler-formula-rotation/index.ts`
- `src/curve/modules/exponential-growth-decay/exponential-growth-decay.test.ts`
- `src/curve/modules/exponential-growth-decay/geometry.ts`
- `src/curve/modules/exponential-growth-decay/index.ts`
- `src/curve/modules/fibonacci-spiral/geometry.ts`
- `src/curve/modules/fibonacci-spiral/index.ts`
- `src/curve/modules/function-derivative-graph/function-derivative-graph.test.ts`
- `src/curve/modules/function-derivative-graph/geometry.ts`
- `src/curve/modules/function-derivative-graph/index.ts`
- `src/curve/modules/function-graph-transform/constants.ts`
- `src/curve/modules/function-graph-transform/function-graph-transform.test.ts`
- `src/curve/modules/function-graph-transform/geometry.ts`
- `src/curve/modules/function-graph-transform/index.ts`
- `src/curve/modules/interference-fringes/animation.ts`
- `src/curve/modules/interference-fringes/geometry.ts`
- `src/curve/modules/interference-fringes/index.ts`
- `src/curve/modules/interference-fringes/interference-fringes.test.ts`
- `src/curve/modules/inverse-function-reflection/constants.ts`
- `src/curve/modules/inverse-function-reflection/geometry.ts`
- `src/curve/modules/inverse-function-reflection/index.ts`
- `src/curve/modules/inverse-function-reflection/inverse-function-reflection.test.ts`
- `src/curve/modules/julia-set/config.ts`
- `src/curve/modules/julia-set/engine.ts`
- `src/curve/modules/julia-set/geometry.ts`
- `src/curve/modules/julia-set/index.ts`
- `src/curve/modules/julia-set/math.test.ts`
- `src/curve/modules/julia-set/math.ts`
- `src/curve/modules/julia-set/renderer.ts`
- `src/curve/modules/law-of-sines-cosines/geometry.ts`
- `src/curve/modules/law-of-sines-cosines/index.ts`
- `src/curve/modules/law-of-sines-cosines/law-of-sines-cosines.test.ts`
- `src/curve/modules/limits-riemann-sum/constants.ts`
- `src/curve/modules/limits-riemann-sum/functions.test.ts`
- `src/curve/modules/limits-riemann-sum/functions.ts`
- `src/curve/modules/limits-riemann-sum/layout.ts`
- `src/curve/modules/limits-riemann-sum/types.ts`
- `src/curve/modules/linear-transform-grid/animation.ts`
- `src/curve/modules/linear-transform-grid/geometry.ts`
- `src/curve/modules/linear-transform-grid/index.ts`
- `src/curve/modules/linear-transform-grid/linear-transform-grid.test.ts`
- `src/curve/modules/logarithmic-scale/geometry.ts`
- `src/curve/modules/logarithmic-scale/index.ts`
- `src/curve/modules/logarithmic-scale/logarithmic-scale.test.ts`
- `src/curve/modules/logistic-bifurcation/geometry.ts`
- `src/curve/modules/logistic-bifurcation/index.ts`
- `src/curve/modules/matrix-linear-transform/constants.ts`
- `src/curve/modules/matrix-linear-transform/matrix.ts`
- `src/curve/modules/matrix-linear-transform/types.ts`
- `src/curve/modules/natural-log-e-geometry/geometry.ts`
- `src/curve/modules/natural-log-e-geometry/index.ts`
- `src/curve/modules/natural-log-e-geometry/natural-log-e-geometry.test.ts`
- `src/curve/modules/parabolic-reflection/animation.ts`
- `src/curve/modules/parabolic-reflection/geometry.ts`
- `src/curve/modules/parabolic-reflection/index.ts`
- `src/curve/modules/parabolic-reflection/parabolic-reflection.test.ts`
- `src/curve/modules/pascals-triangle/geometry.ts`
- `src/curve/modules/pascals-triangle/index.ts`
- `src/curve/modules/polynomial-roots-multiplicity/constants.ts`
- `src/curve/modules/polynomial-roots-multiplicity/geometry.ts`
- `src/curve/modules/polynomial-roots-multiplicity/index.ts`
- `src/curve/modules/polynomial-roots-multiplicity/polynomial-roots-multiplicity.test.ts`
- `src/curve/modules/quadratic-completing-square/constants.ts`
- `src/curve/modules/quadratic-completing-square/geometry.ts`
- `src/curve/modules/quadratic-completing-square/index.ts`
- `src/curve/modules/quadratic-completing-square/quadratic-completing-square.test.ts`
- `src/curve/modules/rational-oblique-asymptote/geometry.ts`
- `src/curve/modules/rational-oblique-asymptote/index.ts`
- `src/curve/modules/rational-vertical-horizontal-asymptotes/geometry.ts`
- `src/curve/modules/rational-vertical-horizontal-asymptotes/index.ts`
- `src/curve/modules/regression-outlier-influence/geometry.ts`
- `src/curve/modules/regression-outlier-influence/index.ts`
- `src/curve/modules/regression-outlier-influence/regression-outlier-influence.test.ts`
- `src/curve/modules/riemann-sum/animation.ts`
- `src/curve/modules/riemann-sum/geometry.ts`
- `src/curve/modules/riemann-sum/index.ts`
- `src/curve/modules/riemann-sum/riemann-sum.test.ts`
- `src/curve/modules/rotation-scale-composition/animation.ts`
- `src/curve/modules/rotation-scale-composition/geometry.ts`
- `src/curve/modules/rotation-scale-composition/index.ts`
- `src/curve/modules/rotation-scale-composition/rotation-scale-composition.test.ts`
- `src/curve/modules/sierpinski-triangle/geometry.ts`
- `src/curve/modules/sierpinski-triangle/index.ts`
- `src/curve/modules/sinusoid-amplitude-period-phase/geometry.ts`
- `src/curve/modules/sinusoid-amplitude-period-phase/index.ts`
- `src/curve/modules/sinusoid-amplitude-period-phase/sinusoid-amplitude-period-phase.test.ts`
- `src/curve/modules/spirograph/animation.ts`
- `src/curve/modules/spirograph/index.ts`
- `src/curve/modules/spirograph/spirograph.test.ts`
- `src/curve/modules/standing-wave/animation.ts`
- `src/curve/modules/standing-wave/geometry.ts`
- `src/curve/modules/standing-wave/index.ts`
- `src/curve/modules/standing-wave/standing-wave.test.ts`
- `src/curve/modules/tangent-approximation/animation.ts`
- `src/curve/modules/tangent-approximation/geometry.ts`
- `src/curve/modules/tangent-approximation/index.ts`
- `src/curve/modules/tangent-approximation/tangent-approximation.test.ts`
- `src/curve/modules/taylor-polynomial-approximation/geometry.ts`
- `src/curve/modules/taylor-polynomial-approximation/index.ts`
- `src/curve/modules/taylor-polynomial-approximation/taylor-polynomial-approximation.test.ts`
- `src/curve/modules/vector-addition-scalar/geometry.ts`
- `src/curve/modules/vector-addition-scalar/index.ts`
- `src/curve/modules/vector-addition-scalar/vector-addition-scalar.test.ts`
- `src/curve/modules/vector-field-patterns/geometry.ts`
- `src/curve/modules/vector-field-patterns/index.ts`
- `src/curve/modules/vector-field-patterns/vector-field-patterns.test.ts`
- `src/curve/modules/vector-field-streamlines/animation.ts`
- `src/curve/modules/vector-field-streamlines/geometry.ts`
- `src/curve/modules/vector-field-streamlines/index.ts`
- `src/curve/modules/vector-field-streamlines/vector-field-streamlines.test.ts`
- `src/curve/modules/vector-projection/geometry.ts`
- `src/curve/modules/vector-projection/index.ts`
- `src/curve/modules/vector-projection/vector-projection.test.ts`
</details>

## 已掃描紀錄

| 範圍 | 結論 |
|------|------|
| `src/content/works/discrete-pmf-expectation.md` | 已保持刪除狀態；除本 ledger 記錄外，無殘留 slug、link、docs、script 引用。 |
| `src/content/works/variance-spread-visualization.md` | 已保持刪除狀態；除本 ledger 記錄外，無殘留 slug、link、docs、script 引用。 |
| `schedule.md` | 已移出 Git 追蹤並加入 `.gitignore`；本地檔案保留作個人排程，不再列入 repo 修正面。 |
| `scripts/audit-content.mjs` | 已加入 generic internal draft link audit，涵蓋 `/works/` 與 `/explore/` 雙向。 |
| `scripts/audit-content.mjs` | 已重審：`data-analysis` 已發布，程式內已無三個 Work → `/explore/data-analysis` 精準例外；這些連結改由 generic internal draft link audit 正常驗證。 |
| `src/content/releaseAudit.test.ts` | 已補上 published Explore → draft Work 與 published Work → draft Explore 的測試覆蓋。 |
| `scripts/validate-changed.mjs` | 已重審：content / interactive slug 映射仍會讓 `data-analysis` 觸發 `smoke:explore`；目前 `data-analysis` 是 published Explore，不再依賴舊 draft 前提。 |
| `scripts/validate-changed.mjs` | 已修正 thumbnail / registry 測試覆蓋；curve module 變更會納入 registry / OG 相關測試。 |
| `scripts/validate-changed.mjs` | 已補上 `p5PlotHelpers.ts` 的 consumer smoke 映射；修改 helper 會觸發 `data-analysis` 與三個資料分析 Works smoke。 |
| `scripts/run-smoke.mjs` | 已驗證 `smoke:explore -- data-analysis --list` 可正常列測；目前以 published interactive slug 口徑保留。 |
| `src/curve/modules/scatter-correlation-regression/index.ts` | 已移除未被 runtime 消費的 `showMeanAxes` / `showResiduals` 假參數。 |
| `src/components/curve/useScatterCorrelationRegressionP5.ts` | 已修正刪除點後 `state.params.n` 不同步問題；slider 的 `n` 不再與 `points.length` 分裂。 |
| `src/components/curve/usePercentileBoxPlotP5.ts` | 已移除只寫不讀的 `dragging` state；保留實際有讀寫用途的 `dragIndexRef`。 |
| `src/systems/rendering/regressionOutlierInfluenceRender.ts` | 已移除只包一行 `drawUnitPlotFrame` 的 `drawPlotFrame` wrapper，改為在 `drawPlot` 直接呼叫。 |
| `src/systems/rendering/p5PlotHelpers.ts` | 已抽出小型共用繪圖 helper，集中 frame、label、dash、clip，不擴成大型 drawing framework。 |
| `src/explore/data-analysis/geometry.ts` | 已重用 Work module 的 `boxSummary`、`clamp`、`regression`，不再維持重複統計核心。 |
| `src/explore/data-analysis/geometry.test.ts` | 已對齊 shared regression 與 quartile 規則，不再替 Explore 專屬重複規則背書。 |
| `src/components/explore/DataAnalysisExploreRoot.tsx` | 已修正 `targetN` 與 `points.length` / `values.length` 不同步問題。 |
| `src/components/explore/DataAnalysisExploreRoot.tsx` | 已修正槓桿口徑，改用 `baseFit.xbar`，文案同步為 `x̄₀`。 |
| `src/components/explore/DataAnalysisExploreRoot.tsx` | 已移除 `worldToScreen` / `screenToWorld` 純改名 wrapper，改用既有座標 helper。 |
| `src/components/explore/DataAnalysisExploreRoot.tsx` | 已改用 shared geometry / p5 plot helper，減少重複統計與繪圖邏輯。 |
| `src/content/explore/discrete-random-variables.md` | 已修正「期望值、變異數各有自己的作品」的過時文案，改回目前仍存在的二項／幾何與常態近似脈絡。 |
| `src/content/explore/discrete-random-variables.md` 的相關作品連結段落 | 已確認目前兩個相關作品連結有效：`binomial-geometric-distribution`、`binomial-to-normal`。 |
| `docs/exploreplan.md` | 已修正不存在的 `.explore-topic__stage` / `.explore-topic__visual` / `.explore-topic__sidebar`，改成實際 suffix contract。 |
| `docs/public-pages-audit.md` | 已核對目前正確計數：Works public 61 / draft 8 / total 69；Explore public 17 / draft 3 / total 20；`audit:explore-covers -- --json` 的 `checked: 17` 以 published Explore entries 為基準。 |
| `src/curve/registry.ts`、`src/works/interactiveRegistry.ts`、`src/components/works/WorkInteractiveStage.tsx` | 三個新 published Works 已同步進 module registry、interactive registry、stage root。 |
| `src/content/works/percentile-box-plot.md`、`src/content/works/regression-outlier-influence.md`、`src/content/works/scatter-correlation-regression.md` | 三個 Work → `/explore/data-analysis` 連結已重審保留：`data-analysis` 已發布，無需 audit 例外或 workaround。 |
| `src/content/utils.ts`、`src/pages/works/[slug].astro`、`src/pages/explore/[slug].astro` | 已確認 `includeDraft` 只用於 DEV draft detail preview；production、OG、thumbnail 仍維持 published-only。 |
| `src/styles/components/explore/explore-stage.css` | 已確認 suffix selector 可套用到 `data-analysis-explore__stage` 等 slug-specific class，無需新增 generic wrapper class。 |
| `src/styles/components/explore/data-analysis-explore.css` | 已確認只補 slug-specific layout，基礎 stage / visual / sidebar 樣式由 `explore-stage.css` 提供。 |

## 2026-06-21 根目錄文件與設定補掃

| 範圍 | 結論 |
|------|------|
| `README.md` | 已掃描並修正：移除 `tools/archive/`、Fuse、`getFeaturedOrLatest`、`date` 排序等過時描述；frontmatter 範例補回 `order`。 |
| `schedule.md` | 已確認仍是 local-only；移出 Git 追蹤與 `.gitignore` 記錄以上方主表為準，本節不作第二筆完成項。 |
| `docs/textstyle.md` | 已掃描並修正：`date` 語意為真實發布日、不參與排序；審查摘要更新為目前 89 篇 content（Explore 20 / Works 69），刪除過期逐項計數。 |
| `AGENTS.md`、`docs/AGENTS.md` | 已掃描；確認保留：根目錄檔供 agent convention 使用，docs 版本由 `README.md`、`docs/README.md`、`docs/architecture.md`、`docs/editing-rules.md` 引用。 |
| `.github/workflows/deploy.yml` | 已掃描；確認保留：`main` push 透過 `npm ci`、`npm run build`、Pages artifact deploy。 |
| `astro.config.mjs`、`tsconfig.json`、`vitest.config.ts`、`playwright.config.ts` | 已掃描；確認保留：分別被 Astro、TypeScript、Vitest、Playwright convention 消費。 |
| `.gitignore`、`.vscode/extensions.json`、`.vscode/launch.json` | 已掃描並修正：`.vscode/` 維持 local-only，兩個 `.vscode` 檔已移出 Git 追蹤。 |
| `content-update-inventory.local.md` | 已刪除本地過期盤點檔；`.gitignore` 維持 `*.local` / `content-update-inventory.local.md` 排除。 |
| `package.json` dependencies / devDependencies | 已掃描；確認保留目前核心依賴，`@fontsource`、`satori`、`sharp`、`p5`、React、KaTeX pipeline 均有 current repo 引用。 |
| `scripts/lab.mjs` | 已掃描並修正：刪除 `--no-port-check` / `skipPortCheck`，`runServer` 固定執行 port gate。 |

## 2026-06-21 lib / pages / shell components 補掃

| 範圍 | 結論 |
|------|------|
| `src/layouts/BaseLayout.astro` | 已掃描並修正：刪除無呼叫端的 SEO props 與 scrollbar hover JS；保留現有 canonical / OG fallback 行為。 |
| `src/components/CanvasPlaceholder.astro` | 已掃描並修正：刪除無呼叫端的 `loading` variant；detail loading UI 仍由頁面 fallback markup 提供。 |
| `src/pages/about.astro` | 已掃描並修正：刪除沒有 View Transitions runtime 對應的 `astro:before-swap` cleanup listener。 |
| `src/components/WorkCard.astro`、`src/components/ExploreCard.astro`、`src/styles/components/card.css` | 已掃描並修正：刪除 no-op thumbnail modifier classes；卡片仍保留實際 thumbnail / fallback rendering。 |
| `src/lib/listFilter.ts`、`src/components/ListSearchFilterScript.astro`、`src/pages/works/index.astro`、`src/pages/explore/index.astro` | 已掃描；確認保留：native search、URL sync、filter count、script JSON escaping 有頁面與測試覆蓋。 |
| `src/lib/defaultOg.ts`、`src/lib/workOgImage.ts`、`src/lib/workOgFonts.ts`、`src/lib/workOgSatori.tsx`、`src/pages/og/works/[slug].png.ts`、`src/pages/thumbs/works/[slug].svg.ts` | 已掃描；確認保留：OG / thumbnail build routes、font loading、sharp compatibility 有 current route 與 tests 覆蓋。 |
| `src/lib/seoCopy.ts`、`src/lib/siteLinks.ts`、`src/pages/index.astro`、`src/pages/about.astro`、`src/components/Footer.astro` | 已掃描；確認保留：SEO copy 與個人站連結有多處呼叫端與 `test:seo-ux` 覆蓋。 |
| `src/components/Nav.astro`、`src/components/FilterBar.astro`、`src/components/Breadcrumb.astro`、`src/components/ExploreCard.astro`、`src/components/CardThumbFallback.astro`、`src/components/HeroCanvasShell.astro`、`src/components/HeroCanvas.tsx` | 已掃描；確認保留：目前頁面入口、列表篩選、卡片、Hero 與 nav tests 覆蓋其主要行為。 |

## 2026-06-21 content infrastructure 補掃

| 範圍 | 結論 |
|------|------|
| `src/content.config.ts`、`src/pages/works/[slug].astro` | 已掃描並修正：刪除無 content 使用的 Works `ogImage` frontmatter override；Works OG 固定走 `getWorkOgImagePath(entry.id)`。 |
| `src/content/descriptionMath.ts` | 已掃描並修正：五個 regex 常數取消 export；唯一外部 API 維持 `descriptionHasRawMath`。 |
| `src/content/utils.ts` | 已掃描並修正：`isPublished`、`sortByOrderDesc`、`sortByOrderAsc` 取消 export；`date` 仍只供頁面 structured data 使用，不參與排序。 |
| `src/content/contentAudit.ts` | 已掃描並修正：縮小 `INTERACTION_SIGNAL`，刪除沒有現有互動 bullet 依賴的 `枚舉` / `調小`，以及過寬且現有內容不需依賴的 `沿` / `拖` / `切` / `加` / `減` fallback。 |
| `scripts/new-work.mjs`、`src/content/generatorScripts.test.ts`、`docs/lab-release-system.md` | 已掃描並修正：`new:work` 不再生成未接線 component scaffold；只產生 draft Markdown，互動 component 需要時再手動建立並接 registry。 |
| `src/content/releaseAudit.test.ts`、`scripts/audit-content.mjs` | 已掃描；確認保留：release audit 覆蓋 required fields、order、cover、published-to-draft internal links 與 placeholder text。 |
| `src/content/exploreEntries.ts`、`src/content/explorePager.test.ts`、`src/test/contentSlugs.ts`、`src/test/contentSlugs.test.ts` | 已掃描；確認保留：用於 current content order / published slug 測試；目前有 `seo-ux` 與 registry/OG 測試呼叫端。 |
| `src/content/descriptionMath.ts`、`src/content/descriptionMath.test.ts` | 已掃描；確認保留 `descriptionHasRawMath` 行為：frontmatter description 禁止 LaTeX delimiters / commands，允許純文字數學。 |

## 2026-06-21 curve core / registry-stage 補掃

| 範圍 | 結論 |
|------|------|
| `src/curve/types.ts`、`src/curve/cache.ts`、`src/curve/morphFrame.ts` | 已掃描並修正：刪除 `{ kind: 'none' }` 假策略，未設定 `cacheStrategy` 直接走 `module.sample`。 |
| `src/curve/morphPathCache.ts`、`src/curve/morphFrame.ts`、`src/components/curve/useMorphCurveP5.ts` | 已掃描並修正：刪除 morph path cache 檔案、測試與 hook/ref 接線；morph frame 直接 sample。 |
| `src/components/curve/CurveWorkRoot.tsx`、`src/components/works/RoseCurveRoot.tsx` | 已做最小處理：移除 `0.006` 重複常數與 `['k']` 硬編碼，reveal reset key 改吃既有 `cacheStrategy.paramKey`；`CurveWorkRoot` 保留，因 integration audit 與 docs 目前明確把它作為 Rose 標準 root path。 |
| `src/components/curve/useMorphCurveP5.ts` | 已掃描並修正：刪除 `mergeSmoothParams`，呼叫端改用 native object spread。 |
| `src/lib/curveThumbnail.ts`、`src/curve/constants.ts`、`src/components/curve/CurveWorkRoot.tsx` | 已掃描並修正：thumbnail 與 CurveWorkRoot fallback 共用 `BASE_POINT_STEP`。 |
| `src/curve/prng.ts`、`src/curve/modules/catalan-numbers/geometry.ts`、`src/curve/modules/combinatorial-path-counting/geometry.ts` | 已掃描並修正：兩個 geometry 檔改 import shared `mulberry32`。 |
| `src/curve/modules/animationTiming.ts`、`src/curve/modules/matrix-linear-transform/animation.ts`、`src/components/curve/useLogarithmicScaleP5.ts`、`src/components/curve/useNaturalLogEGeometryP5.ts`、`src/components/curve/useExponentialGrowthDecayP5.ts` | 已掃描並修正：matrix smoothing 與三個 p5 reveal hook 改用 shared `frameScale(deltaMs)`；補 `matrix-linear-transform/animation.test.ts` 覆蓋 60fps fallback / clamp。 |
| `src/curve/modules/animationTiming.ts`、`src/curve/modules/unit-circle-trig-definition/geometry.ts`、`src/curve/modules/trig-angle-identities/geometry.ts` | 已掃描並修正：抽出秒制 exponential smoothing factor，兩個三角互動共用同一個 `dt` clamp 公式；未改成 per-frame `frameScale`。 |
| `src/curve/modules/logistic-curve/*` | 已掃描並修正：刪除重複的 `REVEAL_RESET_TIMEOUT_MS` 常數，改用 `animationTiming` 既有 timeout；保留 logistic 專用秒制 reveal 進度。 |
| `src/curve/modules/radian-arc-length/geometry.ts` | 已掃描並修正：刪除未被任何 renderer、hook、module、test 引用的 `SMOOTH_RATE_PER_SEC` 常數；後續 `useRadianArcLengthP5.ts` static lifecycle 也未新增 smoothing 引用。 |
| `src/curve/registry.ts`、`src/works/interactiveRegistry.ts`、`src/components/works/WorkInteractiveStage.tsx`、`src/explore/interactiveRegistry.ts`、`src/components/explore/ExploreInteractiveStage.tsx`、`src/registry.sync.test.ts` | 已掃描；確認保留：頁面、smoke script、integration audit、thumbnail / OG tests、registry sync test 都有 current 引用；stage root keys 由測試保護同步。 |
| `src/curve/animation.ts`、`src/curve/canvasSize.ts`、`src/curve/cartesianPlot.ts`、`src/curve/defaults.ts`、`src/curve/resolveSmoothParams.ts`、`src/curve/thumbnailPointCloud.ts`、`src/curve/modules/animationTiming.ts` | 已掃描；確認保留主要 API：目前有多個 Work hook、renderer、module index、metadata 防呆或 thumbnail 呼叫端。 |
| 驗證 | 已執行並通過：`npm test -- src/registry.sync.test.ts src/curve/morphFrame.test.ts src/components/curve/useMorphCurveP5.draw.test.ts src/curve/resolveSmoothParams.test.ts src/lib/curveThumbnail.test.ts src/lib/curveThumbnail.registry.test.ts`；`npm test -- scatter-correlation-regression`；`npm test -- percentile-box-plot`；`npm test -- data-analysis`；`npm test -- src/content/descriptionMath.test.ts src/content/utils.test.ts src/content/generatorScripts.test.ts src/content/contentAudit.test.ts src/content/releaseAudit.test.ts`；`npm test -- src/curve/modules/matrix-linear-transform/animation.test.ts src/registry.sync.test.ts`；`npm run audit:content`；`npm run audit:integration`；`npm run validate:frontend`；`npm run validate:changed -- --dry-run`；`npm run smoke:explore -- data-analysis --list`；`npm run smoke:work -- exponential-growth-decay --list`；`npm run smoke:work -- logarithmic-scale --list`；`npm run smoke:work -- natural-log-e-geometry --list`；`git diff --check`。 |

## 2026-06-21 docs 規格補掃

| 範圍 | 結論 |
|------|------|
| `.cursor/rules/code-review.mdc` | 已掃描；確認保留：`README.md` 明確標示為 local AI review workflow，且本檔自身聲明非 canonical runtime spec。 |
| `docs/architecture.md` | 已掃描；確認保留：`AGENTS.md`、`docs/README.md` 皆將其列為 system map；內容與目前 Works / Explore 分層一致。 |
| `docs/archive/visual_math_geometry_review.md` | 已掃描；確認保留：由 `docs/README.md` archive 表引用，作為歷史幾何審查筆記；不列入 runtime spec。 |
| `docs/art.md` | 已掃描；確認保留：`AGENTS.md` 將其列為 visual language entrypoint，且只路由到 `workart.md` / `exploreart.md` / `site-ux.md`，沒有重複大型規格。 |
| `docs/editing-rules.md` | 已掃描；確認保留：`AGENTS.md` 與 `docs/README.md` 引用；內容維持最小編輯、registry sync、validation strategy 的短規則。 |
| `docs/frontend-validation.md` | 已掃描並修正：驗證順序改回 script 實際行為：content audit → test → build → DOM；報告範例同步補 `content audit`。 |
| `docs/exploreart.md` | 已掃描並修正：移除一次性「本輪封面補齊」與過期 implementation order，保留長期 cover pipeline / acceptance 規則；`audit:explore-covers -- --json` 已驗證 17 個 published cover 無 issue。 |
| `docs/math-content-review-checklist.md` | 已掃描；確認保留：`docs/lab-release-system.md` 明確引用它作為 `audit:content` 無法涵蓋的人工數學語義審查，不新增 tooling。 |
| `docs/site-ux.md` | 已掃描；確認保留：與目前 `Breadcrumb.astro`、detail top nav、Works stage、Explore toolbar/touch CSS、list filter、footer tests 有 current selector 對應。 |
| `docs/workart.md` | 已掃描；確認保留：與目前 Works runtime、`curveThumbnail.ts`、`work-detail__stage`、portal、thumbnail contract 對應；未重複替代 `p5toreact.md`。 |

## 2026-06-21 public assets / cover scripts 補掃

| 範圍 | 結論 |
|------|------|
| `package-lock.json` | 已掃描；確認保留：GitHub Actions deploy 使用 `npm ci`，lockfile root dependencies / devDependencies 與 `package.json` 一致。 |
| `public/.nojekyll` | 已掃描；確認保留：Astro build 會輸出 `_astro/` assets，GitHub Pages 部署保留 `.nojekyll` 是必要平台護欄，未刪。 |
| `public/CNAME` | 已掃描；確認保留：README 指定 custom domain `lab.lambliver.dev` 與此檔一致。 |
| `public/robots.txt` | 已掃描；確認保留：公開 sitemap 指向 `https://lab.lambliver.dev/sitemap-index.xml`。 |
| `public/lab-favicon-eb-garamond.svg` | 已掃描；確認保留：`BaseLayout.astro` 直接引用 `/lab-favicon-eb-garamond.svg`。 |
| `public/explore/fourier-series-epicycles-cover.png` | 已掃描；確認保留：`fourier-series` frontmatter 與 `audit-explore-covers` legacy exception 均指向此路徑。 |
| `public/images/explore-covers/*.png`、`scripts/explore-covers/*.svg` | 已掃描；確認保留：published Explore cover frontmatter、PNG、SVG source 已由 `audit:explore-covers` 驗證；缺失的 draft coverImage 已移除。 |
| `scripts/explore-covers/generate.mjs` | 已掃描並修正：刪除硬編碼 SVG 生成器，改為只將既有 SVG source rasterize 成 PNG，避免 JS 與 SVG 雙重 source-of-truth，並自然涵蓋 `rational-functions-asymptotes`。 |
| `scripts/audit-explore-covers.mjs` | 已掃描；確認保留：`lab.mjs`、`validate:changed`、`audit:integration` 均呼叫它；本輪 `audit:explore-covers -- --json` 通過。 |
| `scripts/audit-integration.mjs` | 已掃描；確認保留：整合 Works / Explore / cover surface；本輪 `audit:integration -- --json` 回傳 `issues: []`。 |
| `scripts/new-explore.mjs` | 已掃描並修正：發布提示補上真實發布日、positive order、`audit:integration`，避免 draft 建立日被誤當發布日。 |
| `scripts/audit-content.mjs`、`src/content/releaseAudit.test.ts` | 已掃描並修正：Explore draft 可沒有 coverImage；但只要設定 coverImage，就必須是存在的 public asset。 |
| `src/content/explore/discrete-random-variables.md`、`src/content/explore/linear-programming.md`、`src/content/explore/space-vectors-planes-lines.md` | 已掃描並修正：移除 draft frontmatter 中指向不存在 PNG 的 `coverImage`。 |

## 2026-06-21 curve component / hook 補掃

| 範圍 | 結論 |
|------|------|
| `src/components/curve/CurveHookWorkRoot.tsx` | 已掃描並修正：`CommonHookOptions` 只被 `CommonHook` 消費，已 inline；`controlsMountId` 改為必要 prop，避免未使用 fallback。 |
| `src/components/curve/DeltaPhaseControl.tsx` | 已掃描並修正：`DELTA_TICKS` / `snapDelta` 取消 export；移除 `useMemo` 與 range `onChange` 重複事件路徑。 |
| `src/components/curve/StatsPanel.tsx`、`src/curve/modules/percentile-box-plot/index.ts` | 已掃描並修正：StatsPanel 不再靜默 `slice(0, 4)`；percentile metadata 收斂為 4 個核心 stats。 |
| `src/curve/modules/arithmetic-geometric-sequences/index.ts` | 支援性修正：`sample` 的 thumbnail/default 分支完全相同，已收斂成單一呼叫；module 檔未因此標記為完整掃描。 |
| `src/components/curve/useBaselProblemP5.ts` | 已掃描並修正：移除只寫不讀的 `replayNonceRef`；保留 `replayNonce` 觸發 reveal reset。 |
| `src/components/curve/useBinomialExpansionGeometryP5.ts`、`src/components/curve/useBinomialToNormalP5.ts`、`src/components/curve/useBuffonNeedleP5.ts`、`src/components/curve/useCatalanNumbersP5.ts`、`src/components/curve/useConditionalProbabilityBayesP5.ts` | 已掃描並修正：刪除 root 不消費的 reveal callback / pct ref；需要 renderer 的內部 reveal state 保留在 hook 內。 |
| `src/components/curve/useCombinatorialPathCountingP5.ts` | 已掃描並修正：刪除 root 不消費的 reveal callback、只寫不讀的 `rerollNonceRef`，並同幀重用 `getGridLayout` 結果。 |
| `src/components/curve/useCatenaryP5.ts`、`src/components/curve/useEquiangularSpiralP5.ts` | 已掃描並修正：hook 初始化改吃 `targetParams`，移除 `defaultParams` option；smooth notifier 不再上報 metadata 未讀的 `timeSpeed` / `rotationSpeed`。 |
| `src/components/curve/useChladniP5.ts`、`src/components/curve/useConicEnvelopeP5.ts`、`src/components/curve/useConicFocusLocusP5.ts` | 已掃描並修正：hook 初始化改吃 `targetParams`，移除呼叫端無需傳入的 `defaultParams` option。 |
| `src/curve/modules/catalan-numbers/index.ts`、`src/components/curve/useCatalanNumbersP5.ts` | 支援性修正：Catalan lookup 上限與 paramSchema `max: 9` 對齊；module 檔未因此標記為完整掃描。 |
| `src/curve/modules/complex-arithmetic-geometry/index.ts`、`src/curve/modules/complex-phase-portrait/index.ts`、`src/curve/modules/complex-polar-form/index.ts` | 支援性修正：移除 index 對未使用 `TIME_SPEED` 的 re-export；module 檔未因此標記為完整掃描。 |
| `src/components/curve/ParamControls.tsx`、`src/components/curve/p5RendererReady.ts`、`src/components/curve/useAffineIfsFractalP5.ts`、`src/components/curve/useAffineTransformPatternP5.ts`、`src/components/curve/useArithmeticGeometricSequencesP5.ts`、`src/components/curve/useComplexArithmeticGeometryP5.ts`、`src/components/curve/useComplexPhasePortraitP5.ts`、`src/components/curve/useComplexPolarFormP5.ts`、`src/components/curve/useDotProductGeometryP5.ts`、`src/components/curve/useEigenvectorGeometryP5.ts` | 已掃描；本輪未找到可立即刪除或縮小且不改行為的項目。 |
| `src/components/works/*Binomial*CurveRoot.tsx`、`src/components/works/BuffonNeedleCurveRoot.tsx`、`src/components/works/CatalanNumbersCurveRoot.tsx`、`src/components/works/CombinatorialPathCountingCurveRoot.tsx`、`src/components/works/ConditionalProbabilityBayesCurveRoot.tsx`、`src/components/works/CatenaryCurveRoot.tsx`、`src/components/works/ChladniFiguresCurveRoot.tsx`、`src/components/works/ConicEnvelopeCurveRoot.tsx`、`src/components/works/ConicFocusLocusCurveRoot.tsx`、`src/components/works/EquiangularSpiralCurveRoot.tsx` | 支援性修正：配合 hook 刪除無用途 props / reveal state / `defaultParams` 傳遞；未把整批 root 檔案標記為本輪完整掃描。 |

## 2026-06-21 curve hook 接續補掃

| 範圍 | 結論 |
|------|------|
| `src/components/curve/useP5CanvasHost.ts` | 已掃描並修正：`rg "demand|redrawOn"` 確認全專案無 source 呼叫端後刪除兩個分支；後續薄 wrapper 保留的是既有 `(draw, deps, measureSize, options)` 呼叫形狀與 `mode: 'reveal'` / `restartOn`，不是恢復已刪分支。 |
| `src/components/curve/useLogisticBifurcationP5.ts`、`src/components/works/LogisticBifurcationCurveRoot.tsx` | 已掃描並修正：module metadata 不讀 runtime，刪除 root/hook 的 reveal pct callback/state；hook 初始化直接吃 `targetParams`，不再傳入只供初始化的 `defaultParams`。 |
| `src/components/curve/useLinearTransformGridP5.ts` | 已掃描並修正：`getMetadata` 只讀 smooth `shearX` / `scaleY`，刪除未被 metadata 消費的 `transformSpeed` smooth notification。 |
| `src/components/curve/usePascalsTriangleP5.ts`、`src/components/works/PascalsTriangleCurveRoot.tsx` | 已掃描並修正：module metadata 不讀 runtime，刪除 root/hook 的 reveal pct callback/state；hook 初始化直接吃 `targetParams`。 |
| `src/components/curve/useSierpinskiTriangleP5.ts`、`src/components/works/SierpinskiTriangleCurveRoot.tsx` | 已掃描並修正：module metadata 不讀 runtime，刪除 root/hook 的 reveal pct callback/state；保留 hook 內部 reveal loop，因 renderer 仍消費 `revealProgress`。 |
| `src/components/curve/useRiemannSumP5.ts` | 已掃描並修正：metadata 只讀 smooth `partitionCount`，刪除未被 metadata 消費的 `waveFrequency` / `timeSpeed` smooth notification。 |
| `src/components/curve/useRotationScaleCompositionP5.ts` | 已掃描並修正：metadata 只讀 smooth `rotationStepDeg` / `scaleFactor`，刪除未被 metadata 消費的 `evolutionSpeed` smooth notification。 |
| `src/components/curve/useSinusoidAmplitudePeriodPhaseP5.ts` | 已掃描並修正：刪除重複 p5 boot / ResizeObserver / noLoop lifecycle，改用既有 `useRectP5CanvasHost` 的 `loop: false` + `redrawKey`。 |
| `src/components/curve/useSmoothParamNotifier.ts`、`src/components/curve/useSmoothParamNotifier.test.ts` | 已掃描並修正：全專案只使用物件 options，刪除函式 shorthand normalization；options type 不再 export。量化測試保留。 |
| `src/components/curve/useRectP5CanvasHost.ts` | 已掃描並修正：`CanvasSize` / `ExtendSketch`、`loop: false`、`redrawKey` 目前被多個 Explore / Work canvas 使用；補上 `restartOn` 與 `{ keepLooping }` 支援，讓自停 canvas 與舊 reveal wrapper 也能共用同一個 p5 lifecycle。 |
| `src/curve/modules/euler-formula-rotation/index.ts` | 支援性修正：移除 index 對未使用 `TIME_SPEED` 的 re-export；module 檔未因此標記為完整掃描。 |
| `src/components/curve/useEulerFormulaRotationP5.ts`、`src/components/curve/useFibonacciSpiralP5.ts`、`src/components/curve/useFunctionDerivativeGraphP5.ts`、`src/components/curve/useFunctionGraphTransformP5.ts`、`src/components/curve/useInterferenceFringesP5.ts`、`src/components/curve/useInverseFunctionReflectionP5.ts`、`src/components/curve/useJuliaP5.ts`、`src/components/curve/useLawOfSinesCosinesP5.ts`、`src/components/curve/useLogisticCurveP5.ts`、`src/components/curve/useParabolicReflectionP5.ts`、`src/components/curve/usePolynomialRootsMultiplicityP5.ts`、`src/components/curve/useQuadraticCompletingSquareP5.ts`、`src/components/curve/useRadianArcLengthP5.ts`、`src/components/curve/useRationalObliqueAsymptoteP5.ts`、`src/components/curve/useRationalVerticalHorizontalAsymptotesP5.ts`、`src/components/curve/useRegressionOutlierInfluenceP5.ts`、`src/components/curve/useStandingWaveP5.ts` | 已掃描；本輪未找到可立即刪除或縮小且不改變行為的項目。 |

## 2026-06-22 curve/explore 接續修正

| 範圍 | 結論 |
|------|------|
| `src/components/curve/useTangentApproximationP5.ts` | 已掃描並修正：`notifySmoothParams` 只上報 metadata 消費的 `dx`，移除未讀的 `waveFrequency` / `timeSpeed`。`defaultParams` 已於 2026-06-23 重審降級為保留：仍由 `CurveHookWorkRoot` common hook contract 傳入。 |
| `src/components/curve/useTaylorPolynomialApproximationP5.ts`、`src/components/curve/useTrigAngleIdentitiesP5.ts`、`src/components/curve/useUnitCircleTrigDefinitionP5.ts`、`src/components/curve/useVectorAdditionScalarP5.ts`、`src/components/curve/useVectorFieldPatternsP5.ts` | 已掃描並修正：刪除重複 p5 boot / ResizeObserver / noLoop lifecycle；Taylor / Vector 類 static hook 使用 `loop: false` + `redrawKey`；兩個三角 hook 因仍有秒制 smoothing，已改用 `restartOn` + `{ keepLooping }` 跑到收斂後自停。 |
| `src/components/curve/useVectorProjectionP5.ts` | 已掃描並修正：刪除重複 p5 boot / ResizeObserver lifecycle，改用 `useRectP5CanvasHost`；保留連續 draw，因 renderer 仍消費 `timeMs: p.millis()`。 |
| `src/components/curve/useVectorFieldStreamlinesP5.ts` | 已掃描；`defaultParams` 已於 2026-06-23 重審降級為保留：仍由 `CurveHookWorkRoot` common hook contract 傳入，不是可局部刪除的孤立 option。 |
| `src/components/works/TaylorPolynomialApproximationCurveRoot.tsx`、`src/components/works/TrigAngleIdentitiesCurveRoot.tsx`、`src/components/works/UnitCircleTrigDefinitionCurveRoot.tsx`、`src/components/works/VectorAdditionScalarCurveRoot.tsx`、`src/components/works/VectorFieldPatternsCurveRoot.tsx`、`src/components/works/VectorProjectionCurveRoot.tsx` | 支援性修正：對應 module `getMetadata` 不消費 runtime object，已刪除 root 端多餘 `revealPct` / `smoothParams` 傳遞；root 檔仍保留在未掃描清單，尚未標記完整掃描。 |
| `src/components/explore/ComplexEulerFormulaExploreRoot.tsx`、`src/components/explore/ConicDynamicGeometryExploreRoot.tsx`、`src/components/explore/MatrixLinearTransformExploreRoot.tsx` | 已掃描並修正：刪除重複 p5 boot / ResizeObserver lifecycle，改用既有 `useRectP5CanvasHost`；保留各 root 的狀態、sidebar、renderer 架構。 |
| `src/components/explore/ExponentialLogarithmExploreRoot.tsx` | 已掃描並修正：刪除 `CurveStyle.guide` 與三個未讀 call-site 欄位；手寫 p5 lifecycle 已改用 `useRectP5CanvasHost`，mode-dependent canvas height 保留在 draw 內同步；本地 `withClip` 改用 `p5PlotHelpers.clipRect`。 |
| `src/components/explore/DifferentialEquationsGeometryExploreRoot.tsx`、`src/components/explore/FourierSeriesExploreRoot.tsx`、`src/components/explore/FunctionEquationsExploreRoot.tsx`、`src/components/explore/LimitsRiemannSumExploreRoot.tsx` | 已掃描；未找到可立即刪除或縮小且不改變行為的項目，本輪未改碼。 |
| `src/components/explore/PermutationsCombinationsExploreRoot.tsx` | 已掃描並修正：手寫 `import('p5')` / `ResizeObserver` / `noLoop` / redraw lifecycle 已改用 `useRectP5CanvasHost({ loop: false, redrawKey })`；`catalanContrast(4)` 的空依賴 `useMemo` 已改成 module-level 常數。 |
| `src/components/explore/ProbabilityStatisticsExploreRoot.tsx` | 已掃描並修正：手寫 p5 boot / resize lifecycle 已用 `useRectP5CanvasHost` 承接；CLT 仍保留連續 draw，沒有錯改成 `loop: false`。 |
| `src/components/explore/RationalFunctionsAsymptotesExploreRoot.tsx` | 已掃描並修正：手寫 static p5 lifecycle 已改用 `useRectP5CanvasHost({ loop: false })`；renderer font 仍在 draw 前設定。 |
| `src/components/explore/SequencesAndSeriesExploreRoot.tsx` | 已掃描並修正：手寫 static p5 lifecycle 已改用 `useRectP5CanvasHost({ loop: false })`；logistic 拖曳移到 `extendSketch`。 |
| `src/components/explore/VectorsExploreRoot.tsx` | 已掃描並修正：手寫 static p5 lifecycle 已改用 `useRectP5CanvasHost({ loop: false })`；本地 `withClip` / `drawDashedLine` 已收斂到 `p5PlotHelpers.clipRect` / `withDash`。 |
| `src/components/explore/TrigFunctionGraphsExploreRoot.tsx` | 已掃描；確認保留：已使用 `useRectP5CanvasHost` 的 `loop: false` + `redrawKey`，拖曳行為在 `extendSketch`，未發現可立即刪除且不改行為的項目。 |
| `src/components/explore/TrigonometryFundamentalsExploreRoot.tsx` | 已掃描；確認保留：已使用 `useRectP5CanvasHost`；連續 draw 是 smoothing 依賴 `p.deltaTime` 的必要行為，不能改成 static redraw。 |
| `src/components/explore/WaveSuperpositionExploreRoot.tsx` | 已掃描；確認保留：已使用 `useRectP5CanvasHost`；draw 內 mode-dependent canvas resize 與 `time` 累積是現有 helper 未覆蓋的必要行為。 |

## 2026-06-22 Explore content markdown 接續掃描

| 範圍 | 結論 |
|------|------|
| `src/content/explore/complex-euler-formula.md`、`src/content/explore/conic-dynamic-geometry.md`、`src/content/explore/data-analysis.md`、`src/content/explore/differential-equations-geometry.md`、`src/content/explore/exponential-logarithm.md`、`src/content/explore/fourier-series.md`、`src/content/explore/function-equations.md`、`src/content/explore/limits-riemann-sum.md`、`src/content/explore/matrix-linear-transform.md`、`src/content/explore/permutations-combinations.md`、`src/content/explore/probability-statistics.md`、`src/content/explore/rational-functions-asymptotes.md`、`src/content/explore/sequences-and-series.md`、`src/content/explore/trig-function-graphs.md`、`src/content/explore/trig-wave-interference.md`、`src/content/explore/trigonometry-fundamentals.md`、`src/content/explore/vectors.md` | 已掃描；確認保留：17 個 published Explore content 皆被 `src/content.config.ts` 的 `explore` collection loader、`src/pages/explore/index.astro` 列表、`src/pages/explore/[slug].astro` detail route 消費；內部 `/works/`、`/explore/` 連結已核對 0 個 missing/draft；五段 heading 結構完整，未命中 placeholder/TODO。 |
| 驗證 | 已執行並通過：`npm run audit:content`；`npm test -- src/content/contentAudit.test.ts src/content/releaseAudit.test.ts`。 |

## 2026-06-22 Work content markdown 接續掃描

| 範圍 | 結論 |
|------|------|
| `src/content/works/*.md` 本輪 58 個 published Work content | 已掃描；確認保留：本輪數字不含前批已個別掃描的 `percentile-box-plot`、`regression-outlier-influence`、`scatter-correlation-regression`，合計仍對齊 Works public 61 / draft 8 / total 69。58 檔皆由 `src/content.config.ts` 的 `works` collection loader、`src/pages/works/index.astro` 列表、`src/pages/works/[slug].astro` detail route、OG/thumb routes 與 content audits 消費；內部 `/works/`、`/explore/` 連結已核對 0 個 missing/draft；未命中 placeholder/TODO。 |
| `src/content/works/binomial-geometric-distribution.md`、`src/content/works/cross-product-geometry.md`、`src/content/works/line-plane-intersection.md`、`src/content/works/lp-feasible-half-planes.md`、`src/content/works/lp-objective-level-curves.md`、`src/content/works/lp-vertex-optimum.md`、`src/content/works/plane-normal-distance.md`、`src/content/works/space-vector-three-plane-projection.md` | 已重審改為保留：8 檔 `draft: true` / `order: 0` 是預先建立、等待填充的 backlog placeholder；不得因未發布或未進 registry 判定刪除。後續只在內容填充、發布排程或 backlog 決策時重審。 |
| 驗證 | 已執行並通過：`npm run audit:content`；`npm run audit:integration -- --json`；`npm test -- src/content/contentAudit.test.ts src/content/releaseAudit.test.ts src/registry.sync.test.ts`。 |

## 2026-06-22 p5 lifecycle 收斂

| 範圍 | 結論 |
|------|------|
| `src/components/curve/useP5CanvasHost.ts` | 已掃描並修正：刪除自身手寫 p5 boot / ResizeObserver，改成 `useRectP5CanvasHost` 的 square-canvas wrapper；保留舊 API 以避免一次性改動 30 多個呼叫端。 |
| `src/components/curve/useRadianArcLengthP5.ts`、`src/components/curve/useFunctionDerivativeGraphP5.ts`、`src/components/curve/useDotProductGeometryP5.ts`、`src/components/curve/useLawOfSinesCosinesP5.ts`、`src/components/curve/useRationalObliqueAsymptoteP5.ts`、`src/components/curve/useRationalVerticalHorizontalAsymptotesP5.ts` | 已掃描並修正：手寫 static p5 lifecycle 已改用 `useRectP5CanvasHost({ loop: false })`，拖曳與 wheel handler 留在各 hook 的 `extendSketch`。 |
| `src/components/curve/useQuadraticCompletingSquareP5.ts`、`src/components/curve/useFunctionGraphTransformP5.ts`、`src/components/curve/useInverseFunctionReflectionP5.ts`、`src/components/curve/usePolynomialRootsMultiplicityP5.ts`、`src/components/curve/useEigenvectorGeometryP5.ts` | 已掃描並修正：手寫 p5 boot / ResizeObserver 已改用 `useRectP5CanvasHost`；保留連續 draw，因 smoothing 或既有互動狀態仍依賴 frame loop。 |
| `src/components/curve/useJuliaP5.ts` | 已掃描並修正：手寫 p5 lifecycle 已改用 `useRectP5CanvasHost`；Julia engine 改為 draw 內 lazy init，保留 `pixelDensity(1)`、自停 `noLoop`、參數變更/resize 後重啟 loop 與 unmount dispose。 |

## 2026-06-22 Work root 接續掃描

| 範圍 | 結論 |
|------|------|
| `src/components/works/AffineIfsFractalCurveRoot.tsx`、`src/components/works/AffineTransformPatternCurveRoot.tsx` | 已掃描並修正：兩檔是 `CurveHookWorkRoot` glue，分別被 `WorkInteractiveStage.rootBySlug` 的 `affine-ifs-fractal` / `affine-transform-pattern` 消費；`controlsMountId` 改為 stage 必填 prop，刪除 optional/default fallback。 |
| `src/components/works/ArithmeticGeometricSequencesCurveRoot.tsx`、`src/components/works/BaselProblemCurveRoot.tsx`、`src/components/works/CatenaryCurveRoot.tsx` | 已掃描並修正：root 端 state 供 hook runtime callback 與 module `getMetadata` 消費，`revealPct` / `pullPct` / `smoothParams` 不是只寫不讀；`controlsMountId` 改為必填；Arithmetic / Basel hook 的 `defaultParams` option 改吃 `targetParams` 初始化；Arithmetic 自製 `RangeField` 收斂成單一 `onInput`。 |
| `src/components/works/BinomialExpansionGeometryCurveRoot.tsx`、`src/components/works/BinomialToNormalCurveRoot.tsx`、`src/components/works/BuffonNeedleCurveRoot.tsx`、`src/components/works/CatalanNumbersCurveRoot.tsx`、`src/components/works/CombinatorialPathCountingCurveRoot.tsx` | 已掃描並修正：root 被 `WorkInteractiveStage` 消費，mode / nonce state 分別被 hook 或 metadata 讀取，沒有可直接刪除的 root 檔案；`controlsMountId` optional/default fallback 已移除。 |
| `src/components/works/ComplexArithmeticGeometryCurveRoot.tsx`、`src/components/works/ComplexPhasePortraitCurveRoot.tsx`、`src/components/works/ComplexPolarFormCurveRoot.tsx`、`src/components/works/EulerFormulaRotationCurveRoot.tsx` | 已掃描並修正：四檔是 `CurveHookWorkRoot` glue，分別被 `WorkInteractiveStage.rootBySlug` 消費；`controlsMountId` optional/default fallback 已移除；不被 metadata 消費的 `initialRevealPct={100}` 已刪除。 |
| `src/components/works/ConditionalProbabilityBayesCurveRoot.tsx` | 已掃描並修正：mode / scenario state 被 metadata、hook、renderer 鏈路消費；scenario click handler 改用 `conditional-probability-bayes/geometry.ts` exported `scenarios`，移除 root 內重複 preset。 |
| `src/components/works/DotProductGeometryCurveRoot.tsx`、`src/components/works/EigenvectorGeometryCurveRoot.tsx` | 已掃描並修正：root state 供拖曳 hook、metadata 與 controls 消費，沒有只寫不讀 state；`controlsMountId` optional/default fallback 已移除；DotProduct metadata params 改成單一 local const；Eigenvector 小型 `useMemo` 已改為直接 lookup。 |
| `src/components/works/EquiangularSpiralCurveRoot.tsx`、`src/components/works/ExponentialGrowthDecayCurveRoot.tsx`、`src/components/works/FibonacciSpiralCurveRoot.tsx` | 已掃描並修正：reveal / smooth state 有 module metadata 或 `CurveHookWorkRoot` 讀端；`controlsMountId` optional/default fallback 已移除；Exponential / Fibonacci hook 的 `defaultParams` option 改吃 `targetParams` 初始化；Exponential `visibleSchema` 小型 `useMemo` 已改為直接計算。 |

## 2026-06-22 Work root 第二批接續掃描

| 範圍 | 結論 |
|------|------|
| `src/components/works/FunctionDerivativeGraphCurveRoot.tsx`、`src/components/works/LinearTransformGridCurveRoot.tsx`、`src/components/works/LogisticBifurcationCurveRoot.tsx`、`src/components/works/PascalsTriangleCurveRoot.tsx` | 已掃描並修正：四檔都由 `WorkInteractiveStage.rootBySlug` 與 `interactiveRegistry` slug 消費，對應 module / hook / content 連結均有 current 引用；`controlsMountId` optional/default fallback 已移除。 |
| `src/components/works/FunctionGraphTransformCurveRoot.tsx`、`src/components/works/InverseFunctionReflectionCurveRoot.tsx`、`src/components/works/LawOfSinesCosinesCurveRoot.tsx` | 已掃描並修正：拖曳 state / params 由各自 p5 hook 與 module metadata 消費，continuous draw 或 `redrawKey` 由對應 hook 管理；`controlsMountId` fallback 已移除；重複 `paramsForMetadata(params)` 已收斂成單一 local const；`LawOfSinesCosinesCurveRoot` 的無效 `useMemo` 已移除。 |
| `src/components/works/JuliaSetCurveRoot.tsx`、`src/components/works/LogarithmicScaleCurveRoot.tsx`、`src/components/works/NaturalLogEGeometryCurveRoot.tsx`、`src/components/works/LogisticCurveCurveRoot.tsx` | 已掃描並修正：Julia 的 `renderPct` / smooth c、Logarithmic / Natural Log 的 `revealPct`、Logistic Curve 的 reveal / smooth state 均被 module metadata 或 renderer 鏈路讀取；`controlsMountId` fallback 已移除；四個 direct hook 的 `defaultParams` option 已改吃 `targetParams` 初始化；Logarithmic / Natural Log 的 `visibleSchema` 小型 `useMemo` 已改為直接計算。 |
| `src/components/works/PercentileBoxPlotCurveRoot.tsx` | 已掃描並修正：`stateRef` 是拖曳期間避免 React state churn 的 shared work state，`redrawKey` 被 `usePercentileBoxPlotP5` 的 static redraw 消費；metadata 讀 `state.params` 與 `state.values`；`controlsMountId` optional/default fallback 已移除。 |
| `src/components/works/*CurveRoot.tsx` | 支援性修正：同型 `controlsMountId` optional/default fallback 已在所有剩餘 Work root 移除；`WorkInteractiveStage` 已要求必填並固定傳入 `workControlsMountId(slug)`。尚未掃描清單中的 root 檔案仍需後續逐檔審查其他問題，不因本支援性修正標記為完整掃描。 |
| `src/components/curve/useInterferenceFringesP5.ts`、`src/components/curve/useParabolicReflectionP5.ts`、`src/components/curve/useStandingWaveP5.ts` | 支援性修正：三個 direct hook 的 `defaultParams` option 只作初始化，已改吃 `targetParams`；對應 root 不再傳入 `module.defaultParams`。Morph hook 呼叫端仍保留 `defaultParams`，因屬不同契約，未混入本次修正。 |

## 2026-06-22 Work root 第三批接續掃描

| 範圍 | 結論 |
|------|------|
| `src/components/works/PolynomialRootsMultiplicityCurveRoot.tsx`、`src/components/works/QuadraticCompletingSquareCurveRoot.tsx`、`src/components/works/RadianArcLengthCurveRoot.tsx` | 已掃描並修正：三檔都由 `WorkInteractiveStage.rootBySlug`、`interactiveRegistry`、content route/link 與 module / hook / renderer 鏈路消費；`controlsMountId` fallback 已由前批支援性修正移除；重複 `paramsForMetadata(params)` 已收斂成單一 local const；`RadianArcLengthCurveRoot` 的小型 `useMemo` 已移除。 |
| `src/components/works/RationalObliqueAsymptoteCurveRoot.tsx`、`src/components/works/RationalVerticalHorizontalAsymptotesCurveRoot.tsx` | 已掃描並修正：兩檔都由 stage / registry / content / renderer 消費；本地 `details.open` desktop 展開副作用與 `src/pages/works/[slug].astro` 的 `[data-work-controls]` accordion 行為重複，已刪除 root 內的重複 DOM 操作；mode / preset / slider / advanced 狀態均有 controls 或 renderer 讀端。 |
| `src/components/works/RegressionOutlierInfluenceCurveRoot.tsx` | 已掃描並保留：root state 由 controls、hook、renderer、metadata 消費；`dragging` 不是只寫不讀，`regressionOutlierInfluenceRender` 會用它改變 outlier 視覺狀態；content / Explore link / validate-changed special case 均有引用。 |
| `src/components/works/RiemannSumCurveRoot.tsx`、`src/components/works/RotationScaleCompositionCurveRoot.tsx` | 已掃描並保留：兩檔是 `CurveHookWorkRoot` glue，分別被 stage / registry / content / docs 消費；`canvasAriaLabel` 與 `controlsMountId` 均由 helper 讀取。`CurveHookWorkRoot` 的 `defaultParams` common hook contract 已於 2026-06-23 以 `useTangentApproximationP5.ts` / `useVectorFieldStreamlinesP5.ts` 重審確認，不在 root 端局部刪除。 |
| `src/components/curve/CurveWorkRoot.tsx`、`src/components/curve/CurveHookWorkRoot.tsx` | 支援性修正：全專案搜尋確認沒有呼叫端省略 `CurveWorkRoot.controlsMountId`、`CurveWorkRoot.canvasAriaLabel` 或 `CurveHookWorkRoot.initialRevealPct`；已刪除這些無呼叫端的 optional/default 假彈性。 |

## 2026-06-22 dirty diff follow-up

| 範圍 | 結論 |
|------|------|
| `src/components/curve/ParamControls.tsx`、`src/components/explore/DataAnalysisExploreRoot.tsx`、`src/styles/components/range.css` | 已修正錯誤結論：標準 numeric ParamControls 需求是 native range，不是 `+/-` stepper；DataAnalysis 本地參數控件也已恢復 range；未使用的 stepper CSS 與 wrapper 假軌道已刪除。 |
| `docs/p5toreact.md`、`docs/site-ux.md`、`docs/workart.md` | 已修正規則：標準 Work controls 使用 native range 且只保留一條更新路徑；不要用 wrapper 假軌道取代原生 track；按鈕只用於模式切換、重置、顯示開關等離散命令；Work controls accordion ownership 屬於 page script。 |

## 2026-06-22 Work root 第四批接續掃描

| 範圍 | 結論 |
|------|------|
| `src/components/works/ScatterCorrelationRegressionCurveRoot.tsx`、`src/components/works/TangentApproximationCurveRoot.tsx`、`src/components/works/TaylorPolynomialApproximationCurveRoot.tsx`、`src/components/works/VectorAdditionScalarCurveRoot.tsx`、`src/components/works/VectorFieldPatternsCurveRoot.tsx`、`src/components/works/VectorFieldStreamlinesCurveRoot.tsx`、`src/components/works/VectorProjectionCurveRoot.tsx` | 已掃描並保留：全專案搜尋確認 slug / root 被 `WorkInteractiveStage.rootBySlug`、`interactiveRegistry`、content/docs 或 validate-changed 消費；state 由 hook、controls、metadata 或 renderer 讀取，未找到可直接刪除且不改行為的 root 層項目。 |
| `src/components/works/SierpinskiTriangleCurveRoot.tsx` | 已掃描並修正：`depth` range 已刪除重複 `onChange`，只保留 `onInput` 單一路徑。 |
| `src/components/works/SinusoidAmplitudePeriodPhaseCurveRoot.tsx`、`src/components/works/TrigAngleIdentitiesCurveRoot.tsx`、`src/components/works/UnitCircleTrigDefinitionCurveRoot.tsx` | 已掃描並修正：刪除只包住同步 metadata 轉換的 `useMemo`；Sinusoid 改成單一 local `metadataParams`，避免重複 `paramsForMetadata(params)`。 |

## 2026-06-22 affine module 接續掃描

| 範圍 | 結論 |
|------|------|
| `src/curve/modules/affine-ifs-fractal/index.ts`、`src/curve/modules/affine-ifs-fractal/animation.ts` | 已掃描；確認保留：`affineIfsFractalModule` 被 `src/curve/registry.ts`、`AffineIfsFractalCurveRoot`、thumbnail registry test 消費；`createAffineIfsFractalAnimState` / `stepAffineIfsFractalAnimation` 被 `useAffineIfsFractalP5` 與 test 消費；`REVEAL_SPEED` / `PARAM_LERP` 透過 module animation metadata 與 hook 使用。 |
| `src/curve/modules/affine-ifs-fractal/geometry.ts`、`src/curve/modules/affine-ifs-fractal/animation.ts` | 已掃描並修正：`generateGrainsBatch` 經搜尋只被 test 消費，已刪除；`mulberry32` re-export 已刪除，test 改直接 import `src/curve/prng.ts`；animation 內重複 IFS 分支已改用 `stepIfsPoint` / `mathToCanvas`；誤導的縮圖註解已移除。 |
| `src/curve/modules/affine-ifs-fractal/affine-ifs-fractal.test.ts` | 已掃描並修正：刪除只替無 runtime 消費 helper 背書的 `generateGrainsBatch` 白箱測試；保留 animation、module sample、thumbnail 與 deterministic sample 測試。 |
| `src/curve/modules/affine-transform-pattern/index.ts`、`src/curve/modules/affine-transform-pattern/animation.ts` | 已掃描；確認保留：`affineTransformPatternModule` 被 `src/curve/registry.ts`、`AffineTransformPatternCurveRoot`、renderer/content/registry 鏈路消費；animation state/step 被 `useAffineTransformPatternP5` 與 test 消費。 |
| `src/curve/modules/affine-transform-pattern/geometry.ts` | 已掃描並修正：`appendPolygonSegments`、`SECOND_LAYER_TRANSLATION_SCALE`、`CORE_RADIUS`、`applyAffineTransform` 已縮小為檔案內 private；誤導的縮圖註解已移除。 |
| `src/curve/modules/affine-transform-pattern/affine-transform-pattern.test.ts` | 已掃描並修正：刪除 private `applyAffineTransform` 白箱測試；`CORE_RADIUS` expectation 改由 `buildBasePattern()` 推導；sample test 名稱改回 default sample。 |
| 驗證 | 已執行並通過：`npm test -- src/curve/modules/affine-ifs-fractal/affine-ifs-fractal.test.ts src/curve/modules/affine-transform-pattern/affine-transform-pattern.test.ts`，2 files / 12 tests。 |

## 2026-06-22 styles 接續掃描

| 範圍 | 結論 |
|------|------|
| `src/styles/base.css`、`src/styles/layout.css`、`src/styles/tokens.css` | 已掃描；確認保留：由 `BaseLayout.astro` 全站載入，token / base / layout 是全站殼層樣式入口，未發現可刪 selector。 |
| `src/styles/components/breadcrumb.css`、`src/styles/components/canvas.css`、`src/styles/components/filter.css`、`src/styles/components/footer.css`、`src/styles/components/list-search.css`、`src/styles/components/nav.css`、`src/styles/components/section-badge.css` | 已掃描；確認保留：各檔皆有對應 Astro component 或 card import 消費，selector 搜尋未發現 0 引用可刪項。 |
| `src/styles/components/range.css`、`src/styles/pages/explore-detail.css`、`src/styles/pages/work-detail.css`、`src/styles/components/explore/*.css`、`src/styles/components/works/*.css` | 已掃描並修正：range 共用樣式改由 Explore / Work detail 層載入；刪除各 slug CSS 與 Work component CSS 內重複 `@import '../range.css'`；`data-analysis-explore.css` 同型支援性移除，不重複計入本批新掃描數。 |
| `src/styles/pages/work-detail.css` | 已掃描並修正：`controls-panel__placeholder` 全專案搜尋無 DOM / docs / script 引用，已刪除。 |
| `src/styles/pages/about.css`、`src/styles/pages/home.css`、`src/styles/pages/explore-detail.css`、`src/styles/prose.css` | 已掃描；確認保留：route-level import 與 page DOM 對應；`prose.css` 的 `.katex-display` 雖無 source 字串引用，但由 KaTeX runtime HTML 產生，保留。 |
| `src/styles/components/explore-touch.css`、`src/styles/components/explore/explore-toolbar.css` | 已掃描；確認保留：Explore detail route 與 toolbar / sidebar button touch target 共用，未發現可刪 selector。 |
| 驗證 | selector 掃描排除 `src/styles/**` 後只剩 `.katex-display` 這個 KaTeX runtime class；非死碼。 |

## 2026-06-22 rendering 接續掃描

| 範圍 | 結論 |
|------|------|
| `src/systems/rendering/*Render.ts` 本輪 62 檔 | 已掃描並修正：本輪原先漏網的 `RegressionOutlierInfluenceSnap` 已於 2026-06-23 補掃修正；rendering Snap types 已完成 export 面收斂，不需重掃。已移除本輪各 `*Snap` / `*RenderSnap` type 的 `export`，保留 render function 本身作為 hook/root 的公開入口。 |
| `src/systems/rendering/binomialExpansionGeometryRender.ts`、`src/systems/rendering/combinatorialPathCountingRender.ts` | 已掃描並修正：兩檔 `resolveMode` 只在本檔內部消費，且同名造成 export 面噪音；已改為 private function。 |
| `src/systems/rendering/fourierRender.ts` | 已掃描並修正：`fourierCanvasScale` 只被本檔 `renderFourierGrid` / `applyFourierTransform` 消費，已改為 private function；保留 `renderFourierGrid`、`renderFourierEpicycles`、`applyFourierTransform`，因 Explore root 直接 import。 |
| `src/systems/rendering/cartesianGrid.ts`、`src/systems/rendering/polarGrid.ts`、`src/systems/rendering/polyline.ts`、`src/systems/rendering/presets.ts`、`src/systems/rendering/reveal.ts`、`src/systems/rendering/frame.ts`、`src/systems/rendering/types.ts` | 已掃描；確認保留：全專案搜尋顯示這些 helper / preset / type 由 curve roots、module index、morph frame、Explore roots 或 docs contract 消費；未找到可直接刪除的 export。 |
| `src/systems/rendering/complexEulerFormulaRender.ts`、`src/systems/rendering/limitsRiemannSumRender.ts`、`src/systems/rendering/trigFunctionGraphsExploreRender.ts`、`src/systems/rendering/trigonometryExploreRender.ts` 等大型 Explore renderer | 已掃描；本輪未重寫：雖檔案偏大，但公開面只有 renderer function；拆分會新增檔案與抽象，未找到可證明能縮小且不改行為的更小替代。 |
| 驗證 | export 搜尋已確認本輪列表內不再有 0 外部引用的 exported symbol；`TODO` / `FIXME` / `placeholder` / `as any` / `console.log` 搜尋無命中。 |

## 2026-06-23 重審修正

| 範圍 | 結論 |
|------|------|
| `src/components/curve/useRectP5CanvasHost.ts` | 已修正：`keepLooping: false` 自停後的 resize 不再重新 `loop()`，只 `redraw()` 一幀；`restartOn` 仍會清掉自停狀態並重啟 loop。 |
| `src/systems/rendering/regressionOutlierInfluenceRender.ts` | 已修正：`RegressionOutlierInfluenceSnap` 經全專案搜尋只在本檔使用，已移除 `export`。 |
| `src/components/explore/ExponentialLogarithmExploreRoot.tsx`、`src/components/explore/ProbabilityStatisticsExploreRoot.tsx`、`src/components/explore/RationalFunctionsAsymptotesExploreRoot.tsx`、`src/components/works/HarmonographCurveRoot.tsx` | 已修正：range 控件回到單一 native `onInput` 路徑；移除 `Harmonograph` 同一 range 同時綁 `onChange` / `onInput` 的重複事件。 |
| `src/components/curve/useTangentApproximationP5.ts`、`src/components/curve/useVectorFieldStreamlinesP5.ts` | 重審後降級為保留：兩者仍由 `CurveHookWorkRoot` common hook contract 傳入 `defaultParams`，不是可局部刪除的孤立 option。 |
| 8 個 draft Work markdown | 已重審改為保留：使用者確認這批是預先建立、等待填充的 draft Work backlog placeholder；不得刪除。 |

## 2026-06-23 Explore geometry / tests 接續掃描

| 範圍 | 結論 |
|------|------|
| `src/explore/fourier/constants.ts`、`src/explore/fourier/path.ts`、`src/explore/fourier/path.test.ts` | 已掃描並修正：`FOURIER_*` constants 被 `fourierRender.ts` / `FourierSeriesExploreRoot.tsx` 消費，`buildFourierPath` / `tAtArcLength` 被 root 與測試消費；`FourierPathPoint` 無外部 named import，已收窄為本檔型別。 |
| `src/explore/function-equations/constants.ts`、`src/explore/function-equations/types.ts`、`src/explore/function-equations/geometry.ts`、`src/explore/function-equations/geometry.test.ts` | 已掃描並修正：移除 `geometry.ts` 對 `DEFAULT_PARAMS` 的無呼叫端 re-export；`quadraticDiscriminant`、`quadraticPositiveIntervals`、`polynomialPositiveIntervals`、`signBoundaryX`、`sampledSignIntervals`、`pushUniqueRoot` 已收窄為 private，測試改打外部行為。 |
| `src/explore/permutations-combinations/geometry.ts`、`src/explore/permutations-combinations/geometry.test.ts` | 已掃描並修正：`RecurrenceParams`、`CatalanContrast`、`ModeStatsInput` 已收窄；`coefficientLabel` / `pathCombinationLabel` 已取消 export，測試改驗 `buildCombinationStats`。保留 root 消費的 `recurrenceParts`、`recurrenceFormulaLabel`、`catalanContrast`、`buildCombinationStats`。 |
| `src/explore/rational-functions-asymptotes/constants.ts`、`src/explore/rational-functions-asymptotes/types.ts`、`src/explore/rational-functions-asymptotes/geometry.ts` | 已掃描並修正：`RationalFarAsymptote`、`RationalHole` 改為本檔型別；`clampY` 改為 private。重複 `quadraticRoots` / `safeNonzero` 已重審：三處皆為本檔 private tiny helper，且 `minAbs` / tolerance 語意跟各 rational module 綁定；目前抽共用 helper 只會新增 API 表面，不作為 open item。 |
| `src/explore/trig-function-graphs/geometry.ts`、`src/explore/trig-function-graphs/geometry.test.ts` | 已掃描並修正：`clamp` / `mapLinear` 無外部 import，已收窄為 private；保留 root / renderer 消費的 layout、drag、format、stats/formula 與 graph coordinate helpers。 |
| `src/explore/trigonometry/constants.ts`、`src/explore/trigonometry/types.ts`、`src/explore/trigonometry/geometry.ts`、`src/explore/trigonometry/geometry.test.ts` | 已掃描並修正：三個 `TRIG_MODE_*` literal 改為 private；`geometry.ts` 的無呼叫端 re-export 已刪；`Circumcircle` 重複型別已刪。連續 draw 仍由 `stepSmoothing` 消費 `deltaTime`，保留。 |
| `src/explore/vectors/geometry.ts`、`src/explore/vectors/geometry.test.ts` | 已掃描並修正：`rotate90` 全專案只被本測試檔引用，無 runtime 消費，已刪函式與白箱測試；保留 `GUIDE_BASIS`、`projectOnto`、`solveBasisCoordinates`、`getVectorGuideState`。 |
| `src/explore/wave-superposition/canvasSize.ts`、`src/explore/wave-superposition/canvasSize.test.ts`、`src/explore/wave-superposition/constants.ts`、`src/explore/wave-superposition/geometry.ts`、`src/explore/wave-superposition/geometry.test.ts` | 已掃描並修正：canvas 尺寸常數與 `CANVAS_VH_CAP_RATIO` 已收窄為 private；`GuideState` 已收窄為 private；測試改驗實際行為值，不再 white-box import constants。 |
| `src/lib/trigonometry/triangleGeometry.ts`、`src/lib/trigonometry/triangleGeometry.test.ts` | 已掃描並修正：shared triangle geometry 仍被 Explore trigonometry 與 Work `law-of-sines-cosines` 消費；`cross`、`TriangleSidesAngles`、`Circumcircle` 已收窄為 private。 |
| `tests/explore-single.smoke.spec.ts`、`tests/work-integration.smoke.spec.ts` | 已掃描；確認保留：兩者各由 `SMOKE_EXPLORE_SLUG` / `SMOKE_WORK_SLUG` 驅動 single-slug smoke，並從 interactive registry 驗證 slug。`exerciseFirstInteraction` 與 `hasDoubleSlashAssetPath` 只在兩個 smoke spec 重複；抽 helper 會新增 test API 與檔案，暫不為兩個小函式新增抽象。 |
| `tests/seo-ux.spec.ts` | 已掃描；確認保留：覆蓋 built works index size、OG / canonical / JSON-LD、filter URL sync、nav、pager、KaTeX CSS contract。`readJsonLd` 的 `Record<string, unknown>` type assertion 限於測試解析 JSON-LD，未判定刪除；若後續要求收緊測試型別，可改成局部 type guard。 |

## 2026-06-23 ledger 條件變化收尾

| 範圍 | 結論 |
|------|------|
| `scripts/audit-content.mjs`、`src/content/releaseAudit.test.ts`、三個 Work → `/explore/data-analysis` 連結 | 已重審並更新舊紀錄：`data-analysis` 已發布，程式內已無精準例外；generic internal draft link audit 與 release audit 測試仍覆蓋 published markdown 不得連 draft internal route。 |
| `scripts/validate-changed.mjs` | 已重審並更新舊紀錄：目前 `data-analysis` 為 published interactive Explore；`p5PlotHelpers.ts` 的 explicit consumer smoke 映射仍是有效覆蓋，不是待清理的 draft-only 分支。 |
| `src/components/curve/useTangentApproximationP5.ts`、`src/components/curve/useVectorFieldStreamlinesP5.ts`、`src/components/works/RiemannSumCurveRoot.tsx`、`src/components/works/RotationScaleCompositionCurveRoot.tsx` | 已關閉 stale deferred：`defaultParams` 仍屬 `CurveHookWorkRoot` common hook contract，舊待刪與延後掃描描述已改為保留。 |
| `src/explore/rational-functions-asymptotes/geometry.ts` 與 Rational Work modules 的 `quadraticRoots` / `safeNonzero` | 已關閉 stale deferred：三處皆為 private tiny helper，且與各自 tolerance / `minAbs` 語意綁定；目前抽共用 helper 只會新增 API 表面，不列 open item。 |
| 8 個 draft Work markdown | 已依使用者決策改為保留：這批是預先建立、等待填充的 backlog placeholder，不因未發布或未進 registry 刪除。 |
| 驗證 | 已執行並通過：`rg` stale pattern 搜尋無命中；`rg -n 'data-analysis' scripts/audit-content.mjs src/content/releaseAudit.test.ts || true` 無命中；`git diff --check`；`npm run audit:content`；`npm test -- src/content/releaseAudit.test.ts`；`npm run validate:changed -- --dry-run` 選到 `npm run audit:integration`；`npm run audit:integration`。 |

## 2026-06-23 curve modules 第四批接續掃描

| 範圍 | 結論 |
|------|------|
| `src/curve/modules/arithmetic-geometric-sequences/geometry.ts`、`src/curve/modules/arithmetic-geometric-sequences/index.ts` | 已掃描並修正：`SequenceMode`、`ArithmeticScene`、`GeometricScene` 無外部 type import，已收窄為 private；保留 `MODE_*`、`SEQUENCE_VIEW`、scene builders 與 `RectShape`，因 root / renderer / module metadata 消費。 |
| `src/curve/modules/basel-problem/geometry.ts`、`src/curve/modules/basel-problem/index.ts` | 已掃描並修正：`GAMMA`、`termReveal` 與只在本檔使用的 Basel geometry types 已收窄；保留 `BASEL_VIEW`、mode constants、series builders、`estimateLimit`、`normalizeN`、`mapRange`，因 renderer / root / metadata 消費。 |
| `src/curve/modules/binomial-expansion-geometry/geometry.ts`、`src/curve/modules/binomial-expansion-geometry/index.ts` | 已掃描；確認保留：mode constants 被 root 消費，`modeFromValue` / `normalizeLen` 被 hook / renderer / metadata 消費，`project3` 被 renderer 消費，未找到可安全縮小項。 |
| `src/curve/modules/binomial-to-normal/geometry.ts`、`src/curve/modules/binomial-to-normal/index.ts` | 已掃描並修正：`binomialPMF` 只被 `deriveBinormalData` 本檔呼叫，已收窄為 private；保留 mode constants、`BinormalMode`、`deriveBinormalData`、`normalPDF`、`percent`，因 root / hook / renderer / metadata 消費。 |
| `src/curve/modules/buffon-needle/geometry.ts`、`src/curve/modules/buffon-needle/index.ts`、`src/systems/rendering/buffonNeedleRender.ts` | 已掃描並修正：`normalizeLength` / `normalizeSpacing` / `normalizeSpeed` 只供 `deriveBuffonData` 使用，已收窄；`percent` 無讀端已刪；`generateNeedle` 回傳的 `cx` / `cy` 無 renderer / hook 讀端，已刪除假欄位。 |
| `src/curve/modules/catalan-numbers/index.ts` | 已掃描；確認保留：module 被 registry / root / content 鏈路消費，mode constants re-export 被 root 消費，metadata 使用 `normalizeN` / `buildCatalanNumbers`，未找到可安全縮小項。 |
| `src/curve/modules/catenary/animation.ts`、`src/curve/modules/catenary/camera.ts`、`src/curve/modules/catenary/geometry.ts`、`src/curve/modules/catenary/index.ts`、`src/curve/modules/catenary/catenary.test.ts` | 已掃描並修正：`SAMPLE_STEP` 無外部 import，已收窄；`ScreenPoint` 只在 camera 回傳型別使用，移為 camera local type。保留 camera helpers、tractrix geometry、animation state/step 與 tests，因 renderer / hook / thumbnail registry / module sample 消費。 |
| `src/curve/modules/chladni-figures/animation.ts`、`src/curve/modules/chladni-figures/geometry.ts`、`src/curve/modules/chladni-figures/index.ts`、`src/curve/modules/chladni-figures/chladni-figures.test.ts` | 已掃描並修正：`ChladniAnimState`、`PLATE_RATIO`、`BASE_CANVAS`、`NODAL_SAMPLE_STEPS`、`waveMotion`、`constrainParticle`、`moveParticleAwayFromAntinode` 無外部 import，已收窄；保留 particle API、animation step、thumbnail particle cloud 與 nodal-line sample，因 hook / renderer / module sample / tests 消費。 |
| 驗證 | 已執行並通過：`npm test -- src/curve/modules/catenary/catenary.test.ts src/curve/modules/chladni-figures/chladni-figures.test.ts`；`npm run test -- src/lib/curveThumbnail.registry.test.ts src/lib/workOgImage.test.ts`；`npm run smoke:work -- arithmetic-geometric-sequences`；`npm run smoke:work -- basel-problem`；`npm run smoke:work -- binomial-expansion-geometry`；`npm run smoke:work -- binomial-to-normal`；`npm run smoke:work -- buffon-needle`；`npm run smoke:work -- catalan-numbers`；`npm run smoke:work -- catenary`；`npm run smoke:work -- chladni-figures`。 |

## 2026-06-23 curve modules 第五批接續掃描

| 範圍 | 結論 |
|------|------|
| `src/curve/modules/combinatorial-path-counting/index.ts` | 已掃描；確認保留：`COMBINATORIAL_PATH_SPEED` 被 `useCombinatorialPathCountingP5.ts` 與 module animation metadata 消費，`combinatorialPathCountingModule` 被 work root 與 registry 消費，未找到可安全縮小項。 |
| `src/curve/modules/percentile-box-plot/index.ts` | 已掃描；確認保留：module 被 work root / registry 消費，`boxSummary` / percentile helpers 被 renderer、Explore data-analysis geometry 與測試消費，未找到可安全縮小項。 |
| `src/curve/modules/radian-arc-length/index.ts` | 已掃描並修正：`asRadianArcLengthModuleParams` 無外部 import / 字串引用 / registry 引用，已收窄為 private；保留 module export，因 work root 與 registry 消費。 |
| `src/curve/modules/trig-angle-identities/index.ts` | 已掃描並修正：`formulaIdFromParam` 無外部 import / 字串引用 / registry 引用，已收窄為 private；保留 `asTrigAngleIdentitiesModuleParams` 與 module export，因 tests / root / registry 消費。 |
| `src/curve/modules/unit-circle-trig-definition/index.ts`、`src/curve/modules/unit-circle-trig-definition/unit-circle-trig-definition.test.ts` | 已掃描並修正：`asUnitCircleTrigDefinitionParams` 只有白箱測試讀取，無 runtime / registry / docs 消費，已收窄為 private；測試改驗 module / geometry 行為，不再為 wrapper 保留 export。 |
| `src/curve/modules/rose/index.ts`、`src/curve/modules/rose/rose.test.ts` | 已掃描並修正：`getTotalAngle` 只有白箱測試讀取，無 runtime / registry / docs 消費，已收窄為 private；測試改驗證 `roseModule.sample()` 行為，避免為 private helper 保留 export。`rose-curve` 是 `src/curve/registry.ts`、`WorkInteractiveStage.tsx` 與 `src/content/works/rose-curve.md` 的真實 Work slug，`rose` 僅是 module id / 資料夾名。 |
| `src/curve/modules/arithmetic-geometric-sequences/geometry.ts`、`src/curve/modules/arithmetic-geometric-sequences/index.ts` | 本輪重掃確認：已於第四批完整掃描並修正；本輪搜尋驗證沒有新可刪 export 或可縮項，不重複改碼。 |
| `src/curve/modules/basel-problem/geometry.ts`、`src/curve/modules/basel-problem/index.ts` | 本輪重掃確認：已於第四批完整掃描並修正；本輪搜尋驗證沒有新可刪 export 或可縮項，不重複改碼。 |
| 驗證 | 已執行並通過：`npm test -- src/curve/modules/rose/rose.test.ts src/curve/modules/radian-arc-length/radian-arc-length.test.ts src/curve/modules/trig-angle-identities/trig-angle-identities.test.ts src/curve/modules/unit-circle-trig-definition/unit-circle-trig-definition.test.ts src/curve/modules/percentile-box-plot/percentile-box-plot.test.ts`；`npm run test -- src/lib/curveThumbnail.registry.test.ts src/lib/workOgImage.test.ts`；`npm run smoke:work -- combinatorial-path-counting`；`npm run smoke:work -- percentile-box-plot`；`npm run smoke:work -- radian-arc-length`；`npm run smoke:work -- trig-angle-identities`；`npm run smoke:work -- unit-circle-trig-definition`；`npm run smoke:work -- rose-curve`；`npm run smoke:work -- arithmetic-geometric-sequences`；`npm run smoke:work -- basel-problem`；`git diff --check`；`npm run audit:integration`；`npm run validate:changed -- --dry-run`。補充重審後已重跑並通過：`npm test -- src/curve/modules/unit-circle-trig-definition/unit-circle-trig-definition.test.ts src/curve/modules/rose/rose.test.ts`；`npm run smoke:work -- unit-circle-trig-definition`；`npm run smoke:work -- rose-curve`；`npm run audit:integration`；`git diff --check`。 |

## 2026-06-23 curve modules 第六批接續掃描

| 範圍 | 結論 |
|------|------|
| `src/curve/modules/complex-arithmetic-geometry/animation.ts`、`src/curve/modules/complex-arithmetic-geometry/geometry.ts`、`src/curve/modules/complex-arithmetic-geometry/index.ts` | 已掃描並修正：`TIME_SPEED` / `DRIFT_AMP`、`ComplexArithmeticGeometryAnimState` 無外部 import，已收窄；state 的 `targetParams` 只寫不讀，已刪；index 的 `PARAM_LERP` re-export 無外部讀端，已刪。保留 module、thumbnail geometry、`polar` / `add` / `multiply` / `computeViewportRadius`，因 root / registry / renderer / module sample 消費。 |
| `src/components/curve/useComplexArithmeticGeometryP5.ts`、`src/systems/rendering/complexArithmeticGeometryRender.ts` | 支援性修正：renderer snap 的 `r1` / `r2` 欄位無讀端，hook 不再傳入，renderer type 同步刪除；兩檔先前已在其他批次掃描，本輪不重複計入掃描數。 |
| `src/curve/modules/complex-euler-formula/complex.ts`、`src/curve/modules/complex-euler-formula/constants.ts`、`src/curve/modules/complex-euler-formula/layout.ts`、`src/curve/modules/complex-euler-formula/types.ts` | 已掃描並修正：`PlaneTransform` 無外部 type import，已收窄；保留 complex math / layout / constants / params types，因 `ComplexEulerFormulaExploreRoot` 與 `complexEulerFormulaRender` 消費。 |
| `src/curve/modules/complex-phase-portrait/animation.ts`、`src/curve/modules/complex-phase-portrait/geometry.ts`、`src/curve/modules/complex-phase-portrait/index.ts`、`src/curve/modules/complex-phase-portrait/geometry.test.ts` | 已掃描並修正：`ComplexPhasePortraitAnimState`、`PhasorSampleParams`、`SAMPLE_STEP`、`HISTORY_DURATION`、`SAFE_VIEWPORT_RATIO` 無外部 import，已收窄；animation 不再 re-export `PARAM_LERP` / `TIME_SPEED`；index 直接讀 geometry 的 `PARAM_LERP` 並刪除無讀端 re-export。保留 history buffer、phasor sampling、camera scale 與 tests，因 hook / renderer / module sample 消費。 |
| `src/curve/modules/complex-polar-form/animation.ts`、`src/curve/modules/complex-polar-form/geometry.ts`、`src/curve/modules/complex-polar-form/index.ts` | 已掃描並修正：`TIME_SPEED` / `DRIFT_AMP` / `DRIFT_SPD`、`ComplexPolarFormAnimState` 無外部 import，已收窄；state 的 `params` / `targetParams` 只寫不讀，已刪；index 的 `PARAM_LERP` re-export 無外部讀端，已刪。保留 module、`computePolarScale` 與 thumbnail sample，因 root / registry / renderer / module sample 消費。 |
| 驗證 | 已執行並通過：`npm test -- src/curve/modules/complex-phase-portrait/geometry.test.ts`；`npm run test -- src/lib/curveThumbnail.registry.test.ts src/lib/workOgImage.test.ts`；`npm run audit:integration`；`npm run build`；`npm run smoke:work -- complex-arithmetic-geometry`；`npm run smoke:work -- complex-phase-portrait`；`npm run smoke:work -- complex-polar-form`；`npm run smoke:explore -- complex-euler-formula`；`git diff --check`；`npm run validate:changed -- --dry-run`。 |

## 2026-06-23 curve modules 第七批接續掃描

| 範圍 | 結論 |
|------|------|
| `src/curve/modules/conic-dynamic-geometry/animation.ts`、`src/curve/modules/conic-dynamic-geometry/constants.ts`、`src/curve/modules/conic-dynamic-geometry/geometry.ts`、`src/curve/modules/conic-dynamic-geometry/types.ts` | 已掃描並修正：`ConicDynamicAnimState` 無外部 type import，已收窄；state 的 `params` 與 `lastTargetE` 只寫不讀，已刪；focus 分支 unused `point` destructure 已刪；`cosh` / `sinh` 只有同檔取樣使用，已收窄為 private。保留 `targetParams`、drag metric path、constants 與 exported types，因 `ConicDynamicGeometryExploreRoot` / `conicDynamicGeometryRender` / geometry helpers 消費。 |
| `src/curve/modules/conic-envelope/animation.ts`、`src/curve/modules/conic-envelope/geometry.ts`、`src/curve/modules/conic-envelope/index.ts`、`src/curve/modules/conic-envelope/conic-envelope.test.ts`、`src/components/curve/useConicEnvelopeP5.ts` | 已掃描並修正：`ConicEnvelopeAnimState` 無外部 type import，已收窄；state 的 `params` / `targetParams` 只寫不讀，已刪；hook 改由目前 target 直接提供 render 所需 `lineDensity`；module root 不再 re-export 無外部讀端的 `RATIO_LERP`，只保留 root 實際消費的 `REVEAL_SPEED`。保留 geometry helpers / line types / tests，因 renderer、module sample 與白箱幾何測試消費。 |
| `src/curve/modules/conic-focus-locus/animation.ts`、`src/curve/modules/conic-focus-locus/geometry.ts`、`src/curve/modules/conic-focus-locus/index.ts`、`src/curve/modules/conic-focus-locus/conic-focus-locus.test.ts` | 已掃描並修正：`ConicFocusLocusAnimState` 無外部 type import，已收窄；state 的 `params` / `targetParams` 只寫不讀，已刪；module root 不再 re-export 無外部讀端的 `PARAM_LERP`，只保留 root 實際消費的 `REVEAL_SPEED`。保留 ellipse/focus helpers、types、thumbnail helper 與 tests，因 renderer、module sample、OG/thumbnail pipeline 消費。 |
| `src/curve/modules/harmonograph/animation.ts`、`src/curve/modules/harmonograph/index.ts`、`src/curve/modules/harmonograph/harmonograph.test.ts` | 已掃描並修正：`MORPH_LERP` 原本只為 animation 從 module root 反向 import 而 re-export，已移到 animation 並由 index 讀取；module root 不再 export 無外部讀端的 `MORPH_LERP` / `SAMPLE_STEP`，只保留 `REVEAL_SPEED` 給 `HarmonographCurveRoot`。保留 module sample / damping tests，因 Work root、registry、morph tests、thumbnail/OG pipeline 消費。 |
| `src/curve/modules/lissajous/animation.ts`、`src/curve/modules/lissajous/index.ts`、`src/curve/modules/lissajous/lissajous.test.ts` | 已掃描並修正：`DELTA_LERP` 原本只為 animation 從 module root 反向 import 而 re-export，已移到 animation 並由 index 讀取；module root 不再 export 無外部讀端的 `DELTA_LERP` / `LISSAJOUS_TWO_PI`，只保留 `REVEAL_SPEED` 給 `LissajousCurveRoot`。保留 module sample tests，因 Work root、registry、morph tests、thumbnail/OG pipeline 消費。 |
| 驗證 | 已執行並通過：`npm test -- src/curve/modules/conic-envelope/conic-envelope.test.ts src/curve/modules/conic-focus-locus/conic-focus-locus.test.ts src/curve/modules/harmonograph/harmonograph.test.ts src/curve/modules/lissajous/lissajous.test.ts`；`npm run test -- src/components/curve/useMorphCurveP5.draw.test.ts src/curve/morphFrame.test.ts src/lib/curveThumbnail.registry.test.ts src/lib/workOgImage.test.ts`；`npm run test -- src/registry.sync.test.ts`；`npm run smoke:explore -- conic-dynamic-geometry`；`npm run smoke:work -- conic-envelope`；`npm run smoke:work -- conic-focus-locus`；`npm run smoke:work -- harmonograph-curve`；`npm run smoke:work -- lissajous-curve`；`npm run audit:integration`；`npm run build`；`git diff --check`；`npm run validate:changed -- --dry-run`；ledger 機械檢查確認已掃描 612 / 未掃描 132 / tracked 744，無重複、缺漏或 extra。 |

## 2026-06-23 curve modules 第八批接續掃描

| 範圍 | 結論 |
|------|------|
| `src/curve/modules/conditional-probability-bayes/geometry.ts`、`src/curve/modules/conditional-probability-bayes/index.ts`、`src/curve/modules/conditional-probability-bayes/layout.ts` | 已掃描並修正：`geometry.ts` 對 layout constants 的轉出口無外部讀端，已刪；`ScenarioConfig`、`BayesTreeLayout`、`BayesAreaLayout`、`BayesBarsLayout` 無外部 type import，已收窄。保留 `BayesMode`、`scenarios`、mode/scenario normalization、layout constants 與 thumbnail helper，因 Work root、hook、renderer、module sample 消費。 |
| `src/curve/modules/differential-equations-geometry/constants.ts`、`src/curve/modules/differential-equations-geometry/equations.ts`、`src/curve/modules/differential-equations-geometry/layout.ts`、`src/curve/modules/differential-equations-geometry/math.ts`、`src/curve/modules/differential-equations-geometry/types.ts` | 已掃描；確認保留：constants、equation registry、layout mapping、Euler/exact/trace math 與 exported types 均被 `DifferentialEquationsGeometryExploreRoot` 或 `differentialEquationsGeometryRender` 消費；未找到可安全縮小的 export 面。 |
| `src/curve/modules/dot-product-geometry/geometry.ts`、`src/curve/modules/dot-product-geometry/index.ts`、`src/curve/modules/dot-product-geometry/dot-product-geometry.test.ts` | 已掃描並修正：`DOT_PRODUCT_DRAG_LIMIT`、`dotVec`、`magnitude`、`scaleVec`、`computeDotProductExtent`、`DotProductLayout` 只有同檔或白箱測試讀取，已收窄為 private；測試改驗 `computeDotProductMetrics` 行為，不再替 private helper export 背書。保留 params/mode/metrics types、座標 mapping、drag clamp、angle delta、thumbnail sample，因 hook、renderer、module root、OG/thumbnail pipeline 消費。 |
| 驗證 | 已執行並通過：`npm test -- src/curve/modules/dot-product-geometry/dot-product-geometry.test.ts`；`npm run smoke:work -- conditional-probability-bayes`；`npm run smoke:work -- dot-product-geometry`；`npm run smoke:explore -- differential-equations-geometry`；`npm run test -- src/lib/curveThumbnail.registry.test.ts src/lib/workOgImage.test.ts`；`npm run test -- src/registry.sync.test.ts`；`npm run audit:integration`；`npm run build`；`git diff --check`；`npm run validate:changed -- --dry-run`；ledger 機械檢查確認已掃描 623 / 未掃描 121 / tracked 744，無重複、缺漏或 extra。 |

## 接續審查記錄格式

下一輪審查完成後，用以下格式追加：

```md
## YYYY-MM-DD

| 範圍 | 結論 |
|------|------|
| `path/to/file` | 已掃描並修正：具體結果。 |
| `path/to/file` | 已確認保留：保留理由與驗證證據。 |
```
