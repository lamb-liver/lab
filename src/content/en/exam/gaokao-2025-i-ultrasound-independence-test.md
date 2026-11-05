---
title: Ultrasound and disease, an independence test
description: With the 2×2 totals fixed only one cell can move, and χ² grows as it leaves the 40 expected under independence.
subject: 高考數學
year: 2025
questionType: 非選
questionNo: '新課標I-15'
unit: Gaokao Mathematics, New Curriculum I, contingency tables and independence tests
topics:
  - Contingency table
  - Chi-square test
  - Estimating a conditional probability
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

## The problem

A random survey of 1000 people who had an ultrasound scan: of the 200 with the disease, 20 had a normal scan and 180 abnormal; of the 800 without it, 780 normal and 20 abnormal.

Part 1 estimates the probability that someone with an abnormal scan has the disease. Part 2 uses an independence test at $\alpha=0.001$ (critical value 10.828) to decide whether the scan result is related to the disease.

The wording comes from candidate recall; see the [full-paper notes on 21cnjy](https://zy.21cnjy.com/23151851).

## Why students get it wrong

Part 1 is a conditional probability: the denominator is the 200 abnormal scans, not 1000. $\tfrac{180}{1000}$ is "abnormal and ill".

Part 2 gives $\chi^2=765.625$, far larger than usual practice numbers, and many students doubt their arithmetic. $\chi^2$ grows fast as the table moves away from independence, so the size is fine.

The null hypothesis is "not related". Rejecting it is what gives "related".

## The idea

Part 1: $P\approx\tfrac{180}{200}=\tfrac{9}{10}$.

Part 2:

$$
\chi^2=\frac{n(ad-bc)^2}{(a+b)(c+d)(a+c)(b+d)}=\frac{1000\,(20\cdot20-180\cdot780)^2}{200\cdot800\cdot800\cdot200}=765.625.
$$

Since $765.625>10.828$, reject "not related": the scan result is related to the disease, with error probability at most 0.001.

With row and column totals fixed, the table has one degree of freedom. Let $b$ be the number ill with an abnormal scan; then $\chi^2=\tfrac{(b-40)^2}{25.6}$. Under independence $b=40$ and both groups are 20% ill.

## How to read the figure

- Drag Ill with abnormal scan: the other three cells follow and the four totals stay put.
- The bars are each group's observed share ill; the dashed line is the shared 20% under independence. The farther the bars sit from it, the larger $\chi^2$.
- The bottom line uses a log scale from 0 to 1000. $b=57$ already passes 10.828; the original 180 is far to the right.
