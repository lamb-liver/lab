---
title: 諧振圖
description: 以阻尼振子方程描繪的 Harmonograph 軌跡，頻率、相位與阻尼係數決定收斂形態。
tags:
  - 幾何
  - 三角函數
  - 參數方程
date: 2026-03-10
featured: true
draft: false
---

## 參數方程

諧振圖（Harmonograph）的一般形式為：

$$
x = A \sin(at + \delta)e^{-dt},\quad
y = B \sin(bt)e^{-dt}
$$

- **A, B** 為 x 軸與 y 軸的振幅
- **a, b** 為頻率參數
- **δ**（delta）為相位差，決定圖形的起始狀態與對稱性
- **d** 為阻尼係數，決定曲線向內收斂的衰減速度

## 實作要點

- 細密描點：時間參數 **t** 從 0 增至 **10π**，步長 0.01，以捕捉完整收斂軌跡
- 直接產出笛卡爾座標 (x, y)，無需極座標轉換
- **頻率切換**：調整 a、b 時清除圖形並重新觸發漸進生長動畫
- **參數過渡**：調整 δ 或 d 時以 lerp 平滑靠近，產生連續扭轉與收縮視覺

## 延伸閱讀

- [Harmonograph（Wikipedia，英文版）](https://en.wikipedia.org/wiki/Harmonograph)
