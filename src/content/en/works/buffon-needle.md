---
title: Buffon's needle
description: Drop needles at random and estimate π from how often a needle crosses a line.
tags:
  - Probability and statistics
concepts:
  - classical-probability
audience: Intuitive exploration
date: 2026-05-26
order: 36
featured: false
draft: false
---

## Figure

A needle of length $\ell$ falls at random onto parallel lines spaced $d$ apart, with $\ell\le d$. The probability that the needle crosses a line is $2\ell/(\pi d)$. After many throws, the rate of crossings estimates $\pi$.

$$
P(\text{cross})=\frac{2\ell}{\pi d}
$$

$$
\pi \approx \frac{2\ell N}{d \cdot n}
$$

$N$ is the number of throws and $n$ is the number of crossings. This is the short-needle case only.

## Interaction

- **Needle length ℓ** and **Line spacing d**: their ratio sets the probability above, and how fast the estimate settles. The experiment keeps $\ell\le d$
- **Throws per frame**: each frame drops that many needles, marks each crossing, and adds to the count. The curve plots the number of throws against the running estimate of $\pi$
- **Reset**: clear the needles and the estimate
- The lines stay equally spaced, and a needle that crosses one is highlighted

## What to notice

- A crossing is a needle that meets one of the parallel lines. A miss is drawn dimmer.
- While $\ell\le d$, the probability of a crossing is $2\ell/(\pi d)$. The estimate is $2\ell N/(d\,n)$.
- More throws pull the curve toward $\pi$. Changing $\ell/d$ changes that probability, and how quickly the estimate settles.

## Related

- [Conditional probability and Bayes' theorem](/en/works/conditional-probability-bayes/)
- [Binomial distribution to the normal distribution](/en/works/binomial-to-normal/)

## Further reading

- [Buffon's needle problem (Wikipedia)](https://en.wikipedia.org/wiki/Buffon%27s_needle_problem)
