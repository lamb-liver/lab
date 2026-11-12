---
title: 變號點重合
description: 兩個變號點重合時函數才不為負，原點到這條直線的距離平方最小是 1/2。
subject: 高考數學
year: 2024
questionType: 單選
questionNo: '新課標II-8'
unit: 高考數學・新課標II卷・指數與對數
topics:
  - 變號點
  - 點到直線的距離
concepts:
  - exponential-logarithm
sourceUrl: https://zhuanlan.zhihu.com/p/702452436
relatedExplore:
  - exponential-logarithm
relatedWorks:
  - natural-log-e-geometry
date: 2026-11-11
order: 33
coverImage: /images/exam-covers/gaokao-2024-ii-log-sign-line.png
featured: false
draft: false
---

## 題意

$(x+a)\ln(x+b)$ 在整個定義域上不為負。兩個因式變號的位置必須相同，點 $(a,b)$ 落在直線 $b-a=1$ 上。$a^{2}+b^{2}$ 是原點到這個點的距離平方，最小值是 $\dfrac{1}{2}$。

題幹來自考生回憶，見 [知乎上的全卷整理](https://zhuanlan.zhihu.com/p/702452436)，另可對照 [Math173 的解析](http://lanqi.org/everyday/36028/)。

## 為什麼會錯

圓和這條直線相切於垂足。圓內的點離原點更近，距離平方小於 $\dfrac{1}{2}$，但它們不在直線上。一次因式和對數變號的位置分開，中間有一段函數值是負的。

## 觀念

記 $f(x)=(x+a)\ln(x+b)$，定義域是 $x>-b$。一次因式在 $x=-a$ 變號，對數在 $x=1-b$ 變號。

兩處重合時 $-a=1-b$，即 $b=a+1$。令 $t=x+b>0$，則

$$
f(x)=(t-1)\ln t.
$$

$t>1$ 時兩因式都是正的，$0<t<1$ 時兩因式都是負的，所以 $f(x)\ge 0$。

直線 $b-a-1=0$ 到原點的距離是 $\dfrac{1}{\sqrt{2}}$，距離平方是 $\dfrac{1}{2}$。垂足是 $a=-\dfrac{1}{2}$，$b=\dfrac{1}{2}$。

## 互動怎麼看

- 拖「離開直線」：白點沿垂線移動。金線是 $b=a+1$，圓與金線相切於垂足。
- 偏移停在 0：距離平方讀成 $\dfrac{1}{2}$。函數圖上兩個變號點疊在一起，曲線不降到橫軸下方。
- 往原點拖：白點進入圓內，距離平方小於 $\dfrac{1}{2}$，變號點分開，中間是負的。
