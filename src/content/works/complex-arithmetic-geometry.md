---
title: 複數四則運算的幾何意義
description: 在複平面上以向量與旋轉展示加、減、乘、除的幾何效果。
tags:
  - 代數
  - 複數
date: 2026-08-02
featured: false
draft: false
---

## 概述

複數加減對應平面向量的平移合成；乘法將幅角相加、模長相乘；除法則為幅角相減、模長相除。以動態箭頭與軌跡可同時看見代數式與幾何操作。

## 參數方程

設 $z_1=r_1 e^{i\theta_1}$、$z_2=r_2 e^{i\theta_2}$：

$$
z_1+z_2 \Rightarrow (x_1+x_2,\, y_1+y_2),\quad
z_1 z_2 \Rightarrow r_1 r_2\, e^{i(\theta_1+\theta_2)}
$$

$$
\frac{z_1}{z_2} \Rightarrow \frac{r_1}{r_2}\, e^{i(\theta_1-\theta_2)}
$$

## 實作要點

- **雙複數滑桿**：分別調整 $z_1,z_2$ 的實部、虛部或極形式 $r,\theta$
- **運算模式切換**：加／減／乘／除四種模式，高亮結果向量 $z_{\mathrm{out}}$
- **平行四邊形法**：加法時顯示 $z_1$、$z_2$ 與合成邊的向量平行四邊形
- **乘法動畫**：$z_1$ 固定，$z_2$ 沿單位圓旋轉，觀察 $z_1 z_2$ 的旋轉與伸縮

## 相關連結

- 相關作品：[相位圖](/works/complex-phase-portrait)、[複數的極座標形式](/works/complex-polar-form)、[尤拉公式旋轉動畫](/works/euler-formula-rotation)

## 延伸閱讀

- [複數（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%A4%87%E6%95%B8)
