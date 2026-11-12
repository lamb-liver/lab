---
title: The parameter that makes the maximum 1
description: Every peak of f(x) = (x+2)/(eˣ + a) lies on y = e^(−x), so a maximum of 1 can only happen at x = 0, which gives a = 1.
subject: 高考數學
year: 2026
questionType: 單選
questionNo: '新課標I-6'
unit: Gaokao Mathematics, New Curriculum I, derivatives and extrema
topics:
  - Extrema by derivatives
  - Critical points
  - Functions with a parameter
concepts:
  - derivative-tangent
  - exponential-logarithm
sourceUrl: https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34459.html
relatedExplore:
  - secants-and-tangents
relatedWorks:
  - function-derivative-graph
date: 2026-11-06
order: 29
coverImage: /images/exam-covers/gaokao-2026-i-max-value-parameter.png
featured: false
draft: false
---

## Problem

The function $f(x)=\dfrac{x+2}{e^x+a}$ has maximum value 1. Find $a$. The options are $\tfrac12$, $1$, $\tfrac32$, $2$.

The wording comes from candidate recall; see the [91apu write-up](https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34459.html), and compare the [lewang 2026 solutions](https://gk2026math.lewang.dev/solutions).

## Where it goes wrong

A common move is to set $f(x)=1$ and solve for $a$. That only says the graph touches $y=1$, not that 1 is the maximum.

Another is to try each option and differentiate. Each one leads to the equation $(x+1)e^x=a$, which has no closed form, and the work stalls.

## Idea

$$
f'(x)=\frac{a-(x+1)e^x}{(e^x+a)^2}.
$$

For $a>0$ the numerator $a-(x+1)e^x$ is positive and then negative, so there is one critical point $x_0$, the maximum, with $a=(x_0+1)e^{x_0}$. Substitute back:

$$
f(x_0)=\frac{x_0+2}{e^{x_0}+(x_0+1)e^{x_0}}=e^{-x_0}.
$$

So for every $a$ the peak lies on the curve $y=e^{-x}$. A maximum of 1 means $e^{-x_0}=1$, so $x_0=0$, and $a=(0+1)e^0=1$. The answer is B.

## What the figure shows

- Drag $a$. The peak of the gold curve slides along the dashed cyan curve $y=e^{-x}$.
- The sidebar shows $x_0$ and the maximum, which always equals $e^{-x_0}$.
- Of the four options, only B puts the peak on the dashed line $y=1$.
