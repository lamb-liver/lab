---
title: 補角的兩個第三邊
description: 2025 AMC 12B 第21題：只看第三邊 11 會得到 22，兩塊的和是 24。
subject: AMC 12B
year: 2025
questionType: 單選
questionNo: '21'
unit: AMC 12・餘弦定理
topics:
  - 餘弦定理
  - 補角
  - 三角形不等式
concepts:
  - law-of-sines-cosines
  - trig-functions
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2025_AMC_12B_Problems/Problem_21
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - law-of-sines-cosines
  - trig-angle-identities
date: 2026-11-18
order: 41
coverImage: /images/exam-covers/amc12b-2025-21-supplementary-triangles.png
featured: false
draft: false
---

## 題意

兩個不全等的三角形面積相等。每個三角形都有兩邊長 $8$ 與 $9$，第三邊是整數。求這兩個第三邊的和。五選一。

完整題目與選項見 [AoPS 題目頁](https://artofproblemsolving.com/wiki/index.php/2025_AMC_12B_Problems/Problem_21)。

## 為什麼會錯

- 銳角那一塊的第三邊是 $11$。把它加倍得到 $22$，這是選項 (B)。另一塊的第三邊是 $13$。
- 只留下 $13$，加倍得到 $26$，這是選項 (D)。
- 把已知的 $9$ 和算出的 $11$ 相加得到 $20$，這是選項 (A)。題目要的是兩個第三邊。
- 兩邊拉成一直線時，第三邊是 $1$ 與 $17$，平方和也是 $290$，可是面積是 $0$，構不成三角形。$11+17=28$ 是選項 (E)，這兩數的平方和不是 $290$。

## 觀念

夾角 $\theta$ 夾在邊 $8$ 與邊 $9$ 之間時，面積是

$$
\frac12\cdot 8\cdot 9\cdot\sin\theta=36\sin\theta.
$$

補角的正弦相同，所以面積相同，餘弦互為相反數。餘弦定理：

$$
t^2=8^2+9^2-2\cdot 8\cdot 9\cos\theta=145-144\cos\theta.
$$

另一塊是 $145+144\cos\theta$。兩式相加：

$$
t_1^2+t_2^2=290.
$$

三角形不等式是 $1<t<17$。$t=1$ 與 $t=17$ 對應 $\cos\theta=\pm 1$，面積是 $0$。

$290$ 除以 $8$ 餘 $2$。整數的平方除以 $8$ 只可能餘 $0$、$1$ 或 $4$，平方和要餘 $2$，兩邊都得是奇數。在 $3,5,\ldots,15$ 裡逐對檢查，只有

$$
11^2+13^2=121+169=290.
$$

$\cos\theta=\dfrac16$ 時，$145-24=121=11^2$，補角 $145+24=169=13^2$。

$$
\sin\theta=\sqrt{1-\frac1{36}}=\frac{\sqrt{35}}{6},\qquad 36\sin\theta=6\sqrt{35}.
$$

兩個第三邊的和是 $24$。選 (C)。

## 互動怎麼看

- 預設只畫銳角那一塊，第三邊是 $11$。
- 滑桿改夾角。補角那一塊的面積始終相同，第三邊換成另一個數。
- 點選「補上另一塊」：兩塊同時出現。夾角對到這對整數時，讀數是 $11$ 與 $13$，和是 $24$。
