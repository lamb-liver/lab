---
title: 數列與級數
description: 等差、等比與遞迴定義離散規律；觀察級數收斂與邏輯斯諦映射的混沌。
category: 分析
date: 2026-07-04
coverImage: /images/explore-covers/sequences-and-series.png
featured: false
draft: false
---

## 基本概念

等差數列：

$$
a_n = a_1 + (n-1)d
$$

等比數列：

$$
a_n = a_1 \cdot r^{n-1}
$$

等差、等比是最基本的規律；遞迴則用先前項定義後續項（例如 $a_n=a_{n-1}+a_{n-2}$）。

## 互動說明

- **數列圖像**：繪製 $a_n$ 對 $n$ 的離散點，比較等差直線型與等比指數型成長
- **級數累加**：顯示部分和 $S_n$，觀察 $|r|<1$ 時是否趨近有限值
- **邏輯斯諦迭代**：對 $x_{n+1}=rx_n(1-x_n)$ 調整 $r$，觀察穩定、週期與混沌

建議順序：等差／等比 → 級數部分和 → 提高 $r$ 看分岔與混沌。

## 觀察重點

- 等比級數在 $|r|<1$ 時收斂、$|r|>1$ 時發散，$|r|=1$ 為臨界
- 邏輯斯諦映射在 $r>3$ 後出現週期倍增，$r\approx 3.57$ 附近進入混沌
- 調和級數 $\sum 1/n$ 發散極慢，巴塞爾級數 $\sum 1/n^2$ 收斂於 $\pi^2/6$

## 相關作品

- [等差等比數列的幾何視覺](/works/arithmetic-geometric-sequences)
- [費波那契螺線](/works/fibonacci-spiral)
- [謝爾賓斯基三角形](/works/sierpinski-triangle)
- [巴塞爾問題](/works/basel-problem)
- [邏輯斯諦映射分岔圖](/works/logistic-bifurcation)

## 延伸閱讀

- [邏輯斯諦映射（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%80%BB%E8%BE%91%E6%96%AF%E8%B0%9B%E6%98%A0%E5%B0%84)
- [巴塞爾問題（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B7%B4%E5%A1%9E%E5%B0%94%E9%97%AE%E9%A2%98)
