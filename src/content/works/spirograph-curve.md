---
title: 繁花曲線
description: 內擺線（內擺線 / Hypotrochoid）模擬小圓在大圓內滾動的軌跡，R、r 決定角數結構，d 控制花瓣尖銳度。
tags:
  - 幾何
date: 2026-05-25
order: 4
featured: true
draft: false
---

## 參數方程

繁花曲線（內擺線）模擬小圓在大圓內部滾動的軌跡，其方程式為：

$$
x = (R-r)\cos t + d\cos\!\left(\frac{R-r}{r}t\right),\quad
y = (R-r)\sin t - d\sin\!\left(\frac{R-r}{r}t\right)
$$

- **R** 為定圓（大圓）半徑
- **r** 為動圓（小圓）半徑
- **d** 為筆尖距離動圓中心的距離

## 互動說明

- **大圓 R、小圓 r**：改變內擺線角數結構；切換時圖形重新漸顯
- **筆尖 d**：調整筆尖離小圓中心距離，花瓣尖銳度與交錯感連續變化

## 觀察重點

- 閉合軌道週期與 $\gcd(R,r)$ 有關；比例互質時圖案較豐富
- $d$ 接近 $r$ 時易出現尖瓣；$d$ 較小時圖形更內斂
- 內擺線是「小圓在大圓內滾動」的幾何結果

## 相關作品

- [玫瑰曲線](/works/rose-curve)
- [利薩茹曲線](/works/lissajous-curve)
- [傅立葉級數](/explore/fourier-series)

## 延伸閱讀

- [萬花尺（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%90%AC%E8%8A%B1%E5%B0%BA)
