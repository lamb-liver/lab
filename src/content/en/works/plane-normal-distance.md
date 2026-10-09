---
title: Plane normal and distance from a point
description: Drag the normal n and a point fixed on the plane, and read ax+by+cz=h together with the distance from a point to the plane.
tags:
  - Linear algebra
concepts:
  - space-vectors
  - dot-cross-product
audience: High-school concept
date: 2026-07-21
order: 66
featured: false
draft: false
---

## Figure

The plane with normal vector $\mathbf{n}=(a,b,c)\neq\mathbf{0}$ through $P_0(x_0,y_0,z_0)$:

$$
\mathbf{n}\cdot(\mathbf{r}-\mathbf{r}_0)=0
$$

Expanded, this is the general form $ax+by+cz=h$, where $h=ax_0+by_0+cz_0$. The distance from a point $P_1(x_1,y_1,z_1)$ to the plane is

$$
\mathrm{dist}=\frac{|ax_1+by_1+cz_1-h|}{\|\mathbf{n}\|}
$$

Multiplying $(a,b,c,h)$ by a nonzero constant does not change the plane. It only changes the scale of the equation.

## Interaction

- **Plane tilt**: rotate the unit normal $\hat{\mathbf{n}}$. The plane turns with it, and the coefficients $(a,b,c)$ update together
- **Plane offset h**: translate the plane. The foot slides along the normal, and the distance changes
- **Test point height**: move $P_1$ and compare the sign of the signed distance, which marks which side of the normal it is on
- **Equation scale k**: multiply by a nonzero constant. The coefficients all change, while the plane, the foot, and the distance stay put
- Drag the figure to rotate the view and check that the perpendicular segment is orthogonal to the plane. **Horizontal view** and **Elevation** do the same rotation

## What to notice

- The normal vector is orthogonal to every displacement in the plane. Multiplying $(a,b,c,h)$ by a nonzero constant does not change the plane. It only changes the scale of the equation.
- $h=ax_0+by_0+cz_0$ encodes which point the plane passes through. Changing $P_0$ translates the plane.
- The distance from a point to a plane is a direct use of the dot product. It extends the projection and normal reading of plane vectors into space.

## Related

- [Space vector and three plane projections](/en/works/space-vector-three-plane-projection/)
- [Where a line meets a plane](/en/works/line-plane-intersection/)
- [Dot product](/en/works/dot-product-geometry/)
- [Space vectors, planes, and lines](/en/explore/space-vectors-planes-lines/)

## Further reading

- [Euclidean plane (Wikipedia)](https://en.wikipedia.org/wiki/Euclidean_plane)
- [Normal (geometry) (Wikipedia)](https://en.wikipedia.org/wiki/Normal_(geometry))
- [Distance from a point to a plane (Wikipedia)](https://en.wikipedia.org/wiki/Distance_from_a_point_to_a_plane)
