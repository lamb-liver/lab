---
title: 內積的幾何意義
description: u·v = |u||v|cos θ 與投影長度，判斷夾角、垂直與功的直覺。
tags:
  - 線性代數
date: 2026-05-26
order: 42
featured: false
draft: false
---

## 參數方程

內積 $\mathbf{u}\cdot\mathbf{v}=u_x v_x+u_y v_y$ 幾何上等於 $|\mathbf{u}||\mathbf{v}|\cos\theta$。正負號反映夾角銳鈍；為零表示垂直。力沿位移的功 $W=\mathbf{F}\cdot\mathbf{d}$ 是同一結構的物理實例。

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

## 互動說明

- **內積 u · v**：拖動兩支向量，觀察 $\mathbf{u}\cdot\mathbf{v}$ 隨夾角改變的正負與大小
- **夾角 θ**：標示 $\theta$ 與 $\cos\theta$；$\mathbf{u}\perp\mathbf{v}$ 時內積為零並高亮
- **投影 proj**：把 $\mathbf{u}$ 投影到 $\mathbf{v}$ 方向，對照投影長與內積的關係
- **功 W = F · d**：切換成力與位移，觀察同一個式子在物理情境下的意義

## 相關作品

- [向量的加法與純量乘法](/works/vector-addition-scalar)
- [向量投影與分解](/works/vector-projection)
- [向量場的基本圖樣](/works/vector-field-patterns)

## 延伸閱讀

- [數量積（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%95%B8%E9%87%8F%E7%A9%8D)
