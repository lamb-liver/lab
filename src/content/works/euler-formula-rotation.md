---
title: 尤拉公式旋轉動畫
description: e^(iθ) = cos θ + i sin θ 驅動的單位圓旋轉與複平面軌跡。
tags:
  - 代數
  - 複數
date: 2026-08-04
featured: false
draft: false
---

## 概述

尤拉公式 $e^{i\theta}=\cos\theta+i\sin\theta$ 說明「乘以 $e^{i\theta}$」即為逆時針旋轉 $\theta$。動畫中單位圓上的點與實部、虛部投影同步運動，連結指數函數與三角函數。

## 參數方程

$$
e^{i\theta} = \cos\theta + i\sin\theta
$$

$$
z(\theta) = e^{i\theta},\quad \theta\in[0,2\pi)
$$

一般化：$re^{i\theta}$ 為模長 $r$、幅角 $\theta$ 的複數。

## 實作要點

- **時間驅動**：$\theta$ 隨 $t$ 遞增，點沿單位圓運動
- **投影分解**：繪製 $\cos\theta$ 在實軸、$\sin\theta$ 在虛軸的投影線段
- **旋轉向量**：固定 $z_0$，展示 $z_0\cdot e^{i\theta}$ 的螺旋或圓軌跡
- **公式同步**：控制面板顯示當前 $\theta$ 與 $e^{i\theta}$ 的數值近似

## 相關連結

- 相關作品：[複數的極座標形式](/works/complex-polar-form)、[複數四則運算的幾何意義](/works/complex-arithmetic-geometry)、[朱利亞集合](/works/julia-set)

## 延伸閱讀

- [歐拉公式（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%AC%A7%E6%8B%89%E5%85%AC%E5%BC%8F)
