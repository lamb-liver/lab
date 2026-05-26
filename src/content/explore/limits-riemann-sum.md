---
title: 極限與黎曼和
description: 以矩形和逼近定積分；比較分割法並連結切線斜率與瞬時變化率。
category: 分析
date: 2026-07-01
featured: false
draft: false
---

## 基本概念

$$
\int f(x)\,dx = \lim_{n\to\infty} \sum_{i} f(x_i)\,\Delta x
$$

定積分可視為無窮多個、無限細的矩形面積之和的極限。

## 互動說明

- **分割數 n**：增加區間分割，觀察黎曼和如何逼近曲線下的面積
- **取樣方式**：切換左端點、右端點與中點法，比較誤差下降速度
- **切線斜率**：在曲線上拖動一點，觀察割線趨近切線與導數的幾何意義

建議順序：粗分割的矩形和 → 細分割收斂 → 切線斜率與極值位置。

## 觀察重點

- $n$ 增大時，左／右／中點三種取樣的誤差下降快慢不同，中點法通常較快
- 函數愈平滑，黎曼和愈快貼近積分
- 切線斜率由正變負（或反之）的位置，對應函數的極值點

## 相關作品

- [黎曼和動態圖](/works/riemann-sum)
- [切線逼近動畫](/works/tangent-approximation)
- [等角螺線](/works/equiangular-spiral)

## 延伸閱讀

- [黎曼積分（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%BB%8E%E6%9B%BC%E7%A7%AF%E5%88%86)
- [導數（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%AF%BC%E6%95%B8)
