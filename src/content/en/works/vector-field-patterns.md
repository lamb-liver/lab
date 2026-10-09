---
title: Basic patterns of a vector field
description: Sources, sinks, vortices, and saddles, the typical vector fields that give a geometric vocabulary for direction fields.
audience: University concept
prerequisites:
  - Plane vectors
  - Functions
tags:
  - Functions and analysis
concepts:
  - vector-field
date: 2026-05-26
order: 44
featured: false
draft: false
---

## Parametric equations

Near a singular point, a plane vector field $\mathbf{F}(x,y)=(P,Q)$ shows a few typical patterns: source (spreading out), sink (closing in), vortex (rotating), and saddle (one way in, one way out). Recognizing them helps with gradient fields, an intuition for curl, and phase portraits of differential equations.

Linear examples (singular point at the origin):

$$
\mathbf{F}_{\text{source}}=(x,y),\quad
\mathbf{F}_{\text{sink}}=(-x,-y),\quad
\mathbf{F}_{\text{vortex}}=(-y,x),\quad
\mathbf{F}_{\text{saddle}}=(x,-y)
$$

For a source or a sink, the two real eigenvalues have the same sign. For a saddle, the two real eigenvalues have opposite signs. A vortex is dominated by rotation.

## Interaction

- **Source** / **Sink** / **Vortex** / **Saddle**: switch patterns and watch how the overall direction of the arrows changes
- **Normalize arrows**: choose whether arrow length shows $|\mathbf{F}|$, and compare reading direction with reading strength
- **Overlay streamlines**: add short integrated streamlines that join the separate arrows into continuous paths
- **Density n**: change the grid density and see how sampling affects how readable the pattern is

## Related

- [Vector field streamlines](/en/works/vector-field-streamlines/)
- [Vector projection](/en/works/vector-projection/)
- [Geometric significance of the dot product](/en/works/dot-product-geometry/)

## Further reading

- [Vector field (Wikipedia)](https://en.wikipedia.org/wiki/Vector_field)
- [Phase portrait (Wikipedia)](https://en.wikipedia.org/wiki/Phase_portrait)
