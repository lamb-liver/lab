---
title: 散布圖、相關與迴歸線
description: 拖動二維資料點，同步觀察平均點、相關係數 r 與最小平方迴歸線的變化。
tags:
  - 機率統計
date: 2026-10-04
featured: false
draft: true
---

## 參數方程

給定資料 $\{(x_i,y_i)\}$，平均點為

$$
(\bar x,\ \bar y)=\left(\frac{1}{n}\sum x_i,\ \frac{1}{n}\sum y_i\right)
$$

皮爾遜相關係數

$$
r=\frac{\sum (x_i-\bar x)(y_i-\bar y)}{\sqrt{\sum(x_i-\bar x)^2}\sqrt{\sum(y_i-\bar y)^2}}
$$

最小平方迴歸線 $\hat y=a+bx$ 的斜率與截距使殘差平方和 $\sum(y_i-\hat y_i)^2$ 最小，且必過 $(\bar x,\bar y)$。

## 互動說明

- **資料點**：拖動既有點或點擊新增／刪除，觀察點雲、平均點與迴歸線即時更新
- **平均點**：以十字標記 $(\bar x,\bar y)$，並繪製過平均點的參考軸
- **相關係數 r**：側欄顯示 $r$ 值與正負；$|r|$ 接近 $1$ 時點雲趨近線性
- **迴歸線**：疊加 $\hat y=a+bx$，標示殘差垂線段（可選顯示）

## 觀察重點

- 迴歸線必過平均點；這是最小平方解的幾何必然，與點的個別位置無關。
- $r$ 只量測線性一致程度；點雲呈彎曲趨勢時，$r$ 可能接近 $0$ 但仍有明顯關係。
- $r$ 不受平移與正比例縮放影響；若其中一軸乘上負數，相關方向會反轉。

## 相關作品

- [離群值對迴歸的影響](/works/regression-outlier-influence)
- [百分位數與盒鬚圖](/works/percentile-box-plot)
- [數據分析](/explore/data-analysis)

## 延伸閱讀

- [相關（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%9B%B8%E9%97%9C)
- [最小平方方法（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9C%80%E5%B0%8F%E4%BA%8C%E4%B9%98%E6%96%B9%E6%B3%95)
- [散布圖（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%95%A3%E9%83%83%E5%9C%96)
