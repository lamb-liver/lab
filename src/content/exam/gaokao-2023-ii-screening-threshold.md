---
title: '疾病篩檢的臨界值：漏診與誤診'
description: '指標大於 c 判為陽性。c 往右移，漏診變多、誤診變少，兩者的總和是一個 V 形，在 c = 100 最小。'
subject: 高考數學
year: 2023
questionType: 非選
questionNo: '新課標II-19'
unit: 高考數學・新課標II卷・統計
topics:
  - 頻率分布直方圖
  - 漏診率與誤診率
  - 分段函數最值
concepts:
  - descriptive-statistics
sourceUrl: https://gaokaohub.com/q/item/241545079804183.html
relatedExplore:
  - data-analysis
relatedWorks:
  - percentile-box-plot
date: 2026-11-05
order: 24
coverImage: /images/exam-covers/gaokao-2023-ii-screening-threshold.png
featured: false
draft: false
---

## 題意

題目給出患病者和未患病者某項指標的頻率分布直方圖，指標大於臨界值 $c$ 就判為陽性。漏診率 $p(c)$ 是患病者被判為陰性的比例，誤診率 $q(c)$ 是未患病者被判為陽性的比例。

第一問：漏診率是 0.5% 時，求 $c$ 和誤診率。第二問：$c\in[95,105]$ 時，求 $f(c)=p(c)+q(c)$ 的解析式和最小值。

題幹來自考生回憶，見 [高考題庫的題目整理](https://gaokaohub.com/q/item/241545079804183.html)，另可對照 [91阿普的解析](https://www.91apu.cn/shuxue/gkt/2023/2023xgk2/2023-07-08/33659.html)。

## 為什麼會錯

最常見的錯是把直方圖的高度當成比例。直方圖的縱軸是頻率除以組距，比例要用「高度乘寬度」。

第二問容易只寫一條直線。$c$ 跨過 100 時，兩組直方圖的高度都換了，所以 $f(c)$ 是分段的。

## 觀念

在 $[95,105]$ 內，患病者的頻率/組距是 $0.002$（95 到 100）、$0.012$（100 到 105）；未患病者是 $0.01$ 和 $0.002$。

第一問：$(c-95)\times0.002=0.005$，得 $c=97.5$。誤診率 $q=(100-97.5)\times0.01+5\times0.002=0.035$，即 3.5%。

第二問：

$$
f(c)=\begin{cases}-0.008c+0.82,&95\le c\le100\\0.01c-0.98,&100<c\le105\end{cases}
$$

左段遞減、右段遞增，最小值是 $f(100)=0.02$。

## 互動怎麼看

- 拖「臨界值 c」：上面兩格是兩組直方圖在 95 到 105 之間的部分，實色是被判錯的人。
- 患病者實色在 c 左邊，未患病者實色在 c 右邊。c 往右，金色變多、青色變少。
- 最下面是 $f(c)$。c 過了 100，金色長得比青色減得快，總和開始上升。
