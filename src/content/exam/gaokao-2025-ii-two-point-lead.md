---
title: 領先兩分
description: 四球與三球的領先機率差，比值是勝率比的平方。比值是 4 時，甲的勝率是 2/3。
subject: 高考數學
year: 2025
questionType: 非選
questionNo: '新課標II-19'
unit: 高考數學・新課標II卷・古典機率
topics:
  - 領先兩分
  - 差距比
concepts:
  - classical-probability
sourceUrl: https://zhuanlan.zhihu.com/p/1914991760955912823
relatedExplore:
  - probability-statistics
relatedWorks:
  - buffon-needle
date: 2026-11-11
order: 34
coverImage: /images/exam-covers/gaokao-2025-ii-two-point-lead.png
featured: false
draft: false
---

## 題意

甲每球獲勝的機率是 $p$，乙是 $q=1-p$，且 $\dfrac{1}{2}<p<1$。各球獨立。$p_k$ 是打完 $k$ 球後甲至少領先兩分的機率，$q_k$ 是乙至少領先兩分的機率。

$\dfrac{p_4-p_3}{q_4-q_3}=4$ 時，$p=\dfrac{2}{3}$。而且對每個正整數 $m$，

$$
p_{2m+1}-q_{2m+1}<p_{2m}-q_{2m}<p_{2m+2}-q_{2m+2}.
$$

題幹來自考生回憶，見 [知乎上的這一題解答](https://zhuanlan.zhihu.com/p/1914991760955912823)，另可對照 [高考題庫的題目整理](https://gaokaohub.com/q/item/215520347261238.html)。

## 為什麼會錯

差距比看起來像 $p/q$。看到 4，就解成 $p=\dfrac{4}{5}$。實際的比是 $\left(\dfrac{p}{q}\right)^2$，所以 $p/q=2$，搭配 $p+q=1$ 才得到 $\dfrac{2}{3}$。

四球時也容易只算 4 比 0。3 比 1 同樣至少領先兩分，少算這一項，$p_4$ 就不對。

## 觀念

三球裡，甲至少領先兩分只有三戰全勝，所以 $p_3=p^3$。四球裡，4 比 0 與 3 比 1 都算：

$$
p_4=p^4+4p^3 q.
$$

兩式相減，$p_4-p_3=3p^3 q$。乙那側是 $q_4-q_3=3q^3 p$。比值化成 $\left(\dfrac{p}{q}\right)^2$。

令這個比等於 4，得 $\dfrac{p}{q}=2$。再由 $p+q=1$，得 $p=\dfrac{2}{3}$。

記領先差 $d_k=p_k-q_k$。打完 $2m$ 球時，甲剛好領先兩分、下一球輸掉，就不再領先兩分；乙那側也一樣。甲剛好領先兩分的機率比乙大，所以

$$
d_{2m+1}-d_{2m}=-\binom{2m}{m+1}(pq)^m(p-q)<0.
$$

再打一球，平手的局面可能變成領先。兩球合起來算，

$$
d_{2m+2}-d_{2m}=\binom{2m}{m}(pq)^m(p-q)>0.
$$

## 互動怎麼看

- 拖「甲每球勝率」。金條是甲從三球到四球增加的領先機率，白條是乙的。金條上的刻度是 $p/q$，金條長度是這個數的平方倍白條。
- 勝率停在 $\dfrac{2}{3}$：差距比讀成 4。右圖 3 比 2 矮，4 又比 2 高。
- 往右拖：勝率比變大，差距比照平方長大，白條很快縮短。奇數次仍然先降、再下一個偶數次升高。
