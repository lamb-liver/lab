---
title: "Conditional probability and Bayes' theorem"
description: Tree diagrams and area ratios show what P(A|B) means, and how Bayes' theorem updates it.
tags:
  - Probability and statistics
concepts:
  - conditional-probability
audience: High-school concept
date: 2026-05-26
order: 34
featured: false
draft: false
---

## Figure

$P(A\mid B)$ is how likely $A$ is once $B$ has already happened. Bayes' theorem ties that probability to $P(B\mid A)$, the probability of the result given the cause. It is the core of how diagnosis, screening, and machine learning update a belief.

Conditional probability:

$$
P(A\mid B)=\frac{P(A\cap B)}{P(B)},\quad P(B)>0
$$

Bayes' theorem:

$$
P(A\mid B)=\frac{P(B\mid A)\,P(A)}{P(B)}
$$

The law of total probability is often written

$$
P(B)=\sum_i P(B\mid A_i)P(A_i)
$$

and that sum is how the denominator expands.

## Interaction

- **Prior P(A)**: change the probability before the evidence, and watch the same evidence lead to a different posterior
- **Conditional P(B|A)** and **Conditional P(B|¬A)**: change the two conditional probabilities, and compare how a false positive shifts the conclusion
- **Tree**, **Area model**, and **Bayes update**: switch among branch products, area ratios, and the bars for $P(A)$, $P(B)$, and $P(A\mid B)$
- **Medical test**, **Card draw**, and **Spam**: replace the letters $A$ and $B$ with a concrete pair of events

## Related

- [Binomial distribution to the normal distribution](/en/works/binomial-to-normal/)
- [Buffon's needle](/en/works/buffon-needle/)

## Further reading

- [Bayes' theorem (Wikipedia)](https://en.wikipedia.org/wiki/Bayes%27_theorem)
