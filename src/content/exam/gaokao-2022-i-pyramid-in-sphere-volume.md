---
title: '球內正四角錐的體積範圍'
description: '側稜長 l 在 [3, 3√3] 內變動時，體積最大不在端點，而在 h = 4 的中間點。'
subject: 高考數學
year: 2022
questionType: 單選
questionNo: '新課標I-8'
unit: 高考數學・新課標I卷・立體幾何
topics:
  - 外接球
  - 體積最值
  - 導數求極值
concepts:
  - derivative-tangent
sourceUrl: https://gaokaohub.com/q/item/17329642544376.html
relatedExplore:
  - secants-and-tangents
relatedWorks:
  - function-derivative-graph
date: 2026-11-05
order: 22
coverImage: /images/exam-covers/gaokao-2022-i-pyramid-in-sphere-volume.png
featured: false
draft: false
---

## 題意

一個正四角錐的頂點都在同一個球面上，球的體積是 $36\pi$，所以半徑 $R=3$。側稜長 $l$ 的範圍是 $[3,3\sqrt3]$，求這個正四角錐體積的範圍。

題幹來自考生回憶，見 [高考題庫的題目整理](https://gaokaohub.com/q/item/17329642544376.html)，另可對照 [良師寶的解析](https://liangshibao.com/tiku/gaokao-math-2022-i/single-8)。

## 為什麼會錯

最常見的錯是把兩個端點 $l=3$、$l=3\sqrt3$ 的體積當成最小值和最大值，得到 $[27/4,81/4]$。這是錯誤選項之一。

體積對 $l$ 不是單調的。$l$ 變長，錐變高，但底面在球面上會往下縮，到某個長度之後底面縮得比高度長得快。

## 觀念

設高為 $h$。頂點在球的最上方，底面四角也在球面上，由軸截面的直角關係得 $l^2=2Rh=6h$，所以

$$
h=\frac{l^2}{6},\qquad \text{底面對角線的一半}=\sqrt{l^2-h^2}.
$$

底面積是對角線一半的平方乘 2，於是

$$
V=\frac13\cdot 2\left(l^2-h^2\right)h=\frac13\cdot 2(6h-h^2)h=\frac23(6h^2-h^3),\qquad h\in\left[\tfrac32,\tfrac92\right].
$$

$V'(h)=\tfrac23(12h-3h^2)$，在 $h=4$（$l=2\sqrt6$）取最大值 $64/3$。端點 $h=3/2$ 時 $V=27/4$，$h=9/2$ 時 $V=81/4<64/3$。答案是 C：$[27/4,\,64/3]$。

## 互動怎麼看

- 拖「側稜長 l」：左邊是球和正四角錐的軸截面，右邊是體積 $V(l)$ 的曲線。
- 看金色點在曲線上爬升到 $l=2\sqrt6$ 之後開始下降，右端點比頂點低。
- 青色帶是答案的範圍。上緣是頂點 $64/3$，不是右端點 $81/4$。
