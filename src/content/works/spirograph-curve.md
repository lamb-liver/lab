---
title: 繁花曲線
description: 內擺線（Spirograph / Hypotrochoid）模擬小圓在大圓內滾動的軌跡，R、r 決定角數結構，d 控制花瓣尖銳度。
tags:
  - 幾何
  - 三角函數
  - 參數方程
date: 2026-03-15
featured: true
draft: false
---

## 參數方程

繁花曲線（Spirograph / 內擺線）模擬小圓在大圓內部滾動的軌跡，其方程式為：

$$
x = (R-r)\cos t + d\cos\!\left(\frac{R-r}{r}t\right),\quad
y = (R-r)\sin t - d\sin\!\left(\frac{R-r}{r}t\right)
$$

- **R** 為定圓（大圓）半徑
- **r** 為動圓（小圓）半徑
- **d** 為筆尖距離動圓中心的距離

## 實作要點

- 讓參數 **t** 逐漸增加來進行描點
- 為確保圖形完美閉合，採樣上限需動態計算為 **2π × r / gcd(R, r)**
- 直接產出笛卡爾座標 (x, y)，無需極座標轉換
- **半徑切換**：調整 R 與 r 時，圖形的角數與結構會改變，需清除圖形並重新觸發漸進生長動畫
- **筆尖過渡**：調整 d 時使用 lerp 平滑過渡（係數 0.08），產生花瓣尖銳度與交錯感的連續變形

## 延伸閱讀

- [萬花尺（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%90%AC%E8%8A%B1%E5%B0%BA)
