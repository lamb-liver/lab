---
title: 謝爾賓斯基三角形
description: 遞迴三等分挖空或混沌遊戲生成的自相似三角形碎形。
tags:
  - 幾何
  - 碎形
date: 2026-08-08
featured: false
draft: false
---

## 參數方程

謝爾賓斯基三角形由正三角形反覆移除中央倒三角形得到；亦可從三頂點隨機選中點迭代（混沌遊戲）生成。Hausdorff 維約 $\log 3/\log 2$，是典型的自相似碎形。

幾何迭代：每步將每個實心三角形分成四個相似小三角形並移除中央一個。

混沌遊戲：$P_{k+1}=\dfrac{P_k+V_i}{2}$，$V_i$ 為三頂點之一（隨機選取）。

## 互動說明

- **模式切換**：遞迴幾何繪製／混沌遊戲點雲兩種生成方式
- **迭代深度**：控制遞迴層數或累積點數，觀察細節浮現
- **與 IFS 對照**：可連結仿射疊代直覺（見碎形仿射疊代作品）

## 相關作品

- [碎形仿射疊代](/works/affine-ifs-fractal)
- [朱利亞集合](/works/julia-set)
- [邏輯斯諦映射分岔圖](/works/logistic-bifurcation)

## 延伸閱讀

- [謝爾賓斯基三角形（維基百科）](https://zh.wikipedia.org/zh-tw/%E8%AC%9D%E7%88%BE%E5%AE%9B%E6%96%AF%E5%9F%BA%E4%B8%89%E8%A7%92%E5%BD%A2)
