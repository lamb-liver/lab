---
title: 空間向量與平面直線
description: 用投影讀分量、用外積讀面與法向、用內積讀線面關係；建立 3D 幾何的共同讀圖語言。
category: 幾何
date: 2026-06-10
order: 0
coverImage: /images/explore-covers/space-vectors-planes-lines.png
featured: false
draft: true
---

## 基本概念

空間題目最容易混亂的不是公式，而是同一個物件在不同圖上扮演不同角色。向量可當作位移，也可投影成三個平面影子；兩支向量可張成面，外積給出法向；法向再透過內積描述平面、線面交點與點面距離。

$$
\mathbf v=(v_x,v_y,v_z),\qquad \mathbf n\cdot\mathbf r=h
$$

本頁不完整推導每個公式，而是把投影、外積、內積放在同一套 3D 讀圖流程中：先定位向量，再讀出平面方向，最後判斷直線與平面的關係。

## 互動說明

- **投影讀分量**：拖動空間向量，觀察 $xy$、$xz$、$yz$ 影子如何互相校驗
- **外積讀法向**：拖動兩支向量，觀察張成平面、面積與法向方向
- **內積讀平面**：調整法向量、直線方向與測試點，觀察交點、平行與距離狀態

建議順序：投影讀分量 → 外積讀法向 → 內積讀線面關係。

## 觀察重點

- 三個坐標投影保留不同分量；重複分量是校驗同一支 3D 向量的線索。
- 外積把兩支方向轉成一支法向；它把「張成一個面」改寫成「垂直於這個面」。
- 內積用法向量量沿垂直方向的分量；線面交點、平行與點面距離都是這個讀法的不同狀態。

## 相關作品

- [外積的幾何意義](/works/cross-product-geometry)
- [空間向量與三平面投影](/works/space-vector-three-plane-projection)
- [空間直線與平面交點](/works/line-plane-intersection)
- [平面法向量與點面距離](/works/plane-normal-distance)

## 延伸閱讀

- [空間向量（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%A9%BA%E9%96%93%E5%90%91%E9%87%8F)
- [平面（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B9%B3%E9%9D%A2)
- [空間中的直線（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%9B%B4%E7%B7%9A#%E7%A9%BA%E9%96%93%E4%B8%AD%E7%9A%84%E7%9B%B4%E7%B7%9A)
