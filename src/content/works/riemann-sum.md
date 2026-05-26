---
title: 黎曼和動態圖
description: 以矩形條動態逼近曲線下面積，觀察分割數增加時的收斂。
tags:
  - 分析
  - 微積分
date: 2026-07-02
featured: false
draft: false
---

## 參數方程

在區間 $[0,1]$ 上取 $n$ 個等寬矩形，高度取左端點 $f(x_i)$：

$$
\text{Area} \approx \sum_{i=0}^{n-1} f(x_i)\,\Delta x,\quad
\Delta x = \frac{1}{n},\quad
x_i = i\,\Delta x
$$

本實驗函數：

$$
f(x) = 1 + 0.65\sin(k\pi x + t)\cos(\pi x)
$$

**n** 控制矩形數量（平滑 lerp）；**k** 調整波形；積分範圍（reveal）由左向右展開，矩形與曲線同步生長。

## 實作要點

- **線條逼近**：矩形僅繪三邊線框，不用色塊填滿
- **由左生長**：`activeDomain` 綁定水平進度
- **切換重置**：調整 n 時重置積分範圍
- **平滑過渡**：n 以 lerp（0.08）連續變化

## 相關連結

- 視覺化主題：[極限與黎曼和](/explore/limits-riemann-sum)
- 相關作品：[切線逼近動畫](/works/tangent-approximation)、[曳物線](/works/catenary)、[等角螺線](/works/equiangular-spiral)、[向量場流線](/works/vector-field-streamlines)

## 延伸閱讀

- [黎曼積分（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%BB%8E%E6%9B%BC%E7%A7%AF%E5%88%86)
