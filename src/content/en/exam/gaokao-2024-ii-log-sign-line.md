---
title: Where the sign changes meet
description: It stays non-negative only when the sign changes meet, at squared distance 1/2.
subject: 高考數學
year: 2024
questionType: 單選
questionNo: '新課標II-8'
unit: Gaokao Mathematics, New Curriculum II, exponents and logarithms
topics:
  - Sign changes
  - Distance from a point to a line
concepts:
  - exponential-logarithm
sourceUrl: https://zhuanlan.zhihu.com/p/702452436
relatedExplore:
  - exponential-logarithm
relatedWorks:
  - natural-log-e-geometry
date: 2026-11-11
order: 33
coverImage: /images/exam-covers/gaokao-2024-ii-log-sign-line.png
featured: false
draft: false
---

## Problem

$(x+a)\ln(x+b)$ stays non-negative on its whole domain. The two factors change sign at the same place, so the point $(a,b)$ lies on the line $b-a=1$. Then $a^{2}+b^{2}$ is the squared distance from the origin, and its least value is $\dfrac{1}{2}$.

The stem here follows a candidate’s recollection. The full paper, as recalled, is in a [Zhihu compilation](https://zhuanlan.zhihu.com/p/702452436); compare the [Math173 solution](http://lanqi.org/everyday/36028/).

## Where it goes wrong

The circle touches the line at the foot. Points inside the circle are closer to the origin, so the squared distance is less than $\dfrac{1}{2}$, and those points are off the line. The linear factor and the logarithm change sign at different places, and the function is negative between them.

## Idea

Write $f(x)=(x+a)\ln(x+b)$. The domain is $x>-b$. The linear factor changes sign at $x=-a$, and the logarithm changes sign at $x=1-b$.

The two places meet when $-a=1-b$, that is $b=a+1$. With $t=x+b>0$,

$$
f(x)=(t-1)\ln t.
$$

Both factors are positive for $t>1$ and both are negative for $0<t<1$, so $f(x)\ge 0$.

The distance from the origin to the line $b-a-1=0$ is $\dfrac{1}{\sqrt{2}}$, and the squared distance is $\dfrac{1}{2}$. The foot is $a=-\dfrac{1}{2}$, $b=\dfrac{1}{2}$.

## What the figure shows

- Drag Offset from the line. The white point moves along the perpendicular. The gold line is $b=a+1$, and the circle touches it at the foot.
- At offset 0 the squared distance reads $\dfrac{1}{2}$. On the function graph the two sign changes sit together, and the curve does not fall below the axis.
- Drag toward the origin. The white point enters the circle, the squared distance drops below $\dfrac{1}{2}$, the sign changes split, and the stretch between them is negative.
