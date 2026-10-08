---
title: 碎形仿射疊代
description: 疊代函數系統（IFS）以多組仿射映射疊代，生成自相似碎形。
tags:
  - 幾何
concepts:
  - fractal
  - linear-transformation
date: 2026-05-25
order: 19
featured: false
draft: false
---

## 參數方程

單點 $P(x,y)$ 依固定機率套用四組仿射變換之一，疊代後聚集成蕨葉狀吸引子：

$$
\begin{bmatrix} x_{n+1} \\ y_{n+1} \end{bmatrix}
=
\begin{bmatrix} a & b \\ c & d \end{bmatrix}
\begin{bmatrix} x_n \\ y_n \end{bmatrix}
+
\begin{bmatrix} t_x \\ t_y \end{bmatrix}
$$

**b（葉片彎曲）** 控制主幹映射的剪切；**d（側枝高度）** 控制該映射的上下縮放。

## 互動說明

- **葉片彎曲 b**：調整仿射映射的剪切，改變葉片彎度
- **側枝高度 d**：控制分支位置，影響整體輪廓
- **生成速度 ω**：驅動兩片側葉縮放的微幅起伏

## 觀察重點

- 隨機疊代多組仿射映射，點雲趨向自相似結構
- 參數微調即可讓蕨葉的彎度與高低連續過渡
- 邊界由大量軌跡點的分佈密度決定，非單一曲線

## 相關作品

- [仿射變換圖樣](/works/affine-transform-pattern)
- [謝爾賓斯基三角形](/works/sierpinski-triangle)

## 延伸閱讀

- [疊代函數系統（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%BF%AD%E4%BB%A3%E5%87%BD%E6%95%B8%E7%B3%BB%E7%B5%B1)
