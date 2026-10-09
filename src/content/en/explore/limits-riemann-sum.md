---
title: Limits and Riemann sums
description: One scale shrinks both the area slices and the local step, and the definite integral and the derivative both come out of a finite approximation.
category: Analysis
concepts:
  - limit
  - definite-integral
  - derivative-tangent
audience: High-school concept
date: 2026-05-25
order: 5
coverImage: /images/explore-covers/limits-riemann-sum.png
featured: false
draft: false
---

## Idea

$$
\int_a^b f(x)\,dx = \lim_{n\to\infty} \sum_i f(x_i^*)\,\Delta x
$$

$$
f'(P)=\lim_{h\to 0}\frac{f(P+h)-f(P)}{h}
$$

A definite integral cuts the interval $[a,b]$ into finer and finer rectangles and then takes the limit. A derivative, near one point, reads an instantaneous slope from a shorter and shorter span. Here $\Delta x$ is the width of the pieces of the whole interval, and $h$ is the local span looking to the right from the point $P$.

## Interaction

- **Compare**: use the same Scale control to shrink the interval slices and the local span together, and compare the accumulated area with the slope ratio
- **Global area**: change the number of partitions n and the sample, and watch the rectangle sum approach the definite integral
- **Local slope**: drag the point P and shrink h, and watch the one-sided secant slope approach $f'(P)$

Suggested order: in Compare, move Scale until the slices and the span get thinner, then Global area for how the error adds up, then Local slope for the secant closing in.

## What to notice

- The definite integral cuts the whole interval into pieces and adds them. The derivative zooms in near one point and takes a ratio.
- As those widths shrink, the area error is what many small intervals add up to, and the slope error is the curvature left near $P$.
- The sharper the bend, the slower a finite partition or a finite $h$ settles. When the function is differentiable, the derivative is still a definite limit.

## Related

- [A function and its derivative](/en/works/function-derivative-graph/)
- [Riemann sum](/en/works/riemann-sum/)
- [Tangent approximation](/en/works/tangent-approximation/)
- [Area and right-endpoint height](/en/works/variable-upper-limit/)
- [Equiangular spiral](/en/works/equiangular-spiral/)

## Further reading

- [Riemann integral (Wikipedia)](https://en.wikipedia.org/wiki/Riemann_integral)
- [Derivative (Wikipedia)](https://en.wikipedia.org/wiki/Derivative)
