---
title: 切線逼近動畫
description: 割線斜率趨近切線斜率，展示導數作為瞬時變化率。
tags:
  - 分析
  - 微積分
date: 2026-07-03
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

切點 $x_P = 0.5 + 0.1\sin(0.6t)$ 隨時間微動。**Δx** 由坍縮動畫從 0.4 收斂至目標值；Ghost 曲線在 **k** 變更時以快照時間重建。

## 實作要點

- **數學與渲染分離**：$[0,1]$ 歸一化域計算，映射層負責縮放
- **唯一函數源**：割線端點與延伸線共用 `evaluateTangentFn`
- **極限坍縮**：`collapse` 進度驅動 Δx 從 0.4 → 目標
- **發光管線**：割線與延伸線分層 glow；P、Q 標註點

## 相關連結

- 視覺化主題：[極限與黎曼和](/explore/limits-riemann-sum)
- 相關作品：[黎曼和動態圖](/works/riemann-sum)、[曳物線](/works/catenary)、[等角螺線](/works/equiangular-spiral)、[向量場流線](/works/vector-field-streamlines)

## 延伸閱讀

- [导数（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%AF%BC%E6%95%B0)
