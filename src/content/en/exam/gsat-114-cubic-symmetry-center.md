---
title: Center of symmetry of a cubic
description: 114 GSAT Mathematics A, Fill-in 13 uses polynomial division and the quotient's axis of symmetry to locate the cubic's center of symmetry.
subject: 學測數A
year: 114
questionType: 選填
questionNo: '13'
unit: Grade 10 required mathematics · Polynomial functions
topics:
  - Polynomial division
  - Remainder theorem
  - Center of symmetry of a cubic
concepts:
  - polynomial
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0p056503510203248955/03-114%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E9%A1%8C.pdf
analysisUrl: https://math.ntnu.edu.tw/~li/108/114A.html
relatedExplore:
  - function-equations
relatedWorks:
  - function-graph-transform
  - polynomial-roots-multiplicity
coverImage: /images/exam-covers/gsat-114-cubic-symmetry-center.png
date: 2026-07-25
order: 6
featured: false
draft: false
---

## Problem

A cubic polynomial $f(x)$ with real coefficients is divided by $x+6$. The quotient is written $q(x)$, and the remainder is 3. It is given that $q(x)$ attains a maximum of 8 at $x=-6$. The question asks for the center of symmetry of the graph $y=f(x)$.

The full paper is the [CEEC 114 GSAT Mathematics A paper](https://www.ceec.edu.tw/files/file_pool/1/0p056503510203248955/03-114%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E9%A1%8C.pdf).

## Where it goes wrong

The CEEC [item statistics](https://www.ceec.edu.tw/files/file_pool/1/0P062639972539206028/%E6%95%B8%E5%AD%B8A.pdf) give a correct rate of $48\%$ for this item, $88\%$ in the high-scoring group and only $10\%$ in the low-scoring group. The step that sticks is treating the high point $(-6,8)$ of $q(x)$ as the center of $f(x)$, and forgetting that 8 belongs to the quotient. The value of the original function at $x=-6$ is fixed by the remainder 3.

## Idea

By polynomial division,

$$
f(x)=(x+6)q(x)+3.
$$

$q(x)$ is a quadratic that opens downward, with vertex $(-6,8)$, so

$$
q(x)=a(x+6)^2+8,\qquad a<0.
$$

Substitute back:

$$
f(x)=a(x+6)^3+8(x+6)+3.
$$

Set $t=x+6$. Then $f(-6+t)-3=at^3+8t$. Replacing $t$ by $-t$ only changes the sign of the right-hand side, so

$$
f(-6+t)+f(-6-t)=6.
$$

The average of the two $x$-coordinates is $-6$, and the average of the two $y$-coordinates is 3, so the center of symmetry is $(-6,3)$. The argument uses only polynomial division, the vertex form of a quadratic, and point symmetry. It does not use derivatives.

## What the figure shows

- **Pick a center**. Compare **(-6, 8)** with **(-6, 3)**, and separate the high point of the quotient from the center of symmetry of $f$.
- Drag **h**. On the left, the two points of the quotient stay at the same height, and on the right $P$ and $Q$ move with it.
- The midpoint $M$ of the segment $PQ$ on the right stays at $(-6,3)$.
