---
title: The hexagon is not the 60° one
description: "2024 AMC 12B #19: rotating the equilateral triangle by 30° or by 60° does not make the hexagon area 91√3."
subject: AMC 12B
year: 2024
questionType: 單選
questionNo: '19'
unit: AMC 12, trigonometry and area
topics:
  - Rotation
  - Area of a hexagon
  - Double angle
concepts:
  - trig-functions
  - trig-identities
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2024_AMC_12B_Problems/Problem_19
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - trig-angle-identities
  - unit-circle-trig-definition
date: 2026-11-17
order: 38
coverImage: /images/exam-covers/amc12b-2024-19-rotated-hexagon.png
featured: false
draft: false
---

## Problem

An equilateral triangle of side $14$ is rotated about its center by an angle $\theta$, with $0<\theta\le 60^\circ$, producing a second equilateral triangle. The hexagon whose vertices alternate between the two triangles has area $91\sqrt3$. Find $\tan\theta$. There are five choices.

The full problem and the choices are on the [AoPS problem page](https://artofproblemsolving.com/wiki/index.php/2024_AMC_12B_Problems/Problem_19).

## Where it goes wrong

- At $60^\circ$ the six vertices divide the circumcircle into equal arcs. The convex hull is a regular hexagon of area $98\sqrt3$, not $91\sqrt3$. That is the maximum area on this interval.
- At $30^\circ$, $\tan\theta=\frac1{\sqrt3}$ and the area is $147=49\sqrt3\times\sqrt3$, short of $91\sqrt3$.
- The half-angle has tangent $\frac{\sqrt3}{5}$. Stopping there, without the double-angle formula, does not produce $\frac{5\sqrt3}{11}$. $\frac45\approx 0.8$ sits next to the answer $0.787$, and the area at that angle is not $91\sqrt3$.

## Idea

The triangle has area $\frac{\sqrt3}{4}\times 14^2=49\sqrt3$. The circumradius is two-thirds of the altitude,

$$
R=\frac{14\sqrt3}{3},\qquad R^2=\frac{196}{3}.
$$

All six vertices lie on this circle. Consecutive central angles alternate between $\theta$ and $120^\circ-\theta$. The hexagon is six isosceles triangles:

$$
\text{area}=\frac12 R^2\cdot 3\big(\sin\theta+\sin(120^\circ-\theta)\big)=49\big(3\sin\theta+\sqrt3\cos\theta\big).
$$

On $(0,60^\circ]$ this increases from $49\sqrt3$ to $98\sqrt3$, so the value $91\sqrt3$ occurs once. Set them equal:

$$
3\sin\theta+\sqrt3\cos\theta=\frac{13\sqrt3}{7}.
$$

With $t=\tan\theta$,

$$
\frac{3t+\sqrt3}{\sqrt{1+t^2}}=\frac{13\sqrt3}{7}.
$$

Both sides are positive on this interval. Squaring produces $11t^2-49\sqrt3\,t+60=0$. The discriminant is $4563=3\times 39^2$, and the roots are

$$
t=\frac{5\sqrt3}{11}\quad\text{and}\quad t=4\sqrt3.
$$

$4\sqrt3=\tan(120^\circ-\theta)$ is past $60^\circ$, outside the problem. That angle also gives area $91\sqrt3$; the problem keeps the one that does not exceed $60^\circ$.

The remaining value gives $\sin\theta=\frac{5\sqrt3}{14}$ and $\cos\theta=\frac{11}{14}$, and the area is $91\sqrt3$. Choice (B).

The half-angle is a reading of those two values, not a separate step:

$$
\tan\frac\theta2=\frac{\sin\theta}{1+\cos\theta}=\frac{\sqrt3}{5},\qquad
\tan\theta=\frac{2\cdot\frac{\sqrt3}{5}}{1-\frac{3}{25}}=\frac{5\sqrt3}{11}.
$$

## What the figure shows

- The slider runs from $0^\circ$ to $60^\circ$. Cyan is the convex hull of the six vertices, and the reading is its area.
- At $30^\circ$ the area is $147$, not $91\sqrt3$. At $60^\circ$ it is $98\sqrt3$, the maximum on this range, and still not the target.
- "Area 91√3" sets $\tan\theta$ to $\frac{5\sqrt3}{11}$.
