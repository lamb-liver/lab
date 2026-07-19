---
title: 數據分析
description: 同一批資料可在點雲、影響力與排序三種視角間切換；比較平均、離群與分位位置如何改變讀圖結論。
category: 統計
date: 2026-06-21
order: 17
coverImage: /images/explore-covers/data-analysis.png
featured: false
draft: false
---

## 基本概念

一批資料不只是一串數字，也是一組可切換的讀圖視角。二維資料 $\{(x_i,y_i)\}$ 可以先看成點雲與平均位置；其中某一點被移得很遠時，它可能改變整體趨勢；若只保留單一數值欄，資料又變成排序後的位置結構。

$$
\{(x_i,y_i)\}\quad\longrightarrow\quad \text{point cloud / influence / ordered values}
$$

本頁的重點不是推導每個統計量，而是比較同一筆資料在「整體方向」、「單點影響」、「排序分佈」三種讀法下會強調不同訊號。

## 互動說明

- **散布與迴歸**：拖動資料點，把這批資料先讀成點雲的整體方向與平均位置
- **離群值影響**：只移動一個高亮點，對照它是否足以改寫主體趨勢
- **百分位盒鬚**：切到一維資料，觀察同一組數值如何被中位數、四分位與尾端離群切開

建議順序：散布與迴歸 → 離群值影響 → 百分位盒鬚。

## 觀察重點

- 同一批資料在點雲中先呈現方向，在離群對照中呈現影響力，在盒鬚圖中呈現排序後的位置結構。
- 平均與迴歸容易被少數高影響點拉動；中位數與四分位則先問資料排序後中間區間在哪裡。
- 離群不是單一判定，而是讀圖視角：在二維圖上看它拉不拉動趨勢，在一維圖上看它是否落在主要分佈尾端之外。

## 相關作品

- [散布圖、相關與迴歸線](/works/scatter-correlation-regression)
- [離群值對迴歸的影響](/works/regression-outlier-influence)
- [百分位數與盒鬚圖](/works/percentile-box-plot)

## 延伸閱讀

- [相關（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%9B%B8%E9%97%9C)
- [最小平方方法（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9C%80%E5%B0%8F%E4%BA%8C%E4%B9%98%E6%96%B9%E6%B3%95)
- [箱線圖（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%AE%B1%E7%B7%9A%E5%9C%96)
- [百分位數（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%99%BE%E5%88%86%E4%BD%8D%E6%95%B8)
