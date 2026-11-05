---
title: 一百零八塔的等差分組
description: 12 列塔的座數兩兩分組，組和要成等差數列。奇偶與首項為正兩道條件，把公差限定為 4。
subject: 高考數學
year: 2026
questionType: 單選
questionNo: '新課標I-7'
unit: 高考數學・新課標I卷・數列
topics:
  - 等差數列
  - 奇偶性
  - 分組配對
concepts:
  - sequences-series
sourceUrl: https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34460.html
relatedExplore:
  - sequences-and-series
relatedWorks:
  - arithmetic-geometric-sequences
date: 2026-11-06
order: 26
coverImage: /images/exam-covers/gaokao-2026-i-tower-pairing.png
featured: false
draft: false
---

## 題意

一百零八塔共 12 列，各列座數是 1、3、3、5、5、7、9、11、13、15、17、19，總和 108。把 12 個數兩兩分成 6 組，6 個組和由小到大恰成公差 $d>0$ 的等差數列。四個選項是 $d=2,4,6,8$，要選出 $d$。

題幹來自考生回憶，見 [91 學的題目整理](https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34460.html)，另可對照 [lewang 的 2026 解答整理](https://gk2026math.lewang.dev/solutions)。

## 為什麼會錯

直接動手配對，12 個數的配法太多，配不出來時分不清是 $d$ 不對還是自己沒找到。

另一個錯是只用 $b_1+b_6=36$ 推出 $d$ 是偶數，就在 2、4、6 之間猜。偶數還不夠，組和本身也有限制。

## 觀念

設組和為 $b_1<\dots<b_6$，總和 $6b_1+15d=108$，所以

$$
b_1=18-\tfrac{5d}{2}.
$$

每個數都是奇數，奇數加奇數是偶數，6 個組和都是偶數。$b_1$ 是偶數要求 $\tfrac{5d}{2}$ 是偶數，$d$ 是 4 的倍數。再由 $b_1>0$ 得 $d<7.2$，只剩 $d=4$。

$d=4$ 時組和是 8、12、16、20、24、28，配得出來，例如 $3+5$、$3+9$、$5+11$、$1+19$、$7+17$、$13+15$。答案是 B。

## 互動怎麼看

- 點四個 $d$：圖上 6 條虛框是目標組和，有問題的組和會標出原因，例如奇數或不是正數。
- 只有 $d=4$ 會填入配對。每條分兩段，金色、青色是兩列的座數，總長就是組和。
- 點「換一種配法」看其他配對。下方 12 個數用掉的會變暗。
