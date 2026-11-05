---
title: 超音波檢查與疾病的獨立性檢定
description: 2×2 列聯表合計固定時只剩一格能動，χ² 隨它離開獨立時的 40 人而變大。
subject: 高考數學
year: 2025
questionType: 非選
questionNo: '新課標I-15'
unit: 高考數學・新課標I卷・列聯表與獨立性檢定
topics:
  - 列聯表
  - 卡方檢定
  - 條件機率估計
concepts:
  - conditional-probability
  - descriptive-statistics
sourceUrl: https://zy.21cnjy.com/23151851
relatedExplore:
  - probability-statistics
relatedWorks:
  - conditional-probability-bayes
date: 2026-11-05
order: 21
coverImage: /images/exam-covers/gaokao-2025-i-ultrasound-independence-test.png
featured: false
draft: false
---

## 題意

隨機調查 1000 位做過超音波檢查的人：患病 200 人中，檢查正常 20 人、不正常 180 人；未患病 800 人中，正常 780 人、不正常 20 人。

第一問估計「檢查不正常者患病」的機率；第二問在顯著水準 $\alpha=0.001$（臨界值 10.828）下，用獨立性檢定判斷檢查結果與患病是否有關。

題幹來自考生回憶，見 [21世紀教育網的全卷整理](https://zy.21cnjy.com/23151851)。

## 為什麼會錯

第一問是條件機率，分母是檢查不正常的 200 人，不是 1000 人。$\tfrac{180}{1000}$ 算的是「不正常且患病」。

第二問的 $\chi^2$ 算出來是 765.625，比平常練習大得多，不少人因此懷疑自己算錯。表格偏離獨立越多，$\chi^2$ 長得越快，這個數字是合理的。

虛無假設要設成「無關」。拒絕它才得到「有關」。

## 觀念

第一問：$P\approx\tfrac{180}{200}=\tfrac{9}{10}$。

第二問：

$$
\chi^2=\frac{n(ad-bc)^2}{(a+b)(c+d)(a+c)(b+d)}=\frac{1000\,(20\cdot20-180\cdot780)^2}{200\cdot800\cdot800\cdot200}=765.625.
$$

$765.625>10.828$，拒絕「無關」的虛無假設，判定檢查結果與患病有關，犯錯機率不超過 0.001。

橫列與直欄的合計都固定時，表格只剩一個自由度。設患病且不正常的人數為 $b$，則 $\chi^2=\tfrac{(b-40)^2}{25.6}$。無關時 $b=40$，兩組患病率都是 20%。

## 互動怎麼看

- 拖「患病且不正常」：其他三格跟著變，四個合計不動。
- 上方長條是兩組實際的患病比例，虛線是無關時共同的 20%。長條離虛線越遠，$\chi^2$ 越大。
- 下方數線用對數刻度放下 0 到 1000。$b$ 到 57 就越過 10.828，原題的 180 遠在右邊。
