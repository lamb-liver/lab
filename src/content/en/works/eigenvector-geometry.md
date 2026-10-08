---
title: Eigenvectors and stretch factors
description: Switch among standard 2×2 matrices and see that an eigenvector's line still maps to itself, with the stretch set by the eigenvalue.
audience: University concept
prerequisites:
  - Matrices
  - Plane vectors
tags:
  - Linear algebra
concepts:
  - eigenvector
  - matrix
  - linear-transformation
date: 2026-06-11
order: 54
featured: false
draft: false
---

## Figure

Let $A$ be a $2\times 2$ matrix. A nonzero vector $\mathbf v\ne\mathbf 0$ that satisfies

$$
A\mathbf v=\lambda\mathbf v
$$

is an eigenvector, and $\lambda$ is the matching eigenvalue. The line through the origin along $\mathbf v$ maps to itself. The vector only stretches, reverses, or flattens.

$$
\mathbf v' = A\mathbf v = \lambda\mathbf v
$$

If $\lambda>0$, it stretches in the same direction and its length becomes $|\lambda|$ times as long. If $\lambda<0$, it stretches in the opposite direction. If $\lambda=0$, that direction is crushed to the origin. When the eigenvalues are complex, the plane has no such line through the origin.

## Interaction

- **Stretch** / **Rotation** / **Shear** / **Reflection** / **Saddle** / **Scalar**: switch the matrix and watch the eigen directions and the grid
- **u**: drag the blue arrow on the figure. Its direction turns, unlike a vector that already lies on an eigenline
- **Advanced matrices**: show the sliders **a**, **b**, **c**, and **d**, and the presets **Rotate-and-stretch**, **Flatten**, and **Oblique**. The default view hides the entry sliders
- **Reset**: return to **Stretch**

## What to notice

- An eigenvector is a direction that still lies on the same line through the origin after the transform. If $\lambda>0$ it stretches the same way, if $\lambda<0$ it reverses, and if $\lambda=0$ it is crushed to the origin.
- Two different real eigenvalues usually give two eigen directions. A repeated eigenvalue may give only one, or every direction may be an eigen direction.
- A pure rotation by an angle that is not a multiple of $\pi$ has no nonzero vector of unchanged direction in the real plane. That matches a rotation moving every direction.

## Related

- [Linear transform grid](/en/works/linear-transform-grid/)
- [Rotation and scaling, composed](/works/rotation-scale-composition/)
- [Matrix and linear transform](/explore/matrix-linear-transform/)

## Further reading

- [Eigenvalues and eigenvectors (Wikipedia)](https://en.wikipedia.org/wiki/Eigenvalues_and_eigenvectors)
- [Linear map (Wikipedia)](https://en.wikipedia.org/wiki/Linear_map)
