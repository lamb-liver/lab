---
title: 卡特蘭數
description: 合法括號序列、格點單調不越對角線路徑等組合模型的統一計數。
tags:
  - 組合數學
date: 2026-05-26
order: 33
featured: false
draft: false
---

## 參數方程

卡特蘭數 $C_n=\dfrac{1}{n+1}\binom{2n}{n}$ 計數多種結構：$n$ 對括號的合法匹配、從 $(0,0)$ 到 $(n,n)$ 不越對角線的格路徑、凸 $n+2$ 邊形的三角剖分等。視覺化可在不同模型間切換同一 $C_n$。

$$
C_n = \frac{1}{n+1}\binom{2n}{n} = \binom{2n}{n}-\binom{2n}{n+1}
$$

遞迴：

$$
C_0=1,\quad C_{n+1}=\sum_{i=0}^{n} C_i C_{n-i}
$$

## 互動說明

- **模型切換**：括號序列／戴克格路徑／剖分（$n$ 較小時）三種視圖
- **與二項式連結**：標註 $\frac{1}{n+1}\binom{2n}{n}$ 在帕斯卡三角形中的位置
- **$n$ 滑桿**：控制物件規模，$n>6$ 時改為抽樣顯示避免組合爆炸

## 相關作品

- [帕斯卡三角形](/works/pascals-triangle)
- [組合的路徑計數](/works/combinatorial-path-counting)
- [二項式展開的幾何意義](/works/binomial-expansion-geometry)

## 延伸閱讀

- [卡特蘭數（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%8D%A1%E7%89%B9%E8%98%AD%E6%95%B8)
