---
title: 帕斯卡三角形
description: 二項式係數三角陣列，展示遞迴、對稱與組合恆等式。
tags:
  - 組合數學
date: 2026-05-26
order: 30
featured: false
draft: false
---

## 參數方程

帕斯卡三角形第 $n$ 行第 $k$ 項為 $\binom{n}{k}$，滿足 $\binom{n}{k}=\binom{n-1}{k-1}+\binom{n-1}{k}$。三角形匯聚了二項式定理、楊輝三角與多條組合恆等式的幾何證據。

$$
\binom{n}{k}=\frac{n!}{k!(n-k)!},\quad
\binom{n}{k}=\binom{n-1}{k-1}+\binom{n-1}{k}
$$

二項式定理：

$$
(x+y)^n=\sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k
$$

## 互動說明

- **模運算著色**：可選對素數 $p$ 取 $\binom{n}{k}\bmod p$，呈現 Sierpiński 型碎形圖樣
- **路徑高亮**：點選某格時高亮「由上兩格相加」的遞迴路徑
- **行數滑桿**：控制顯示至第 $n$ 行，避免大 $n$ 時版面溢出

## 相關作品

- [組合的路徑計數](/works/combinatorial-path-counting)
- [二項式展開的幾何意義](/works/binomial-expansion-geometry)
- [卡特蘭數](/works/catalan-numbers)

## 延伸閱讀

- [帕斯卡三角形（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B8%95%E6%96%AF%E5%8D%A1%E4%B8%89%E8%A7%92%E5%BD%A2)
