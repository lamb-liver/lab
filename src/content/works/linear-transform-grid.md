---
title: 線性變換網格
description: 2×2 矩陣作用在平面格點上，觀察剪切、旋轉與縮放效果。
tags:
  - 線性代數
date: 2026-06-02
featured: false
draft: false
---

## 參數方程

線性變換將直角座標平面上的點 $P(x,y)$ 映射到 $P'(x',y')$：

$$
\begin{bmatrix} x' \\ y' \end{bmatrix}
=
\begin{bmatrix} a & b \\ c & d \end{bmatrix}
\begin{bmatrix} x \\ y \end{bmatrix}
$$

$$
x' = a \cdot x + b \cdot y,\quad
y' = c \cdot x + d \cdot y
$$

本實驗中 **b（X 軸剪切）** 控制垂直線往水平方向傾斜；**d（Y 軸伸縮）** 控制網格在垂直方向的拉伸或壓縮。隨時間 $t$ 推進，$a$ 亦隨 $\sin(\omega t)$ 微幅振盪，使網格持續展開或收攏，同時保持線性變換的核心性質：直線仍映射為直線，原點不動。

## 互動說明

- **X 剪切 b**：拖動滑桿使垂直線傾斜，觀察平行四邊形格變形
- **Y 伸縮 d**：控制垂直方向拉伸或壓縮
- **變換速度 ω**：網格隨時間微幅呼吸，仍保持直線映射為直線

## 觀察重點

- 線性變換下原點固定，直線仍映射為直線
- 剪切改變角度但不改變平行性
- 同時剪切與伸縮可產生一般仿射網格，預覽矩陣作用效果

## 相關作品

- [矩陣與線性變換](/explore/matrix-linear-transform)
- [仿射變換圖樣](/works/affine-transform-pattern)
- [旋轉縮放疊加](/works/rotation-scale-composition)

## 延伸閱讀

- [變換矩陣（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%AE%8A%E6%8F%9B%E7%9F%A9%E9%98%B5)
