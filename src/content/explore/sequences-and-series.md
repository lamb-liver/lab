---
title: 數列與級數
description: 同一個寫出下一項的規則，如何讓部分和收斂、發散，或把軌道送進密集落點。
category: 分析
concepts:
  - sequences-series
  - taylor-approximation
date: 2026-05-26
order: 8
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
- **單峰疊代**：對 $x_{n+1}=rx_n(1-x_n)$ 調整 $r$，觀察穩定、週期與混沌

建議順序：等差／等比 → 級數部分和 → 提高 $r$ 看分岔與混沌。

## 觀察重點

- 下一項可以是加同一個差、乘同一個比，或把輸出再餵回規則；三種都是離散的一步，只是規則不同。
- 部分和問的是這些步加起來有沒有上限；公比的大小會讓同一套累加從趨近有限值變成愈加愈遠。
- 把輸出再餵回去時，參數會讓軌道停在固定點、短週期或一片落點；這與「加下一項」仍是同一種反覆。

## 相關作品

- [泰勒多項式逼近](/works/taylor-polynomial-approximation)
- [等差等比數列的幾何視覺](/works/arithmetic-geometric-sequences)
- [費波那契螺線](/works/fibonacci-spiral)
- [謝爾賓斯基三角形](/works/sierpinski-triangle)
- [巴塞爾問題](/works/basel-problem)
- [單峰映射分岔圖](/works/logistic-bifurcation)

## 延伸閱讀

- [單峰映射（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%80%BB%E8%BE%91%E6%96%AF%E8%B0%9B%E6%98%A0%E5%B0%84)
- [巴塞爾問題（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B7%B4%E5%A1%9E%E5%B0%94%E9%97%AE%E9%A2%98)
