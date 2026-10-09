---
title: Catalan numbers
description: Catalan numbers count matched parentheses, lattice paths that do not cross the diagonal, and triangulations of a convex polygon.
tags:
  - Combinatorial mathematics
concepts:
  - permutation-combination
audience: High-school concept
date: 2026-05-26
order: 33
featured: false
draft: false
---

## Parametric equations

The Catalan number $C_n=\dfrac{1}{n+1}\binom{2n}{n}$ counts several structures: the valid matchings of $n$ pairs of parentheses, the lattice paths from $(0,0)$ to $(n,n)$ that do not cross the diagonal, the triangulations of a convex $(n+2)$-gon, and others. The figure switches among views of the same $C_n$.

$$
C_n = \frac{1}{n+1}\binom{2n}{n} = \binom{2n}{n}-\binom{2n}{n+1}
$$

Recurrence:

$$
C_0=1,\quad C_{n+1}=\sum_{i=0}^{n} C_i C_{n-i}
$$

## Interaction

- **Dyck path** / **Parentheses** / **Triangulation**: three views of the same $C_n$
- **Order n**: set the size of the object. When $n>6$, **Triangulation** samples instead of listing every polygon
- **Next**: show another object of the same order

## What to notice

- **Next** changes which object is drawn. It does not change $C_n$.
- A Dyck path is the parenthesis word read as steps that stay on one side of the diagonal. The arcs in the parenthesis view are the matching pairs.
- A triangulation cuts a convex $(n+2)$-gon into triangles. Past $n=6$ that view is a sample, not every triangulation.

## Related

- [Pascal's triangle](/en/works/pascals-triangle/)
- [Path counting](/en/works/combinatorial-path-counting/)
- [Geometric significance of the binomial expansion](/en/works/binomial-expansion-geometry/)

## Further reading

- [Catalan number (Wikipedia)](https://en.wikipedia.org/wiki/Catalan_number)
