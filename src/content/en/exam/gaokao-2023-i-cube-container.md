---
title: 'What fits in a unit cube'
description: 'A ball, a tetrahedron, a thin rod and a flat disk each need one long direction inside the cube: an edge, a face diagonal, the body diagonal, or the hexagonal cross-section.'
subject: 高考數學
year: 2023
questionType: 多選
questionNo: '新課標I-12'
unit: Gaokao Mathematics, New Curriculum I, solid geometry
topics:
  - Longest directions in a cube
  - Inscribed regular tetrahedron
  - Hexagonal cross-section
concepts:
  - space-vectors
sourceUrl: https://gaokaohub.com/q/item/113402010356853.html
relatedExplore:
  - space-vectors-planes-lines
relatedWorks:
  - plane-normal-distance
date: 2026-11-05
order: 23
coverImage: /images/exam-covers/gaokao-2023-i-cube-container.png
featured: false
draft: false
---

## Problem

Treat a cube of edge 1 as a container with walls of no thickness. Decide which objects fit entirely inside: a ball of diameter 0.99, a regular tetrahedron of edge 1.4, a cylinder of base diameter 0.01 and height 1.8, and a cylinder of base diameter 1.2 and height 0.01.

The wording comes from candidate recall; see the [gaokaohub write-up](https://gaokaohub.com/q/item/113402010356853.html), and compare the [liangshibao solution](https://liangshibao.com/tiku/gaokao-math-2023-i/multiple-12).

## Where it goes wrong

Students see 1.4, 1.8 and 1.2, all longer than the edge 1, and rule them out. But the cube has three directions longer than an edge: the face diagonal $\sqrt2$, the body diagonal $\sqrt3$, and a slanted hexagonal cross-section.

The opposite slip is thinking 1.8 fits because it is under 2. The body diagonal is only $\sqrt3\approx1.732$.

## Idea

- A: the inscribed ball has diameter 1, and $0.99<1$, so it fits.
- B: the four pairwise non-adjacent vertices $(0,0,0),(1,1,0),(1,0,1),(0,1,1)$ form a regular tetrahedron whose edges are face diagonals, of length $\sqrt2\approx1.414$. $1.4<\sqrt2$, so it fits.
- C: a thin rod can at most lie along the body diagonal, which is $\sqrt3\approx1.732<1.8$, so it does not fit.
- D: the plane $x+y+z=\tfrac32$ cuts a regular hexagon of side $\tfrac{\sqrt2}{2}$. Its incircle has diameter $\tfrac{\sqrt6}{2}\approx1.225>1.2$, so the flat disk fits in that plane.

The answer is ABD.

## What the figure shows

- Press **A** to **D** to switch objects. Gold is the object, cyan is the limit the cube allows.
- Drag **Turn** to view the cube from other angles. Each edge of B's tetrahedron lies on a face; C's rod pokes out past two corners.
- D's disk is drawn inside the hexagonal section, with a visible gap between the circle and the hexagon.
