---
title: Iterated affine fractal
description: An iterated function system (IFS) iterates several affine maps and generates a self-similar fractal.
audience: High-school concept
tags:
  - Geometry
concepts:
  - fractal
  - linear-transformation
date: 2026-05-25
order: 19
featured: false
draft: false
---

## Parametric equations

A single point $P(x,y)$ is sent through one of four affine maps, chosen at random with set probabilities. After many iterations the points gather into a fern-shaped attractor:

$$
\begin{bmatrix} x_{n+1} \\ y_{n+1} \end{bmatrix}
=
\begin{bmatrix} a & b \\ c & d \end{bmatrix}
\begin{bmatrix} x_n \\ y_n \end{bmatrix}
+
\begin{bmatrix} t_x \\ t_y \end{bmatrix}
$$

**b (leaf bend)** controls the horizontal offset of the sub-branches. **d (side branch height)** controls how far the stem reaches up and how large the side leaves are.

## Interaction

- **Leaf bend b**: change the shear of the affine map and the curve of the leaves
- **Side branch height d**: move the branches and change the overall outline
- **Generation speed ω**: build up the point cloud faster and watch the outline of the fractal appear

## What to notice

- Iterating several affine maps at random pulls the point cloud toward a self-similar structure.
- Small parameter changes move the outline continuously between a tree and a fern.
- The boundary comes from the density of many orbit points, not from a single curve.

## Related

- [Affine transformation pattern](/en/works/affine-transform-pattern/)
- [Sierpinski triangle](/en/works/sierpinski-triangle/)

## Further reading

- [Iterated function system (Wikipedia)](https://en.wikipedia.org/wiki/Iterated_function_system)
