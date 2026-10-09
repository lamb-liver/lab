---
title: Tangent approximation
description: The secant slope approaches the tangent slope, so the derivative reads as an instantaneous rate of change.
tags:
  - Functions and analysis
concepts:
  - derivative-tangent
  - limit
audience: High-school concept
date: 2026-05-25
order: 21
featured: false
draft: false
---

## Figure

Secant slope:

$$
m = \frac{f(x_P + \Delta x) - f(x_P)}{\Delta x}
$$

As $\Delta x \to 0$, this converges to the derivative. Point-slope form:

$$
y - f(x_P) = m(x - x_P)
$$

The function:

$$
f(x) = 0.25\sin(2\pi k x + t) - 0.4(x - 0.5)^2
$$

The point of tangency $x_P = 0.5 + 0.1\sin(0.6t)$ drifts a little with time. **Δx** is the spacing, on the $x$-axis, of the two ends of the secant. **k** controls how much the curve bends.

## Interaction

- **Target span Δx**: shrink the secant's spacing in x and watch the secant approach the tangent
- **Wave frequency k**: change how much the curve bends; the tangent slope changes with the position
- **Time speed ω**: move the secant endpoints along the curve

## What to notice

- The secant slope $\Delta y/\Delta x$ approaches the tangent slope as $\Delta x\to 0$.
- On a more curved stretch, the same $\Delta x$ leaves a larger gap between the secant and the tangent.
- The derivative is an instantaneous rate of change, not an average rate of change.

## Related

- [Riemann sum](/en/works/riemann-sum/)
- [Limits and Riemann sums](/explore/limits-riemann-sum/)
- [Tractrix](/en/works/catenary/)

## Further reading

- [Derivative (Wikipedia)](https://en.wikipedia.org/wiki/Derivative)
