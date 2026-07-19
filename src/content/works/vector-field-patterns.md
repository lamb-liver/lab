---
title: 向量場的基本圖樣
description: 源、匯、漩渦、鞍點等典型向量場，建立方向場的幾何詞彙。
tags:
  - 函數與分析
date: 2026-05-26
order: 44
featured: false
draft: false
---

## 參數方程

平面向量場 $\mathbf{F}(x,y)=(P,Q)$ 在奇點附近呈現幾種典型圖樣：源（發散）、匯（收斂）、漩渦（旋轉）、鞍點（一進一出）。辨識這些圖樣有助於理解梯度場、旋度直覺與微分方程相圖。

線性場示例（奇點在原點）：

$$
\mathbf{F}_{\text{source}}=(x,y),\quad
\mathbf{F}_{\text{sink}}=(-x,-y),\quad
\mathbf{F}_{\text{vortex}}=(-y,x),\quad
\mathbf{F}_{\text{saddle}}=(x,-y)
$$

源與匯的兩個實特徵值同號；鞍點的兩個實特徵值異號；漩渦則以旋轉方向為主。

## 互動說明

- **源 source／匯 sink／漩渦 vortex／鞍點 saddle**：切換圖樣，觀察箭頭場的整體走向如何改變
- **歸一化箭頭**：切換箭頭長度是否反映 $|\mathbf{F}|$，比較方向與強度兩種讀法
- **流線疊加**：疊上積分出的短流線，把離散箭頭連成連續軌跡
- **密度 n**：調整格點密度，觀察取樣疏密如何影響圖樣的可讀性

## 相關作品

- [向量場流線](/works/vector-field-streamlines)
- [向量投影與分解](/works/vector-projection)
- [內積的幾何意義](/works/dot-product-geometry)

## 延伸閱讀

- [向量場（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%90%91%E9%87%8F%E5%A0%B4)
- [相圖（動態系統）（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%9B%B8%E5%9C%96_%28%E5%8B%95%E6%85%8B%E7%B3%BB%E7%B5%B1%29)
