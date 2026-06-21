---
title: 空間直線與平面交點
description: 拖動直線起點與方向、平面法向量與常數，觀察交點、平行或直線落在平面內。
tags:
  - 線性代數
date: 2026-06-10
order: 0
featured: false
draft: true
---

## 參數方程

過點 $P_0$、方向為 $\mathbf d\ne\mathbf 0$ 的直線：

$$
\mathbf r(t)=\mathbf r_0+t\mathbf d,\quad t\in\mathbb{R}
$$

法向量為 $\mathbf n\ne\mathbf 0$ 的平面：

$$
\mathbf n\cdot\mathbf r=h
$$

代入得交點參數

$$
t=\frac{h-\mathbf n\cdot\mathbf r_0}{\mathbf n\cdot\mathbf d}
$$

若 $\mathbf n\cdot\mathbf d=0$，直線與平面平行，或整條直線落在平面上。過兩點 $P_0,P_1$ 定線時，方向為 $\mathbf d=\overrightarrow{P_0P_1}$。

## 互動說明

- **起點與方向**：拖動直線起點 $P_0$ 與方向 $\mathbf d$，觀察 $\mathbf r(t)$ 沿直線延伸
- **參數 t**：拖動 $t$ 滑桿，標記 $\mathbf r(t)$ 沿直線移動的軌跡
- **平面交點**：疊加平面 $\mathbf n\cdot\mathbf r=h$，觀察交點、平行或直線落在平面內
- **兩點定線**：改以兩點 $P_0,P_1$ 模式拖動，方向自動更新為 $\overrightarrow{P_0P_1}$

## 觀察重點

- $\mathbf n\cdot\mathbf d\ne 0$ 時有唯一交點；$t$ 的正負決定交點在起點的哪一側。
- $\mathbf n\cdot\mathbf d=0$ 且 $\mathbf n\cdot\mathbf r_0\ne h$ 時，直線與平面平行且不相交。
- $\mathbf n\cdot\mathbf d=0$ 且 $\mathbf n\cdot\mathbf r_0=h$ 時，整條直線落在平面上。

## 相關作品

- [空間向量與三平面投影](/works/space-vector-three-plane-projection)
- [平面法向量與點面距離](/works/plane-normal-distance)
- [空間向量與平面直線](/explore/space-vectors-planes-lines)

## 延伸閱讀

- [空間中的直線（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%9B%B4%E7%B7%9A#%E7%A9%BA%E9%96%93%E4%B8%AD%E7%9A%84%E7%9B%B4%E7%B7%9A)
- [平面（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B9%B3%E9%9D%A2)
