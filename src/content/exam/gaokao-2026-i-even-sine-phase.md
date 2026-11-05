---
title: 偶函數又遞增的正弦相位
description: 2sin(ax + θ) 是偶函數，x = 0 必是最高點或最低點；要在 (0, π/2) 往上走只能是最低點，θ = 3π/2。
subject: 高考數學
year: 2026
questionType: 選填
questionNo: '新課標I-13'
unit: 高考數學・新課標I卷・三角函數
topics:
  - 三角函數圖形
  - 奇偶性
  - 單調性
concepts:
  - trig-functions
sourceUrl: https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34466.html
relatedExplore:
  - trig-function-graphs
relatedWorks:
  - sinusoid-amplitude-period-phase
date: 2026-11-06
order: 30
coverImage: /images/exam-covers/gaokao-2026-i-even-sine-phase.png
featured: false
draft: false
---

## 題意

$f(x)=2\sin(ax+\theta)$，$a$ 是正整數，$0\le\theta<2\pi$。$f$ 是偶函數，且在 $(0,\tfrac{\pi}{2})$ 遞增，求 $\theta$ 與 $f(\tfrac{2\pi}{3})$。

題幹來自考生回憶，見 [91 學的題目整理](https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34466.html)，另可對照 [原創力文檔的一題多解](https://max.book118.com/html/2026/0629/7136140034011126.shtm)。各版回憶的填空不同：有的問 $a$ 與 $\theta$，有的寫 $a\in\mathbb Z$；$\theta=\tfrac{3\pi}{2}$ 與 $f(\tfrac{2\pi}{3})=1$ 在各版都成立。

## 為什麼會錯

只用偶函數，得到 $\theta=\tfrac{\pi}{2}$ 或 $\tfrac{3\pi}{2}$，卻忘了用遞增排除其中一個。

另一個錯是以為 $a$ 要唯一才能算 $f(\tfrac{2\pi}{3})$。$a=1$、$a=2$ 都符合，但函數值相同。

## 觀念

偶函數要 $\sin\theta=\pm1$，$x=0$ 是最高點或最低點。$\theta=\tfrac{\pi}{2}$ 時 $f(0)=2$ 是最大值，右邊只能下降，不合。

$\theta=\tfrac{3\pi}{2}$ 時 $f(x)=-2\cos(ax)$，從最低點往上走半個週期才到最高點，所以要

$$
a\cdot\frac{\pi}{2}\le\pi,\qquad a=1\text{ 或 }2.
$$

$a=1$：$-2\cos\tfrac{2\pi}{3}=1$；$a=2$：$-2\cos\tfrac{4\pi}{3}=1$。答案是 $\theta=\tfrac{3\pi}{2}$，$f(\tfrac{2\pi}{3})=1$。

## 互動怎麼看

- 點 $\theta$ 的八個值：青色虛線 $f(-x)$ 和金色 $f(x)$ 重合時才是偶函數，只有 $\tfrac{\pi}{2}$、$\tfrac{3\pi}{2}$ 會重合。
- 淺色帶是 $(0,\tfrac{\pi}{2})$。$\theta=\tfrac{3\pi}{2}$ 時換 $a$：$a=3$ 以上，曲線在帶內就開始往下。
- 白點是 $x=\tfrac{2\pi}{3}$，$a=1$、$2$ 都停在 1。
