---
title: 三次取球裡出現幾顆不同的球
description: 有放回地取三次，數出現過的球。每顆球一個指示變數，期望值相加，不必列分佈。
subject: 高考數學
year: 2025
questionType: 選填
questionNo: '新課標I-14'
unit: 高考數學・新課標I卷・離散型隨機變數
topics:
  - 指示變數
  - 期望值的線性性質
  - 餘事件
concepts:
  - expected-value
  - classical-probability
sourceUrl: https://zy.21cnjy.com/23151851
relatedExplore:
  - discrete-random-variables
relatedWorks:
  - binomial-geometric-distribution
date: 2026-11-05
order: 20
coverImage: /images/exam-covers/gaokao-2025-i-distinct-balls-expectation.png
featured: false
draft: false
---

## 題意

箱子裡有 5 個球，標號 1 到 5。有放回地取三次，$X$ 是至少被取到一次的球的個數，求 $E(X)$。

題幹來自考生回憶，見 [21世紀教育網的全卷整理](https://zy.21cnjy.com/23151851)。

## 為什麼會錯

$X$ 數的是出現過的球，不是取的次數。取到 $2,2,5$ 時 $X=2$。

列分佈時容易把 $X=2$ 的情形算漏：要先選兩顆球，再扣掉三次全是同一顆的情形。

算「某顆球被取到」時，寫成 $3\times\tfrac15$ 會把重複取到的情形算兩次，應該用餘事件。

## 觀念

替每顆球設一個指示變數 $I_i$，第 $i$ 號球至少出現一次時 $I_i=1$，否則為 $0$。$X=I_1+\cdots+I_5$。

$$
P(I_i=1)=1-\left(\tfrac45\right)^3=\tfrac{61}{125}.
$$

期望值可以相加，不需要 $I_i$ 彼此獨立：

$$
E(X)=5\cdot\tfrac{61}{125}=\tfrac{61}{25}.
$$

列分佈核對：$P(X=1)=\tfrac{5}{125}$、$P(X=2)=\tfrac{60}{125}$、$P(X=3)=\tfrac{60}{125}$，加權和也是 $\tfrac{61}{25}$。

## 互動怎麼看

- 按「抽一輪」：取三次，出現過的球亮燈，亮燈數就是這一輪的 $X$。
- 按「抽 100 輪」或「抽 1000 輪」：每顆球的長條趨近虛線 $\tfrac{61}{125}$，$X$ 的平均趨近 $\tfrac{61}{25}=2.44$。
- 五條長條加起來就是 $X$ 的平均。這就是期望值的線性性質。
