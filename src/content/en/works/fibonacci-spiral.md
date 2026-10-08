---
title: Fibonacci spiral
description: Quarter-circles on squares of Fibonacci side lengths approximate a logarithmic spiral.
audience: Intuitive exploration
tags:
  - Geometry
concepts:
  - parametric-curve
  - sequences-series
date: 2026-05-26
order: 9
featured: false
draft: false
---

## Figure

The Fibonacci sequence $F_n$ satisfies $F_n=F_{n-1}+F_{n-2}$. Squares of side $F_n$, arranged in a spiral, with a quarter-circle in each square, give the classical construction that approaches a logarithmic spiral.

The recurrence:

$$
F_1=1,\; F_2=1,\; F_n = F_{n-1}+F_{n-2}
$$

Each piece of the spiral is a quarter-circle. The limiting ratio is $\displaystyle\lim_{n\to\infty}\frac{F_{n+1}}{F_n}=\varphi=\frac{1+\sqrt5}{2}$.

## Interaction

- **Number of terms n**: the slider shows squares through the nth Fibonacci number
- The outer rectangle stays on the figure. Its side lengths are neighboring Fibonacci numbers, and that ratio approaches $\varphi$

## What to notice

- Neighboring squares have sides $1,1,2,3,5,\ldots$, and each arc of the spiral is one quarter-circle.
- The readout $F_n/F_{n-1}$ moves toward $\varphi$. Compare it with the outer rectangle's aspect ratio.
- The faint blue curve is a logarithmic-spiral reference. The gold arcs are the Fibonacci approximation.

## Related

- [Geometric view of arithmetic and geometric sequences](/en/works/arithmetic-geometric-sequences/)
- [Equiangular spiral](/en/works/equiangular-spiral/)
- [Basel problem](/en/works/basel-problem/)

## Further reading

- [Fibonacci number (Wikipedia)](https://en.wikipedia.org/wiki/Fibonacci_number)
- [Golden rectangle (Wikipedia)](https://en.wikipedia.org/wiki/Golden_rectangle)
