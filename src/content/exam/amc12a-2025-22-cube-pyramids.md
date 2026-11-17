---
title: 三塊錐體合起來的機率
description: 2025 AMC 12A 第22題：只算一塊錐體是 1/12，三塊合起來機率才是 1/4。
subject: AMC 12A
year: 2025
questionType: 單選
questionNo: '22'
unit: AMC 12・幾何機率
topics:
  - 幾何機率
  - 錐體體積
concepts:
  - classical-probability
  - space-vectors
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2025_AMC_12A_Problems/Problem_22
relatedExplore:
  - probability-statistics
  - space-vectors-planes-lines
relatedWorks:
  - space-vector-three-plane-projection
date: 2026-11-17
order: 39
coverImage: /images/exam-covers/amc12a-2025-22-cube-pyramids.png
featured: false
draft: false
---

## 題意

三個實數各自獨立、均勻地從 $[0,1]$ 取出。最大的那個大於另外兩個的兩倍，機率是多少？把三個數由大到小排成 $a\ge b\ge c$，條件就是 $a>2b$。五選一。

完整題目與選項見 [AoPS 題目頁](https://artofproblemsolving.com/wiki/index.php/2025_AMC_12A_Problems/Problem_22)。

## 為什麼會錯

- 只算「$x$ 是最大」的那一塊，體積 $\frac{1}{12}$，就停下來。$y$、$z$ 當最大時各有一塊同樣大的錐體。三塊的交集體積是 $0$，機率是 $3\times\frac{1}{12}=\frac14$。$\frac{1}{12}$ 是選項 (A)。
- 把另外兩個數都當成在 $\left[0,\frac12\right]$ 裡均勻取出、跟上界無關，會得到 $\frac18$。實際上上界是「最大的那個的一半」，而且三塊都要算。
- 底是正方形，就把它當成正四角錐，以為高一定要落在底面中心才可以用體積公式。這裡錐尖在原點，垂足落在正方形的一角。體積仍然是 $\frac13\times$ 底面積 $\times$ 高。

## 觀念

三個數是單位正立方體裡的點 $(x,y,z)$，每個點一樣可能出現，所以機率就是區域的體積。

$x$ 嚴格最大、而且 $x>2y$、$x>2z$，等同

$$
0\le x\le 1,\qquad 0\le y<\frac x2,\qquad 0\le z<\frac x2.
$$

固定 $x=t$ 時，截面是邊長 $\frac t2$ 的正方形。$t$ 從 $0$ 增到 $1$，這是一個錐體：底在平面 $x=1$ 上，是邊長 $\frac12$ 的正方形，面積 $\frac14$；高是 $1$。

$$
\frac13\times\frac14\times 1=\frac{1}{12}.
$$

$y$ 最大、$z$ 最大各有一塊。一個點不能同時落進兩塊：例如它已在 $x$ 那一塊，則 $y<\frac x2<x$，所以 $y$ 不是最大。三塊合起來體積 $\frac14$，選 (E)。

（把截面積 $\left(\frac t2\right)^2$ 從 $0$ 積到 $1$ 也得到 $\frac{1}{12}$。這一步是定積分，超出高中數學的學習內容；錐體體積公式就夠了。）

## 互動怎麼看

- 畫面先只留 $x$ 最大的那一塊，讀數是 $\frac{1}{12}$。點選「補上另外兩塊」，藍、紫兩塊出現，讀數變成 $\frac14$。
- 滑桿 $x$、$y$、$z$ 移動樣本點。點進某一塊才算條件成立；按「放在三塊外面」會看到正立方體裡大片空白都不算。
- 只留一塊時，把 $y$ 或 $z$ 調成最大：條件可以成立，但那一塊不在畫面上。
