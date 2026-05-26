---
title: 朱利亞集合
description: 迭代 z ↦ z² + c 在複平面上產生的分形邊界與自相似結構。
tags:
  - 代數
  - 複數
  - 碎形
date: 2026-08-05
featured: false
draft: false
---

## 概述

對固定複常數 $c$，朱利亞集 $J_c$ 為迭代 $f(z)=z^2+c$ 下有界軌跡的邊界。調整 $c$ 可從連通枝狀結構過渡到 Cantor 型塵埃，展現複動力系統的敏感依賴。

## 參數方程

$$
z_{n+1} = z_n^2 + c,\quad z_0 \in \mathbb{C}
$$

逃逸判斷：若 $|z_n|>2$ 則視為發散。著色可依迭代次數或最終幅角。

## 實作要點

- **像素迭代**：對視窗內每個初值 $z_0$ 迭代至逃逸或達上限次數
- **參數 $c$**：滑桿調整 $c$ 的實部、虛部，即時重算分形
- **視圖縮放**：平移與縮放複平面取景，觀察邊界局部自相似
- **色帶映射**：逃逸速度映射至連續色帶，突出 $J_c$ 邊界

## 相關連結

- 相關作品：[尤拉公式旋轉動畫](/works/euler-formula-rotation)、[謝爾賓斯基三角形](/works/sierpinski-triangle)、[邏輯斯諦映射分岔圖](/works/logistic-bifurcation)

## 延伸閱讀

- [朱利亞集（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9C%B1%E5%88%A9%E4%BA%9E%E9%9B%86)
