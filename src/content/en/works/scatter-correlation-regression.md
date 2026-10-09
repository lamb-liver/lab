---
title: Scatter diagram, correlation, and the regression line
description: Drag points in a two-dimensional cloud and watch the direction, the correlation r, and the least-squares line change together.
tags:
  - Probability and statistics
concepts:
  - regression-correlation
audience: High-school concept
date: 2026-06-21
order: 59
featured: false
draft: false
---

## Parametric equations

Given points $\{(x_i,y_i)\}$. This page reads the cloud as a whole: the mean point, how linear the cloud is, and one straight line for the main trend. The mean point is

$$
(\bar x,\ \bar y)=\left(\frac{1}{n}\sum x_i,\ \frac{1}{n}\sum y_i\right)
$$

When both axes have nonzero variation, the Pearson correlation is

$$
r=\frac{\sum (x_i-\bar x)(y_i-\bar y)}{\sqrt{\sum(x_i-\bar x)^2}\sqrt{\sum(y_i-\bar y)^2}}
$$

When the $x_i$ are not all equal, the least-squares line $\hat y=a+bx$ is the line whose slope and intercept minimize the residual sum of squares $\sum(y_i-\hat y_i)^2$. It passes through $(\bar x,\bar y)$. This page does not study one point on its own. That is left to the page on an outlier's effect on the regression line.

## Interaction

- **Sample size n** and **Noise σ**: change how many points there are and how widely they scatter, and watch the line settle or wander
- **Linear trend β** and **Curvature c**: change the trend the points are built from, and see where a straight line fails on a curved cloud
- **Mean axes**: mark $(\bar x,\bar y)$ with a cross. The line always passes through that center
- **Residuals**: draw the vertical segments $y_i-\hat y_i$
- **Shift left** and **Shift right** translate the cloud. **Shrink** and **Enlarge** scale it about the mean point. **Flip y** reflects it vertically and changes the sign of the trend slider. **Reset** rebuilds the cloud from the sliders. A point that hits the edge of the plot is clipped, so the shift and the scale stay pure only while every point remains inside the frame
- Double-click empty space in the plot to add a point. Double-click a point to delete it when more than three points remain

## What to notice

- The line passes through the mean point. That point is the hinge of the cloud, and it moves when the points move.
- $r$ measures only linear agreement. A clearly curved cloud can still have $r$ near $0$.
- A translation, or a positive scaling about the mean, does not change $r$. Reversing one axis reverses the sign of $r$.

## Related

- [An outlier's effect on the regression line](/en/works/regression-outlier-influence/)
- [Percentiles and a box plot](/en/works/percentile-box-plot/)
- [Data analysis](/en/explore/data-analysis/)

## Further reading

- [Pearson correlation coefficient (Wikipedia)](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient)
- [Simple linear regression (Wikipedia)](https://en.wikipedia.org/wiki/Simple_linear_regression)
