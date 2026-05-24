---
title: 二次曲線包絡線
description: 一族直線在座標軸上滑動，交織出拋物線型包絡輪廓。
tags:
  - 幾何
  - 二次曲線
date: 2026-05-28
featured: false
draft: false
---

## 參數方程

二次曲線包絡線（Conic Envelope）展示「直線交織出曲線」的幾何現象：一族直線在座標軸上規則滑動，邊界自然勾勒拋物線輪廓。

$$
\frac{x}{x_A} + \frac{y}{y_B} = 1
$$

- **x_A** = (L/2) · t · ratio（水平軸截距）
- **y_B** = (L/2) · (1 − t)（垂直軸截距）
- **t** ∈ $[0, 1]$ 為步進參數，**ratio** 為橫縱延伸比

直線密度趨近無限時，邊界等同於：

$$
\sqrt{\frac{x}{\text{ratio}}} + \sqrt{y} = C
$$

## 實作要點

- **直線交織**：不用曲線函數，以高密度直線群視覺包絡
- **動態呼吸**：餘弦振盪驅動軸上端點週期滑移（scale = 1 + 0.15 cos(t)）
- **數量切換**：調整線條密度時重置 reveal，逐條生長
- **比例過渡**：ratio 以 lerp（0.08）平滑變形

## 相關連結

- 視覺化主題：[二次曲線的幾何動態軌跡](/explore/conic-dynamic-geometry)
- 相關作品：[焦點軌跡](/works/conic-focus-locus)、[拋物線反射](/works/parabolic-reflection)

## 延伸閱讀

- [包絡線（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%8C%85%E7%B5%A1%E7%B7%9A)
