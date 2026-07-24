---
title: 旋轉與鏡射矩陣
description: 112 學測數A 多選 11：比較旋轉與鏡射矩陣的像、反矩陣及合成結果。
subject: 學測數A
year: 112
questionType: 多選
questionNo: '11'
unit: 高三選修數A・矩陣與線性變換
concepts:
  - 旋轉矩陣
  - 鏡射矩陣
  - 矩陣乘法
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
draft: false
---

## 題意

用 $A$、$B$ 表示繞原點順、逆時針旋轉 $90°$，再用 $C$、$D$ 表示對直線
$x=y$、$x=-y$ 的鏡射。題目要求從點的像、負矩陣、反矩陣與合成關係中找出正確敘述。

完整題目與選項見[大考中心 112 學測數學 A 試卷](https://www.ceec.edu.tw/files/file_pool/1/0n045358375872115148/03-112%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf)。

## 為什麼會錯

解析資料把這題列為中偏易，測驗目標是旋轉矩陣與鏡射矩陣的性質；真正容易混淆的不是繁複計算，
而是把「順時針／逆時針」的符號、鏡射軸方向，以及乘積中先做的變換寫在右邊這三件事同時弄對。
只背矩陣外形，常會把 $C^{-1}$ 誤認成另一個鏡射，或直覺認為所有變換都能交換。

## 觀念

以原點為中心、逆時針旋轉 $\theta$ 的變換矩陣為

$$
R(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}
$$

因此

$$
\begin{aligned}
A &= R(-90^\circ),\\
B &= R(90^\circ),\\
A &= -B.
\end{aligned}
$$

兩個鏡射矩陣為

$$
C=\begin{bmatrix}0&1\\1&0\end{bmatrix}, \qquad
D=\begin{bmatrix}0&-1\\-1&0\end{bmatrix}.
$$

鏡射做兩次會回到原位，所以 $C^{-1}=C$、$D^{-1}=D$。矩陣乘積中先做的變換寫在右邊；
直接相乘可得

$$
\begin{aligned}
AB &= I,\\
CD &= -I,\\
AC=BD &= \begin{bmatrix}1&0\\0&-1\end{bmatrix}.
\end{aligned}
$$

兩個旋轉在這裡可以交換；旋轉與鏡射通常不行。判斷時應逐一看幾何作用或實際相乘，
不能把「矩陣乘法通常不可交換」套成每一組都不相等。

## 互動怎麼看

- 每個乘積都分兩段演出；例如 $AC$ 會先做 $C$，再做 $A$。
- **兩個旋轉**：比較 $AB$ 與 $BA$，確認兩邊都回到原位。
- **旋轉與鏡射**：比較 $AC$ 與 $CA$，觀察相同兩個變換換順序後如何分岔。
- **AB 與 CD**：一邊是不變變換，另一邊是旋轉 $180°$。
- **AC 與 BD**：兩組不同合成都落在同一個對 $x$ 軸鏡射。
