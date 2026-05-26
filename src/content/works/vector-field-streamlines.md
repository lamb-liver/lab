---
title: 向量場流線
description: 沿向量場方向積分得到的軌跡，展示微分方程解的幾何圖像。
tags:
  - 分析
  - 微積分
date: 2026-07-06
featured: false
draft: false
---

## 參數方程

給定向量場 $\mathbf{F}(x,y)=(F_x,F_y)$，流線是下列常微分方程的解：

$$
\frac{dx}{dt}=F_x(x,y),\quad
\frac{dy}{dt}=F_y(x,y)
$$

等價寫法：

$$
\frac{d\mathbf{r}}{dt}=\mathbf{F}(\mathbf{r}(t))
$$

可視為方向場的積分曲線，用於理解梯度、旋度與一階微分方程的解。

本場取漩渦加擾動：

$$
F_x = \frac{-y}{x^2+y^2+\varepsilon} + 0.25\sin(2y + 0.8t),\quad
F_y = \frac{x}{x^2+y^2+\varepsilon} + 0.25\cos(2x + 0.8t)
$$

$\varepsilon$ 避免原點除零；方向垂直半徑，整體呈旋轉流。

## 實作要點

- **RK2 中點積分**：$\mathbf{p}_{n+1}=\mathbf{p}_n + h\,\mathbf{F}\!\left(\mathbf{p}_n + \tfrac{h}{2}\mathbf{F}(\mathbf{p}_n)\right)$，高速旋轉區仍較穩定
- **種子分布**：角度均分 $2\pi i/N$，半徑 $1.2 + 0.25\sin(1.5t + i)$ 呼吸圓環
- **邊界裁切**：$|x|,|y|>5$ 時停止積分，避免軌跡發散佔滿畫布
- **固定視覺縮放**：世界座標 $\times 120$ 映射至螢幕（中心對稱），數學層不混入相機 lerp
- **每幀重建**：流線數、步數或 $t$ 變更即重算全部軌跡；起點節點高亮
- **數學與動畫分離**：場定義與積分規則在 `geometry`；$t$ 累加與種子相位在 `animation`

## 相關連結

- 視覺化主題：[極限與黎曼和](/explore/limits-riemann-sum)
- 相關作品：[黎曼和動態圖](/works/riemann-sum)、[切線逼近動畫](/works/tangent-approximation)、[曳物線](/works/catenary)、[等角螺線](/works/equiangular-spiral)

## 延伸閱讀

- [場線（維基百科）](https://zh.wikipedia.org/zh-tw/%E5%A0%B4%E7%B7%9A)
