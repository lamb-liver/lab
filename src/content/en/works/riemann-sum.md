---
title: Riemann sum
description: Rectangles approach the area under a curve, and the sum settles as the number of partitions grows.
tags:
  - Functions and analysis
concepts:
  - definite-integral
audience: High-school concept
date: 2026-05-25
order: 20
featured: false
draft: false
---

## Parametric equations

On the interval $[0,1]$, take $n$ rectangles of equal width. The height is the left endpoint $f(x_i)$:

$$
\text{Area} \approx \sum_{i=0}^{n-1} f(x_i)\,\Delta x,\quad
\Delta x = \frac{1}{n},\quad
x_i = i\,\Delta x
$$

The function in this figure:

$$
f(x) = 1 + 0.65\sin(k\pi x + t)\cos(\pi x)
$$

**n** sets how many rectangles there are. **k** changes the shape of the integrand. **t** moves the function in time.

## Interaction

- **Number of partitions n**: add rectangles and watch the area sum approach the region under the curve
- **Wave frequency k**: change the rise and fall of the integrand, and watch the error at the same n
- **Time speed ω**: keep the wave and the rectangle heights updating

## What to notice

- The height of each rectangle is the value of the function on that subinterval, and the sum of the areas is a Riemann sum.
- As $n$ grows, the sum usually gets closer to the definite integral, for an integrable function.
- The sharper the bend, the more visible the error at a finite $n$.

## Related

- [Tangent approximation](/en/works/tangent-approximation/)
- [Limits and Riemann sums](/en/explore/limits-riemann-sum/)

## Further reading

- [Riemann integral (Wikipedia)](https://en.wikipedia.org/wiki/Riemann_integral)
