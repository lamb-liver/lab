---
title: 向量投影與分解
description: 將向量分解為平行與垂直分量，正交基底與最佳逼近直覺。
tags:
  - 幾何
  - 線性代數
date: 2026-08-24
featured: false
draft: false
---

## 參數方程

任意向量 $\mathbf{a}$ 可相對於非零向量 $\mathbf{b}$ 分解為平行分量 $\mathbf{a}_{\parallel}$ 與垂直分量 $\mathbf{a}_{\perp}$，滿足 $\mathbf{a}=\mathbf{a}_{\parallel}+\mathbf{a}_{\perp}$ 且 $\mathbf{a}_{\perp}\cdot\mathbf{b}=0$。投影是內積的幾何輸出，也是最小二乘「沿 $\mathbf{b}$ 方向最佳近似」的核心。

投影：

$$
\mathrm{proj}_{\mathbf{b}}\mathbf{a}
=\frac{\mathbf{a}\cdot\mathbf{b}}{\mathbf{b}\cdot\mathbf{b}}\,\mathbf{b}
$$

垂直分量：

$$
\mathbf{a}_{\perp}=\mathbf{a}-\mathrm{proj}_{\mathbf{b}}\mathbf{a}
$$

## 互動說明

- **分解動畫**：$\mathbf{a}$ 末端落至 $\mathbf{b}$ 直線上的垂足，顯示兩色分量
- **誤差長度**：標示 $|\mathbf{a}_{\perp}|$，說明為到直線的最短距離
- **雙向投影**：可選互換 $\mathbf{a},\mathbf{b}$ 角色
- **正交基**：進階模式展示 $\mathbf{e}_1,\mathbf{e}_2$ 下的座標分解

## 相關作品

- [內積的幾何意義](/works/dot-product-geometry)
- [向量的加法與純量乘法](/works/vector-addition-scalar)
- [向量場的基本圖樣](/works/vector-field-patterns)

## 延伸閱讀

- [向量投影（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%90%91%E9%87%8F%E6%8A%95%E5%BD%B1)
