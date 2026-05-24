---
title: 旋轉縮放疊加
description: 連續旋轉與均勻縮放的矩陣乘積，觀察螺旋與對數螺線的生成。
tags:
  - 代數
  - 線性代數
date: 2026-06-04
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

**θ** 為相鄰兩層的旋轉步進；**s**（&lt; 1）決定向中心收斂速度。外框與內層頂點連線交織，形成對數螺旋狀網格；reveal 控制可繪製的疊加層數（最多 60 層），由外向内逐層收攏。

## 實作要點

- **矩陣迭代**：複合旋轉縮放矩陣遞迴變換頂點，每層收集外框線與內外交織線
- **逐層生長**：`floor(60 × reveal)` 決定迭代層數
- **切換重置**：調整 θ 或 s 時重置 reveal
- **平滑過渡**：θ、s 以 lerp（0.08）連續變形；時間驅動呼吸角偏移

## 相關連結

- 視覺化主題：[矩陣與線性變換](/explore/matrix-linear-transform)
- 相關作品：[線性變換網格](/works/linear-transform-grid)、[仿射變換圖樣](/works/affine-transform-pattern)、[碎形仿射疊代](/works/affine-ifs-fractal)

## 延伸閱讀

- [旋转矩阵（維基百科）](https://zh.wikipedia.org/wiki/%E6%97%8B%E8%BD%AC%E7%9F%A9%E9%98%B5)
