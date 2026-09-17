---
title: 圓心在 x 軸、兩垂線距離比與切線斜率
description: 115 分科數甲選填10：圓心在x軸、兩垂線距離比定圓，再求原點切線斜率。
coverImage: /images/exam-covers/ast-115-circle-two-lines-tangent.png
subject: 分科數甲
year: 115
questionType: 選填
questionNo: '10'
unit: 高二數學甲・圓與直線
topics:
  - 點到直線距離
  - 圓與直線位置
  - 切線斜率
concepts:
  - conic-sections
  - vectors
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0Q194554571830884494/01-115%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E5%8D%B7.pdf
relatedExplore:
  - conic-dynamic-geometry
  - vectors
relatedWorks:
  - vector-projection
  - parabolic-reflection
date: 2026-09-17
order: 0
featured: false
draft: true
---

## 題意

坐標平面上，圓 $C$ 的圓心落在 $x$ 軸上，且與兩條互相垂直的直線

$$
L_1:y=\frac43 x,\qquad L_2:y=-\frac34 x
$$

都不相交。令圓上各點到 $L_1$、$L_2$ 的最短距離分別是 $d_1$、$d_2$。若 $d_1$ 是 $d_2$ 的三倍，求過原點且與圓相切的直線斜率（化成最簡根式）。

完整題目見[大考中心 115 分科數學甲試卷](https://www.ceec.edu.tw/files/file_pool/1/0Q194554571830884494/01-115%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E5%8D%B7.pdf)。

## 為什麼會錯

常見卡點有三：把「不相交」寫成距離 $\ge$ 半徑（其實相切也算相交）、把圓心到直線距離直接當成 $d_1$、$d_2$，或求出半徑後又用錯誤的切線條件。距離比先把圓定住，切線斜率是下一步，不要混成同一個方程。

## 觀念

設圓心為 $(a,0)$、半徑 $r>0$。點到直線距離公式給

$$
\delta_1=\frac{|4a|}{5},\qquad \delta_2=\frac{|3a|}{5}.
$$

不相交要求 $\delta_1>r$、$\delta_2>r$，此時

$$
d_1=\delta_1-r,\qquad d_2=\delta_2-r.
$$

代入 $d_1=3d_2$ 得 $r=|a|/2$。再求過原點的切線 $y=mx$：圓心到該直線距離等於半徑，

$$
\frac{|a m|}{\sqrt{m^2+1}}=\frac{|a|}{2}\implies |m|=\frac{\sqrt3}{3}.
$$

因此斜率為 $\pm\sqrt3/3$（選填寫成 $\pm$、$\sqrt3$、$3$）。

## 互動怎麼看

- 拉動 **a**：圓心沿 $x$ 軸移動；半徑自動取使 $d_1:d_2=3:1$ 的 $|a|/2$，並夾住不相交區間。
- 藍、紫短線段是圓到 $L_1$、$L_2$ 的最短距離；比值應穩定在約 $3:1$。
- 金色虛線是過原點的兩條切線；讀出斜率 $\pm\sqrt3/3$，確認它不隨 $|a|$ 改變。
