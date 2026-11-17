---
title: Three pyramids add to probability 1/4
description: "2025 AMC 12A #22: one pyramid in the unit cube has volume 1/12; the three of them together have probability 1/4."
subject: AMC 12A
year: 2025
questionType: 單選
questionNo: '22'
unit: AMC 12, geometric probability
topics:
  - Geometric probability
  - Volume of a pyramid
concepts:
  - classical-probability
  - space-vectors
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2025_AMC_12A_Problems/Problem_22
relatedExplore:
  - probability-statistics
  - space-vectors-planes-lines
relatedWorks:
  - space-vector-three-plane-projection
date: 2026-11-17
order: 39
coverImage: /images/exam-covers/amc12a-2025-22-cube-pyramids.png
featured: false
draft: false
---

## Problem

Three real numbers are chosen independently and uniformly from $[0,1]$. What is the probability that the greatest is greater than twice each of the other two? Ordered as $a\ge b\ge c$, the condition is $a>2b$. There are five choices.

The full problem and the choices are on the [AoPS problem page](https://artofproblemsolving.com/wiki/index.php/2025_AMC_12A_Problems/Problem_22).

## Where it goes wrong

- Stop after the region where $x$ is the greatest. Its volume is $\frac{1}{12}$. The same pyramid exists when $y$ is greatest and when $z$ is greatest. The three meet on a set of volume $0$, so the probability is $3\times\frac{1}{12}=\frac14$. $\frac{1}{12}$ is choice (A).
- Treat the other two numbers as uniform on $\left[0,\frac12\right]$, independent of which one is largest. That produces $\frac18$. The upper bound is half the greatest number, and all three pyramids count.
- A square base does not make this a right square pyramid, and the volume formula does not need the foot of the altitude at the center. The apex is the origin, so that foot is a corner of the base. The volume is still $\frac13$ times base area times height.

## Idea

The triple is a point $(x,y,z)$ in the unit cube, uniformly, so the probability is the volume of the region.

$x$ strictly greatest and $x>2y$, $x>2z$ is

$$
0\le x\le 1,\qquad 0\le y<\frac x2,\qquad 0\le z<\frac x2.
$$

The slice at $x=t$ is a square of side $\frac t2$. As $t$ runs from $0$ to $1$ this is a pyramid: base the square of side $\frac12$ on the plane $x=1$, area $\frac14$, height $1$.

$$
\frac13\times\frac14\times 1=\frac{1}{12}.
$$

One copy for each coordinate. A point cannot lie in two of them: inside the $x$ pyramid, $y<\frac x2<x$, so $y$ is not greatest. The total volume is $\frac14$, choice (E).

(Integrating the slice area $\left(\frac t2\right)^2$ from $0$ to $1$ also gives $\frac{1}{12}$. That step is a definite integral, past the high-school syllabus used here. The pyramid volume is enough.)

## What the figure shows

- The figure starts with only the pyramid where $x$ is largest, and the reading is $\frac{1}{12}$. Choose "All three" and the blue and purple copies appear; the reading becomes $\frac14$.
- The sliders $x$, $y$, $z$ move the sample point. The condition holds only inside a pyramid. "Outside" lands in the cube and in none of them.
- With only one pyramid drawn, make $y$ or $z$ the largest: the condition can hold on a pyramid that is not on the screen.
