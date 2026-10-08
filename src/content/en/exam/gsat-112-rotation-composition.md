---
title: Rotation and reflection matrices
description: "112 GSAT Mathematics A, Multiple select 11: compare images, inverses, and compositions of rotation and reflection matrices."
subject: 學測數A
year: 112
questionType: 多選
questionNo: '11'
unit: Grade 12 elective Mathematics A · Matrices and linear transformations
topics:
  - Rotation matrices
  - Reflection matrices
  - Matrix multiplication
concepts:
  - matrix
  - linear-transformation
sourceUrl: https://www.ceec.edu.tw/files/file_pool/1/0n045358375872115148/03-112%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf
analysisUrl: https://public.ehanlin.com.tw/pre-exam/gsat/112%E7%BF%B0%E6%9E%97%E5%AD%B8%E6%B8%AC%E7%B2%BE%E5%BD%A9%E8%A7%A3%E6%9E%90-%E6%95%B8%E5%AD%B8A%E8%80%83%E7%A7%91.pdf
relatedExplore:
  - matrix-linear-transform
relatedWorks:
  - linear-transform-grid
  - rotation-scale-composition
date: 2026-07-19
order: 1
coverImage: /images/exam-covers/gsat-112-rotation-composition.png
featured: false
draft: false
---

## Problem

Let $A$ and $B$ be the rotations about the origin by $90°$ clockwise and counterclockwise, and let $C$ and $D$ be the reflections in the lines $x=y$ and $x=-y$. Pick the correct statements about images of points, negatives of matrices, inverses, and compositions.

The full question and options are on the [CEEC 112 GSAT Mathematics A paper](https://www.ceec.edu.tw/files/file_pool/1/0n045358375872115148/03-112%E5%AD%B8%E6%B8%AC%E6%95%B8%E5%AD%B8a%E8%A9%A6%E5%8D%B7.pdf).

## Where it goes wrong

The solution notes rate this item medium-easy; it tests the properties of rotation and reflection matrices. The hard part is not heavy computation. It is getting three things right at once: the signs for clockwise and counterclockwise, the direction of each mirror line, and the rule that the transformation applied first is written on the right of a product. Memorizing only the shape of the matrices often leads to mistaking $C^{-1}$ for the other reflection, or to assuming every pair of transformations commutes.

## Idea

The matrix of a counterclockwise rotation by $\theta$ about the origin is

$$
R(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}
$$

so

$$
\begin{aligned}
A &= R(-90^\circ),\\
B &= R(90^\circ),\\
A &= -B.
\end{aligned}
$$

The two reflection matrices are

$$
C=\begin{bmatrix}0&1\\1&0\end{bmatrix}, \qquad
D=\begin{bmatrix}0&-1\\-1&0\end{bmatrix}.
$$

Reflecting twice returns to the start, so $C^{-1}=C$ and $D^{-1}=D$. In a matrix product the transformation applied first is written on the right. Multiplying directly gives

$$
\begin{aligned}
AB &= I,\\
CD &= -I,\\
AC=BD &= \begin{bmatrix}1&0\\0&-1\end{bmatrix}.
\end{aligned}
$$

The two rotations commute here; a rotation and a reflection usually do not. Check each pair by its geometric action or by multiplying it out. "Matrix multiplication usually does not commute" does not mean every pair is unequal.

## What the figure shows

- Each product plays in two steps. For example, $AC$ applies $C$ first, then $A$.
- **Two rotations**: compare $AB$ and $BA$, and check that both return to the start.
- **Rotation and reflection**: compare $AC$ and $CA$, and watch the same two transformations split apart when the order changes.
- **AB vs CD**: one side is the identity, the other a $180°$ rotation.
- **AC vs BD**: two different compositions land on the same reflection in the $x$-axis.
