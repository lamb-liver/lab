---
title: 有理函數與漸近線
description: 從約分、零點與漸近線讀出有理函數圖形骨架；調整因式參數觀察遠近行為。
category: 代數
date: 2026-06-12
order: 15
coverImage: /images/explore-covers/rational-functions-asymptotes.png
featured: false
draft: false
---

## 基本概念

有理函數是兩個多項式的商：

$$
R(x)=\frac{P(x)}{Q(x)}
$$

其中 $Q$ 不恆為零。判斷漸近線與不連續時，應先看約簡後的 $\dfrac{P(x)}{Q(x)}$。

- **垂直漸近線**：若約去公因式後，$x=a$ 使分母為零而分子不為零，則 $x=a$ 為垂直漸近線；當 $x\to a^\pm$ 時，$R(x)$ 可能趨向 $+\infty$ 或 $-\infty$，圖形沿垂直方向無界
- **可去不連續（洞）**：若分子分母在 $x=a$ 同時為零，約分後可能只剩洞，例如 $\dfrac{x-1}{(x-1)(x+2)}=x+2$（$x\ne 1$）：主體是直線 $y=x+2$，但在 $x=1$ 有一個洞
- **水平漸近線**：由約簡後最高次項決定；$\deg P<\deg Q$ 時遠處趨近 $0$，$\deg P=\deg Q$ 時趨近首項係數比
- **斜漸近線**：當約簡後 $\deg P=\deg Q+1$，長除法得一次式商 $S(x)$；本頁把這種一次式遠處骨架稱為斜漸近線，$R(x)-S(x)\to 0$

不連續點、零點與漸近線一起構成有理函數的「骨架」。

## 互動說明

- **因式**：以倍率 $A$、零點 $r$、漸近線 $a$ 組合 $R(x)=A\dfrac{x-r}{x-a}$，即時更新圖形、零點與垂直漸近線標示
- **洞**：讓分子分母出現共同因式，用「洞標記」開關對照約分後留下的可去不連續
- **水平**：比較約簡後分子與分母的次數，觀察遠處趨近的高度
- **斜漸近線**：當次數差為 $1$ 時顯示一次式商；開「進階模式」可看「約分與拆式」的逐行說明

建議順序：因式 → 洞 → 水平 → 斜漸近線。

## 觀察重點

- 垂直漸近線與洞都來自分母零點，但前者要求約簡後分子不為零，後者是分子分母同根。
- 水平漸近線由約簡後最高次項決定；分子次數低於分母時，遠處趨近 $0$。
- 斜漸近線是本頁所稱的一次式遠處骨架；更高次商不在此頁討論範圍內。

## 相關作品

- [垂直與水平漸近線](/works/rational-vertical-horizontal-asymptotes)
- [斜漸近線與多項式除法](/works/rational-oblique-asymptote)
- [多項式零點與重根](/works/polynomial-roots-multiplicity)
- [函數圖形與方程解集](/explore/function-equations)

## 延伸閱讀

- [有理函數（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%9C%89%E7%90%86%E5%87%BD%E6%95%B8)
- [漸近線（維基百科）](https://zh.wikipedia.org/zh-tw/%E6%BC%B8%E8%BF%91%E7%B7%9A)
