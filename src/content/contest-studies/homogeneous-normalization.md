---
title: 齊次化與標準化
description: 先看次數，再把上界改寫成三次式；最後在比例三角形中找等號。
domain: 代數
methods:
  - 齊次化
  - 共同縮放
  - 標準化
difficulty: 中階
estimatedMinutes: 20
source:
  contest: 全國高中數學聯賽廣東省預賽
  year: 2010
  problemNo: "3"
prerequisites:
  - 基本不等式
  - 三元對稱式
relatedWorks: []
relatedExplore: []
date: 2026-08-02
order: 1
coverImage: /images/contest-covers/homogeneous-normalization.png
featured: false
draft: true
---

## 母題

設 $a,b,c\ge0$，且

$$
a+b+c=1.
$$

證明：

$$
9abc\le ab+bc+ca\le\frac{1+9abc}{4}.
$$

先看上界。它可以寫成 $4q\le1+9r$，但 $q$、$1$、$r$ 的次數不同；接下來先處理這件事，再回到 $a+b+c=1$ 的比例三角形找等號。

記

$$
s=a+b+c,\qquad q=ab+bc+ca,\qquad r=abc.
$$

## 互動說明

- **看次數**：比較 $q$、$1$、$r$ 的次數，找出原式不齊次的地方。
- **補回次數**：用 $s=1$ 把上界改寫成每一項都是三次的形式。
- **只改大小**：調整 $t$，比較 $s$、$q$、$r$ 與兩個差值如何縮放。
- **看比例三角形**：拖曳比例點、微調 $a,b$ 或切換圖層，觀察等號位置。

## 看次數

上界先寫成

$$
4q\le1+9r.
$$

$q$ 是二次，$1$ 是零次，$r$ 是三次。這三個量的次數不同，所以現在還看不出三次不等式的形狀。

## 補回次數

題目給 $s=1$。乘上一個不改變數值的 $1$，就能補回缺少的次數：

$$
1=s^3,\qquad q=sq.
$$

因此上界變成

$$
4sq\le s^3+9r.
$$

現在兩邊每一項都是三次。令

$$
G=s^3+9r-4sq,
$$

問題就變成看 $G$ 是否非負。

## 只改大小

把三個數一起乘上 $t>0$：

$$
(a,b,c)\longmapsto(ta,tb,tc).
$$

比例 $a:b:c$ 沒有改變；只有次數不同的量按照自己的次數放大：

$$
s\mapsto ts,\qquad q\mapsto t^2q,\qquad r\mapsto t^3r.
$$

$G$ 是三次式，所以

$$
G\mapsto t^3G.
$$

因此共同縮放只改變大小，不改變正負，也不改變等號所在的比例。

## 看比例三角形

把每一組非負比例縮放到

$$
a+b+c=1.
$$

這個平面截面是一個三角形：

- 三個頂點分別是 $(1,0,0)$、$(0,1,0)$、$(0,0,1)$。
- 中心是 $(1/3,1/3,1/3)$。
- 三個邊中點是兩個變數相等、另一個變數為 0。

畫面中的每一個點就是一組 $(a,b,c)$。選擇不同圖層，只看一個量：

$$
q=ab+bc+ca,\qquad r=abc,
$$

或看兩個差值：

$$
G_{\mathrm{lower}}=q-9r,\qquad
G_{\mathrm{upper}}=1+9r-4q.
$$

上界的等號在中心與三個邊中點；下界的等號在中心與三個頂點。

## 最後才看證明

上界的齊次式就是三次舒爾不等式。由對稱性，設 $a\ge b\ge c$：

$$
\begin{aligned}
G
&=a(a-b)(a-c)+b(b-c)(b-a)+c(c-a)(c-b)\\
&=(a-b)^2(a+b-c)+c(a-c)(b-c)\ge0.
\end{aligned}
$$

代回 $s=1$，便得到

$$
ab+bc+ca\le\frac{1+9abc}{4}.
$$

下界只需用兩次 AM-GM：

$$
s\ge3\sqrt[3]{r},\qquad q\ge3\sqrt[3]{r^2},
$$

所以 $sq\ge9r$；再用 $s=1$，得到 $q\ge9r$。
