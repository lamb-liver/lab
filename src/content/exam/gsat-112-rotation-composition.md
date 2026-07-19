---
title: 旋轉變換的合成順序
description: 112 學測數A 多選 11：兩個旋轉變換先後套用，順序換了結果就不同。
subject: 學測數A
year: 112
questionType: 多選
questionNo: '11'
unit: 高三選修數A・矩陣與線性變換
concepts:
  - 旋轉矩陣
  - 矩陣乘法
  - 變換合成
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0n045358375872115148/03-112%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://public.ehanlin.com.tw/pre-exam/gsat/112%E7%BF%B0%E6%9E%97%E5%AD%B8%E6%B8%AC%E7%B2%BE%E5%BD%A9%E8%A7%A3%E6%9E%90-%E6%95%B8%E5%AD%B8A%E8%80%83%E7%A7%91.pdf
relatedExplore:
  - matrix-linear-transform
relatedWorks:
  - linear-transform-grid
  - rotation-scale-composition
date: 2026-07-19
order: 1
featured: false
draft: true
---

## 題意

平面上有兩個以原點為中心的旋轉變換：$A$ 順時針轉 $90°$，$B$ 逆時針轉 $90°$。
一個質點從給定位置出發，依序套用這兩個變換，問質點最後落在哪裡。

完整題目與選項見[大考中心 112 學測數學 A 試卷](https://www.ceec.edu.tw/files/file_pool/1/0n045358375872115148/03-112%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf)。

## 為什麼會錯

線性變換是近年學測未曾出現的內容，這一年突然入題，考生沒有現成的解題套路可用。
更根本的障礙是：矩陣寫在紙上是一堆數字，看不見它「在動什麼」——
於是無法判斷先做 $A$ 再做 $B$，跟先做 $B$ 再做 $A$ 到底差在哪。

## 觀念

以原點為中心、逆時針旋轉 $\theta$ 的變換矩陣為

$$
R(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}
$$

順時針旋轉 $90°$ 即 $R(-90°)$，逆時針旋轉 $90°$ 即 $R(90°)$。
變換的合成對應矩陣乘法，且**先套用的變換寫在右邊**：先 $A$ 後 $B$ 是 $BA$。

旋轉彼此可交換（$R(\alpha)R(\beta) = R(\beta)R(\alpha) = R(\alpha+\beta)$），
但一般的線性變換不可交換——這正是本題想測的邊界。

## 互動怎麼看

分別按下 $A$、$B$ 觀察單一變換把質點轉去哪，再用「交換順序」並排比較 $BA$ 與 $AB$。
把其中一個變換換成伸縮或鏡射，兩邊的結果就會分岔。
