---
title: Vertical and horizontal asymptotes
description: Move a zero and the asymptotes, and watch the graph blow up at an uncancelled denominator zero and level off far away.
tags:
  - Functions and analysis
concepts:
  - rational-asymptote
audience: High-school concept
date: 2026-06-12
order: 57
featured: false
draft: false
---

## Figure

Let

$$
R(x)=\frac{P(x)}{Q(x)}
$$

After common factors are cancelled, if $x=a$ makes the denominator zero and the numerator nonzero, then $x=a$ is a vertical asymptote. As $x\to a^\pm$, $R(x)$ may go to $+\infty$ or to $-\infty$. If the numerator and the denominator are both zero at $x=a$, the point may be a removable discontinuity, a hole. For example, $\dfrac{x-1}{x-1}$ has no vertical asymptote at $x=1$.

A horizontal asymptote is read from the leading terms after cancellation. Let $\deg P=m$ and $\deg Q=n$. If $m<n$,

$$
\lim_{x\to\pm\infty}R(x)=0
$$

If $m=n$, the limit is the ratio of the leading coefficients, $y=\dfrac{a_m}{b_n}$. If $m>n$, there is no horizontal asymptote. When $m=n+1$, read an oblique asymptote instead. A larger gap is outside this page.

The factor control draws

$$
R(x)=A\frac{x-r}{x-a}
$$

Here the degrees match, so the horizontal asymptote is $y=A$. You move the zero $r$, the vertical asymptote $a$, and the far scale $A$. If $r$ meets $a$, the factor cancels: the figure drops the vertical asymptote and marks a hole.

## Interaction

- **Scale A**, **Zero r**, and **Asymptote a**: move the zero, the denominator zero, and the far height together
- **Factors** / **Hole** / **m<n** / **m=n** / **m>n**: switch the family. **m<n** draws $R(x)=A/[(x-a)(x-h)]$, two vertical asymptotes and the horizontal asymptote $y=0$. **m=n** draws $R(x)=b+A/(x-a)$; **Height b** is the leading-coefficient ratio. **m>n** draws $R(x)=c(x-a)+b+1/(x-a)$. The gap is $1$, so there is no horizontal asymptote, and **Slope c** is the slope of the oblique line
- **Hole** and **Hole marks**: **Hole** draws $R(x)=A(x-r)(x-h)/[(x-a)(x-h)]$. The factor $x-h$ cancels and leaves a hole. **Hole marks** shows or hides it. **Advanced** opens **Hole h / second root**, which is also the second denominator zero on **m<n**
- **Asymptotes**: show or hide the vertical and horizontal guides. On **m>n**, **Advanced** draws the oblique line with those guides
- **Local window**: with **Advanced** on, magnify a denominator zero and see whether the two sides go the same way or opposite ways

## What to notice

- A vertical asymptote is a denominator zero that remains after cancellation. A shared root can be a hole, not a vertical asymptote.
- A horizontal asymptote comes from the leading terms after cancellation. If $m<n$, the graph approaches $0$. If $m=n$, it approaches the ratio of the leading coefficients.
- If the numerator degree is higher, there is no horizontal asymptote. When the gap is $1$, read an oblique asymptote. A larger gap is outside this page.

## Related

- [Oblique asymptotes and polynomial division](/en/works/rational-oblique-asymptote/)
- [Polynomial zeros and multiplicity](/en/works/polynomial-roots-multiplicity/)
- [Rational functions and asymptotes](/explore/rational-functions-asymptotes/)

## Further reading

- [Asymptote (Wikipedia)](https://en.wikipedia.org/wiki/Asymptote)
- [Rational function (Wikipedia)](https://en.wikipedia.org/wiki/Rational_function)
