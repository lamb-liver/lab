---
title: 離散隨機變數與分布
description: 以長條圖讀 P(X=x)，把 E(X) 看成重心、Var(X) 看成分散；切換二項與幾何分布比較計數模型。
category: 統計
date: 2026-10-03
coverImage: /images/explore-covers/discrete-random-variables.png
featured: false
draft: true
---

## 基本概念

離散隨機變數 $X$ 在有限或可數取值 $\{x_k\}$ 上，以機率質量函數 $P(X=x_k)$ 描述各點機率。期望值可視為機率長條在數軸上的加權重心；變異數則量測長條相對於這個重心的加權平方距離：

$$
E(X)=\sum_k x_k\,P(X=x_k),\qquad
\mathrm{Var}(X)=\sum_k (x_k-E(X))^2\,P(X=x_k)
$$

二項分布 $\mathrm{B}(n,p)$ 計數 $n$ 次試驗的成功次數；幾何分布 $\mathrm{Geo}(p)$ 計數「第一次成功」前的失敗次數。兩者共用「每次試驗成功機率為 $p$」的假設，但問的計數問題不同。

## 互動說明

- **機率長條與重心**：拖動各 $P(X=x_k)$（或改變分布參數），觀察長條圖與 $E(X)$ 標記同步移動
- **變異與分散**：固定 $E(X)$，切換不同展寬形狀，觀察 $\mathrm{Var}(X)$ 如何改變；可切換顯示 $\pm 1$ 標準差區間
- **二項與幾何**：切換分布類型，調整 $n,p$，比較兩種計數模型的長條形狀與 $E(X)$、$\mathrm{Var}(X)$ 公式

建議順序：長條圖與 $E(X)$ → 變異數 → 二項／幾何切換。

## 觀察重點

- $E(X)$ 不一定是某個 $x_k$ 的取值，而是機率加權的平均位置；長條越高，該點對重心的拉力越大。
- $\mathrm{Var}(X)$ 量測長條相對於重心的展寬；分布愈集中，變異數愈小，與「數據分析」中點雲離平均的散布是同一種分散直覺。
- 二項分布有固定試驗次數上限，幾何分布的尾端可延伸到很大取值；兩種計數模型下，$E(X)$ 與 $\mathrm{Var}(X)$ 的公式結構不同，但長條圖讀法不變。

## 相關作品

- [離散分布與期望值](/works/discrete-pmf-expectation)
- [變異數與分散程度](/works/variance-spread-visualization)
- [二項分布與幾何分布](/works/binomial-geometric-distribution)

## 延伸閱讀

- [離散型隨機變數（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%9B%A2%E6%95%A3%E5%9E%8B%E9%9A%A8%E6%A9%9F%E8%AE%8A%E6%95%B8)
- [期望值（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9C%9F%E6%9C%9B%E5%80%BC)
- [二項分布（維基百科）](https://zh.wikipedia.org/zh-tw/%E4%BA%8C%E9%A0%85%E5%88%86%E4%BD%88)
- [幾何分布（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B9%BE%E4%BD%95%E5%88%86%E4%BD%88)
