---
title: 碎形仿射疊代
description: 迭代函數系統（IFS）以多組仿射映射疊代，生成自相似碎形。
tags:
  - 代數
  - 碎形
date: 2026-06-05
featured: false
draft: false
---

## 參數方程

單點 $P(x,y)$ 隨機套用四組仿射變換之一（機率矩陣），迭代後聚集成蕨葉狀吸引子：

$$
\begin{bmatrix} x_{n+1} \\ y_{n+1} \end{bmatrix}
=
\begin{bmatrix} a & b \\ c & d \end{bmatrix}
\begin{bmatrix} x_n \\ y_n \end{bmatrix}
+
\begin{bmatrix} t_x \\ t_y \end{bmatrix}
$$

**b（葉片彎曲）** 控制子分支水平偏移；**d（側枝高度）** 控制主幹向上延伸與側葉縮放。

## 互動說明

- **葉片彎曲 b**：調整仿射映射的剪切，改變葉片彎度
- **側枝高度 d**：控制分支位置，影響整體輪廓
- **生成速度 ω**：加快點雲累積，觀察碎形輪廓浮現

## 觀察重點

- 隨機迭代多組仿射映射，點雲趨向自相似結構
- 參數微調即可在「樹狀／蕨類」輪廓間連續過渡
- 邊界由大量軌跡點的分布密度決定，非單一曲線

## 相關作品

- [仿射變換圖樣](/works/affine-transform-pattern)
- [謝爾賓斯基三角形](/works/sierpinski-triangle)

## 延伸閱讀

- [迭代函數系統（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%BF%AD%E4%BB%A3%E5%87%BD%E6%95%B8%E7%B3%BB%E7%B5%B1)
