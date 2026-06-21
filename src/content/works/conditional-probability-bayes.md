---
title: 條件機率與貝氏定理
description: 以樹狀圖與面積比例展示 P(A|B) 與貝氏公式的直觀意義。
tags:
  - 機率統計
date: 2026-05-26
order: 34
featured: false
draft: false
---

## 參數方程

條件機率 $P(A\mid B)$ 表示在 $B$ 已發生下 $A$ 的相對可能性；貝氏定理把「原因→結果」與「結果→原因」的機率用 $P(B\mid A)$ 聯繫起來，是診斷、篩檢與機器學習中更新信念的核心。

條件機率：

$$
P(A\mid B)=\frac{P(A\cap B)}{P(B)},\quad P(B)>0
$$

貝氏定理：

$$
P(A\mid B)=\frac{P(B\mid A)\,P(A)}{P(B)}
$$

全機率公式常寫 $P(B)=\sum_i P(B\mid A_i)P(A_i)$，用於分母展開。

## 互動說明

- **樹狀圖動畫**：兩階段實驗的分支機率沿樹相乘，高亮路徑對應 $P(A\cap B)$
- **面積圖（Venn）**：以矩形面積表機率，$B$ 內 $A$ 的比例即 $P(A\mid B)$
- **數值滑桿**：調整 $P(A)$、$P(B\mid A)$、$P(B\mid A^c)$，即時算 $P(A\mid B)$
- **情境切換**：醫檢陽性率／抽牌等經典範例，避免抽象符號過載

## 相關作品

- [二項分佈到常態分佈](/works/binomial-to-normal)
- [蒲豐投針](/works/buffon-needle)

## 延伸閱讀

- [貝葉斯定理（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%B2%9D%E8%91%89%E6%96%AF%E5%AE%9A%E7%90%86)
- [條件機率（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9D%A1%E4%BB%B6%E6%A6%82%E7%8E%87)
