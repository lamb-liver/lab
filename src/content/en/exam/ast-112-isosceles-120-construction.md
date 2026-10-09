---
title: A 120° isosceles construction and the cosine law
description: "112 AST Mathematics I, Fill-in 9: read the vertex angle and the base angles, then use an angle-sum formula and the cosine law for the squared distance between the new vertices."
subject: 分科數甲
year: 112
questionType: 選填
questionNo: '9'
unit: Grades 10-11, Mathematics A · Trigonometric ratios and trigonometric functions
topics:
  - Isosceles triangles
  - Angle-sum formulas
  - Cosine law
concepts:
  - law-of-sines-cosines
  - trig-identities
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0n214409428400270207/01-112%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E9%A1%8C.pdf
analysisUrl: https://www.ceec.edu.tw/files/file_pool/1/0N248425984561318981/1-112%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E5%90%84%E7%A7%91PD%E5%80%BC%28%E6%95%B8%E5%AD%B8%E7%94%B2%29.pdf
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - law-of-sines-cosines
  - trig-angle-identities
date: 2026-07-28
order: 9
coverImage: /images/exam-covers/ast-112-isosceles-120-construction.png
featured: false
draft: false
---

## Problem

Right triangle $\triangle ABC$ has $AB=\sqrt7$, $AC=\sqrt3$, and $BC=2$. On bases $AB$ and $AC$, construct isosceles triangles $\triangle MAB$ and $\triangle NAC$ outside $\triangle ABC$, each with vertex angle $120^\circ$. Find $MN^2$. The original wording and the answer format are on the [CEEC 112 AST Mathematics I paper](https://www.ceec.edu.tw/files/file_pool/1/0n214409428400270207/01-112%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E9%A1%8C.pdf).

## Where it goes wrong

The CEEC [item statistics](https://www.ceec.edu.tw/files/file_pool/1/0N248425984561318981/1-112%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E5%90%84%E7%A7%91PD%E5%80%BC%28%E6%95%B8%E5%AD%B8%E7%94%B2%29.pdf) give this item a correct rate of $29\%$ and a discrimination of $0.59$. The first trap is to treat $120^\circ$ as a base angle. It is the vertex angle, so each base angle is $30^\circ$. The second trap is to leave out the two outer base angles and write $\angle MAN$ as the angle at $A$ in the original right triangle.

## Idea

Let $\theta=\angle BAC$. From the right triangle,

$$
\cos\theta=\frac{\sqrt3}{\sqrt7}=\frac{3}{\sqrt{21}},
\qquad
\sin\theta=\frac{2}{\sqrt7}.
$$

Since $AC^2+BC^2=3+4=7=AB^2$, the right angle is at $C$ and $AB=\sqrt7$ is the hypotenuse. The new triangles are built outward on $AB$ and on $AC$. A vertex angle of $120^\circ$ makes each base angle $30^\circ$. The side ratios of a $30^\circ$-$60^\circ$-$90^\circ$ triangle give

$$
\begin{aligned}
AM&=\frac{\sqrt7}{\sqrt3}=\frac{\sqrt{21}}{3},\\
AN&=\frac{\sqrt3}{\sqrt3}=1.
\end{aligned}
$$

Both isosceles triangles lie outside the original triangle, so

$$
\angle MAN=\theta+30^\circ+30^\circ=\theta+60^\circ.
$$

The angle-sum formula gives

$$
\begin{aligned}
\cos(\theta+60^\circ)
&=\cos\theta\cos60^\circ-\sin\theta\sin60^\circ\\
&=-\frac{\sqrt{21}}{14}.
\end{aligned}
$$

The cosine law in $\triangle AMN$ then gives

$$
\begin{aligned}
MN^2
&=AM^2+AN^2-2(AM)(AN)\cos\angle MAN\\
&=\frac73+1+1\\
&=\frac{13}{3}.
\end{aligned}
$$

## What the figure shows

- Drag **φ**. The two base angles stay equal to $(180^\circ-\varphi)/2$.
- Press **Back to the original, φ=120°** and check that both base angles are $30^\circ$.
- Compare $\angle MAN$ on the figure with the exact value in the sidebar. Both outer base angles belong in the included angle used by the cosine law.
