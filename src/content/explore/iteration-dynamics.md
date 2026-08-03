---
title: 疊代動力學：從收斂到碎形
description: 把一條規則反覆套用，觀察它走向穩定、混沌，還是自我重複的碎形。
category: 分析
concepts:
  - dynamical-system
  - logistic-growth
  - fractal
audience: 大學概念
prerequisites:
  - 數列
  - 函數疊代
date: 2026-08-03
order: 21
coverImage: /images/explore-covers/iteration-dynamics.png
featured: false
draft: false
---

## 基本概念

把同一條規則 $f$ 反覆套在自己的輸出上——$x \to f(x) \to f(f(x)) \to \cdots$——就是「疊代」。動作單純，長期行為卻天差地別：可能收斂到一個固定點、在幾個值之間週期跳動、陷入永不重複的混沌，或在平面上疊出自我相似的碎形。

本頁把疊代的三種面貌並排，讓你看出它們同源：一維的收斂與混沌、參數掃描下的分岔、以及幾何疊代長出的碎形。單件現象的技術細節留給下方各件作品；這裡負責建立「反覆套用同一條規則」這條共同語言。

## 互動說明

- **蛛網圖**：拖動成長率 $r$，看單峰映射 $x_{n+1}=r\,x_n(1-x_n)$ 的軌道沿 $y=x$ 反覆彈跳——收斂、週期或混沌一眼可辨。
- **分岔圖**：掃過 $r$ 的範圍，讓畫面把每個 $r$ 的長期落點畫成點，觀察週期倍增如何一路通往混沌。
- **混沌遊戲**：切換到幾何疊代模式，隨機反覆套用收縮映射，看散點逐步生成謝爾賓斯基三角形這類自我相似的碎形。

## 觀察重點

- 同一個「反覆套用」的動作，在 $r$ 小時收斂、$r$ 大時混沌——穩定與混沌只隔一個參數。
- 分岔圖的週期倍增窗口與混沌帶，對照蛛網圖在同一個 $r$ 的軌道，兩種表徵指向同一件事。
- 幾何疊代換成平面上的映射，核心仍是「把規則套在自己的輸出上」——碎形是疊代的空間版。

## 相關作品

- [單峰映射分岔圖](/works/logistic-bifurcation)
- [謝爾賓斯基三角形](/works/sierpinski-triangle)
- [碎形仿射疊代](/works/affine-ifs-fractal)
- [朱利亞集合](/works/julia-set)

## 延伸閱讀

- [邏輯斯蒂映射（維基百科）](https://zh.wikipedia.org/wiki/邏輯斯諦映射)
- [碎形（維基百科）](https://zh.wikipedia.org/wiki/碎形)
