---
title: Harmonograph
description: A damped harmonograph traces x = A sin(at + δ) e^(-dt), y = B sin(bt) e^(-dt), and frequency, phase, and damping set how the orbit closes in.
tags:
  - Geometry
concepts:
  - parametric-curve
  - wave-superposition
audience: High-school concept
date: 2026-05-25
order: 3
featured: false
draft: false
---

## Parametric equations

A harmonograph has the damped form

$$
x = A \sin(at + \delta)e^{-dt},\quad
y = B \sin(bt)e^{-dt}
$$

- **A** and **B** are the amplitudes on x and y. This figure uses the same amplitude for both.
- **a** and **b** are the frequency parameters.
- **δ** is the phase difference. It sets where the orbit starts and how symmetric it is.
- **d** is the damping. It sets how fast the curve decays inward.

## Interaction

- **Frequency a**: switch the integer frequency. The orbit updates at once and the trace grows in again
- **Frequency b**: switch the integer frequency. The ratio a:b is these two controls
- **Phase δ**: move the starting phase and watch the orbit twist
- **Damping d**: a larger d pulls the orbit into the center faster

## What to notice

- The factor $e^{-dt}$ shrinks the amplitude as t grows when d > 0, so the orbit spirals inward.
- Different pairs of a:b and $\delta$ draw patterns that do not repeat one another.
- After a long trace, the places where the orbit packs together are the dense parts of the pattern.

## Related

- [Lissajous curve](/en/works/lissajous-curve/)
- [Spirograph curve](/en/works/spirograph-curve/)

## Further reading

- [Harmonograph (Wikipedia)](https://en.wikipedia.org/wiki/Harmonograph)
