---
title: 拋物線的受限平移
description: 115 學測數A選填 16：同時追蹤頂點所在直線與固定通過點，排除沒有真正平移的解。
subject: 學測數A
year: 115
questionType: 選填
questionNo: '16'
unit: 高一必修數學・二次函數與圖形平移
topics:
  - 二次函數頂點式
  - 圖形平移
  - 向量長度
concepts:
  - quadratic-function
  - function-transformation
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0q054344158947111283/03-115%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://math.ntnu.edu.tw/~li/108/115A.html
relatedExplore:
  - function-equations
  - vectors
relatedWorks:
  - quadratic-completing-square
  - function-graph-transform
coverImage: /images/exam-covers/gsat-115-parabola-restricted-translation.png
date: 2026-07-26
order: 7
featured: false
draft: false
---

## 題意

拋物線 $\Gamma$ 的頂點 $P$ 位在直線 $\ell:y=1+2x$ 上，並與 $x$ 軸交於
$A=(-\frac12,0)$、$B=(\frac12,0)$。把整條拋物線平移後，新頂點 $Q$ 仍在
$\ell$ 上，新圖形也通過 $B$。已知 $P$、$Q$ 相異，求平移距離 $PQ$。

完整題目見[大考中心 115 學測數學 A 試卷](https://www.ceec.edu.tw/files/file_pool/1/0q054344158947111283/03-115%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf)。

## 為什麼會錯

[試題分析](https://math.ntnu.edu.tw/~li/108/115A.html)整理的大考中心資料顯示，本題答對率為
$31\%$，高分群為 $63\%$、低分群為 $7\%$。容易漏掉的不是解二次方程，而是條件的先後：
「仍通過 $B$」會給出兩個位置，其中原位 $Q=P$ 也符合；必須再用「$P$、$Q$ 相異」排除它。

## 觀念

由兩個 $x$ 軸交點，原拋物線可寫成

$$
f(x)=a\left(x-\frac12\right)\left(x+\frac12\right).
$$

它的對稱軸是 $x=0$，而頂點又在 $y=1+2x$ 上，所以 $P=(0,1)$，代回可得
$a=-4$，即 $f(x)=-4x^2+1$。

設平移後的頂點是 $Q=(h,1+2h)$，新拋物線保持形狀：

$$
y=-4(x-h)^2+(1+2h).
$$

代入固定通過點 $B=(\frac12,0)$：

$$
\begin{aligned}
0&=-4\left(\frac12-h\right)^2+1+2h\\
 &=2h(3-2h).
\end{aligned}
$$

因此 $h=0$ 或 $h=\frac32$。前者使 $Q=P$，違反兩點相異，所以取
$h=\frac32$。兩頂點都沿方向向量 $(1,2)$ 移動，故

$$
PQ=\sqrt{h^2+(2h)^2}
  =\frac{3\sqrt5}{2}.
$$

整段只用二次函數頂點式、圖形平移、一元二次方程與向量長度，不需要微分。

## 互動怎麼看

- **h=0，Q=(0,1)**：先選原位，確認它雖然仍通過 $B$，卻違反 $P$、$Q$ 相異。
- **h=3/2，Q=(3/2,4)**：再選另一位置，藍色拋物線仍通過 $B$，且頂點沿 $\ell$ 移動。
- 比較線段 $PQ$ 與直線 $\ell$ 的方向，讀出平移向量 $(h,2h)$ 和距離 $\frac{3\sqrt5}{2}$。
