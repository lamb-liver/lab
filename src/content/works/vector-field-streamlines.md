---
title: 向量場流線
description: 沿向量場方向積分得到的軌跡，展示微分方程解的幾何圖像。
tags:
  - 分析
  - 微積分
date: 2026-07-06
featured: false
draft: false
---

## 參數方程

給定向量場 $\mathbf{F}(x,y)=(F_x,F_y)$，流線是下列常微分方程的解：

$$
\frac{dx}{dt}=F_x(x,y),\quad
\frac{dy}{dt}=F_y(x,y)
$$

等價寫法：

$$
\frac{d\mathbf{r}}{dt}=\mathbf{F}(\mathbf{r}(t))
$$

可視為方向場的積分曲線，用於理解梯度、旋度與一階微分方程的解。

互動 canvas 與完整說明待實作。

## 相關連結

- 視覺化主題：[極限與黎曼和](/explore/limits-riemann-sum)
- 相關作品：[黎曼和動態圖](/works/riemann-sum)、[切線逼近動畫](/works/tangent-approximation)、[曳物線](/works/catenary)、[等角螺線](/works/equiangular-spiral)
