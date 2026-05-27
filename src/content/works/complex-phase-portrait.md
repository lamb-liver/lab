---
title: 相位圖
description: 複平面上以色相標示幅角（相位），直觀理解複數的方向與乘法旋轉。
tags:
  - 代數
  - 複數
date: 2026-08-01
featured: false
draft: false
---

## 參數方程

在阿干德圖（複平面）上，每個點 $z=x+iy$ 可對應色相 $\mathrm{Arg}(z)\in(-\pi,\pi]$ 與亮度 $|z|$；相位圖以連續色帶呈現幅角分佈，是進入複數幾何與保角映射的入口。

$$
z = x + iy,\quad
\mathrm{Arg}(z) = \atan2(y, x),\quad
|z| = \sqrt{x^2 + y^2}
$$

色相常取 $\mathrm{Arg}(z)$ 的週期映射；亮度可選 $|z|$ 或 $\log(1+|z|)$ 以避免原點過曝。

## 互動說明

- **原點處理**：$z=0$ 幅角未定，可固定為中性色或跳過單點
- **互動取景**：拖曳平移／滾輪縮放複平面視窗，觀察局部相位週期
- **疊加輔助**：可選繪製單位圓與實軸、虛軸，標出 $\pm1,\pm i$

## 相關作品

- [複數四則運算的幾何意義](/works/complex-arithmetic-geometry)
- [複數的極座標形式](/works/complex-polar-form)
- [尤拉公式旋轉動畫](/works/euler-formula-rotation)

## 延伸閱讀

- [阿干德平面（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%98%BF%E5%B9%B2%E5%BE%B7%E5%B9%B3%E9%9D%A2)
