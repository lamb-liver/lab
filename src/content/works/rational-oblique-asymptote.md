---
title: 斜漸近線與多項式除法
description: 拖動斜率 m 與截距 b，觀察商式 S(x) 與餘式項如何決定遠處直線趨勢。
tags:
  - 函數與分析
date: 2026-10-26
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

第一版可用可讀參數化，例如

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

- **商式與餘式**：側欄顯示 $R(x)=S(x)+\dfrac{R_{\mathrm{rem}}(x)}{Q(x)}$，觀察商式與餘式如何對應圖形；完整長除法步驟留在正文，不進主畫面
- **主畫面（預設）**：只顯示 $R(x)$ 主曲線、$y=S(x)$ 斜漸近線 guide、垂直漸近線 guide；guide 低 alpha，不比主曲線亮
- **斜漸近線**：疊加 $y=S(x)$ 低透明虛線，觀察 $R(x)$ 在遠處貼近該直線
- **參數調整**：拖動斜率 $m$、截距 $b$、餘式強度 $A$ 與分母零點 $c$，觀察斜漸近線與垂直漸近線如何改變
- **餘式項**：進階模式可顯示 $\dfrac{R_{\mathrm{rem}}(x)}{Q(x)}$ 或誤差 $E(x)=R(x)-S(x)$ 的衰減曲線
- **次數對照**：進階模式可切換約簡後 $\deg P\le\deg Q$，對照水平漸近線與斜漸近線的差異
- **係數模式**：進階模式可改調一般式 $P,Q$ 係數，側欄同步反推 $S(x)$ 與餘式
- **狀態讀數**：右欄以中文＋符號顯示 $m$、$b$、$A$、$c$、餘式項與次數對照開關
- **統計區**：右欄同步顯示短式子（至多 3～4 行），例如 $S(x)=mx+b$、$R(x)=S(x)+\mathrm{rem}/Q$、$E(x)=R(x)-S(x)$、狀態「斜漸近線」

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
