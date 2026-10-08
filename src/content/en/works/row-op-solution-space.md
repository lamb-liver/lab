---
title: Row operations and the solution space
description: Three planes stand for a linear system, and adding a multiple of the first row to the third turns that plane while the common solution stays put.
tags:
  - Linear algebra
concepts:
  - linear-systems
audience: High-school concept
prerequisites:
  - Systems of linear equations
  - Planes in space
date: 2026-10-05
order: 74
featured: false
draft: false
---

## Figure

One row is one equation, and one plane. The three rows

$$
a_1 x+b_1 y+c_1 z=d_1,\quad
a_2 x+b_2 y+c_2 z=d_2,\quad
a_3 x+b_3 y+c_3 z=d_3
$$

meet in the solution space: one point, one line, or the empty set.

The only row operation on this page adds $k$ times the first row to the third, with $k$ from $-2$ to $2$.

$$
(a_3,b_3,c_3,d_3)\leftarrow (a_3,b_3,c_3,d_3)+k(a_1,b_1,c_1,d_1)
$$

Swapping two rows only swaps two planes. Multiplying a row by a nonzero number leaves the plane unchanged. Those two are not controls.

In all three starting systems the first two equations are $x=1$ and $y=1$, so their intersection, the white line, is fixed at $x=1,\; y=1$. The gold plane is the third equation. Its intersection with the first plane is also drawn in gold: dashed when it is separate from the white line, solid when the two coincide.

- Unique solution: $z=1$. The three planes meet at the point $(1,1,1)$.
- One line: $x+y=2$. The third plane contains the whole white line.
- No solution: $x+y=0$. The hinge of the third plane is parallel to the white line, and they share no point.

## Interaction

- **Unique solution**: switch to the system whose three planes meet at one point
- **One line**: switch to the system whose intersection is the whole white line
- **No solution**: switch to the system whose three planes have no point in common
- **Third-row coefficient k**: change $k$. The third row becomes the old third row plus $k$ times the first row. The gold plane turns about its line of intersection with the first plane. The white line and the common solution stay put

## What to notice

- After the third row gains a multiple of the first, the third plane still contains its old intersection with the first plane, so the gold plane turns about that line.
- The white line is the intersection of the first two equations, and this operation does not touch it. A unique solution is the same point on the white line. When the whole white line is the solution, the gold plane contains it. When there is no solution, the hinge of the gold plane is parallel to the white line, and the two do not meet.
- The intersection of the three planes is the same set before and after the operation: the point stays, the line is still that line, and the empty set stays empty.

## Related

- [The same row operations, as a linear combination](/en/exam/ast-113-augmented-matrix-row-operations/)
- [Where a line meets a plane](/en/works/line-plane-intersection/)
- [Linear transform grid](/en/works/linear-transform-grid/)

## Further reading

- [Elementary matrix (Wikipedia)](https://en.wikipedia.org/wiki/Elementary_matrix)
- [Gaussian elimination (Wikipedia)](https://en.wikipedia.org/wiki/Gaussian_elimination)
- [System of linear equations (Wikipedia)](https://en.wikipedia.org/wiki/System_of_linear_equations)
