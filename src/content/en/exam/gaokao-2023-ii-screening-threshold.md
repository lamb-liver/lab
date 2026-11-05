---
title: 'Screening cut-off: misses and false alarms'
description: 'A reading above c counts as positive. Moving c right means more missed patients and fewer false alarms; their sum is V-shaped with its minimum at c = 100.'
subject: 高考數學
year: 2023
questionType: 非選
questionNo: '新課標II-19'
unit: Gaokao Mathematics, New Curriculum II, statistics
topics:
  - Frequency histograms
  - Miss and false positive rates
  - Piecewise minimum
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

## The problem

The problem gives frequency histograms of a medical index for patients and for healthy people. A reading above the cut-off $c$ counts as positive. The miss rate $p(c)$ is the share of patients judged negative; the false positive rate $q(c)$ is the share of healthy people judged positive.

Part 1: with a miss rate of 0.5%, find $c$ and the false positive rate. Part 2: for $c\in[95,105]$, find $f(c)=p(c)+q(c)$ and its minimum.

The wording comes from candidate recall; see the [gaokaohub write-up](https://gaokaohub.com/q/item/241545079804183.html), and compare the [91apu solution](https://www.91apu.cn/shuxue/gkt/2023/2023xgk2/2023-07-08/33659.html).

## Why students get it wrong

The usual slip is to read the bar height as a proportion. The vertical axis is frequency divided by bin width, so a proportion is height times width.

In Part 2 it is easy to write a single line. When $c$ crosses 100 both histograms change height, so $f(c)$ is piecewise.

## The idea

On $[95,105]$, patients have frequency/width $0.002$ (95 to 100) and $0.012$ (100 to 105); healthy people have $0.01$ and $0.002$.

Part 1: $(c-95)\times0.002=0.005$ gives $c=97.5$. Then $q=(100-97.5)\times0.01+5\times0.002=0.035$, i.e. 3.5%.

Part 2:

$$
f(c)=\begin{cases}-0.008c+0.82,&95\le c\le100\\0.01c-0.98,&100<c\le105\end{cases}
$$

The left piece falls and the right piece rises, so the minimum is $f(100)=0.02$.

## How to read the figure

- Drag the cut-off c. The top two panels show the histograms between 95 and 105; solid colour marks people judged wrongly.
- Patients are shaded left of c, healthy people right of c. Moving c right grows the gold and shrinks the cyan.
- The bottom panel is $f(c)$. Past 100 the gold grows faster than the cyan shrinks, so the total rises.
