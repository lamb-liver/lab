---
title: Vector field streamlines
description: Paths found by integrating along a vector field, a geometric picture of the solutions of a differential equation.
audience: University concept
prerequisites:
  - Vector fields
  - Differential equations
tags:
  - Functions and analysis
concepts:
  - vector-field
  - differential-equation
date: 2026-05-25
order: 24
featured: false
draft: false
---

## Parametric equations

Given a vector field $\mathbf{F}(x,y)=(F_x,F_y)$, a streamline is a solution of this ordinary differential equation:

$$
\frac{dx}{dt}=F_x(x,y),\quad
\frac{dy}{dt}=F_y(x,y)
$$

An equivalent form:

$$
\frac{d\mathbf{r}}{dt}=\mathbf{F}(\mathbf{r}(t))
$$

A streamline is an integral curve of the direction field. It helps with gradients, curl, and the solutions of first-order differential equations.

The field here is a vortex plus a perturbation:

$$
F_x = \frac{-y}{x^2+y^2+\varepsilon} + 0.25\sin(2y + 0.8t),\quad
F_y = \frac{x}{x^2+y^2+\varepsilon} + 0.25\cos(2x + 0.8t)
$$

$\varepsilon$ avoids division by zero at the origin. The direction is perpendicular to the radius, so the whole field rotates.

## Interaction

- **Number of streamlines**: add or remove streamlines integrated at the same time
- **Integration steps**: more steps make each streamline longer and more detailed
- **Flow speed**: drive the field's change over time so the streamlines keep updating

## What to notice

- A streamline is tangent to the vector field. It can be read as a geometric solution of the differential equation.
- Near the center of the vortex, streamlines circle densely.
- In one field, streamlines from different starting points never cross (except at singular points).

## Related

- [Basic patterns of a vector field](/en/works/vector-field-patterns/)
- [Differential equations, seen geometrically](/en/explore/differential-equations-geometry/)

## Further reading

- [Field line (Wikipedia)](https://en.wikipedia.org/wiki/Field_line)
