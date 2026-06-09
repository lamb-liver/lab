---
title: 外積的幾何意義
description: 拖動兩支空間向量，觀察平行四邊形面積、法向 n 與夾角 θ 的同步讀數。
tags:
  - 線性代數
date: 2026-10-21
featured: false
draft: true
---

## 參數方程

對 $\mathbf a,\mathbf b\in\mathbb R^3$，外積 $\mathbf a\times\mathbf b$ 同時給出面積與法向：

$$
\|\mathbf a\times\mathbf b\|=\|\mathbf a\|\,\|\mathbf b\|\sin\theta
$$

其中 $\theta$ 為兩向量夾角。$\mathbf a\times\mathbf b$ 垂直於 $\mathbf a$ 與 $\mathbf b$ 張成的平面，方向依右手定則決定。若 $\mathbf a,\mathbf b$ 平行，或其中一個為零向量，則 $\mathbf a\times\mathbf b=\mathbf 0$。

## 互動說明

- **向量端點**：拖動 $\mathbf a,\mathbf b$ 的終點，面積 $\|\mathbf a\times\mathbf b\|$ 與夾角 $\theta$ 同步更新
- **主畫面（預設）**：只顯示 $\mathbf a$、$\mathbf b$、平行四邊形、$\mathbf n=\mathbf a\times\mathbf b$ 與面積讀數；主體保持簡潔，guide／輔助線弱於向量與法向箭頭
- **平行四邊形**：以 $\mathbf a,\mathbf b$ 為鄰邊繪製半透明平行四邊形，面積標註對應 $\|\mathbf a\times\mathbf b\|$
- **平行判定**：當兩向量近共線或退化為零向量時，面積趨近零、法向箭頭縮短並提示「近平行／退化」
- **進階模式**：可播放右手定則動畫、顯示分量公式、演示交換 $\mathbf a,\mathbf b$ 後法向反轉；預設畫面不常駐動畫
- **狀態讀數**：右欄以中文＋符號顯示 $\mathbf a$、$\mathbf b$、$\mathbf n$、$\|\mathbf a\times\mathbf b\|$、$\theta$，以及狀態「一般／近平行／退化」
- **統計區**：右欄同步顯示短式子（至多 3～4 行），例如 $\mathbf n=\mathbf a\times\mathbf b$、$\|\mathbf n\|=\|\mathbf a\|\|\mathbf b\|\sin\theta$、$\theta=\cdots$

## 觀察重點

- 外積量的是兩向量張成的平行四邊形面積；其大小為 $\|\mathbf a\times\mathbf b\|$。
- $\mathbf a\times\mathbf b$ 的方向垂直於 $\mathbf a,\mathbf b$ 張成的平面，並由右手定則決定。
- 交換順序會反轉法向：$\mathbf b\times\mathbf a=-\mathbf a\times\mathbf b$。
- 兩向量平行或退化為零向量時，外積為零，表示沒有張成真正的二維面。

## 相關作品

- [空間向量與三平面投影](/works/space-vector-three-plane-projection)
- [平面法向量與點面距離](/works/plane-normal-distance)
- [向量投影與分解](/works/vector-projection)
- [空間向量與平面直線](/explore/space-vectors-planes-lines)

## 延伸閱讀

- [叉積（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%8F%89%E7%A9%8D)
- [右手定則（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%8F%B3%E6%89%8B%E5%AE%9A%E5%89%87)
