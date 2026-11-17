---
title: '稜長 1 的正立方體裝得下哪些物體'
description: '球、正四面體、細長圓柱、扁圓盤，各自對應正立方體裡一條最長的方向：稜、面對角線、體對角線、正六邊形截面。'
subject: 高考數學
year: 2023
questionType: 多選
questionNo: '新課標I-12'
unit: 高考數學・新課標I卷・立體幾何
topics:
  - 正立方體內的最長方向
  - 內接正四面體
  - 正六邊形截面
concepts:
  - space-vectors
sourceUrl: https://gaokaohub.com/q/item/113402010356853.html
relatedExplore:
  - space-vectors-planes-lines
relatedWorks:
  - plane-normal-distance
date: 2026-11-05
order: 23
coverImage: /images/exam-covers/gaokao-2023-i-cube-container.png
featured: false
draft: false
---

## 題意

把一個稜長 1 的正立方體當作容器（壁厚不計），判斷四種物體能不能整個放進去：直徑 0.99 的球、稜長 1.4 的正四面體、底面直徑 0.01 且高 1.8 的圓柱、底面直徑 1.2 且高 0.01 的圓柱。

題幹來自考生回憶，見 [高考題庫的題目整理](https://gaokaohub.com/q/item/113402010356853.html)，另可對照 [良師寶的解析](https://liangshibao.com/tiku/gaokao-math-2023-i/multiple-12)。

## 為什麼會錯

看到 1.4、1.8、1.2 都超過稜長 1，容易判斷放不進。但正立方體裡比稜長長的方向有三條：面對角線 $\sqrt2$、體對角線 $\sqrt3$，還有斜切出的正六邊形截面。

另一個錯是反過來，以為 1.8 小於 2 就放得進。體對角線只有 $\sqrt3\approx1.732$。

## 觀念

- A：內切球直徑是 1，$0.99<1$，放得進。
- B：取四個兩兩不相鄰的頂點 $(0,0,0),(1,1,0),(1,0,1),(0,1,1)$，六條稜都是面對角線，得到稜長 $\sqrt2\approx1.414$ 的正四面體。$1.4<\sqrt2$，放得進。
- C：細長圓柱最多沿體對角線放，長度上限 $\sqrt3\approx1.732<1.8$，放不進。
- D：平面 $x+y+z=\tfrac32$ 截正立方體得到邊長 $\tfrac{\sqrt2}{2}$ 的正六邊形，內切圓直徑 $\tfrac{\sqrt6}{2}\approx1.225>1.2$，扁圓盤放在這個截面上放得進。

答案是 ABD。

## 互動怎麼看

- 按 A 到 D 切換物體，金色是物體，青色是正立方體能給的極限。
- 拖「轉動」從不同角度看正立方體。B 的四面體每條稜都落在一個面上，C 的細棒兩端會穿出頂點。
- D 的扁圓盤畫在正六邊形截面裡，能看到圓周和六邊形之間還有空隙。
