---
title: Space vector and three plane projections
description: Drag the components and watch the projections on the xy, xz, and yz planes describe one vector in space.
tags:
  - Linear algebra
concepts:
  - space-vectors
audience: High-school concept
date: 2026-07-21
order: 64
featured: false
draft: false
---

## Figure

A space vector

$$
\mathbf{v}=(v_x,v_y,v_z)
$$

has length $\|\mathbf{v}\|=\sqrt{v_x^2+v_y^2+v_z^2}$. Its orthogonal projections onto the coordinate planes are

$$
\mathrm{proj}_{xy}\mathbf{v}=(v_x,v_y,0),\quad
\mathrm{proj}_{xz}\mathbf{v}=(v_x,0,v_z),\quad
\mathrm{proj}_{yz}\mathbf{v}=(0,v_y,v_z)
$$

The three projections are the shadows of $\mathbf{v}$ on the $xy$, $xz$, and $yz$ planes. Repeated components check one another, so the same vector in space can be read from different planes.

## Interaction

- **Component vx** / **Component vy** / **Component vz**: drag the three components. Each shadow keeps only two of them
- **Three shadows**: show all three projections, and check that the repeated components belong to the same $\mathbf{v}$
- **xy plane** / **xz plane** / **yz plane**: switch to one plane. The projection sets the component that is not on that plane to $0$
- Drag the figure to rotate the view and check that each shadow lies on its own coordinate plane. **Horizontal view** and **Elevation** do the same rotation

## What to notice

- An orthogonal projection onto a coordinate plane sets one component to zero. The $xy$ projection keeps $x,y$, the $xz$ projection keeps $x,z$, and the $yz$ projection keeps $y,z$.
- Each projection is a lower-dimensional reading. Together, the repeated components check one another, so one view does not misread the direction in space.
- $\|\mathbf{v}\|$ is usually longer than any one projection. The more the vector leans across space, the more the three shadows are needed together.

## Related

- [Where a line meets a plane](/en/works/line-plane-intersection/)
- [Plane normal and distance from a point](/en/works/plane-normal-distance/)
- [Vector projection](/en/works/vector-projection/)
- [Space vectors, planes, and lines](/explore/space-vectors-planes-lines/)

## Further reading

- [Euclidean vector (Wikipedia)](https://en.wikipedia.org/wiki/Euclidean_vector)
- [Projection (linear algebra) (Wikipedia)](https://en.wikipedia.org/wiki/Projection_(linear_algebra))
