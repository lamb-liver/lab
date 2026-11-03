---
title: Stereographic projection
description: From the north pole, a point on the sphere projects along a straight line onto the equatorial plane.
tags:
  - Geometry
concepts:
  - complex-numbers
audience: University concept
prerequisites:
  - Complex numbers
date: 2026-11-04
order: 82
featured: false
draft: false
---

## Parametric equations

The north pole of the unit sphere is $(0,0,1)$. A point on the sphere is fixed by its angle $\theta$ from the north pole and its angle $\varphi$ around the axis. $\theta$ runs from $36^\circ$ to $180^\circ$, and $\varphi$ runs from $0^\circ$ to $360^\circ$.

Follow the straight line from the north pole to the equatorial plane $z=0$. The landing point lies at distance $\cot(\theta/2)$ from the origin, in the direction $\varphi$. The equator stays on the unit circle, and the south pole lands at the origin.

$$
r=\cot\frac{\theta}{2}
$$

## Interaction

- **Angle from the pole θ**: change how far the point sits from the north pole; the landing point on the plane updates with it
- **Azimuth φ**: change the angle around the axis; the direction of the landing point updates with it

## What to notice

- A point on the equator stays on the unit circle.
- The closer the point sits to the north pole, the farther its image lies from the origin.
- The south pole lands at the origin.

## Related

- [Polar form of a complex number](/en/works/complex-polar-form/)
- [Geometric significance of complex arithmetic](/en/works/complex-arithmetic-geometry/)

## Further reading

- [Stereographic projection (Wikipedia)](https://en.wikipedia.org/wiki/Stereographic_projection)
