---
title: Order of three log equations
description: When 2 + log₂x = 3 + log₃y = 5 + log₅z, the logs become three straight lines, and their crossings decide which order never appears.
subject: 高考數學
year: 2025
questionType: 單選
questionNo: '新課標I-8'
unit: Gaokao Mathematics, New Curriculum I, exponentials and logarithms
topics:
  - Shared parameter
  - Growth of exponentials
  - Comparing logarithms
concepts:
  - exponential-logarithm
sourceUrl: https://zy.21cnjy.com/23151851
relatedExplore:
  - exponential-logarithm
relatedWorks:
  - logarithmic-scale
date: 2026-11-05
order: 19
coverImage: /images/exam-covers/gaokao-2025-i-log-offset-order.png
featured: false
draft: false
---

## The problem

Real numbers $x,y,z$ satisfy $2+\log_2 x=3+\log_3 y=5+\log_5 z$. Each of the four options gives an order from largest to smallest. Find the one that cannot happen.

The wording comes from candidate recall; see the [full-paper notes on 21cnjy](https://zy.21cnjy.com/23151851).

## Why students get it wrong

The usual move is to plug in a few values. An order you hit is possible, but an order you miss is not proven impossible, so guessing from samples is risky.

Another trap is assuming the larger base always gives the larger number. For small $k$ it is the other way round: $x$ is largest and $z$ smallest.

## The idea

Call the shared value $k$. Then

$$
x=2^{k-2},\quad y=3^{k-3},\quad z=5^{k-5}.
$$

Taking natural logs, $\ln x=(k-2)\ln 2$, $\ln y=(k-3)\ln 3$ and $\ln z=(k-5)\ln 5$ are straight lines in $k$ with increasing slopes. They cross at $k\approx 4.71$ ($x=y$), $k\approx 7.27$ ($x=z$) and $k\approx 9.30$ ($y=z$), cutting the $k$ axis into four stretches:

$$
x>y>z,\quad y>x>z,\quad y>z>x,\quad z>y>x.
$$

$x>z>y$ would need $x$ to pass $z$ before $y$ passes $x$, but $x=z$ happens after $x=y$, so it cannot occur. The answer is B.

## How to read the figure

- Drag the shared value k: three dots slide along the lines $\ln x$, $\ln y$, $\ln z$, and the sidebar shows approximate $x,y,z$.
- The order changes once at each crossing. The four orders are written under the axis.
- The sidebar marks which options appear. Sweep the whole axis and B never does.
