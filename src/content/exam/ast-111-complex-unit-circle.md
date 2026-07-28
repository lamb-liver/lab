---
title: 單位圓上的等距與平方
description: 111 分科數甲選填 11：把複數絕對值讀成距離，由單位圓弦的中垂線求出第一象限的複數。
subject: 分科數甲
year: 111
questionType: 選填
questionNo: '11'
unit: 高三選修數甲・複數平面
concepts:
  - 複數平面
  - 複數絕對值
  - 棣美弗定理
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0m223505137960339935/01-111%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E5%8D%B7%E5%AE%9A%E7%A8%BF.pdf
analysisUrl: https://www.ceec.edu.tw/xcepaper/cont?qperoid=0M280320869370643470&sid=0M289400243640279375&xsmsid=0J066588036013658199
relatedExplore: []
relatedWorks:
  - complex-arithmetic-geometry
  - complex-polar-form
date: 2026-07-29
order: 11
coverImage: /images/exam-covers/ast-111-complex-unit-circle.png
featured: false
draft: false
---

## 題意

在複數平面上，第一象限的複數 $z$ 位於單位圓。另有固定點

$$
w=\frac{-3+4i}{5}.
$$

題目給定 $w$ 到 $z$ 與 $z^3$ 的距離相同，要求 $z=a+bi$ 的實部與虛部。
完整數值與作答格式見
[大考中心 111 分科測驗數學甲試卷](https://www.ceec.edu.tw/files/file_pool/1/0m223505137960339935/01-111%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E5%8D%B7%E5%AE%9A%E7%A8%BF.pdf)。

## 為什麼會錯

大考中心的[試題特色分析](https://www.ceec.edu.tw/xcepaper/cont?qperoid=0M280320869370643470&sid=0M289400243640279375&xsmsid=0J066588036013658199)
記錄本題得分率為 $16\%$。容易卡住的地方，是看到 $z^3$ 就急著做大量代數展開，
忽略複數絕對值就是複數平面上的距離。把等距改畫成弦的中垂線後，三次方只剩幅角的
三倍關係。

## 觀念

因為 $|z|=|z^3|=1$，原點到 $z$ 與 $z^3$ 的距離也相同。因此原點與 $w$ 都在弦
$zz^3$ 的中垂線上。

令 $z$ 的幅角為 $\theta$。由棣美弗定理，$z^3$ 的幅角為 $3\theta$；弦中點的方向是
$2\theta$，也就是 $z^2$ 的方向。又因 $z$ 在第一象限、$w$ 在第二象限，方向不會取到
相反側，所以

$$
z^2=w=\frac{-3+4i}{5}.
$$

設 $z=a+bi$，比較實部、虛部並使用 $a^2+b^2=1$：

$$
\begin{aligned}
a^2-b^2&=-\frac35,\qquad 2ab=\frac45,\\
a^2+b^2&=1.
\end{aligned}
$$

前後兩式相加可得 $a^2=\frac15$，再得 $b^2=\frac45$。因為 $z$ 在第一象限，

$$
\boxed{a=\frac{\sqrt5}{5},\qquad b=\frac{2\sqrt5}{5}}.
$$

## 互動怎麼看

- 拖動「幅角 $\theta$」，觀察 $z^3$ 在單位圓上以三倍幅角移動，弦與中垂線同步改變。
- 比較固定點 $w$ 到 $z$、$z^3$ 的金色與藍色線段；右欄會顯示目前的距離差。
- 按下「回到原題解答位置」，確認 $w=z^2$ 時兩段距離相等。
