---
title: 函數圖形變換
description: 拖動 a、b、h、k 觀察 y=a f(b(x-h))+k 如何對基本函數造成平移、伸縮與翻轉。
tags:
  - 函數與分析
date: 2026-09-05
featured: false
draft: false
---

## 參數方程

從基本函數 $f(x)$ 出發，一般變換式為

$$
y=a\,f\bigl(b(x-h)\bigr)+k
$$

- **$h,k$**：水平、垂直平移
- **$a$**：垂直伸縮；$a<0$ 時上下翻轉
- **$b$**：水平伸縮；$|b|>1$ 時圖形在 $x$ 方向壓縮，$0<|b|<1$ 時拉伸

畫面同時顯示 ghost 基本曲線與變換後曲線，方便對照「同一函數族」如何改形。

## 互動說明

- **基底函數**：切換 $f(x)=x$、$x^2$、$x^3$、$|x|$ 等，觀察變換式在不同形狀上的效果
- **平移 $h,k$**：拖動 $h,k$，觀察圖形整體左右、上下移動
- **伸縮 $a,b$**：拖動 $a,b$，觀察開口寬窄、水平壓縮與 $a<0$ 時的翻轉

## 觀察重點

- $h,k$ 只改位置，不改形狀；$a,b$ 改變開口與寬窄，$a$ 的符號決定是否上下翻轉。
- 同一組 $(a,b,h,k)$ 作用在不同基底上，變換規則相同，但視覺效果隨 $f$ 的彎曲程度而異。
- 二次函數的頂點式 $a(x-h)^2+k$ 可視為對 $y=x^2$ 施加這套變換的特例。

## 相關作品

- [函數與方程](/explore/function-equations)
- [二次函數配方視覺化](/works/quadratic-completing-square)
- [仿射變換圖樣](/works/affine-transform-pattern)

## 延伸閱讀

- [函數圖形（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%87%BD%E6%95%B8%E5%9C%96%E5%BD%A2)
- [平移（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B9%B3%E7%A7%BB)
