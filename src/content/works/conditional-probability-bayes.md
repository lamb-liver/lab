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

- **先驗 P(A)**：調整事前機率，觀察同一份證據如何得出不同的事後結論
- **條件 P(B|A)／P(B|¬A)**：改變兩種條件機率，對照偽陽性對判斷的影響
- **樹狀圖／面積模型**：切換兩種表徵，比較分支相乘與面積比例兩種讀法
- **醫檢／抽牌／垃圾信**：切換情境，用具體例子取代抽象符號

## 相關作品

- [二項分佈到常態分佈](/works/binomial-to-normal)
- [蒲豐投針](/works/buffon-needle)

## 延伸閱讀

- [貝葉斯定理（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%B2%9D%E8%91%89%E6%96%AF%E5%AE%9A%E7%90%86)
- [條件機率（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9D%A1%E4%BB%B6%E6%A6%82%E7%8E%87)
