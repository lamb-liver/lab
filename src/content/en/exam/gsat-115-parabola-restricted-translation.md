---
title: A parabola under a restricted translation
description: Keep the vertex on one line and the graph through one fixed point, then discard the translation that leaves the parabola where it was.
subject: 學測數A
year: 115
questionType: 選填
questionNo: '16'
unit: Senior-high year 1 required mathematics · Quadratics and translating a graph
topics:
  - Vertex form of a quadratic
  - Translation of a graph
  - Length of a vector
concepts:
  - quadratic-function
  - function-transformation
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0q054344158947111283/03-115%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://math.ntnu.edu.tw/~li/108/115A.html
relatedExplore:
  - function-equations
  - vectors
relatedWorks:
  - quadratic-completing-square
  - function-graph-transform
coverImage: /images/exam-covers/gsat-115-parabola-restricted-translation.png
date: 2026-07-26
order: 7
featured: false
draft: false
---

## Problem

The vertex $P$ of a parabola $\Gamma$ lies on the line $\ell:y=1+2x$, and the graph meets the $x$-axis at $A=\left(-\dfrac{1}{2},0\right)$ and $B=\left(\dfrac{1}{2},0\right)$. Translate the whole parabola so that the new vertex $Q$ is still on $\ell$ and the new graph still passes through $B$. Given that $P$ and $Q$ are distinct, find the distance $PQ$. The full question is on the [original 115 GSAT Math A paper](https://www.ceec.edu.tw/files/file_pool/1/0q054344158947111283/03-115%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf).

## Where it goes wrong

The [item analysis](https://math.ntnu.edu.tw/~li/108/115A.html) compiles the CEEC report for this question: a correct rate of $31\%$, $63\%$ in the high-scoring group and $7\%$ in the low-scoring group. What is easy to miss is not solving the quadratic. It is the order of the conditions. "Still passes through $B$" gives two positions, and the original position $Q=P$ is one of them. "$P$ and $Q$ are distinct" is what rules that one out.

## Idea

From the two intercepts on the $x$-axis, the original parabola can be written

$$
f(x)=a\left(x-\frac12\right)\left(x+\frac12\right).
$$

Its axis of symmetry is $x=0$, and the vertex also lies on $y=1+2x$, so $P=(0,1)$. Substituting gives $a=-4$, that is $f(x)=-4x^2+1$.

Let the translated vertex be $Q=(h,1+2h)$. The new parabola keeps the same shape:

$$
y=-4(x-h)^2+(1+2h).
$$

Require that it still pass through the fixed point $B=\left(\dfrac{1}{2},0\right)$:

$$
\begin{aligned}
0&=-4\left(\frac12-h\right)^2+1+2h\\
&=2h(3-2h).
\end{aligned}
$$

So $h=0$ or $h=\dfrac{3}{2}$. The first makes $Q=P$, which violates that the two points are distinct, so take $h=\dfrac{3}{2}$. Both vertices move along the direction $(1,2)$, and

$$
PQ=\sqrt{h^2+(2h)^2}=\frac{3\sqrt5}{2}.
$$

The argument uses only the vertex form, translation of a graph, a quadratic equation, and the length of a vector. It does not use a derivative.

## What the figure shows

- **h=0, Q=(0,1)**: select the original position. It still passes through $B$, but it violates that $P$ and $Q$ are distinct. The mark is $P=Q$.
- **h=3/2, Q=(3/2,4)**: select the other position. The blue parabola still passes through $B$, and the vertex has moved along $\ell$.
- Compare the segment $PQ$ with the direction of $\ell$, and read the translation vector $(h,2h)$ and the distance $\dfrac{3\sqrt5}{2}$.
