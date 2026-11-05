---
title: '到定點與定直線距離乘積為 4 的曲線'
description: '曲線上每點到 F(2, 0) 的距離乘上到 x = −2 的距離都是 4。x = 2 時高度是 1，但最高點在 x ≈ 1.68，高約 1.039。'
subject: 高考數學
year: 2024
questionType: 多選
questionNo: '新課標I-11'
unit: 高考數學・新課標I卷・曲線與方程
topics:
  - 軌跡方程
  - 曲線的範圍
  - 不等式估計
concepts:
  - conic-sections
sourceUrl: https://gaokaohub.com/q/item/121286594128203.html
relatedExplore:
  - conic-dynamic-geometry
relatedWorks:
  - conic-focus-locus
date: 2026-11-05
order: 25
coverImage: /images/exam-covers/gaokao-2024-i-distance-product-curve.png
featured: false
draft: false
---

## 題意

曲線 $C$ 上的點都在 $x>-2$ 的範圍，到點 $F(2,0)$ 的距離與到直線 $x=a$（$a<0$）的距離之積為 4，而且 $C$ 過原點。四個敘述要判斷：$a=-2$；點 $(2\sqrt2,0)$ 在 $C$ 上；$C$ 在第一象限的點縱坐標最大值是 1；$C$ 上的點 $(x_0,y_0)$ 滿足 $y_0\le\dfrac{4}{x_0+2}$。

題幹來自考生回憶，見 [高考題庫的題目整理](https://gaokaohub.com/q/item/121286594128203.html)，另可對照 [量識寶的解析](https://liangshibao.com/tiku/gaokao-math-2024-i/multiple-11)。

## 為什麼會錯

最容易錯的是第三個敘述。代 $x=2$ 得到 $y=1$，看起來像最高點，於是選了它。

但這條曲線不是圓錐曲線，沒有對稱的頂點可以套用。高度要從 $y^2$ 的式子去看，左邊一點的位置更高。

## 觀念

$C$ 過原點：$2\cdot|0-a|=4$，$a<0$ 所以 $a=-2$。方程是

$$
\sqrt{(x-2)^2+y^2}\,(x+2)=4\quad\Longrightarrow\quad y^2=\frac{16}{(x+2)^2}-(x-2)^2.
$$

- $x=2\sqrt2$ 時 $\dfrac{16}{(2\sqrt2+2)^2}=(2\sqrt2-2)^2$，所以 $y=0$，點在曲線上。
- $x=2$ 時 $y=1$；$x=1.5$ 時 $y^2\approx1.056>1$，所以最大值不是 1。數值上最高點約在 $x\approx1.68$，$y\approx1.039$。
- $y^2\le\dfrac{16}{(x+2)^2}$，所以 $|y|\le\dfrac{4}{x+2}$。

答案是 ABD。

## 互動怎麼看

- 拖「點 P 的 x」：金色點沿曲線上半支移動，白線是到 F 的距離，青線是到 $x=-2$ 的距離，兩者乘積一直是 4。
- 把 P 從 $x=2$ 往左拉，側欄的 y 先變大再變小，超過 1 的那一段就是 C 錯的原因。
- 打開「顯示 y = 4/(x+2)」，青色曲線整條包在金色曲線外面，這就是 D。
