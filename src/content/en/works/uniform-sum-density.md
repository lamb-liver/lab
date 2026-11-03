---
title: Density of the sum
description: Two independent uniform lengths add into a density that falls to zero at both ends and stays flat in the middle.
tags:
  - Probability and statistics
concepts:
  - probability-distribution
audience: University concept
prerequisites:
  - Probability distributions
date: 2026-11-04
order: 81
featured: false
draft: false
---

## Parametric equations

Each length is uniform on its own interval, and the two are independent. The first runs over $[0,a]$ and the second over $[0,b]$. Both $a$ and $b$ run from 0.6 to 2.4.

Add them. The density at a sum $z$ is the length of the overlap between $[0,a]$ and $[z-b,z]$, divided by $ab$. The density rises until the shorter length, stays at height $1/\max(a,b)$, and falls back to zero at $a+b$. The flat top has width $|a-b|$.

$$
\max f=\frac{1}{\max(a,b)}
$$

## Interaction

- **Length a**: change the first length; the base and the flat top of the density update together
- **Length b**: change the second length; the base and the flat top of the density update together

## What to notice

- The sums fill an interval whose length is the two lengths added.
- The highest density equals the reciprocal of the longer length.
- When the two lengths match, the flat top shrinks to a point and the density is a triangle.

## Related

- [Binomial and geometric distributions](/en/works/binomial-geometric-distribution/)
- [Binomial distribution to the normal distribution](/en/works/binomial-to-normal/)

## Further reading

- [Trapezoidal distribution (Wikipedia)](https://en.wikipedia.org/wiki/Trapezoidal_distribution)
