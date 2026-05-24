---
title: 焦點軌跡
description: 橢圓上動點繞行雙焦點，展示 PF₁ + PF₂ = 2a 的幾何關係。
tags:
  - 幾何
  - 二次曲線
date: 2026-05-29
featured: false
draft: false
---

## 參數方程

焦點軌跡（Focus Loci）將二次曲線的焦點定義轉為動態圖形。以橢圓為例，到兩焦點 F₁、F₂ 距離之和為常數 2a 的點 P 形成橢圓：

$$
x = a\cos t,\quad y = b\sin t
$$

- **a**：半長軸；**e**：離心率（0 → 圓，→1 → 越扁）
- **b** = √(a² − c²)，**c** = a·e 為焦點到中心距離

## 實作要點

- **距離連線**：焦點 (±c, 0) 與軌道點 P 即時連線，展示距離關係
- **雙層軌跡**：底層橢圓 ghost，上層動態連線 + 軌道點 glow
- **參數切換**：調整 a 或 e 時重置 reveal
- **形變過渡**：a、e 以 lerp（0.08）平滑過渡

## 相關連結

- 視覺化主題：[二次曲線的幾何動態軌跡](/explore/conic-dynamic-geometry)
- 相關作品：[二次曲線包絡線](/works/conic-envelope)、[拋物線反射](/works/parabolic-reflection)

## 延伸閱讀

- [焦點（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%84%A6%E9%BB%9E)
