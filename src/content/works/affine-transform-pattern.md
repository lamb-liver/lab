---
title: 仿射變換圖樣
description: 平移、旋轉、縮放組合的仿射變換在圖樣上的疊代效果。
tags:
  - 代數
  - 線性代數
date: 2026-06-03
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

**θ** 為旋轉角度；**s** 隨時間微幅呼吸（約 0.72 ± 0.03）；**$t_x, t_y$** 為平移向量，其模長與 reveal 進度綁定，使圖樣由中央母圖形向四方逐步分裂生長。對基礎正方形施加同一仿射映射，並在四個方向各疊一層縮放平移（倍率 0.5）的第二層，形成對稱繁衍圖案。

## 實作要點

- **迭代座標運算**：直接對每層頂點套用仿射公式，不做圖形嵌套
- **生長擴散**：平移距離 × reveal，子圖形由內向外逐步出現
- **切換重置**：調整 θ 或平移距離 e 時重置 reveal
- **平滑過渡**：θ、e 以 lerp（0.08）連續變形；時間軸驅動旋轉呼吸與縮放呼吸

## 相關連結

- 視覺化主題：[矩陣與線性變換](/explore/matrix-linear-transform)
- 相關作品：[線性變換網格](/works/linear-transform-grid)、[旋轉縮放疊加](/works/rotation-scale-composition)、[碎形仿射疊代](/works/affine-ifs-fractal)

## 延伸閱讀

- [仿射变换（維基百科）](https://zh.wikipedia.org/wiki/%E4%BB%BF%E5%B0%84%E5%8F%98%E6%8D%A2)
