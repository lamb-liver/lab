---
title: 對稱中心停在 (1, a)
description: 加上立方項以後，對稱中心仍是 (1, a)，不是 (1, 0)。
subject: 高考數學
year: 2024
questionType: 非選
questionNo: '新課標I-18'
unit: 高考數學・新課標I卷・對稱中心
topics:
  - 對稱中心
  - 對數函數
concepts:
  - derivative-tangent
sourceUrl: https://zhuanlan.zhihu.com/p/2015711118853697677
relatedExplore:
  - secants-and-tangents
relatedWorks:
  - function-derivative-graph
date: 2026-11-16
order: 36
coverImage: /images/exam-covers/gaokao-2024-i-log-symmetry-center.png
featured: false
draft: false
---

## 題意

$f(x)=\ln\dfrac{x}{2-x}+ax+b(x-1)^3$，定義域是 $(0,2)$。曲線關於點 $(1,a)$ 中心對稱。$b=0$ 時，導數處處不為負的最小 $a$ 是 $-2$。

題幹來自考生回憶，見 [知乎上的拆解](https://zhuanlan.zhihu.com/p/2015711118853697677)，另可對照 [高考題庫的題目整理](https://gaokaohub.com/q/item/241069179211677.html)。

## 為什麼會錯

定義域的中點是 $x=1$，而 $f(1)=a$。對稱中心的高度是 $a$，不是 $0$。$(x-1)^3$ 關於 $x=1$ 是奇的，加上去以後中心還在 $(1,a)$。

$b=0$ 時，導數是 $\dfrac{2}{x(2-x)}+a$。$x(2-x)$ 在 $x=1$ 最大，等於 $1$，所以導數的最小值是 $2+a$。要導數不為負，$a$ 至少是 $-2$。靠近兩端的斜率比 $x=1$ 更大。把它當成最小斜率，得到的 $a$ 會小於 $-2$。

## 觀念

令 $t=x-1$，則 $f(1+t)+f(1-t)=2a$。點 $(1+t,\,f(1+t))$ 與 $(1-t,\,f(1-t))$ 的中點是 $(1,a)$。中心處的斜率是 $2+a$，立方項在那裡的導數是 $0$。

若還要 $f(x)>-2$ 恰好在 $(1,2)$ 上成立，先得 $a=-2$。對稱性把左側自動壓到 $-2$ 以下，右側則要 $b\ge -\dfrac{2}{3}$。

## 互動怎麼看

- 拖「立方項」：這一頁把 $a$ 固定成 $1$，金點是 $(1,1)$。白線兩端在曲線上，中點不離開金點。
- 立方項停在 $0$：中心處的切線斜率是 $3$。
- 把立方項拉大：曲線一端抬高、一端壓低，金點和短金線都不動。
