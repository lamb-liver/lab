---
title: Shortest path on a lampshade
description: "2023 AMC 12B, Problem #21 unfolds the shade into a half-annulus, where the straight line leaves the paper and the shortest path is a tangent plus an inner arc."
subject: AMC 12B
year: 2023
questionType: 單選
questionNo: '21'
unit: AMC 12, solid geometry and nets
topics:
  - Lateral net of a frustum
  - Arc length of a sector
  - Tangents and shortest paths
concepts:
  - trig-functions
  - law-of-sines-cosines
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2023_AMC_12B_Problems/Problem_21
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - radian-arc-length
  - law-of-sines-cosines
date: 2026-09-25
order: 15
coverImage: /images/exam-covers/amc12b-2023-21-lampshade-shortest-path.png
featured: false
draft: false
---

## Problem

The lampshade is the lateral surface of a right circular frustum, with no top or bottom disk. The height is $3\sqrt3$, the upper diameter is 6, and the lower diameter is 12. A bug sits at one point of the lower rim, and the honey is at the point of the upper rim farthest from the bug. The bug can crawl only on the surface. How long is the shortest path? There are five choices.

The full problem and the choices are on the [AoPS problem page](https://artofproblemsolving.com/wiki/index.php/2023_AMC_12B_Problems/Problem_21).

## Where it goes wrong

The usual first try cuts the lateral surface open, lays it flat, and joins the bug to the honey by a straight line. That length is $6\sqrt5$, and it is also one of the choices. The net is a half-annulus of inner radius 6 and outer radius 12. The nearest point of that line is only $12/\sqrt5\approx5.37$ from the apex, which is less than 6, so the line crosses the missing cone tip inside the inner circle. That region is not the shade. A line that is not on the paper cannot be a path.

Another trap is to treat "opposite, half a turn, in space" as $180^\circ$ on the net. The sector angle is only $\pi$, so half a turn in space is only $\pi/2$ on the net.

## Idea

The slant height is $\sqrt{(6-3)^2+(3\sqrt3)^2}=6$. Complete the frustum to a cone. The apex is then 6 from the upper rim and 12 from the lower rim (the upper and lower radii are in the ratio $3:6$). The lateral surface unfolds to an annular sector of angle

$$
\theta=\frac{2\pi\cdot 6}{12}=\pi,
$$

a half-annulus of inner radius 6 and outer radius 12. The bug is on the outer rim and the honey on the inner rim, and the angle between them on the net is $\pi/2$.

The straight-line length, from the cosine law, is $\sqrt{12^2+6^2}=6\sqrt5$. Its nearest distance to the apex is $\dfrac{12\cdot 6}{6\sqrt5}=\dfrac{12}{\sqrt5}<6$, so it leaves the paper.

A legal shortest path goes in a straight line from the bug to the point where the line is tangent to the inner rim, then along the inner arc to the honey. The tangent length is $\sqrt{12^2-6^2}=6\sqrt3$. The angle $a$ between that point and the bug satisfies $\cos a=\frac{6}{12}$, so $a=\frac{\pi}{3}$. The remaining arc is $\frac{\pi}{2}-\frac{\pi}{3}=\frac{\pi}{6}$, and its length is $6\cdot\frac{\pi}{6}=\pi$.

$$
L=6\sqrt3+\pi\approx13.534,
$$

which is choice (E).

## What the figure shows

- Press **Play unroll**. The shade is cut and flattens into a half-annulus. Every intermediate state is the same sheet, so the path length does not change. The upper view turns with **Horizontal view** and **Elevation**.
- On the net below, drag the gold handle, or move **Contact angle a (from the bug)**. At $a=90^\circ$ the path is the straight line, and **Straight line (6√5)** jumps there. The red dashed piece shows that it falls inside radius 6. On the solid, that same piece floats above the upper rim.
- Pull $a$ down from $90^\circ$. Below $60^\circ$ the path is back on the paper. At $a=60^\circ$ the line is tangent to the inner rim, and **Tangent + inner arc (6√3+π)** jumps there. The readout stops at $6\sqrt3+\pi\approx13.5339$. Pulling further only makes the path longer.
