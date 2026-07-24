---
title: 正弦與餘弦的疊合
description: 112 學測數A 多選 12：把正弦與餘弦疊成單一波形，讀出相位、對稱軸與平移。
subject: 學測數A
year: 112
questionType: 多選
questionNo: '12'
unit: 高二數學A・三角函數圖形
concepts:
  - 三角函數疊合
  - 相位平移
  - 對稱軸
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0n045358375872115148/03-112%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://public.ehanlin.com.tw/pre-exam/gsat/112%E7%BF%B0%E6%9E%97%E5%AD%B8%E6%B8%AC%E7%B2%BE%E5%BD%A9%E8%A7%A3%E6%9E%90-%E6%95%B8%E5%AD%B8A%E8%80%83%E7%A7%91.pdf
relatedExplore:
  - trig-function-graphs
  - trig-wave-interference
relatedWorks:
  - sinusoid-amplitude-period-phase
  - function-graph-transform
date: 2026-07-24
order: 2
coverImage: /images/exam-covers/gsat-112-sinusoid-superposition.png
featured: false
draft: false
---

## 題意

給定一個正弦與餘弦的線性組合，題目要求從圖形對稱軸、特定函數值的解，以及與另一個週期函數
之間的平移關係判斷正確敘述。完整題目與選項見
[大考中心 112 學測數學 A 試卷](https://www.ceec.edu.tw/files/file_pool/1/0n045358375872115148/03-112%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf)。

## 為什麼會錯

大考中心的[答對率及鑑別度表](https://www.ceec.edu.tw/files/file_pool/1/0N060632491446652955/%E6%95%B8A%E7%A7%91%E7%AD%94%E5%B0%8D%E7%8E%87%E5%8F%8A%E9%91%91%E5%88%A5%E5%BA%A6%E8%A1%A8.pdf)
顯示本題平均得分率為 $21\%$，全對率只有 $6\%$。困難點不是疊合公式本身，而是化成單一正弦波後，
還要同時讀出極大與極小的對稱軸、在一個週期內完整找解，並辨認平方三角函數的振幅與垂直位移。

## 觀念

原題函數可寫成

$$
\begin{aligned}
f(x)
&=\sin x+\sqrt3\cos x\\
&=2\sin\left(x+\frac{\pi}{3}\right).
\end{aligned}
$$

振幅為 $2$，週期為 $2\pi$。正弦波在波峰與波谷處都有鉛直對稱軸，因此

$$
x=\frac{\pi}{6}+k\pi,\qquad k\in\mathbb Z.
$$

相鄰兩條對稱軸一條通過極大值、下一條通過極小值，軸上的函數值不會相同。方程
$f(x)=\sqrt3$ 在 $[0,2\pi)$ 內也不只一個解，例如 $x=0$ 與 $x=\pi/3$ 都成立。

另一方面，

$$
4\sin^2\frac{x}{2}=2-2\cos x
$$

同樣有振幅 $2$ 與週期 $2\pi$；經水平與垂直平移後，可以和 $f$ 的圖形重合。

## 互動怎麼看

- 調整 $a$、$b$，觀察 $a\sin x+b\cos x$ 如何變成 $R\sin(x+\phi)$。
- 圖例分開標出兩個原始分量與金色合成波；可重播相位平移。
- 虛線標出波峰與波谷的對稱軸，回到原題時是 $x=\pi/6$ 與 $x=7\pi/6$。
