---
title: Matrix and linear transform
description: One 2×2 matrix carries the plane by its two column vectors, and the same matrix is read again as signed area and as the order of composition.
category: Algebra
concepts:
  - matrix
  - linear-transformation
  - eigenvector
audience: High-school concept
date: 2026-05-25
order: 4
coverImage: /images/explore-covers/matrix-linear-transform.png
featured: false
draft: false
---

## Idea

$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix}
\begin{bmatrix} x \\ y \end{bmatrix}
=
\begin{bmatrix} ax+by \\ cx+dy \end{bmatrix}
$$

A matrix sends every vector in the plane to a new place. Where the basis $\hat{\imath},\hat{\jmath}$ goes decides the whole linear transform.

## Interaction

- **Free transform**: drag the entries $a,b,c,d$, and watch the images of $\hat{\imath}$ and $\hat{\jmath}$ pull the grid. The sidebar shows $\det$ and its sign
- **Special transform**: choose **Rotation**, **Scale**, **Shear**, or **Reflection**, and move **Parameter** to see what each one does to the grid
- **Composition**: adjust **A rotation** and **B shear**, and compare the two orders

Suggested order: Free transform, then Special transform, then Composition.

## What to notice

- Where the two column vectors are sent, the whole grid follows. The matrix entries are only the coordinates of those two images.
- The determinant reads the area and the orientation this same transform carries away. Flattened to a line or a point, there is no way back.
- Two transforms in a row still act on the same plane. Swapping the order usually misses the same grid, because the picture in the middle has already changed.

## Related

- [Eigenvectors and stretch factors](/en/works/eigenvector-geometry/)
- [Linear transform grid](/en/works/linear-transform-grid/)
- [Affine transform pattern](/works/affine-transform-pattern/)
- [Rotation and scaling, composed](/works/rotation-scale-composition/)
- [Iterated affine fractal](/works/affine-ifs-fractal/)

## Further reading

- [Linear map (Wikipedia)](https://en.wikipedia.org/wiki/Linear_map)
- [Determinant (Wikipedia)](https://en.wikipedia.org/wiki/Determinant)
