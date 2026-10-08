---
title: Vector projection
description: Split a vector into a part along a chosen direction and a part at right angles to it, and drag to see the length change with the angle.
tags:
  - Linear algebra
concepts:
  - vectors
  - dot-cross-product
audience: High-school concept
date: 2026-05-26
order: 43
featured: false
draft: false
---

## Figure

Any vector $\mathbf{a}$ can be split, relative to a nonzero vector $\mathbf{b}$, into a parallel part $\mathbf{a}_{\parallel}$ and a perpendicular part $\mathbf{a}_{\perp}$, with $\mathbf{a}=\mathbf{a}_{\parallel}+\mathbf{a}_{\perp}$ and $\mathbf{a}_{\perp}\cdot\mathbf{b}=0$. The projection is what the dot product measures geometrically. It is also the least-squares best approximation of $\mathbf{a}$ along $\mathbf{b}$: $|\mathbf{a}_{\perp}|$ is the shortest distance from the tip of $\mathbf{a}$ to the line through $\mathbf{b}$.

$$
\mathrm{proj}_{\mathbf{b}}\mathbf{a}
=\frac{\mathbf{a}\cdot\mathbf{b}}{\mathbf{b}\cdot\mathbf{b}}\,\mathbf{b}
$$

$$
\mathbf{a}_{\perp}=\mathbf{a}-\mathrm{proj}_{\mathbf{b}}\mathbf{a}
$$

If $\mathbf{b}=\mathbf{0}$, the projection is undefined. The same split works with the roles reversed, projecting $\mathbf{b}$ onto $\mathbf{a}$.

In the basis reading, $\mathbf{e}_1$ is the unit vector along the line and $\mathbf{e}_2$ is $\mathbf{e}_1$ turned $90^\circ$ counterclockwise. They are orthonormal, and the same vector is $c_1\mathbf{e}_1+c_2\mathbf{e}_2$.

## Interaction

- **a onto b**: show the foot of the perpendicular from $\mathbf{a}$ to the line of $\mathbf{b}$, and the two parts. **b onto a** reverses the roles
- **Drop animation**: a point moves between the tip and the foot, so the parallel and perpendicular parts separate
- **Error length**: mark $|\mathbf{a}_{\perp}|$, the shortest distance from the tip to the line
- **Decomposition**: the parallel and perpendicular parts. **Basis e1, e2** reads the same vector in that orthonormal basis

## Related

- [Dot product](/en/works/dot-product-geometry/)
- [Vector addition and scalar multiplication](/en/works/vector-addition-scalar/)
- [Basic patterns of a vector field](/en/works/vector-field-patterns/)

## Further reading

- [Vector projection (Wikipedia)](https://en.wikipedia.org/wiki/Vector_projection)
