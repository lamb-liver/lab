---
title: 平面向量
description: 把平面向量視為可在位置、方向與座標間切換的讀圖工具；用同一張圖串起投影、內積、基底與法向量。
category: 幾何
date: 2026-05-26
order: 12
coverImage: /images/explore-covers/vectors.png
featured: false
draft: false
---

## 基本概念

$$
\mathbf p=(x,y)
$$

位置讀法把向量端點視為平面上的點。

$$
\operatorname{proj}_{\mathbf d}\mathbf u=\frac{\mathbf u\cdot\mathbf d}{\mathbf d\cdot\mathbf d}\,\mathbf d
$$

方向讀法把向量視為測量方向，投影與內積都在問「沿這個方向有多少分量」。

$$
\mathbf p=s\mathbf e_1+t\mathbf e_2,\qquad \mathbf n\cdot\mathbf x=c
$$

座標讀法把同一個位置寫成基準向量 $\mathbf e_1,\mathbf e_2$ 的係數組合；約束讀法則用一支法向量 $\mathbf n$ 與定值 $c$ 描出一整條直線。

## 互動說明

- **導覽**：顯示同一支主向量 $\mathbf p$ 在位置、方向與座標三種讀法中的角色
- **方向 / 投影**：拖動向量，觀察指定方向上的投影、角度與內積正負
- **座標 / 基底**：以基底 $\mathbf e_1,\mathbf e_2$ 的係數組合出任意向量，理解座標讀數如何改變
- **法向 / 直線**：標示法向量如何把方向轉成 $\mathbf n\cdot\mathbf x=c$ 這種直線或邊界條件

建議順序：先用導覽看同一支箭頭的三種讀法，再進入三個專注模式細看投影、基底與法向量。

## 觀察重點

- 同一支箭頭可先讀成位置，再讀成測量方向，最後讀成某組基底下的座標。
- 投影與內積是在指定方向上量分量；垂直是該方向分量為零的特殊情況。
- 基底改變座標讀數，法向量則把方向轉成直線或邊界條件。

## 相關作品

- [向量的加法與純量乘法](/works/vector-addition-scalar)
- [內積的幾何意義](/works/dot-product-geometry)
- [向量投影與分解](/works/vector-projection)
- [向量場的基本圖樣](/works/vector-field-patterns)

## 延伸閱讀

- [內積（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%86%85%E7%A7%AF)
- [向量空間（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%90%91%E9%87%8F%E7%A9%BA%E9%97%93)
