---
title: 空間向量與平面直線
description: 固定一支向量與一個平面，三種讀法依序回答：它在哪裡、面朝哪裡、兩者什麼關係。
category: 幾何
date: 2026-06-10
order: 0
featured: false
draft: true
---

## 基本概念

空間題目的困難通常不在公式，而在同時追蹤兩件事：一支向量落在哪裡，一個平面朝哪個方向。本頁整頁固定同一個場景——一支向量 $\mathbf v$，以及由 $\mathbf a,\mathbf b$ 張成的平面——三種讀法都作用在這兩個物件上，不換題目。

$$
\mathbf n=\mathbf a\times\mathbf b,\qquad \mathbf n\cdot\mathbf v-h
$$

先把 $\mathbf v$ 的位置攤成三張坐標平面上的影子，再用外積把平面的朝向濃縮成單一支法向量 $\mathbf n$，最後用同一個內積讀數判斷 $\mathbf v$ 與這個平面的關係。每個工具的完整推導與退化情形留給對應的單件作品。

## 互動說明

- **位置讀法**：拖動分量 $v_x,v_y,v_z$，觀察一個 3D 位置如何被攤成三張 2D 影子
- **方向讀法**：調整平面傾角，觀察 $\mathbf a,\mathbf b$ 張成的面如何壓縮成單一支 $\hat{\mathbf n}$
- **關係讀法**：切換有距離、平行、落在面內三個狀態，對照 $\hat{\mathbf n}\cdot\mathbf v-h$ 的讀數怎麼變
- **拖動畫面旋轉視角**：旋轉場景，確認三種讀法看的是同一個場景

建議順序：位置讀法 → 方向讀法 → 關係讀法。

## 觀察重點

- 前兩種讀法回答的是不同問題：一個問 $\mathbf v$ 在哪裡，一個問平面朝哪裡，要合起來才判斷得出兩者的關係。
- 平面的朝向可以壓縮成一支法向量；之後所有線面判斷都只需要這一支箭頭，不必再看原來的 $\mathbf a,\mathbf b$。
- 落在面內、平行與有距離不是三條公式，而是同一個內積讀數為零、恆不為零與其他值的三種狀態。

## 相關作品

- [外積的幾何意義](/works/cross-product-geometry)
- [空間向量與三平面投影](/works/space-vector-three-plane-projection)
- [空間直線與平面交點](/works/line-plane-intersection)
- [平面法向量與點面距離](/works/plane-normal-distance)

## 延伸閱讀

- [空間向量（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%A9%BA%E9%96%93%E5%90%91%E9%87%8F)
- [平面（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B9%B3%E9%9D%A2)
- [空間中的直線（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%9B%B4%E7%B7%9A#%E7%A9%BA%E9%96%93%E4%B8%AD%E7%9A%84%E7%9B%B4%E7%B7%9A)
