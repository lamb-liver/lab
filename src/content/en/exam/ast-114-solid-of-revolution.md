---
title: Same area, same volume of revolution?
description: "114 AST Math A, Written 17: compare a family of functions with the same area, and find the maximum volume of the solid of revolution by the disk method."
subject: 分科數甲
year: 114
questionType: 非選
questionNo: '17'
unit: Senior-high year 3 elective Math A · Applications of integration
topics:
  - Definite integrals
  - Disk method
  - Riemann sums
concepts:
  - definite-integral
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0p212559382035851587/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://www.ceec.edu.tw/files/file_pool/1/0p212559924382457587/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E9%9D%9E%E9%81%B8%E6%93%87%E9%A1%8C%E8%A9%95%E5%88%86%E5%8E%9F%E5%89%87.pdf
relatedExplore:
  - limits-riemann-sum
relatedWorks:
  - riemann-sum
date: 2026-07-24
order: 4
coverImage: /images/exam-covers/ast-114-solid-of-revolution.png
featured: false
draft: false
---

## Problem

For $-\frac12\le a\le 1$,

$$
f(x)=3ax^2+1-a
$$

stays at least $0$ on $[-1,1]$, and the area between the graph and the $x$-axis is always $2$. The region is rotated about the $x$-axis. The question asks whether the volumes are still all equal and, if not, what the maximum is. The full item is on the [Original paper](https://www.ceec.edu.tw/files/file_pool/1/0p212559382035851587/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E5%8D%B7.pdf).

## Where it goes wrong

The easy mistake is to say that equal areas give equal volumes. Area adds the height $f(x)$. A disk adds the square of the radius, $\pi f(x)^2$. Shift the same area farther from the axis of rotation and the volume grows. The [Official solutions](https://www.ceec.edu.tw/files/file_pool/1/0p212559924382457587/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E9%9D%9E%E9%81%B8%E6%93%87%E9%A1%8C%E8%A9%95%E5%88%86%E5%8E%9F%E5%89%87.pdf) split the work into three required steps: write the disk integral, compute the volume in terms of $a$, and find the maximum on the given interval.

## Idea

A thin disk of thickness $dx$ has radius about $f(x)$, the distance from the $x$-axis, and volume about

$$
\pi f(x)^2\,dx.
$$

Adding the disks and taking the limit gives

$$
\begin{aligned}
V
&=\pi\int_{-1}^{1}(3ax^2+1-a)^2\,dx\\
&=\pi\int_{-1}^{1}
\left(9a^2x^4+6a(1-a)x^2+(1-a)^2\right)\,dx\\
&=2\pi+\frac85\pi a^2.
\end{aligned}
$$

The volume changes with $a^2$, so the solids are not all the same size. On $-\frac12\le a\le 1$, the largest $a^2$ is at $a=1$, and

$$
V_{\max}=2\pi+\frac85\pi=\frac{18}{5}\pi.
$$

## What the figure shows

- Move **Parameter a**. The area stays $2$, while the height shifts and the solid, rotated about the $x$-axis, gets thicker or thinner.
- The gold section curves are the disk edges. Their radius is $f(x)$. Raise **Number of slices n** and the midpoint Riemann sum moves toward the exact volume.
- Press **Replay the sweep** to watch the graph turn about the $x$-axis into the wireframe solid.
