---
title: Differential equations, seen geometrically
description: How one slope field decides the solution curves, how they split by initial value, and the error of step-by-step integration.
category: Analysis
audience: University concept
prerequisites:
  - Derivatives
  - Integrals
concepts:
  - differential-equation
  - vector-field
date: 2026-05-26
order: 6
coverImage: /images/explore-covers/differential-equations-geometry.png
featured: false
draft: false
---

## Idea

$$
\frac{dy}{dx} = f(x, y)
$$

The equation does not give the value of $y$ directly. It gives a direction of change at every point of the plane, and a solution curve is the path you get by integrating along that direction.

## Interaction

- **Slope field**: draw direction arrows across the window and turn the differential equation into a visible "map of directions"
- **Initial conditions**: click to add a starting point and watch how different initial values give different paths
- **Euler's method**: integrate step by step with an adjustable step size. As with a Riemann sum, the finer the step, the better the approximation

Suggested order: look at the slope field first → change the initial value and compare paths → make the step larger and watch the error of Euler's method.

## What to notice

- A differential equation first gives a direction at each point, not a ready-made $y(x)$. A solution curve is just the path traced along that one slope field.
- A different starting point follows a different curve in the same field. A step that is too coarse uses a polyline to approximate the same field; it does not switch to a different equation.
- The same field can also be read as the streamlines of a vector field. A path tangent to the field and step-by-step integration are the geometric and numerical versions of the same thing.

## Related

- [Tractrix](/en/works/catenary/)
- [Vector field streamlines](/en/works/vector-field-streamlines/)
- [Phasor diagram](/en/works/complex-phase-portrait/)
- [Equiangular spiral](/en/works/equiangular-spiral/)

## Further reading

- [Slope field (Wikipedia)](https://en.wikipedia.org/wiki/Slope_field)
- [Euler method (Wikipedia)](https://en.wikipedia.org/wiki/Euler_method)
