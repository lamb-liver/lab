---
title: 組合的路徑計數
description: 格點上只能向右或向上時，從原點到 (m,n) 的路徑數為 C(m+n,m)。
tags:
  - 組合數學
date: 2026-05-26
order: 31
featured: false
draft: false
---

## 參數方程

在 $m\times n$ 矩形格中，每步僅向右或向上，從左下到右上共有 $\binom{m+n}{m}$ 條最短路徑。動畫可逐條或按層累加路徑，並與帕斯卡三角形、卡特蘭路徑對照。

路徑數：

$$
N(m,n)=\binom{m+n}{m}=\binom{m+n}{n}
$$

遞迴（到達 $(i,j)$ 的路徑數）：

$$
P(i,j)=P(i-1,j)+P(i,j-1),\quad P(0,0)=1
$$

## 互動說明

- **格點繪製**：$m,n$ 滑桿決定網格尺寸，節點顯示累積路徑數
- **單一路徑動畫**：隨機或依序 highlight 一條 R/U 序列
- **全路徑疊加**：半透明繪製全部路徑，密度呈二項分佈形狀
- **與二項式連結**：標註 $\binom{m+n}{m}$ 與帕斯卡三角形第 $m+n$ 行

## 相關作品

- [帕斯卡三角形](/works/pascals-triangle)
- [二項式展開的幾何意義](/works/binomial-expansion-geometry)
- [卡特蘭數](/works/catalan-numbers)

## 延伸閱讀

- [組合數學（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%B5%84%E5%90%88%E6%95%B8%E5%AD%B8)
