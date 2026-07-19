---
title: 向量的加法與純量乘法
description: 平面向量的平行四邊形合成與純量伸縮，建立線性組合直覺。
tags:
  - 線性代數
date: 2026-05-26
order: 41
featured: false
draft: false
---

## 參數方程

向量 $\mathbf{u},\mathbf{v}\in\mathbb{R}^2$ 的加法依平行四邊形（或三角形）法則合成；純量乘法 $c\mathbf{v}$ 改變長度與（當 $c<0$ 時）方向。這是線性組合 $a\mathbf{u}+b\mathbf{v}$ 與座標系變換的基礎。

$$
\mathbf{u}=(u_x,u_y),\quad \mathbf{v}=(v_x,v_y)
$$

$$
\mathbf{u}+\mathbf{v}=(u_x+v_x,\,u_y+v_y),\quad
c\mathbf{v}=(cv_x,\,cv_y)
$$

## 互動說明

- **純量 c**：拖動 $c\in[-2,2]$，觀察 $c\mathbf{v}$ 的伸縮與反向
- **分量線**：開啟後顯示 $u_x,u_y$ 在軸上的投影分量
- **拖動向量端點**：直接拖兩支向量的端點，即時更新 $\mathbf{u}+\mathbf{v}$ 與平行四邊形

## 相關作品

- [內積的幾何意義](/works/dot-product-geometry)
- [向量投影與分解](/works/vector-projection)
- [線性變換網格](/works/linear-transform-grid)

## 延伸閱讀

- [向量（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%90%91%E9%87%8F)
- [平行四邊形法則（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B9%B3%E8%A1%8C%E5%9B%9B%E9%82%8A%E5%BD%A2%E6%B3%95%E5%89%87)
