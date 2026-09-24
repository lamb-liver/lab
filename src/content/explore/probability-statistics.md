---
title: 古典機率與條件機率
description: 三個模式都在問同一件事：現在的樣本空間到底是什麼，以及直覺為什麼會失準。
category: 統計
concepts:
  - classical-probability
  - conditional-probability
date: 2026-05-26
order: 10
coverImage: /images/explore-covers/probability-statistics.png
featured: false
draft: false
---

## 基本概念

$$
P(A\mid B)=\frac{P(A\cap B)}{P(B)},\quad P(B)>0
$$

條件機率是在已知 $B$ 已發生的前提下，$A$ 發生的機率；樣本空間縮小到 $B$ 內。

三個模式都在問同一個問題：**現在的樣本空間到底是什麼**。條件機率把它裁到 $B$ 內；蒙提霍爾讓主持人的選擇把它改成不均勻的樣子；中央極限定理則把被觀察的對象從單次試驗換成 $n$ 次試驗的平均。直覺會失準，多半是因為還在用舊的樣本空間回答新的問題。

## 互動說明

- **條件機率**：拖動事件 $A$、$B$ 與交集的比例，觀察樣本空間裁到 $B$ 內之後 $P(A\mid B)$ 如何改變
- **中央極限定理**：調整樣本數與速度並累積統計，觀察重複試驗的平均如何收斂成鐘形
- **蒙提霍爾**：反覆試驗換門與不換門，用累積統計對照長期勝率與直覺的落差

建議順序：條件機率 → 中央極限定理 → 蒙提霍爾。

## 觀察重點

- 三個模式都在換樣本空間：裁到 $B$ 內、讓新資訊把它變得不均勻、或改看 $n$ 次平均而不是單次試驗。
- 直覺失準，多半是還在用舊空間回答新問題；圖上的比例一變，原來「均勻」的讀法就不成立。
- 單次試驗的形狀不必像鐘形；被觀察的對象換成平均之後，同一個機率質量會重新堆積。

## 相關作品

- [條件機率與貝氏定理](/works/conditional-probability-bayes)
- [二項分佈到常態分佈](/works/binomial-to-normal)
- [蒲豐投針](/works/buffon-needle)

## 延伸閱讀

- [貝葉斯定理（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%B2%9D%E8%91%89%E6%96%AF%E5%AE%9A%E7%90%86)
- [中心極限定理（維基百科）](https://zh.wikipedia.org/zh-tw/%E4%B8%AD%E5%BF%83%E6%9E%81%E9%99%90%E5%AE%9A%E7%90%86)
- [蒙提霍爾問題（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%92%99%E6%8F%90%E9%9C%8D%E7%88%BE%E5%95%8F%E9%A1%8C)
