---
title: Combining sine and cosine
description: "112 GSAT Mathematics A, Multiple select 12: combine sine and cosine into a single wave, then read off the phase, the axes of symmetry, and the translation."
subject: 學測數A
year: 112
questionType: 多選
questionNo: '12'
unit: Grade 11 Mathematics A · Graphs of trigonometric functions
topics:
  - Combining trigonometric functions
  - Phase shift
  - Axes of symmetry
concepts:
  - wave-superposition
  - trig-functions
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

## Problem

A linear combination of sine and cosine is given. Using the axes of symmetry of its graph, the solutions of an equation for a particular function value, and its translation relation to another periodic function, pick the correct statements. The full question and options are on the [Original paper](https://www.ceec.edu.tw/files/file_pool/1/0n045358375872115148/03-112%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf).

## Where it goes wrong

The CEEC [item statistics](https://www.ceec.edu.tw/files/file_pool/1/0N060632491446652955/%E6%95%B8A%E7%A7%91%E7%AD%94%E5%B0%8D%E7%8E%87%E5%8F%8A%E9%91%91%E5%88%A5%E5%BA%A6%E8%A1%A8.pdf) give an average score rate of $21\%$ for this item, and only $6\%$ got every option right. The combining formula itself is not the hard part. After rewriting as a single sine wave, you still have to read the axes of symmetry at both the maxima and the minima, find every solution within one period, and recognize the amplitude and vertical shift of a squared trigonometric function.

## Idea

The function in the problem can be written

$$
\begin{aligned}
f(x)
&=\sin x+\sqrt3\cos x\\
&=2\sin\left(x+\frac{\pi}{3}\right).
\end{aligned}
$$

The amplitude is $2$ and the period is $2\pi$. A sine wave has a vertical axis of symmetry at every peak and every trough, so

$$
x=\frac{\pi}{6}+k\pi,\qquad k\in\mathbb Z.
$$

Of two neighboring axes, one passes through a maximum and the next through a minimum, so the function values on them are not the same. The equation $f(x)=\sqrt3$ also has more than one solution in $[0,2\pi)$; for example, both $x=0$ and $x=\pi/3$ work.

On the other hand,

$$
4\sin^2\frac{x}{2}=2-2\cos x
$$

also has amplitude $2$ and period $2\pi$. After a horizontal and a vertical translation, its graph coincides with the graph of $f$.

## What the figure shows

- Adjust $a$ and $b$ and watch $a\sin x+b\cos x$ turn into $R\sin(x+\phi)$.
- The legend labels the two original components and the gold sum separately. **Replay phase shift** plays the translation again.
- The dashed lines mark the axes of symmetry at the peaks and troughs. In the original problem they are $x=\pi/6$ and $x=7\pi/6$.
