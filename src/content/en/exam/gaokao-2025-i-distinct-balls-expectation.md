---
title: How many different balls in three draws
description: Draw three times with replacement and count the balls that appear. One indicator per ball adds up the expectation without listing the distribution.
subject: 高考數學
year: 2025
questionType: 選填
questionNo: '新課標I-14'
unit: Gaokao Mathematics, New Curriculum I, discrete random variables
topics:
  - Indicator variables
  - Linearity of expectation
  - Complementary events
concepts:
  - expected-value
  - classical-probability
sourceUrl: https://zy.21cnjy.com/23151851
relatedExplore:
  - discrete-random-variables
relatedWorks:
  - binomial-geometric-distribution
date: 2026-11-05
order: 20
coverImage: /images/exam-covers/gaokao-2025-i-distinct-balls-expectation.png
featured: false
draft: false
---

## Problem

A box holds 5 balls numbered 1 to 5. Draw three times with replacement. $X$ is the number of balls drawn at least once. Find $E(X)$.

The wording comes from candidate recall; see the [full-paper notes on 21cnjy](https://zy.21cnjy.com/23151851).

## Where it goes wrong

$X$ counts balls that appear, not draws. Drawing $2,2,5$ gives $X=2$.

When listing the distribution, the $X=2$ case is easy to undercount: choose two balls, then remove the outcomes where all three draws are the same ball.

For "a given ball is drawn", writing $3\times\tfrac15$ counts repeated draws twice. Use the complement.

## Idea

Give each ball an indicator $I_i$: $I_i=1$ if ball $i$ appears at least once, otherwise $0$. Then $X=I_1+\cdots+I_5$.

$$
P(I_i=1)=1-\left(\tfrac45\right)^3=\tfrac{61}{125}.
$$

Expectations add, even though the $I_i$ are not independent:

$$
E(X)=5\cdot\tfrac{61}{125}=\tfrac{61}{25}.
$$

Check by listing: $P(X=1)=\tfrac{5}{125}$, $P(X=2)=\tfrac{60}{125}$, $P(X=3)=\tfrac{60}{125}$, and the weighted sum is also $\tfrac{61}{25}$.

## What the figure shows

- Press **One round**: three draws, the balls that appear light up, and the number of lit lamps is this round's $X$.
- Press **100 rounds** or **1000 rounds**: each ball's bar settles near the dashed $\tfrac{61}{125}$, and the average of $X$ settles near $\tfrac{61}{25}=2.44$.
- The five bars add up to the average of $X$. That is linearity of expectation.
