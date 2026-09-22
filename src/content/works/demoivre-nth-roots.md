---
title: 棣美弗定理與 n 次方根
description: 拖動複數 z，觀察乘冪把幅角乘 n、方根把圓 n 等分。
tags:
  - 幾何
concepts:
  - complex-numbers
  - euler-formula
audience: 高中概念
prerequisites:
  - 複數
  - 極座標
date: 2026-09-22
order: 71
featured: false
draft: false
---

## 參數方程

把 $z$ 寫成極形式 $z=re^{i\theta}$ 後，乘冪與方根都只動兩件事：模長的乘方，以及幅角的倍數。

$$
\left(re^{i\theta}\right)^n=r^n e^{in\theta}
$$

這就是棣美弗定理。反過來，$w=re^{i\theta}$ 的 $n$ 次方根有 $n$ 個：

$$
\sqrt[n]{w}=r^{1/n}\exp\left(i\frac{\theta+2\pi k}{n}\right),\quad k=0,1,\ldots,n-1
$$

它們落在同一圓上，相鄰幅角差 $2\pi/n$。$k=0$ 的根對應主幅角；$w=0$ 時只有原點這一個根，幅角沒有定義。

## 互動說明

- **乘冪 zⁿ／方根**：切換看 $z,z^2,\ldots,z^n$ 的箭頭鏈，或 $w$ 的 $n$ 個方根
- **次數 n**：增加 $n$，觀察幅角如何乘倍，以及方根如何把圓更細地等分
- **拖動 z**：在複平面上移動 $z$（或被開方的 $w$），讀出模長與幅角如何改寫結果

## 觀察重點

- 乘冪把幅角乘 $n$、模長乘方； $|z|>1$ 時箭頭往外衝，$|z|<1$ 時往原點收。
- $w\neq 0$ 時，$n$ 個方根均勻分佈在半徑 $|w|^{1/n}$ 的圓上；把任一根再乘 $n$ 次，都會回到 $w$。
- 這與「兩複數相乘＝幅角相加」是同一件事：自乘 $n$ 次就是把同一個幅角加 $n$ 遍。

## 相關作品

- [複數的極座標形式](/works/complex-polar-form)
- [複數四則運算的幾何意義](/works/complex-arithmetic-geometry)
- [尤拉公式旋轉動畫](/works/euler-formula-rotation)
- [複數與尤拉公式](/explore/complex-euler-formula)

## 延伸閱讀

- [棣美弗公式（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%A3%B7%E8%8E%AB%E5%BC%97%E5%85%AC%E5%BC%8F)
- [單位根（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%96%AE%E4%BD%8D%E6%A0%B9)
