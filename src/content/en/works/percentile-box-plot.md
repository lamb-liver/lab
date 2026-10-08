---
title: Percentiles and a box plot
description: Sort one-dimensional values and drag them to watch the median, the interquartile range, and the tail outliers update.
tags:
  - Probability and statistics
concepts:
  - descriptive-statistics
audience: High-school concept
date: 2026-06-21
order: 61
featured: false
draft: false
---

## Figure

This page reads the order of a one-dimensional sample. It does not draw a point cloud or a regression line. Sort the $n$ values

$$
x_{(1)}\le x_{(2)}\le\cdots\le x_{(n)}
$$

The percentile $P_p$ is linear interpolation at index $(p/100)(n-1)$ in that sorted list, counting from 0. That is the inclusive percentile: $P_0$ is the minimum and $P_{100}$ is the maximum. The box plot uses the same rule at

$$
Q_1=P_{25},\quad Q_2=P_{50},\quad Q_3=P_{75}.
$$

The interquartile range is $\mathrm{IQR}=Q_3-Q_1$. Whiskers stop at the outermost values still inside $[Q_1-k\cdot\mathrm{IQR},\, Q_3+k\cdot\mathrm{IQR}]$. Points outside those fences are marked as outliers.

## Interaction

- **Sample size n**, **Spread s**, and **Skew γ**: reshape the sample and watch the box and the whiskers follow
- **Whisker multiple k**: move the fences and see which points fall outside
- **Percentiles**: show $P_{10}$ and $P_{90}$ as extra cuts beside the box
- **Ranks**: switch on the ordered places of the same values
- Drag a point to change its value. **Delete** removes the selected point when more than five values remain. **Shift left** and **Shift right** translate the sample. **Pull in** and **Pull apart** scale it about the median. **Reset** rebuilds it from the sliders

## What to notice

- The median is the middle of the ordered sample. An extreme value usually moves it less than the mean. This figure does not plot the mean.
- The box width $\mathrm{IQR}$ is the span from $P_{25}$ to $P_{75}$ on this rule. A long tail can leave the box and the whiskers telling different stories.
- The page keeps one percentile rule. Read the ordered places and the shape. It does not compare interpolation rules from other software.

## Related

- [Scatter, correlation, and the regression line](/en/works/scatter-correlation-regression/)
- [An outlier's effect on the regression line](/en/works/regression-outlier-influence/)
- [Data analysis](/en/explore/data-analysis/)

## Further reading

- [Box plot (Wikipedia)](https://en.wikipedia.org/wiki/Box_plot)
- [Percentile (Wikipedia)](https://en.wikipedia.org/wiki/Percentile)
