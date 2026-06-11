---
title: 變異數與分散程度
description: 固定期望值 E(X)，調整分布展寬，觀察相同重心下 Var(X) 如何改變。
tags:
  - 機率統計
date: 2026-10-08
featured: false
draft: true
---

## 參數方程

變異數量測取值偏離期望的加權平方距離：

$$
\mathrm{Var}(X)=\sum_k (x_k-E(X))^2\,P(X=x_k)
$$

標準差 $\sigma=\sqrt{\mathrm{Var}(X)}$。在 $E(X)$ 固定的前提下，長條愈集中於重心附近，$\mathrm{Var}(X)$ 愈小；愈向兩側展開，$\mathrm{Var}(X)$ 愈大。

## 互動說明

- **同平均對照**：切換集中、均勻、雙峰等分布，保持 $E(X)$ 相同，觀察 $\mathrm{Var}(X)$ 的差異
- **展寬調整**：拖動展寬參數；此參數化會在固定 $E(X)$ 下把分布由集中拉向兩側，觀察 $\mathrm{Var}(X)$ 單調增大
- **偏差標示**：從 $E(X)$ 到各 $x_k$ 繪製偏差線段，長度為 $|x_k-E(X)|$，粗細或顏色對應 $P(X=x_k)$
- **標準差區間**：標示 $[E(X)-\sigma,\ E(X)+\sigma]$ 區間，觀察此區間涵蓋的機率比例

## 觀察重點

- 集中分布與分散分布可有相同 $E(X)$；差別在長條離重心的加權平方距離，即 $\mathrm{Var}(X)$。
- 單峰與雙峰在相同平均下，雙峰通常有較大的 $\mathrm{Var}(X)$，因機率分布在兩側拉開。
- 變異數是「偏差平方」的加權平均；遠離重心的長條對 $\mathrm{Var}(X)$ 貢獻以距離平方增長。

## 相關作品

- [離散分布與期望值](/works/discrete-pmf-expectation)
- [二項分布與幾何分布](/works/binomial-geometric-distribution)
- [離散隨機變數與分布](/explore/discrete-random-variables)

## 延伸閱讀

- [變異數（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%AE%8A%E7%95%B0%E6%95%B8)
- [標準差（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%A8%99%E6%BA%96%E5%B7%AE)
