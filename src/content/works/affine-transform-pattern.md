---
title: 仿射變換圖樣
description: 平移、旋轉、縮放組合的仿射變換在圖樣上的疊代效果。
tags:
  - 線性代數
date: 2026-05-25
order: 17
featured: false
draft: false
---

## 參數方程

仿射變換在線性部分之外允許平移，讓圖形可移動並自我複製：

$$
\begin{bmatrix} x' \\ y' \end{bmatrix}
=
\begin{bmatrix} a & b \\ c & d \end{bmatrix}
\begin{bmatrix} x \\ y \end{bmatrix}
+
\begin{bmatrix} t_x \\ t_y \end{bmatrix}
$$

$$
x' = (s \cos\theta)\,x - (s \sin\theta)\,y + t_x,\quad
y' = (s \sin\theta)\,x + (s \cos\theta)\,y + t_y
$$

**θ** 為旋轉角度；**s** 隨時間微幅呼吸（約 0.72 ± 0.03）；**$t_x, t_y$** 為平移向量，圖樣由中央母圖形向四方逐步分裂生長。對基礎正方形施加同一仿射映射，並在四個方向各疊一層縮放平移（倍率 0.5）的第二層，形成對稱繁衍圖案。

## 互動說明

- **旋轉角度 θ**：改變每次疊代的旋轉量，圖樣對稱性隨之改變
- **平移距離 e**：控制圖樣在平面上的間距與密度
- **演變速度 ω**：驅動參數週期變化，圖樣連續演化

## 觀察重點

- 反覆仿射映射可產生週期或準週期圖樣
- 平移與旋轉組合決定圖樣的格子結構
- 參數連續變化時圖樣平滑變形，而非瞬間替換

## 相關作品

- [線性變換網格](/works/linear-transform-grid)
- [碎形仿射疊代](/works/affine-ifs-fractal)
- [旋轉縮放疊加](/works/rotation-scale-composition)

## 延伸閱讀

- [仿射變換（維基百科）](https://zh.wikipedia.org/zh-tw/%E4%BB%BF%E5%B0%84%E8%AE%8A%E6%8F%9B)
