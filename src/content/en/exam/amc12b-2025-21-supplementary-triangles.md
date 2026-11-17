---
title: Two third sides from supplementary angles
description: "2025 AMC 12B #21: doubling the side 11 gives 22; the two sides sum to 24."
subject: AMC 12B
year: 2025
questionType: 單選
questionNo: '21'
unit: AMC 12, law of cosines
topics:
  - Law of cosines
  - Supplementary angles
  - Triangle inequality
concepts:
  - law-of-sines-cosines
  - trig-functions
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2025_AMC_12B_Problems/Problem_21
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - law-of-sines-cosines
  - trig-angle-identities
date: 2026-11-18
order: 41
coverImage: /images/exam-covers/amc12b-2025-21-supplementary-triangles.png
featured: false
draft: false
---

## Problem

Two non-congruent triangles have the same area. Each has sides of length $8$ and $9$, and each third side is an integer. Find the sum of the two third sides. There are five choices.

The full problem and the choices are on the [AoPS problem page](https://artofproblemsolving.com/wiki/index.php/2025_AMC_12B_Problems/Problem_21).

## Where it goes wrong

- The acute triangle has third side $11$. Doubling it gives $22$, which is choice (B). The other third side is $13$.
- Keeping only $13$ and doubling it gives $26$, which is choice (D).
- Adding the known side $9$ to the computed side $11$ gives $20$, which is choice (A). The problem asks for the two third sides.
- Stretched into a straight line, the third sides are $1$ and $17$. Their squares also sum to $290$, and the area is $0$, so they are not triangles. $11+17=28$ is choice (E), and those squares do not sum to $290$.

## Idea

With included angle $\theta$ between the sides of length $8$ and $9$, the area is

$$
\frac12\cdot 8\cdot 9\cdot\sin\theta=36\sin\theta.
$$

A supplementary angle has the same sine, so the areas match, and the cosines are opposites. The law of cosines gives

$$
t^2=8^2+9^2-2\cdot 8\cdot 9\cos\theta=145-144\cos\theta.
$$

The other triangle contributes $145+144\cos\theta$. Adding the two equations,

$$
t_1^2+t_2^2=290.
$$

The triangle inequality is $1<t<17$. The endpoints $t=1$ and $t=17$ are $\cos\theta=\pm 1$, where the area is $0$.

$290$ leaves remainder $2$ on division by $8$. A square leaves remainder $0$, $1$, or $4$, so a sum of two squares leaves remainder $2$ only when both integers are odd. Among $3,5,\ldots,15$ the only pair is

$$
11^2+13^2=121+169=290.
$$

At $\cos\theta=\dfrac16$, $145-24=121=11^2$, and the supplement gives $145+24=169=13^2$.

$$
\sin\theta=\sqrt{1-\frac1{36}}=\frac{\sqrt{35}}{6},\qquad 36\sin\theta=6\sqrt{35}.
$$

The two third sides sum to $24$. The choice is (C).

## What the figure shows

- The figure starts with the acute triangle alone. Its third side is $11$.
- The slider changes the included angle. The supplementary triangle keeps the same area and takes a different third side.
- Choose "Add the other" and both triangles appear. At this integer pair the reading is $11$ and $13$, and the sum is $24$.
