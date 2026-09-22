---
title: 梯度與等位線
description: 拖動平面上的點，觀察等位線與梯度垂直、並指向函數增加最快的方向。
tags:
  - 函數與分析
concepts:
  - derivative-tangent
audience: 大學概念
prerequisites:
  - 導數
  - 平面向量
date: 2026-09-22
order: 70
featured: false
draft: false
---

## 參數方程

二元函數 $f(x,y)$ 的等位線是 $f(x,y)=c$ 的點集合；梯度 $\nabla f$ 是偏導數組成的向量，指向 $f$ 增加最快的方向，並垂直於通過該點的等位線。

$$
\nabla f=\left(\frac{\partial f}{\partial x},\frac{\partial f}{\partial y}\right)
$$

本頁用三個典型例子：圓等位線 $f=x^2+y^2$（梯度沿半徑向外）、鞍面 $f=x^2-y^2$、直角雙曲 $f=xy$。線性目標 $z=px+qy$ 的平行等值線見[目標函數等值線](/works/lp-objective-level-curves)。

## 互動說明

- **圓 x²+y²／鞍 x²−y²／雙曲 xy**：切換三種函數，觀察等位線從圓變成兩族雙曲線
- **等位線族**：疊上相鄰幾條等位線，對照目前通過測試點的那一條
- **拖動測試點**：在圖上拖動 $P$，讀出 $f(P)$ 與 $\nabla f(P)$。金色箭頭是梯度，淡線是等位線在 $P$ 的切線，兩者保持垂直
- 把測試點移到原點時，梯度箭頭消失，畫面標示臨界點 $\nabla f=\mathbf 0$

## 觀察重點

- 梯度垂直於等位線：沿切線移動時 $f$ 幾乎不變，沿箭頭移動時 $f$ 變化最快。
- $\|\nabla f\|$ 愈大，同樣位移造成的函數變化愈劇；讀數裡的 $\|\nabla f\|$ 在原點附近變小，臨界點時箭頭消失。
- 圓的梯度沿半徑；鞍面與 $xy$ 的等位線是雙曲線，梯度仍垂直於該點的切線，只是不再指向原點。

## 相關作品

- [目標函數等值線](/works/lp-objective-level-curves)
- [向量場的基本圖樣](/works/vector-field-patterns)
- [切線逼近動畫](/works/tangent-approximation)
- [原函數與導函數圖形對照](/works/function-derivative-graph)

## 延伸閱讀

- [梯度（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%A2%AF%E5%BA%A6)
- [等值線（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%AD%89%E5%80%BC%E7%B7%9A)
