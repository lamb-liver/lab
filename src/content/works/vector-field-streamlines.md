---
title: 向量場流線
description: 沿向量場方向積分得到的軌跡，展示微分方程解的幾何圖像。
tags:
  - 函數與分析
date: 2026-07-06
featured: false
draft: false
---

## 參數方程

給定向量場 $\mathbf{F}(x,y)=(F_x,F_y)$，流線是下列常微分方程的解：

$$
\frac{dx}{dt}=F_x(x,y),\quad
\frac{dy}{dt}=F_y(x,y)
$$

等價寫法：

$$
\frac{d\mathbf{r}}{dt}=\mathbf{F}(\mathbf{r}(t))
$$

可視為方向場的積分曲線，用於理解梯度、旋度與一階微分方程的解。

本場取漩渦加擾動：

$$
F_x = \frac{-y}{x^2+y^2+\varepsilon} + 0.25\sin(2y + 0.8t),\quad
F_y = \frac{x}{x^2+y^2+\varepsilon} + 0.25\cos(2x + 0.8t)
$$

$\varepsilon$ 避免原點除零；方向垂直半徑，整體呈旋轉流。

## 互動說明

- **流線數量**：增減同時積分的流線條數
- **積分步數**：步數愈多單條流線愈長、細節愈多
- **流動速度 ω**：驅動向量場隨時間變化，流線形狀連續更新

## 觀察重點

- 流線切向對齊向量場，可視為微分方程的幾何解
- 漩渦中心附近流線密集環繞
- 同一場中不同起點的流線互不相交（除奇點外）

## 相關作品

- [向量場的基本圖樣](/works/vector-field-patterns)
- [微分方程的幾何視覺化](/explore/differential-equations-geometry)

## 延伸閱讀

- [場線（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%A0%B4%E7%B7%9A)
