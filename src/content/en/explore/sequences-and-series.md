---
title: Sequences and series
description: One rule for the next term can make a partial sum converge or diverge, or send an orbit into a dense cloud of points.
category: Analysis
concepts:
  - sequences-series
  - taylor-approximation
audience: High-school concept
date: 2026-05-26
order: 8
coverImage: /images/explore-covers/sequences-and-series.png
featured: false
draft: false
---

## Idea

Arithmetic sequence:

$$
a_n = a_1 + (n-1)d
$$

Geometric sequence:

$$
a_n = a_1 \cdot r^{n-1}
$$

Arithmetic and geometric sequences are the basic patterns. A recurrence defines later terms from earlier ones, for example $a_n=a_{n-1}+a_{n-2}$. The recurrence drawn here is the one-step rule $a_n=\lambda a_{n-1}+c$.

## Interaction

- **Sequence plot**: plot $a_n$ against $n$, and compare linear arithmetic growth with geometric growth
- **Partial sums**: show the partial sum $S_n$, and watch whether it approaches a finite value when the absolute value of the ratio is less than $1$
- **Logistic iteration**: for $x_{n+1}=rx_n(1-x_n)$, change $r$ and watch a fixed point, a cycle, or chaos

Suggested order: Arithmetic or Geometric, then partial sums, then raise $r$ to see branching and chaos. On the bifurcation diagram, drag the red line to change $r$.

## What to notice

- The next term can add the same difference, multiply by the same ratio, or feed the output back into the rule. All three are one discrete step. The rule is what changes.
- A partial sum asks whether those steps stay under a ceiling. Here the geometric ratio has absolute value less than $1$, so that partial sum approaches a finite value, while the harmonic series keeps rising.
- Feeding the output back in, the parameter can hold the orbit at a fixed point, a short cycle, or a cloud of points. That is the same kind of repetition as adding the next term.

## Related

- [Taylor polynomial approximation](/en/works/taylor-polynomial-approximation/)
- [Arithmetic and geometric sequences](/en/works/arithmetic-geometric-sequences/)
- [Fibonacci spiral](/en/works/fibonacci-spiral/)
- [Sierpinski triangle](/works/sierpinski-triangle/)
- [Basel problem](/en/works/basel-problem/)
- [Logistic map bifurcation diagram](/works/logistic-bifurcation/)

## Further reading

- [Series (mathematics) (Wikipedia)](https://en.wikipedia.org/wiki/Series_(mathematics))
- [Logistic map (Wikipedia)](https://en.wikipedia.org/wiki/Logistic_map)
- [Basel problem (Wikipedia)](https://en.wikipedia.org/wiki/Basel_problem)
