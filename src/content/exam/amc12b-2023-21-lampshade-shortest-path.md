---
title: 燈罩上的最短路徑
description: 2023 AMC 12B 第21題：燈罩展開成半圓環，直連直線會掉出紙外，最短路是切線加內緣弧。
subject: AMC 12B
year: 2023
questionType: 單選
questionNo: '21'
unit: AMC 12・立體幾何與展開圖
topics:
  - 圓台側面展開
  - 扇形弧長
  - 切線與最短路徑
concepts:
  - trig-functions
  - law-of-sines-cosines
sourceUrl: https://artofproblemsolving.com/wiki/index.php/2023_AMC_12B_Problems/Problem_21
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - radian-arc-length
  - law-of-sines-cosines
date: 2026-09-25
order: 15
coverImage: /images/exam-covers/amc12b-2023-21-lampshade-shortest-path.png
featured: false
draft: false
---

## 題意

燈罩做成正圓台的側面（沒有上下底）：高 $3\sqrt3$，上口直徑 6、下口直徑 12。一隻蟲停在下緣某一點，上緣離牠最遠的那一點有蜂蜜。蟲只能在燈罩表面上爬，最短要爬多遠？（五選一）

完整題目與選項見 [AoPS 題目頁](https://artofproblemsolving.com/wiki/index.php/2023_AMC_12B_Problems/Problem_21)。

## 為什麼會錯

最常見的做法是把側面剪開攤平，再把蟲和蜂蜜直接連成直線，算出 $6\sqrt5$，而它正好也是選項之一。問題在於展開圖是內半徑 6、外半徑 12 的半圓環：這條直線中段離錐頂只剩 $12/\sqrt5\approx5.37$，小於 6，穿過了內圈以內那塊「被切掉的錐頂」，那裡根本不是燈罩。直線不在紙上，就不能當路徑。

另一個卡點是把立體上的「正對面（差半圈）」直接當成展開圖上差 $180^\circ$。扇形角只有 $\pi$，立體上的半圈在展開圖上只對應 $\pi/2$。

## 觀念

母線長 $\sqrt{(6-3)^2+(3\sqrt3)^2}=6$。補成完整圓錐，錐頂到上緣、下緣分別是 6 與 12（上下半徑比 $3:6$）。側面展開成扇環，扇形角

$$
\theta=\frac{2\pi\cdot 6}{12}=\pi,
$$

也就是內半徑 6、外半徑 12 的半圓環。蟲在外緣、蜂蜜在內緣，兩者在展開圖上夾角 $\pi/2$。

直接連線的長度由餘弦定理得 $\sqrt{12^2+6^2}=6\sqrt5$，但它離錐頂的最近距離是 $\dfrac{12\cdot 6}{6\sqrt5}=\dfrac{12}{\sqrt5}<6$，會離開紙面。

合法的最短路徑是：從蟲沿直線走到與內緣相切的點，再沿內緣圓弧走到蜂蜜。切線長 $\sqrt{12^2-6^2}=6\sqrt3$；切點與蟲的夾角 $a$ 滿足 $\cos a=\frac{6}{12}$，所以 $a=\frac{\pi}{3}$，剩下的弧對應 $\frac{\pi}{2}-\frac{\pi}{3}=\frac{\pi}{6}$，弧長 $6\cdot\frac{\pi}{6}=\pi$。

$$
L=6\sqrt3+\pi\approx13.534,
$$

選 (E)。

## 互動怎麼看

- 按「播放展開」：燈罩被剪開、慢慢攤平成半圓環；每個中間狀態都是同一張紙，所以路徑長度不變。
- 在下方展開圖拖動金色把手（或調整接觸角 $a$）：$a=90^\circ$ 就是直接連直線，紅色虛線段顯示它掉進內半徑 6 以內；回到立體圖，同一段會飄在燈罩上口之上。
- 把 $a$ 從 $90^\circ$ 往下拉：一低於 $60^\circ$，路徑就回到紙上；$a=60^\circ$ 時直線恰與內緣相切，讀數停在 $6\sqrt3+\pi\approx13.5339$，再往下拉只會變長。
