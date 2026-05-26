---
title: 等角螺線
description: 極徑與極角成指數關係 r = ae^(bθ)，任意過原點射線與曲線交角恆定。
tags:
  - 幾何
  - 微積分
date: 2026-07-05
featured: false
draft: false
---

## 參數方程

等角螺線（對數螺線）可寫為：

$$
r = ae^{b\theta}
$$

對應笛卡兒座標：

$$
x = ae^{b\theta}\cos\theta,\quad
y = ae^{b\theta}\sin\theta
$$

其中 $a>0$、$b\in\mathbb{R}$，且曲線切線與過原點射線夾角為常數 $\arctan(1/b)$。

## 實作要點

- **數學與動畫分離**：幾何層只算 $r=a e^{b\theta}$ 的笛卡兒點列；旋轉由渲染層 `rotate(time)` 疊加，不污染參數方程
- **對數式取景**：依終點半徑 $\max(|x|,|y|)$ 自適應 zoom（約 34% 畫布），調 $b$ 或 $\theta_{\max}$ 時外圍螺距視覺密度大致穩定
- **Reveal 域**：主線 $\theta \le \theta_{\mathrm{reveal}}$，其中 $\theta_{\mathrm{reveal}}=\min(\theta_{\max}\cdot 0.72 + \sin(0.7t)\cdot 0.08\theta_{\max},\,\theta_{\max})$；ghost 繪製至 $\theta_{\max}$
- **參數平滑**：$b$、$\theta_{\max}$ 以 lerp 跟隨滑桿；路徑僅在平滑值變更時重建
- **Glow 層次**：ghost 弱光全貌 + active 雙層主線 + 螺頭雙節點標記

## 相關連結

- 視覺化主題：[極限與黎曼和](/explore/limits-riemann-sum)
- 相關作品：[黎曼和動態圖](/works/riemann-sum)、[切線逼近動畫](/works/tangent-approximation)、[曳物線](/works/catenary)、[向量場流線](/works/vector-field-streamlines)

## 延伸閱讀

- [等角螺線（維基百科）](https://zh.wikipedia.org/zh-tw/%E7%AD%89%E8%A7%92%E8%9%9E%E6%97%8B%E7%B7%9A)
