---
title: Tractrix
description: A rope of fixed length tows a point along a tractrix, with sech and tanh and a symmetric pair of tracks.
audience: University concept
prerequisites:
  - Parametric equations
  - Hyperbolic functions
tags:
  - Geometry
concepts:
  - parametric-curve
date: 2026-05-25
order: 22
featured: false
draft: false
---

## Figure

The puller moves along the x-axis and tows an object with a rope of length **L**. The path is a tractrix:

$$
x = L\left(t - \tanh t\right),\quad
y = L\,\text{sech}\,t = \frac{2L}{e^t + e^{-t}}
$$

**t > 0** is the parameter, and the puller sits at $(Lt, 0)$. At every point, the tangent segment from the curve to the x-axis has length **L**.

## Interaction

- **Fixed rope length L**: change the rope length. The curve scales uniformly by L, so the framed shape stays the same
- **History range t**: lengthen the visible window in t and show more of the tractrix
- **Time speed ω**: move the tracked point along the path

## What to notice

- A tractrix is the path of an endpoint towed by a rope of fixed length.
- The tangent segment has constant length L. Changing L only scales the curve, and the framed picture keeps its shape.
- The upper and lower tracks are the positive and negative branches of the same equation.

## Related

- [Tangent approximation](/en/works/tangent-approximation/)
- [Equiangular spiral](/en/works/equiangular-spiral/)

## Further reading

- [Tractrix (Wikipedia)](https://en.wikipedia.org/wiki/Tractrix)
