---
title: Dominant direction
description: A unit vector multiplied by one fixed stretch and scaled back to unit length settles on the line of the larger eigenvalue.
tags:
  - Linear algebra
concepts:
  - eigenvector
audience: University concept
prerequisites:
  - Eigenvectors
date: 2026-11-04
order: 80
featured: false
draft: false
---

## Parametric equations

One fixed symmetric matrix stretches the plane along two perpendicular lines. The larger eigenvalue is 1.4, and its line sits 28° from the horizontal axis. The smaller eigenvalue is 0.7, along the perpendicular line.

The start is a unit vector. Its angle θ is measured from the positive horizontal axis and runs from 0° to 180°. Multiply it by this matrix n times, scaling back to unit length after each multiplication. n runs from 0 to 8.

$$
\mathbf u_{k+1}=\frac{A\mathbf u_k}{\|A\mathbf u_k\|}
$$

## Interaction

- **Start angle θ**: turn the first unit vector; the later positions move with it
- **Steps n**: raise how many times the vector is multiplied and scaled back to unit length; the marks along the way update

## What to notice

- Except on the line of the smaller eigenvalue, scaling back to unit length after each multiplication brings a direction onto the line of the larger eigenvalue.
- A vector on the line of the larger eigenvalue stays on that line, and one multiplication changes its length by a factor of 1.4.
- A vector on the line of the smaller eigenvalue keeps its direction, and one multiplication changes its length by a factor of 0.7.

## Related

- [Eigenvectors and stretch factors](/en/works/eigenvector-geometry/)
- [Matrix and linear transformation](/en/explore/matrix-linear-transform/)

## Further reading

- [Power iteration (Wikipedia)](https://en.wikipedia.org/wiki/Power_iteration)
