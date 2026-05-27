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

**n** 控制矩形數量；**k** 調整被積函數波形；**t** 驅動函數隨時間變化。

## 互動說明

- **分割數 n**：增加矩形條數，觀察面積和逼近曲線下方區域
- **波動頻率 k**：改變被積函數起伏，觀察相同 n 下誤差如何變化
- **時間速度 ω**：驅動波形與矩形高度連續更新

## 觀察重點

- 矩形高度取函數在子區間的值，面積和即黎曼和
- $n$ 增大時和式一般更接近定積分（對可積函數）
- 曲線彎曲愈劇，有限 $n$ 的誤差愈明顯

## 相關作品

- [切線逼近動畫](/works/tangent-approximation)
- [極限與黎曼和](/explore/limits-riemann-sum)

## 延伸閱讀

- [黎曼積分（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%BB%8E%E6%9B%BC%E7%A7%AF%E5%88%86)
