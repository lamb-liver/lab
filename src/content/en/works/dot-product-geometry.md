---
title: Geometric significance of the dot product
description: The dot product, or inner product, reads the angle between two vectors, a right angle, and the work of a force.
tags:
  - Linear algebra
concepts:
  - dot-cross-product
  - vectors
audience: High-school concept
date: 2026-05-26
order: 42
featured: false
draft: false
---

## Parametric equations

The dot product, also called the inner product, is

$$
\mathbf{u}\cdot\mathbf{v}=|\mathbf{u}||\mathbf{v}|\cos\theta
$$

$$
\mathbf{u}\cdot\mathbf{v}=u_x v_x + u_y v_y
$$

The sign is the sign of $\cos\theta$: positive when the angle is acute, negative when it is obtuse. If either vector is the zero vector, there is no angle. If both are nonzero and the angle is a right angle, the product is zero.

The scalar projection of $\mathbf{u}$ onto $\mathbf{v}$, for $\mathbf{v}\neq\mathbf{0}$, is

$$
\mathrm{comp}_{\mathbf{v}}\mathbf{u}=\frac{\mathbf{u}\cdot\mathbf{v}}{|\mathbf{v}|}
$$

The gold arrow is the vector projection of $\mathbf{u}$ onto the line of $\mathbf{v}$. Its signed length along $\mathbf{v}$ is that number. The same product is the work $W=\mathbf{F}\cdot\mathbf{d}$ of a force along a displacement. Switching to that reading only renames the two arrows.

## Interaction

- **Dot product u · v**: drag either vector and watch the sign and size of $\mathbf{u}\cdot\mathbf{v}$ change with the angle
- **Angle θ**: mark $\theta$. When the vectors are perpendicular the product is zero and the badge is highlighted
- **Projection**: drop $\mathbf{u}$ onto the direction of $\mathbf{v}$ and compare that signed length with the dot product
- **Work W = F · d**: rename the arrows as a force and a displacement. The formula is the same

## Related

- [Vector addition and scalar multiplication](/en/works/vector-addition-scalar/)
- [Vector projection](/en/works/vector-projection/)
- [Basic patterns of a vector field](/en/works/vector-field-patterns/)

## Further reading

- [Dot product (Wikipedia)](https://en.wikipedia.org/wiki/Dot_product)
