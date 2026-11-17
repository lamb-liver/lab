---
title: Sum and difference of two angles
description: The difference cosine is −3 times the sum cosine when the tangent product is 2.
subject: 高考數學
year: 2024
questionType: 單選
questionNo: '新課標I-4'
unit: Gaokao Mathematics, New Curriculum I, trigonometric identities
topics:
  - Sum and difference formulas
  - Product of tangents
concepts:
  - trig-identities
sourceUrl: https://zhuanlan.zhihu.com/p/702451963
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - trig-angle-identities
date: 2026-11-11
order: 32
coverImage: /images/exam-covers/gaokao-2024-i-sum-difference-cosine.png
featured: false
draft: false
---

## Problem

The tangents of two angles multiply to 2, and the cosine of their sum is $m$. The cosine of the difference is fixed by $m$.

The stem here follows a candidate’s recollection. The full paper, as recalled, is in a [Zhihu compilation](https://zhuanlan.zhihu.com/p/702451963); compare the [gaokaohub entry](https://gaokaohub.com/q/item/230858902608230.html).

## Where it goes wrong

Writing $3m$ loses the minus sign that the product 2 produces. Writing $-\dfrac{m}{3}$ swaps the sum and the difference, and dropping the sign as well gives $\dfrac{m}{3}$.

For another positive product $k$ the factor is $\dfrac{1+k}{1-k}$. It equals $-3$ only at $k=2$. At $k=1$ the cosine of the sum is 0 and the factor is undefined; near $k=1$ the cosine of the sum is near 0.

If $|m|>\tfrac13$, then $|-3m|>1$, and no such angles exist. If either angle has cosine 0, its tangent is undefined.

## Idea

Write $P=\cos\alpha\cos\beta$ and $Q=\sin\alpha\sin\beta$. The product $\tan\alpha\tan\beta=k$ says $Q/P=k$, so $Q=kP$. Neither cosine is 0.

$$
\cos(\alpha+\beta)=P-Q=P(1-k),\qquad \cos(\alpha-\beta)=P+Q=P(1+k).
$$

When $k\neq 1$,

$$
\cos(\alpha-\beta)=\frac{1+k}{1-k}\cos(\alpha+\beta).
$$

At $k=2$, $\cos(\alpha+\beta)=-P=m$, so $P=-m$ and $\cos(\alpha-\beta)=3P=-3m$.

## What the figure shows

- Drag “Tangent product”. The white ray is fixed at $\pi/4$ only so one slider can draw both rays, and the tangent of the gold ray equals the product. The white point is the sum, the gold point is the difference, and the segments on the horizontal axis are their cosines.
- At product 2 the difference reads $-3m$. The gold segment is three times the white one and points the other way.
- Near product 1 the sum is near a right angle, the white segment shrinks away, and the reading stops naming a multiple.
