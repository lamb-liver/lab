---
title: Basel problem
description: Partial sums, stacked areas, and a sine product picture the sum of reciprocal squares, equal to pi squared over 6.
audience: University concept
prerequisites:
  - Infinite series
  - Trigonometric functions
tags:
  - Functions and analysis
concepts:
  - sequences-series
  - trig-functions
date: 2026-05-26
order: 11
featured: false
draft: false
---

## Figure

The Basel problem asks for $\displaystyle\sum_{n=1}^{\infty}\frac{1}{n^2}$. Euler proved that the sum is $\dfrac{\pi^2}{6}$. An infinite product for $\sin x$, or a split into areas, is one way to tie that series to the square of $\pi$.

$$
\zeta(2)=\sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6}
$$

The partial sum $S_N=\displaystyle\sum_{n=1}^{N}\frac{1}{n^2}$ increases and approaches $\dfrac{\pi^2}{6}$.

## Interaction

- **Number of terms N**: add terms from a few toward many, and watch the partial sum approach $\pi^2/6$
- **Exponent p**: move to a $p$-series, and compare divergence for $p\le 1$ with convergence for $p>1$
- **Partial sum** / **Area**: switch between a running polyline and stacked areas
- **Compare**: place the harmonic series, the Basel series, and a geometric series in one frame, each scaled to its own range
- **Euler**: factors sit on a circle, and the picture writes the sine product whose $x^2$ coefficient this page identifies with $\sum 1/n^2=\pi^2/6$
- **p-series**: when $p\le 1$ the frame marks a divergent region; when $p>1$ the partial sum approaches a finite value
- **Zeros**: the zeros of $\sin(x)/x$ at $\pm n\pi$, with the partial sum set beside $\pi^2/6$
- **Pause** / **Play**: stop or resume the reveal
- **Replay**: run the reveal again from the start

## What to notice

- In partial-sum mode the polyline climbs toward $\pi^2/6$, and the error falls as $N$ grows.
- Compare mode draws the harmonic series, the Basel series, and a geometric series in one frame, each on its own scale. How fast they settle shows up in the shape of the curve.
- In p-series mode, $p\le 1$ marks a divergent region, and $p>1$ sends the partial sum toward a finite value.

## Related

- [Arithmetic and geometric sequences](/en/works/arithmetic-geometric-sequences/)
- [Fibonacci spiral](/en/works/fibonacci-spiral/)
- [Riemann sum](/en/works/riemann-sum/)

## Further reading

- [Basel problem (Wikipedia)](https://en.wikipedia.org/wiki/Basel_problem)
