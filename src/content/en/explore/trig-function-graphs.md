---
title: Trigonometric graphs and radians
description: Read a radian as arc length on the unit circle, unfold it into y = sin x, then set amplitude A, period T, and phase φ.
category: Analysis
audience: High-school concept
concepts:
  - trig-functions
date: 2026-06-20
order: 16
coverImage: /images/explore-covers/trig-function-graphs.png
featured: false
draft: false
---

## Idea

On the unit circle, the radian measure of an angle $\theta$ is the ratio of arc length to radius:

$$
\theta=\frac{s}{r}
$$

When the radius is $1$, $\theta$ is the arc length. The point $P(\theta)=(\cos\theta,\sin\theta)$ has height $\sin\theta$. Unfolding that height along the horizontal axis by arc length gives the periodic graph $y=\sin x$.

A general sinusoid

$$
y=A\sin\!\left(\frac{2\pi}{T}(x-\phi)\right)+k
$$

then stretches and shifts that graph. The amplitude is $|A|$, and $A<0$ flips the graph. $T$ sets how often the wave repeats, and $\phi$ sets where it starts.

## Interaction

- **Radians**: drag **Angle θ** and read the arc length $s$, the radian measure, and the degree equivalent together
- **Unfold**: drag **Angle θ** and watch the height of $P$ on the unit circle unfold along the x-axis into $y=\sin x$. **Show cos x: on** draws $y=\cos x$ beside it
- **Parameters**: drag **Amplitude A**, **Period T**, **Phase φ**, and **Shift k**, and watch the graph stretch, flip, and move relative to the base sine wave

Suggested order: Radians, then Unfold, then Parameters.

## What to notice

- A radian puts the angle and the arc length in one unit. On the unfolded graph the distance along the x-axis is that radian measure, so the period $2\pi$ shows up on its own.
- $\sin x$ and $\cos x$ are two readings of the same point on the circle. The height unfolds into sine, the horizontal coordinate unfolds into cosine, and the two differ in phase by $\pi/2$.
- After the unfold, amplitude and period stretch that graph, and phase sets where it starts. A coordinate on the circle has become a graph you can change.

## Related

- [Radians and arc length](/en/works/radian-arc-length/)
- [Amplitude, period, and phase of a sinusoid](/en/works/sinusoid-amplitude-period-phase/)
- [Function graph transformations](/en/works/function-graph-transform/)

## Further reading

- [Radian (Wikipedia)](https://en.wikipedia.org/wiki/Radian)
- [Sine wave (Wikipedia)](https://en.wikipedia.org/wiki/Sine_wave)
- [Trigonometric functions (Wikipedia)](https://en.wikipedia.org/wiki/Trigonometric_functions)
