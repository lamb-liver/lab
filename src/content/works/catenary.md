---
title: 曳物線
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

## 實作要點

- **數學 / 相機 / 渲染解耦**：參數方程在數學層；Bounding Box 相機自動取景；鏡像 Y 得對稱雙軌
- **幾何快取**：Ghost 軌跡僅在 L 或 max t 平滑變更時重建
- **牽引生長**：`pulling = ½(1 - cos ωt)` 驅動動態 t，軌跡由起點向前展開
- **定長拉繩**：物體與牽引點間繩段即時繪製，呈現定長約束

## 相關連結

- 視覺化主題：[極限與黎曼和](/explore/limits-riemann-sum)
- 相關作品：[黎曼和動態圖](/works/riemann-sum)、[切線逼近動畫](/works/tangent-approximation)、[等角螺線](/works/equiangular-spiral)、[向量場流線](/works/vector-field-streamlines)

## 延伸閱讀

- [曳物线（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%9C%9B%E7%89%A9%E7%B7%9A)
