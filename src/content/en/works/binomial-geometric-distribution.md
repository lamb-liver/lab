---
title: Binomial and geometric distributions
description: Switch the binomial B(n, p) and the geometric Geo(p), and drag p to compare the bars with E(X) and Var(X).
tags:
  - Probability and statistics
concepts:
  - probability-distribution
audience: High-school concept
date: 2026-06-10
order: 62
featured: false
draft: false
---

## Parametric equations

The binomial distribution $\mathrm{B}(n,p)$: $n$ independent trials, success probability $p$ on each trial, and $X$ the number of successes, so $X\in\{0,1,\ldots,n\}$.

$$
P(X=k)=\binom{n}{k}p^k(1-p)^{n-k}
$$

$$
E(X)=np,\quad \mathrm{Var}(X)=np(1-p)
$$

The geometric distribution $\mathrm{Geo}(p)$: success probability $p$ on each trial, and $X$ the number of failures before the first success, so $X\in\{0,1,2,\ldots\}$.

$$
P(X=k)=(1-p)^k p
$$

$$
E(X)=\frac{1-p}{p},\quad \mathrm{Var}(X)=\frac{1-p}{p^2}
$$

This page uses the count of failures before the first success, so the geometric distribution starts at $0$. If $X$ is instead the number of trials until the first success, the values are $\{1,2,\ldots\}$ and $E(X)=1/p$.

## Interaction

- **Binomial** and **Geometric**: switch the bars and the formulas together
- **Success probability p**: drag $p$ and watch the bar shape, $E(X)$, and $\mathrm{Var}(X)$
- **Trials n**: in the binomial view, change $n$ and watch how many bars there are and where the peak sits
- **E(X)**: the mark stays on the chart, with the band from $E(X)-\sigma$ to $E(X)+\sigma$, so the two distributions can be compared for how tightly they sit

## What to notice

- The binomial distribution stops at $n$, so the bars run only from $0$ to $n$. The geometric distribution can reach large values, and its right tail is longer.
- As $p$ increases, the binomial mean $E(X)=np$ grows in proportion to $p$. For this failures-before-first-success geometric distribution, $E(X)=(1-p)/p$ falls, and not in a straight line.
- Both use the same success probability $p$ on each trial. One counts successes in a fixed number of trials. The other counts the failures before the first success.

## Related

- [Binomial distribution to the normal distribution](/en/works/binomial-to-normal/)

## Further reading

- [Binomial distribution (Wikipedia)](https://en.wikipedia.org/wiki/Binomial_distribution)
- [Geometric distribution (Wikipedia)](https://en.wikipedia.org/wiki/Geometric_distribution)
