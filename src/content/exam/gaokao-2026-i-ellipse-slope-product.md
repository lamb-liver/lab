---
title: 橢圓上的斜率積與最小正切
description: 過焦點的弦 PQ 與直徑 PR，k_QP·k_QR 固定為 −3/4，tan∠PQR 化成 4k + 3/k，用算幾不等式求最小值。
subject: 高考數學
year: 2026
questionType: 非選
questionNo: '新課標I-18'
unit: 高考數學・新課標I卷・圓錐曲線
topics:
  - 橢圓
  - 斜率積
  - 算幾不等式
concepts:
  - conic-sections
sourceUrl: https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34471.html
relatedExplore:
  - conic-dynamic-geometry
relatedWorks:
  - ellipse-tangent-foci
date: 2026-11-06
order: 28
coverImage: /images/exam-covers/gaokao-2026-i-ellipse-slope-product.png
featured: false
draft: false
---

## 題意

橢圓 $C$ 的左焦點 $F(-1,0)$，離心率 $\tfrac12$，求得 $C:\tfrac{x^2}{4}+\tfrac{y^2}{3}=1$。過 $F$、斜率 $k>0$ 的直線 $l$ 交 $C$ 於 $P,Q$，$Q$ 在第三象限；直線 $PO$ 交 $C$ 於另一點 $R$。

- (i) 若 $\triangle PQR$ 面積是 $\triangle PFO$ 的 3 倍，求 $l$。
- (ii) 求 $\tan\angle PQR$ 的最小值。

題幹來自考生回憶，見 [91 學的題目整理](https://www.91apu.cn/shuxue/gkt/2026/2026xgk1/2026-10-10/34471.html)，另可對照 [lewang 的 2026 解答整理](https://gk2026math.lewang.dev/solutions)。

## 為什麼會錯

(ii) 最常見的做法是把 $P,Q,R$ 的座標全部寫出來算夾角，式子很長，算到一半就亂了。

關鍵是 $R=-P$：$Q$ 到一條直徑兩端的斜率積是定值，不必解出 $R$。

## 觀念

(i) $O$ 是 $PR$ 中點，$S_{\triangle PFR}=2S_{\triangle PFO}$，條件變成 $\tfrac{S_{\triangle PQR}}{S_{\triangle PFR}}=\tfrac32$，即 $PF=2QF$。配合韋達定理得 $k^2=\tfrac54$，$l:y=\tfrac{\sqrt5}{2}(x+1)$。

(ii) $Q$ 與 $\pm P$ 都在橢圓上，

$$
k_{QP}\cdot k_{QR}=\frac{y_Q^2-y_P^2}{x_Q^2-x_P^2}=-\frac{b^2}{a^2}=-\frac34,
$$

所以 $k_{QR}=-\tfrac{3}{4k}$。代入夾角公式，

$$
\tan\angle PQR=\frac{k+\tfrac{3}{4k}}{1-\tfrac34}=4k+\frac3k\ge 4\sqrt3,
$$

$k=\tfrac{\sqrt3}{2}$ 時取等號。最小值是 $4\sqrt3$。

## 互動怎麼看

- 拖斜率 $k$：金色是 $l$，青色是 $QR$，虛線是直徑 $PR$。側欄的 $k_{QP}\cdot k_{QR}$ 一直是 $-0.75$。
- 下方曲線是 $\tan\angle PQR=4k+\tfrac3k$，金點是最小值 $4\sqrt3$。
- 「(i)」「(ii)」兩個按鈕跳到 $k=\tfrac{\sqrt5}{2}$ 與 $k=\tfrac{\sqrt3}{2}$，側欄同時顯示面積比。
