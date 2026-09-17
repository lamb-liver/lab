---
title: 平面截坐標面的平行線距離
description: 114 分科數甲選填10：平面交坐標面得平行線，求兩線最短距離。
subject: 分科數甲
year: 114
questionType: 選填
questionNo: '10'
unit: 高二數學甲・空間中的平面與直線
topics:
  - 平面與坐標面交線
  - 平行線距離
  - 方向向量
concepts:
  - space-vectors
  - dot-cross-product
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0P192554390266335672/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://math.ntnu.edu.tw/~li/108/114G.html
relatedExplore:
  - space-vectors-planes-lines
relatedWorks:
  - line-plane-intersection
  - plane-normal-distance
  - cross-product-geometry
date: 2026-09-17
order: 13
coverImage: /images/exam-covers/ast-114-plane-parallel-line-distance.png
featured: false
draft: false
---

## 題意

空間中有一平面，分別與 $x=0$、$z=0$ 交於直線 $L_1$、$L_2$。已知 $L_1\parallel L_2$，且 $L_1$ 通過 $(0,2,-11)$、$L_2$ 通過 $(8,21,0)$，求兩線距離（化成最簡根式）。

完整題目見[大考中心 114 分科數學甲試卷](https://www.ceec.edu.tw/files/file_pool/1/0P192554390266335672/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E5%8D%B7.pdf)。

## 為什麼會錯

容易把兩條交線當成歪斜線硬套公式，或先假設一般平面方程卻在平行條件上算錯。關鍵其實是：一條線躺在 $x=0$、另一條躺在 $z=0$，又要平行，方向向量幾乎沒有選擇餘地。

## 觀念

$L_1\subset\{x=0\}$ 的方向向量滿足 $u_x=0$；$L_2\subset\{z=0\}$ 滿足 $u_z=0$。兩者平行所以共用同一個 $\mathbf u$，因此

$$
\mathbf u=(0,1,0).
$$

兩平行線的距離等於兩已知點連線在垂直於 $\mathbf u$ 的分量長度：把 $y$ 方向扣掉後只剩

$$
(8,0,11),\qquad \text{距離}=\sqrt{8^2+11^2}=\sqrt{185}.
$$

（選填對應 $1$、$8$、$5$。）

## 互動怎麼看

- 藍、紫半透明面分別是 $x=0$、$z=0$；交線就是 $L_1$、$L_2$。
- 金線是共同垂線段，長度固定為 $\sqrt{185}$。
- 拖動畫布或用視角滑桿；確認外觀改變時，平行與距離不變。
