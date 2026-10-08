---
title: Logistic curve
description: The logistic curve y = L/(1+a e^(-kt)) rises, then levels off at the carrying capacity L.
tags:
  - Functions and analysis
concepts:
  - logistic-growth
audience: High-school concept
date: 2026-05-26
order: 40
featured: false
draft: false
---

## Figure

The logistic curve, in continuous time, is growth under a limited resource. Early on it is close to exponential growth. It bends in the middle. It levels off at the carrying capacity $L$. This is the smooth S-shaped solution, not the bifurcation diagram of the discrete map $x_{n+1}=rx_n(1-x_n)$.

$$
y(t)=\frac{L}{1+ae^{-kt}},\quad L>0,\; k>0,\; a>0
$$

The differential equation is

$$
\frac{dy}{dt}=ky\left(1-\frac{y}{L}\right)
$$

The inflection is at $y=L/2$, when $t=\dfrac{\ln a}{k}$. The bands on the figure read Slow, Rapid, and Saturated.

## Interaction

- **Carrying capacity L**, **Growth rate k**, and **Initial offset a**: set the saturation level, the growth rate, and the initial shift
- **Show dy/dt**: draw $\dfrac{dy}{dt}$ under the curve. The three bands stay either way
- **Compare Ce^kt**: overlay the early piece $Ce^{kt}$. If it leaves the range the figure can compare, the caption says so
- **Reset**: return the sliders to the initial parameters

## What to notice

- The marked inflection is half the carrying capacity, and it is where the drawn $\dfrac{dy}{dt}$ is largest.
- The dashed $Ce^{kt}$ stays with the curve only while the height is still small. After that the curve bends toward $L$.
- Slow, Rapid, and Saturated are three parts of one smooth solution. They are not the period-doubling of the discrete map.

## Related

- [Exponential growth and decay](/en/works/exponential-growth-decay/)
- [Logistic map bifurcation diagram](/works/logistic-bifurcation/)

## Further reading

- [Logistic function (Wikipedia)](https://en.wikipedia.org/wiki/Logistic_function)
- [Sigmoid function (Wikipedia)](https://en.wikipedia.org/wiki/Sigmoid_function)
