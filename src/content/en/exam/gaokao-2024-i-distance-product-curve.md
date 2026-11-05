---
title: 'A curve where two distances multiply to 4'
description: 'Every point on the curve has distance to F(2, 0) times distance to x = −2 equal to 4. At x = 2 the height is 1, but the top is near x ≈ 1.68 at about 1.039.'
subject: 高考數學
year: 2024
questionType: 多選
questionNo: '新課標I-11'
unit: Gaokao Mathematics, New Curriculum I, curves and equations
topics:
  - Locus equation
  - Range of a curve
  - Bounding by inequality
concepts:
  - conic-sections
sourceUrl: https://gaokaohub.com/q/item/121286594128203.html
relatedExplore:
  - conic-dynamic-geometry
relatedWorks:
  - conic-focus-locus
date: 2026-11-05
order: 25
coverImage: /images/exam-covers/gaokao-2024-i-distance-product-curve.png
featured: false
draft: false
---

## Problem

Every point of a curve $C$ has $x>-2$, and its distance to $F(2,0)$ times its distance to the line $x=a$ ($a<0$) is 4. The curve passes through the origin. Judge four statements: $a=-2$; the point $(2\sqrt2,0)$ is on $C$; the largest $y$ of $C$ in the first quadrant is 1; every point $(x_0,y_0)$ of $C$ satisfies $y_0\le\dfrac{4}{x_0+2}$.

The wording comes from candidate recall; see the [gaokaohub write-up](https://gaokaohub.com/q/item/121286594128203.html), and compare the [liangshibao solution](https://liangshibao.com/tiku/gaokao-math-2024-i/multiple-11).

## Where it goes wrong

The trap is the third statement. Plugging in $x=2$ gives $y=1$, which looks like the top, so students accept it.

This curve is not a conic, so there is no symmetric vertex to rely on. The height has to be read from the formula for $y^2$, and a point slightly to the left is higher.

## Idea

$C$ passes the origin: $2\cdot|0-a|=4$ with $a<0$, so $a=-2$. The equation is

$$
\sqrt{(x-2)^2+y^2}\,(x+2)=4\quad\Longrightarrow\quad y^2=\frac{16}{(x+2)^2}-(x-2)^2.
$$

- At $x=2\sqrt2$, $\dfrac{16}{(2\sqrt2+2)^2}=(2\sqrt2-2)^2$, so $y=0$ and the point is on the curve.
- At $x=2$, $y=1$; at $x=1.5$, $y^2\approx1.056>1$, so the maximum is not 1. Numerically the top is near $x\approx1.68$, $y\approx1.039$.
- $y^2\le\dfrac{16}{(x+2)^2}$, so $|y|\le\dfrac{4}{x+2}$.

The answer is ABD.

## What the figure shows

- Drag **x** of point P: the gold dot moves along the upper branch. The white segment is the distance to F, the cyan one the distance to $x=-2$, and their product stays 4.
- Pull P left from $x=2$: the sidebar's y first grows, then shrinks. The stretch above 1 is why C is false.
- Turn on **Show y = 4/(x+2)**: the cyan curve wraps around the gold one everywhere, which is D.
