---
title: 歪斜線、公垂線與空間距離
description: 112 學測數A 選填 17：用方向向量與公垂線，把三個互相垂直的長度合成空間距離。
subject: 學測數A
year: 112
questionType: 選填
questionNo: '17'
unit: 高二數學A・空間向量
concepts:
  - 空間直線
  - 向量外積
  - 歪斜線距離
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0n045358375872115148/03-112%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://www.ceec.edu.tw/files/file_pool/1/0N060632491446652955/%E6%95%B8A%E7%A7%91%E7%AD%94%E5%B0%8D%E7%8E%87%E5%8F%8A%E9%91%91%E5%88%A5%E5%BA%A6%E8%A1%A8.pdf
relatedExplore:
  - space-vectors-planes-lines
relatedWorks:
  - cross-product-geometry
  - line-plane-intersection
  - plane-normal-distance
date: 2026-07-24
order: 3
featured: false
draft: false
---

## 題意

坐標空間中有兩條不相交的直線 $L_1$、$L_2$，另有一條直線 $L_3$ 同時與兩者相交且垂直。
點 $P$、$Q$ 分別在 $L_1$、$L_2$ 上，且各自到 $L_3$ 的距離都是 $3$。題目要找
$P$、$Q$ 的距離。完整直線方程式見
[大考中心 112 學測數學 A 試卷](https://www.ceec.edu.tw/files/file_pool/1/0n045358375872115148/03-112%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf)。

## 為什麼會錯

大考中心的[答對率及鑑別度表](https://www.ceec.edu.tw/files/file_pool/1/0N060632491446652955/%E6%95%B8A%E7%A7%91%E7%AD%94%E5%B0%8D%E7%8E%87%E5%8F%8A%E9%91%91%E5%88%A5%E5%BA%A6%E8%A1%A8.pdf)
顯示本題答對率只有 $10\%$。常見卡點是把紙面上看似相交的線當成真的相交、只求出兩直線間距離，
或把三段長度直接相加。空間圖可以旋轉，但垂直關係與長度不會跟著視角改變。

## 觀念

兩條直線的方向向量分別是

$$
\mathbf u=(1,-1,1),\qquad \mathbf v=(2,1,-1).
$$

因為 $\mathbf u\cdot\mathbf v=0$，兩個方向互相垂直。外積

$$
\mathbf n=\mathbf u\times\mathbf v=(0,3,3)
$$

同時垂直兩條直線。若分別取兩直線上的已知點 $A_0=(1,1,2)$、
$B_0=(2,5,6)$，則兩歪斜線的距離是

$$
\frac{|(B_0-A_0)\cdot\mathbf n|}{|\mathbf n|}
=\frac{24}{3\sqrt2}
=4\sqrt2.
$$

把 $L_3$ 與 $L_1$、$L_2$ 的交點記成 $A$、$B$。$\overline{AP}$、
$\overline{AB}$、$\overline{BQ}$ 分別沿三個互相垂直的方向，所以可以連續使用畢氏定理：

$$
PQ^2=AP^2+AB^2+BQ^2
=3^2+(4\sqrt2)^2+3^2
=50.
$$

因此 $PQ=5\sqrt2$。這個結果不依賴 $P$、$Q$ 各自在交點的哪一側。

## 互動怎麼看

- 金線是 $L_1$、$L_2$ 的公垂線段，長度固定為 $4\sqrt2$。
- 把 $d=|AP|=|BQ|$ 從 $0$ 拉到 $3$，觀察 $PQ$ 如何由 $4\sqrt2$ 變成 $5\sqrt2$。
- 拖動畫布或使用視角滑桿；確認外觀會改變，但三個互相垂直的方向不變。
