---
title: 自然對數 e 的幾何定義
description: 以 y=1/x 下面積從 1 到 t 定義 ln t，並展示 e 為使面積為 1 的底。
tags:
  - 函數與分析
date: 2026-08-20
featured: false
draft: false
---

## 參數方程

自然對數可定義為 $\displaystyle \ln t=\int_1^t \frac{1}{x}\,dx$，即雙曲線 $y=1/x$ 與 $x$ 軸、$x=1$、$x=t$ 所圍面積。數 $e$ 滿足 $\ln e=1$，是使該面積「單位寬度」的唯一正底數，並與 $e^x$ 互為反函數。

$$
\ln t = \int_1^t \frac{1}{x}\,dx,\quad t>0
$$

$$
e = \lim_{n\to\infty}\left(1+\frac{1}{n}\right)^n
$$

導數關係：$\dfrac{d}{dt}\ln t = \dfrac{1}{t}$。

## 互動說明

- **面積填充**：$t$ 滑桿拖動，即時著色 $\int_1^t 1/x\,dx$ 並顯示數值
- **$e$ 標記**：當面積累積至 1 時標出 $t=e\approx 2.71828$
- **矩形黎曼和**：可選細分逼近，連結黎曼和作品
- **與 $e^x$ 對照**：切換顯示指數曲線與對數互為反函數的對稱關係

## 相關作品

- [對數尺度](/works/logarithmic-scale)
- [指數成長與衰減](/works/exponential-growth-decay)
- [黎曼和動態圖](/works/riemann-sum)

## 延伸閱讀

- [自然對數（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%87%AA%E7%84%B6%E5%B0%8D%E6%95%B8)
- [圓周率e（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%9C%93%E5%91%A8%E7%8E%87e)
