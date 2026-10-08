---
title: Polar form of a complex number
description: Any nonzero complex number is written as z = re^(iθ), with modulus r and argument θ, linking rectangular and polar coordinates.
tags:
  - Geometry
concepts:
  - complex-numbers
  - euler-formula
audience: High-school concept
date: 2026-05-26
order: 27
featured: false
draft: false
---

## Figure

Any nonzero complex number can be written $z=re^{i\theta}$, where $r=|z|$ and $\theta=\mathrm{Arg}(z)$. Polar form separates scaling from rotation. That separation is the key to complex multiplication and to Euler's formula.

$$
z = re^{i\theta} = r\cos\theta + ir\sin\theta
$$

$$
x = r\cos\theta,\quad y = r\sin\theta,\quad
r = \sqrt{x^2+y^2},\quad \theta = \atan2(y,x)
$$

## Interaction

- **Modulus r**: drag the slider to change the length of the vector
- **Argument θ**: rotate the vector, and the real and imaginary projections update together with the arc of $\theta$

## What to notice

- $x=r\cos\theta$ and $y=r\sin\theta$ match rectangular coordinates with polar coordinates.
- The modulus $r$ is the distance from the origin, and the argument $\theta$ is the direction.
- The same $z$ can be read as the rectangular form $x+yi$ or the polar form $re^{i\theta}$.

## Related

- [Geometry of complex arithmetic](/en/works/complex-arithmetic-geometry/)
- [Euler's formula, rotating](/en/works/euler-formula-rotation/)

## Further reading

- [Polar coordinate system (Wikipedia)](https://en.wikipedia.org/wiki/Polar_coordinate_system)
- [Argument (complex analysis) (Wikipedia)](https://en.wikipedia.org/wiki/Argument_(complex_analysis))
