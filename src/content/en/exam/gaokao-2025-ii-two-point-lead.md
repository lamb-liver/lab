---
title: A lead of two points
description: The gap ratio is the square of the odds. It equals 4 when the win rate is 2/3.
subject: 高考數學
year: 2025
questionType: 非選
questionNo: '新課標II-19'
unit: Gaokao Mathematics, New Curriculum II, classical probability
topics:
  - Two-point lead
  - Gap ratio
concepts:
  - classical-probability
sourceUrl: https://zhuanlan.zhihu.com/p/1914991760955912823
relatedExplore:
  - probability-statistics
relatedWorks:
  - buffon-needle
date: 2026-11-11
order: 34
coverImage: /images/exam-covers/gaokao-2025-ii-two-point-lead.png
featured: false
draft: false
---

## Problem

A wins each point with probability $p$, and B wins with probability $q=1-p$, where $\dfrac{1}{2}<p<1$. Points are independent. $p_k$ is the probability that A leads by at least two points after $k$ points, and $q_k$ is the probability that B does.

When $\dfrac{p_4-p_3}{q_4-q_3}=4$, the win rate is $p=\dfrac{2}{3}$. For every positive integer $m$,

$$
p_{2m+1}-q_{2m+1}<p_{2m}-q_{2m}<p_{2m+2}-q_{2m+2}.
$$

The stem here follows a candidate’s recollection. A write-up of this problem is on [Zhihu](https://zhuanlan.zhihu.com/p/1914991760955912823); compare the [gaokaohub entry](https://gaokaohub.com/q/item/215520347261238.html).

## Where it goes wrong

The gap ratio looks like $p/q$. A 4 then becomes $p=\dfrac{4}{5}$. The ratio is actually $\left(\dfrac{p}{q}\right)^2$, so $p/q=2$, and $p+q=1$ gives $\dfrac{2}{3}$.

It is also easy to count only a 4–0 score after four points. A 3–1 score is still a lead of two, and leaving it out makes $p_4$ wrong.

## Idea

After three points, A leads by two only by winning all three, so $p_3=p^3$. After four points, both 4–0 and 3–1 count:

$$
p_4=p^4+4p^3 q.
$$

Subtracting gives $p_4-p_3=3p^3 q$. On B’s side, $q_4-q_3=3q^3 p$. The ratio simplifies to $\left(\dfrac{p}{q}\right)^2$.

Set that ratio equal to 4 and get $\dfrac{p}{q}=2$. Together with $p+q=1$, this is $p=\dfrac{2}{3}$.

Write $d_k=p_k-q_k$ for the lead difference. After $2m$ points, a lead of exactly two is lost if the next point goes the other way, on either side. A is more likely than B to hold a lead of exactly two, so

$$
d_{2m+1}-d_{2m}=-\binom{2m}{m+1}(pq)^m(p-q)<0.
$$

One more point can turn a tie into a lead. Counting both points together,

$$
d_{2m+2}-d_{2m}=\binom{2m}{m}(pq)^m(p-q)>0.
$$

## What the figure shows

- Drag “Win rate per point”. The gold bar is how much A’s lead probability grows from three points to four, and the white bar is B’s. The tick on the gold bar is $p/q$. The gold bar is that number, squared, times the white bar.
- At $\dfrac{2}{3}$ the gap ratio reads 4. On the right, 3 is shorter than 2, and 4 is taller than 2.
- Dragging right raises the odds. The gap ratio grows as their square, and the white bar shrinks quickly. Odd counts still dip, and the next even count rises.
