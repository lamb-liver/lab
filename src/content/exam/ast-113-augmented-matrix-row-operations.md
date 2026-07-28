---
title: 相同列運算的線性組合
description: 113 分科數甲選填 9：利用相同列運算保留線性組合，求出新聯立方程組的解。
subject: 分科數甲
year: 113
questionType: 選填
questionNo: '9'
unit: 高二數學A・矩陣與線性方程組
concepts:
  - 增廣矩陣
  - 列運算
  - 線性組合
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0o221359215605202263/113%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E9%A1%8C.pdf
analysisUrl: https://www.ceec.edu.tw/xcepaper/cont?qunit=0O241581647352902046&sid=0O260306744213652490&xsmsid=0J066588036013658199
relatedExplore:
  - matrix-linear-transform
relatedWorks:
  - linear-transform-grid
date: 2026-07-28
order: 8
coverImage: /images/exam-covers/ast-113-augmented-matrix-row-operations.png
featured: false
draft: false
---

## 題意

兩個聯立方程組有相同的係數 $a,b,c,d$，只有等號右側不同。題目給出兩個增廣矩陣經過
同一串列運算後的結果，要求找出右側改成 $(0,1)$ 時的解。完整數值與作答格式見
[大考中心 113 分科測驗數學甲試卷](https://www.ceec.edu.tw/files/file_pool/1/0o221359215605202263/113%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E9%A1%8C.pdf)。

## 為什麼會錯

大考中心的[試題特色分析](https://www.ceec.edu.tw/xcepaper/cont?qunit=0O241581647352902046&sid=0O260306744213652490&xsmsid=0J066588036013658199)
記錄本題得分率為 $42\%$、鑑別度為 $0.68$。容易卡住的地方，是只把列運算看成一串機械計算，
沒有注意到「同一串」列運算會讓右側常數保留原本的倍數與相加關係。若先反求
$a,b,c,d$ 也能作答，但會多解兩組聯立方程式。

## 觀念

把兩個已知方程組的右側記成

$$
\mathbf b_1=(2,1),\qquad \mathbf b_2=(-1,-1).
$$

目標右側可直接寫成

$$
(0,1)=-\mathbf b_1-2\mathbf b_2.
$$

已知兩組增廣矩陣經過相同列運算後，右側分別變成 $(3,2)$ 與 $(2,-1)$。
相同的倍數與相加關係仍成立，因此目標右側經列運算後是

$$
-(3,2)-2(2,-1)=(-7,0).
$$

所以最後的增廣矩陣代表

$$
\begin{cases}
x-y=-7,\\
y=0.
\end{cases}
$$

答案為 $x=-7$、$y=0$。

## 互動怎麼看

- 調整組合係數 $\alpha$、$\beta$，比較原常數、列運算後常數與解如何同步改變。
- 按下「回到原題」，確認 $\alpha=-1$、$\beta=-2$ 時，原常數正好是 $(0,1)$。
- 觀察中間的增廣矩陣；第二列先讀出 $y$，再由第一列的 $x-y$ 求出 $x$。
