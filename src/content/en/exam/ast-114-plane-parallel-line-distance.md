---
title: Distance between parallel traces of a plane on the coordinate planes
description: "114 AST Math A, Fill-in 10: a plane meets two coordinate planes in parallel lines; find the shortest distance between them."
subject: 分科數甲
year: 114
questionType: 選填
questionNo: '10'
unit: Senior-high year 2, Math A · Planes and lines in space
topics:
  - Traces of a plane on the coordinate planes
  - Distance between parallel lines
  - Direction vectors
concepts:
  - space-vectors
  - dot-cross-product
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0P192554390266335672/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://math.ntnu.edu.tw/~li/108/114G.html
relatedExplore:
  - space-vectors-planes-lines
relatedWorks:
  - line-plane-intersection
  - plane-normal-distance
  - cross-product-geometry
date: 2026-09-17
order: 13
coverImage: /images/exam-covers/ast-114-plane-parallel-line-distance.png
featured: false
draft: false
---

## Problem

A plane in space meets $x=0$ in the line $L_1$ and $z=0$ in the line $L_2$. It is given that $L_1\parallel L_2$, that $L_1$ passes through $(0,2,-11)$, and that $L_2$ passes through $(8,21,0)$. Find the distance between the two lines, in simplest radical form.

The full question is on the [Original paper](https://www.ceec.edu.tw/files/file_pool/1/0P192554390266335672/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E5%8D%B7.pdf).

## Where it goes wrong

It is easy to treat the two traces as skew lines and force a formula, or to start from a general plane equation and slip on the parallel condition. The key is simpler. One line lies in $x=0$, the other in $z=0$, and they must be parallel, so there is almost no choice left for the direction vector.

## Idea

A direction vector of $L_1\subset\{x=0\}$ satisfies $u_x=0$. A direction vector of $L_2\subset\{z=0\}$ satisfies $u_z=0$. The lines are parallel, so they share the same $\mathbf u$, and therefore

$$
\mathbf u=(0,1,0).
$$

The distance between two parallel lines is the length of the component of the segment joining the two known points that is perpendicular to $\mathbf u$. Removing the $y$ direction leaves

$$
(8,0,11),\qquad \text{distance}=\sqrt{8^2+11^2}=\sqrt{185}.
$$

(The fill-in digits are $1$, $8$, $5$.)

## What the figure shows

- The translucent blue and purple planes are $x=0$ and $z=0$. Their traces are $L_1$ and $L_2$.
- The gold line is the common perpendicular segment. Its length stays at $\sqrt{185}$.
- Drag the canvas or use the view sliders. The picture changes, but the parallel lines and the distance do not.
