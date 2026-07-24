---
title: 抽獎等待與幾何分佈
description: 113 分科數甲多選 4：用幾何分佈判斷等待次數、有限次中獎率與九成門檻。
subject: 分科數甲
year: 113
questionType: 多選
questionNo: '4'
unit: 高三選修數甲・機率與隨機變數
concepts:
  - 幾何分佈
  - 期望值
  - 無窮等比級數
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0o221359215605202263/113%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E9%A1%8C.pdf
analysisUrl: https://math.ntnu.edu.tw/~li/108/113G.html
relatedExplore:
  - discrete-random-variables
  - sequences-and-series
relatedWorks:
  - binomial-geometric-distribution
  - arithmetic-geometric-sequences
date: 2026-07-24
order: 5
coverImage: /images/exam-covers/ast-113-geometric-distribution.png
featured: false
draft: false
---

## 題意

某抽獎每次成功機率固定為 $0.1$，每抽一次消耗一個代幣。題目要求判斷第一次成功的平均等待次數、
有限個代幣帶來的中獎率，以及要讓中獎率超過九成所需的最少代幣數。完整題目與選項見
[大考中心 113 分科測驗數學甲試卷](https://www.ceec.edu.tw/files/file_pool/1/0o221359215605202263/113%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E9%A1%8C.pdf)。

## 為什麼會錯

大考中心的[試題特色分析](https://www.ceec.edu.tw/xcepaper/cont?qunit=0O241581647352902046&sid=0O260306744213652490&xsmsid=0J066588036013658199)
記錄本題得分率為 $56\%$、鑑別度為 $0.42$。常見錯誤是把「兩次至少中一次」直接寫成
$0.1+0.1$，或把機率會趨近 $1$ 說成有限次就能保證等於 $1$。另一個陷阱是忽略「大於九成」
是嚴格不等式。

## 觀念

令 $X$ 表示第一次中獎所需的抽獎次數，則

$$
P(X=k)=0.9^{k-1}\cdot0.1,\qquad k=1,2,\ldots
$$

這是從 $1$ 開始計數的幾何分佈，期望值為

$$
E(X)=\frac{1}{0.1}=10.
$$

若有 $n$ 個代幣，至少中獎一次的機率應從反事件計算：

$$
P(\text{至少中一次})=1-P(\text{全部沒中})=1-0.9^n.
$$

兩次的中獎率是 $1-0.9^2=0.19$，不是 $0.2$。要讓中獎率嚴格大於 $0.9$，
需解 $0.9^n<0.1$，最小整數為 $n=22$。任何有限的 $n$ 都仍有 $0.9^n>0$，
所以中獎率只會趨近 $1$，不會保證等於 $1$。

## 互動怎麼看

- 調整代幣數 $n$，直接比較 $1-0.9^n$ 與九成門檻。
- 直方圖累積一萬次「等到第一次中獎」的等待次數；最右格合併所有 $X\geq24$。
- 下方折線追蹤樣本平均，樣本增加時會逐漸靠近期望值 $10$。
