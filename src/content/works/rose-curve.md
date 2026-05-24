---
title: 玫瑰曲線
description: 以極座標方程 r = a·cos(kθ) 描繪的玫瑰線圖形，參數 k 決定花瓣數量。
tags:
  - 幾何
  - 三角函數
date: 2026-01-15
featured: true
draft: false
---

## 參數方程

玫瑰曲線的一般形式為：

$$
r = a\cos(k\theta)
$$

當 k 為整數時，若 k 為奇數則有 k 片花瓣；若 k 為偶數則有 2k 片花瓣。

## 實作要點

- 讓參數 θ 從 0 到 2π 逐漸增加來進行描點
- 將極座標轉換為笛卡爾座標繪製
- 可透過滑桿調整 k 與振幅 a

## 延伸閱讀

- [玫瑰線（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%8E%AB%E7%91%B0%E7%BA%BF)
