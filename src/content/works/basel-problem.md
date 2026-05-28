---
title: 巴塞爾問題
description: 以圓周上正弦乘積或幾何級數視覺化 ζ(2) = π²/6。
tags:
  - 分析
  - 級數
date: 2026-05-28
featured: false
draft: false
---

## 參數方程

巴塞爾問題求 $\displaystyle\sum_{n=1}^{\infty}\frac{1}{n^2}$。尤拉證得和為 $\dfrac{\pi^2}{6}$。可用 $\sin x$ 的無窮乘積展開或面積分割，把級數收斂與圓周率平方聯繫在一起。

$$
\zeta(2)=\sum_{n=1}^{\infty}\frac{1}{n^2}=\frac{\pi^2}{6}
$$

部分和 $S_N=\displaystyle\sum_{n=1}^{N}\frac{1}{n^2}$ 單調遞增趨近 $\dfrac{\pi^2}{6}$。

## 互動說明

- **部分和動畫**：$N$ 由小到大，條狀或面積累加逼近 $\pi^2/6$
- **誤差顯示**：即時計算 $|S_N-\pi^2/6|$ 或相對誤差
- **幾何隱喻**：可選繪製與 $\sin x/x$ 零點或圓周等分相關的示意圖層
- **對照級數**：與等比級數、$p$-級數收斂條件對照（連結數列作品）

## 觀察重點

- 部分和模式中，折線單調靠近 $\pi^2/6$，誤差會隨 $N$ 增加下降。
- 比較模式把調和級數、巴塞爾級數與等比級數放在同一座標中，收斂速度差異會直接分開。
- $p$-級數模式中，當 $p\le1$ 時畫面標示發散區域；當 $p>1$ 時部分和會趨近有限值。

## 相關作品

- [等差等比數列的幾何視覺](/works/arithmetic-geometric-sequences)
- [費波那契螺線](/works/fibonacci-spiral)
- [黎曼和動態圖](/works/riemann-sum)

## 延伸閱讀

- [巴塞爾問題（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%B7%B4%E5%A1%9E%E7%88%BE%E5%95%8F%E9%A1%8C)
