---
title: 空間向量與平面直線
description: 空間向量、點向式直線與法向量平面方程；觀察三平面投影、線面交點與點面距離。
category: 幾何
date: 2026-10-11
coverImage: /images/explore-covers/space-vectors-planes-lines.png
featured: false
draft: true
---

## 基本概念

空間向量 $\mathbf v=(v_x,v_y,v_z)$ 把位移從平面延伸到三維。過點 $P_0$、方向為 $\mathbf d\ne\mathbf 0$ 的直線可寫成

$$
\mathbf r(t)=\mathbf r_0+t\mathbf d
$$

法向量為 $\mathbf n\ne\mathbf 0$ 的平面則滿足

$$
\mathbf n\cdot(\mathbf r-\mathbf r_0)=0\quad\Leftrightarrow\quad ax+by+cz=h
$$

其中 $h=ax_0+by_0+cz_0$。直線 $\mathbf r(t)=\mathbf r_0+t\mathbf d$ 與平面 $\mathbf n\cdot\mathbf r=h$ 的交點參數為

$$
t=\frac{h-\mathbf n\cdot\mathbf r_0}{\mathbf n\cdot\mathbf d}
$$

若 $\mathbf n\cdot\mathbf d=0$，直線與平面平行，或整條直線落在平面上。

## 互動說明

- **空間向量與分量**：拖動向量端點，觀察 $xy$、$xz$、$yz$ 三個坐標平面投影如何共同描述 $\mathbf v$
- **空間直線點向式**：拖動起點 $P_0$ 與方向 $\mathbf d$，觀察 $\mathbf r(t)=\mathbf r_0+t\mathbf d$ 沿直線延伸
- **平面法向量方程**：拖動法向量 $\mathbf n$ 與平面上定點，觀察 $ax+by+cz=h$ 與點面距離公式
- **直線與平面交點**：拖動直線方向與平面法向量，觀察交點、平行與直線落在平面上的情形

建議順序：三平面投影 → 直線參數式 → 平面法向量 → 線面交點。

## 觀察重點

- $xy$、$xz$、$yz$ 三個投影是讀 3D 向量的基本方式；重複分量可互相校驗同一支空間向量，與〈平面向量〉中的平面分解讀法呼應。
- 直線由一點加非零方向 $\mathbf d$ 決定；參數 $t$ 只是沿方向的刻度，改變 $\mathbf d$ 的長度不會改變直線本身。
- 線面交點與點面距離都來自內積；$\mathbf n\cdot\mathbf d=0$ 時沒有唯一交點，$\mathbf n\cdot\mathbf d\ne 0$ 時交點參數 $t$ 可直接讀出。

## 相關作品

- [外積的幾何意義](/works/cross-product-geometry)
- [空間向量與三平面投影](/works/space-vector-three-plane-projection)
- [空間直線與平面交點](/works/line-plane-intersection)
- [平面法向量與點面距離](/works/plane-normal-distance)

## 延伸閱讀

- [空間向量（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%A9%BA%E9%96%93%E5%90%91%E9%87%8F)
- [平面（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B9%B3%E9%9D%A2)
- [空間中的直線（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%9B%B4%E7%B7%9A#%E7%A9%BA%E9%96%93%E4%B8%AD%E7%9A%84%E7%9B%B4%E7%B7%9A)
