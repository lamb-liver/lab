---
title: Area and right-endpoint height
description: As h approaches 0, the area increment divided by the width approaches the height of the curve.
tags:
  - Functions and analysis
concepts:
  - definite-integral
audience: High-school concept
prerequisites:
  - Derivative
  - Definite integral
date: 2026-10-06
order: 75
featured: false
draft: false
---

## Parametric equations

The right endpoint moves along this curve:

$$
f(x)=1+\frac12\sin x
$$

The area from $0$ to $x$ has a closed form:

$$
A(x)=\int_0^x f=x-\frac12\cos x+\frac12
$$

So $A'(x)=f(x)$. Past the right endpoint, take one more piece of width $h$, and write $\Delta A=A(x+h)-A(x)$. As $h$ approaches $0$, $\Delta A/h$ approaches $f(x)$. The top of the strip is horizontal, and its height is $f(x)$ at the start of that piece.

Adding a constant to an antiderivative does not change the difference of the two ends. If the lower limit were the one that moved, the height at that end would take a minus sign. That is a consequence of the same formula. The figure moves only the upper limit.

## Interaction

- **Right endpoint x**: move the upper limit; the gold region extends to the new right end
- **Strip width h**: change the width of the rectangle at the right end; $\Delta A/h$ moves toward or away from the height of the curve

## What to notice

- On this curve, the rate of change of the area is the height at the right endpoint.
- While the strip still has width, $\Delta A/h$ and $f(x)$ can stand apart. They meet only as the width approaches $0$.
- The curve leaves the top-left corner of the strip and runs to the right. Where this piece rises, it shows above the strip, and where it falls, it drops into the strip.

## Related

- [Riemann sum](/en/works/riemann-sum/)
- [Tangent approximation](/en/works/tangent-approximation/)
- [Geometric definition of the natural logarithm](/en/works/natural-log-e-geometry/)
- [Limits and Riemann sums](/en/explore/limits-riemann-sum/)

## Further reading

- [Fundamental theorem of calculus (Wikipedia)](https://en.wikipedia.org/wiki/Fundamental_theorem_of_calculus)
- [Derivative (Wikipedia)](https://en.wikipedia.org/wiki/Derivative)
