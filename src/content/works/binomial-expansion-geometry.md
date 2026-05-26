---
title: 二項式展開的幾何意義
description: 以體積或面積分割視覺化 (a+b)^n 的展開與係數來源。
tags:
  - 代數
  - 組合
date: 2026-08-13
featured: false
draft: false
---

## 概述

$(a+b)^2=a^2+2ab+b^2$ 可用正方形分割證明；$(a+b)^3$ 對應立方體三向分割。一般 $(a+b)^n$ 的各項係數 $\binom{n}{k}$ 即為選 $k$ 個 $b$（其餘為 $a$）的組合數，與帕斯卡三角形一致。

## 參數方程

$$
(a+b)^n=\sum_{k=0}^{n}\binom{n}{k}a^{n-k}b^k
$$

幾何：二維情形為邊長 $(a+b)$ 的正方形分成四塊；三維為邊長 $(a+b)$ 的立方體分成八塊。

## 實作要點

- **維度切換**：$n=2$ 平面分割、$n=3$ 立體投影（或展開圖）
- **參數 $a,b$**：滑桿調整兩段長度，面積／體積標籤即時更新
- **係數對應**：每塊區域標示 $a^{n-k}b^k$ 與 $\binom{n}{k}$
- **Reveal 分割**：分割線逐步出現，對應展開式逐項相加

## 相關連結

- 相關作品：[帕斯卡三角形](/works/pascals-triangle)、[組合的路徑計數](/works/combinatorial-path-counting)、[卡特蘭數](/works/catalan-numbers)

## 延伸閱讀

- [二項式定理（維基百科）](https://zh.wikipedia.org/zh-tw/%E4%BA%8C%E9%A0%85%E5%BC%8F%E5%AE%9A%E7%90%86)
