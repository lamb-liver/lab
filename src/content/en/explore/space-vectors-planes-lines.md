---
title: Spatial vectors, planes, and lines
description: Fix one vector and one plane, and answer in order where it is, which way the plane faces, and how the two are related.
category: Geometry
concepts:
  - space-vectors
audience: High-school concept
date: 2026-07-21
order: 19
coverImage: /images/explore-covers/space-vectors-planes-lines.png
featured: false
draft: false
---

## Idea

The hard part of a problem in space is usually not the formula. It is keeping track of two things at once: where a vector sits, and which way a plane faces. This page keeps one scene fixed, a vector $\mathbf{v}$ and the plane spanned by $\mathbf{a},\mathbf{b}$. All three readings act on those two objects. The question does not change.

$$
\mathbf{n}=\mathbf{a}\times\mathbf{b},\qquad \mathbf{n}\cdot\mathbf{v}-h
$$

First the position of $\mathbf{v}$ is spread into shadows on the three coordinate planes. Then the cross product packs the facing direction of the plane into a single normal vector $\mathbf{n}$. Last, the same dot-product reading decides how $\mathbf{v}$ is related to that plane. The full derivation of each tool, and the degenerate cases, stay on the matching single work.

## Interaction

- **Position**: drag the components $v_x,v_y,v_z$ and watch one position in space spread into three flat shadows
- **Direction**: change **Plane tilt** and watch the plane spanned by $\mathbf{a},\mathbf{b}$ pack into a single $\hat{\mathbf{n}}$
- **Relation**: switch among **At a distance**, **v parallel to the plane**, and **v lies in the plane**, and compare how the reading $\hat{\mathbf{n}}\cdot\mathbf{v}-h$ changes
- Drag the figure to rotate the view and check that the three readings are the same scene. **Horizontal view** and **Elevation** do the same rotation

Suggested order: Position, then Direction, then Relation.

## What to notice

- The first two readings answer different questions. One asks where $\mathbf{v}$ is. One asks which way the plane faces. Only together do they decide how the two are related.
- The facing direction of a plane can be packed into one normal vector. After that, every line-plane judgment needs only that arrow, not the original $\mathbf{a},\mathbf{b}$.
- Lying in the plane, parallel, and at a distance are not three formulas. They are the same dot-product reading equal to zero, never zero, or some other value.

## Related

- [Geometric significance of the cross product](/en/works/cross-product-geometry/)
- [Spatial vector and three plane projections](/en/works/space-vector-three-plane-projection/)
- [Where a line meets a plane](/en/works/line-plane-intersection/)
- [Plane normal and distance from a point](/en/works/plane-normal-distance/)

## Further reading

- [Euclidean vector (Wikipedia)](https://en.wikipedia.org/wiki/Euclidean_vector)
- [Euclidean plane (Wikipedia)](https://en.wikipedia.org/wiki/Euclidean_plane)
- [Line–plane intersection (Wikipedia)](https://en.wikipedia.org/wiki/Line%E2%80%93plane_intersection)
