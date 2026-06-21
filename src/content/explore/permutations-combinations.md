---
title: 排列組合
description: 追蹤同一個組合數如何在二項式係數、格點路徑與遞迴依賴中反覆出現；並比較卡特蘭數如何由限制條件篩出子集合。
category: 代數
date: 2026-05-26
order: 9
coverImage: /images/explore-covers/permutations-combinations.png
featured: false
draft: false
---

## 基本概念

$$
C(n,k) = \frac{n!}{k!\,(n-k)!}
$$

組合數 $C(n,k)$ 表示從 $n$ 個位置中選出 $k$ 個位置，且不計排列順序的方法數。同一個數可以讀成 $(a+b)^n$ 中選出 $k$ 個 $b$ 的係數，也可以讀成 $m+n$ 步路徑中選出 $m$ 步向右的總數：

$$
C(m+n,m)
$$

帕斯卡遞迴則說明這些數如何由上一列生成：

$$
C(n,k)=C(n-1,k-1)+C(n-1,k)
$$

卡特蘭數不是另一個獨立的 $C(n,k)$。它從所有平衡路徑 $C(2n,n)$ 中，只保留不越過限制線的合法子集合：

$$
\mathrm{Cat}_n=\frac{1}{n+1}C(2n,n)
$$

## 互動說明

- **係數表**：在帕斯卡三角形中選擇一格，讀成 $C(n,k)$ 與二項式係數
- **路徑模型**：把同一個數讀成固定步數中選哪些步向右
- **遞迴依賴**：用依賴錐觀察 $C(n,k)$ 如何由上一列兩格相加

建議順序：係數表 → 路徑模型 → 遞迴依賴；最後對照卡特蘭數如何加入限制條件。

## 觀察重點

- 同一個 $C(n,k)$ 可以同時是二項式係數、選步位置數，也是在遞迴表中的一格
- 路徑模型把「選 $k$ 個位置」具體化：總步數固定後，只需決定哪些步向右或向上
- 卡特蘭數是在 $C(2n,n)$ 的全部平衡路徑上加限制；它計數的是合法子集合，不是另一個平行的組合公式

## 相關作品

- [帕斯卡三角形](/works/pascals-triangle)
- [組合的路徑計數](/works/combinatorial-path-counting)
- [二項式展開的幾何意義](/works/binomial-expansion-geometry)
- [卡特蘭數](/works/catalan-numbers)

## 延伸閱讀

- [楊輝三角形（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9D%A8%E8%BE%89%E4%B8%89%E8%A7%92%E5%BD%A2)
- [卡特蘭數（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%8D%A1%E5%A1%94%E5%85%B0%E6%95%B8)
