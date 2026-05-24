---
title: 拋物線反射
description: 由焦點發出的光線經拋物面反射後變為平行光束，展示拋物線光學性質。
tags:
  - 幾何
  - 二次曲線
date: 2026-05-27
featured: false
draft: false
---

## 參數方程

拋物線反射（Parabolic Reflection）展示幾何光學的核心性質：光源置於焦點時，反射光線皆平行於軸線射出。

$$
y^2 = 4px
$$

- **p**：焦距（頂點至焦點距離），焦點 F 為 (p, 0)
- 鏡面點 P(x, y) 上，由焦點出發的光線反射後方向為 (1, 0)，即沿 x 軸向右

## 實作要點

- **光路計算**：幾何公式算出「焦點 → 鏡面 → 畫布邊緣」兩段折線，不用物理引擎
- **光束生長**：reveal 前 50% 為入射段，後 50% 為反射段同步平行射出
- **切換重置**：調整 p 或光束數時重置動畫
- **焦距過渡**：p 以 lerp（0.08）平滑過渡，拋物線開口與光路連動

## 相關連結

- 視覺化主題：[二次曲線的幾何動態軌跡](/explore/conic-dynamic-geometry)
- 相關作品：[二次曲線包絡線](/works/conic-envelope)、[焦點軌跡](/works/conic-focus-locus)

## 延伸閱讀

- [拋物線（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%8A%9B%E7%89%A9%E7%B7%9A)
