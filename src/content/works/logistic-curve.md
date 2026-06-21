---
title: 邏輯斯諦曲線
description: S 形邏輯斯諦成長 y = L/(1+ae^{-kt})，描述飽和與承載上限。
tags:
  - 函數與分析
date: 2026-08-21
featured: false
draft: false
---

## 參數方程

邏輯斯諦曲線（連續時間）描述資源受限下的成長：初期近似指數增長，中期轉折，末期趨近承載上限 $L$。與離散映射 $x_{n+1}=rx_n(1-x_n)$ 的分岔圖不同，本條目聚焦平滑 S 形微分方程解。

$$
y(t)=\frac{L}{1+ae^{-kt}},\quad L>0,\; k>0,\; a>0
$$

等價微分方程：

$$
\frac{dy}{dt}=ky\left(1-\frac{y}{L}\right)
$$

拐點在 $y=L/2$，對應 $t=\dfrac{\ln a}{k}$。

## 互動說明

- **參數 $L,k,a$**：滑桿調整飽和水平、成長速率與初值偏移
- **三階段標註**：緩增—急增—飽和三區間，可選顯示 $\dfrac{dy}{dt}$
- **與指數對照**：同圖疊加 $Ce^{kt}$ 片段，說明早期近似
- **分岔圖連結**：文內連結離散邏輯斯諦映射分岔作品，避免概念混淆

## 相關作品

- [指數成長與衰減](/works/exponential-growth-decay)
- [邏輯斯諦映射分岔圖](/works/logistic-bifurcation)

## 延伸閱讀

- [S型函數（維基百科）](https://zh.wikipedia.org/zh-tw/S%E5%9E%8B%E5%87%BD%E6%95%B8)
