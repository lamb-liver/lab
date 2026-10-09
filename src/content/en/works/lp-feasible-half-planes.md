---
title: Constraint half-planes and the feasible region
description: Drag the constraint lines and watch how the half-plane masks and the convex feasible polygon change as they intersect.
audience: High-school concept
tags:
  - Optimization
concepts:
  - linear-programming
date: 2026-07-22
order: 67
featured: false
draft: false
---

## Figure

The $i$-th linear constraint

$$
a_ix+b_iy\le c_i
$$

cuts out a half-plane. The intersection of $m$ constraints is the feasible region:

$$
\mathcal F=\{(x,y)\mid a_ix+b_iy\le c_i,\ i=1,\ldots,m\}
$$

If the intersection is bounded, $\mathcal F$ is a convex polygon. If it is unbounded, it is a convex polygonal region that extends in some directions. The boundary is made of segments, rays, or lines where a constraint holds with equality.

## Interaction

- **Constraint 1** / **Constraint 2** / **Constraint 3**: choose which adjustable constraint to edit. Dragging a constraint line in the figure also selects it
- **Normal angle θ**: turn the normal $(a,b)$ of the selected constraint and watch the half-plane it keeps turn with it. When $\theta$ passes $180°$, the kept side flips
- **Offset c**: move the constraint along its normal. The area of the feasible region changes continuously, but the directions of the edges do not
- **Feasible region** / **Half-plane mask**: switch between two views, the intersection alone or the half that each constraint cuts away. The darker the overlapping masks, the more constraints exclude that spot
- **Bounded** / **Unbounded** / **Infeasible**: jump to a preset for each of the three states of the feasible region. When $\mathcal F$ is empty or unbounded, the area reading in the sidebar says why
- A constraint that does not help form the boundary is drawn dashed and marked redundant. Push its offset away and back, and the corner points of the feasible region do not move at all

## What to notice

- Each constraint cuts away half of the plane. The feasible region is the intersection of everything kept, so it is always convex.
- Some constraints play no part in forming the boundary. Whether they are there or not, the shape of $\mathcal F$ is the same.
- Multiplying the coefficients by a positive number does not change the half-plane. The direction of the inequality decides which side is kept.

## Related

- [Level curves of the objective](/en/works/lp-objective-level-curves/)
- [Finding the optimum at a vertex](/en/works/lp-vertex-optimum/)
- [Linear programming](/explore/linear-programming/)

## Further reading

- [Linear inequality (Wikipedia)](https://en.wikipedia.org/wiki/Linear_inequality)
- [Feasible region (Wikipedia)](https://en.wikipedia.org/wiki/Feasible_region)
