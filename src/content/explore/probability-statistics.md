---
title: 古典機率與條件機率
description: 從條件機率與貝氏定理出發；觀察二項逼近常態、蒲豐投針與蒙提霍爾悖論。
category: 統計
date: 2026-07-06
coverImage: /images/explore-covers/probability-statistics.png
featured: false
draft: false
---

## 基本概念

$$
P(A\mid B)=\frac{P(A\cap B)}{P(B)},\quad P(B)>0
$$

條件機率是在已知 $B$ 已發生的前提下，$A$ 發生的機率；樣本空間縮小到 $B$ 內。

## 互動說明

- **貝氏定理**：把 $P(A\mid B)$ 與 $P(B\mid A)$ 重新排列，從結果回推原因的可信度
- **中央極限定理**：重複試驗的標準化平均趨近常態，說明自然界常見鐘形曲線的來源
- **蒙提霍爾問題**：三門問題中，主持人開門帶來資訊，直覺機率常與正確答案不符

建議順序：條件機率（韋恩圖或面積）→ 貝氏更新 → 二項／常態 → 蒙提霍爾。

## 觀察重點

- 條件機率的幾何意義是把樣本空間裁剪到 $B$ 內，再量 $A$ 所占比例
- 當 $p$ 固定且 $np$、$n(1-p)$ 夠大時，二項分佈愈接近常態，與「數列與級數」主題中的收斂直覺呼應
- 蒙提霍爾的關鍵在於主持人的選擇傳遞了額外資訊，不能當成純隨機換門

## 相關作品

- [條件機率與貝氏定理](/works/conditional-probability-bayes)
- [二項分佈到常態分佈](/works/binomial-to-normal)
- [蒲豐投針](/works/buffon-needle)

## 延伸閱讀

- [貝葉斯定理（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%B2%9D%E8%91%89%E6%96%AF%E5%AE%9A%E7%90%86)
- [中心極限定理（維基百科）](https://zh.wikipedia.org/zh-tw/%E4%B8%AD%E5%BF%83%E6%9E%81%E9%99%90%E5%AE%9A%E7%90%86)
- [蒙提霍爾問題（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%92%99%E6%8F%90%E9%9C%8D%E7%88%BE%E5%95%8F%E9%A1%8C)
