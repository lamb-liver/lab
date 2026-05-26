---
title: 蒲豐投針
description: 隨機投針估計 π，以頻率逼近古典機率幾何結果。
tags:
  - 統計
  - 機率
  - 幾何
date: 2026-08-17
featured: false
draft: false
---

## 概述

蒲豐投針實驗：長度 $\ell$ 的針隨機落在平行線間距 $d$ 的平面上（$\ell\le d$）。針與任一等距線相交的機率為 $2\ell/(\pi d)$，故大量投擲可用相交頻率反推 $\pi$。

## 參數方程

相交機率：

$$
P(\text{相交})=\frac{2\ell}{\pi d}
$$

估計：

$$
\pi \approx \frac{2\ell N}{d \cdot n},\quad N\text{ 為投擲次數},\; n\text{ 為相交次數}
$$

## 實作要點

- **隨機投針動畫**：每幀生成針中心、方位角，判定是否相交並累計
- **$\pi$ 估計曲線**：橫軸試驗次數，縱軸估計值收斂至 $\pi$
- **參數滑桿**：$\ell$、$d$ 比例影響理論機率與收斂速度
- **線條網格**：繪製等距平行線，高亮相交針

## 相關連結

- 相關作品：[條件機率與貝氏定理](/works/conditional-probability-bayes)、[二項分佈到常態分佈](/works/binomial-to-normal)

## 延伸閱讀

- [布豐投針問題（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B8%83%E8%B1%90%E6%8A%95%E9%87%9D%E5%95%8F%E9%A1%8C)
