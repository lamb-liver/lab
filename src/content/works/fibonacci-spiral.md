---
title: 費波那契螺線
description: 以費波那契正方形與四分之一圓弧拼合的對數螺線近似。
tags:
  - 幾何
date: 2026-05-26
order: 9
featured: false
draft: false
---

## 參數方程

費波那契數列 $F_n$ 滿足 $F_n=F_{n-1}+F_{n-2}$。以邊長 $F_n$ 的正方形螺旋排列，並在各角繪製四分之一圓，可得逼近對數螺線的經典幾何構造。

遞迴：

$$
F_1=1,\; F_2=1,\; F_n = F_{n-1}+F_{n-2}
$$

螺線段可參數化為逐段四分之一圓弧的拼接；極限比例 $\displaystyle\lim_{n\to\infty}\frac{F_{n+1}}{F_n}=\varphi=\frac{1+\sqrt5}{2}$。

## 互動說明

- **項數控制**：滑桿決定顯示至第 $n$ 個費波那契方格
- **黃金矩形標示**：標出相鄰邊長比趨近 $\varphi$ 的關係

## 觀察重點

- 相鄰正方形的邊長依序形成 $1,1,2,3,5,\dots$，螺線每段都跨過一個四分之一圓。
- 右側比例點列逐步靠近 $\varphi$，可對照黃金矩形的長寬比。
- 藍色低權重曲線是對數螺線參考，金色拼接弧則是費波那契近似。

## 相關作品

- [等差等比數列的幾何視覺](/works/arithmetic-geometric-sequences)
- [等角螺線](/works/equiangular-spiral)
- [巴塞爾問題](/works/basel-problem)

## 延伸閱讀

- [費波那契數（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%96%90%E6%B3%A2%E9%82%A3%E5%A5%87%E6%95%B8)
- [黃金矩形（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%BB%83%E9%87%91%E7%9F%A9%E5%BD%A2)
