---
title: Two-stage shots
description: Both 15 and the expected score rise when the weaker shooter qualifies.
subject: 高考數學
year: 2024
questionType: 非選
questionNo: '新課標II-18'
unit: Gaokao Mathematics, New Curriculum II, expected value
topics:
  - Two-stage shots
  - Expected value
concepts:
  - expected-value
sourceUrl: https://zhuanlan.zhihu.com/p/702452436
relatedExplore:
  - discrete-random-variables
relatedWorks:
  - binomial-geometric-distribution
date: 2026-11-11
order: 35
coverImage: /images/exam-covers/gaokao-2024-ii-two-stage-shooting.png
featured: false
draft: false
---

## Problem

Each player shoots one round of three shots. If the first player misses all three, the team is out and the score is 0. One hit is enough for the other player to shoot three shots, worth 5 points each. Only the second round counts.

A hits with probability $p=\dfrac{2}{5}$, and B hits with probability $q$, where $p<q$. Shots are independent.

When both the probability of scoring 15 and the expected score are to be as large as possible, A takes the qualifying round.

The stem here follows a candidate’s recollection. A compilation of this paper is on [Zhihu](https://zhuanlan.zhihu.com/p/702452436).

## Where it goes wrong

The two goals look as if they choose opposite orders. A score of 15 needs the second round to be three hits, so it is tempting to save the better shooter for the end. The expected score looks as if it wants the better shooter taking more shots. Both goals put the weaker shooter, A, on the qualifying round.

The other miss sends B first, since B is less likely to miss all three. A first does raise the chance that the team goes out. After the team qualifies, B shoots the three scoring shots, and both the chance of 15 and the expected score are larger.

## Idea

The probability of at least one hit in three shots is

$$
A(r)=1-(1-r)^3.
$$

When A qualifies, the probability of 15 is $A(p)\,q^3$. When B qualifies, it is $A(q)\,p^3$. Write

$$
f(t)=\dfrac{A(t)}{t^3}=\dfrac{3}{t^2}-\dfrac{3}{t}+1.
$$

On $(0,1)$, $f'(t)=\dfrac{3(t-2)}{t^3}<0$, so $f$ is strictly decreasing. Thus $p<q$ gives $A(p)\,q^3>A(q)\,p^3$.

The expected score is $15q\,A(p)$ when A goes first, and $15p\,A(q)$ when B goes first. The difference is

$$
15pq(q-p)(3-p-q).
$$

Since $p+q<2<3$, the difference is positive. Both goals put A on the qualifying round.

At $p=\dfrac{2}{5}$ and $q=\dfrac{1}{2}$, with A first, the probability of a score of at least 5 is $A(p)A(q)=\dfrac{343}{500}$.

## What the figure shows

- Drag “B’s hit rate”. A stays at 0.40. The panel marked 15 is the probability of scoring 15, and the panel marked E is the expected score. Gold is A on the qualifying round, white is B.
- Each panel uses its longer bar as the scale, so a small gap still shows which bar is longer.
- At 0.50, the rate given for B, gold is longer on both panels. With A first, the probability of at least 5 is 0.686.
- Dragging right makes B more accurate. Gold stays longer than white.
