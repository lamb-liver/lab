---
title: 乘冪與方根
description: 同一個幅角加法，在相乘、自乘 n 次與 n 等分開方中反覆出現。
category: 代數
concepts:
  - complex-numbers
  - euler-formula
audience: 高中概念
prerequisites:
  - 複數
  - 極座標
date: 2026-09-22
order: 22
coverImage: /images/explore-covers/complex-powers-roots.png
featured: false
draft: false
---

## 基本概念

複數乘法把兩支箭頭的幅角相加、模長相乘。把「乘上同一個 $z$」做 $n$ 遍，幅角就加 $n$ 次，這是乘冪；把這個動作倒過來，就是把圓 $n$ 等分成方根。

$$
z_1 z_2 \;\longleftrightarrow\; \bigl(re^{i\theta}\bigr)^n \;\longleftrightarrow\; \sqrt[n]{w}
$$

本頁不重講極形式或尤拉公式本身，而是讓同一條幅角規則在三種操作裡換角色：乘別人、乘自己、開方。單件公式與拖點細節留給下方作品。

## 互動說明

- **乘法**：拖動 $z_1$、$z_2$，看乘積的幅角是否為兩者之和
- **乘冪**：切換到同一個 $z$ 的 $z,z^2,\ldots,z^n$，對照幅角乘 $n$
- **方根**：觀察 $n$ 個方根如何把圓等分；把任一根再乘 $n$ 次會回到原來的 $w$
- **次數 n**：只在乘冪／方根出現；調整 $n$ 會讓等分更細、乘冪轉得更急

建議順序：乘法 → 乘冪 → 方根。

## 觀察重點

- 三種讀法都在做同一件事：幅角相加、模長相乘；差別只在加的是「別人的角」還是「自己的角加 n 遍」。
- 乘冪把同一條規則連做 $n$ 次，點沿輻射方向走；開方是倒過來，把一次旋轉拆成 $n$ 等分。
- 乘法、乘冪、開方可以互相還原：開方再乘回去會回到出發點，三種畫面讀的是同一條幅角規則的正反方向。

## 相關作品

- [棣美弗定理與 n 次方根](/works/demoivre-nth-roots)
- [複數四則運算的幾何意義](/works/complex-arithmetic-geometry)
- [複數的極座標形式](/works/complex-polar-form)
- [尤拉公式旋轉動畫](/works/euler-formula-rotation)
- [複數與尤拉公式](/explore/complex-euler-formula)

## 延伸閱讀

- [棣美弗公式（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%A3%B7%E8%8E%AB%E5%BC%97%E5%85%AC%E5%BC%8F)
- [單位根（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%96%AE%E4%BD%8D%E6%A0%B9)
