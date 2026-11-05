---
title: 最大值為 1 的參數
description: f(x) = (x+2)/(eˣ + a) 的最高點都落在 y = e^(−x) 上，最大值 1 只能出現在 x = 0，所以 a = 1。
subject: 高考數學
year: 2026
questionType: 單選
questionNo: '新課標I-6'
unit: 高考數學・新課標I卷・導數與最值
topics:
  - 導數求最值
  - 臨界點
  - 含參數函數
concepts:
  - derivative-tangent
  - exponential-logarithm
sourceUrl: https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34459.html
relatedExplore:
  - secants-and-tangents
relatedWorks:
  - function-derivative-graph
date: 2026-11-06
order: 29
coverImage: /images/exam-covers/gaokao-2026-i-max-value-parameter.png
featured: false
draft: false
---

## 題意

函數 $f(x)=\dfrac{x+2}{e^x+a}$ 的最大值為 1，求 $a$。選項是 $\tfrac12$、$1$、$\tfrac32$、$2$。

題幹來自考生回憶，見 [91 學的題目整理](https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34459.html)，另可對照 [lewang 的 2026 解答整理](https://gk2026math.lewang.dev/solutions)。

## 為什麼會錯

常見做法是令 $f(x)=1$ 解 $a$，但 $f(x)=1$ 只說明圖形碰到 $y=1$，不代表 1 是最大值。

另一種是把四個 $a$ 逐一代入求導，每個都要解超越方程 $(x+1)e^x=a$，解不出來就卡住。

## 觀念

$$
f'(x)=\frac{a-(x+1)e^x}{(e^x+a)^2}.
$$

$a>0$ 時分子 $a-(x+1)e^x$ 先正後負，只有一個臨界點 $x_0$，就是最大點，且 $a=(x_0+1)e^{x_0}$。代回去：

$$
f(x_0)=\frac{x_0+2}{e^{x_0}+(x_0+1)e^{x_0}}=e^{-x_0}.
$$

所以不論 $a$ 是多少，最高點都在曲線 $y=e^{-x}$ 上。最大值是 1 等於 $x_0=0$，$a=(0+1)e^0=1$。答案是 B。

## 互動怎麼看

- 拖參數 $a$：金色曲線的最高點沿著青色虛線 $y=e^{-x}$ 滑動。
- 側欄顯示 $x_0$ 與最大值，最大值一直等於 $e^{-x_0}$。
- 點四個選項，只有 B 的最高點碰到虛線 $y=1$。
