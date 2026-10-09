---
title: Spirograph curve
description: A hypotrochoid is the path of a pen on a circle rolling inside a fixed circle; R and r set the corners, and d sets how sharp they are.
audience: Intuitive exploration
tags:
  - Geometry
concepts:
  - parametric-curve
date: 2026-05-25
order: 4
featured: true
draft: false
---

## Parametric equations

This spirograph curve is a hypotrochoid, the path of a small circle rolling inside a fixed circle:

$$
x = (R-r)\cos t + d\cos\!\left(\frac{R-r}{r}t\right),\quad
y = (R-r)\sin t - d\sin\!\left(\frac{R-r}{r}t\right)
$$

- **R** is the radius of the fixed circle, the large circle.
- **r** is the radius of the rolling circle, the small circle.
- **d** is the distance from the pen to the center of the rolling circle.

## Interaction

- **Large circle R**: change the fixed radius. Switching R or r changes the corner structure, and the curve grows in again
- **Small circle r**: change the rolling radius. The corner structure follows R and r
- **Pen d**: change how far the pen sits from the center of the small circle. The sharpness and the crossings change continuously

## What to notice

- How long the orbit takes to close depends on $\gcd(R,r)$. A coprime ratio makes a richer pattern.
- When $d$ is near $r$, sharp points appear. A smaller $d$ keeps the curve more inward.
- A hypotrochoid is the curve drawn by a circle rolling inside a fixed circle.

## Related

- [Rose curve](/en/works/rose-curve/)
- [Lissajous curve](/en/works/lissajous-curve/)
- [Fourier series](/en/explore/fourier-series/)

## Further reading

- [Hypotrochoid (Wikipedia)](https://en.wikipedia.org/wiki/Hypotrochoid)
