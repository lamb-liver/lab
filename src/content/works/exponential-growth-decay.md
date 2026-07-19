---
title: 指數成長與衰減
description: y = Ce^(kt) 的指數增長與半衰期衰減，觀察倍增時間與斜率變化。
tags:
  - 函數與分析
date: 2026-05-26
order: 37
featured: false
draft: false
---

## 參數方程

指數函數 $y=Ce^{kt}$ 在 $k>0$ 時呈爆炸性成長，$k<0$ 時單調衰減至 0。倍增時間 $T_+=\ln 2/k$、半衰期 $T_{1/2}=\ln 2/|k|$ 把參數 $k$ 轉成可直觀的時間尺度，常見於人口、放射性與複利模型。

$$
y(t)=Ce^{kt},\quad
\frac{dy}{dt}=ky
$$

倍增（$k>0$）：$y(t+T_+)=2y(t)$；衰減（$k<0$）：$y(t+T_{1/2})=\tfrac12 y(t)$。

## 互動說明

- **成長／衰減**：切換指數符號，觀察同一式子的兩種行為
- **初始值 C／速率 |k|**：調整起點與快慢，對照曲線陡峭度的變化
- **切線斜率**：顯示 $\dfrac{dy}{dt}=ky$，強調斜率與當前高度成正比
- **ln y 尺度**：切換縱軸為 $\ln y$，觀察指數成長變成直線

## 相關作品

- [對數尺度](/works/logarithmic-scale)
- [自然對數 e 的幾何定義](/works/natural-log-e-geometry)
- [邏輯斯蒂曲線](/works/logistic-curve)

## 延伸閱讀

- [指數函數（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%8C%87%E6%95%B8%E5%87%BD%E6%95%B8)
