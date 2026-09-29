---
title: 曼德博集合與朱利亞
description: 點曼德博集合上的 c，角落畫出對應的朱利亞集合。
tags:
  - 碎形
  - 動力系統
concepts:
  - fractal
  - dynamical-system
audience: 大學概念
prerequisites:
  - 複數
  - 疊代
date: 2026-09-30
order: 72
featured: false
draft: false
---

## 參數方程

曼德博集合收的是參數 $c$，不是軌道上的點。從 $z_0=0$ 反覆做 $z\mapsto z^2+c$，不會逃向無窮遠的那些 $c$ 構成曼德博集。把同一個 $c$ 固定，改去掃描不同的起點，不逃逸與逃逸的交界就是朱利亞集。

$$
z_{n+1}=z_n^2+c,\quad z_0=0
$$

$|z_n|>2$ 之後軌道一定發散。畫面把疊代上限內還沒超過這個門檻的點留成黑色；黑色是有限次疊代的近似，不是集合本身。

## 互動說明

- **c 實部 Re(c)**：在主圖上拖動，或用滑桿調整，角落的朱利亞集合即時換成這個 $c$
- **c 虛部 Im(c)**：同樣在主圖上拖動，或用滑桿調整虛部
- **最大疊代**：提高疊代上限，兩張圖的邊界一起變細
- **角落小圖**：只顯示目前這個 $c$，不在小圖上拖動

## 觀察重點

- 主圖上的一個 $c$ 對應角落整張朱利亞集；主圖看的是參數逃得有多快，小圖看的是起點逃得有多快。
- $c$ 屬於曼德博集時朱利亞集連通，不屬於時則不連通；畫面上的黑色只表示到疊代上限還沒逃逸。
- $|z_n|>2$ 的軌道一定發散，兩張圖都把這之後的快慢畫成色帶。

## 相關作品

- [朱利亞集合](/works/julia-set)
- [疊代動力學：從收斂到碎形](/explore/iteration-dynamics)
- [謝爾賓斯基三角形](/works/sierpinski-triangle)
- [單峰映射分岔圖](/works/logistic-bifurcation)

## 延伸閱讀

- [曼德博集合（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9B%BC%E5%BE%B7%E5%8D%9A%E9%9B%86%E5%90%88)
- [朱利亞集（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9C%B1%E5%88%A9%E4%BA%9E%E9%9B%86)
