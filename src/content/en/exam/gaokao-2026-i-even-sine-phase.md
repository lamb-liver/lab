---
title: A sine phase that is even and rising
description: If 2sin(ax + θ) is even, x = 0 is a peak or a trough. To rise on (0, π/2) it must be a trough, so θ = 3π/2.
subject: 高考數學
year: 2026
questionType: 選填
questionNo: '新課標I-13'
unit: Gaokao Mathematics, New Curriculum I, trigonometric functions
topics:
  - Trig graphs
  - Even functions
  - Monotonicity
concepts:
  - trig-functions
sourceUrl: https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34466.html
relatedExplore:
  - trig-function-graphs
relatedWorks:
  - sinusoid-amplitude-period-phase
date: 2026-11-06
order: 30
coverImage: /images/exam-covers/gaokao-2026-i-even-sine-phase.png
featured: false
draft: false
---

## Problem

$f(x)=2\sin(ax+\theta)$ with $a$ a positive integer and $0\le\theta<2\pi$. $f$ is even and increasing on $(0,\tfrac{\pi}{2})$. Find $\theta$ and $f(\tfrac{2\pi}{3})$.

The wording comes from candidate recall; see the [91apu write-up](https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34466.html), and compare the [solutions on book118](https://max.book118.com/html/2026/0629/7136140034011126.shtm). Recall versions differ in the blanks: some ask for $a$ and $\theta$, some write $a\in\mathbb Z$. $\theta=\tfrac{3\pi}{2}$ and $f(\tfrac{2\pi}{3})=1$ hold in every version.

## Where it goes wrong

Using only evenness gives $\theta=\tfrac{\pi}{2}$ or $\tfrac{3\pi}{2}$, and the increasing condition never gets used to drop one.

Another slip is thinking $a$ must be unique before computing $f(\tfrac{2\pi}{3})$. Both $a=1$ and $a=2$ work, and they give the same value.

## Idea

Evenness needs $\sin\theta=\pm1$, so $x=0$ is a peak or a trough. With $\theta=\tfrac{\pi}{2}$, $f(0)=2$ is the maximum and the graph can only fall to the right.

With $\theta=\tfrac{3\pi}{2}$, $f(x)=-2\cos(ax)$ climbs from a trough for half a period before it peaks, so

$$
a\cdot\frac{\pi}{2}\le\pi,\qquad a=1\text{ or }2.
$$

$a=1$: $-2\cos\tfrac{2\pi}{3}=1$; $a=2$: $-2\cos\tfrac{4\pi}{3}=1$. The answer is $\theta=\tfrac{3\pi}{2}$ and $f(\tfrac{2\pi}{3})=1$.

## What the figure shows

- Pick one of eight values of $\theta$. $f$ is even only when the dashed cyan $f(-x)$ lies on the gold $f(x)$, which happens for $\tfrac{\pi}{2}$ and $\tfrac{3\pi}{2}$.
- The shaded band is $(0,\tfrac{\pi}{2})$. With $\theta=\tfrac{3\pi}{2}$, change $a$: from $a=3$ on, the curve turns down inside the band.
- The white dot is $x=\tfrac{2\pi}{3}$; it sits at 1 for both $a=1$ and $a=2$.
