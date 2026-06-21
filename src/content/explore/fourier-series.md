---
title: 傅立葉級數
description: 疊加正弦與餘弦逼近週期函數；調整項數 N 觀察收斂與吉布斯現象。
category: 分析
date: 2026-02-01
coverImage: /explore/fourier-series-epicycles-cover.png
featured: false
draft: false
---

## 基本概念

許多常見的 $2\pi$ 週期函數（例如分段光滑函數）可用傅立葉級數表示：

$$
f(x) = \frac{a_0}{2} + \sum_{n=1}^{\infty} \bigl(a_n\cos(nx) + b_n\sin(nx)\bigr)
$$

各係數 $a_n,b_n$ 由 $f$ 與正交三角函數的內積決定；有限項截斷即為對 $f$ 的近似。不連續點附近的收斂需另看左右極限與吉布斯現象。

## 互動說明

- **項數 N**：以滑桿調整疊加項數，觀察圓周疊加如何逼近方波或二維週期軌道
- **一維／二維模式**：切換波形與平面軌跡，對照同一組諧波在兩種呈現下的差異

建議順序：少量諧波 → 增加 N 觀察貼合 → 對照不連續邊緣的振盪。

## 觀察重點

- 足夠規則的週期軌跡可拆成多個基本頻率（圓運動）的疊加
- 函數愈平滑，係數衰減愈快，有限 N 的近似愈快貼近目標
- 在不連續處，項數增加仍留下約 9% 跳躍高度的吉布斯過衝

## 相關作品

- [繁花曲線](/works/spirograph-curve)

## 延伸閱讀

- [傅立葉級數（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%82%85%E9%87%8C%E5%8F%B6%E7%B4%9A%E6%95%B8)
- [吉布斯現象（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%90%89%E5%B8%83%E6%96%AF%E7%8E%B0%E8%B1%A1)
