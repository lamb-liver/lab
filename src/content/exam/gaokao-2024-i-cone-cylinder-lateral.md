---
title: 等高的圓柱與圓錐
description: 圓柱與圓錐共用底面半徑與高，側面積相等時圓錐體積跟著確定。
subject: 高考數學
year: 2024
questionType: 單選
questionNo: '新課標I-5'
unit: 高考數學・新課標I卷・立體幾何
topics:
  - 圓柱側面積
  - 圓錐斜高
  - 錐體體積
concepts:
  - law-of-sines-cosines
sourceUrl: https://zhuanlan.zhihu.com/p/702451963
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - law-of-sines-cosines
date: 2026-11-04
order: 18
coverImage: /images/exam-covers/gaokao-2024-i-cone-cylinder-lateral.png
featured: false
draft: false
---

## 題意

一個圓柱和一個圓錐共用底面半徑，側面面積也相同，高都是 $\sqrt{3}$。要求圓錐的體積。

題幹來自考生回憶，見 [知乎上的全卷整理](https://zhuanlan.zhihu.com/p/702451963)。

## 為什麼會錯

斜高比高長。把圓錐側面積寫成 $\pi r\sqrt{3}$，它永遠是圓柱側面積的一半，兩邊不會相等。

半徑算對以後，體積還要乘 $\tfrac13$。漏掉這一步，$r=3$ 時得到 $9\sqrt{3}\pi$，是圓錐體積的三倍。換成 $\tfrac23$，得到 $6\sqrt{3}\pi$。

還有一個巧合：半徑設成高 $\sqrt{3}$，再漏掉 $\tfrac13$，數值剛好是 $3\sqrt{3}\pi$。此時兩邊側面積並不相等。

## 觀念

設底面半徑 $r>0$。圓柱側面積是 $2\pi r\sqrt{3}$。圓錐斜高 $l=\sqrt{r^2+3}$，側面積是 $\pi rl$。

$$
2\sqrt{3}=\sqrt{r^2+3}.
$$

兩邊平方，$r^2=9$，正根 $r=3$，斜高 $l=2\sqrt{3}$。半徑、高、斜高圍成直角三角形；直角時餘弦定理回到 $l^2=r^2+3$。

$$
V=\frac13\pi r^2\sqrt{3}=3\sqrt{3}\pi.
$$

用到的是高中的側面積與體積公式。體積不是把側面轉一圈再積分。

## 互動怎麼看

- 拖「底面半徑」：兩個軸截面維持同一個高，直角三角形的水平邊是 $r$，斜邊是斜高。
- 側面積讀數重合時，體積停在 $3\sqrt{3}\pi$，斜高是 $2\sqrt{3}$。
- 把半徑放在 $\sqrt{3}$ 附近：側面積分開，漏掉 $\tfrac13$ 的那個量仍寫成 $3\sqrt{3}\pi$。
