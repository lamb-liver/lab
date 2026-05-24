---
title: 克拉尼圖形
description: 振動平板上沙粒聚集於節線，呈現對稱的駐波圖案。
tags:
  - 三角函數
  - 波動
  - 幾何
date: 2026-05-26
featured: false
draft: false
---

## 參數方程

克拉尼圖形（Chladni Figures）是正方形薄板在特定頻率共振時出現的幾何圖案。板面振動時，位移為零的線條稱為波節線；細沙被震離高振幅區，堆積於波節線上：

$$
A(x,y)=\sin\!\left(\frac{m\pi x}{L}\right)\sin\!\left(\frac{n\pi y}{L}\right)
-\sin\!\left(\frac{n\pi x}{L}\right)\sin\!\left(\frac{m\pi y}{L}\right)
$$

- **L**：薄板邊長
- **m、n**：正整數模態，決定橫向與縱向波節線數量
- **Amplitude = 0** 的點連成波節線，即沙粒最終停駐之處

## 實作要點

- **沙粒模擬**：8000 顆獨立粒子座標，模擬細沙質感
- **逃逸邏輯**：每幀依所在位置振幅驅動粒子遠離腹點，自然沉積於波節線
- **模態切換**：調整 m 或 n 時重新散落沙粒並觸發 reveal
- **平滑過渡**：m、n 以 lerp（0.08）連續過渡，聚集過程平滑

## 相關連結

- 視覺化主題：[三角函數的疊加與波的干涉](/explore/trig-wave-interference)
- 相關作品：[駐波圖](/works/standing-wave)、[干涉條紋](/works/interference-fringes)

## 延伸閱讀

- [恩斯特·克拉德尼（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%81%A9%E6%96%AF%E7%89%B9%C2%B7%E5%85%8B%E6%8B%89%E5%BE%B7%E5%B0%BC)
