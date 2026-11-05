---
title: 穩態份額
description: A 與 B 以固定速率互換，長時間停在每一邊的比例跟著確定。
tags:
  - 機率統計
concepts:
  - conditional-probability
audience: 大學概念
date: 2026-11-04
order: 83
featured: false
draft: false
---

## 參數方程

兩個狀態 A 與 B 以固定速率互換。離開 A 的速率是 $a$，離開 B 的速率是 $b$。兩者都從 0.05 到 1。

停久了以後，A 的份額是 $b/(a+b)$，B 的份額是 $a/(a+b)$。兩份相加是 1。離開 A 的流量等於回到 A 的流量，也就是 $a$ 乘上 A 的份額等於 $b$ 乘上 B 的份額。離開得少的一邊，份額比較大。兩邊速率一樣時，各佔一半。

$$
\pi_A=\frac{b}{a+b}
$$

## 互動說明

- **離開 A**：改變離開 A 的速率，金線段的長度與分界點一起更新
- **離開 B**：改變離開 B 的速率，金線段的長度與分界點一起更新

## 觀察重點

- A 的份額等於離開 B 的速率，除以兩邊離開速率的和。
- 兩邊離開速率相同時，線段從正中間分成兩半。
- 離開得比較少的一邊，佔去比較大的一份。

## 相關作品

- [條件機率與貝氏定理](/works/conditional-probability-bayes)

## 延伸閱讀

- [馬可夫鏈（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%A6%AC%E5%8F%AF%E5%A4%AB%E9%8F%88)
