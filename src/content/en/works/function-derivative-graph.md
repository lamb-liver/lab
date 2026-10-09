---
title: A function and its derivative
description: Compare f(x) with f'(x), and watch increase, extrema, and the tangent slope move together.
tags:
  - Functions and analysis
concepts:
  - derivative-tangent
audience: High-school concept
date: 2026-06-11
order: 56
featured: false
draft: false
---

## Figure

If $f$ is differentiable, the derivative $f'$ records the instantaneous slope of $f$ at each point:

$$
f'(x)=\lim_{h\to 0}\frac{f(x+h)-f(x)}{h}
$$

If $f'(x)>0$ throughout an interval, then $f$ is increasing on that interval. If $f'(x)<0$ throughout an interval, then $f$ is decreasing on that interval.

$$
f'(x)=0
$$

means the tangent to $f$ at that point is horizontal, so the point is a candidate extremum. It may instead be only a horizontal crossing, and you still have to see whether the sign of $f'$ changes. For example, $f(x)=x^3$ has $f'(0)=0$ at $x=0$, but that point is not an extremum.

## Interaction

- **y=f(x)** and **y=f'(x)**: the upper graph is $y=f(x)$ and the lower graph is $y=f'(x)$, sharing one vertical line $x=x_0$
- **x₀**: drag $x_0$. The upper graph marks the point of tangency and the tangent. The lower graph marks $(x_0,f'(x_0))$
- **x²** / **x³−3x** / **sin x**: switch the function and compare slopes, zeros, and the type of extremum
- **Monotone intervals**: turn on **Advanced marks**, then mark where $f'>0$ and where $f'<0$ with a faint wash, not a strong red-green contrast
- **Zero marks**: mark the zeros of $f'(x)=0$ on the lower graph, and the matching horizontal tangents on the upper graph

## What to notice

- The sign of $f'$ on an interval says whether $f$ is increasing or decreasing there. $f'=0$ only means the tangent is horizontal. It may be an extremum or a horizontal crossing, and you still have to see whether the sign changes.
- The tangent slope is $f'(x_0)$. That upgrades the local reading on the tangent-approximation page into the whole graph of $f'$.
- Concavity of $f$ is tied to the sign of $f''$. This page stays with the first derivative. The second is left for later.

## Related

- [Tangent approximation](/en/works/tangent-approximation/)
- [Limits and Riemann sums](/en/explore/limits-riemann-sum/)
- [Function graphs and solution sets](/en/explore/function-equations/)

## Further reading

- [Derivative (Wikipedia)](https://en.wikipedia.org/wiki/Derivative)
- [Maximum and minimum (Wikipedia)](https://en.wikipedia.org/wiki/Maximum_and_minimum)
