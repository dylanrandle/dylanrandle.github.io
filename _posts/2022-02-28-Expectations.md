---
title: Expectations of Random Variables
date: 2022-02-28 16:00:00 +/-TTTT
categories: [Math]
tags: [notes, statistics]
math: true
---

## Definitions
- Expected value: $E[X] = \int x f(x) dx$
- Variance (spread): $\text{Var}(X) = E[(X-E[X])^2]$
- Covariance (relationship): $\text{Cov}(X, Y) = E[(X - E[X])(Y - E[Y])] $
  - Correlation: $\text{Corr}(X, Y) = \text{Cov}(X, Y)/(\sigma_x \sigma_y) $

## Properties
Rule of the lazy statistician. Let $Y=r(X)$. Then $$ E[Y] = E[r(X)] = \int r(x) f_{x}(x) dx. $$

For random variables $X_1, X_2, ..., X_n$ and constants $a_i$,
- Sums: $E[\sum a_i X_i] = \sum a_i E[X_i]$
- Products: **(if $X_i$ independent)** $ E[\prod X_i] = \prod E[X_i] $
- Sum of variances: **(if $X_i$ independent)** $ Var(\sum X_i) = \sum Var(X_i)$
- $Var(X) = E[X^2] + E[X]^2$
- $Var(aX+b) = a^2 Var(X)$
- $Cov(X,Y) = E[XY] - E[X]E[Y]$
- Sum of variances: **(general case)** $ Var(\sum X_i) = \sum Var(X_i) + 2 \sum \sum_{i < j} Cov(X_i, X_j)$

## Conditionals
- $E[X \mid Y=y] = \int x f_{X \mid Y}(x \mid y) dx$
  - Note that while $E[X]$ is a number, $E[X \mid Y]$ is a random variable whose value is $E[X \mid Y=y]$ when $Y=y$.
- Iterated expectations: $ E[E[X \mid Y]] = E[X] $
- $Var(X \mid Y=y) = \int (x - E[X \mid Y=y])^2 f_{X \mid Y}(x \mid y) dx $
- $Var(X) = E[Var(X \mid Y)] + Var(E[X \mid Y])$