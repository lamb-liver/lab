---
title: Geometric definition of the natural logarithm
description: Define ln t as the integral of 1/x from 1 to t, and e as the unique positive number with ln e = 1.
tags:
  - Functions and analysis
concepts:
  - exponential-logarithm
audience: High-school concept
date: 2026-05-26
order: 39
featured: false
draft: false
---

## Figure

The natural logarithm can be defined by $\displaystyle \ln t=\int_1^t \frac{1}{x}\,dx$. When $t>1$, this is the positive area bounded by the hyperbola $y=1/x$, the $x$-axis, $x=1$, and $x=t$. When $0<t<1$, it is a signed area. The number $e$ satisfies $\ln e=1$. It is the unique positive number that makes this integral equal to $1$. $\ln$ and $e^x$ are inverses of each other.

$$
\ln t = \int_1^t \frac{1}{x}\,dx,\quad t>0
$$

$$
e = \lim_{n\to\infty}\left(1+\frac{1}{n}\right)^n
$$

The derivative relation is $\dfrac{d}{dt}\ln t = \dfrac{1}{t}$.

## Interaction

- **Area**: drag **Endpoint t** and watch $\int_1^t 1/x\,dx$ fill in, with the value shown as it changes
- **e**: the vertical line marks $t=e\approx 2.71828$, where that area is $1$
- **Riemann rectangles**: turn on a subdivision of the same area, then move **Partitions n**. The idea is the one on the Riemann sums page
- **Inverse**: switch to the exponential curve and the logarithm as inverses, symmetric across $y=x$

## Related

- [Logarithmic scale](/en/works/logarithmic-scale/)
- [Exponential growth and decay](/en/works/exponential-growth-decay/)
- [Riemann sums](/en/works/riemann-sum/)

## Further reading

- [Natural logarithm (Wikipedia)](https://en.wikipedia.org/wiki/Natural_logarithm)
- [e (mathematical constant) (Wikipedia)](https://en.wikipedia.org/wiki/E_(mathematical_constant))
