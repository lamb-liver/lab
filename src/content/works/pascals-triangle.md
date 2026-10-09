---
title: 帕斯卡三角形
description: 二項式係數三角陣列，展示遞迴、對稱與組合恆等式。
audience: 直觀探索
tags:
  - 組合數學
concepts:
  - binomial-theorem
date: 2026-05-26
order: 30
featured: false
draft: false
---

## 參數方程

帕斯卡三角形第 $n$ 列第 $k$ 項為 $\binom{n}{k}$，滿足 $\binom{n}{k}=\binom{n-1}{k-1}+\binom{n-1}{k}$。三角形匯聚了二項式定理、楊輝三角與多條組合恆等式的幾何證據。

$$
\binom{n}{k}=\frac{n!}{k!(n-k)!},\quad
\binom{n}{k}=\binom{n-1}{k-1}+\binom{n-1}{k}
$$

二項式定理：

$$
(x+y)^n=\sum_{k=0}^{n}\binom{n}{k}x^{n-k}y^k
$$

## 互動說明

- **列數**：控制顯示至第 $n$ 列，避免大 $n$ 時版面溢出
- **模**：選擇素數 $p$（2、3、5、7）對 $\binom{n}{k}$ 取模並著色；模 2 時空心點構成謝爾賓斯基三角形，其他素數呈現的是整除圖樣，不是謝爾賓斯基三角形
- **點選格子**：點某一格時，高亮經由反覆「上兩格相加」匯入它的整個錐形區域，不只正上方兩格

## 觀察重點

- 餘數圖樣左右對稱，因為 $\binom{n}{k}=\binom{n}{n-k}$，取模不會破壞這個等式
- 高亮的錐形區域，是把帕斯卡遞迴一路倒推回三角形頂端
- 模 2 時，空心格是偶數的二項式係數，構成謝爾賓斯基三角形；其他素數空出的是被該素數整除的係數，那個圖樣不是謝爾賓斯基三角形

## 相關作品

- [組合的路徑計數](/works/combinatorial-path-counting)
- [二項式展開的幾何意義](/works/binomial-expansion-geometry)
- [卡特蘭數](/works/catalan-numbers)

## 延伸閱讀

- [帕斯卡三角形（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B8%95%E6%96%AF%E5%8D%A1%E4%B8%89%E8%A7%92%E5%BD%A2)
