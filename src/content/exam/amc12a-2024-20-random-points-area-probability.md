---
title: 邊上兩個隨機點的面積機率
description: 2024 AMC 12A 第20題：面積比化成 xy，用單位正方形與模擬把機率夾在 3/4 到 7/8。
subject: AMC 12A
year: 2024
questionType: 單選
questionNo: '20'
unit: AMC 12・幾何機率
topics:
  - 幾何機率
  - 面積比
  - 隨機模擬
concepts:
  - classical-probability
  - definite-integral
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2024_AMC_12A_Problems/Problem_20
relatedExplore:
  - probability-statistics
  - limits-riemann-sum
relatedWorks:
  - buffon-needle
  - natural-log-e-geometry
date: 2026-09-25
order: 17
coverImage: /images/exam-covers/amc12a-2024-20-random-points-area-probability.png
featured: false
draft: false
---

## 題意

在正三角形 $ABC$ 的邊 $AB$、$AC$ 上，各自獨立、均勻地隨機取一點 $P$、$Q$。問 $\triangle APQ$ 的面積小於 $\triangle ABC$ 面積一半的機率，落在哪一個區間。（五選一，選項都是區間）

完整題目與選項見 [AoPS 題目頁](https://artofproblemsolving.com/wiki/index.php/2024_AMC_12A_Problems/Problem_20)。

## 為什麼會錯

- 以為「隨機」加上對稱，機率就是 $\frac12$。面積比是 $xy$，不是 $x$ 或 $\frac{x+y}{2}$；兩點都在中點時面積比只有 $\frac14$，小於一半的情況其實是多數。
- 知道要算 $xy<\frac12$ 的機率，卻把分界 $xy=\frac12$ 當成直線；它是雙曲線，區域面積跟著算錯。
- 以為一定要會 $\int\frac1x\,dx=\ln x$ 才能做。題目只問落在哪個區間，用夾擠就夠了。

## 觀念

設 $x=\frac{AP}{AB}$、$y=\frac{AQ}{AC}$，兩者獨立且均勻分佈在 $[0,1]$。兩三角形共用 $\angle A$：

$$
\frac{[APQ]}{[ABC]}=\frac{\frac12\,AP\cdot AQ\sin A}{\frac12\,AB\cdot AC\sin A}=xy.
$$

所求就是單位正方形中 $xy<\frac12$ 的面積。補集 $xy\ge\frac12$ 在曲線 $y=\frac{1}{2x}$ 上方，而且只出現在 $\left[\frac12,1\right]^2$ 裡：

$$
1-\int_{1/2}^{1}\left(1-\frac{1}{2x}\right)dx=\frac12+\frac{\ln2}{2}\approx0.8466.
$$

（$\frac1x$ 的積分與自然對數 $\ln$ 超出高中數學的學習內容，這裡只用來給出精確值。）

不用積分也行：補集包住以 $\left(\frac12,1\right)$、$(1,1)$、$\left(1,\frac12\right)$ 為頂點的三角形（曲線下凸，弦在曲線上方），面積大於 $\frac18$；又被邊長 $\frac12$ 的正方形包住，面積小於 $\frac14$。所以機率介於 $\frac34$ 與 $\frac78$ 之間，選 (D)。

## 互動怎麼看

- 拖曳左圖的 $P$、$Q$（或右圖的點）：金色的 $\triangle APQ$ 與正方形裡的點同步移動；點移到金色曲線 $xy=\frac12$ 右上方時，面積比就不小於一半。
- 模擬兩萬組隨機的 $(x,y)$：藍點在曲線下方、紅點在上方，下方折線是累積比例，逐漸收斂到約 0.8466，停在金色帶狀區 $\left(\frac34,\frac78\right]$ 裡。
- 按「顯示夾擠圖形」：紅色區域被虛線正方形包住、又包住金色三角形，不用積分就能把機率夾在 $\frac34$ 與 $\frac78$ 之間。
