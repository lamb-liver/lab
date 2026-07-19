---
title: 斜漸近線與多項式除法
description: 拖動斜率 m 與截距 b，觀察商式 S(x) 與餘式項如何決定遠處直線趨勢。
tags:
  - 函數與分析
date: 2026-06-12
order: 58
featured: false
draft: false
---

## 參數方程

以下次數與長除法皆以約去公因式後的有理函數為準。當 $\deg P=\deg Q+1$ 時，多項式長除法

$$
P(x)=Q(x)\cdot S(x)+R_{\mathrm{rem}}(x),\quad \deg R_{\mathrm{rem}}<\deg Q
$$

給出一次式商 $S(x)$ 與餘式。令

$$
R(x)=\frac{P(x)}{Q(x)}=S(x)+\frac{R_{\mathrm{rem}}(x)}{Q(x)}
$$

因為

$$
\lim_{x\to\pm\infty}\frac{R_{\mathrm{rem}}(x)}{Q(x)}=0
$$

所以圖形在遠處趨近斜漸近線 $y=S(x)$。

本頁互動採用容易閱讀的參數化，例如

$$
R(x)=mx+b+\frac{A}{x-c}
$$

其中 $y=mx+b$ 為斜漸近線，$A$ 控制偏離強度，$x=c$ 為約簡後的分母零點（垂直漸近線）。

例：

$$
\frac{x^2+1}{x}=x+\frac{1}{x}
$$

遠處趨近 $y=x$，且在約簡後 $x=0$ 為垂直漸近線。

## 互動說明

- **斜率 m／截距 b**：調整商式 $S(x)=mx+b$，觀察遠處骨架直線如何移動
- **餘式強度 A／分母零點 c**：改變餘式與垂直漸近線位置，對照近處與遠處的行為差異
- **漸近線**：開啟或關閉斜漸近線與垂直漸近線的輔助虛線
- **進階模式**：顯示餘式 $E(x)=R(x)-S(x)$ 的衰減，以及水平與斜的次數對照

## 觀察重點

- 斜漸近線來自約簡後長除法的商 $S(x)$；餘式次數較低，決定圖形貼近直線的速度。
- 次數判斷應在約簡後進行；$\deg P=\deg Q+1$ 是斜漸近線存在的典型條件。
- 同一有理函數可能同時有垂直漸近線（約簡後分母零點）與斜漸近線（遠處行為），兩者描述不同尺度。

## 相關作品

- [垂直與水平漸近線](/works/rational-vertical-horizontal-asymptotes)
- [多項式零點與重根](/works/polynomial-roots-multiplicity)
- [有理函數與漸近線](/explore/rational-functions-asymptotes)

## 延伸閱讀

- [多項式除法（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%A4%9A%E9%A0%85%E5%BC%8F%E9%99%A4%E6%B3%95)
- [漸近線（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%BC%B8%E8%BF%91%E7%B7%9A)
