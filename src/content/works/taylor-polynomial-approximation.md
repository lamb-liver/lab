---
title: 泰勒多項式逼近
description: 調整階數 n 與展開中心 a，觀察泰勒多項式如何局部貼合 sin x、cos x、e^x。
tags:
  - 函數與分析
date: 2026-06-11
order: 55
featured: false
draft: false
---

## 參數方程

函數 $f$ 在 $x=a$ 的 $n$ 階泰勒多項式：

$$
T_n(x)=\sum_{k=0}^{n}\frac{f^{(k)}(a)}{k!}(x-a)^k
$$

在 $x=a$ 附近，$T_n$ 與 $f$ 的函數值與前 $n$ 階導數相同。本頁以 $\sin x$、$\cos x$、$e^x$ 為例；經典展開（$a=0$）：

$$
\sin x = x-\frac{x^3}{3!}+\frac{x^5}{5!}-\cdots,\quad
e^x = 1+x+\frac{x^2}{2!}+\cdots,\quad
\cos x = 1-\frac{x^2}{2!}+\frac{x^4}{4!}-\cdots
$$

離開中心愈遠，高階項的影響越明顯；有限階 $T_n$ 只是一個多項式近似，不會在整條實數軸上完全等於 $f$。

## 互動說明

- **函數選擇**：切換 $\sin x$、$\cos x$、$e^x$，觀察各函數的係數規律
- **拖動展開中心 a**：直接在圖上拖動 $a$，觀察逼近最準的位置如何跟著中心平移
- **階數 n**：以滑桿增加 $n$，觀察 $T_n$ 在淡色的原函數上逐步貼合
- **誤差帶**：顯示 $|f(x)-T_n(x)|$，標出近處準、遠處偏離
- **項次分解**：在進階模式展開各次項 $\dfrac{f^{(k)}(a)}{k!}(x-a)^k$ 的疊加，觀察哪一階開始主導修正

## 觀察重點

- 泰勒多項式在 $x=a$ 附近最準；離中心愈遠，有限階數的誤差通常愈大。
- $\sin x$、$\cos x$ 的奇偶次項分離；$e^x$ 各階導數都是 $e^x$，係數遞減最規律。
- 增加 $n$ 會改善局部貼合，但不保證在整個視窗內單調變準（例如高階項在遠處主導）。

## 相關作品

- [切線逼近動畫](/works/tangent-approximation)
- [傅立葉級數](/explore/fourier-series)
- [極限與黎曼和](/explore/limits-riemann-sum)
- [數列與級數](/explore/sequences-and-series)

## 延伸閱讀

- [泰勒級數（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%B3%B0%E5%8B%92%E7%B4%9A%E6%95%B8)
- [麥克勞林公式（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%BA%A5%E5%85%8B%E8%8E%AD%E6%9E%97%E5%85%AC%E5%BC%8F)
