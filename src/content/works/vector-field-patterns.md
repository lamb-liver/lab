---
title: 向量場的基本圖樣
description: 源、匯、漩渦、鞍點等典型向量場，建立方向場的幾何詞彙。
tags:
  - 幾何
  - 分析
date: 2026-08-25
featured: false
draft: false
---

## 概述

平面向量場 $\mathbf{F}(x,y)=(P,Q)$ 在奇點附近呈現幾種典型圖樣：源（發散）、匯（收斂）、漩渦（旋轉）、鞍點（一進一出）。辨識這些圖樣有助於理解梯度場、旋度直覺與微分方程相圖。

## 參數方程

線性場示例（奇點在原點）：

$$
\mathbf{F}(x,y)=(ax-by,\; bx+ay)
$$

源：$a>0,b=0$；匯：$a<0$；漩渦：$a=0,b\neq0$；鞍點：$a>0,b<0$（對角符號相反）。

## 實作要點

- **圖樣選單**：源／匯／漩渦／鞍點／均勻流，切換解析式
- **箭頭網格**：規則格點繪製方向箭頭，長度可選歸一化或反映 $|\mathbf{F}|$
- **流線疊加**：可選積分短流線，連結向量場流線作品
- **奇點標記**：原點高亮並顯示 Jacobian 特徵值符號

## 相關連結

- 相關作品：[向量場流線](/works/vector-field-streamlines)、[向量投影與分解](/works/vector-projection)、[內積的幾何意義](/works/dot-product-geometry)

## 延伸閱讀

- [向量場（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%90%91%E9%87%8F%E5%A0%B4)
- [奇點（動力系統）](https://zh.wikipedia.org/zh-tw/%E5%A5%87%E9%BB%9E_(%E5%8B%95%E5%8A%9B%E7%B3%BB%E7%B5%B1)
