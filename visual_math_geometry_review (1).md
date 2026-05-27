# Visual Math Engine — Geometry Review Skill

> **Purpose:** Guard against fake math and fake geometry. Not a checklist to push every project to research grade — a guardrail to keep visualizations honest.
>
> **Stop condition:** Once the core mathematical insight is visually legible, the work is done. Do not optimize beyond that.

---

## 0. Extract Claims First

Before reviewing, enumerate what the visualization **actually claims**:

| Concept | Core Math to Verify |
|---|---|
| Fibonacci Spiral | Recurrence, quarter-circle tiling, φ convergence |
| Sierpinski Triangle | Recursive subdivision, IFS contraction, invariant set |
| (your subject) | (list the minimum claims here) |

All subsequent checks are scoped to these claims only.

---

## Tier 1 — Required (Anti-Fake-Math Gates)

These must pass. Failing any one means the visualization is mathematically dishonest.

### T1-1. Formula Existence

Any formula shown in UI or labels must be **actually used** in geometry, iteration, transform, or recursion — not just displayed.

| ✅ Pass | ❌ Fail |
|---|---|
| Quarter-circle arcs built from Fibonacci tile sizes | Arbitrary spiral labeled "Fibonacci Spiral" |
| `P(k+1) = lerp(P(k), V(i), r)` drives point positions | Chaos game label on random noise |
| `F(n+1)/F(n)` converges in actual ratio data | φ appears only as a static label |

### T1-2. Visual–Math Correspondence

Core geometry must derive from the claimed math, not from a visually similar approximation.

- Spiral path → same origin and scale as tile geometry
- Fractal removal → identical transformation at every recursive level
- Attractor → emergent from contraction, not hand-placed

### T1-3. Single Coordinate System

All geometry shares one world space, one scale, one origin.

```js
// ✅
tile.arc = buildArc(tileOrigin, tileSize)
spiral   = buildSpiral(tileOrigin, tileSize)  // same source

// ❌
spiral uses screen pixels; tiles use world units
```

Overlays (golden rectangle, guide lines) must share the same anchor, coordinate space, and rotation.

### T1-4. No Geometry-Defining Magic Numbers

Constants that *define structure or alignment* without mathematical derivation are fake geometry:

```
// ❌ — geometry magic numbers
offset = 0.35
scale  = 1.13
nudge  = +42
```

> **Note:** Visual tuning constants are acceptable — `strokeAlpha = 18`, optical spacing adjustments, anti-alias offsets. The rule targets geometry-defining values only, not rendering parameters.

### T1-5. UI Maps to Math

Every slider or control must correspond to a mathematical parameter.

| ✅ Mathematical | ❌ Cosmetic |
|---|---|
| `depth`, `iterations`, `frequency` | `intensity`, `beauty`, `smoothness` |
| `matrix coefficients`, `contraction ratio` | `curve amount`, `glow strength` |

### T1-6. Recursion Integrity

Identify construction type first: recursive geometry / iterative attractor / subdivision / affine IFS / particle approximation.

Then verify:

| Check | Requirement |
|---|---|
| Self-similarity | Same transformation repeated — not just progressively smaller |
| Depth control | Changes topology, not just opacity or decoration |
| Chaos game | Random vertex selection + contraction → structure emerges |

---

## Tier 2 — Recommended (Insight Enhancement)

Good to have. Absence is not a failure.

| Feature | What It Adds |
|---|---|
| Emergence timing | Animation reveals in mathematical generation order |
| Semantic glow | Emphasis encodes structure (attractor glow ≠ decoration glow) |
| Convergence visible | Ratio/scaling behavior observable, not just stated |
| Compare mode | Lets user see mathematical relationship directly |
| Scaling law intuition | Depth/iteration change has perceptible structural consequence |

---

## Tier 3 — Research Grade (Do Not Default Here)

These are valid. They are expensive. Most projects do not need them.

Apply only when the project explicitly targets academic or technical depth:

- Exact topology / set algebra
- Occupancy field rendering
- Invariant operator visualization
- Convergence metric display
- Measure-boundary duality
- Affine contraction decomposition

> Defaulting to Tier 3 on every project causes: slower output, lower topic coverage, permanent "not finished" feeling. The goal is a **visualization language**, not a thesis per project.

---

## Failure Mode Reference

| Failure | Symptom |
|---|---|
| **Fake Math** | Visually convincing, formulas exist only in labels |
| **Fake Geometry** | Magic numbers micro-adjust alignment with no derivation |
| **UI Drift** | Slider label and actual rendered behavior disagree |
| **Recursive Explosion** | Increasing depth → alpha overflow / geometry corruption / FPS collapse |
| **Coordinate Drift** | Overlay and main geometry use different coordinate systems |
| **Optimization Spiral** | Tier 1 passes but work continues indefinitely toward Tier 3 |

---

## Pass Criteria

**Tier 1 checklist — must all pass:**

- [ ] All claimed formulas are present in geometry/iteration/transform code
- [ ] Core geometry derives from the claimed math (not a visual approximation)
- [ ] All geometry shares one coordinate system; overlays are properly anchored
- [ ] No magic numbers define structural alignment
- [ ] Every UI control maps to a real mathematical parameter
- [ ] Recursion/iteration uses the correct construction type with correct properties

**Stop here once the core mathematical insight is visually legible.**
