---
title: 數據分析
description: 從散布點雲讀相關與迴歸；拖動離群值觀察斜率變化，再以百分位數與盒鬚圖讀分布結構。
category: 統計
date: 2026-10-02
coverImage: /images/explore-covers/data-analysis.png
featured: false
draft: true
---

## 基本概念

二維資料集 $\{(x_i,y_i)\}$ 可先讀成平面上的點雲。平均點 $(\bar x,\bar y)$ 是各軸的重心；相關係數 $r$ 量測兩軸一起偏離平均的線性一致程度：

$$
r=\frac{\sum (x_i-\bar x)(y_i-\bar y)}{\sqrt{\sum(x_i-\bar x)^2}\sqrt{\sum(y_i-\bar y)^2}}
$$

最小平方迴歸線 $\hat y=a+bx$ 則給出「用 $x$ 線性預測 $y$」的最佳直線。單變量資料的一維分布則可用百分位數切分：$Q_1$、中位數 $Q_2$、$Q_3$ 與盒鬚圖同時呈現集中區間與離群點。

## 互動說明

- **散布與迴歸**：拖動或增刪資料點，觀察平均點、相關係數 $r$ 與迴歸線同步更新
- **離群值影響**：主體資料固定，只拖動一個離群點；同時對照無離群基準線與加入離群後的迴歸線
- **百分位與盒鬚**：輸入或拖動一維資料，觀察 $Q_1$、$Q_2$、$Q_3$、四分位距與盒鬚圖輪廓

建議順序：散布圖與 $r$ → 離群值 → 盒鬚圖。

## 觀察重點

- 平均點是兩軸各自的重心；$r$ 只看線性趨勢強弱與正負，不表示因果，也不隨座標尺度改變。
- 迴歸線必過 $(\bar x,\bar y)$；離群點對迴歸線的影響不只取決於它離直線多遠，也取決於它在 $x$ 方向離平均點多遠；這就是槓桿效應。
- 盒鬚圖把分布切成四分位區間；極端離群與散布圖中的離群點是同一概念在單變量與雙變量下的不同呈現。

## 相關作品

- [散布圖、相關與迴歸線](/works/scatter-correlation-regression)
- [離群值對迴歸的影響](/works/regression-outlier-influence)
- [百分位數與盒鬚圖](/works/percentile-box-plot)

## 延伸閱讀

- [相關（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%9B%B8%E9%97%9C)
- [最小平方方法（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9C%80%E5%B0%8F%E4%BA%8C%E4%B9%98%E6%96%B9%E6%B3%95)
- [箱線圖（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%AE%B1%E7%B7%9A%E5%9C%96)
- [百分位數（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%99%BE%E5%88%86%E4%BD%8D%E6%95%B8)
