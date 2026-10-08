---
title: Binomial distribution to the normal distribution
description: The histogram of successes in n trials moves toward a bell-shaped normal curve as n grows.
tags:
  - Probability and statistics
concepts:
  - probability-distribution
audience: High-school concept
date: 2026-05-26
order: 35
featured: false
draft: false
---

## Figure

The binomial distribution $\mathrm{B}(n,p)$ is the probability of the number of successes $X$ in $n$ independent trials. When $n$ is large and $p$ is not extreme, $X$ can be approximated by the normal distribution with mean $np$ and variance $np(1-p)$. The standardized $Z$ is then approximately standard normal.

$$
P(X=k)=\binom{n}{k}p^k(1-p)^{n-k},\quad k=0,1,\ldots,n
$$

Normal approximation, after standardizing:

$$
Z=\frac{X-np}{\sqrt{np(1-p)}}\approx \mathcal{N}(0,1)
$$

Density:

$$
\phi(x)=\frac{1}{\sqrt{2\pi}}e^{-x^2/2}
$$

## Interaction

- **Trials n**: hold **Probability p** fixed and drag $n$ from small to large. The bars move toward the bell curve
- **X distribution**: the continuous density with mean $np$ and variance $np(1-p)$ is drawn over the discrete bars
- **Standardized Z**: switch between $X$ and $Z$, and watch the mean and the scale settle
- **Bernoulli trials**: run one sequence of Bernoulli trials and compare the accumulated successes with the theoretical bars
- **Sample**: draw a new sequence
- **Reset**: clear that sequence

## Related

- [Conditional probability and Bayes' theorem](/en/works/conditional-probability-bayes/)
- [Pascal's triangle](/en/works/pascals-triangle/)
- [Buffon's needle](/en/works/buffon-needle/)

## Further reading

- [Binomial distribution (Wikipedia)](https://en.wikipedia.org/wiki/Binomial_distribution)
- [De Moivre–Laplace theorem (Wikipedia)](https://en.wikipedia.org/wiki/De_Moivre%E2%80%93Laplace_theorem)
