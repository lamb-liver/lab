---
title: 內積的幾何意義
description: u·v = |u||v|cos θ 與投影長度，判斷夾角、垂直與功的直覺。
tags:
  - 幾何
  - 線性代數
date: 2026-08-23
featured: false
draft: false
---

## 概述

內積 $\mathbf{u}\cdot\mathbf{v}=u_x v_x+u_y v_y$ 幾何上等於 $|\mathbf{u}||\mathbf{v}|\cos\theta$。正負號反映夾角銳鈍；為零表示垂直。力沿位移的功 $W=\mathbf{F}\cdot\mathbf{d}$ 是同一結構的物理實例。

## 參數方程

$$
\mathbf{u}\cdot\mathbf{v}=|\mathbf{u}||\mathbf{v}|\cos\theta
$$

$$
\mathbf{u}\cdot\mathbf{v}=u_x v_x + u_y v_y
$$

投影長度（$\mathbf{v}\neq\mathbf{0}$）：

$$
\mathrm{comp}_{\mathbf{v}}\mathbf{u}=\frac{\mathbf{u}\cdot\mathbf{v}}{|\mathbf{v}|}
$$

## 實作要點

- **夾角弧線**：標示 $\theta$ 與 $\cos\theta$ 數值，$\mathbf{u}\perp\mathbf{v}$ 時高亮
- **投影線段**：將 $\mathbf{u}$ 投影到 $\mathbf{v}$ 方向，顯示投影向量與內積
- **代數展開**：並排顯示座標式與幾何式，驗證數值一致
- **功的示意**：可選模式：力向量與位移向量，$W=\mathbf{F}\cdot\mathbf{d}$

## 相關連結

- 相關作品：[向量的加法與純量乘法](/works/vector-addition-scalar)、[向量投影與分解](/works/vector-projection)、[向量場的基本圖樣](/works/vector-field-patterns)

## 延伸閱讀

- [數量積（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%95%B8%E9%87%8F%E7%A9%8D)
