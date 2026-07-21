---
title: 外積的幾何意義
description: 拖動兩支空間向量，觀察平行四邊形面積、法向 n 與夾角 θ 的同步讀數。
tags:
  - 線性代數
date: 2026-07-21
order: 63
featured: false
draft: false
---

## 參數方程

對 $\mathbf a,\mathbf b\in\mathbb R^3$，外積 $\mathbf a\times\mathbf b$ 同時給出面積與法向：

$$
\|\mathbf a\times\mathbf b\|=\|\mathbf a\|\,\|\mathbf b\|\sin\theta
$$

其中 $\theta$ 為兩向量夾角。$\mathbf a\times\mathbf b$ 垂直於 $\mathbf a$ 與 $\mathbf b$ 張成的平面，方向依右手定則決定。若 $\mathbf a,\mathbf b$ 平行，或其中一個為零向量，則 $\mathbf a\times\mathbf b=\mathbf 0$。

## 互動說明

- **夾角 θ**：拖動 $\theta$，觀察面積依 $\|\mathbf a\times\mathbf b\|=|\mathbf a||\mathbf b|\sin\theta$ 改變；$\theta$ 趨近 $0°$ 或 $180°$ 時平行四邊形塌成一條線
- **長度 |b|**：只放大 $|\mathbf b|$，觀察面積成正比增加，但法向指的方向不變
- **傾斜 φ**：讓 $\mathbf b$ 繞 $\mathbf a$ 旋轉，觀察張成平面跟著傾斜、法向一起轉，夾角與面積卻不變
- **面積 ‖a × b‖／右手定則**：切換兩種讀法，比較「量面積」與「定方向」各自關心什麼
- **拖動畫面旋轉視角**：轉動整個場景，確認 $\mathbf n$ 真的垂直於 $\mathbf a,\mathbf b$ 張成的平面

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
