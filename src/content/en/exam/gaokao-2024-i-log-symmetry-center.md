---
title: The center stays at (1, a)
description: The center of symmetry stays at (1, a) after the cubic term is added.
subject: 高考數學
year: 2024
questionType: 非選
questionNo: '新課標I-18'
unit: Gaokao Mathematics, New Curriculum I, center of symmetry
topics:
  - Center of symmetry
  - Logarithm
concepts:
  - derivative-tangent
sourceUrl: https://zhuanlan.zhihu.com/p/2015711118853697677
relatedExplore:
  - secants-and-tangents
relatedWorks:
  - function-derivative-graph
date: 2026-11-16
order: 36
coverImage: /images/exam-covers/gaokao-2024-i-log-symmetry-center.png
featured: false
draft: false
---

## Problem

$f(x)=\ln\dfrac{x}{2-x}+ax+b(x-1)^3$ on $(0,2)$. The curve is symmetric about the point $(1,a)$. When $b=0$, the least $a$ that keeps the derivative non-negative is $-2$.

The stem here follows a candidate’s recollection, in a [Zhihu walkthrough](https://zhuanlan.zhihu.com/p/2015711118853697677); compare the [gaokaohub entry](https://gaokaohub.com/q/item/241069179211677.html).

## Where it goes wrong

The domain is centered at $x=1$, and $f(1)=a$. The center’s height is $a$, not $0$. The term $(x-1)^3$ is odd about $x=1$, so adding it leaves the center at $(1,a)$.

When $b=0$, the derivative is $\dfrac{2}{x(2-x)}+a$. The product $x(2-x)$ is largest at $x=1$, where it equals $1$, so the least slope is $2+a$. The derivative stays non-negative only for $a\ge -2$. A slope near either end is larger than the slope at $x=1$, so treating it as the least slope makes the lower bound for $a$ smaller than $-2$.

## Idea

Set $t=x-1$. Then $f(1+t)+f(1-t)=2a$. The midpoint of $(1+t,\,f(1+t))$ and $(1-t,\,f(1-t))$ is $(1,a)$. The slope at the center is $2+a$; the cubic term contributes nothing there.

If $f(x)>-2$ holds exactly on $(1,2)$, then $a=-2$. Symmetry pushes the left side under $-2$, and the right side needs $b\ge -\dfrac{2}{3}$.

## What the figure shows

- Drag “Cubic term”. This page fixes $a=1$, so the gold point is $(1,1)$. The white segment joins a pair of points on the curve, and its midpoint stays on the gold point.
- At cubic term $0$, the tangent at the center has slope $3$.
- A larger cubic term lifts one side and lowers the other. The gold point and the short gold line stay put.
