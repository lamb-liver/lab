---
title: 極限與黎曼和
description: 以同一個尺度縮小動作比較面積累積與局部斜率；觀察定積分與導數如何從有限近似逼近連續量。
category: 分析
date: 2026-07-01
coverImage: /images/explore-covers/limits-riemann-sum.png
featured: false
draft: false
---

## 基本概念

$$
\int_a^b f(x)\,dx = \lim_{n\to\infty} \sum_i f(x_i^*)\,\Delta x
$$

$$
f'(P)=\lim_{h\to 0}\frac{f(P+h)-f(P)}{h}
$$

定積分可視為把區間 $[a,b]$ 切成愈來愈細的矩形後取極限；導數則是在單一點附近，用愈來愈短的跨度讀出瞬時斜率。這裡的 $\Delta x$ 是切分整段區間的寬度，$h$ 是從點 $P$ 往右看的局部跨度。

## 互動說明

- **對照模式**：用同一個尺度旋鈕，同步縮小全域切片與局部跨度，比較面積累積與斜率比值
- **全域面積**：調整分割數 $n$ 與取樣方式，觀察矩形總和如何逼近定積分
- **局部斜率**：拖動點 $P$ 並縮小 $h$，觀察單側割線斜率如何逼近 $f'(P)$

建議順序：先看對照模式的尺度縮小 → 進入全域面積比較誤差累積 → 進入局部斜率觀察割線逼近。

## 觀察重點

- 定積分把整段區間切細後加總；導數把單一點附近放大後取比值
- 尺度縮小時，面積近似的誤差來自多個小區間累積，斜率近似的誤差來自 $P$ 附近的曲率殘差
- 函數彎曲愈劇烈，有限分割或有限 $h$ 的近似收斂較慢；可微時導數本身仍是明確的極限

## 相關作品

- [原函數與導函數圖形對照](/works/function-derivative-graph)
- [黎曼和動態圖](/works/riemann-sum)
- [切線逼近動畫](/works/tangent-approximation)
- [等角螺線](/works/equiangular-spiral)

## 延伸閱讀

- [黎曼積分（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%BB%8E%E6%9B%BC%E7%A7%AF%E5%88%86)
- [導數（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%AF%BC%E6%95%B8)
