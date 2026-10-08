---
title: Linear programming
description: Lay constraints, the objective direction, and the vertex candidates over one feasible region, and use three views to confirm where a linear optimum appears.
category: Algebra
audience: High-school concept
coverImage: /images/explore-covers/linear-programming.png
concepts:
  - linear-programming
date: 2026-07-22
order: 20
featured: false
draft: false
---

## Idea

Linear programming can first be read as a picture of the feasible region. The constraints decide which points stay, the objective decides which way the level lines sweep, and the vertex table lists the candidate solutions one by one. All three read the same region of the plane.

$$
\mathcal F=\{(x,y)\mid a_ix+b_iy\le c_i\},\qquad z=px+qy
$$

This page does not repeat the full derivation for each tool. It puts "intersection of half-planes", "sweeping level lines", and "vertex candidates" on one picture and checks whether they point to the same optimal position.

## Interaction

- **Constraints**: lay the half-plane masks over the figure and answer "which points are allowed" first. The darker the mask, the more constraints exclude that spot
- **Objective**: draw a family of sweep lines moving from worse to better, and answer "which way is better"
- **Candidates**: label each corner point with its rank and $z$, and answer "where the optimum lies"
- **Constraint A offset** / **Constraint B offset**: move the two adjustable constraints. Push one far enough and it becomes redundant (dashed); pull it back too far and the feasible region becomes empty
- **Objective direction θ**: rotate the direction of the objective $\mathbf n=(p,q)$, and watch the optimal corner jump to the next corner at certain angles
- **Maximize** / **Minimize**: choose which end to take

The three readings act on the same problem. Switching only changes what the figure emphasizes; the corner points, the $z$ values, and the optimal position stay the same. In the sidebar, "What this reading says" describes the same conclusion in three different wordings. That is exactly what this page sets out to confirm.

## What to notice

- The constraint view first answers "which points are allowed". The objective view then answers "which way is better".
- The vertices are not a separate method. They are the few candidates left where the sweeping level line reaches the boundary of the feasible region.
- An empty set, an unbounded region, and a whole optimal edge are not decorative exceptions. They are different states of the same picture of the feasible region.

## Related

- [Constraint half-planes and the feasible region](/en/works/lp-feasible-half-planes/)
- [Level curves of the objective](/en/works/lp-objective-level-curves/)
- [Finding the optimal solution at a vertex](/en/works/lp-vertex-optimum/)

## Further reading

- [Linear programming (Wikipedia)](https://en.wikipedia.org/wiki/Linear_programming)
- [Feasible region (Wikipedia)](https://en.wikipedia.org/wiki/Feasible_region)
