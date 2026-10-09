---
title: The same row operations, as a linear combination
description: "113 AST Mathematics I, Fill-in 9: the same row operations preserve a linear combination of the constant columns, which gives the solution of the new system."
subject: 分科數甲
year: 113
questionType: 選填
questionNo: '9'
unit: Grade 11 Mathematics A · Matrices and systems of linear equations
topics:
  - Augmented matrix
  - Row operations
  - Linear combination
concepts:
  - linear-systems
  - matrix
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0o221359215605202263/113%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E9%A1%8C.pdf
analysisUrl: https://www.ceec.edu.tw/xcepaper/cont?xsmsid=0J066588036013658199&qunit=0M105476092230875839&sid=0O260306744213652490
relatedExplore:
  - matrix-linear-transform
relatedWorks:
  - linear-transform-grid
  - row-op-solution-space
date: 2026-07-28
order: 8
coverImage: /images/exam-covers/ast-113-augmented-matrix-row-operations.png
featured: false
draft: false
---

## Problem

Two systems of linear equations share the coefficients $a,b,c,d$ and differ only in the constant column. The problem states both augmented matrices after one and the same sequence of row operations, and asks for the solution when that column is changed to the column with entries $0$ and $1$. The full numbers and the answer format are on the [CEEC 113 AST Mathematics I paper](https://www.ceec.edu.tw/files/file_pool/1/0o221359215605202263/113%E5%88%86%E7%A7%91%E6%B8%AC%E9%A9%97%E6%95%B8%E5%AD%B8%E7%94%B2%E8%A9%A6%E9%A1%8C.pdf).

## Where it goes wrong

The [official item analysis](https://www.ceec.edu.tw/xcepaper/cont?xsmsid=0J066588036013658199&qunit=0M105476092230875839&sid=0O260306744213652490) records a score rate of $42\%$ and a discrimination of $0.68$. The usual stall is to treat the row operations as a string of mechanical steps and miss that one and the same sequence keeps the multiples and the sums of the constant columns. Solving for $a,b,c,d$ also works, but it means solving two extra systems.

## Idea

Write the constant columns of the two known systems as

$$
\mathbf b_1=(2,1),\qquad \mathbf b_2=(-1,-1).
$$

The target column is already

$$
(0,1)=-\mathbf b_1-2\mathbf b_2.
$$

After the same row operations, those constant columns are $(3,2)$ and $(2,-1)$. The same multiples and the same sum still hold, so the target column becomes

$$
-(3,2)-2(2,-1)=(-7,0).
$$

The reduced augmented matrix is then the system

$$
\begin{cases}
x-y=-7,\\
y=0.
\end{cases}
$$

The solution is $x=-7$ and $y=0$.

## What the figure shows

- Drag **α × first system** and **β × second system**. The left panel writes the constant columns on one line as $\alpha(2,1)+\beta(-1,-1)$. The constants after the same row operations, and the solution, use that same combination.
- Press **Original problem α=−1, β=−2**. The original constant column is then the target, printed as $(0,1)$.
- The middle panel keeps the two rows $[1\ -1\mid \cdot]$ and $[0\ 1\mid \cdot]$. Only the constant column changes. Read $y$ from the second row, then find $x$ from the first row $x-y$.
