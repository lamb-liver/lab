---
title: 複數的極座標形式
description: 以模長 r 與幅角 θ 表示 z = re^(iθ)，連結直角座標與極座標。
tags:
  - 幾何
date: 2026-05-26
order: 27
featured: false
draft: false
---

## 參數方程

任意非零複數可寫成 $z=re^{i\theta}$，其中 $r=|z|$、$\theta=\mathrm{Arg}(z)$。極形式把伸縮與旋轉分離，是理解複數乘法與尤拉公式的關鍵。

$$
z = re^{i\theta} = r\cos\theta + ir\sin\theta
$$

$$
x = r\cos\theta,\quad y = r\sin\theta,\quad
r = \sqrt{x^2+y^2},\quad \theta = \atan2(y,x)
$$

## 互動說明

- **模長 r**：拖動滑桿改變向量長度
- **幅角 θ**：旋轉向量，同步更新實部、虛部投影與 $\theta$ 弧線

## 觀察重點

- $x=r\cos\theta$、$y=r\sin\theta$ 為直角與極座標的對應
- 模長 $r$ 決定離原點距離，幅角 $\theta$ 決定方向
- 同一 $z$ 可在直角形式 $x+yi$ 與極形式 $re^{i\theta}$ 間對照

## 相關作品

- [複數四則運算的幾何意義](/works/complex-arithmetic-geometry)
- [尤拉公式旋轉動畫](/works/euler-formula-rotation)

## 延伸閱讀

- [極座標系（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%A5%B5%E5%9D%90%E6%A8%99%E7%B3%BB)
