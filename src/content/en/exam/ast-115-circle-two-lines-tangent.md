---
title: Center on the x-axis, a distance ratio, and tangent slopes
description: "115 AST Math A, Fill-in 10: a circle with center on the x-axis is fixed by a ratio of distances to two perpendicular lines, then the slopes of the tangents through the origin are found."
subject: 分科數甲
year: 115
questionType: 選填
questionNo: '10'
unit: Senior-high year 2, Math A · Circles and lines
topics:
  - Distance from a point to a line
  - A circle and a line
  - Slope of a tangent
concepts:
  - conic-sections
  - vectors
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0Q194554571830884494/01-115%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E5%8D%B7.pdf
relatedExplore:
  - conic-dynamic-geometry
  - vectors
relatedWorks:
  - vector-projection
  - parabolic-reflection
date: 2026-09-17
order: 12
coverImage: /images/exam-covers/ast-115-circle-two-lines-tangent.png
featured: false
draft: false
---

## Problem

In the coordinate plane, the center of circle $C$ lies on the $x$-axis, and the circle meets neither of the perpendicular lines

$$
L_1:y=\frac43 x,\qquad L_2:y=-\frac34 x.
$$

Let $d_1$ and $d_2$ be the shortest distances from points of the circle to $L_1$ and $L_2$. If $d_1$ is three times $d_2$, find the slope of a line through the origin that is tangent to the circle, in simplest radical form. The full question is on the [Original paper](https://www.ceec.edu.tw/files/file_pool/1/0Q194554571830884494/01-115%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E5%8D%B7.pdf).

## Where it goes wrong

Three stalls are common. One is to write "does not meet" as a distance greater than or equal to the radius: a tangent still meets the circle, so the distance must be strictly greater than the radius. Another is to use the distances from the center to the lines as $d_1$ and $d_2$. A third is to find the radius and then use the wrong condition for a tangent. The ratio fixes the circle first. The tangent slopes are the next step, not the same equation.

## Idea

Let the center be $(a,0)$ and the radius be $r>0$. The distance from a point to a line gives

$$
\delta_1=\frac{|4a|}{5},\qquad \delta_2=\frac{|3a|}{5}.
$$

Missing both lines means $\delta_1>r$ and $\delta_2>r$. Then the shortest distances from the circle are

$$
d_1=\delta_1-r,\qquad d_2=\delta_2-r.
$$

The condition $d_1=3d_2$ gives $r=|a|/2$. A line $y=mx$ through the origin is tangent when the distance from the center to that line equals the radius:

$$
\frac{|am|}{\sqrt{m^2+1}}=\frac{|a|}{2}\implies |m|=\frac{\sqrt3}{3}.
$$

The slopes are $\pm\sqrt3/3$. The fill-in entry is written as $\pm$, $\sqrt3$, and $3$.

## What the figure shows

- Drag **a (x-coordinate of the center)**. The center moves along the $x$-axis. The radius is set to $|a|/2$, which makes $d_1:d_2=3:1$, and $a$ stays inside the range where the circle misses both lines.
- The short blue and purple segments are the shortest distances from the circle to $L_1$ and $L_2$. The ratio stays near $3:1$.
- The gold dashed lines are the two tangents through the origin. Their slopes are $\pm\sqrt3/3$, and those slopes do not change with $|a|$.
