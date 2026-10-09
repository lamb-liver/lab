---
title: An outlier's effect on the regression line
description: Keep the main cloud fixed and move one highlighted point to see how its horizontal distance and residual pull the least-squares line.
tags:
  - Probability and statistics
concepts:
  - regression-correlation
audience: High-school concept
date: 2026-06-21
order: 60
featured: false
draft: false
---

## Figure

The main cloud stays fixed. Only the highlighted point $(x_o,y_o)$ moves. Let $b_0$ be the least-squares slope of the main cloud, and $b$ the least-squares slope after that point is added. This page watches the one point. It does not rebuild the cloud.

$$
\Delta b=b-b_0
$$

The leverage drawn here is the horizontal distance $|x_o-\bar x_0|$ from the main mean. The residual is the vertical gap from the point to the base line, $e_0=y_o-\hat y_0$, where $\hat y_0$ is the base line at $x_o$. A point can be isolated on either measure, or far enough on both to rewrite the trend.

## Interaction

- **High leverage**, **Large residual**, **High influence**, and **Low influence**: four places for the highlighted point, to compare how one position changes the fit
- **Leverage**: show the horizontal distance from $\bar x_0$. Farther from the main mean means more pull on the slope
- **Residual**: show the vertical distance to the base line, kept separate from leverage
- **Mean**: mark $(\bar x_0,\bar y_0)$, the center of the main cloud and the point the base line passes through
- Drag the highlighted point. **Reset** returns it to the start

## What to notice

- A large residual is not automatically a large change in slope. A point near the main mean usually has a hard time twisting $b$.
- A point far from $\bar x_0$ can move the slope more than a point near the mean, even when the nearer point has the larger residual.
- The gray line is the trend of the main cloud. The more the new line leaves it, the more that one point may be driving the fit.

## Related

- [Scatter, correlation, and the regression line](/en/works/scatter-correlation-regression/)
- [Percentiles and a box plot](/en/works/percentile-box-plot/)
- [Data analysis](/en/explore/data-analysis/)

## Further reading

- [Simple linear regression (Wikipedia)](https://en.wikipedia.org/wiki/Simple_linear_regression)
- [Outlier (Wikipedia)](https://en.wikipedia.org/wiki/Outlier)
