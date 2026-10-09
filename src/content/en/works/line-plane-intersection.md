---
title: Where a line meets a plane
description: Drag the start and direction of a line, and the normal and constant of a plane, and watch an intersection, a parallel line, or a line lying in the plane.
tags:
  - Linear algebra
concepts:
  - space-vectors
audience: High-school concept
date: 2026-07-21
order: 65
featured: false
draft: false
---

## Parametric equations

The line through $P_0$ with direction $\mathbf{d}\neq\mathbf{0}$:

$$
\mathbf{r}(t)=\mathbf{r}_0+t\mathbf{d},\quad t\in\mathbb{R}
$$

The plane with normal vector $\mathbf{n}\neq\mathbf{0}$:

$$
\mathbf{n}\cdot\mathbf{r}=h
$$

Substituting gives the parameter of the line-plane intersection:

$$
t=\frac{h-\mathbf{n}\cdot\mathbf{r}_0}{\mathbf{n}\cdot\mathbf{d}}
$$

If $\mathbf{n}\cdot\mathbf{d}=0$, the line is parallel to the plane, or the whole line lies in the plane. When a line is fixed by two points $P_0,P_1$, the direction is $\mathbf{d}=\overrightarrow{P_0P_1}$.

## Interaction

- **Intersects at a point** / **Parallel, no intersection** / **Line lies in the plane**: switch among the three presets and compare $\mathbf{n}\cdot\mathbf{d}$ with $\mathbf{n}\cdot\mathbf{r}_0-h$
- **Plane tilt**: rotate the normal $\mathbf{n}$ and watch when $\mathbf{n}\cdot\mathbf{d}$ passes through $0$, so the intersection disappears
- **Plane offset h**: translate the plane and watch the intersection slide along the line. The sign of $t$ says which side of the start it falls on
- **Line elevation**: change the direction of $\mathbf{d}$ and compare an oblique meeting with a parallel line
- Drag the figure to rotate the view and check that the intersection lies on both the line and the plane. **Horizontal view** and **Elevation** do the same rotation

## What to notice

- When $\mathbf{n}\cdot\mathbf{d}\neq 0$ there is one intersection. The sign of $t$ says which side of the start it is on.
- When $\mathbf{n}\cdot\mathbf{d}=0$ and $\mathbf{n}\cdot\mathbf{r}_0\neq h$, the line is parallel to the plane and does not meet it.
- When $\mathbf{n}\cdot\mathbf{d}=0$ and $\mathbf{n}\cdot\mathbf{r}_0=h$, the whole line lies in the plane.

## Related

- [Spatial vector and three plane projections](/en/works/space-vector-three-plane-projection/)
- [Plane normal and distance from a point](/en/works/plane-normal-distance/)
- [Spatial vectors, planes, and lines](/en/explore/space-vectors-planes-lines/)

## Further reading

- [Line–plane intersection (Wikipedia)](https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection)
- [Euclidean plane (Wikipedia)](https://en.wikipedia.org/wiki/Euclidean_plane)
