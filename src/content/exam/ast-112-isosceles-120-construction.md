---
title: 120° 等腰作圖與餘弦定理
description: 112 分科數甲選填 9：先讀對等腰三角形的頂角與底角，再用和角公式、餘弦定理求兩頂點距離。
subject: 分科數甲
year: 112
questionType: 選填
questionNo: '9'
unit: 高一至高二數學A・三角比與三角函數
concepts:
  - 等腰三角形
  - 和角公式
  - 餘弦定理
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0n214409428400270207/01-112%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E9%A1%8C.pdf
analysisUrl: https://www.ceec.edu.tw/files/file_pool/1/0N248425984561318981/1-112%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E5%90%84%E7%A7%91PD%E5%80%BC%28%E6%95%B8%E5%AD%B8%E7%94%B2%29.pdf
relatedExplore:
  - trigonometry-fundamentals
relatedWorks:
  - law-of-sines-cosines
  - trig-angle-identities
date: 2026-07-28
order: 9
coverImage: /images/exam-covers/ast-112-isosceles-120-construction.png
featured: false
draft: false
---

## 題意

一個直角三角形的三邊長分別為 $\sqrt7$、$\sqrt3$、$2$。在其中兩邊外側各作一個
頂角為 $120^\circ$ 的等腰三角形，要求兩個新頂點距離的平方。完整圖形與作答格式見
[大考中心 112 分科測驗數學甲試卷](https://www.ceec.edu.tw/files/file_pool/1/0n214409428400270207/01-112%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%80%83%E7%A7%91%E8%A9%A6%E9%A1%8C.pdf)。

## 為什麼會錯

大考中心公布的[試題統計](https://www.ceec.edu.tw/files/file_pool/1/0N248425984561318981/1-112%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E5%90%84%E7%A7%91PD%E5%80%BC%28%E6%95%B8%E5%AD%B8%E7%94%B2%29.pdf)
顯示本題得分率為 $29\%$、鑑別度為 $0.59$。第一個陷阱是把 $120^\circ$ 當成底角；
其實它是頂角，所以兩個底角都是 $30^\circ$。第二個陷阱是漏掉兩個外側底角，
把 $\angle MAN$ 誤寫成原直角三角形在 $A$ 的角。

## 觀念

令 $\theta=\angle BAC$。由直角三角形可得

$$
\cos\theta=\frac{\sqrt3}{\sqrt7}=\frac3{\sqrt{21}},
\qquad
\sin\theta=\frac2{\sqrt7}.
$$

頂角為 $120^\circ$ 的等腰三角形，底角各為 $30^\circ$。用 $30^\circ$–$60^\circ$–$90^\circ$
三角形的邊長比可得

$$
\begin{aligned}
AM&=\frac{\sqrt7}{\sqrt3}=\frac{\sqrt{21}}3,\\
AN&=\frac{\sqrt3}{\sqrt3}=1.
\end{aligned}
$$

兩個等腰三角形都作在原三角形外側，因此

$$
\angle MAN=\theta+30^\circ+30^\circ=\theta+60^\circ.
$$

用和角公式，

$$
\begin{aligned}
\cos(\theta+60^\circ)
&=\cos\theta\cos60^\circ\\
&\quad-\sin\theta\sin60^\circ\\
&=-\frac{\sqrt{21}}{14}.
\end{aligned}
$$

最後在 $\triangle AMN$ 使用餘弦定理：

$$
\begin{aligned}
MN^2
&=AM^2+AN^2\\
&\quad-2(AM)(AN)\cos\angle MAN\\
&=\frac73+1+1\\
&=\frac{13}{3}.
\end{aligned}
$$

## 互動怎麼看

- 拖動頂角 $\varphi$，觀察底角如何依 $(180^\circ-\varphi)\div2$ 同步改變。
- 按下「回到原題」，確認 $\varphi=120^\circ$ 時兩個底角都是 $30^\circ$。
- 對照圖上的 $\angle MAN$ 與右側精確值，確認外側兩個底角都要加進餘弦定理的夾角。
