---
title: Geometry of the binomial expansion
description: Cutting a square or a cube into blocks shows the expansion of (a+b)^n and where its coefficients come from.
tags:
  - Combinatorics
audience: High-school concept
concepts:
  - binomial-theorem
date: 2026-05-26
order: 32
featured: false
draft: false
---

## Figure

$(a+b)^2=a^2+2ab+b^2$ is a square of side $a+b$ cut into four blocks. $(a+b)^3$ is a cube of side $a+b$ cut into eight blocks and drawn as an oblique projection, not an unfolded net. In the expansion, $\binom{n}{k}$ counts the ways to choose $k$ factors equal to $b$ and leave the rest equal to $a$. The picture shows $n=2$ and $n=3$ only.

$$
(a+b)^n=\sum_{k=0}^{n}\binom{n}{k}a^{n-k}b^k
$$

Each block is labeled with its monomial, such as $a^2$ or $a^2b$. The binomial coefficient is not written on the block. It is how many blocks share that monomial: one $a^2$, two copies of $ab$, and one $b^2$ in the square; one $a^3$, three $a^2b$, three $ab^2$, and one $b^3$ in the cube.

## Interaction

- **n = 2 square**: show the square cut into $a^2$, two copies of $ab$, and $b^2$
- **n = 3 cube**: show the cube, in oblique projection, cut into $a^3$, three copies of $a^2b$, three copies of $ab^2$, and $b^3$
- **Side a**: change one length, from 1 to 10. The blocks change size. The labels stay the monomials
- **Side b**: change the other length, from 1 to 10, in the same way

## What to notice

- Two blocks labeled $ab$ are the coefficient 2. Three blocks labeled $a^2b$, and three labeled $ab^2$, are the coefficient 3.
- Those counts are row 2 and row 3 of Pascal's triangle. This picture does not draw the triangle.
- The area or volume of a block is not printed. Only the monomial is. Changing the lengths changes the sizes, not the words on the blocks.

## Related

- [Pascal's triangle](/en/works/pascals-triangle/)
- [Path counting](/en/works/combinatorial-path-counting/)
- [Catalan numbers](/en/works/catalan-numbers/)

## Further reading

- [Binomial theorem (Wikipedia)](https://en.wikipedia.org/wiki/Binomial_theorem)
