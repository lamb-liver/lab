---
title: 焦弦投影的兩個三角比
description: 111 分科數甲多選 7：用拋物線定義與投影形成的直角三角形，辨認同一個線段比。
subject: 分科數甲
year: 111
questionType: 多選
questionNo: '7'
unit: 高三選修數甲・二次曲線
topics:
  - 拋物線定義
  - 焦點與準線
  - 三角比
concepts:
  - conic-sections
  - trig-functions
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0m223505137960339935/01-111%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E5%8D%B7%E5%AE%9A%E7%A8%BF.pdf
analysisUrl: https://www.ceec.edu.tw/xcepaper/cont?qperoid=0M280320869370643470&sid=0M289400243640279375&xsmsid=0J066588036013658199
relatedExplore:
  - conic-dynamic-geometry
relatedWorks:
  - parabolic-reflection
date: 2026-07-28
order: 10
coverImage: /images/exam-covers/ast-111-parabola-focal-chord-directrix-projection.png
featured: false
draft: false
---

## 題意

拋物線上兩點 $A,B$ 的連線通過焦點 $F$。把 $A,F,B$ 垂直投影到準線，分別得到
$A',F',B'$；題目要從五個三角比中，找出與 $\dfrac{A'F'}{A'A}$ 相等的選項。
完整圖形與選項見
[大考中心 111 分科測驗數學甲試卷](https://www.ceec.edu.tw/files/file_pool/1/0m223505137960339935/01-111%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E5%8D%B7%E5%AE%9A%E7%A8%BF.pdf)。

## 為什麼會錯

大考中心的[試題特色分析](https://www.ceec.edu.tw/xcepaper/cont?qperoid=0M280320869370643470&sid=0M289400243640279375&xsmsid=0J066588036013658199)
記錄本題得分率為 $41\%$。選項 ③、④、⑤較難判斷，關鍵不是另找一條拋物線公式，
而是先把「點到焦點的距離等於點到準線的距離」標成等長，再補出直角三角形。

## 觀念

設

$$
\begin{aligned}
a&=A'F', & b&=A'A=AF,\\
c&=F'B', & d&=B'B=BF.
\end{aligned}
$$

兩組等長分別來自拋物線定義。投影線 $A'A$、$F'F$、$B'B$ 都垂直於準線，因此彼此平行；
又因 $A,F,B$ 共線，焦弦與這些投影線的銳夾角相同。把這個角記為 $\theta$，便有

$$
\frac{a}{b}=\sin\theta=\frac{c}{d}.
$$

選項 ③ 的角正是 $\angle A'AF=\theta$，所以

$$
\sin\angle A'AF=\frac{A'F'}{AF}=\frac{A'F'}{A'A}.
$$

在 $F'B'B$ 的直角投影中，選項 ⑤ 則給出

$$
\tan\angle FF'B=\frac{F'B'}{B'B}=\frac{c}{d}=\frac{a}{b}.
$$

因此正確選項為 ③、⑤，與
[大考中心答案表](https://www.ceec.edu.tw/files/file_pool/1/0m223505388149187989/01-111%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E9%81%B8%E6%93%87%28%E5%A1%AB%29%E9%A1%8C%E7%AD%94%E6%A1%88.pdf)
相符。

## 互動怎麼看

- 拖動「A 的高度」，觀察焦弦另一端 $B$、三條投影線與比值如何同步改變。
- 先看金色的 $A'F'$ 與焦弦，再用 $A'A=AF$ 把選項 ③ 改寫成題目所求的比。
- 看藍色輔助線 $F'B$，確認選項 ⑤ 的正切是 $F'B'/B'B$，而且始終等於題目所求。
