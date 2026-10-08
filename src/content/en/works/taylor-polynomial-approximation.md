---
title: Taylor polynomial approximation
description: Change the degree n and the center a, and watch the Taylor polynomial fit sin x, cos x, and e^x locally.
tags:
  - Functions and analysis
concepts:
  - taylor-approximation
  - derivative-tangent
  - polynomial
audience: University concept
prerequisites:
  - Derivatives
  - Polynomials
date: 2026-06-11
order: 55
featured: false
draft: false
---

## Parametric equations

The degree-$n$ Taylor polynomial of a function $f$ at $x=a$:

$$
T_n(x)=\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^k
$$

Near $x=a$, $T_n$ matches $f$ in value and in the first $n$ derivatives. This page uses $\sin x$, $\cos x$, and $e^x$. The classical expansions ($a=0$):

$$
\sin x = x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots,\quad
e^x = 1+x+\frac{x^2}{2!}+\cdots,\quad
\cos x = 1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots
$$

Farther from the center, the higher-degree terms matter more. A finite $T_n$ is only a polynomial approximation. It does not equal $f$ along the whole real line.

## Interaction

- **sin x** / **cos x** / **e^x**: switch the function and watch how its coefficients are arranged
- **Center a**: drag the center on the figure and watch the best-fit region move with it
- **Degree n**: raise $n$ and watch $T_n$ settle onto the faint graph of the original function
- **Error band**: show the gap $|f(x)-T_n(x)|$, close near the center and wide farther away
- **Terms**: turn on **Advanced**, then lay out each term $\dfrac{f^{(k)}(a)}{k!}(x-a)^k$ and see which degree starts to drive the correction

## What to notice

- The Taylor polynomial is most accurate near $x=a$. Farther from the center, the error at a finite degree usually grows.
- For $\sin x$ and $\cos x$, odd and even powers separate only when $a=0$. After the center leaves $0$, the other kind of term mixes in. Every derivative of $e^x$ is $e^x$, so the coefficients decrease in the most regular way.
- Raising $n$ improves the local fit, but it does not guarantee that the approximation gets steadily more accurate across the whole window, because a high-degree term can dominate far from the center.

## Related

- [Tangent approximation](/en/works/tangent-approximation/)
- [Fourier series](/en/explore/fourier-series/)
- [Limits and Riemann sums](/en/explore/limits-riemann-sum/)
- [Sequences and series](/en/explore/sequences-and-series/)

## Further reading

- [Taylor series (Wikipedia)](https://en.wikipedia.org/wiki/Taylor_series)
- [Taylor's theorem (Wikipedia)](https://en.wikipedia.org/wiki/Taylor%27s_theorem)
