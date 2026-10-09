---
title: Permutations and combinations
description: The same combination count returns as a binomial coefficient, a lattice-path count, and a recurrence cell, while a Catalan number keeps only the paths that stay legal.
category: Algebra
audience: High-school concept
concepts:
  - permutation-combination
  - binomial-theorem
date: 2026-05-26
order: 9
coverImage: /images/explore-covers/permutations-combinations.png
featured: false
draft: false
---

## Idea

$$
C(n,k) = \frac{n!}{k!\,(n-k)!}
$$

$C(n,k)$ is the number of ways to choose $k$ positions from $n$ when the order of the choice does not matter. A permutation counts order. This page does not replace the combination with that ordered count. The combination $C(n,k)$ is what returns in each view.

The same combination is the coefficient of the term that takes $k$ factors of $b$ in $(a+b)^n$. It is also the number of ways to choose which $m$ steps go right in a path of $m+n$ steps:

$$
C(m+n,m)
$$

Pascal's recurrence builds each entry from the previous row:

$$
C(n,k)=C(n-1,k-1)+C(n-1,k)
$$

A Catalan number is not another value of $C(n,k)$. From the balanced paths counted by $C(2n,n)$, it keeps only those that do not cross the barrier:

$$
\mathrm{Cat}_n=\frac{1}{n+1}C(2n,n)
$$

## Interaction

- **Coefficient table**: **Rows n** sets the last row, from 8 to 32. The triangle still starts at row 0. **k to watch** moves $k$ on the highlighted row, which is that last row minus 2. The readout is the integer $C(n,k)$, a binomial coefficient. The dots are residues for **Modulus**, one of **mod 2**, **mod 3**, **mod 5**, or **mod 7**, and the full integer is not printed on a dot
- **Path model**: the same kind of count, read as which steps go right. **Show** is **One path**, **Overlaid paths**, or **Node counts**. **Right steps** and **Up steps** set the grid, each from 2 to 8. **One path** draws a single finished route. **Overlaid paths** washes routes onto the grid and stops at 900 of them, a drawing limit rather than the path count. **Node counts** uses circle size and does not print the number
- **Recurrence**: **Target row n** and **Target cell k** pick one cell, with $n$ from 3 to 10 and $k$ from 0 to $n$. The cone keeps the cells that flow into it. The two parents in the previous row are the ones that add, except on the boundary $k=0$ or $k=n$, where one parent is missing

Suggested order: Coefficient table, then Path model, then Recurrence. The Catalan contrast sits beside those modes. It is not a fourth mode, and the canvas does not draw the barrier.

## What to notice

- One value of $C(n,k)$ can be a binomial coefficient, a choice of step positions, and one cell of the recurrence. The three views keep separate $n$ and $k$ until you set them to the same pair.
- With the number of steps fixed, a lattice path is a choice of positions for the right steps. That choice is a combination. A permutation would count order, and this page does not.
- For $n=4$ the Catalan contrast compares all balanced paths $C(8,4)$ with the legal subset $\mathrm{Cat}_4$. The excluded paths are the difference. That comparison is a count in the sidebar, not a path drawn on the grid.

## Related

- [Pascal's triangle](/en/works/pascals-triangle/)
- [Path counting](/en/works/combinatorial-path-counting/)
- [Geometry of the binomial expansion](/en/works/binomial-expansion-geometry/)
- [Catalan numbers](/en/works/catalan-numbers/)

## Further reading

- [Permutation (Wikipedia)](https://en.wikipedia.org/wiki/Permutation)
- [Combination (Wikipedia)](https://en.wikipedia.org/wiki/Combination)
- [Pascal's triangle (Wikipedia)](https://en.wikipedia.org/wiki/Pascal%27s_triangle)
- [Lattice path (Wikipedia)](https://en.wikipedia.org/wiki/Lattice_path)
