---
title: Law of sines and law of cosines
description: Drag the vertices of a triangle, switch between the law of sines and the law of cosines, and check the side-angle relations and the circumradius.
tags:
  - Geometry
concepts:
  - law-of-sines-cosines
  - trig-functions
audience: High-school concept
date: 2026-06-10
order: 46
featured: false
draft: false
---

## Figure

In any triangle the sides $a,b,c$ are opposite the angles $A,B,C$. The law of sines says

$$
\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}=2R
$$

where $R$ is the circumradius. The law of cosines says

$$
c^2 = a^2 + b^2 - 2ab\cos C
$$

When $C=90^\circ$, this reduces to the Pythagorean theorem $c^2=a^2+b^2$.

## Interaction

- **Law of sines**: show the circumcircle and $2R$, and check that $a/\sin A$, $b/\sin B$, and $c/\sin C$ are equal
- **Law of cosines**: highlight the included angle $C$ and the three sides, and compare $a^2+b^2-2ab\cos C$ with $c^2$
- **Guides: on**: show or hide the altitude, the foot of the perpendicular, and the circumcircle, and compare the figure with and without those guides
- Drag a vertex to change the triangle. The three side lengths and the three angles update at once. Make $C$ obtuse and watch $\cos C<0$.

## What to notice

- The law of sines ties each side to the sine of the opposite angle by one common ratio. The circumradius $R$ is the geometric quantity in that ratio, and the common value is $2R$.
- The law of cosines is the Pythagorean theorem plus a correction for the included angle. At a right angle, $\cos C=0$, and the formula returns to $c^2=a^2+b^2$.
- Given two angles and one side, three sides, or two sides and the included angle, the law of sines or the law of cosines gives the remaining unknowns.

## Related

- [Unit circle and trigonometric definitions](/en/works/unit-circle-trig-definition/)
- [Trigonometric identities and angle sums](/en/works/trig-angle-identities/)
- [Geometric definitions and trigonometric identities](/en/explore/trigonometry-fundamentals/)

## Further reading

- [Law of sines (Wikipedia)](https://en.wikipedia.org/wiki/Law_of_sines)
- [Law of cosines (Wikipedia)](https://en.wikipedia.org/wiki/Law_of_cosines)
