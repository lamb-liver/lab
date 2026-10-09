---
title: Skew lines, the common perpendicular, and distance in space
description: "112 GSAT Mathematics A, Fill-in 17: use direction vectors and the common perpendicular to combine three mutually perpendicular lengths into a distance in space."
subject: 學測數A
year: 112
questionType: 選填
questionNo: '17'
unit: Grade 11 Mathematics A · Spatial vectors
topics:
  - Lines in space
  - Cross product
  - Distance between skew lines
concepts:
  - space-vectors
  - dot-cross-product
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0n045358375872115148/03-112%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://www.ceec.edu.tw/files/file_pool/1/0N060632491446652955/%E6%95%B8A%E7%A7%91%E7%AD%94%E5%B0%8D%E7%8E%87%E5%8F%8A%E9%91%91%E5%88%A5%E5%BA%A6%E8%A1%A8.pdf
relatedExplore:
  - space-vectors-planes-lines
relatedWorks:
  - cross-product-geometry
  - line-plane-intersection
  - plane-normal-distance
date: 2026-07-24
order: 3
coverImage: /images/exam-covers/gsat-112-skew-line-distance.png
featured: false
draft: false
---

## Problem

In coordinate space, two lines $L_1$ and $L_2$ do not meet, and a third line $L_3$ meets both of them at right angles. Points $P$ and $Q$ lie on $L_1$ and $L_2$, and each is at distance $3$ from $L_3$. Find the distance between $P$ and $Q$. The full line equations are on the [CEEC 112 GSAT Mathematics A paper](https://www.ceec.edu.tw/files/file_pool/1/0n045358375872115148/03-112%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf).

## Where it goes wrong

The CEEC [item statistics](https://www.ceec.edu.tw/files/file_pool/1/0N060632491446652955/%E6%95%B8A%E7%A7%91%E7%AD%94%E5%B0%8D%E7%8E%87%E5%8F%8A%E9%91%91%E5%88%A5%E5%BA%A6%E8%A1%A8.pdf) give a correct rate of only $10\%$ for this item. Common sticking points are treating lines that look like they cross on paper as really crossing, stopping at the distance between the two lines, or adding the three lengths directly. A figure in space can be rotated, but the right angles and the lengths do not change with the view.

## Idea

The direction vectors of the two lines are

$$
\mathbf u=(1,-1,1),\qquad \mathbf v=(2,1,-1).
$$

Since $\mathbf u\cdot\mathbf v=0$, the two directions are perpendicular. The cross product

$$
\mathbf n=\mathbf u\times\mathbf v=(0,3,3)
$$

is perpendicular to both lines. Taking the known points $A_0=(1,1,2)$ and $B_0=(2,5,6)$ on the two lines, the distance between the skew lines is

$$
\frac{|(B_0-A_0)\cdot\mathbf n|}{|\mathbf n|}
=\frac{24}{3\sqrt2}
=4\sqrt2.
$$

Call the points where $L_3$ meets $L_1$ and $L_2$ $A$ and $B$. The segments $\overline{AP}$, $\overline{AB}$, and $\overline{BQ}$ run along three mutually perpendicular directions, so the Pythagorean theorem applies twice in a row:

$$
PQ^2=AP^2+AB^2+BQ^2
=3^2+(4\sqrt2)^2+3^2
=50.
$$

So $PQ=5\sqrt2$. The result does not depend on which side of the foot $P$ and $Q$ each lie.

## What the figure shows

- The gold line is the common perpendicular segment of $L_1$ and $L_2$. Its length stays at $4\sqrt2$.
- Drag $d=|AP|=|BQ|$ from $0$ to $3$ and watch $PQ$ grow from $4\sqrt2$ to $5\sqrt2$.
- Drag the canvas or use the view sliders. The picture changes, but the three mutually perpendicular directions do not.
