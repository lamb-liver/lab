---
title: Arithmetic and geometric sequences
description: Bars and equal-height rectangles show arithmetic and geometric sequences and the formulas for their sums.
tags:
  - Functions and analysis
concepts:
  - sequences-series
audience: High-school concept
date: 2026-05-26
order: 8
featured: false
draft: false
---

## Parametric equations

An arithmetic sequence $a_n=a_1+(n-1)d$ is a row of bars whose heights lie on one slanted line. A geometric sequence $a_n=a_1 r^{n-1}$ is a row of rectangles of equal height, with each width scaled to that term. The number beside the picture is the closed form of $S_n$.

Arithmetic sum:

$$
S_n = \frac{n(a_1+a_n)}{2} = \frac{n[2a_1+(n-1)d]}{2}
$$

Geometric sum ($r\neq 1$):

$$
S_n = a_1\frac{1-r^n}{1-r}
$$

## Interaction

- **Arithmetic** / **Geometric**: switch the sequence. The sliders are then **First term a₁**, **Common difference d**, and **Number of terms n**, or **First term a₁**, **Common ratio r**, and **Number of terms n**
- **First term a₁**: move the start, and watch the whole sequence and $S_n$ change with it
- **Common difference d** / **Common ratio r**: change how the terms grow, and compare the linear stack with widths that shrink by the ratio
- **Number of terms n**: change $n$, and compare the picture with the formula value of $S_n$

## What to notice

- In the arithmetic view, the bar heights lie on one slanted line, and an outline of the same terms in reverse sits on that same row.
- In the geometric view, every rectangle has the same height and a width scaled to that term. As the terms appear, the total area adds up to the closed form $S_n$.
- When $n$ increases, the picture builds the sum term by term, and the formula value is the one shown with the controls.

## Related

- [Fibonacci spiral](/en/works/fibonacci-spiral/)
- [Basel problem](/en/works/basel-problem/)
- [Geometric significance of the binomial expansion](/en/works/binomial-expansion-geometry/)

## Further reading

- [Arithmetic progression (Wikipedia)](https://en.wikipedia.org/wiki/Arithmetic_progression)
- [Geometric progression (Wikipedia)](https://en.wikipedia.org/wiki/Geometric_progression)
