---
title: 和的密度
description: 兩段互相獨立的均勻長度相加，密度從兩端降到零，中間留一段平頂。
tags:
  - 機率統計
concepts:
  - probability-distribution
audience: 大學概念
prerequisites:
  - 機率分佈
date: 2026-11-04
order: 81
featured: false
draft: false
---

## 參數方程

兩段長度各自在一段區間上均勻，而且互相獨立。第一段的長度範圍是 $[0,a]$，第二段是 $[0,b]$。$a$ 與 $b$ 都從 0.6 到 2.4。

把它們相加。和落在 $z$ 的密度，等於第一段區間與 $[z-b,z]$ 相交的長度，再除以 $ab$。這條密度從高度 0 升到較短那段的位置，中間保持高度 $1/\max(a,b)$，再降回高度 0，終點在 $a+b$。平頂的寬度是 $|a-b|$。

$$
\max f=\frac{1}{\max(a,b)}
$$

## 互動說明

- **長度 a**：改變第一段的長度，密度的底邊與平頂一起更新
- **長度 b**：改變第二段的長度，密度的底邊與平頂一起更新

## 觀察重點

- 和能出現的範圍，長度等於兩段長度相加。
- 密度的最高處等於較長那段的倒數。
- 兩段等長時平頂縮成一點，整條密度是一個三角形。

## 相關作品

- [二項分佈與幾何分佈](/works/binomial-geometric-distribution)
- [二項分佈到常態分佈](/works/binomial-to-normal)

## 延伸閱讀

- [連續型均勻分布（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%80%A3%E7%BA%8C%E5%9E%8B%E5%9D%87%E5%8B%BB%E5%88%86%E5%B8%83)
