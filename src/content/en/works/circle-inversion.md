---
title: Circle inversion
description: Invert a line and a circle in a fixed circle, and see whether each image is a circle or a line.
tags:
  - Geometry
concepts:
  - inversion
audience: High-school concept
prerequisites:
  - Circles
date: 2026-09-30
order: 73
featured: false
draft: false
---

## Figure

Take the circle centered at the origin with radius $R$ as the circle of inversion. A point $P$ other than the origin goes to $P'$ on the ray $OP$ so that the two distances multiply to $R^2$. The origin has no image. Inverting twice returns the original point. A point on the circle of inversion stays where it is.

$$
P'=\frac{R^2}{|P|^2}P
$$

The image of a line or a circle is still a line or a circle. A line that misses the center becomes a circle through the center. A line through the center stays that same line. A circle through the center becomes a line that misses the center. A circle that misses the center stays a circle. When the two points that determine the line coincide, that line is undefined.

## Interaction

- Drag the two points on the gold line. The white image switches between a circle through the center and the same line.
- Drag the center of the gold circle, or the point on its circumference, to change the radius, and see whether the white image is a circle or a line.
- **Inversion radius R**: move the slider to change $R$; both images change together. The paler white circle is the circle of inversion
- **Reset**: put the line, the circle, and $R$ back at the start

## What to notice

- A point on the circle of inversion stays where it is, so if the original circle meets the circle of inversion, those intersection points lie on the image too.
- When the line misses the center, the image is a circle through the center. When the line passes through the center, the image is still that line.
- When the circle passes through the center, the image is a line. When the circle misses the center, the image is still a circle.

## Related

- [Radians and arc length](/en/works/radian-arc-length/)
- [A triangle on the disk](/en/works/poincare-triangle/)

## Further reading

- [Inversive geometry (Wikipedia)](https://en.wikipedia.org/wiki/Inversive_geometry)
