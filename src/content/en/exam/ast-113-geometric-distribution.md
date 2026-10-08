---
title: A lottery wait and the geometric distribution
description: The geometric distribution, counted as trials until the first win, gives the mean wait, the chance from finitely many tokens, and the nine-tenths cutoff.
subject: 分科數甲
year: 113
questionType: 多選
questionNo: '4'
unit: Grade 12 elective Mathematics I · Probability and random variables
topics:
  - Geometric distribution
  - Expected value
  - Infinite geometric series
concepts:
  - probability-distribution
  - expected-value
  - sequences-series
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0o221359215605202263/113%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E9%A1%8C.pdf
analysisUrl: https://math.ntnu.edu.tw/~li/108/113G.html
relatedExplore:
  - discrete-random-variables
  - sequences-and-series
relatedWorks:
  - binomial-geometric-distribution
  - arithmetic-geometric-sequences
date: 2026-07-24
order: 5
coverImage: /images/exam-covers/ast-113-geometric-distribution.png
featured: false
draft: false
---

## Problem

Each draw wins with fixed probability $0.1$, and each draw spends one token. The question asks for the mean number of draws until the first win, the chance of at least one win from a finite number of tokens, and the least number of tokens that pushes that chance strictly above nine-tenths. The full question and the options are on the [original 113 AST Mathematics I paper](https://www.ceec.edu.tw/files/file_pool/1/0o221359215605202263/113%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E9%A1%8C.pdf).

## Where it goes wrong

The [official item analysis](https://www.ceec.edu.tw/xcepaper/cont?qunit=0O241581647352902046&sid=0O260306744213652490&xsmsid=0J066588036013658199) records a score rate of $56\%$ and a discrimination of $0.42$. A common slip is to write "at least one win in two draws" as $0.1+0.1$, or to turn "the probability approaches $1$" into "some finite number of draws guarantees that it equals $1$". Another trap is missing that "greater than nine-tenths" is a strict inequality.

## Idea

Let $X$ be the number of draws until the first win. Then

$$
P(X=k)=0.9^{k-1}\cdot 0.1,\qquad k=1,2,\ldots
$$

This is the geometric distribution counted from $1$: trials until the first success. Its expected value is

$$
E(X)=\frac{1}{0.1}=10.
$$

With $n$ tokens, the chance of at least one win comes from the complement:

$$
P(\text{at least one win})=1-P(\text{no wins})=1-0.9^n.
$$

Two draws give $1-0.9^2=0.19$, not $0.2$. A chance strictly above $0.9$ needs $0.9^n<0.1$, and the least such integer is $n=22$. Every finite $n$ still has $0.9^n>0$, so the chance only approaches $1$ and is never guaranteed to equal $1$.

## What the figure shows

- Drag **At most n draws** and compare $1-0.9^n$ with the nine-tenths threshold.
- The histogram piles up ten thousand waits. Each wait is the number of trials until the first win, and the rightmost bin pools every $X\geq 24$.
- The line underneath tracks the sample mean. As the sample grows, the line settles near the expected value $10$.
