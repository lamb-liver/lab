---
title: 正弦定理與餘弦定理
description: 拖動三角形頂點，切換正弦定理與餘弦定理，即時驗證邊角關係與外接圓半徑。
tags:
  - 幾何
date: 2026-06-10
order: 46
featured: false
draft: false
---

## 參數方程

任意三角形三邊 $a,b,c$ 所對角為 $A,B,C$。正弦定理

$$
\frac{a}{\sin A}=\frac{b}{\sin B}=\frac{c}{\sin C}=2R
$$

其中 $R$ 為外接圓半徑。餘弦定理

$$
c^2 = a^2 + b^2 - 2ab\cos C
$$

當 $C=90^\circ$ 時退化為勾股定理 $c^2=a^2+b^2$。

## 互動說明

- **拖動頂點**：改變三角形形狀，三邊長與三個角即時更新
- **正弦定理**：標示外接圓與 $2R$，驗證 $a/\sin A$ 等三個比值相等
- **餘弦定理**：高亮夾角 $C$ 與三邊，顯示 $a^2+b^2-2ab\cos C$ 與 $c^2$ 的數值對照
- **鈍角三角形**：拖成鈍角時兩式仍成立，觀察 $\cos C<0$ 時第三項為加長修正

## 觀察重點

- 正弦定理把邊長與對角正弦綁在同一比例；外接圓半徑 $R$ 是這個比例的幾何量
- 餘弦定理是勾股定理加上夾角修正；直角時 $\cos C=0$，式子回到 $c^2=a^2+b^2$
- 已知兩角一邊、三邊、或兩邊夾角時，分別適用正弦定理或餘弦定理求其餘未知量

## 相關作品

- [單位圓與三角函數定義](/works/unit-circle-trig-definition)
- [三角恆等式與角度合成](/works/trig-angle-identities)
- [三角函數的幾何定義與恆等式](/explore/trigonometry-fundamentals)

## 延伸閱讀

- [正弦定理（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%AD%A3%E5%BC%A6%E5%AE%9A%E7%90%86)
- [餘弦定理（維基百科）](https://zh.wikipedia.org/zh-tw/%E9%A4%98%E5%BC%A6%E5%AE%9A%E7%90%86)
