---
title: Logistic map bifurcation diagram
description: Period doubling and chaotic regions of x_{n+1} = r x_n(1-x_n) as the parameter r changes.
audience: University concept
prerequisites:
  - Sequences
  - Function iteration
tags:
  - Dynamical systems
concepts:
  - dynamical-system
  - logistic-growth
date: 2026-05-26
order: 13
featured: false
draft: false
---

## Figure

The logistic map $x_{n+1}=rx_n(1-x_n)$ models a population with limited resources. As $r$ grows, the orbit goes from a fixed point through period 2, 4, 8, … and then into chaos. The bifurcation diagram puts $r$ on the horizontal axis and the long-run orbit values on the vertical axis, and it shows Feigenbaum universality.

$$
x_{n+1} = r\,x_n(1-x_n),\quad x_n\in[0,1],\quad r\in[0,4]
$$

Bifurcation diagram: for each $r$, drop the transient and plot the attractor set of $\{x_n\}$.

## Interaction

- **Parameter r**: change $r$ and watch the orbit go from a fixed point through period doubling into chaos
- **Initial value x₀**: change the starting point, and compare the sensitivity to initial values in the chaotic region with the insensitivity in the periodic region
- **Bifurcation** / **Orbit** / **Cobweb**: switch among three readings and compare the long-run distribution, the time series, and step-by-step iteration
- **Feigenbaum**: mark the ratio of the gaps between period doublings and compare it with the universal constant

## What to notice

- The bifurcation diagram projects the long-run attractors onto one parameter plane, so fixed points, period doubling, and chaotic bands are visible at once.
- The orbit and cobweb views stay at the current $r$. They explain one vertical slice of the bifurcation diagram through local dynamics.
- The Feigenbaum marks show how quickly the period-doubling gaps shrink, a scaling law at the edge of chaos.

## Related

- [Julia set](/en/works/julia-set/)
- [Sierpinski triangle](/en/works/sierpinski-triangle/)
- [Vector field streamlines](/en/works/vector-field-streamlines/)

## Further reading

- [Logistic map (Wikipedia)](https://en.wikipedia.org/wiki/Logistic_map)
- [Bifurcation diagram (Wikipedia)](https://en.wikipedia.org/wiki/Bifurcation_diagram)
