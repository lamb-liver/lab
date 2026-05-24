---
title: 駐波圖
description: 兩列反向波疊加形成駐波，觀察節點與腹點的分佈。
tags:
  - 三角函數
  - 波動
date: 2026-05-24
featured: false
draft: false
---

## 參數方程

駐波（Standing Wave）是兩列振幅與頻率相同、但傳播方向相反的波疊加後產生的波形：

$$
y = 2A\sin(kx)\cos(\omega t)
$$

- **A**：振幅
- **k**：波數（控制空間頻率，決定波節與波腹數量）
- **ω**：時間角速度（控制振盪速度）

## 實作要點

- **時間推進**：t 隨幀數持續遞增，驅動波形上下振盪
- **直接描點**：在水平範圍內密集計算 (x, y) 並繪製，不做極座標轉換
- **頻率切換**：調整 k 時清除圖形並重新觸發漸進生長動畫
- **振幅過渡**：調整 A 時以 lerp（係數 0.08）平滑過渡，波形向外擴張或向內收縮

## 相關連結

- 視覺化主題：[三角函數的疊加與波的干涉](/explore/trig-wave-interference)
- 相關作品：[干涉條紋](/works/interference-fringes)、[克拉尼圖形](/works/chladni-figures)

## 延伸閱讀

- [駐波（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%A7%90%E6%B3%A2)
