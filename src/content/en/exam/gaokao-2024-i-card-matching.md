---
title: The 24 matchings of a horse-race card game
description: A holds 1, 3, 5, 7 and B holds 2, 4, 6, 8. The order of play does not change the score, so only the 24 matchings matter, and exactly 12 give A at least 2 points.
subject: 高考數學
year: 2024
questionType: 選填
questionNo: '新課標I-14'
unit: Gaokao Mathematics, New Curriculum I, counting and probability
topics:
  - Permutations
  - Classical probability
  - Tian Ji's horse race
concepts:
  - permutation-combination
  - classical-probability
sourceUrl: https://gaokaohub.com/q/item/238279886096626.html
relatedExplore:
  - permutations-combinations
relatedWorks:
  - combinatorial-path-counting
date: 2026-11-06
order: 31
coverImage: /images/exam-covers/gaokao-2024-i-card-matching.png
featured: false
draft: false
---

## Problem

A has four cards marked 1, 3, 5, 7, and B has 2, 4, 6, 8. They play four rounds; in each round both play a random unused card, and the larger card scores 1 point. Find the probability that A scores at least 2.

The wording comes from candidate recall; see the [gaokaohub entry](https://gaokaohub.com/q/item/238279886096626.html), and compare the [liangshibao solution](https://liangshibao.com/tiku/gaokao-math-2024-i/fill-14).

## Where it goes wrong

Treating the rounds as ordered puts $4!\times4!=576$ in the denominator while the numerator counts only matchings, which is off by a factor of 24.

Another slip: each of B's cards beats the matching card of A's, so it feels like A should rarely score well, and people guess a small number.

## Idea

The score depends only on which of B's cards each of A's cards meets, not on the round. There are $4!=24$ matchings, all equally likely.

A's 1 always loses, so A scores at most 3. Three points happens one way: $3$–$2$, $5$–$4$, $7$–$6$, $1$–$8$. Zero points also happens one way: $1$–$2$, $3$–$4$, $5$–$6$, $7$–$8$.

A wins a round with probability $\tfrac{6}{16}=\tfrac38$, so the expected score is $\tfrac32$. With $n_k$ matchings scoring $k$:

$$
n_1+n_2=22,\qquad n_1+2n_2+3=36,
$$

so $n_2=11$. At least 2 points happens $11+1=12$ ways, and the probability is $\tfrac{12}{24}=\tfrac12$.

## What the figure shows

- The top shows one matching; gold lines are rounds A wins. "Previous" and "Next" step through all 24.
- The 24 tiles below show A's score; gold tiles score at least 2, exactly half of them.
- "Only score ≥ 2" makes the steps stop only on gold tiles. The sidebar counts the matchings for 0 to 3 points.
