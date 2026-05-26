---
title: 複數的極座標形式
description: 以模長 r 與幅角 θ 表示 z = re^(iθ)，連結直角座標與極座標。
tags:
  - 代數
  - 複數
date: 2026-08-03
featured: false
draft: false
---

## 概述

任意非零複數可寫成 $z=re^{i\theta}$，其中 $r=|z|$、$\theta=\mathrm{Arg}(z)$。極形式把伸縮與旋轉分離，是理解複數乘法與尤拉公式的關鍵。

## 參數方程

$$
z = re^{i\theta} = r\cos\theta + ir\sin\theta
$$

$$
x = r\cos\theta,\quad y = r\sin\theta,\quad
r = \sqrt{x^2+y^2},\quad \theta = \atan2(y,x)
$$

## 實作要點

- **雙向綁定**：直角 $(x,y)$ 與極座標 $(r,\theta)$ 滑桿同步，展示座標變換
- **動態射線**：從原點畫出幅角 $\theta$ 的射線，終點在圓 $|z|=r$ 上
- **單位圓參考**：標示 $e^{i\theta}$ 在單位圓上的位置，對照 $z=re^{i\theta}$
- **形式切換**：在 $x+iy$ 與 $re^{i\theta}$ 字串／公式間即時切換顯示

## 相關連結

- 相關作品：[相位圖](/works/complex-phase-portrait)、[複數四則運算的幾何意義](/works/complex-arithmetic-geometry)、[尤拉公式旋轉動畫](/works/euler-formula-rotation)

## 延伸閱讀

- [極座標系（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%A5%B5%E5%9D%90%E6%A8%99%E7%B3%BB)
