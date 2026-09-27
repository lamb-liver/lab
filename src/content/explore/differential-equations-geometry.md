---
title: 微分方程的幾何視覺化
description: 同一張斜率場如何同時決定解曲線、初值分岔，以及逐步積分的誤差。
category: 分析
audience: 大學概念
prerequisites:
  - 導數
  - 積分
concepts:
  - differential-equation
  - vector-field
date: 2026-05-26
order: 6
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

- 微分方程先給的是每點的方向，不是現成的 $y(x)$；解曲線只是順著同一張斜率場走出來的軌跡。
- 起點不同，走的是場裡不同的一條；步長太粗則是用折線去逼近同一條場，不是換成另一個方程式。
- 同一張場也可以讀成向量場的流線：切向對齊的軌跡與逐步積分，講的是同一件事的幾何版與數值版。

## 相關作品

- [曳物線](/works/catenary)
- [向量場流線](/works/vector-field-streamlines)
- [相位圖](/works/complex-phase-portrait)
- [等角螺線](/works/equiangular-spiral)

## 延伸閱讀

- [斜率場（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%96%9C%E7%8E%87%E5%9C%BA)
- [歐拉方法（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%AC%A7%E6%8B%89%E6%96%B9%E6%B3%95)
