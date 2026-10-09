---
title: A triangle on the disk
description: On the unit disk, an equilateral triangle whose sides are arcs orthogonal to the boundary has a smaller angle sum nearer the edge.
tags:
  - Geometry
concepts:
  - hyperbolic-geometry
audience: University concept
prerequisites:
  - Circles
date: 2026-10-06
order: 76
featured: false
draft: false
---

## Parametric equations

The outer circle is the unit circle. The three vertices are the same distance from the center and $120^\circ$ apart. The side joining two of them is not the chord. It is an arc of the circle through those two points that is orthogonal to the unit circle. The arc stops at the two vertices and does not reach the unit circle. The angle on the disk is the angle between the two arcs at a vertex.

The hyperbolic distance from a vertex to the center is $\rho=\ln\frac{1+r}{1-r}$, where $r$ is the distance on the screen. In the Poincaré disk model of curvature $-1$, this is the distance from the origin, and it equals $2\operatorname{artanh} r$. The side length $s$ of this equilateral triangle satisfies

$$
\cosh s=\cosh^{2}\rho+\frac12\sinh^{2}\rho
$$

The center and two vertices make a triangle with sides $\rho$, $\rho$, and $s$. The hyperbolic law of cosines there uses the included angle $120^\circ$. Since $\cos 120^\circ=-\frac12$, the product term is added, which is the formula above. The same law on the equilateral triangle itself, with included angle $\theta$, rearranges to

$$
\cos\theta=\frac{\cosh s}{\cosh s+1}
$$

So the three angles add up to less than $180^\circ$. As $r$ approaches $0$, the angle sum approaches $180^\circ$.

## Interaction

- **Distance from center**: move the three vertices together, farther from or closer to the center; the angle sum changes with them

## What to notice

- Each side is an arc of a circle orthogonal to the outer circle.
- The three interior angles add up to less than $180^\circ$.
- Toward the center, the angle sum nears $180^\circ$; toward the outer circle, the angle sum gets smaller.

## Related

- [Circle inversion](/en/works/circle-inversion/)
- [Radians and arc length](/en/works/radian-arc-length/)

## Further reading

- [Poincaré disk model (Wikipedia)](https://en.wikipedia.org/wiki/Poincar%C3%A9_disk_model)
- [Hyperbolic geometry (Wikipedia)](https://en.wikipedia.org/wiki/Hyperbolic_geometry)
