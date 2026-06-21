---
title: 旋轉縮放疊加
description: 連續旋轉與均勻縮放的矩陣乘積，觀察螺旋與對數螺線的生成。
tags:
  - 線性代數
date: 2026-05-25
order: 18
featured: false
draft: false
---

## 參數方程

每次將圖形乘以旋轉縮放矩陣 $M = s \cdot R(\theta)$：

$$
\begin{bmatrix} x_{n+1} \\ y_{n+1} \end{bmatrix}
=
\begin{bmatrix}
s\cos\theta & -s\sin\theta \\
s\sin\theta & s\cos\theta
\end{bmatrix}
\begin{bmatrix} x_n \\ y_n \end{bmatrix}
$$

**θ** 為相鄰兩層的旋轉步進；**s**（&lt; 1）決定向中心收斂速度。外框與內層頂點連線交織，形成對數螺旋狀網格。

## 互動說明

- **旋轉步進 θ**：每次疊加方塊的旋轉角；改變螺旋感
- **縮放比例 s**：控制每步縮放，影響圖樣向中心收斂或發散
- **演變速度 ω**：驅動參數週期變化，觀察螺旋圖樣演化

## 觀察重點

- 旋轉與均勻縮放可合成同一個矩陣；在此設定下兩者可交換，反覆疊代才形成螺旋結構
- 縮放因子接近 1 時圖樣更密集；過小則快速收斂至中心
- 反覆疊代產生對數螺線型的視覺結構

## 相關作品

- [線性變換網格](/works/linear-transform-grid)
- [仿射變換圖樣](/works/affine-transform-pattern)
- [等角螺線](/works/equiangular-spiral)

## 延伸閱讀

- [旋轉矩陣（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%97%8B%E8%BD%89%E7%9F%A9%E9%98%B5)
