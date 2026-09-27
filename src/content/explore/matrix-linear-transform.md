---
title: 矩陣與線性變換
description: 同一個 2×2 矩陣如何用兩欄向量帶走整張平面，並在面積與合成順序上換角色。
category: 代數
concepts:
  - matrix
  - linear-transformation
  - eigenvector
date: 2026-05-25
order: 4
coverImage: /images/explore-covers/matrix-linear-transform.png
featured: false
draft: false
---

## 基本概念

$$
\begin{bmatrix} a & b \\ c & d \end{bmatrix}
\begin{bmatrix} x \\ y \end{bmatrix}
=
\begin{bmatrix} ax+by \\ cx+dy \end{bmatrix}
$$

矩陣把平面上每個向量送到新位置；基底 $\hat{\imath},\hat{\jmath}$ 被送去哪裡，就決定整個線性變換。

## 互動說明

- **自由變換**：拖動矩陣元素 $a,b,c,d$，觀察 $\hat{\imath},\hat{\jmath}$ 的像如何拉動整張網格，側欄同步顯示 $\det$ 的絕對值與正負
- **特殊變換**：選旋轉、縮放、剪切或反射，用單一參數觀察每一類各自把網格變成什麼形狀
- **變換疊加**：調整 A 旋轉角與 B 剪切量，比較兩個變換先後順序不同的結果

建議順序：自由變換 → 特殊變換 → 變換疊加。

## 觀察重點

- 兩欄向量被送到哪裡，整張網格就跟到哪裡；矩陣元素只是這兩支像的座標。
- 行列式讀的是同一變換帶走的面積與定向；壓扁成直線或點時，沒有可逆的回去。
- 兩個變換接起來仍是對同一張平面做事；先後對調通常對不到同一張網格，因為中間那張圖已經被改過了。

## 相關作品

- [特徵向量與伸縮比](/works/eigenvector-geometry)
- [線性變換網格](/works/linear-transform-grid)
- [仿射變換圖樣](/works/affine-transform-pattern)
- [旋轉縮放疊加](/works/rotation-scale-composition)
- [碎形仿射疊代](/works/affine-ifs-fractal)

## 延伸閱讀

- [線性映射（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%B7%9A%E6%80%A7%E6%98%A0%E5%B0%84)
- [行列式（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%A1%8C%E5%88%97%E5%BC%8F)
