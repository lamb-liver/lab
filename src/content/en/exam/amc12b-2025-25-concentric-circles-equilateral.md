---
title: Equilateral triangle on three concentric circles
description: 2025 AMC 12B, Problem #25 turns the radius-2 circle 60° about a vertex so that it is internally tangent to the outer circle, and the squared side is 7.
subject: AMC 12B
year: 2025
questionType: 單選
questionNo: '25'
unit: AMC 12, plane geometry and rotation
topics:
  - Rotation by 60°
  - Internal tangency of two circles
  - Equilateral triangle
concepts:
  - linear-transformation
  - law-of-sines-cosines
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2025_AMC_12B_Problems/Problem_25
relatedExplore:
  - matrix-linear-transform
relatedWorks:
  - rotation-scale-composition
  - law-of-sines-cosines
date: 2026-09-25
order: 16
coverImage: /images/exam-covers/amc12b-2025-25-concentric-circles-equilateral.png
featured: false
draft: false
---

## Problem

Three concentric circles in the plane have radii 1, 2, and 3. An equilateral triangle has one vertex on each circle, and each circle gets exactly one vertex. Find the square of the side length, $s^2$. There are five choices.

The full problem and the choices are on the [AoPS problem page](https://artofproblemsolving.com/wiki/index.php/2025_AMC_12B_Problems/Problem_25).

## Where it goes wrong

The intuitive approach assigns an angle to each vertex and writes the equations for three equal sides. There are many unknowns, and trigonometric functions, and the algebra often stalls halfway.

Another trap is to assume the picture looks symmetric. For example, the rays from the center to the three vertices are $120^\circ$ apart. The cosine law then gives squared sides $1+4+2=7$, $4+9+6=19$, and $9+1+3=13$. That is not an equilateral triangle. One of those sides happens to be 7, which makes it easier to think the answer has been found.

What has to be explained is why $s$ has only one value. The rotation argument below shows both existence and uniqueness.

## Idea

In an equilateral triangle $ABC$, $C$ is the image of $B$ rotated $60^\circ$ about $A$. Since $B$ lies on the circle of radius 2, $C$ must lie on the image of that circle after a $60^\circ$ rotation about $A$.

The center $O'$ of the image is the image of the common center $O$ under the same rotation. $|AO'|=|AO|=1$ and $\angle OAO'=60^\circ$, so $\triangle OAO'$ is equilateral and $|OO'|=1$.

The image has radius 2 and its center is 1 from $O$, and $3-2=1$. It is internally tangent to the circle of radius 3, so they meet at exactly one point. That point is $C$, the points $O$, $O'$, and $C$ are collinear, and $|OC|=3$.

Take $A=(1,0)$. Then $O'=\left(\tfrac12,\tfrac{\sqrt3}{2}\right)$ and $C=3\,O'=\left(\tfrac32,\tfrac{3\sqrt3}{2}\right)$:

$$
s^2=|AC|^2=\left(\tfrac12\right)^2+\left(\tfrac{3\sqrt3}{2}\right)^2=\tfrac14+\tfrac{27}{4}=7,
$$

which is choice (E). The other direction is the mirror image, and the side length is the same.

## What the figure shows

- Press **Play the 60° turn**, or move **Angle about A**. The gold dashed circle is the image of the radius-2 circle rotated about $A$. At $60^\circ$ it meets the outer circle, and only at one point. **Clockwise** and **Counterclockwise** are the two directions.
- Drag $A$ along the small circle, or move **A on the radius-1 circle**. At $60^\circ$, wherever $A$ is, $|OO'|$ stays at 1, the image stays internally tangent to the large circle, and the readout $s^2$ is 7.
- Drag the trial point $B$, or move **Trial B on the radius-2 circle**. Its image $C'$ slides on the gold image circle, and $|OC'|$ equals 3 only at the point of tangency. Press **Snap B to the unique solution** to jump there.
