---
title: Linear transform grid
description: A 2×2 matrix acts on the plane grid, and the figure shows shear together with vertical scaling.
tags:
  - Linear algebra
concepts:
  - linear-transformation
  - matrix
audience: High-school concept
date: 2026-05-25
order: 16
featured: false
draft: false
---

## Figure

A linear transform sends a point $P(x,y)$ in the plane to $P'(x',y')$:

$$
\begin{bmatrix} x' \\ y' \end{bmatrix}
=
\begin{bmatrix} a & b \\ c & d \end{bmatrix}
\begin{bmatrix} x \\ y \end{bmatrix}
$$

$$
x' = a \cdot x + b \cdot y,\quad
y' = c \cdot x + d \cdot y
$$

Here $b$ tilts the vertical lines sideways, and $d$ stretches or compresses the grid vertically. As time $t$ advances, $a$ oscillates slightly with $\sin(\omega t)$, so the grid keeps opening and closing a little. The lower-left entry stays $0$, so this motion is not a rotation. A line still maps to a line, and the origin stays fixed.

## Interaction

- **X shear b**: drag the slider to tilt the vertical lines, and watch the square grid become a parallelogram
- **Y scale d**: stretch or compress the vertical direction
- **Transform speed ω**: the grid breathes slightly in time, and a line still maps to a line

## What to notice

- Under this linear transform the origin stays fixed, and a line still maps to a line.
- Shear changes angles and does not change parallelism.
- Shear and vertical scaling together turn the square grid into a parallelogram, and the origin stays fixed.

## Related

- [Matrix and linear transform](/en/explore/matrix-linear-transform/)
- [Affine transform pattern](/en/works/affine-transform-pattern/)
- [Rotation and scaling, composed](/en/works/rotation-scale-composition/)

## Further reading

- [Linear map (Wikipedia)](https://en.wikipedia.org/wiki/Linear_map)
- [Transformation matrix (Wikipedia)](https://en.wikipedia.org/wiki/Transformation_matrix)
