---
title: Exponential growth and decay
description: Exponential growth and decay of y = Ce^(kt), with doubling time, half-life, and slope proportional to height.
tags:
  - Functions and analysis
concepts:
  - exponential-logarithm
audience: High-school concept
date: 2026-05-26
order: 37
featured: false
draft: false
---

## Parametric equations

The exponential $y=Ce^{kt}$ grows without bound when $k>0$, and decays toward $0$ when $k<0$. The doubling time $T_+=\ln 2/k$ and the half-life $T_{1/2}=\ln 2/|k|$ turn the rate $k$ into a time you can see on the axis. The same relation is the slope.

$$
y(t)=Ce^{kt},\quad
\frac{dy}{dt}=ky
$$

Growth ($k>0$): $y(t+T_+)=2y(t)$. Decay ($k<0$): $y(t+T_{1/2})=\tfrac12 y(t)$.

## Interaction

- **Growth** and **Decay**: switch the sign of the exponential and watch one formula do both
- **Initial value C** and **Rate |k|**: move the starting height and the speed, and compare how steep the curve gets
- **Tangent slope**: show the tangent at **Tangent position t/tmax**. The slope is $\dfrac{dy}{dt}=ky$, proportional to the height there
- **ln y scale**: switch the vertical axis to $\ln y$ and watch the exponential become a straight line

## What to notice

- The vertical marks are doubling times while it grows, and half-lives while it decays. Each mark is one step of $\ln 2/|k|$.
- The tangent slope is the current height times $k$. A taller point is steeper in that same proportion.
- On the $\ln y$ scale the same curve is the straight line $\ln y=\ln C+kt$.

## Related

- [Logarithmic scale](/en/works/logarithmic-scale/)
- [Geometric definition of the natural logarithm](/en/works/natural-log-e-geometry/)
- [Logistic curve](/en/works/logistic-curve/)

## Further reading

- [Exponential growth (Wikipedia)](https://en.wikipedia.org/wiki/Exponential_growth)
- [Exponential decay (Wikipedia)](https://en.wikipedia.org/wiki/Exponential_decay)
