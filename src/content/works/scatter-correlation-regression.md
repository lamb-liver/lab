---
title: 散布圖、相關與迴歸線
description: 拖動二維資料點，專注觀察點雲方向、相關係數 r 與最小平方迴歸線如何一起變化。
tags:
  - 機率統計
date: 2026-06-21
order: 59
featured: false
draft: false
---

## 參數方程

給定二維資料 $\{(x_i,y_i)\}$。本作品只處理「整體點雲」：平均點、線性一致程度，以及用一條直線描述主要趨勢。平均點為

$$
(\bar x,\ \bar y)=\left(\frac{1}{n}\sum x_i,\ \frac{1}{n}\sum y_i\right)
$$

若兩軸資料都有非零變異，皮爾遜相關係數為

$$
r=\frac{\sum (x_i-\bar x)(y_i-\bar y)}{\sqrt{\sum(x_i-\bar x)^2}\sqrt{\sum(y_i-\bar y)^2}}
$$

當 $x_i$ 不全相同時，最小平方迴歸線 $\hat y=a+bx$ 的斜率與截距使殘差平方和 $\sum(y_i-\hat y_i)^2$ 最小，且必過 $(\bar x,\bar y)$。本頁不單獨分析離群點；單點影響留給〈離群值對迴歸的影響〉。

## 互動說明

- **點雲拖曳**：拖動既有點或新增資料，觀察整體雲團方向如何改變
- **平均點**：以十字標記 $(\bar x,\bar y)$，顯示迴歸線固定穿過的中心
- **相關讀數**：側欄顯示 $r$ 的正負與大小，對照點雲是否接近線性排列
- **迴歸線**：疊加 $\hat y=a+bx$，可選顯示殘差垂線，觀察直線如何折衷所有資料點

## 觀察重點

- 迴歸線必過平均點；平均點像整個點雲的中心鉸鏈，會隨資料分布一起移動。
- $r$ 只量測線性一致程度；彎曲點雲即使有明顯關係，也可能讓 $r$ 接近 $0$。
- 平移或正比例縮放不改變 $r$；改變其中一軸的方向時，相關正負會反轉。

## 相關作品

- [離群值對迴歸的影響](/works/regression-outlier-influence)
- [百分位數與盒鬚圖](/works/percentile-box-plot)
- [數據分析](/explore/data-analysis)

## 延伸閱讀

- [相關（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%9B%B8%E9%97%9C)
- [最小平方方法（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9C%80%E5%B0%8F%E4%BA%8C%E4%B9%98%E6%96%B9%E6%B3%95)
- [散布圖（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%95%A3%E9%83%83%E5%9C%96)
