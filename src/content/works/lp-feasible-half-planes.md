---
title: 約束半平面與可行域
description: 拖動約束直線，觀察半平面遮罩與可行域凸多邊形的交集變化。
tags:
  - 線性代數
date: 2026-06-10
order: 0
featured: false
draft: true
---

## 參數方程

第 $i$ 條線性約束

$$
a_ix+b_iy\le c_i
$$

在平面上切出半平面。$m$ 條約束的交集為可行域：

$$
\mathcal F=\{(x,y)\mid a_ix+b_iy\le c_i,\ i=1,\ldots,m\}
$$

若交集有界，$\mathcal F$ 是凸多邊形；若交集無界，則是向某些方向延伸的凸多邊形區域。邊界由約束等號成立的直線段、射線或直線構成。

## 互動說明

- **約束直線**：拖動各約束直線位置；進階模式可調整係數 $a_i,b_i,c_i$，觀察半平面遮罩即時更新
- **可行域高亮**：以低透明填色標示 $\mathcal F$，邊界以低 alpha 線條勾勒
- **頂點標記**：自動計算並標示可行域各頂點座標
- **無解對照**：可選展示約束矛盾時可行域為空的情形

## 觀察重點

- 每一條約束切掉半個平面；可行域是「全部保留」的交集，必為凸集。
- 邊界頂點是兩條約束等號直線的交點；頂點個數隨約束數量與位置改變。
- 係數同乘正數不改變半平面；不等號方向決定保留哪一側。

## 相關作品

- [目標函數等值線](/works/lp-objective-level-curves)
- [頂點法求最優解](/works/lp-vertex-optimum)
- [線性規劃](/explore/linear-programming)

## 延伸閱讀

- [線性不等式（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%B7%9A%E6%80%A7%E4%B8%8D%E7%AD%89%E5%BC%8F)
- [可行域（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%8F%AF%E8%A1%8C%E5%9F%9F)
