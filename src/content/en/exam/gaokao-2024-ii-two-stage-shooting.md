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

The contest has two rounds of three shots, one player per round. The first is a qualifying round: if the first player misses all three, the team is out with a score of 0. One hit sends the other player to shoot three shots, worth 5 points each. Only the second round counts.

A hits with probability $p$ and B with probability $q$. Shots are independent. Part 1 gives $p=0.4$ and $q=0.5$ with A on the qualifying round, and the probability of scoring at least 5 is $0.686$. Part 2 only assumes $0<p<q$: to make the chance of 15 as large as possible, or the expected score as large as possible, A takes the qualifying round either way.

The stem here follows a candidate’s recollection. A compilation of this paper is on [Zhihu](https://zhuanlan.zhihu.com/p/702452436); compare the [gaokaohub entry](https://gaokaohub.com/q/item/216738189570010.html).

## Where it goes wrong

The usual instinct sends B first, since B is less likely to miss all three. A first does raise the chance that the team goes out. But one hit is enough to qualify, so most of B’s accuracy is wasted there. After the team qualifies, B shoots the three scoring shots, and both the chance of 15 and the expected score are larger.

Another instinct expects the two goals to pick different players. Both are the chance of qualifying times how the second round goes. Moving B to the second round raises the second-round factor by more than it lowers the chance of qualifying, and that holds for both goals.

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

At $p=0.4$ and $q=0.5$, with A first, the probability of a score of at least 5 is $A(p)A(q)=\dfrac{343}{500}$.

## What the figure shows

- Drag “B’s hit rate”. A stays at 0.40, the rate from part 1. The panel marked P(15) is the probability of scoring 15, and the panel marked E is the expected score. Gold is A on the qualifying round, white is B.
- Each panel uses its longer bar as the scale, so a small gap still shows which bar is longer.
- At 0.50, B’s rate in part 1, gold is longer on both panels. With A first, the probability of at least 5 is 0.686.
- Dragging right makes B more accurate. Gold stays longer than white.
