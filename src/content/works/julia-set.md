---
title: 朱利亞集合
description: 迭代 z ↦ z² + c 在複平面上產生的分形邊界與自相似結構。
tags:
  - 動力系統
date: 2026-08-05
featured: true
draft: false
---

## 參數方程

對固定複常數 $c$，朱利亞集 $J_c$ 為迭代 $f(z)=z^2+c$ 下有界軌跡的邊界。若 $|z_n|>2$ 則視為發散；逃逸快慢映射為色帶，內部保持黑色。調整 $c$ 可從連通枝狀結構過渡到康托爾型塵埃。

$$
z_{n+1} = z_n^2 + c,\quad z_0 \in \mathbb{C}
$$

## 互動說明

- **參數漂移**：開啟時 $c$ 沿曼德博集邊界附近緩慢移動，分形拓撲持續演化
- **Re(c)、Im(c)**：關閉漂移後手動調整 $c$，邊界即時重算
- **最大迭代**：提高迭代上限可細化邊界，但計算較慢

## 觀察重點

- 對固定 $c$，有界軌跡的邊界即朱利亞集
- $|z_n|>2$ 時迭代發散；發散快慢決定外圍色帶
- 不同 $c$ 可在連通枝狀結構與康托爾型碎形間過渡

## 相關作品

- [尤拉公式旋轉動畫](/works/euler-formula-rotation)
- [謝爾賓斯基三角形](/works/sierpinski-triangle)
- [邏輯斯諦映射分岔圖](/works/logistic-bifurcation)

## 延伸閱讀

- [朱利亞集（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9C%B1%E5%88%A9%E4%BA%9E%E9%9B%86)
