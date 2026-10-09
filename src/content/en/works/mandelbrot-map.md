---
title: Mandelbrot set and Julia set
description: Pick c on the Mandelbrot set and the corner draws the corresponding Julia set.
tags:
  - Fractal
  - Dynamical systems
concepts:
  - fractal
  - dynamical-system
audience: University concept
prerequisites:
  - Complex numbers
  - Iteration
date: 2026-09-30
order: 72
featured: false
draft: false
---

## Figure

The Mandelbrot set collects the parameter $c$, not a point on an orbit. Start from $z_0=0$ and repeat $z\mapsto z^2+c$. The values of $c$ that do not escape to infinity make up the Mandelbrot set. Fix that same $c$ and scan different starting points instead. The boundary between the ones that do not escape and the ones that do is the Julia set.

$$
z_{n+1}=z_n^2+c,\quad z_0=0
$$

After $|z_n|>2$, the orbit must diverge. Any point that has not passed this threshold within the iteration cap stays black. Black is an approximation from finitely many iterations, not the set itself.

## Interaction

- **Real part Re(c)**: drag on the main figure, or move the slider, and the Julia set in the corner switches to this $c$
- **Imaginary part Im(c)**: drag on the main figure the same way, or move the slider for the imaginary part
- **Maximum iterations**: raise the iteration cap and the boundaries in both pictures get finer together
- The corner inset shows only the current $c$. Do not drag on the inset

## What to notice

- One $c$ on the main figure corresponds to the whole Julia set in the corner. The main figure shows how fast the parameter escapes. The inset shows how fast a starting point escapes.
- When $c$ is in the Mandelbrot set the Julia set is connected, and when it is not the Julia set is disconnected. Black on the picture only means the point has not escaped by the iteration cap.
- An orbit with $|z_n|>2$ must diverge. Both pictures draw how fast that happens as color bands.

## Related

- [Julia set](/en/works/julia-set/)
- [Iteration dynamics: from convergence to fractals](/en/explore/iteration-dynamics/)
- [Sierpinski triangle](/en/works/sierpinski-triangle/)
- [Logistic map bifurcation diagram](/en/works/logistic-bifurcation/)

## Further reading

- [Mandelbrot set (Wikipedia)](https://en.wikipedia.org/wiki/Mandelbrot_set)
- [Julia set (Wikipedia)](https://en.wikipedia.org/wiki/Julia_set)
