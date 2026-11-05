---
title: One line cutting three unit circles
description: Three unit circles centered on an equilateral triangle, cut by one line. Equal chords mean equal distances to the centers, and through the origin the chord sum is a function of one variable.
subject: 高考數學
year: 2026
questionType: 多選
questionNo: '新課標I-11'
unit: Gaokao Mathematics, New Curriculum I, lines and circles
topics:
  - Point-to-line distance
  - Chord length
  - Maximum
concepts:
  - conic-sections
  - derivative-tangent
sourceUrl: https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34464.html
relatedExplore:
  - conic-dynamic-geometry
relatedWorks: []
date: 2026-11-06
order: 27
coverImage: /images/exam-covers/gaokao-2026-i-three-circles-chords.png
featured: false
draft: false
---

## Problem

Three circles of radius 1 have centers $C_1(-1,0)$, $C_2(1,0)$, $C_3(0,\sqrt3)$. The line $l:y=kx+b$ meets each circle in two points, cutting chords $s_1,s_2,s_3$. Judge four statements:

- A. $k$ can be any real number.
- B. Exactly 3 lines satisfy $s_1=s_2=s_3$.
- C. More than 3 lines satisfy $s_1+s_2+s_3=3$.
- D. When $b=0$, the largest value of $s_1+s_2+s_3$ is $\tfrac{2\sqrt{21}}{3}$.

The wording comes from candidate recall; see the [91apu write-up](https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34464.html), and compare the [liangshibao solution](https://liangshibao.com/tiku/gaokao-math-2026-i/multiple-11). The liangshibao version gives the sum in C as 1, while 91apu and lewang give 3. C holds either way, so the answer is the same.

## Where it goes wrong

A looks true: you can always slide a line until it crosses all three circles. But with slope $\pm\tfrac{\sqrt3}{3}$ the line is perpendicular to $C_1C_3$ or $C_2C_3$. Those two centers are 2 apart along the normal, so the line cannot be within 1 of both.

In B, people often miss the horizontal line and find only the two through the origin, or count all three medians.

## Idea

The chord is $s_i=2\sqrt{1-d_i^2}$, where $d_i$ is the distance from the center to $l$, so equal chords mean equal distances:

$$
|{-k}+b|=|k+b|=|b-\sqrt3|.
$$

The first equality gives $k=0$ or $b=0$. With $k=0$, $b=\tfrac{\sqrt3}{2}$; with $b=0$, $k=\pm\sqrt3$. That is 3 lines, so B is true.

With $b=0$, let $t=\tfrac{1}{\sqrt{1+k^2}}$, $0<t<\tfrac{1}{\sqrt3}$:

$$
s_1+s_2+s_3=f(t)=4t+2\sqrt{1-3t^2}.
$$

$f(t)=3$ becomes $28t^2-24t+5=0$, so $t=\tfrac12$ or $\tfrac{5}{14}$, giving $k=\pm\sqrt3$ and $\pm\tfrac{\sqrt{171}}{5}$. That is at least 4 lines, so C is true. $f'(t)=0$ at $t=\tfrac{2}{\sqrt{21}}$, with maximum $\tfrac{2\sqrt{21}}{3}$, so D is true. The answer is BCD.

## What the figure shows

- Drag $k$ and $b$. The top panel draws the three chords, with dashed perpendiculars from the centers. The sidebar shows the three lengths and their sum.
- "Equal 1–3" are the three lines in B. "k = √3/3" shows A: no value of $b$ reaches all three circles.
- The bottom curve is the chord sum against $k$ when $b=0$, with dashed lines at 3 and at the maximum. "Sum 3" and "b = 0 max" match C and D.
