---
title: Discrete random variables and distributions
description: One bar chart can be read as a center, a spread, and a tail, and the probability mass shifts when the counting question changes.
category: Statistics
concepts:
  - probability-distribution
  - expected-value
audience: High-school concept
date: 2026-07-19
order: 18
coverImage: /images/explore-covers/discrete-random-variables.png
featured: false
draft: false
---

## Idea

A discrete random variable puts its probability mass on countably many places. On this bar chart, look first at where the mass sits, then at how far it spreads from the center, and then at how a different counting question changes the tail.

$$
\sum_k P(X=x_k)=1
$$

This page only practices those three readings of one bar chart: position, spread, and tail. Comparing the distribution models is left to the binomial and geometric page and the normal-approximation page.

## Interaction

- **Position**: drag a bar on the chart and watch the $\mu$ mark follow
- **Spread**: keep the same center, and switch **Concentrated**, **Uniform**, and **Bimodal** to see the spread change
- **Tail**: switch **Binomial** and **Geometric**, and compare a fixed upper bound with a long waiting-time tail. **Trials n** is only on the binomial chart. **Success p** and **Threshold k** set the cutoff

Suggested order: Position, then Spread, then Tail.

## What to notice

- The probabilities sum to $1$. When some bars move, the others have to make up the difference, or the distribution is no longer valid.
- The center and the spread are two readings of the same bar chart. One asks where the center is. The other asks how far the mass sits from that center.
- When the counting question changes, the support and the tail change first. The difference in the formulas is the algebraic form of that difference in shape.

## Related

- [Binomial and geometric distributions](/en/works/binomial-geometric-distribution/)
- [Binomial distribution to the normal distribution](/en/works/binomial-to-normal/)

## Further reading

- [Random variable (Wikipedia)](https://en.wikipedia.org/wiki/Random_variable)
- [Expected value (Wikipedia)](https://en.wikipedia.org/wiki/Expected_value)
- [Binomial distribution (Wikipedia)](https://en.wikipedia.org/wiki/Binomial_distribution)
- [Geometric distribution (Wikipedia)](https://en.wikipedia.org/wiki/Geometric_distribution)
