---
title: 圓盤上的三角形
description: 三邊垂直碰到外圓的正三角形，頂點愈靠邊界，內角和愈小。
tags:
  - 幾何
concepts:
  - hyperbolic-geometry
audience: 大學概念
prerequisites:
  - 圓
date: 2026-10-06
order: 76
featured: false
draft: false
---

## 參數方程

外圓是單位圓。三個頂點離圓心一樣遠，彼此隔 $120^\circ$。連接兩點的邊不是弦，而是跟外圓垂直的那一段圓弧。圓盤上的角度就是這兩條弧在頂點的夾角。

頂點到圓心的雙曲距離記成 $\rho=\ln\frac{1+r}{1-r}$，$r$ 是畫面上的距離。正三角形的邊長 $s$ 滿足

$$
\cosh s=\cosh^{2}\rho+\frac12\sinh^{2}\rho
$$

內角 $\theta$ 滿足

$$
\cos\theta=\frac{\cosh s}{\cosh s+1}
$$

所以三個角加起來小於 $180^\circ$。$r$ 趨近 $0$ 時，內角和趨近 $180^\circ$。

## 互動說明

- **離圓心**：移動三個頂點，一起遠離或靠近圓心，內角和跟著改變

## 觀察重點

- 三邊都是圓弧，而且每條弧都跟外圓垂直。
- 三個內角加起來小於 $180^\circ$。
- 三角形縮向圓心時，內角和靠近 $180^\circ$；頂點靠近外圓時，內角和變小。

## 相關作品

- [圓反演](/works/circle-inversion)
- [弧度與圓弧長](/works/radian-arc-length)

## 延伸閱讀

- [雙曲幾何（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%9B%99%E6%9B%B2%E5%B9%BE%E4%BD%95)
- [反演（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%8F%8D%E6%BC%94)
