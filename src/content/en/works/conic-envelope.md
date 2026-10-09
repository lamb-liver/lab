---
title: Conic envelope
description: A family of lines sliding on the two axes weaves a parabolic envelope in all four quadrants.
tags:
  - Geometry
concepts:
  - conic-sections
audience: Intuitive exploration
date: 2026-05-25
order: 12
featured: false
draft: false
---

## Parametric equations

Each line joins an intercept on the horizontal axis to an intercept on the vertical axis, and the same line is copied into all four quadrants. The figure draws those lines, not a separate outline. The parabolic boundary is the envelope you read off the lines.

$$
\frac{x}{x_A} + \frac{y}{y_B} = 1
$$

- $x_A = (L/2) \cdot t \cdot \text{ratio}$, the horizontal intercept
- $y_B = (L/2) \cdot (1 - t)$, the vertical intercept
- $t \in [0, 1]$ steps through the family, and ratio is the horizontal stretch

When the lines are dense, that boundary is

$$
\sqrt{\frac{x}{\text{ratio}}} + \sqrt{y} = C
$$

## Interaction

- **Line density**: add or remove lines in the family, and watch how sharp the woven boundary looks
- **Deformation ratio**: change the intercept ratio; the envelope changes shape smoothly
- **Time speed ω**: pulse the whole family so both intercepts swell and shrink together and the outline rises and falls

## What to notice

- The envelope of this family is a parabolic outline in each quadrant.
- Changing the intercept ratio deforms that outline smoothly rather than jumping.
- At each moment one line of the family touches the envelope at a single point. You see that from the lines themselves; no extra curve is drawn.

## Related

- [Focus locus](/en/works/conic-focus-locus/)
- [Parabolic reflection](/en/works/parabolic-reflection/)

## Further reading

- [Envelope (mathematics) (Wikipedia)](https://en.wikipedia.org/wiki/Envelope_(mathematics))
