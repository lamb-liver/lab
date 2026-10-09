---
title: Powers and roots
description: The same addition of arguments shows up in a product, in an nth power, and in n equal roots.
category: Algebra
concepts:
  - complex-numbers
  - euler-formula
audience: High-school concept
prerequisites:
  - Complex numbers
  - Polar coordinates
date: 2026-09-22
order: 22
coverImage: /images/explore-covers/complex-powers-roots.png
featured: false
draft: false
---

## Idea

Multiplying complex numbers adds the arguments of the two arrows and multiplies the moduli. Doing "multiply by the same $z$" $n$ times adds the argument $n$ times. That is a power. Reversing it divides the circle into $n$ equal roots.

$$
z_1 z_2 \;\longleftrightarrow\; \bigl(re^{i\theta}\bigr)^n \;\longleftrightarrow\; \sqrt[n]{w}
$$

This page does not explain polar form or Euler's formula again. It lets the same argument rule change roles across three operations: multiply by another number, multiply by itself, and take a root. The separate formulas, and the details of dragging a point, are left to the works below.

## Interaction

- **Multiplication**: drag $z_1$ and $z_2$, and check that the product's argument is the sum of the two arguments
- **Power**: switch to $z,z^2,\ldots,z^n$ for one $z$, and compare that with the argument multiplied by $n$
- **Roots**: watch the $n$ roots divide the circle into equal parts. Raising any one of them to the $n$th power returns the original $w$
- **Order n**: shown only for a power or for roots. Changing $n$ makes the equal division finer and makes the power turn more sharply

Suggested order: multiplication, then a power, then roots.

## What to notice

- All three readings do one thing: add arguments and multiply moduli. The difference is whether you add the other number's argument, or add your own argument $n$ times.
- A power applies that same rule $n$ times, and the point moves radially from the origin. A root is the reverse: one rotation is split into $n$ equal parts.
- Multiplication, a power, and a root can be run back. Take a root and raise it again, and you return to the start. The three pictures read the same argument rule forward and back.

## Related

- [De Moivre's formula and nth roots](/en/works/demoivre-nth-roots/)
- [Geometric significance of complex arithmetic](/en/works/complex-arithmetic-geometry/)
- [Polar form of a complex number](/en/works/complex-polar-form/)
- [Euler's formula, rotating](/en/works/euler-formula-rotation/)
- [Complex numbers and Euler's formula](/en/explore/complex-euler-formula/)

## Further reading

- [De Moivre's formula (Wikipedia)](https://en.wikipedia.org/wiki/De_Moivre%27s_formula)
- [nth root (Wikipedia)](https://en.wikipedia.org/wiki/Nth_root)
