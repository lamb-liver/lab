---
title: Julia set
description: Iterating z to z squared plus c on the complex plane draws a fractal boundary and its self-similar structure.
tags:
  - Dynamical systems
concepts:
  - fractal
  - dynamical-system
  - complex-numbers
audience: Intuitive exploration
date: 2026-05-26
order: 29
featured: true
draft: false
---

## Figure

For a fixed complex constant $c$, substitute each starting point $z_0$ into $f(z)=z^2+c$ again and again. Some of those orbits stay bounded forever. Others escape to infinity. The Julia set $J_c$ is the boundary between these two kinds of starting points. If $|z_n|>2$, the orbit must diverge. How fast it diverges is drawn as color bands, and the interior that does not diverge stays black. Changing $c$ can take the boundary from one connected branching shape to a cloud of separate points (Cantor dust).

$$
z_{n+1} = z_n^2 + c,\quad z_0 \in \mathbb{C}
$$

## Interaction

- **Parameter drift**: while this is on, $c$ moves slowly near the boundary of the Mandelbrot set, and the shape of the fractal boundary keeps changing
- **Manual c**: turn drift off, then set $c$ with **Real part Re(c)** and **Imaginary part Im(c)**. The boundary is recomputed
- **Maximum iterations**: raising the iteration cap refines the boundary, but the calculation is slower

## What to notice

- For a fixed $c$, the Julia set is the boundary between starting points that stay bounded and starting points that escape to infinity.
- When $|z_n|>2$, the iteration diverges, and how fast it diverges sets the color bands outside.
- As $c$ changes, the set can pass from a connected branching shape to a disconnected cloud of fractal points.

## Related

- [Euler's formula, rotating](/en/works/euler-formula-rotation/)
- [Sierpinski triangle](/works/sierpinski-triangle/)
- [Logistic map bifurcation diagram](/works/logistic-bifurcation/)

## Further reading

- [Julia set (Wikipedia)](https://en.wikipedia.org/wiki/Julia_set)
