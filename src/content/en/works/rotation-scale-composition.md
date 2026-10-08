---
title: Rotation and scaling, composed
description: The matrix product of repeated rotation and uniform scaling, and the spirals and logarithmic spirals it generates.
audience: High-school concept
tags:
  - Linear algebra
concepts:
  - linear-transformation
  - matrix
date: 2026-05-25
order: 18
featured: false
draft: false
---

## Figure

Each step multiplies the shape by the rotation-scaling matrix $M = s \cdot R(\theta)$:

$$
\begin{bmatrix} x_{n+1} \\ y_{n+1} \end{bmatrix}
=
\begin{bmatrix}
s\cos\theta & -s\sin\theta \\
s\sin\theta & s\cos\theta
\end{bmatrix}
\begin{bmatrix} x_n \\ y_n \end{bmatrix}
$$

**θ** is the rotation step between neighboring layers. **s** (&lt; 1) sets how fast the layers shrink toward the center. Lines joining the vertices of the outer frame and the inner layers weave into a grid shaped like a logarithmic spiral.

## Interaction

- **Rotation step θ**: the rotation of each stacked square, which changes how strongly it spirals
- **Scale factor s**: the scaling at each step, which makes the pattern shrink toward the center or spread out
- **Evolution speed ω**: drive the periodic change of the parameters and watch the spiral pattern evolve

## What to notice

- Rotation and uniform scaling combine into a single matrix. In this setup the two commute, and only repeated iteration builds the spiral.
- When the scale factor is close to 1, the pattern gets denser. When it is too small, the pattern collapses quickly to the center.
- Repeated iteration produces a visual structure like a logarithmic spiral.

## Related

- [Linear transform grid](/en/works/linear-transform-grid/)
- [Affine transform pattern](/en/works/affine-transform-pattern/)
- [Equiangular spiral](/en/works/equiangular-spiral/)

## Further reading

- [Rotation matrix (Wikipedia)](https://en.wikipedia.org/wiki/Rotation_matrix)
