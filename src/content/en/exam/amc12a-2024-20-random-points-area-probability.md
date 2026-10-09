---
title: Area probability for two random points
description: "2024 AMC 12A, Problem #20 turns the area ratio into the product xy and pins the probability between 3/4 and 7/8 with the unit square."
subject: AMC 12A
year: 2024
questionType: 單選
questionNo: '20'
unit: AMC 12, geometric probability
topics:
  - Geometric probability
  - Area ratio
  - Random simulation
concepts:
  - classical-probability
  - definite-integral
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2024_AMC_12A_Problems/Problem_20
relatedExplore:
  - probability-statistics
  - limits-riemann-sum
relatedWorks:
  - buffon-needle
  - natural-log-e-geometry
date: 2026-09-25
order: 17
coverImage: /images/exam-covers/amc12a-2024-20-random-points-area-probability.png
featured: false
draft: false
---

## Problem

On the sides $AB$ and $AC$ of an equilateral triangle $ABC$, points $P$ and $Q$ are chosen independently and uniformly at random. The question asks which interval contains the probability that the area of $\triangle APQ$ is less than half the area of $\triangle ABC$. There are five choices, and each choice is an interval.

The full problem and the choices are on the [AoPS problem page](https://artofproblemsolving.com/wiki/index.php/2024_AMC_12A_Problems/Problem_20).

## Where it goes wrong

- Randomness plus symmetry can look like a probability of $\frac12$. The area ratio is $xy$, not $x$ or $\frac{x+y}{2}$. When both points are midpoints the ratio is only $\frac14$, so the cases below one half are the majority.
- Once the probability is that of $xy<\frac12$, it is easy to treat the boundary $xy=\frac12$ as a straight line. It is a hyperbola, and the area of the region then comes out wrong.
- It is also easy to think the problem needs $\int\frac1x\,dx=\ln x$. The question only asks which interval the probability falls in, and a squeeze is enough.

## Idea

Let $x=\frac{AP}{AB}$ and $y=\frac{AQ}{AC}$. They are independent and uniform on $[0,1]$. The two triangles share $\angle A$:

$$
\frac{[APQ]}{[ABC]}=\frac{\frac12\,AP\cdot AQ\sin A}{\frac12\,AB\cdot AC\sin A}=xy.
$$

The probability is the area of the unit square where $xy<\frac12$. The complement $xy\ge\frac12$ lies above the curve $y=\frac{1}{2x}$, and only inside $\left[\frac12,1\right]^2$:

$$
1-\int_{1/2}^{1}\left(1-\frac{1}{2x}\right)dx=\frac12+\frac{\ln2}{2}\approx0.8466.
$$

(The integral of $\frac1x$ and the natural logarithm $\ln$ are beyond the high-school course. They are used here only to name the exact value.)

An integral is not required. The complement contains the triangle with vertices $\left(\frac12,1\right)$, $(1,1)$, and $\left(1,\frac12\right)$. The curve bends upward, so the chord lies above the curve, and the complement has area greater than $\frac18$. The complement is also contained in the square of side $\frac12$, so its area is less than $\frac14$. The probability therefore lies between $\frac34$ and $\frac78$, which is choice (D).

## What the figure shows

- Drag $P$ and $Q$ on the left, or the point on the right, or move **x = AP/AB** and **y = AQ/AC**. Gold $\triangle APQ$ stays in step with the point in the square. Once that point is above and to the right of the gold curve $xy=\frac12$, the area ratio is no longer less than one half.
- Twenty thousand random pairs $(x,y)$ are drawn. Blue points sit under the curve and red points above it. The polyline below is the running proportion. It settles near $0.8466$ and stops inside the gold band $\left(\frac34,\frac78\right]$.
- Press **Show the bounds**. The red region is contained in the dashed square and contains the gold triangle, so the probability is trapped between $\frac34$ and $\frac78$ with no integral.
