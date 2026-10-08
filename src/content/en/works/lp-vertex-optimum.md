---
title: Finding the optimum at a vertex
description: Visit each vertex of the feasible region, compute z=px+qy, and read from the candidate table where the optimum lies.
audience: High-school concept
tags:
  - Optimization
concepts:
  - linear-programming
date: 2026-07-22
order: 69
featured: false
draft: false
---

## Parametric equations

Given the vertices $\{V_j=(x_j,y_j)\}$ of a convex feasible polygon and the objective $z=px+qy$, the vertex method computes, one vertex at a time,

$$
z_j=px_j+qy_j
$$

If the feasible region is bounded and an optimal value exists, the largest (or smallest) $z_j$ gives at least one optimal solution. If the optimal value is the same along a whole edge, every point on that edge is optimal. The main output of this page is the candidate table. The figure only shows which row of the table is being checked.

## Interaction

- **Candidates**: list the coordinates, $z_j$, and rank of each vertex. The whole table is recomputed when the constraints or the objective change. Tapping a vertex in the figure also switches to its row
- **Objective direction θ**: turn the direction of the objective and watch the optimal row change hands. The jump happens when the level line passes through the line joining two vertices
- **Maximize** / **Minimize**: choose which end to take. For the same vertices, the minimum row is the last row of the maximum ranking
- **Quadrilateral region** / **Triangular region**: switch to a feasible region with a different number of corner points, and the number of rows changes with it
- **Step through**: highlight the vertex being checked, one step at a time. The sweep line moves to that point's $z$ value
- **Sort by z**: sort the table by $z_j$. Sorting only changes the display order. Stepping and the highlight in the figure still point to the same vertex
- **Edge optimum**: set the objective direction parallel to one edge and watch two rows tie for first. Every point on that edge has the same $z$

## What to notice

- If a bounded feasible region has an optimal value, at least one optimal solution is at a vertex. This is why the vertex method works.
- When the slope of the objective changes, the optimal vertex can jump from one corner point to the next. The jump happens when the level line passes through the line joining two vertices.
- An empty feasible region has no solution. In an unbounded one, $z$ may have no upper or lower bound, so first check whether a finite optimal value exists.

## Related

- [Constraint half-planes and the feasible region](/en/works/lp-feasible-half-planes/)
- [Level curves of the objective](/en/works/lp-objective-level-curves/)
- [Linear programming](/en/explore/linear-programming/)

## Further reading

- [Linear programming (Wikipedia)](https://en.wikipedia.org/wiki/Linear_programming)
- [Maxima and minima (Wikipedia)](https://en.wikipedia.org/wiki/Maxima_and_minima)
