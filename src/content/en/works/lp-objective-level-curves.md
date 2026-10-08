---
title: Level curves of the objective
description: Drag a level line of the objective z=px+qy and watch the whole plane split into layers by a family of parallel lines.
audience: High-school concept
tags:
  - Optimization
concepts:
  - linear-programming
date: 2026-07-22
order: 68
featured: false
draft: false
---

## Parametric equations

The objective function

$$
z=px+qy
$$

has level lines $px+qy=k$, a family of parallel lines with a fixed slope. The normal vector $\mathbf n=(p,q)$ points where $z$ increases fastest. Moving a level line along $\mathbf n$ makes $k$ increase or decrease monotonically.

This family splits the whole plane into layers. Every point lies on exactly one level line, and that line's $k$ is the point's $z$ value.

## Interaction

- **Coefficient p** / **Coefficient q**: change the two coefficients of the objective. The slope of the family changes, but the lines in it always stay parallel
- **Level k**: move the current level line. You can also drag the thick line in the figure, and $k$ follows the $z$ value at the pointer
- **Level line family**: show or hide several neighboring level lines. The "Spacing" reading in the sidebar is $\Delta k/\|\mathbf n\|$. The larger $\|\mathbf n\|$ is, the closer the same difference in $k$ packs the lines
- **Test point**: drag the blue point in the figure, read the $k$ of the level line through it, and check it against $z=px+qy$
- The white arrow is the normal $\mathbf n=(p,q)$. It points where $z$ increases fastest, and the level lines are always perpendicular to it

## What to notice

- The level lines are parallel to each other. A different $k$ moves the line, but the slope stays the same.
- The normal vector $\mathbf n=(p,q)$ is perpendicular to the level lines, and $z$ changes monotonically along it.
- The objective turns every point of the plane into a number. A level line is the set of points that give the same number.

## Related

- [Constraint half-planes and the feasible region](/en/works/lp-feasible-half-planes/)
- [Finding the optimum at a vertex](/en/works/lp-vertex-optimum/)
- [Linear programming](/en/explore/linear-programming/)

## Further reading

- [Linear programming (Wikipedia)](https://en.wikipedia.org/wiki/Linear_programming)
- [Contour line (Wikipedia)](https://en.wikipedia.org/wiki/Contour_line)
