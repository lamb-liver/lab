---
title: Pairing the 108 pagodas into an arithmetic sequence
description: Pair the pagoda counts of 12 rows so the pair sums form an arithmetic sequence. Parity and a positive first term force the common difference to be 4.
subject: 高考數學
year: 2026
questionType: 單選
questionNo: '新課標I-7'
unit: Gaokao Mathematics, New Curriculum I, sequences
topics:
  - Arithmetic sequences
  - Parity
  - Pairing
concepts:
  - sequences-series
sourceUrl: https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34460.html
relatedExplore:
  - sequences-and-series
relatedWorks:
  - arithmetic-geometric-sequences
date: 2026-11-06
order: 26
coverImage: /images/exam-covers/gaokao-2026-i-tower-pairing.png
featured: false
draft: false
---

## Problem

The 108 Pagodas stand in 12 rows of 1, 3, 3, 5, 5, 7, 9, 11, 13, 15, 17, 19 pagodas, 108 in all. Split the 12 numbers into 6 pairs so the 6 pair sums, in increasing order, form an arithmetic sequence with difference $d>0$. The options are $d=2,4,6,8$.

The wording comes from candidate recall; see the [91apu write-up](https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34460.html), and compare the [lewang 2026 solutions](https://gk2026math.lewang.dev/solutions).

## Where it goes wrong

Trying pairings by hand: there are too many, and a failed attempt does not tell you whether $d$ is wrong or you missed a pairing.

Another slip is to stop at $b_1+b_6=36$, conclude only that $d$ is even, and guess among 2, 4, 6. Even is not enough; the pair sums carry their own constraint.

## Idea

Call the sums $b_1<\dots<b_6$. Their total is $6b_1+15d=108$, so

$$
b_1=18-\tfrac{5d}{2}.
$$

Every number is odd, and odd plus odd is even, so all six sums are even. For $b_1$ to be even, $\tfrac{5d}{2}$ must be even, so $d$ is a multiple of 4. Then $b_1>0$ gives $d<7.2$, which leaves $d=4$.

With $d=4$ the sums are 8, 12, 16, 20, 24, 28, and a pairing exists: $3+5$, $3+9$, $5+11$, $1+19$, $7+17$, $13+15$. The answer is B.

## What the figure shows

- Pick one of the four values of $d$. The 6 dashed boxes are the target sums. A bad sum is labelled with the reason, such as odd or not positive.
- Only $d=4$ fills in a pairing. Each bar has two segments, gold and cyan, one per row; the full length is the pair sum.
- "Another pairing" cycles through the other pairings. Used numbers in the bottom row are dimmed.
