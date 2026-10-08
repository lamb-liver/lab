---
title: Plane vectors
description: Read one plane vector as a position, a direction, or coordinates, and use the same picture for a projection, a dot product, a basis, and a normal.
category: Geometry
concepts:
  - vectors
audience: High-school concept
date: 2026-05-26
order: 12
coverImage: /images/explore-covers/vectors.png
featured: false
draft: false
---

## Idea

$$
\mathbf p=(x,y)
$$

As a position, the tip of the arrow is a point in the plane.

$$
\operatorname{proj}_{\mathbf d}\mathbf u=\frac{\mathbf u\cdot\mathbf d}{\mathbf d\cdot\mathbf d}\,\mathbf d
$$

As a direction, the arrow is something you measure along. A projection and a dot product both ask how much of another vector lies that way.

$$
\mathbf p=s\mathbf e_1+t\mathbf e_2,\qquad \mathbf n\cdot\mathbf x=c
$$

As coordinates, the same position is a pair of coefficients of basis vectors $\mathbf e_1$ and $\mathbf e_2$. A normal $\mathbf n$ and a constant $c$ draw the line $\mathbf n\cdot\mathbf x=c$. These are plane vectors written as pairs, not columns.

## Interaction

- **Guide**: one arrow $\mathbf p$, switched among **Position**, **Direction**, and **Coordinates**
- **Direction / projection**: drag the tips and watch the projection, the angle, and the sign of the dot product. **Unit circle** leaves only $\cos\theta$
- **Coordinates / basis**: write a vector as coefficients of a basis. **Coefficient s** and **Coefficient t** change that reading
- **Normal / line**: a normal turns a direction into the line $\mathbf n\cdot\mathbf x=c$. **Constant c** slides the line, which stays perpendicular to $\mathbf n$

Suggested order: use Guide for the three readings of one arrow, then the three focused modes for the projection, the basis, and the normal.

## What to notice

- The same arrow can be a position, then a direction to measure along, then coordinates in a basis.
- A projection and a dot product measure the component along a chosen direction. Perpendicular means that component is zero.
- Changing the basis changes the coordinates. A normal turns a direction into a line.

## Related

- [Vector addition and scalar multiplication](/en/works/vector-addition-scalar/)
- [Dot product](/en/works/dot-product-geometry/)
- [Vector projection](/en/works/vector-projection/)
- [Basic patterns of a vector field](/works/vector-field-patterns/)

## Further reading

- [Euclidean vector (Wikipedia)](https://en.wikipedia.org/wiki/Euclidean_vector)
- [Dot product (Wikipedia)](https://en.wikipedia.org/wiki/Dot_product)
- [Vector space (Wikipedia)](https://en.wikipedia.org/wiki/Vector_space)
