---
title: 三次函數的對稱中心
description: 114 學測數A選填 13：由多項式除法與商式對稱軸找出三次函數的對稱中心。
subject: 學測數A
year: 114
questionType: 選填
questionNo: '13'
unit: 高一必修數學・多項式函數
topics:
  - 多項式除法
  - 餘式定理
  - 三次函數對稱中心
concepts:
  - polynomial
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0p056503510203248955/03-114%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E9%A1%8C.pdf
analysisUrl: https://math.ntnu.edu.tw/~li/108/114A.html
relatedExplore:
  - function-equations
relatedWorks:
  - function-graph-transform
  - polynomial-roots-multiplicity
coverImage: /images/exam-covers/gsat-114-cubic-symmetry-center.png
date: 2026-07-25
order: 6
featured: false
draft: false
---

## 題意

一個實係數三次多項式 $f(x)$ 除以 $x+6$，商式記為 $q(x)$，餘式為 $3$。
已知 $q(x)$ 在 $x=-6$ 取得最大值 $8$，題目要找 $y=f(x)$ 圖形的對稱中心。

完整題目見[大考中心 114 學測數學 A 試卷](https://www.ceec.edu.tw/files/file_pool/1/0p056503510203248955/03-114%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E9%A1%8C.pdf)。

## 為什麼會錯

大考中心的[答對率與鑑別度統計](https://www.ceec.edu.tw/files/file_pool/1/0P062639972539206028/%E6%95%B8%E5%AD%B8A.pdf)
顯示本題答對率為 $48\%$，高分群為 $88\%$、低分群只有 $10\%$。最容易卡住的步驟，是把
$q(x)$ 的最高點 $(-6,8)$ 直接當成 $f(x)$ 的中心，忘了 $8$ 屬於商式；原函數在 $x=-6$
的值應由餘式 $3$ 決定。

## 觀念

依多項式除法，

$$
f(x)=(x+6)q(x)+3.
$$

$q(x)$ 是開口向下的二次函數，且頂點為 $(-6,8)$，所以可寫成

$$
q(x)=a(x+6)^2+8,\qquad a<0.
$$

代回原式：

$$
f(x)=a(x+6)^3+8(x+6)+3.
$$

令 $t=x+6$，則 $f(-6+t)-3=at^3+8t$。把 $t$ 換成 $-t$ 時，右式只改變正負，
因此

$$
f(-6+t)+f(-6-t)=6.
$$

這兩點的橫坐標平均是 $-6$，縱坐標平均是 $3$，所以對稱中心為 $(-6,3)$。
整段只用多項式除法、二次函數頂點式與點對稱，不需要微分。

## 互動怎麼看

- **先選中心**：先比較 $(-6,8)$ 與 $(-6,3)$，分清商式最高點和原式對稱中心。
- **對稱距離 $h$**：拖動 $h$，左圖的商式兩點保持等高，右圖的 $P$、$Q$ 隨之移動。
- 右圖線段 $PQ$ 的中點 $M$ 始終停在 $(-6,3)$。
