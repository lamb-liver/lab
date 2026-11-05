---
title: Stationary share
description: Two states swap at fixed rates, so the long-run share of each side is fixed.
tags:
  - Probability and statistics
concepts:
  - conditional-probability
audience: University concept
prerequisites:
  - "Conditional probability and Bayes' theorem"
date: 2026-11-04
order: 83
featured: false
draft: false
---

## Parametric equations

States A and B trade at fixed rates. The rate of leaving A is $a$, and the rate of leaving B is $b$. Both run from 0.05 to 1.

After a long time, the share of A is $b/(a+b)$ and the share of B is $a/(a+b)$. The two shares add to 1. The flow leaving A equals the flow returning to A, so $a$ times the share of A equals $b$ times the share of B. The side that is left less often holds the larger share. Equal rates split the line in half.

$$
\pi_A=\frac{b}{a+b}
$$

## Interaction

- **Leave A**: change the rate of leaving A; the gold segment and the dividing point update together
- **Leave B**: change the rate of leaving B; the gold segment and the dividing point update together

## What to notice

- The share of A equals the rate of leaving B divided by the sum of both leaving rates.
- Equal leaving rates split the segment in half.
- The side that is left less often holds the larger share.

## Related

- [Conditional probability and Bayes' theorem](/en/works/conditional-probability-bayes/)

## Further reading

- [Markov chain (Wikipedia)](https://en.wikipedia.org/wiki/Markov_chain)
