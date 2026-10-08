---
title: Phase portrait
description: Two rotating phasors join head to tail, and their sum traces how harmonic waves superpose as amplitude, frequency ratio, and phase difference change.
tags:
  - Geometry
concepts:
  - complex-numbers
audience: University concept
prerequisites:
  - Complex numbers
  - Trigonometric functions
date: 2026-05-26
order: 25
featured: false
draft: false
---

## Figure

A phase portrait writes the superposition of waves as rotating vectors on the complex plane. Each harmonic wave is a vector centered at the origin, turning counterclockwise at constant angular speed. When two waves meet, the combined displacement is their vector sum, with the two vectors joined head to tail.

$$
\vec{R}(t) = \vec{P}_A(t) + \vec{P}_B(t)
$$

$$
x(t) = A\cos(\omega_A t) + B\cos(\omega_B t + \delta),\quad
y(t) = A\sin(\omega_A t) + B\sin(\omega_B t + \delta)
$$

- **A** and **B** are the lengths of the two rotating vectors, so they set each component's amplitude. In this figure $\omega_A=1$, and the second amplitude is fixed at $B=0.8$.
- **ω_A** and **ω_B** are the angular speeds, the frequencies. When $\omega_A:\omega_B$ is an integer ratio, for example $1:3$, the endpoint often traces a closed, symmetric curve.
- **δ** is the initial phase difference of the two vectors. Changing $\delta$ twists the combined curve continuously and does not change the frequency ratio.

## Interaction

- **Amplitude A**: drag the slider to change the length of the first rotating vector. The combined trace scales with it, and the view follows the largest radius $A+B$
- **Frequency B**: switch the integer $\omega_B$ and watch the endpoint trace change from a simple closed figure to a more knotted one
- **Phase δ**: change the initial phase difference continuously and watch the combined curve twist and its symmetry shift

## What to notice

- A harmonic wave can be read as a vector rotating at constant angular speed on the complex plane. Superposition is vector addition, the same diagonal as the parallelogram.
- When $\omega_A:\omega_B$ is a simple integer ratio, the endpoint trace closes more readily. The phase $\delta$ mainly changes how rotated the figure looks.
- The faint history marks the recent stretch of the combined path. The vector chain at the current time shows both components and the combined endpoint together.

## Related

- [Lissajous curve](/en/works/lissajous-curve/)
- [Euler's formula, rotating](/en/works/euler-formula-rotation/)
- [Geometry of complex arithmetic](/en/works/complex-arithmetic-geometry/)
- [Superposition of trigonometric functions and wave interference](/en/explore/trig-wave-interference/)

## Further reading

- [Phasor (Wikipedia)](https://en.wikipedia.org/wiki/Phasor)
