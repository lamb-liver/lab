---
title: The altitude cuts the bisector
description: "2025 AMC 12A #16: the whole bisector is 48; BP is the remaining 21."
subject: AMC 12A
year: 2025
questionType: 單選
questionNo: '16'
unit: AMC 12, angle bisector
topics:
  - Angle bisector theorem
  - Similar triangles
  - Isosceles triangle
concepts:
  - law-of-sines-cosines
  - trig-functions
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2025_AMC_12A_Problems/Problem_16
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - law-of-sines-cosines
  - trig-angle-identities
date: 2026-11-18
order: 40
coverImage: /images/exam-covers/amc12a-2025-16-bisector-altitude.png
featured: false
draft: false
---

## Problem

A triangle has side lengths $AB=80$, $BC=45$, and $AC=75$. The bisector of $\angle B$ meets the altitude to $AB$ at $P$. Find $BP$. There are five choices.

The full problem and the choices are on the [AoPS problem page](https://artofproblemsolving.com/wiki/index.php/2025_AMC_12A_Problems/Problem_16).

## Where it goes wrong

- The whole bisector has length $48$. That number is not among the choices. Stopping there leaves $BP$ unanswered.
- $CD$ has length $27$. Subtracting it from $BC$ gives $45-27=18$, which removes the wrong pair of lengths. $18$ is choice (A).
- $PD$ is also $27$. The problem asks for the segment from $B$ to $P$.

## Idea

The bisector meets $AC$ at $D$. The angle bisector theorem gives

$$
\frac{AD}{DC}=\frac{AB}{BC}=\frac{80}{45}=\frac{16}{9}.
$$

Since $AC=75$, $AD=48$ and $DC=27$.

$\triangle CBD$ and $\triangle CAB$ share $\angle C$, and the sides enclosing that angle are proportional:

$$
\frac{CB}{CA}=\frac{45}{75}=\frac35,\qquad \frac{CD}{CB}=\frac{27}{45}=\frac35.
$$

Thus $\triangle CBD\sim\triangle CAB$, with vertices $C\to C$, $B\to A$, $D\to B$. Therefore

$$
\frac{BD}{AB}=\frac35,\qquad BD=48.
$$

$BD=AD$, so $\triangle ABD$ is isosceles and its base angles are equal. Set $\angle DAB=\angle DBA=\theta$. The bisector splits $\angle ABC$ in half, so $\angle ABC=2\theta$.

The altitude to $AB$ is perpendicular to $AB$. In $\triangle CDP$, $\angle DCP$ is the angle between $AC$ and this altitude, so it equals $90^\circ-\theta$. $BD$ meets $AB$ at angle $\theta$ and the altitude meets $AB$ at $90^\circ$, so $BD$ meets the altitude at $90^\circ-\theta$. That angle is $\angle DPC$. The base angles match, $\triangle CDP$ is isosceles, and $PD=CD=27$.

$P$ lies on $BD$, so

$$
BP=BD-PD=48-27=21.
$$

The choice is (D).

## What the figure shows

- The figure starts with the whole bisector. The reading is $48$.
- Choose "The cut segment" and the altitude appears, with $PD$ in gold. The reading is $27$.
- Choose "Remaining BP" and the gold segment moves to the piece from $B$ to $P$. The reading is $21$.
