---
title: Vector addition and scalar multiplication
description: Add two plane vectors by the parallelogram rule, and scale one of them, to see how a linear combination is built.
tags:
  - Linear algebra
concepts:
  - vectors
audience: High-school concept
date: 2026-05-26
order: 41
featured: false
draft: false
---

## Figure

Vectors $\mathbf{u},\mathbf{v}\in\mathbb{R}^2$ add by the parallelogram rule. The same sum is the third side of the triangle that goes along $\mathbf{u}$ and then along $\mathbf{v}$. Scalar multiplication $c\mathbf{v}$ changes the length of $\mathbf{v}$. When $c<0$ it also reverses the direction, and when $c=0$ the scaled arrow is a point. These two operations are what a linear combination $a\mathbf{u}+b\mathbf{v}$ is built from.

$$
\mathbf{u}=(u_x,u_y),\quad \mathbf{v}=(v_x,v_y)
$$

$$
\mathbf{u}+\mathbf{v}=(u_x+v_x,\,u_y+v_y),\quad
c\mathbf{v}=(cv_x,\,cv_y)
$$

The dashed sides of the parallelogram run from the tip of $\mathbf{u}$ to $\mathbf{u}+\mathbf{v}$ and from the tip of $\mathbf{v}$ to $\mathbf{u}+\mathbf{v}$. The gold arrow is the sum. The separate arrow is $c\mathbf{v}$.

## Interaction

- **Scalar c**: drag $c$ from $-2$ to $2$ and watch $c\mathbf{v}$ stretch, shrink, and reverse
- **Component lines**: dashed lines drop the tips of $\mathbf{u}$, $\mathbf{v}$, and $c\mathbf{v}$ onto the two axes
- Drag either endpoint. The sum $\mathbf{u}+\mathbf{v}$ and the parallelogram update together

## Related

- [Dot product](/en/works/dot-product-geometry/)
- [Vector projection](/en/works/vector-projection/)
- [Linear transform grid](/en/works/linear-transform-grid/)

## Further reading

- [Euclidean vector (Wikipedia)](https://en.wikipedia.org/wiki/Euclidean_vector)
- [Parallelogram law (Wikipedia)](https://en.wikipedia.org/wiki/Parallelogram_law)
