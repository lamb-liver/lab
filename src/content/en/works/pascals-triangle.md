---
title: "Pascal's triangle"
description: A triangular array of binomial coefficients, showing the recurrence, the symmetry, and combinatorial identities.
tags:
  - Combinatorics
concepts:
  - binomial-theorem
audience: Intuitive exploration
date: 2026-05-26
order: 30
featured: false
draft: false
---

## Figure

Row $n$, entry $k$ of Pascal's triangle is the binomial coefficient $\binom{n}{k}$. Row 0 is the single 1 at the top, and entry $k$ runs from 0 to $n$. Each entry is the sum of the two entries above it. The same numbers are the coefficients in the binomial theorem, and the row is symmetric.

$$
\binom{n}{k}=\frac{n!}{k!(n-k)!},\quad
\binom{n}{k}=\binom{n-1}{k-1}+\binom{n-1}{k}
$$

Binomial theorem:

$$
(x+y)^n=\sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k
$$

The dots on the canvas are these values modulo a prime. A filled dot is a nonzero residue. A hollow dot is 0. The integer $\binom{n}{k}$ itself is not printed on the cell.

## Interaction

- **Rows n**: draw the triangle from row 0 through row $n$. The number on the control is that last row
- **Mod 2**: color each entry by its residue modulo 2. The hollow dots form a Sierpinski triangle
- **Mod 3**: color residues modulo 3
- **Mod 5**: color residues modulo 5
- **Mod 7**: color residues modulo 7
- Click a cell to highlight every cell that feeds it by repeated two-parent sums. The highlight is the whole cone, not only the two cells directly above

## What to notice

- The residue pattern is symmetric, because $\binom{n}{k}=\binom{n}{n-k}$ and the modulus does not break that equality.
- The highlighted cone is Pascal's recurrence run backwards to the top of the triangle.
- Modulo 2, the hollow cells are the even binomial coefficients, and they form a Sierpinski triangle. The other primes hollow out the coefficients they divide, and that pattern is not the Sierpinski triangle.

## Related

- [Path counting](/en/works/combinatorial-path-counting/)
- [Geometry of the binomial expansion](/en/works/binomial-expansion-geometry/)
- [Catalan numbers](/en/works/catalan-numbers/)

## Further reading

- [Pascal's triangle (Wikipedia)](https://en.wikipedia.org/wiki/Pascal%27s_triangle)
