---
title: 反函數鏡射
description: 拖動函數上的點，觀察 (a,b) 沿 y=x 鏡射到反函數上的 (b,a)。
tags:
  - 函數與分析
date: 2026-09-02
featured: false
draft: false
---

## 參數方程

若函數 $f$ 有反函數 $f^{-1}$，則

$$
f^{-1}(f(x))=x
$$

幾何上，$y=f(x)$ 與 $y=f^{-1}(x)$ 關於直線 $y=x$ 對稱：若 $(a,b)$ 在 $y=f(x)$ 上，則 $(b,a)$ 在 $y=f^{-1}(x)$ 上。

## 互動說明

- **函數選擇**：切換線性、限制區間二次（quad+）、未限制二次（quad）與指數函數
- **底數 $q$（指數模式）**：調整 $q^x$ 的底數，觀察指數曲線與其鏡射圖形
- **動點 $P$**：拖動輸入 $x$ 或直接在圖上拖動 $P=(a,b)$，同步顯示鏡射點 $P'=(b,a)$ 與對稱線 $y=x$
- **guide**：開啟後顯示 $P$ 與 $P'$ 的連線與座標軸投影，標示輸入輸出交換
- **水平線測試**：未限制二次函數（quad）時顯示水平線交點數，提示需限制定義域才能形成反函數

## 觀察重點

- 反函數把輸入與輸出交換，圖形沿 $y=x$ 鏡射，而非重新畫一條無關曲線。
- $y=a^x$ 與 $y=\log_a x$ 互為反函數，兩圖形關於 $y=x$ 對稱。
- 不是每個函數都有反函數；限制定義域後，圖形才可能通過水平線測試。

## 相關作品

- [指數與對數](/explore/exponential-logarithm)
- [指數成長與衰減](/works/exponential-growth-decay)
- [自然對數 e 的幾何定義](/works/natural-log-e-geometry)
- [對數尺度](/works/logarithmic-scale)

## 延伸閱讀

- [反函數（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%8F%8D%E5%87%BD%E6%95%B8)
- [水平線檢定法（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%B0%B4%E5%B9%B3%E7%B7%9A%E6%AA%A2%E5%AE%9A%E6%B3%95)
