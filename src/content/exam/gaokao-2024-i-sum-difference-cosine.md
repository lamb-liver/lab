---
title: 兩角和與兩角差
description: 兩角正切的乘積為 2 時，差的餘弦是和的餘弦的 −3 倍。
subject: 高考數學
year: 2024
questionType: 單選
questionNo: '新課標I-4'
unit: 高考數學・新課標I卷・三角恆等變換
topics:
  - 和差角公式
  - 正切乘積
concepts:
  - trig-identities
sourceUrl: https://zhuanlan.zhihu.com/p/702451963
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - trig-angle-identities
date: 2026-11-11
order: 19
coverImage: /images/exam-covers/gaokao-2024-i-sum-difference-cosine.png
featured: false
draft: false
---

## 題意

兩個角的正切乘起來是 2，它們的和的餘弦記成 $m$。差的餘弦由 $m$ 決定。

題幹來自考生回憶，見 [知乎上的全卷整理](https://zhuanlan.zhihu.com/p/702451963)。

## 為什麼會錯

差的餘弦若寫成 $m$，或只去掉負號寫成 $3m$，乘積 2 帶來的那個負號就不見了。

正切乘積改成別的正數 $k$ 時，倍數是 $\dfrac{1+k}{1-k}$。它等於 $-3$ 只發生在 $k=2$。$k$ 靠近 1 時，和的餘弦靠近 0，這個倍數沒有意義。

$|m|>\tfrac13$ 時，$|-3m|>1$，這樣的兩角不存在。任一個角的餘弦是 0，正切也沒有定義。圖上把第一個角固定成 $\pi/4$，只為了用一條滑桿畫出兩條射線。因此會得到一個根式；題目要的是 $-3m$。

## 觀念

記 $P=\cos\alpha\cos\beta$，$Q=\sin\alpha\sin\beta$。$\tan\alpha\tan\beta=k$ 就是 $Q/P=k$，所以 $Q=kP$。這裡兩個餘弦都不為 0。

$$
\cos(\alpha+\beta)=P-Q=P(1-k),\qquad \cos(\alpha-\beta)=P+Q=P(1+k).
$$

$k\neq 1$ 時，

$$
\cos(\alpha-\beta)=\frac{1+k}{1-k}\cos(\alpha+\beta).
$$

$k=2$ 時，$\cos(\alpha+\beta)=-P=m$，因此 $P=-m$，$\cos(\alpha-\beta)=3P=-3m$。

## 互動怎麼看

- 拖「正切乘積」：白線停在 $\pi/4$，金線的正切等於乘積。白點是和角，金點是差角，橫軸上的線段是兩點的餘弦。
- 乘積停在 2：差的餘弦讀成 $-3m$。金線段的長度是白線段的 3 倍，方向相反。
- 乘積靠近 1：和角靠近直角，白線段縮掉，讀數不再給倍數。
