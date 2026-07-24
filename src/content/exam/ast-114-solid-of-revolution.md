---
title: 面積相同，旋轉體體積相同嗎
description: 114 分科數甲非選 17：用圓盤法比較一族等面積函數，找出旋轉體體積的最大值。
subject: 分科數甲
year: 114
questionType: 非選
questionNo: '17'
unit: 高三選修數甲・積分的應用
concepts:
  - 定積分
  - 圓盤法
  - 黎曼和
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0p212559382035851587/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://www.ceec.edu.tw/files/file_pool/1/0p212559924382457587/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E9%9D%9E%E9%81%B8%E6%93%87%E9%A1%8C%E8%A9%95%E5%88%86%E5%8E%9F%E5%89%87.pdf
relatedExplore:
  - limits-riemann-sum
relatedWorks:
  - riemann-sum
date: 2026-07-24
order: 4
featured: false
draft: false
---

## 題意

在 $-\frac12\leq a\leq1$ 時，函數

$$
f(x)=3ax^2+1-a
$$

在 $[-1,1]$ 上不小於 $0$，而且它與 $x$ 軸所圍的面積都等於 $2$。把這塊區域繞
$x$ 軸旋轉後，題目要判斷體積是否仍都相等；若不相等，還要找最大值。完整題組見
[大考中心 114 分科測驗數學甲試卷](https://www.ceec.edu.tw/files/file_pool/1/0p212559382035851587/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E5%8D%B7.pdf)。

## 為什麼會錯

最容易誤判的是「面積相同，所以體積也相同」。面積累加的是高度 $f(x)$，圓盤體積累加的卻是
半徑平方 $\pi f(x)^2$；把同樣的面積移到離旋轉軸更遠的位置，體積就會放大。
大考中心的[評分原則](https://www.ceec.edu.tw/files/file_pool/1/0p212559924382457587/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E9%9D%9E%E9%81%B8%E6%93%87%E9%A1%8C%E8%A9%95%E5%88%86%E5%8E%9F%E5%89%87.pdf)
也把「列對圓盤積分、算出含 $a$ 的體積、在範圍內找最大值」分成三個必要步驟。

## 觀念

厚度為 $dx$ 的小圓盤，半徑近似 $f(x)$，體積近似

$$
\pi f(x)^2\,dx.
$$

全部圓盤相加並取極限，就是

$$
\begin{aligned}
V
&=\pi\int_{-1}^{1}(3ax^2+1-a)^2\,dx\\
&=\pi\int_{-1}^{1}
\left(9a^2x^4+6a(1-a)x^2+(1-a)^2\right)\,dx\\
&=2\pi+\frac85\pi a^2.
\end{aligned}
$$

體積會隨 $a^2$ 改變，所以不會都相等。在 $-\frac12\leq a\leq1$ 中，$a^2$ 的最大值在
$a=1$，因此

$$
V_{\max}=2\pi+\frac85\pi=\frac{18}{5}\pi.
$$

## 互動怎麼看

- 改變 $a$，比較面積固定時，函數高度分布如何改變旋轉體的粗細。
- 金色截線代表圓盤邊界；增加切片數 $n$，中點黎曼和會逐漸靠近精確體積。
- 重播掃掠，從平面函數看到它繞 $x$ 軸形成線框旋轉體。
