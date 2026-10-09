---
title: Gradient and level curves
description: Drag a point in the plane and watch the gradient stay orthogonal to the level curve, pointing where the function increases fastest.
tags:
  - Functions and analysis
concepts:
  - derivative-tangent
audience: University concept
prerequisites:
  - Derivatives
  - Plane vectors
date: 2026-09-22
order: 70
featured: false
draft: false
---

## Parametric equations

The level curve of a function $f(x,y)$ of two variables is the set of points where $f(x,y)=c$. The gradient $\nabla f$ is the vector of partial derivatives. It points where $f$ increases fastest, and it is orthogonal to the level curve through that point.

$$
\nabla f=\left(\frac{\partial f}{\partial x},\frac{\partial f}{\partial y}\right)
$$

This page uses three standard examples: circular level curves $f=x^2+y^2$ (the gradient points outward along the radius), the saddle $f=x^2-y^2$, and the rectangular hyperbola $f=xy$. For the parallel level lines of the linear objective $z=px+qy$, see [Level curves of the objective](/en/works/lp-objective-level-curves/).

## Interaction

- **Circle x²+y²** / **Saddle x²−y²** / **Hyperbola xy**: switch among the three functions and watch the level curves change from circles into two families of hyperbolas
- **Level curve family**: lay the neighboring level curves over the figure and compare them with the one through the test point
- Drag the test point $P$ on the figure and read $f(P)$ and $\nabla f(P)$. The gold arrow is the gradient. The faint line is the tangent to the level curve at $P$. The two stay orthogonal
- Move the test point to the origin and the gradient arrow disappears. The figure marks the critical point $\nabla f=\mathbf 0$

## What to notice

- The gradient is orthogonal to the level curve. Along the tangent, $f$ hardly changes. Along the arrow, $f$ changes fastest.
- The larger $\|\nabla f\|$ is, the more sharply the same displacement changes the function. In the readout, $\|\nabla f\|$ gets smaller near the origin, and at a critical point the arrow disappears.
- On the circle, the gradient lies along the radius. On the saddle and on $xy$, the level curves are hyperbolas. The gradient is still orthogonal to the tangent there, but the direction is not necessarily along the radius.

## Related

- [Level curves of the objective](/en/works/lp-objective-level-curves/)
- [Basic patterns of a vector field](/en/works/vector-field-patterns/)
- [Tangent approximation](/en/works/tangent-approximation/)
- [A function and its derivative](/en/works/function-derivative-graph/)

## Further reading

- [Gradient (Wikipedia)](https://en.wikipedia.org/wiki/Gradient)
- [Level set (Wikipedia)](https://en.wikipedia.org/wiki/Level_set)
