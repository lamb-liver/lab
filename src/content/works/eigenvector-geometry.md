---
title: 特徵向量與伸縮比
description: 切換典型 2×2 矩陣，觀察特徵向量所在直線在變換後仍映到自身、伸縮比由特徵值決定。
tags:
  - 線性代數
date: 2026-06-11
order: 54
featured: false
draft: false
---

## 參數方程

設 $2\times 2$ 矩陣 $A$。非零向量 $\mathbf v\ne\mathbf 0$ 若滿足

$$
A\mathbf v=\lambda\mathbf v
$$

則 $\mathbf v$ 為特徵向量，$\lambda$ 為對應特徵值。幾何上，$\mathbf v$ 所在的過原點直線在變換後仍映到自身，只發生伸縮、反向或壓扁。

$$
\mathbf v' = A\mathbf v = \lambda\mathbf v
$$

若 $\lambda>0$，同向伸縮、長度變為 $|\lambda|$ 倍；若 $\lambda<0$，反向伸縮；若 $\lambda=0$，該方向被壓縮到原點，可視為完全壓扁。當特徵值為複數或無實特徵向量時，平面上找不到這樣的過原點直線。

## 互動說明

- **矩陣預設**：切換伸縮、旋轉、剪切、反射、鞍點、純量矩陣等典型 $A$，觀察特徵方向與網格變形
- **主畫面（預設）**：變換前後網格 ghost、特徵方向線、一般向量 $\mathbf u$ 對照；主體保持簡潔，guide／grid 弱於箭頭與方向線
- **一般向量 $\mathbf u$**：拖動 $\mathbf u$，觀察其方向在變換後偏轉，與落在特徵直線上的向量對照
- **進階模式**：可調矩陣元素 $a,b,c,d$、顯示完整特徵值計算與更多預設；預設畫面不顯示元素滑桿
- **狀態讀數**：右欄以中文＋符號顯示 $\lambda_1,\lambda_2$、$\mathbf v_1,\mathbf v_2$、$\mathbf u$，以及狀態「兩方向／一方向／無實方向」
- **統計區**：右欄同步顯示短式子（至多 3～4 行），例如 $A\mathbf v_1=\lambda_1\mathbf v_1$、$|\lambda_1|$ 伸縮比、$\det A=\lambda_1\lambda_2$

## 觀察重點

- 特徵向量描述「變換後仍落在同一條過原點直線上」的方向；若 $\lambda>0$ 則同向伸縮，若 $\lambda<0$ 則反向伸縮，若 $\lambda=0$ 則壓縮到原點。
- 若有兩個不同的實特徵值，通常會出現兩條特徵方向；重根時可能只有一條，也可能每個方向都是特徵方向。
- 純旋轉（$\theta\ne k\pi$）在實平面上沒有方向不變的非零向量；這與「旋轉會改變所有方向」一致。

## 相關作品

- [線性變換網格](/works/linear-transform-grid)
- [旋轉縮放疊加](/works/rotation-scale-composition)
- [矩陣與線性變換](/explore/matrix-linear-transform)

## 延伸閱讀

- [特徵值與特徵向量（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%89%B9%E5%BE%B5%E5%80%BC%E8%88%87%E7%89%B9%E5%BE%B5%E5%90%91%E9%87%8F)
- [線性映射（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%B7%9A%E6%80%A7%E6%98%A0%E5%B0%84)
