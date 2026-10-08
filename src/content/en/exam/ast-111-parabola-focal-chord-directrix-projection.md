---
title: Two trigonometric ratios on a focal chord
description: Equal lengths from the definition of a parabola, and the right triangles from the projections, identify one and the same segment ratio.
subject: 分科數甲
year: 111
questionType: 多選
questionNo: '7'
unit: Grade 12 elective Mathematics I · Conic sections
topics:
  - Parabola definition
  - Focus and directrix
  - Trigonometric ratios
concepts:
  - conic-sections
  - trig-functions
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0m223505137960339935/01-111%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E5%8D%B7%E5%AE%9A%E7%A8%BF.pdf
analysisUrl: https://www.ceec.edu.tw/xcepaper/cont?qperoid=0M280320869370643470&sid=0M289400243640279375&xsmsid=0J066588036013658199
relatedExplore:
  - conic-dynamic-geometry
relatedWorks:
  - parabolic-reflection
date: 2026-07-28
order: 10
coverImage: /images/exam-covers/ast-111-parabola-focal-chord-directrix-projection.png
featured: false
draft: false
---

## Problem

The chord through two points $A$ and $B$ on a parabola passes through the focus $F$. Drop perpendiculars from $A$, $F$, and $B$ to the directrix, meeting it at $A'$, $F'$, and $B'$. Among five trigonometric ratios, find the ones equal to $\dfrac{A'F'}{A'A}$. The figure and the options are on the [original 111 AST Mathematics I paper](https://www.ceec.edu.tw/files/file_pool/1/0m223505137960339935/01-111%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E5%8D%B7%E5%AE%9A%E7%A8%BF.pdf).

## Where it goes wrong

The [official item analysis](https://www.ceec.edu.tw/xcepaper/cont?qperoid=0M280320869370643470&sid=0M289400243640279375&xsmsid=0J066588036013658199) records a score rate of $41\%$. Options ③, ④, and ⑤ are the hard ones. The way through is not another equation for the parabola. First mark the equal lengths from "distance to the focus equals distance to the directrix", then complete the right triangles.

## Idea

Set

$$
\begin{aligned}
a&=A'F', & b&=A'A=AF,\\
c&=F'B', & d&=B'B=BF.
\end{aligned}
$$

The two equalities are the definition of the parabola. The projection lines $A'A$, $F'F$, and $B'B$ are all perpendicular to the directrix, so they are parallel. Since $A$, $F$, and $B$ are collinear, the focal chord makes the same acute angle with each of those lines. Call that angle $\theta$. Then

$$
\frac{a}{b}=\sin\theta=\frac{c}{d}.
$$

The angle in option ③ is $\angle A'AF=\theta$, so

$$
\sin\angle A'AF=\frac{A'F'}{AF}=\frac{A'F'}{A'A}.
$$

In the right projection $F'B'B$, option ⑤ gives

$$
\tan\angle FF'B=\frac{F'B'}{B'B}=\frac{c}{d}=\frac{a}{b}.
$$

The correct options are ③ and ⑤, matching the [official answer key](https://www.ceec.edu.tw/files/file_pool/1/0m223505388149187989/01-111%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E9%81%B8%E6%93%87%28%E5%A1%AB%29%E9%A1%8C%E7%AD%94%E6%A1%88.pdf).

## What the figure shows

- Drag **Height of A (schematic scale)**. The other end $B$ of the focal chord, the three projection lines, and the ratio all move together.
- Look first at the gold segment $A'F'$ and the gold focal chord. Since $A'A=AF$, option ③ rewrites as the ratio the question asks for.
- The blue line is $F'B$. The tangent in option ⑤ is $F'B'/B'B$, and it stays equal to the ratio the question asks for.
