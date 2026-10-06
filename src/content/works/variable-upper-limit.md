---
title: 面積與右端高度
description: 右端往外移時，面積增量比上寬度會靠近曲線高度。
tags:
  - 函數與分析
concepts:
  - definite-integral
audience: 高中概念
prerequisites:
  - 導數
  - 定積分
date: 2026-10-06
order: 75
featured: false
draft: false
---

## 參數方程

右端沿著這條曲線移動：

$$
f(x)=1+\frac12\sin x
$$

從 $0$ 積到 $x$ 的面積寫得出來：

$$
A(x)=\int_0^x f=x-\frac12\cos x+\frac12
$$

所以 $A'(x)=f(x)$。右端再取一段寬 $h$ 的增量 $\Delta A=A(x+h)-A(x)$。$h$ 趨近 $0$ 時，$\Delta A/h$ 趨近 $f(x)$。細條的頂是水平的，高度就取這段起點的 $f(x)$。

原函數再加一個常數，兩端相減的結果不變。若改動的是下限，那一端的高度要加負號。這是同一條式子的後果，圖上只動上限。

## 互動說明

- **右端 x**：移動積分上限，金色區域跟著伸到新的右端
- **細條寬度 h**：改變右端矩形的寬度，$\Delta A/h$ 會靠近或離開曲線高度

## 觀察重點

- 這條曲線上，面積的變化率就是右端的高度。
- 細條還有寬度時，$\Delta A/h$ 與 $f(x)$ 可以分開；寬度趨近 $0$ 才重合。
- 曲線從細條左上角往右走：這一段上升時會露出細條上方，下降時會落進細條裡。

## 相關作品

- [黎曼和動態圖](/works/riemann-sum)
- [切線逼近動畫](/works/tangent-approximation)
- [自然對數 e 的幾何定義](/works/natural-log-e-geometry)
- [極限與黎曼和](/explore/limits-riemann-sum)

## 延伸閱讀

- [微積分基本定理（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%BE%AE%E7%A9%8D%E5%88%86%E5%9F%BA%E6%9C%AC%E5%AE%9A%E7%90%86)
- [導數（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%AF%BC%E6%95%B8)
