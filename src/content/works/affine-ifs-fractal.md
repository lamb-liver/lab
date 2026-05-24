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

**b（葉片彎曲）** 控制子分支水平偏移；**d（側枝高度）** 控制主幹向上延伸與側葉縮放。數學座標以 ×28 映射至畫布，原點置於畫布下方（`translate` Y = 85% 高度）使蕨葉垂直置中。

## 實作要點

- **沙粒模擬**：每幀最多 600 次隨機迭代累積點雲（上限 15000），三層 glow `point` 繪製
- **機率矩陣**：2% 主莖、84% 主複葉、7% 左側葉、7% 右側葉
- **切換重置**：調整 b 或 d 時清空粒子並重置 reveal
- **平滑過渡**：矩陣分量 lerp（0.08）；reveal 控制可見粒子比例

## 相關連結

- 視覺化主題：[矩陣與線性變換](/explore/matrix-linear-transform)
- 相關作品：[線性變換網格](/works/linear-transform-grid)、[仿射變換圖樣](/works/affine-transform-pattern)、[旋轉縮放疊加](/works/rotation-scale-composition)

## 延伸閱讀

- [迭代函数系统（維基百科）](https://zh.wikipedia.org/wiki/%E8%BF%AD%E4%BB%A3%E5%87%BD%E6%95%B0%E7%B3%BB%E7%BB%9F)
