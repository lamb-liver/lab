---
title: 一條直線截三個單位圓
description: 三個單位圓的圓心排成正三角形，直線截出三條弦。弦等長就是三圓心等距，過原點時弦長和是一個變數的函數。
subject: 高考數學
year: 2026
questionType: 多選
questionNo: '新課標I-11'
unit: 高考數學・新課標I卷・直線與圓
topics:
  - 點到直線距離
  - 弦長
  - 最大值
concepts:
  - conic-sections
  - derivative-tangent
sourceUrl: https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34464.html
relatedExplore:
  - conic-dynamic-geometry
relatedWorks: []
date: 2026-11-06
order: 27
coverImage: /images/exam-covers/gaokao-2026-i-three-circles-chords.png
featured: false
draft: false
---

## 題意

三個半徑 1 的圓，圓心 $C_1(-1,0)$、$C_2(1,0)$、$C_3(0,\sqrt3)$。直線 $l:y=kx+b$ 和三個圓都有兩個交點，截得弦長 $s_1,s_2,s_3$。判斷四個敘述：

- A. $k$ 可以取任意實數。
- B. 滿足 $s_1=s_2=s_3$ 的 $l$ 共有 3 條。
- C. 滿足 $s_1+s_2+s_3=3$ 的 $l$ 多於 3 條。
- D. $b=0$ 時，$s_1+s_2+s_3$ 的最大值是 $\tfrac{2\sqrt{21}}{3}$。

題幹來自考生回憶，見 [91 學的題目整理](https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34464.html)，另可對照 [良師寶的解析](https://liangshibao.com/tiku/gaokao-math-2026-i/multiple-11)。良師寶版本的 C 寫成和為 1，91 學與 lewang 的整理是 3；兩種寫法下 C 都成立，答案不變。

## 為什麼會錯

A 容易直接判對：直線總能平移到穿過三個圓的位置。但斜率是 $\pm\tfrac{\sqrt3}{3}$ 時，直線垂直於 $C_1C_3$ 或 $C_2C_3$，那兩個圓心沿法向相距 2，直線不可能離兩者都小於 1。

B 常漏掉水平那條，只找到過原點的兩條，或者把過頂點的三條中線都算進去。

## 觀念

弦長 $s_i=2\sqrt{1-d_i^2}$，$d_i$ 是圓心到 $l$ 的距離，弦等長等於距離相等：

$$
|{-k}+b|=|k+b|=|b-\sqrt3|.
$$

前一個等式給 $k=0$ 或 $b=0$。$k=0$ 時 $b=\tfrac{\sqrt3}{2}$；$b=0$ 時 $k=\pm\sqrt3$。共 3 條，B 對。

$b=0$ 時令 $t=\tfrac{1}{\sqrt{1+k^2}}$，$0<t<\tfrac{1}{\sqrt3}$，

$$
s_1+s_2+s_3=f(t)=4t+2\sqrt{1-3t^2}.
$$

$f(t)=3$ 化成 $28t^2-24t+5=0$，$t=\tfrac12$ 或 $\tfrac{5}{14}$，對應 $k=\pm\sqrt3$、$\pm\tfrac{\sqrt{171}}{5}$，至少 4 條，C 對。$f'(t)=0$ 在 $t=\tfrac{2}{\sqrt{21}}$，最大值 $\tfrac{2\sqrt{21}}{3}$，D 對。答案是 BCD。

## 互動怎麼看

- 拖 $k$、$b$：上方畫出三條弦，虛線是圓心到直線的垂線。側欄顯示三個弦長與和。
- 「等長 1–3」三個按鈕是 B 的三條直線。「k = √3/3」示範 A：怎麼調 $b$ 都至少有一個圓截不到。
- 下方曲線是 $b=0$ 時弦長和對 $k$ 的圖，虛線是 3 與最大值。「和為 3」與「b = 0 最大」對應 C、D。
