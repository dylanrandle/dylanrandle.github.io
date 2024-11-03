---
title: Linear Regression
date: 2022-02-28 16:00:00 +/-TTTT
categories: [Math]
tags: [notes, statistics]
math: true
---

## Preamble

Note that in a regression problem we attempt to summarize a relationship between variable $Y$ and predictor $X$ by finding a regression function $r$ such that: 

$$

 r(x) = \mathbb{E}(Y \mid X=x) = \int y f(y \mid x) dy. 

$$

 In words, the regression function is the conditional expectation of the target variable $Y$ given the predictor $X$.

## Formulation

We observe data $ (x_i, y_i) \sim F_{x,y} $ where $ x_i \in R^p$ is a vector of features and $y_i$ is a continuous scalar.

Let $ Y = [y_1, y_2, ..., y_n]^{T} $ be the vector of responses $y_i$ and $X = [x_1, x_2, ..., x_n]^{T} $ the matrix of observations (design matrix).

Assume a linear model of the form 

$$

 Y = X^{T}\beta + \epsilon, 

$$

 where $E[\epsilon  \mid  X] = 0$, and $Var(\epsilon  \mid  X) = \sigma^2$. One important case is when we assume $ \epsilon \sim N(0, \sigma^2) $ which is also equivalent to 

$$

 Y \sim N(X^T\beta, \sigma^2). 

$$



In either case, our *estimation* goal is to find a sensible $\hat{\beta} \in R^p$ that allows us to make reasonable *predictions*, while our *inference* goal is to determine standard errors for $\hat{Y}$ and $\hat{\beta}$ that allow us to construct confidence intervals and test hypotheses. Note that both of these tasks require estimates of $\hat\sigma^2, $ which we will discuss in the inference section.

## Estimation

A common approach is to choose $\hat{\beta}$ that minimizes the mean squared error, called *least squares*: 

$$

 \hat{\beta} = \text{argmin}_{\beta}  \mid  \mid  Y - X\beta  \mid  \mid ^{2}. 

$$

 

Note that in the special case of $Y \sim N(X\beta, \sigma^2)$, the least squares estimator is also the maximum likelihood estimator.

### A) By calculus

Recall from vector calculus that 

$$

 \frac{\partial}{\partial x} x^{T} A x = (A + A^{T})x = 2Ax 

$$

 when $A$ is a symmetric matrix.

Take derivatives of the least squares objective and set to zero 

$$

 \frac{\partial}{\partial_\beta} (Y - X\beta)^T(Y - X\beta) = 0, 

$$

 expanding terms on the left hand side we see that 

$$

\frac{\partial}{\partial_\beta} Y^TY - Y^TX\beta -\beta^TX^TY + \beta^TX^TX\beta = 0,

$$



with the scalars $Y^TX\beta = (\beta^TX^TY)^T = \beta^TX^TY$, which simplifies the expression to 

$$

 \frac{\partial}{\partial_\beta} Y^TY - 2\beta^TX^{T}Y + \beta^TX^TX\beta = 0 

$$

 and using the fact that $X^{T}X$ is symmertic we obtain 

$$

 -2X^{T}Y + 2X^{T}X\beta = 0, 

$$

 which after rearranging gives us 

$$

 \beta = (X^{T}X)^{-1}X^{T}Y. 

$$



### B) By orthogonality

This is a more elegant method where we use the fact that the optimal solution is one in which the residual vectors must be orthogonal to the data, since the minimum distance between two points in Euclidian space is the straight line between them. Specifically, we want 

$$

 X^T \cdot (Y - X\beta) = 0 

$$

 which yields 

$$

 X^TY - X^TX\beta = 0 

$$

 and with a bit of algebra gives 

$$

 \hat\beta = (X^TX)^{-1}X^{T}Y. 

$$



## Inference

The inference problem amounts to finding standard errors for $Y$ and $\beta$. It's important to note that an unbiased estimate of $\sigma^2$ is given by 

$$

 \hat\sigma^2 = \frac{1}{n-p}\sum_i^n \hat\epsilon_i^2, 

$$

 where $\epsilon_i$ are the residuals $y_i - x_i\beta$. The importance here is that the variance term computes the spread of $y$ *from the regression line*.

### Parameters

By definition, the standard errors of the parameters $\hat\beta$ are given by $ \sqrt{Var(\hat\beta)}. $ Recall that our model of the data generating process is $ Y = X\beta + \epsilon $ where $\epsilon$ is a random variable with $E[\epsilon \mid X] = 0$ and $Var(\epsilon \mid X)=\sigma^2$. If we substitute this into our estimator for $\hat\beta$, we have 

$$

 \hat\beta = (X^TX)^{-1}X^{T}(X\beta + \epsilon) 

$$

 which is a random quantity because of $\epsilon.$ Under assumptions of homoskedasticity, and with the application of several properties of expectation and variance ([see here](https://stats.stackexchange.com/a/217334)), one can obtain 

$$

 Var(\hat\beta) = \sigma^2 (X^TX)^{-1},

$$

 where plugged in $\hat\sigma^2$ for $\sigma$. This is a matrix in which the square root of the diagonal elements contains the standard errors of the individual coefficients, and the off-diagonal elements give the covariances between them.

Further note that it can be shown, under appropriate conditions, we have:
- Consistency: $\hat\beta \to \beta$ in probability
- Asymptotic Normality: $\frac{\hat\beta - \beta}{\text{se}(\hat\beta)} \to N(0, 1)$
- Approximate $1 - \alpha$ confidence intervals: $ \hat\beta \pm z_{\alpha/2}\text{se}(\hat\beta) $
- The Wald test 

$$

 H_0: \beta = 0 \quad H_1: \beta \neq 0 

$$

 where we reject $H_0$ if $\frac{\hat\beta}{\text{se}(\hat\beta)} > z_{\alpha/2}.$

### Prediction

Again, by definition, the standard error of a prediction $\hat y$ for a new data point $x$ is given by 

$$

 \sqrt{Var(\hat y)} = \sqrt{Var(x\hat\beta)} = \sqrt{x^TVar(\beta)x}. 

$$

 Now substituting the result for $Var(\hat\beta)$ from above, we have 

$$

 \text{se}(\hat y) = \hat\sigma \sqrt{x^T(X^TX)^{-1}x}, 

$$

 where we have plugged in $\hat\sigma$ for $\sigma$.

### Summary of Key Assumptions
- The underlying relationship is linear in the parameters
- $\mathbb{E}(\epsilon \mid X) = 0 $ (zero and doesn't depend on X)
- $Var(\epsilon \mid X) = \sigma^2 $ (constant and doesn't depend on X)
- $\epsilon_i$ are uncorrelated (no autocorrelation)
- No perfect correlation between predictors ($X^TX$ invertible)
- (Not required, but can be helpful) $\epsilon \sim N(0, \sigma^2) $