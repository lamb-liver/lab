---
title: 二項分佈到常態分佈
description: n 次試驗的成功次數直方圖隨 n 增大趨近鐘形常態曲線。
tags:
  - 機率統計
date: 2026-08-16
featured: false
draft: false
---

## 參數方程

二項分佈 $\mathrm{B}(n,p)$ 描述 $n$ 次獨立試驗中成功次數 $X$ 的機率。當 $n$ 大且 $p$ 不極端時，標準化後的 $X$ 近似常態 $\mathcal{N}(np,\,np(1-p))$，即中央極限定理在有限試驗上的視覺化。

$$
P(X=k)=\binom{n}{k}p^k(1-p)^{n-k},\quad k=0,1,\ldots,n
$$

常態近似（去中心化）：

$$
Z=\frac{X-np}{\sqrt{np(1-p)}}\approx \mathcal{N}(0,1)
$$

密度：

$$
\phi(x)=\frac{1}{\sqrt{2\pi}}e^{-x^2/2}
$$

## 互動說明

- **直方圖 morph**：固定 $p$，$n$ 滑桿由小到大，柱狀圖逐漸貼近鐘形曲線
- **疊加常態**：以 $\mu=np$、$\sigma^2=np(1-p)$ 繪製連續密度與離散柱對照
- **標準化視窗**：可切換顯示 $X$ 或 $Z$，觀察均值與尺度收斂
- **單次試驗動畫**：可選模擬 Bernoulli 序列累積，對照理論分佈

## 相關作品

- [條件機率與貝氏定理](/works/conditional-probability-bayes)
- [帕斯卡三角形](/works/pascals-triangle)
- [蒲豐投針](/works/buffon-needle)

## 延伸閱讀

- [二項分佈（維基百科）](https://zh.wikipedia.org/zh-tw/%E4%BA%8C%E9%A0%85%E5%88%86%E4%BD%88)
- [常態分佈（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%AD%A3%E6%85%8B%E5%88%86%E4%BD%88)
- [棣莫弗－拉普拉斯定理（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%A3%B7%E8%8E%AB%E5%BC%97-%E6%8B%89%E6%99%AE%E6%8B%89%E6%96%AF%E5%AE%9A%E7%90%86)
