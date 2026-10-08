---
title: Inverse function by reflection
description: Drag a point on the graph and watch (a, b) reflect across y = x to (b, a) on the inverse.
tags:
  - Functions and analysis
concepts:
  - inverse-function
  - function-transformation
audience: High-school concept
date: 2026-06-10
order: 48
featured: false
draft: false
---

## Parametric equations

If $f$ has an inverse $f^{-1}$, then

$$
f^{-1}(f(x))=x
$$

On the plane, $y=f(x)$ and $y=f^{-1}(x)$ are symmetric across the line $y=x$. If $(a,b)$ lies on $y=f(x)$, then $(b,a)$ lies on $y=f^{-1}(x)$.

## Interaction

- **linear** / **quad+** / **quad** / **exp**: switch a line, a quadratic restricted to one side of its vertex, the same quadratic with no restriction, and an exponential
- **Base q**: in the exponential mode, change the base of $q^x$ and watch the curve and its reflection
- **Input x**: drag the input, or drag **P** on the figure, and watch $P=(a,b)$, the reflected point $P'=(b,a)$, and the line $y=x$
- **guide: on** / **guide: off**: show the segment joining $P$ and $P'$ and the projections of $P$ onto the axes, marking that the input and the output have swapped
- **Horizontal line test**: on **quad**, a horizontal line counts how many times it meets the graph

## What to notice

- An inverse swaps the roles of the input and the output. The graph is the reflection across $y=x$, not a new unrelated curve.
- $y=q^x$ and $y=\log_q x$ are inverses, so the two graphs are symmetric across $y=x$.
- Not every function has an inverse. After the domain is restricted, the graph can pass the horizontal line test.

## Related

- [Exponentials and logarithms](/en/explore/exponential-logarithm/)
- [Exponential growth and decay](/en/works/exponential-growth-decay/)
- [Geometric definition of the natural logarithm](/en/works/natural-log-e-geometry/)
- [Logarithmic scale](/en/works/logarithmic-scale/)

## Further reading

- [Inverse function (Wikipedia)](https://en.wikipedia.org/wiki/Inverse_function)
- [Horizontal line test (Wikipedia)](https://en.wikipedia.org/wiki/Horizontal_line_test)
