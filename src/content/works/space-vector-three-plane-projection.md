---
title: 空間向量與三平面投影
description: 拖動空間向量端點，觀察 xy、xz、yz 三個坐標平面投影如何共同描述一支 3D 向量。
tags:
  - 線性代數
date: 2026-06-10
order: 0
featured: false
draft: true
---

## 參數方程

空間向量

$$
\mathbf v=(v_x,v_y,v_z)
$$

長度為 $\|\mathbf v\|=\sqrt{v_x^2+v_y^2+v_z^2}$。在坐標平面上的投影分別為

$$
\mathrm{proj}_{xy}\mathbf v=(v_x,v_y,0),\quad
\mathrm{proj}_{xz}\mathbf v=(v_x,0,v_z),\quad
\mathrm{proj}_{yz}\mathbf v=(0,v_y,v_z)
$$

三個投影是 $\mathbf v$ 在 $xy$、$xz$、$yz$ 平面上的影子；它們用重複分量互相校驗，幫助從不同平面讀同一支 3D 向量。

## 互動說明

- **向量端點**：拖動 $\mathbf v$ 的終點，三軸分量與 $\|\mathbf v\|$ 同步更新
- **三平面投影**：分別顯示 $\mathbf v$ 在 $xy$、$xz$、$yz$ 平面上的投影向量，觀察重複分量如何互相校驗同一支 $\mathbf v$
- **影子重建**：可切換只顯示投影，再疊回原向量，觀察平面影子如何回到 3D 向量
- **視角旋轉**：旋轉 3D 視角觀察投影關係；輔助線以低 alpha 呈現

## 觀察重點

- 投影到坐標平面就是「把某一分量設為零」；$xy$ 投影保留 $x,y$，$xz$ 保留 $x,z$，$yz$ 保留 $y,z$。
- 三個投影各自是降維讀法；放在一起可用重複分量互相校驗，避免只從單一視角誤讀空間方向。
- $\|\mathbf v\|$ 通常大於任一投影的長度；向量愈「斜向」空間，三個影子的組合愈必要。

## 相關作品

- [空間直線與平面交點](/works/line-plane-intersection)
- [平面法向量與點面距離](/works/plane-normal-distance)
- [向量投影與分解](/works/vector-projection)
- [空間向量與平面直線](/explore/space-vectors-planes-lines)

## 延伸閱讀

- [空間向量（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%A9%BA%E9%96%93%E5%90%91%E9%87%8F)
- [投影（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%8A%95%E5%BD%B1)
