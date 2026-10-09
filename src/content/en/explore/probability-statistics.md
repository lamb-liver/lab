---
title: Classical and conditional probability
description: "All three modes ask the same thing: what the sample space is right now, and why intuition goes wrong."
category: Statistics
audience: High-school concept
concepts:
  - classical-probability
  - conditional-probability
date: 2026-05-26
order: 10
coverImage: /images/explore-covers/probability-statistics.png
featured: false
draft: false
---

## Idea

$$
P(A\mid B)=\frac{P(A\cap B)}{P(B)},\quad P(B)>0
$$

Conditional probability is the probability that $A$ happens, given that $B$ has happened. The sample space shrinks to the inside of $B$.

All three modes ask the same question: **what is the sample space right now**. Conditional probability cuts it down to $B$. In Monty Hall, the host's choice makes it uneven. The central limit theorem changes what is being observed, from a single trial to the average of $n$ trials. Intuition usually goes wrong because it is still using the old sample space to answer a new question.

## Interaction

- **Conditional probability**: drag the proportions of events $A$, $B$, and their intersection, and watch how $P(A\mid B)$ changes once the sample space is cut down to $B$
- **Central limit theorem**: set the sample size and speed and build up the statistics. Watch the average of repeated trials settle into a bell shape
- **Monty Hall**: try switching and staying again and again, and use the running statistics to compare the long-run win rates with intuition

Suggested order: conditional probability → central limit theorem → Monty Hall.

## What to notice

- All three modes change the sample space: cut it down to $B$, let new information make it uneven, or look at the average of $n$ trials instead of a single trial.
- Intuition usually goes wrong by answering a new question with the old space. Once the proportions in the figure change, the old "uniform" reading no longer holds.
- A single trial does not have to look like a bell. Once the thing being observed becomes the average, the same probability mass piles up again.

## Related

- [Conditional probability and Bayes' theorem](/en/works/conditional-probability-bayes/)
- [Binomial distribution to the normal distribution](/en/works/binomial-to-normal/)
- [Buffon's needle](/en/works/buffon-needle/)

## Further reading

- [Bayes' theorem (Wikipedia)](https://en.wikipedia.org/wiki/Bayes%27_theorem)
- [Central limit theorem (Wikipedia)](https://en.wikipedia.org/wiki/Central_limit_theorem)
- [Monty Hall problem (Wikipedia)](https://en.wikipedia.org/wiki/Monty_Hall_problem)
