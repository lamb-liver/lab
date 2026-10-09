---
title: Fourier series
description: Add sines and cosines to approximate a periodic function, and change the number of terms N to watch convergence and the Gibbs phenomenon.
category: Analysis
audience: University concept
prerequisites:
  - Trigonometric functions
  - Series
concepts:
  - wave-superposition
  - sequences-series
  - trig-functions
  - parametric-curve
date: 2026-05-25
order: 1
coverImage: /explore/fourier-series-epicycles-cover.png
featured: false
draft: false
---

## Idea

A Fourier series splits a periodic function into a sum of sine and cosine waves of different frequencies. The low-frequency terms draw the rough outline, and the high-frequency terms fill in the detail. Many common functions with period $2\pi$ can be written this way:

$$
f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \bigl(a_n\cos(nx) + b_n\sin(nx)\bigr)
$$

The coefficients $a_n,b_n$ give the weight of each frequency in $f$. Adding only the first $N$ terms gives an approximation of $f$, and the larger $N$ is, the closer the fit.

## Interaction

- **Number of terms N**: use the slider to change how many terms are added, and watch the stacked circles approach a square wave or a 2D periodic orbit
- **1D square wave** / **2D orbit**: switch between the waveform and the path in the plane, and compare how the same harmonics look in the two views

Suggested order: a few harmonics → increase N and watch the fit → compare the oscillation at the discontinuous edges.

## What to notice

- A periodic path that is regular enough can be split into a sum of basic frequencies (circular motions).
- The smoother the function, the faster the coefficients decay, and the faster a finite-N approximation gets close to the target.
- At a discontinuity, adding terms still leaves the Gibbs overshoot, about 9% of the jump height.

## Related

- [Spirograph curve](/en/works/spirograph-curve/)

## Further reading

- [Fourier series (Wikipedia)](https://en.wikipedia.org/wiki/Fourier_series)
- [Gibbs phenomenon (Wikipedia)](https://en.wikipedia.org/wiki/Gibbs_phenomenon)
