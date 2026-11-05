---
title: 'Volume range of a pyramid in a sphere'
description: 'As the lateral edge l runs over [3, 3√3], the largest volume is not at an end but where h = 4.'
subject: 高考數學
year: 2022
questionType: 單選
questionNo: '新課標I-8'
unit: Gaokao Mathematics, New Curriculum I, solid geometry
topics:
  - Circumscribed sphere
  - Extreme volume
  - Maximum by derivative
concepts:
  - derivative-tangent
sourceUrl: https://gaokaohub.com/q/item/17329642544376.html
relatedExplore:
  - secants-and-tangents
relatedWorks:
  - function-derivative-graph
date: 2026-11-05
order: 22
coverImage: /images/exam-covers/gaokao-2022-i-pyramid-in-sphere-volume.png
featured: false
draft: false
---

## Problem

All vertices of a regular square pyramid lie on one sphere of volume $36\pi$, so the radius is $R=3$. The lateral edge $l$ ranges over $[3,3\sqrt3]$. Find the range of the pyramid's volume.

The wording comes from candidate recall; see the [gaokaohub write-up](https://gaokaohub.com/q/item/17329642544376.html), and compare the [liangshibao solution](https://liangshibao.com/tiku/gaokao-math-2022-i/single-8).

## Where it goes wrong

The usual slip is to take the volumes at $l=3$ and $l=3\sqrt3$ as the minimum and maximum, giving $[27/4,81/4]$. That is one of the wrong options.

The volume is not monotonic in $l$. A longer edge makes the pyramid taller, but the base slides down the sphere and shrinks, and past some length it shrinks faster than the height grows.

## Idea

Let the height be $h$. The apex is at the top of the sphere and the base corners are on the sphere, so the right angle in the axial section gives $l^2=2Rh=6h$:

$$
h=\frac{l^2}{6},\qquad \text{half the base diagonal}=\sqrt{l^2-h^2}.
$$

The base area is twice the square of the half diagonal, so

$$
V=\frac13\cdot 2\left(l^2-h^2\right)h=\frac23(6h^2-h^3),\qquad h\in\left[\tfrac32,\tfrac92\right].
$$

$V'(h)=\tfrac23(12h-3h^2)$ vanishes at $h=4$ ($l=2\sqrt6$), where $V=64/3$. At the ends $V=27/4$ and $V=81/4<64/3$. The answer is C: $[27/4,\,64/3]$.

## What the figure shows

- Drag **Lateral edge**: the left side is the axial section of the sphere and pyramid, the right side is the curve $V(l)$.
- The gold dot climbs until $l=2\sqrt6$ and then falls, so the right end is lower than the peak.
- The cyan band is the answer. Its top is the peak $64/3$, not the end value $81/4$.
