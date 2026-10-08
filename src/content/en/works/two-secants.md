---
title: Two secants
description: From one point outside a circle, each secant's external part times the whole secant is the same number.
tags:
  - Geometry
concepts:
  - circle-power
audience: High-school concept
prerequisites:
  - Circles
date: 2026-10-07
order: 77
featured: false
draft: false
---

## Parametric equations

The unit circle. The point $P=(p,0)$ lies outside it, and $p$ runs from $1.35$ to $2.4$. The horizontal line passes through the center and meets the circle at $A=(1,0)$ and $B=(-1,0)$. It is a secant. The theorem does not need a diameter; the line passes through the center only to fix those two intersections.

The other line leaves $P$ toward the upper left. The angle $\theta$ is measured upward from the negative $x$-axis. It is at least $8^\circ$ and at most $\arcsin(0.92/p)$. The factor $0.92$ is a margin, not a constant from the theorem: the line's distance from the center stops there, short of the radius $1$, so the two intersections separate before they would meet at a point of tangency. At $p=2.4$ that upper bound is about $22.5^\circ$, and the default $18^\circ$ still fits. $C$ is the intersection nearer $P$, and $D$ is the farther one. Those labels do not swap.

$P$ stays outside the circle, and the lengths are unsigned. This page does not use directed distances. On each secant the nearer length is the external part, and the farther length is the whole secant measured from $P$, not the chord inside the circle. The horizontal product is $|PA|\cdot|PB|=(p-1)(p+1)$. The slanted product is $|PC|\cdot|PD|$. Both sides measure the unrounded lengths from the intersection coordinates, then multiply. The two readouts are not filled in from the identity. The product is the power of the point, $p^2-1=|OP|^2-r^2$. The two products being equal is the intersecting secants theorem. Values are shown to three decimal places, rounded half up. At $p=1.35$, $p^2-1=0.8225$, shown as $0.823$.

## Interaction

- **Position $p$**: move the exterior point; both pairs of lengths and both products change together
- **Angle**: move the angle of the second line; the near and far lengths change

## What to notice

- Each external part times its whole secant is the same number.
- As the angle grows, the intersections move closer, and the product stays this number.
- The number changes only when the point moves.

## Related

- [Tangent and a secant](/en/works/tangent-secant/)
- [Secants and tangents](/en/explore/secants-and-tangents/)

## Further reading

- [Power of a point (Wikipedia)](https://en.wikipedia.org/wiki/Power_of_a_point)
