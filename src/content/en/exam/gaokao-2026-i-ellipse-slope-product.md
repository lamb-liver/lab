---
title: A fixed slope product and the smallest tangent on an ellipse
description: For a focal chord PQ and a diameter PR, k_QP·k_QR stays at −3/4, and tan∠PQR reduces to 4k + 3/k, minimized by AM–GM.
subject: 高考數學
year: 2026
questionType: 非選
questionNo: '新課標I-18'
unit: Gaokao Mathematics, New Curriculum I, conic sections
topics:
  - Ellipse
  - Slope product
  - AM–GM inequality
concepts:
  - conic-sections
sourceUrl: https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34471.html
relatedExplore:
  - conic-dynamic-geometry
relatedWorks:
  - ellipse-tangent-foci
date: 2026-11-06
order: 28
coverImage: /images/exam-covers/gaokao-2026-i-ellipse-slope-product.png
featured: false
draft: false
---

## Problem

The ellipse $C$ has left focus $F(-1,0)$ and eccentricity $\tfrac12$, so $C:\tfrac{x^2}{4}+\tfrac{y^2}{3}=1$. A line $l$ through $F$ with slope $k>0$ meets $C$ at $P$ and $Q$, with $Q$ in the third quadrant. The line $PO$ meets $C$ again at $R$.

- (i) If the area of $\triangle PQR$ is 3 times the area of $\triangle PFO$, find $l$.
- (ii) Find the smallest value of $\tan\angle PQR$.

The wording comes from candidate recall; see the [91apu write-up](https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34471.html), and compare the [lewang 2026 solutions](https://gk2026math.lewang.dev/solutions).

## Where it goes wrong

In (ii), the usual approach writes out the coordinates of $P$, $Q$, $R$ and computes the angle directly. The algebra gets long and breaks down halfway.

The key is $R=-P$: the slopes from $Q$ to the two ends of a diameter have a fixed product, so there is no need to solve for $R$.

## Idea

(i) $O$ is the midpoint of $PR$, so $S_{\triangle PFR}=2S_{\triangle PFO}$ and the condition becomes $\tfrac{S_{\triangle PQR}}{S_{\triangle PFR}}=\tfrac32$, that is $PF=2QF$. With Vieta's formulas this gives $k^2=\tfrac54$ and $l:y=\tfrac{\sqrt5}{2}(x+1)$.

(ii) $Q$ and $\pm P$ all lie on the ellipse, so

$$
k_{QP}\cdot k_{QR}=\frac{y_Q^2-y_P^2}{x_Q^2-x_P^2}=-\frac{b^2}{a^2}=-\frac34,
$$

and $k_{QR}=-\tfrac{3}{4k}$. The angle formula gives

$$
\tan\angle PQR=\frac{k+\tfrac{3}{4k}}{1-\tfrac34}=4k+\frac3k\ge 4\sqrt3,
$$

with equality at $k=\tfrac{\sqrt3}{2}$. The minimum is $4\sqrt3$.

## What the figure shows

- Drag the slope $k$. Gold is $l$, cyan is $QR$, and the dashed line is the diameter $PR$. The sidebar's $k_{QP}\cdot k_{QR}$ stays at $-0.75$.
- The bottom curve is $\tan\angle PQR=4k+\tfrac3k$; the gold dot is the minimum $4\sqrt3$.
- The "(i)" and "(ii)" buttons jump to $k=\tfrac{\sqrt5}{2}$ and $k=\tfrac{\sqrt3}{2}$, and the sidebar shows the area ratio too.
