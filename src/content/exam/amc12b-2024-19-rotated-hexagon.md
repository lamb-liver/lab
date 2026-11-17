---
title: 轉出來的六邊形不是 60°
description: 2024 AMC 12B 第19題：30° 與 60° 的六邊形面積都不是 91√3。
subject: AMC 12B
year: 2024
questionType: 單選
questionNo: '19'
unit: AMC 12・三角與面積
topics:
  - 旋轉
  - 六邊形面積
  - 倍角
concepts:
  - trig-functions
  - trig-identities
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2024_AMC_12B_Problems/Problem_19
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - trig-angle-identities
  - unit-circle-trig-definition
date: 2026-11-17
order: 38
coverImage: /images/exam-covers/amc12b-2024-19-rotated-hexagon.png
featured: false
draft: false
---

## 題意

邊長 $14$ 的正三角形繞它的中心轉一個角度 $\theta$，$0<\theta\le 60^\circ$，得到第二個正三角形。六個頂點交錯連成的六邊形面積是 $91\sqrt3$。求 $\tan\theta$。五選一。

完整題目與選項見 [AoPS 題目頁](https://artofproblemsolving.com/wiki/index.php/2024_AMC_12B_Problems/Problem_19)。

## 為什麼會錯

- 轉到 $60^\circ$ 時，六個頂點把外接圓六等分，凸包是正六邊形，面積 $98\sqrt3$，不是 $91\sqrt3$。這是這個範圍裡面積最大的位置。
- 轉到 $30^\circ$ 時 $\tan\theta=\frac1{\sqrt3}$，面積是 $147=49\sqrt3\times\sqrt3$，比 $91\sqrt3$ 小。
- 半角的正切是 $\frac{\sqrt3}{5}$。停在半角，沒有用倍角公式送回 $\theta$，得不到 $\frac{5\sqrt3}{11}$。$\frac45$ 約是 $0.8$，跟答案 $0.787$ 很近，但那個角度的面積不是 $91\sqrt3$。

## 觀念

正三角形面積是 $\frac{\sqrt3}{4}\times 14^2=49\sqrt3$。外心到頂點是高的 $\frac23$，所以外接圓半徑

$$
R=\frac{14\sqrt3}{3},\qquad R^2=\frac{196}{3}.
$$

六個頂點都在這個圓上。相鄰圓心角交替是 $\theta$ 與 $120^\circ-\theta$。六邊形分成六個等腰三角形：

$$
\text{面積}=\frac12 R^2\cdot 3\big(\sin\theta+\sin(120^\circ-\theta)\big)=49\big(3\sin\theta+\sqrt3\cos\theta\big).
$$

在 $(0,60^\circ]$ 裡這個式子嚴格增加，從 $49\sqrt3$ 增到 $98\sqrt3$，所以等於 $91\sqrt3$ 只有一個角。令它等於 $91\sqrt3$：

$$
3\sin\theta+\sqrt3\cos\theta=\frac{13\sqrt3}{7}.
$$

設 $t=\tan\theta$，則 $\sin\theta=\frac{t}{\sqrt{1+t^2}}$、$\cos\theta=\frac{1}{\sqrt{1+t^2}}$，

$$
\frac{3t+\sqrt3}{\sqrt{1+t^2}}=\frac{13\sqrt3}{7}.
$$

$\theta$ 在這個範圍裡兩邊都是正的。平方後整理成 $11t^2-49\sqrt3\,t+60=0$。判別式 $4563=3\times 39^2$，兩根是

$$
t=\frac{5\sqrt3}{11}\quad\text{與}\quad t=4\sqrt3.
$$

$4\sqrt3=\tan(120^\circ-\theta)$，對應的角度大於 $60^\circ$，不在題目範圍裡；那個角度的面積同樣是 $91\sqrt3$，題目只要不超過 $60^\circ$ 的那一個。

留下的 $t=\frac{5\sqrt3}{11}$ 給出 $\sin\theta=\frac{5\sqrt3}{14}$、$\cos\theta=\frac{11}{14}$，代回面積正好是 $91\sqrt3$。選 (B)。

半角可以事後算出來，不是另一步：

$$
\tan\frac\theta2=\frac{\sin\theta}{1+\cos\theta}=\frac{\sqrt3}{5},\qquad
\tan\theta=\frac{2\cdot\frac{\sqrt3}{5}}{1-\frac{3}{25}}=\frac{5\sqrt3}{11}.
$$

## 互動怎麼看

- 滑桿從 $0^\circ$ 走到 $60^\circ$。青色六邊形是六個頂點的凸包，讀數是它的面積。
- 點選 $30^\circ$：面積 $147$，不是 $91\sqrt3$。點選 $60^\circ$：面積 $98\sqrt3$，是這個範圍的最大值，仍然不是。
- 點選「面積 $91\sqrt3$」：$\tan\theta$ 停在 $\frac{5\sqrt3}{11}$。
