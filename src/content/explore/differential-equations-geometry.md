---
title: 微分方程的幾何視覺化
description: 以斜率場與尤拉法理解 dy/dx = f(x,y)；初始條件決定解曲線的走向。
category: 分析
date: 2026-07-02
coverImage: /images/explore-covers/differential-equations-geometry.png
featured: false
draft: false
---

## 基本概念

$$
\frac{dy}{dx} = f(x, y)
$$

方程式不直接給出 $y$ 的值，而是給出平面上每點的變化方向；解曲線是順著該方向積分而成的軌跡。

## 互動說明

- **斜率場**：在視窗內繪製方向箭頭，把微分方程化成可見的「方向地圖」
- **初始條件**：點選或拖動起點，觀察不同初值對應的不同軌跡
- **尤拉法**：以可調步長逐步積分，與黎曼和一樣，步長愈細近似愈準

建議順序：先看斜率場 → 改初值比較軌跡 → 放大步長觀察尤拉法誤差。

## 觀察重點

- 不同初始條件會走出完全不同的軌跡
- 步長太大時，尤拉法會明顯偏離真實解
- $\dfrac{dy}{dx}=-y$ 的解曲線族即為指數衰減

## 相關作品

- [曳物線](/works/catenary)
- [向量場流線](/works/vector-field-streamlines)
- [相位圖](/works/complex-phase-portrait)
- [等角螺線](/works/equiangular-spiral)

## 延伸閱讀

- [斜率場（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%96%9C%E7%8E%87%E5%9C%BA)
- [歐拉方法（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%AC%A7%E6%8B%89%E6%96%B9%E6%B3%95)
