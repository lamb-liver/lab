---
title: Focus locus
description: A point travels on an ellipse, with a segment drawn from it to each focus.
tags:
  - Geometry
concepts:
  - conic-sections
audience: Intuitive exploration
date: 2026-05-25
order: 15
featured: false
draft: false
---

## Parametric equations

A point $P$ travels on an ellipse. A segment is drawn from $P$ to each focus $F_1$ and $F_2$. The sum of those two distances is the constant $2a$; the figure does not print that number.

$$
x = a\cos t,\quad y = b\sin t
$$

- $a$ is the semi-major axis. The eccentricity slider $e$ runs from $0.1$ to $0.95$, so the curve stays an ellipse and never becomes a circle or a parabola
- $b = \sqrt{a^2 - c^2}$ and $c = a \cdot e$ is the distance from the center to each focus

## Interaction

- **Semi-major axis a**: change the size of the ellipse; $P$ still travels on it, with $PF_1 + PF_2 = 2a$
- **Eccentricity e**: flatten the ellipse. The foci move apart as $c = ae$
- **Orbit speed ω**: change how fast $P$ travels around the ellipse

## What to notice

- The two segments are the distances from a point on the ellipse to the two foci, and their sum is $2a$.
- A larger $e$ makes the ellipse flatter and moves the foci toward the ends of the major axis.
- The foci and the orbit together are this ellipse. The slider never reaches a circle.

## Related

- [Conic envelope](/en/works/conic-envelope/)
- [Parabolic reflection](/en/works/parabolic-reflection/)
- [Conics by eccentricity](/en/explore/conic-dynamic-geometry/)

## Further reading

- [Focus (geometry) (Wikipedia)](https://en.wikipedia.org/wiki/Focus_(geometry))
