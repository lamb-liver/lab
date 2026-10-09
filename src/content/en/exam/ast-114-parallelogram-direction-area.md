---
title: Parallelogram area with the edge directions fixed
description: "114 AST Math A, Fill-in 11: the sides stay on two fixed directions, and the area is read from the vector between the center and one vertex."
subject: 分科數甲
year: 114
questionType: 選填
questionNo: '11'
unit: Senior-high year 2, Math A · Plane vectors
topics:
  - Parallelograms
  - Cross product
  - Midpoint of the diagonals
concepts:
  - vectors
  - dot-cross-product
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0P192554390266335672/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://math.ntnu.edu.tw/~li/108/114G.html
relatedExplore:
  - vectors
relatedWorks:
  - cross-product-geometry
  - vector-addition-scalar
date: 2026-09-17
order: 14
coverImage: /images/exam-covers/ast-114-parallelogram-direction-area.png
featured: false
draft: false
---

## Problem

On the coordinate plane, one pair of sides of a parallelogram is parallel to $5x-y=0$, and the other pair lies on lines perpendicular to $3x-2y=0$. The diagonals meet at $Q$, and one vertex $P$ satisfies $\overrightarrow{PQ}=(10,-1)$. Find the area. The full question is on the [Original paper](https://www.ceec.edu.tw/files/file_pool/1/0P192554390266335672/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E5%8D%B7.pdf).

## Where it goes wrong

Writing coordinates for all four vertices makes a large system, and a sign error is easy. The edge directions are already fixed, and the vector from the center to a vertex is only half a diagonal. The area is the absolute value of the cross product of the two side vectors, so the four vertices do not all have to be written down.

## Idea

Take $\mathbf{u}_0=(1,5)$, parallel to $5x-y=0$. Lines perpendicular to $3x-2y=0$ have slope $-2/3$, so take $\mathbf{v}_0=(3,-2)$. If the side vectors are $\alpha\mathbf{u}_0$ and $\beta\mathbf{v}_0$, then

$$
2\overrightarrow{PQ}=\pm(\alpha\mathbf{u}_0\pm\beta\mathbf{v}_0).
$$

All four solutions have $|\alpha\beta|=12$, and

$$
|\mathbf{u}_0\times\mathbf{v}_0|=17,
$$

so the area is

$$
|\alpha\beta|\cdot 17=204.
$$

## What the figure shows

- The blue and purple dashed lines are the two families of direction rails. Blue is parallel to $5x-y=0$. Purple is perpendicular to $3x-2y=0$.
- Drag an adjacent vertex, or empty canvas, to snap among the four solutions. The sidebar does the same: **Half-diagonal = ½(u+v)**, **Half-diagonal = ½(u−v)**, **PQ same direction**, and **PQ reversed**.
- $Q$ stays at the origin. **PQ same direction** puts $P$ at $(10,-1)$, so the vector from the center to that vertex is $(10,-1)$. **PQ reversed** puts $P$ at the opposite point. The $\pm$ in the formula covers both, and the two half-diagonals are the two ways to pair the side directions.
- The drag is not continuous. With $\overrightarrow{PQ}$ fixed and both directions locked, only these four solutions fit, and the area is always $204$ ($|\alpha\beta|=12$ times the direction cross product $17$).
- The sidebar value $|\mathbf{u}\times\mathbf{v}|$ is that area. The four vertices do not have to be solved one by one.
