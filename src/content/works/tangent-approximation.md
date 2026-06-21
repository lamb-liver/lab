---
title: 切線逼近動畫
description: 割線斜率趨近切線斜率，展示導數作為瞬時變化率。
tags:
  - 函數與分析
date: 2026-05-25
order: 21
featured: false
draft: false
---

## 參數方程

割線斜率：

$$
m = \frac{f(x_P + \Delta x) - f(x_P)}{\Delta x}
$$

當 $\Delta x \to 0$ 時收斂至導數。點斜式：

$$
y - f(x_P) = m(x - x_P)
$$

函數：

$$
f(x) = 0.25\sin(2\pi k x + t) - 0.4(x - 0.5)^2
$$

切點 $x_P = 0.5 + 0.1\sin(0.6t)$ 隨時間微動；**Δx** 為割線兩端在 $x$ 軸上的間距，**k** 控制曲線彎曲程度。

## 互動說明

- **目標跨度 Δx**：縮小割線對應的 $x$ 間距，觀察割線逼近切線
- **波動頻率 k**：改變曲線彎曲程度，切線斜率隨位置變化
- **時間速度 ω**：驅動割線端點沿曲線移動

## 觀察重點

- 割線斜率 $\Delta y/\Delta x$ 在 $\Delta x\to 0$ 時趨近切線斜率
- 曲率大的區段，相同 $\Delta x$ 下割線與切線差異更明顯
- 導數是瞬時變化率，不是平均變化率

## 相關作品

- [黎曼和動態圖](/works/riemann-sum)
- [極限與黎曼和](/explore/limits-riemann-sum)
- [曳物線](/works/catenary)

## 延伸閱讀

- [導數（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%AF%BC%E6%95%B8)
