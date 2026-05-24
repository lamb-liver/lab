---
title: 干涉條紋
description: 雙源波的疊加產生明暗交替的干涉條紋圖樣。
tags:
  - 三角函數
  - 波動
date: 2026-05-25
featured: false
draft: false
---

## 參數方程

干涉條紋（Interference Fringes）是兩個波源發出的圓形波在空間中疊加所形成的圖形。空間中任一點到兩波源的波程差決定該點相長或相消；亮紋的幾何軌跡為雙曲線：

$$
x = a\cosh t = a\frac{e^t + e^{-t}}{2},\quad
y = b\sinh t = b\frac{e^t - e^{-t}}{2}
$$

- **d**：兩波源距離；**λ**：波長（條紋疏密）
- **2a = nλ**：波程差（n 為條紋階數）
- **b = √(c² − a²)**，**c = d/2**

## 實作要點

- **直接描點**：以雙曲函數參數方程計算 (x, y)，不做極座標轉換
- **時間推進**：隨時間調整相位，模擬波動向外傳播
- **結構切換**：調整 λ 或 d 時重新觸發由內向外的 reveal 動畫
- **距離過渡**：調整 d 時以 lerp（0.08）平滑過渡，雙曲線族連續形變

## 相關連結

- 視覺化主題：[三角函數的疊加與波的干涉](/explore/trig-wave-interference)
- 相關作品：[駐波圖](/works/standing-wave)、[克拉尼圖形](/works/chladni-figures)

## 延伸閱讀

- [干涉（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B9%B2%E6%B6%89_(%E7%89%A9%E7%90%86%E5%AD%B8))
