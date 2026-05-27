---
title: 曳物線（Tractrix）
description: 定長繩索牽引追蹤軌跡（Tractrix），觀察 sech/tanh 參數方程與對稱雙軌。
tags:
  - 幾何
  - 微積分
date: 2026-07-04
featured: false
draft: false
---

## 參數方程

牽引者沿 X 軸前進，以長度 **L** 的繩子拉動物體，軌跡為曳物線（Tractrix）：

$$
x = L\left(t - \tanh t\right),\quad
y = L\,\text{sech}\,t = \frac{2L}{e^t + e^{-t}}
$$

**t > 0** 為參數；牽引點在 $(Lt, 0)$。性質：曲線上任意點到 X 軸的切線段長度恒為 **L**。

## 互動說明

- **固定繩長 L**：改變繩索長度，雙軌下垂程度隨之改變
- **歷史範圍 t**：拉長可視時間窗，觀察更多曳物線軌跡
- **時間速度 ω**：控制追蹤點沿軌道移動的快慢

## 觀察重點

- 曳物線是「後端被等速拉動的端點」之軌跡
- 繩長不足時下垂更明顯；繩長接近跨度時曲線較平
- 上下對稱雙軌反映同一參數方程的正負分支

## 相關作品

- [切線逼近動畫](/works/tangent-approximation)
- [等角螺線](/works/equiangular-spiral)

## 延伸閱讀

- [曳物線（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%9C%9B%E7%89%A9%E7%B7%9A)
