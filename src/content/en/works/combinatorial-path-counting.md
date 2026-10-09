---
title: Path counting
description: With only right and up steps, the number of paths from the origin to (m, n) is C(m+n, m).
tags:
  - Combinatorics
audience: High-school concept
concepts:
  - permutation-combination
date: 2026-05-26
order: 31
featured: false
draft: false
---

## Figure

On an $m\times n$ grid, every step goes right or up. The shortest paths run from the lower left, $(0,0)$, to the upper right, $(m,n)$. There are $\binom{m+n}{m}$ of them.

$$
N(m,n)=\binom{m+n}{m}=\binom{m+n}{n}
$$

Paths that reach $(i,j)$ obey

$$
P(i,j)=P(i-1,j)+P(i,j-1),\quad P(0,0)=1
$$

A neighbor that would fall outside the grid counts as 0, so the left edge and the bottom edge stay 1. The figure does not print these numbers on the nodes. Brightness tracks the count, and the count field also tracks it by circle size.

## Interaction

- **Right steps m**: set how many steps go right. The control runs from 2 to 9
- **Up steps n**: set how many steps go up. The control runs from 2 to 9
- **One path**: draw one route as it grows, then start the next route in turn. The route is a sequence of right and up steps. The letters R and U are not printed
- **Path overlay**: wash routes over the grid. The picture stops at 900 routes. That stop is a drawing limit, not the value of $N(m,n)$
- **Count field**: a larger circle means more paths reach that node. The count is not printed
- **New path**: while **One path** is on, jump to a random route. In the other two modes the picture does not change

## What to notice

- A path is one way to choose which $m$ of the $m+n$ steps go right, so $N(m,n)=\binom{m+n}{m}$. Choosing the up steps instead gives the same count, $\binom{m+n}{n}$.
- The corner $(m,n)$ carries that full count. A node $(i,j)$ inside the grid carries $P(i,j)=\binom{i+j}{i}$, an earlier binomial coefficient, not the whole of row $m+n$.
- This page counts paths. It does not draw Pascal's triangle, and it does not draw the Catalan paths that stay below a diagonal.

## Related

- [Pascal's triangle](/en/works/pascals-triangle/)
- [Geometry of the binomial expansion](/en/works/binomial-expansion-geometry/)
- [Catalan numbers](/en/works/catalan-numbers/)

## Further reading

- [Lattice path (Wikipedia)](https://en.wikipedia.org/wiki/Lattice_path)
