---
title: Affine transform pattern
description: Affine maps that combine translation, rotation, and scaling, iterated on a pattern.
audience: Intuitive exploration
tags:
  - Linear algebra
concepts:
  - linear-transformation
  - matrix
date: 2026-05-25
order: 17
featured: false
draft: false
---

## Figure

An affine map adds a translation to the linear part, so a shape can move and copy itself:

$$
\begin{bmatrix} x' \\ y' \end{bmatrix}
=
\begin{bmatrix} a & b \\ c & d \end{bmatrix}
\begin{bmatrix} x \\ y \end{bmatrix}
+
\begin{bmatrix} t_x \\ t_y \end{bmatrix}
$$

$$
x' = (s \cos\theta)\,x - (s \sin\theta)\,y + t_x,\quad
y' = (s \sin\theta)\,x + (s \cos\theta)\,y + t_y
$$

**θ** is the rotation angle. **s** breathes slightly over time (about 0.72 ± 0.03). **$t_x, t_y$** is the translation vector. The pattern splits and grows outward from the central parent shape. The same affine map acts on a base square, and a second layer, scaled and translated (factor 0.5), is stacked in each of four directions. The result is a symmetric, multiplying pattern.

## Interaction

- **Rotation angle θ**: change the rotation applied at each iteration, and with it the symmetry of the pattern
- **Translation e**: control the spacing and density of the pattern in the plane
- **Evolution speed ω**: drive the periodic change of the parameters so the pattern evolves continuously

## What to notice

- Repeating an affine map can produce periodic or quasi-periodic patterns.
- The combination of translation and rotation sets the lattice structure of the pattern.
- When the parameters change continuously, the pattern deforms smoothly instead of switching at once.

## Related

- [Linear transform grid](/en/works/linear-transform-grid/)
- [Iterated affine fractal](/en/works/affine-ifs-fractal/)
- [Rotation and scaling, composed](/en/works/rotation-scale-composition/)

## Further reading

- [Affine transformation (Wikipedia)](https://en.wikipedia.org/wiki/Affine_transformation)
