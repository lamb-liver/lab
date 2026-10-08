---
title: "Iteration dynamics: from convergence to fractals"
description: Apply one rule again and again, and compare fixed points, short periods, dense long-run values, and self-repeating fractals.
category: Analysis
concepts:
  - dynamical-system
  - logistic-growth
  - fractal
audience: University concept
prerequisites:
  - Sequences
  - Function iteration
date: 2026-08-03
order: 21
coverImage: /images/explore-covers/iteration-dynamics.png
featured: false
draft: false
---

## Idea

Applying the same rule $f$ to its own output again and again, $x \to f(x) \to f(f(x)) \to \cdots$, is "iteration". The action is simple, but the long-run behavior varies widely. It can converge to a fixed point, jump periodically among a few values, show complicated values in which a finite observation finds no short period, or build a self-similar fractal in the plane.

This page sets three faces of iteration side by side so you can see they share a source: convergence, short periods, and complicated long-run behavior in one dimension; bifurcation as the parameter sweeps; and fractals grown by geometric iteration. The technical details of each phenomenon are left to the works below. This page builds the common language of "apply the same rule again and again".

## Interaction

- **Cobweb**: drag the growth rate $r$ and watch the orbit of the logistic map $x_{n+1}=r\,x_n(1-x_n)$ bounce back and forth along $y=x$. Compare a fixed point, a short period, and a case where no short period is detected.
- **Bifurcation**: sweep across the range of $r$ and let the figure plot the long-run values for each $r$ as dots. Watch dense bands and periodic windows appear after period doubling.
- **Chaos game**: switch to geometric iteration. Applying contraction maps at random, the scattered points gradually build a self-similar fractal such as the Sierpinski triangle.

## What to notice

- As $r$ changes, the same action of "applying again and again" goes from a fixed point to short periods, and then forms dense long-run values in some parameter ranges.
- The period-doubling windows and dense bands of the bifurcation diagram match the cobweb orbit at the same $r$. The two pictures point to the same thing.
- Geometric iteration switches to maps of the plane, but the core is still "apply the rule to its own output". A fractal is the spatial version of iteration.

## Related

- [Logistic map bifurcation diagram](/en/works/logistic-bifurcation/)
- [Sierpinski triangle](/en/works/sierpinski-triangle/)
- [Iterated affine fractal](/en/works/affine-ifs-fractal/)
- [Julia set](/en/works/julia-set/)
- [Mandelbrot set and Julia set](/en/works/mandelbrot-map/)

## Further reading

- [Logistic map (Wikipedia)](https://en.wikipedia.org/wiki/Logistic_map)
- [Fractal (Wikipedia)](https://en.wikipedia.org/wiki/Fractal)
