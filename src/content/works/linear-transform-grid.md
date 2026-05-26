---
title: 線性變換網格
description: 2×2 矩陣作用在平面格點上，觀察剪切、旋轉與縮放效果。
tags:
  - 代數
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

## 實作要點

- **矩陣直接映射**：以二維線性公式即時計算每條網格線端點，不依賴外部向量函式庫
- **網格生長**：網格線從原點向四向對稱展開，逐步填滿畫面（reveal）
- **切換重置**：調整 $b$ 或 $d$ 時重置 reveal，重新觸發由軸心向外的生長動畫
- **變形過渡**：拖動滑桿時以 lerp（係數 0.08）平滑過渡剪切與伸縮
- **動態邊界**：依變換後四角包圍盒自動縮放，使變形網格始終落在可視區內

## 相關連結

- 視覺化主題：[矩陣與線性變換](/explore/matrix-linear-transform)
- 相關作品：[仿射變換圖樣](/works/affine-transform-pattern)、[旋轉縮放疊加](/works/rotation-scale-composition)、[碎形仿射疊代](/works/affine-ifs-fractal)

## 延伸閱讀

- [變換矩陣（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%AE%8A%E6%8F%9B%E7%9F%A9%E9%98%B5)
