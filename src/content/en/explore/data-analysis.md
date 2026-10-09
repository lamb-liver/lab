---
title: Data analysis
description: Switch among a point cloud, one point's influence, and a sorted sample, and compare how the mean, an outlier, and the quartiles change the reading.
category: Statistics
concepts:
  - descriptive-statistics
  - regression-correlation
audience: Intuitive exploration
date: 2026-06-21
order: 17
coverImage: /images/explore-covers/data-analysis.png
featured: false
draft: false
---

## Idea

A list of numbers can be read in more than one way. A two-dimensional sample $\{(x_i,y_i)\}$ can be a cloud around its mean. Moving one point far away can change the trend. Keeping only one list of values turns the question into order.

$$
\{(x_i,y_i)\}\quad\longrightarrow\quad \text{point cloud / influence / ordered values}
$$

This page does not derive each statistic. It sets three readings side by side: overall direction, the pull of one point, and ordered shape. Each mode keeps its own sample. In the cloud, the line is the least-squares line and $r$ is the Pearson correlation. The box uses the same inclusive percentile as the box-plot page. Its fences are $Q_1-1.5\,\mathrm{IQR}$ and $Q_3+1.5\,\mathrm{IQR}$, and the whiskers stop at the outermost values still inside them.

## Interaction

- **Scatter and regression**: drag the points, or set **Point count n**, **Trend b**, and **Noise σ**, and read the cloud's direction and its mean
- **Outlier influence**: move only the highlighted point and see whether it rewrites the main trend. **Outlier xₒ** and **Outlier yₒ** follow that point
- **Percentile box**: switch to one-dimensional values. **Sample size n** rebuilds the list, and the median, the quartiles, and the tail outliers cut it
- **Reset data** rebuilds the current mode. **Show guides** and **Hide guides** toggle the guide lines. **Add data** and **Delete selected** change the cloud or the list; they are absent in **Outlier influence**. **Delete selected** removes the selected point only while more than three points remain in the cloud, or more than five in the list

Suggested order: Scatter and regression, then Outlier influence, then Percentile box.

## What to notice

- The cloud shows direction, the outlier comparison shows influence, and the box plot shows order.
- The mean and the least-squares line are easy for a high-influence point to pull. The median and the quartiles first ask where the middle of the ordered sample sits.
- An outlier is not one rule. In the plane, ask whether the point pulls the trend. On the number line, ask whether it falls past the whisker fences.

## Related

- [Scatter, correlation, and the regression line](/en/works/scatter-correlation-regression/)
- [An outlier's effect on the regression line](/en/works/regression-outlier-influence/)
- [Percentiles and a box plot](/en/works/percentile-box-plot/)

## Further reading

- [Pearson correlation coefficient (Wikipedia)](https://en.wikipedia.org/wiki/Pearson_correlation_coefficient)
- [Simple linear regression (Wikipedia)](https://en.wikipedia.org/wiki/Simple_linear_regression)
- [Box plot (Wikipedia)](https://en.wikipedia.org/wiki/Box_plot)
- [Percentile (Wikipedia)](https://en.wikipedia.org/wiki/Percentile)
