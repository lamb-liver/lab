---
title: 平面法向量與點面距離
description: 拖動法向量 n 與平面上定點，觀察 ax+by+cz=h 與點面距離的同步讀數。
tags:
  - 線性代數
date: 2026-07-21
order: 66
featured: false
draft: false
---

## 參數方程

法向量 $\mathbf n=(a,b,c)\ne\mathbf 0$、過點 $P_0(x_0,y_0,z_0)$ 的平面：

$$
\mathbf n\cdot(\mathbf r-\mathbf r_0)=0
$$

展開為一般式 $ax+by+cz=h$，其中 $h=ax_0+by_0+cz_0$。點 $P_1(x_1,y_1,z_1)$ 到平面的距離：

$$
\mathrm{dist}=\frac{|ax_1+by_1+cz_1-h|}{\|\mathbf n\|}
$$

$(a,b,c,h)$ 同乘非零常數不改變平面，只改變方程式的尺度。

## 互動說明

- **平面傾角**：旋轉法向 $\hat{\mathbf n}$，觀察平面跟著轉，係數 $(a,b,c)$ 同步更新
- **平面位移 h**：平移平面，觀察垂足沿法向滑動，距離隨之改變
- **測試點高度**：移動 $P_1$，比較帶號距離的正負如何標出它在法向的哪一側
- **方程尺度 k**：同乘非零常數，觀察係數整組改變，但平面、垂足與距離都不動
- **拖動畫面旋轉視角**：旋轉場景，確認垂線段確實垂直於平面

## 觀察重點

- 法向量垂直於平面內所有位移；$(a,b,c,h)$ 同乘非零常數不改變平面，只改變方程式的尺度。
- $h=ax_0+by_0+cz_0$ 把「過哪一點」編碼進方程式；改變 $P_0$ 會平移平面。
- 點面距離是內積幾何的直接應用；與〈平面向量〉中投影與法向讀法在空間中的延伸一致。

## 相關作品

- [空間向量與三平面投影](/works/space-vector-three-plane-projection)
- [空間直線與平面交點](/works/line-plane-intersection)
- [內積的幾何意義](/works/dot-product-geometry)
- [空間向量與平面直線](/explore/space-vectors-planes-lines)

## 延伸閱讀

- [平面（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B9%B3%E9%9D%A2)
- [法向量（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%B3%95%E5%90%91%E9%87%8F)
