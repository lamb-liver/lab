---
title: Equal distances and a square on the unit circle
description: "111 AST Mathematics I, Fill-in 11: read the complex absolute value as a distance, and find the complex number in quadrant I from the perpendicular bisector of a chord of the unit circle."
subject: 分科數甲
year: 111
questionType: 選填
questionNo: '11'
unit: Grade 12 elective Mathematics I · The complex plane
topics:
  - The complex plane
  - Complex absolute value
  - De Moivre's theorem
concepts:
  - complex-numbers
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0m223505137960339935/01-111%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E5%8D%B7%E5%AE%9A%E7%A8%BF.pdf
analysisUrl: https://www.ceec.edu.tw/xcepaper/cont?qperoid=0M280320869370643470&sid=0M289400243640279375&xsmsid=0J066588036013658199
relatedExplore: []
relatedWorks:
  - complex-arithmetic-geometry
  - complex-polar-form
date: 2026-07-29
order: 11
coverImage: /images/exam-covers/ast-111-complex-unit-circle.png
featured: false
draft: false
---

## Problem

On the complex plane, a complex number $z$ in quadrant I lies on the unit circle. There is also a fixed point

$$
w=\frac{-3+4i}{5}.
$$

The distance from $w$ to $z$ equals the distance from $w$ to $z^3$. Find the real and imaginary parts of $z=a+bi$. The exact values and the answer format are on the [CEEC 111 AST Mathematics I paper](https://www.ceec.edu.tw/files/file_pool/1/0m223505137960339935/01-111%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E5%8D%B7%E5%AE%9A%E7%A8%BF.pdf).

## Where it goes wrong

The [official item analysis](https://www.ceec.edu.tw/xcepaper/cont?qperoid=0M280320869370643470&sid=0M289400243640279375&xsmsid=0J066588036013658199) records a score rate of $16\%$. The step that sticks is seeing $z^3$ and rushing into a long algebraic expansion, while forgetting that a complex absolute value is a distance on the complex plane. Redraw "equal distances" as the perpendicular bisector of a chord, and the cube only triples the argument.

## Idea

Since $|z|=|z^3|=1$, the origin is also equally far from $z$ and $z^3$. So both the origin and $w$ lie on the perpendicular bisector of the chord $zz^3$.

Let the argument of $z$ be $\theta$. By De Moivre's theorem, $z^3$ has argument $3\theta$. The midpoint of the chord points in direction $2\theta$, the direction of $z^2$. Because $z$ is in quadrant I and $w$ is in quadrant II, the direction cannot flip to the opposite side, so

$$
z^2=w=\frac{-3+4i}{5}.
$$

Write $z=a+bi$, compare real and imaginary parts, and use $a^2+b^2=1$:

$$
\begin{aligned}
a^2-b^2&=-\frac35,\qquad 2ab=\frac45,\\
a^2+b^2&=1.
\end{aligned}
$$

Adding the first and last equations gives $a^2=\frac15$, and then $b^2=\frac45$. Because $z$ is in quadrant I,

$$
\boxed{a=\frac{\sqrt5}{5},\qquad b=\frac{2\sqrt5}{5}}.
$$

## What the figure shows

- Drag **Argument $\theta$** and watch $z^3$ move around the unit circle at three times the argument. The chord and its perpendicular bisector move with it.
- Compare the gold and blue segments from the fixed point $w$ to $z$ and to $z^3$. The sidebar shows the current difference between the two distances.
- Press **Back to the solution position** to check that the two distances are equal when $w=z^2$.
