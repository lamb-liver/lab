---
title: 線性規劃
description: 在同一個可行域上疊加約束、目標方向與頂點候選；用三種視角確認線性最優值從哪裡出現。
category: 代數
date: 2026-06-10
order: 0
coverImage: /images/explore-covers/linear-programming.png
featured: false
draft: true
---

## 基本概念

線性規劃可以先看成一張可行域圖。約束決定哪些點留下，目標函數決定等值線往哪個方向掃描，頂點表則把候選解逐一列出。三者都在讀同一個平面區域。

$$
\mathcal F=\{(x,y)\mid a_ix+b_iy\le c_i\},\qquad z=px+qy
$$

本頁不重複每個工具的完整推導，而是把「半平面交集」、「等值線掃描」與「頂點候選」放在同一張圖上，檢查它們是否指向同一個最優位置。

## 互動說明

- **約束視角**：拖動約束直線，觀察哪些半平面共同留下可行域
- **目標視角**：拖動等值線，觀察同一個可行域被目標方向掃過
- **候選視角**：標示頂點與邊段，對照等值線最後接觸的位置

建議順序：約束視角 → 目標視角 → 候選視角。

## 觀察重點

- 約束視角先回答「哪些點可用」；目標視角再回答「往哪個方向變好」。
- 頂點不是另外一套方法，而是等值線掃描到可行域邊界時留下的少數候選。
- 空集合、無界區域與整段邊最優都不是例外裝飾，而是同一張可行域圖的不同狀態。

## 相關作品

- [約束半平面與可行域](/works/lp-feasible-half-planes)
- [目標函數等值線](/works/lp-objective-level-curves)
- [頂點法求最優解](/works/lp-vertex-optimum)

## 延伸閱讀

- [線性規劃（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%B7%9A%E6%80%A7%E8%A6%8F%E5%8A%83)
- [可行域（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%8F%AF%E8%A1%8C%E5%9F%9F)
