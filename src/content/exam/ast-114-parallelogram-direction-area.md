---
title: 邊向定軌的平行四邊形面積
description: 114 分科數甲選填11：平行四邊形邊向定軌，由中心到頂點求面積。
subject: 分科數甲
year: 114
questionType: 選填
questionNo: '11'
unit: 高二數學甲・平面向量
topics:
  - 平行四邊形
  - 向量外積
  - 對角線中點
concepts:
  - vectors
  - dot-cross-product
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0P192554390266335672/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://math.ntnu.edu.tw/~li/108/114G.html
relatedExplore:
  - vectors
relatedWorks:
  - cross-product-geometry
  - vector-addition-scalar
date: 2026-09-17
order: 0
featured: false
draft: true
---

## 題意

坐標平面上的平行四邊形，其中兩邊所在直線與 $5x-y=0$ 平行，另兩邊所在直線與 $3x-2y=0$ 垂直。兩對角線交於 $Q$，且有一頂點 $P$ 滿足 $\overrightarrow{PQ}=(10,-1)$。求面積。

完整題目見[大考中心 114 分科數學甲試卷](https://www.ceec.edu.tw/files/file_pool/1/0P192554390266335672/01-114%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E5%8D%B7.pdf)。

## 為什麼會錯

很多人會先設四個頂點坐標硬解方程組，符號一多就容易算錯。其實邊向已被鎖死，中心到頂點只是半條對角；面積是兩邊向量外積的絕對值，不必把四點都寫出來。

## 觀念

與 $5x-y=0$ 平行的邊方向取 $\mathbf u_0=(1,5)$；與 $3x-2y=0$ 垂直的邊方向取斜率 $-2/3$，即 $\mathbf v_0=(3,-2)$。設邊向量為 $\alpha\mathbf u_0$、$\beta\mathbf v_0$，則

$$
2\overrightarrow{PQ}=\pm(\alpha\mathbf u_0\pm\beta\mathbf v_0).
$$

四組解都滿足 $|\alpha\beta|=12$，而

$$
|\mathbf u_0\times\mathbf v_0|=17,
$$

故面積

$$
|\alpha\beta|\cdot 17=204.
$$

## 互動怎麼看

- 藍、紫虛線是兩族邊向「軌道」。
- 在畫布上拖相鄰頂點（或空白處），會在四組解（半對角組合 × $PQ$ 同向／反向）之間 snap；側欄按鈕也可切換。
- 為什麼不能連續拖？$PQ$ 固定加上兩邊方向鎖死後，可行平行四邊形只有四個離散解，面積恆為 $204$（$|\alpha\beta|=12$ 乘上方向外積 $17$）。
- 對照側欄的 $|\mathbf u\times\mathbf v|$，確認不必逐一解四頂點。
