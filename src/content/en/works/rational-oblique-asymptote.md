---
title: Oblique asymptotes and polynomial division
description: Move the slope and the intercept, and watch the quotient line and the remainder set the far trend.
tags:
  - Functions and analysis
concepts:
  - rational-asymptote
  - polynomial
audience: High-school concept
date: 2026-06-12
order: 58
featured: false
draft: false
---

## Figure

Degrees and the division below are for the rational function after common factors are cancelled. When $\deg P=\deg Q+1$, polynomial division

$$
P(x)=Q(x)\cdot S(x)+R_{\mathrm{rem}}(x),\quad \deg R_{\mathrm{rem}}<\deg Q
$$

gives a linear quotient $S(x)$ and a remainder. Set

$$
R(x)=\frac{P(x)}{Q(x)}=S(x)+\frac{R_{\mathrm{rem}}(x)}{Q(x)}
$$

Because

$$
\lim_{x\to\pm\infty}\frac{R_{\mathrm{rem}}(x)}{Q(x)}=0
$$

the graph approaches the oblique asymptote $y=S(x)$ far away.

The figure uses

$$
R(x)=mx+b+\frac{A}{x-c}
$$

so $y=mx+b$ is the oblique asymptote, $A$ sets how far the graph leaves that line, and $x=c$ is the uncancelled denominator zero, a vertical asymptote.

For example,

$$
\frac{x^2+1}{x}=x+\frac{1}{x}
$$

approaches $y=x$ far away, and after cancellation $x=0$ is a vertical asymptote.

## Interaction

- **Slope m** and **Intercept b**: move the quotient $S(x)=mx+b$ and watch the far line move
- **Remainder strength A** and **Denominator zero c**: change the remainder and the vertical asymptote, and compare the graph near $x=c$ with the line far away
- **Asymptotes**: show or hide the oblique line and the vertical line
- **Advanced**: show the decay of the remainder $E(x)=R(x)-S(x)$ with **Remainder E**, and compare degrees. **Oblique** is the line above. **Horizontal** draws $R(x)=b+A/(x-c)$, so the far line is the horizontal asymptote $y=b$. **Toward 0** draws $R(x)=A/[(x-c)(x-d)]$, with horizontal asymptote $y=0$; **Second zero d** is the second denominator zero. **Reset** returns to the oblique parameters

## What to notice

- The oblique asymptote is the quotient $S(x)$ from division after cancellation. The remainder has lower degree, and it sets how fast the graph settles onto the line.
- Compare degrees after cancellation. $\deg P=\deg Q+1$ is the usual condition for an oblique asymptote.
- The same rational function can have a vertical asymptote (an uncancelled denominator zero) and an oblique asymptote (how it behaves far away). They describe different scales.

## Related

- [Vertical and horizontal asymptotes](/en/works/rational-vertical-horizontal-asymptotes/)
- [Polynomial zeros and multiplicity](/en/works/polynomial-roots-multiplicity/)
- [Rational functions and asymptotes](/en/explore/rational-functions-asymptotes/)

## Further reading

- [Polynomial long division (Wikipedia)](https://en.wikipedia.org/wiki/Polynomial_long_division)
- [Asymptote (Wikipedia)](https://en.wikipedia.org/wiki/Asymptote)
