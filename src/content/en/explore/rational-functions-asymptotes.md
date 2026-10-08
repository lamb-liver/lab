---
title: Rational functions and asymptotes
description: Read a rational graph from cancellation, zeros, and asymptotes, and move the factor parameters.
category: Algebra
concepts:
  - rational-asymptote
audience: High-school concept
date: 2026-06-12
order: 15
coverImage: /images/explore-covers/rational-functions-asymptotes.png
featured: false
draft: false
---

## Idea

A rational function is a quotient of two polynomials:

$$
R(x)=\frac{P(x)}{Q(x)}
$$

$Q$ is not identically zero. To read asymptotes and discontinuities, start from the cancelled quotient $\dfrac{P(x)}{Q(x)}$.

- **Vertical asymptote**: after common factors are cancelled, if $x=a$ makes the denominator zero and the numerator nonzero, then $x=a$ is a vertical asymptote. As $x\to a^\pm$, $R(x)$ may go to $+\infty$ or to $-\infty$, and the graph is unbounded in the vertical direction
- **Removable discontinuity (hole)**: if the numerator and the denominator are both zero at $x=a$, cancellation may leave only a hole. For example, $\dfrac{(x-1)(x+2)}{x-1}=x+2$ for $x\ne 1$: the main graph is the line $y=x+2$, with a hole at $x=1$
- **Horizontal asymptote**: read it from the leading terms after cancellation. If $\deg P<\deg Q$, the graph approaches $0$ far away. If $\deg P=\deg Q$, it approaches the ratio of the leading coefficients
- **Oblique asymptote**: when $\deg P=\deg Q+1$ after cancellation, division gives a linear quotient $S(x)$. This page calls that far line an oblique asymptote, and $R(x)-S(x)\to 0$

Discontinuities, zeros, and asymptotes together are the skeleton of the graph.

## Interaction

- **Factors**: build $R(x)=A\dfrac{x-r}{x-a}$ from **Scale A**, **Zero r**, and **Asymptote a**, and watch the graph, the zero, and the vertical asymptote update. The degrees match, so the horizontal asymptote is $y=A$
- **Hole**: give the numerator and the denominator a common factor. **Hole h** places it, and **Hole marks** shows the hole left after cancellation. The drawn graph is $R(x)=A(x-r)(x-h)/[(x-a)(x-h)]$, with a vertical asymptote at $x=a$ and a horizontal asymptote $y=A$
- **Horizontal**: compare the degrees after cancellation and watch the far height. This control draws $R(x)=b+A/(x-a)$. **Shift b** is that height when the degrees match. The term $A/(x-a)$ is the remainder, of lower degree. If $b=0$, the numerator degree drops and the line is $y=0$
- **Oblique asymptote**: when the degree gap is $1$, show the linear quotient. **Slope m**, **Shift b**, **Remainder c**, and **Asymptote a** draw $R(x)=mx+b+c/(x-a)$, and $S(x)=mx+b$ is the far line
- **Asymptotes** and **Hole marks**: show or hide those guides. **Advanced** opens the line-by-line cancellation and splitting

Suggested order: Factors, Hole, Horizontal, then Oblique asymptote.

## What to notice

- A blow-up or a hole nearby, and a horizontal or oblique line far away, both depend on what remains after cancellation. The same quotient reads as a different skeleton at a different scale.
- A denominator zero is not always a vertical wall. After it is cancelled, only a hole may remain. The near reading and the far reading use that same cancelled quotient.
- Horizontal and oblique are two far skeletons. They do not replace a discontinuity nearby. They read the same $R(x)$ once more at infinity.

## Related

- [Vertical and horizontal asymptotes](/en/works/rational-vertical-horizontal-asymptotes/)
- [Oblique asymptotes and polynomial division](/en/works/rational-oblique-asymptote/)
- [Polynomial zeros and multiplicity](/en/works/polynomial-roots-multiplicity/)
- [Function graphs and solution sets](/en/explore/function-equations/)

## Further reading

- [Rational function (Wikipedia)](https://en.wikipedia.org/wiki/Rational_function)
- [Asymptote (Wikipedia)](https://en.wikipedia.org/wiki/Asymptote)
