---
title: 角平分線被高截開
description: 2025 AMC 12A 第16題：整條角平分線長 48，題目問的 BP 是 21。
subject: AMC 12A
year: 2025
questionType: 單選
questionNo: '16'
unit: AMC 12・角平分線
topics:
  - 角平分線定理
  - 相似三角形
  - 等腰三角形
concepts:
  - law-of-sines-cosines
  - trig-functions
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2025_AMC_12A_Problems/Problem_16
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - law-of-sines-cosines
  - trig-angle-identities
date: 2026-11-18
order: 40
coverImage: /images/exam-covers/amc12a-2025-16-bisector-altitude.png
featured: false
draft: false
---

## 題意

三角形三邊 $AB=80$、$BC=45$、$AC=75$。$B$ 的角平分線與 $AB$ 上的高交於 $P$。求 $BP$。五選一。

完整題目與選項見 [AoPS 題目頁](https://artofproblemsolving.com/wiki/index.php/2025_AMC_12A_Problems/Problem_16)。

## 為什麼會錯

- 角平分線整條長 $48$。選項裡沒有 $48$，算出這條長度就停住，還沒有回答 $BP$。
- $CD$ 長 $27$。用 $BC$ 去減 $CD$，$45-27=18$，減的是另一對長度。$18$ 是選項 (A)。
- $PD$ 也長 $27$。題目問的是 $B$ 到 $P$ 這一段。

## 觀念

角平分線交 $AC$ 於 $D$。角平分線定理：

$$
\frac{AD}{DC}=\frac{AB}{BC}=\frac{80}{45}=\frac{16}{9}.
$$

$AC=75$，所以 $AD=48$，$DC=27$。

$\triangle CBD$ 與 $\triangle CAB$ 共用 $\angle C$。夾這個角的兩邊成比例：

$$
\frac{CB}{CA}=\frac{45}{75}=\frac35,\qquad \frac{CD}{CB}=\frac{27}{45}=\frac35.
$$

所以 $\triangle CBD\sim\triangle CAB$，對應頂點 $C\to C$、$B\to A$、$D\to B$。因此

$$
\frac{BD}{AB}=\frac35,\qquad BD=48.
$$

$BD=AD$，$\triangle ABD$ 等腰，底角相等。設 $\angle DAB=\angle DBA=\theta$。角平分線把 $\angle ABC$ 分成兩半，所以 $\angle ABC=2\theta$。

$AB$ 上的高垂直於 $AB$。在 $\triangle CDP$ 裡，$\angle DCP$ 是 $AC$ 與這條高的夾角，等於 $90^\circ-\theta$。$BD$ 與 $AB$ 夾 $\theta$，高與 $AB$ 夾 $90^\circ$，所以 $BD$ 與高夾 $90^\circ-\theta$，這就是 $\angle DPC$。兩底角相等，$\triangle CDP$ 等腰，$PD=CD=27$。

$P$ 在 $BD$ 上，

$$
BP=BD-PD=48-27=21.
$$

選 (D)。

## 互動怎麼看

- 預設只畫整條角平分線，讀數是 $48$。
- 點選「截下的一段」：高出現，金色是 $PD$，讀數是 $27$。
- 點選「剩下的 BP」：金色改成 $B$ 到 $P$，讀數是 $21$。
