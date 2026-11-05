---
title: Cylinder and cone of equal height
description: A cylinder and a cone share a base radius and a height, so equal lateral areas fix the cone volume.
subject: 高考數學
year: 2024
questionType: 單選
questionNo: '新課標I-5'
unit: Gaokao Mathematics, New Curriculum I, solid geometry
topics:
  - Cylinder lateral area
  - Cone slant height
  - Cone volume
concepts:
  - law-of-sines-cosines
sourceUrl: https://zhuanlan.zhihu.com/p/702451963
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - law-of-sines-cosines
date: 2026-11-04
order: 18
coverImage: /images/exam-covers/gaokao-2024-i-cone-cylinder-lateral.png
featured: false
draft: false
---

## Problem

A cylinder and a cone share a base radius. Their lateral areas are equal, and both heights are $\sqrt{3}$. Find the volume of the cone.

The wording comes from candidate recall; see the [full-paper notes on Zhihu](https://zhuanlan.zhihu.com/p/702451963).

## Where it goes wrong

The slant is longer than the height. Writing the cone’s lateral area as $\pi r\sqrt{3}$ makes it exactly half the cylinder’s, so the two areas never match.

After the radius is right, the volume still has a factor $\tfrac13$. Dropping it at $r=3$ produces $9\sqrt{3}\pi$, three times the cone. Using $\tfrac23$ instead produces $6\sqrt{3}\pi$.

One coincidence remains. Set the radius equal to the height $\sqrt{3}$, then drop the $\tfrac13$. The number printed is $3\sqrt{3}\pi$, while the lateral areas are not equal.

## Idea

Let the shared base radius be $r>0$. The cylinder’s lateral area is $2\pi r\sqrt{3}$. The cone’s slant is $l=\sqrt{r^2+3}$, and its lateral area is $\pi rl$.

$$
2\sqrt{3}=\sqrt{r^2+3}.
$$

Squaring both sides gives $r^2=9$, so the positive root is $r=3$ and the slant is $l=2\sqrt{3}$. The radius, the height, and the slant form a right triangle; at a right angle the cosine law reduces to $l^2=r^2+3$.

$$
V=\frac13\pi r^2\sqrt{3}=3\sqrt{3}\pi.
$$

The formulas are the high-school lateral area and volume. The volume is not a surface spun and integrated.

## What the figure shows

- Drag **Base radius r**. The two axial sections keep the same height. In the right triangle the horizontal leg is $r$ and the hypotenuse is the slant.
- When the lateral areas meet, the volume stays at $3\sqrt{3}\pi$ and the slant is $2\sqrt{3}$.
- Near $r=\sqrt{3}$ the lateral areas split, and the quantity with the $\tfrac13$ omitted still reads $3\sqrt{3}\pi$.
