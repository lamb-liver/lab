---
title: 三個對數等式的大小順序
description: 2 + log₂x = 3 + log₃y = 5 + log₅z 時，取對數後是三條直線，交點決定哪種順序永遠不會出現。
subject: 高考數學
year: 2025
questionType: 單選
questionNo: '新課標I-8'
unit: 高考數學・新課標I卷・指數與對數
topics:
  - 共同參數
  - 指數函數成長速度
  - 對數比大小
concepts:
  - exponential-logarithm
sourceUrl: https://zy.21cnjy.com/23151851
relatedExplore:
  - exponential-logarithm
relatedWorks:
  - logarithmic-scale
date: 2026-11-05
order: 19
coverImage: /images/exam-covers/gaokao-2025-i-log-offset-order.png
featured: false
draft: false
---

## 題意

實數 $x,y,z$ 滿足 $2+\log_2 x=3+\log_3 y=5+\log_5 z$。四個選項各給一種由大到小的順序，要找出不可能成立的那一種。

題幹來自考生回憶，見 [21世紀教育網的全卷整理](https://zy.21cnjy.com/23151851)。

## 為什麼會錯

最常見的做法是代幾個特殊值。代到的順序確實可能，但沒代到的不一定不可能，只靠試值容易選錯。

另一個陷阱是以為底數越大的數越大。$k$ 小的時候剛好相反，$x$ 最大、$z$ 最小。

## 觀念

設共同值為 $k$，則

$$
x=2^{k-2},\quad y=3^{k-3},\quad z=5^{k-5}.
$$

取自然對數，$\ln x=(k-2)\ln 2$、$\ln y=(k-3)\ln 3$、$\ln z=(k-5)\ln 5$，三條都是 $k$ 的直線，斜率依序變大。兩兩相交於 $k\approx 4.71$（$x=y$）、$k\approx 7.27$（$x=z$）、$k\approx 9.30$（$y=z$），把 $k$ 軸切成四段：

$$
x>y>z,\quad y>x>z,\quad y>z>x,\quad z>y>x.
$$

$x>z>y$ 要求 $x$ 已經被 $y$ 超過之前就先超過 $z$，但 $x=z$ 發生在 $x=y$ 之後，所以不可能。答案是 B。

## 互動怎麼看

- 拖「共同值 k」：三個點沿著 $\ln x$、$\ln y$、$\ln z$ 三條直線移動，側欄同步顯示 $x,y,z$ 的近似值。
- 經過每個交點，順序換一次。四段的順序寫在橫軸下方。
- 側欄的四個選項會標出哪幾種順序會出現。整條 $k$ 軸都拖過一遍，B 都不會亮。
