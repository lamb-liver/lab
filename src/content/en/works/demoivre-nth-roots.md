---
title: "De Moivre's formula and nth roots"
description: Drag a complex number z and watch a power multiply the argument by n, or roots divide the circle into n equal parts.
tags:
  - Geometry
concepts:
  - complex-numbers
  - euler-formula
audience: High-school concept
prerequisites:
  - Complex numbers
  - Polar coordinates
date: 2026-09-22
order: 71
featured: false
draft: false
---

## Parametric equations

Write $z$ in polar form as $z=re^{i\theta}$. A power and a root then change only two things: the power of the modulus, and the multiple of the argument.

$$
\left(re^{i\theta}\right)^n=r^n e^{in\theta}
$$

This is De Moivre's formula. In the other direction, $w=re^{i\theta}$ has $n$ nth roots:

$$
\sqrt[n]{w}=r^{1/n}\exp\left(i\frac{\theta+2\pi k}{n}\right),\quad k=0,1,\ldots,n-1
$$

They lie on one circle, and neighboring arguments differ by $2\pi/n$. If $\theta$ is the principal argument of $w$, the root with $k=0$ is the principal root. When $w=0$ the only root is the origin, and the argument is undefined.

## Interaction

- **Power zⁿ** / **Roots**: switch between the chain of arrows $z,z^2,\ldots,z^n$ and the $n$ roots of $w$
- **Order n**: increase $n$, and watch the argument get multiplied and the roots divide the circle into finer equal parts
- Drag $z$, or the $w$ under the root, in the complex plane, and read how the modulus and the argument rewrite the result

## What to notice

- A power multiplies the argument by $n$ and raises the modulus to that power. When $|z|>1$ the arrows run outward. When $|z|<1$ they pull in toward the origin.
- When $w\neq 0$, the $n$ roots are equally spaced on the circle of radius $|w|^{1/n}$. Raising any one of them to the $n$th power returns $w$.
- This is the same fact as multiplying two complex numbers by adding their arguments. Raising $z$ to the $n$th power adds that same argument $n$ times.

## Related

- [Polar form of a complex number](/en/works/complex-polar-form/)
- [Geometric significance of complex arithmetic](/en/works/complex-arithmetic-geometry/)
- [Euler's formula, rotating](/en/works/euler-formula-rotation/)
- [Complex numbers and Euler's formula](/en/explore/complex-euler-formula/)

## Further reading

- [De Moivre's formula (Wikipedia)](https://en.wikipedia.org/wiki/De_Moivre%27s_formula)
- [nth root (Wikipedia)](https://en.wikipedia.org/wiki/Nth_root)
