---
title: 傅立葉級數
description: 用疊加正弦與餘弦波逼近週期函數，觀察項數增加時的收斂過程與吉布斯現象。
category: 分析
date: 2026-02-01
coverImage: /explore/fourier-series-epicycles-cover.png
featured: true
draft: false
---

## 基本概念

任何週期為 $2\pi$ 的函數 $f(x)$ 可展開為無窮級數：

$$
f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \bigl(a_n\cos(nx) + b_n\sin(nx)\bigr)
$$

## 互動說明

透過滑桿調整疊加項數 N，觀察純粹的圓周運動如何逼近方波、以及以奇數諧波構成接近方形的週期軌道。

**吉布斯現象（Gibbs Phenomenon）**：當項數增加，可觀察到在圖形邊緣（不連續處）產生無法完全消除的波峰振盪，這種逼近誤差會收斂到約為跳躍高度 9% 的極限。

## 觀察重點

- **萬物皆可拆解**：理解再複雜的連續軌跡，都能被拆解為多個基本頻率（圓圈）的互相疊加
- **收斂與平滑度**：觀察隨著 N 值增加，曲線貼合目標圖案的速度與變化；愈平滑的函數，其傅立葉係數衰減得愈快，收斂速度也愈快
- **跨領域的視覺化**：直觀感受「數學訊號處理」如何轉變為「幾何圖學」的繪製過程

## 相關作品

[Spirograph 繁花曲線](/works/spirograph-curve) —— 傅立葉級數中「圓套圓（Epicycles）」的基礎幾何原型。

## 延伸閱讀

- [傅立葉級數（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%82%85%E9%87%8C%E5%8F%B6%E7%B4%9A%E6%95%B8)
- [吉布斯現象（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%90%89%E5%B8%83%E6%96%AF%E7%8E%B0%E8%B1%A1)
