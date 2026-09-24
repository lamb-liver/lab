---
title: 三個同心圓上的正三角形
description: 2025 AMC 12B 第25題：半徑 2 的圓繞頂點轉 60° 後內切大圓，唯一解得邊長平方 7。
subject: AMC 12B
year: 2025
questionType: 單選
questionNo: '25'
unit: AMC 12・平面幾何與旋轉
topics:
  - 旋轉 60°
  - 兩圓內切
  - 正三角形
concepts:
  - linear-transformation
  - law-of-sines-cosines
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2025_AMC_12B_Problems/Problem_25
relatedExplore:
  - matrix-linear-transform
relatedWorks:
  - rotation-scale-composition
  - law-of-sines-cosines
date: 2026-09-25
order: 16
coverImage: /images/exam-covers/amc12b-2025-25-concentric-circles-equilateral.png
featured: false
draft: false
---

## 題意

平面上有三個同心圓，半徑分別是 1、2、3。一個正三角形的三個頂點各落在其中一個圓上（每個圓恰好一個頂點）。求這個正三角形邊長的平方 $s^2$。（五選一）

完整題目與選項見 [AoPS 題目頁](https://artofproblemsolving.com/wiki/index.php/2025_AMC_12B_Problems/Problem_25)。

## 為什麼會錯

直覺的做法是設三個頂點的角度，列出「三邊相等」的方程。未知數多、又夾著三角函數，很容易算到一半就卡住。

另一個陷阱是先假設圖形「看起來對稱」：例如讓三個頂點與圓心的連線互成 $120^\circ$。用餘弦定理算三邊平方，分別是 $1+4+2=7$、$4+9+6=19$、$9+1+3=13$，根本不是正三角形；其中一邊恰好是 7，更容易讓人誤以為找對了。

真正要說明的是 $s$ 為什麼只有一個值；下面的旋轉論證同時說明了存在與唯一。

## 觀念

正三角形 $ABC$ 中，$C$ 是 $B$ 繞 $A$ 旋轉 $60^\circ$ 的像。$B$ 在半徑 2 的圓上，所以 $C$ 一定落在「半徑 2 的圓繞 $A$ 轉 $60^\circ$」的像圓上。

像圓的圓心 $O'$ 是圓心 $O$ 繞 $A$ 轉 $60^\circ$ 的像：$|AO'|=|AO|=1$、$\angle OAO'=60^\circ$，所以 $\triangle OAO'$ 是正三角形，$|OO'|=1$。

像圓半徑 2、圓心離 $O$ 為 1，而 $3-2=1$：它與半徑 3 的圓**內切**，只有一個交點。這個切點就是 $C$，且 $O$、$O'$、$C$ 共線、$|OC|=3$。

取 $A=(1,0)$，則 $O'=\left(\tfrac12,\tfrac{\sqrt3}{2}\right)$、$C=3\,O'=\left(\tfrac32,\tfrac{3\sqrt3}{2}\right)$：

$$
s^2=|AC|^2=\left(\tfrac12\right)^2+\left(\tfrac{3\sqrt3}{2}\right)^2=\tfrac14+\tfrac{27}{4}=7,
$$

選 (E)。往另一個方向轉，得到的是鏡像，邊長相同。

## 互動怎麼看

- 按「播放旋轉 60°」：金色虛線圓是半徑 2 的圓繞 $A$ 旋轉的像；轉到 $60^\circ$ 時，它恰好碰到最外圈，而且只碰一點。
- 拖曳 $A$ 沿小圓移動：不論 $A$ 在哪，$|OO'|$ 都停在 1，像圓都與大圓內切，讀數 $s^2$ 始終是 7。
- 拖曳試探點 $B$：它的像 $C'$ 在金色像圓上滑動，$|OC'|$ 只有在切點才等於 3；按「把 B 對到唯一解」直接跳到那個位置。
