---
title: 田忌賽馬的 24 種配對
description: 甲 1、3、5、7 對乙 2、4、6、8，出牌順序不影響得分，只看 24 種配對；甲得分至少 2 的恰好 12 種。
subject: 高考數學
year: 2024
questionType: 選填
questionNo: '新課標I-14'
unit: 高考數學・新課標I卷・排列組合與機率
topics:
  - 排列
  - 古典機率
  - 田忌賽馬
concepts:
  - permutation-combination
  - classical-probability
sourceUrl: https://gaokaohub.com/q/item/238279886096626.html
relatedExplore:
  - permutations-combinations
relatedWorks:
  - combinatorial-path-counting
date: 2026-11-06
order: 31
coverImage: /images/exam-covers/gaokao-2024-i-card-matching.png
featured: false
draft: false
---

## 題意

甲有寫著 1、3、5、7 的四張牌，乙有 2、4、6、8。比四輪，每輪各自隨機出一張沒出過的牌，大的得 1 分。求四輪後甲得分不小於 2 的機率。

題幹來自考生回憶，見 [高考題庫的題目整理](https://gaokaohub.com/q/item/238279886096626.html)，另可對照 [量識寶的解析](https://liangshibao.com/tiku/gaokao-math-2024-i/fill-14)。

## 為什麼會錯

把四輪當成依序發生，分母寫成 $4!\times4!=576$，分子卻只數了配對，比例差了 24 倍。

另一個錯是覺得乙每張牌都比甲對應的大，甲得分高的機率應該很小，直接猜一個小數字。

## 觀念

得分只取決於甲的每張牌對上乙的哪一張，跟哪一輪出無關。配對共 $4!=24$ 種，等可能。

甲的 1 一定輸，最多 3 分；3 分只有一種：$3$–$2$、$5$–$4$、$7$–$6$、$1$–$8$。0 分也只有一種：$1$–$2$、$3$–$4$、$5$–$6$、$7$–$8$。

每輪甲贏的機率是 $\tfrac{6}{16}=\tfrac38$，四輪期望 $\tfrac32$。設得 $k$ 分的有 $n_k$ 種：

$$
n_1+n_2=22,\qquad n_1+2n_2+3=36,
$$

得 $n_2=11$。至少 2 分有 $11+1=12$ 種，機率 $\tfrac{12}{24}=\tfrac12$。

## 互動怎麼看

- 上方是一種配對，金線是甲贏的那一輪。用「上一種」「下一種」翻遍 24 種。
- 下方 24 格寫著甲的得分，金色格子是至少 2 分，正好一半。
- 點「只看得分 ≥ 2」，翻頁只停在金色格子。側欄是 0 到 3 分的種數。
