---
title: Notes on Statistics
description: A concise collection of reference notes for statistics.
date: 2022-02-14 16:00:00 -0500
categories: [Math]
tags: [notes, statistics]
math: true
---

## Probability

### Axioms

1. $ P(A) \geq 0 $ for all $ A $
2. $ P(\Omega) = 1 $ where $ \Omega $ is the sample space
3. If $A_i$ are *disjoint* (or *mutually exclusive*), then $ P( \bigcup_{i}^{\infty} A_i ) = \sum_{i}^{\infty} P(A_i) $

#### Interpretations of $P(A)$
- Frequentist: long-run frequency
- Bayesian: degree of belief

#### Lemmas
- Complement: $P(A^c) = 1 - P(A)$
- Subset: $A \subset B \implies P(A) \leq P(B)$
- Venn diagram: $P(A \cup B) = P(A) + P(B) - P(A \cap B)$

### Independence
- $A,B$ are **independent** if $ P(A \cap B) = P(A) P(B) $
  - Extends to a set of indepedent events.
- Either assumed or verified (by the above equation).
  - Trick: if $A,B$ are disjoint, each with positive probability, can they be independent? No, equation is violated: $P(A \cap B) = 0$ (by disjointness) but $P(A)P(B) > 0$ (by positivity), and so $ P(A \cap B) \neq P(A) P(B) $.
  - In general: no way to judge independence based on Venn diagram alone!

### Conditional Probability
- Define $P(A \mid B) = \frac{P(A,B)}{P(B)}$ if $P(B)>0$.
  - Fraction of times that A occurs among events in which B also occurs
- Axioms of probability apply to events **left of the bar, not the right**
  - E.g. if $A,B$ disjoint, then $P(A \cup B \mid C) = P(A \mid C) + P(B \mid C)$, but in general $P(C \mid A \cup B) \neq P(C \mid A) + P(C \mid B).$
- In general, $P(A \mid B) \neq P(B \mid A)$.
  - E.g. probability of tumor given cancer is 1, but probability of cancer given tumor < 1 (could be benign)

#### Lemmas
- If $A,B$ independent, $P(A \mid B) = \frac{P(A)P(B)}{P(B)} = P(A)$
- $P(A,B) = P(A \mid B)P(B) = P(B \mid A)P(A)$
  - $\implies P(A \mid B) = \frac{P(B \mid A)P(A)}{P(B)}$ (Bayes' rule)

### Bayes' Theorem
- Law of total probability: if $A_i$ partitions $\Omega$, then for any event $B$, $ P(B) = \sum_{\forall i} P(B \mid A_i)P(A_i) $
  - For conditional probabilities, we have $P(B \mid C) = \sum_{\forall i} P(B \mid C \cap A_i) P(A_i \mid C)$
- Bayes' rule: $P(A \mid B) = \frac{P(B \mid A)P(A)}{P(B)} = \frac{P(B \mid A)P(A)}{\sum_{\forall i}P(B \mid A_i)P(A_i)}$

---

## Random Variables

- A random variable is a mapping $X : \Omega \to \mathbb{R}$ that assigns a real number $X(\omega)$ to each outcome $\omega$.

### Cumulative Density Function
- It is the function $F_X : \mathbb{R} \to [0, 1]$ defined by $F_X(x) = P(X \leq x)$
- The CDF completely determines the distribution of a random variable
  - Theorem: Let $X$ have CDF $F$ and let $Y$ have CDF $G$. If $F(x) = G(x)$ for all $x$, then $P(X \in A) = P(Y \in A)$ for all $A$ (if $A$ is measurable).

#### Lemmas
- $P(x \leq X \leq y) = F_X(y) - F_X(x)$
- $P(X \geq x) = 1 - F(x)$.

### Probability Density Function
- Discrete: $f_X(x) = P(X=x)$
- Continuous: The function $f_X$ with $f_X(x) \geq 0$ for all $x$, and $\int_{-\infty}^{\infty} f_X(x)dx = 1$, such that $$ P(a < X < b) = \int_{a}^{b} f_{X}(x)dx $$
  - We have that $F_X(x) = \int_{-\infty}^{x} f_{X} (t) dt$ and $f_X(x) = F'_{X}(x)$ for all $x$ at which $F_X$ is differentiable.
  - **Warning!** Probabilities come from a continous PDF by integrating. For continuous variables $P(X=x) = 0$ for all $x.$ We can also have $f_X > 1$, for examle with $f(x) = 5$ for $x \in [0, 1/5]$ and $0$ otherwise.

### Marginalization
- Discrete: $f_X(x) = \sum_{y} f(x,y)$ (and conversely for $f_Y$)
- Continuous: $f_X(x) = \int f(x,y)dy$ (and conversely for $f_Y$)

### Conditional Distributions
- $f_{X \mid Y}(x \mid y) = \frac{f_{X,Y}(x,y)}{f_{Y}(y)} $
  - This is analogous to the definition of conditional probability.

### Multivariate Distributions and IID Samples
- If $X_i$ are *independent* and each has the *same marginal distribution* with CDF $F$, we say that $X_i$ are IID and write $X_i \sim F$.

### Transformations of Random Variables
- The most general approach is to compute the CDF of the transformed variable and to differentiate to obtain the PDF. 

### Important Distributions
#### Bernoulli
- $X \sim Bern(p)$ with $X \in [0, 1]$
- $f_{X}(x) = p^x (1-p)^{(1-x)}$
- $E[X] = p$
- $Var(x) = p(1-p)$

#### Binomial
- Number of successes in $n$ trials
- $X \sim Binom(n,p)$
- $f_{X}(x) = {n \choose x}p^x (1-p)^{n-x}$
- $E[X] = np$
- $Var(x) = np(1-p)$

#### Geometric
- Number of trials before first success
- $X \sim Geom(p)$
- $f_{X}(x) = (1-p)^{x-1} p$
- $E[X] = 1/p$
- $Var(X) = (1-p)/p^2$

#### Univariate Normal
- Normal (Gaussian) $$ f(x) = \frac{1}{\sigma\sqrt{2\pi}} \exp{\{-\frac{(x - \mu)^2}{2\sigma}}\}$$
- If $X \sim N(\mu, \sigma^2)$, then $Z = (X - \mu)/\sigma \sim N(0,1)$
- If $X_i \sim N(\mu_i, \sigma_i^2)$ are independent, then $$ \sum X_i \sim N(\sum \mu_i, \sum \sigma_i^2) $$

#### Multivariate Normal
- If the vector $X$ (with $k$ components) comes from a multivariate normal distribution $X \sim N(\mu, \Sigma)$ , then $$ f(x \mid \mu, \Sigma) = \frac{1}{(2\pi)^{k/2}\det(\Sigma)^{1/2}} \exp{\{ -\frac{1}{2}(x-\mu)^T \Sigma^{-1} (x-\mu) \}}$$
  - $\mu$ is a vector of length $k$
  - $\Sigma$ is a $k \times k$ symmetric, positive definite matrix
  - Note that $\Sigma^{-1}$ denotes the *inverse* of $\Sigma$

#### $\chi^2$ Distribution

Let $Z_1, Z_2, ..., Z_n$ be independent standard Normals. Let $V = \sum_i^n Z_i^2.$ Then V has a $\chi^2$ distribution with $n$ degrees of freedom.

---

## Statistical Inference

- Using data to *infer* the distribution that generated it
- Frequentist: data are random variables and parameters are fixed quantities
- Bayesian: data are fixed quantities and parameters are random variables

### Point Estimation

- Examples:
  - parameter of a parametric model, 
  - a CDF $F$, 
  - a PDF $f$,
  - a regression function $r$, or 
  - a prediction of a future value $Y$ of some random variable
- It is a function of the data: $ \hat{\theta} = g(X_1, X_2, ..., X_n)$ 
- The distribution of $\hat{\theta}$ induced by the data generating process is called the *sampling distribution*. Expectations of $\hat{\theta}$ are taken with respect to the distribution that generated the data, $\Pi_{i}^{n} f(x_i \mid \theta).$
- Metrics:
  - Bias: $\text{bias}(\hat{\theta}) = E(\hat{\theta}) - \theta$
  - Standard error: $\text{se}(\hat{\theta}) = \sqrt{\text{Var}(\hat{\theta})}$
  - Mean squared error: $\text{MSE} = E(\hat{\theta} - \theta)^2$
    - Bias-variance decomposition: $\text{MSE} = \text{bias}^2(\hat{\theta}) + \text{Var}(\hat{\theta})$

### Confidence Sets

- The $1 - \alpha$ confidence interval for parameter $\theta$ is an interval $C_n = (a, b)$ where $a,b$ are functions of the data such that 

$$

P_{\theta}(\theta \in C_n) \geq 1 - \alpha, \quad \text{for all}\, \theta \in \Theta

$$

 
- $C_n = (a,b)$ "traps" the parameter $\theta$ with probability of at least $1-\alpha$. Note that $C_n$ is the random component here, and $\theta$ is assumed to be fixed.
- The (frequentist) idea is that if we repeated the experiment and statistical procedure many times, and each time we computed a new $C_n$, we would trap $\theta$ in $1-\alpha$ of the repetitions.
- When a variable follows a Normal distribution (e.g. from CLT), then we can construct 95% confidence intervals as $\pm 1.96 \hat{\text{se}}$.
- It can be hard to compute confidence intervals analytically. With modern computers we can often use the **bootstrap** to estimate them instead.

### Hypothesis Tests

- Define a test 

$$

H_0 : \theta \in \Theta_0 \quad \text{versus} \quad H_1 : \theta \in \Theta_1

$$


- Let $X$ be a random variable with suppport $\mathcal{X}$. We test the hypothesis by finding a subset of outcomes $R \subset \mathcal{X}$ called the **rejection region**. We reject the test if $X \in R$.
- Generally $R = \{ x : T(x) > c \}$ where $T$ is a *test statistic* and $c$ is a *critical value*.
- The *power function* is given by 

$$

\beta(\theta) = P_{\theta}(X \in R)

$$


- The *size* is defined as $ \alpha = \sup_{\theta \in \Theta_0} \beta(\theta) $
  - Test has level $\alpha$ if its sizes is $\leq \alpha$
- The **p-value** is the smallest level $\alpha$ at which the test rejects
  - It is the probability under $H_0$ of observing a value of the test statistic that is the same as or more extreme than what was actually observed.
  - It measures the probability mass in the tail(s) of the distrbution under $H_0$.

#### Wald Test
Consider 

$$

 H_0: \theta = \theta_0 \quad H_1: \theta \neq \theta_0. 

$$

 Assume that $\hat\theta$ is asymptotically Normal 

$$

 \frac{\hat\theta - \theta_0}{\hat{se}} \to N(0, 1) 

$$

 as $n \to \infty$. The size $\alpha$ Wald test is to reject $H_0$ when $ \mid W \mid  =  \mid \frac{\hat\theta - \theta_0}{\hat{se}} \mid  > z_{\alpha/2}. $ Note that the Wald test is equivalent to checking whether the null value is in the confidence interval. The Wald test rejects when 

$$

 \theta_0 \notin (\hat\theta - \hat{\text{se}} z_{\alpha/2}, \hat\theta + \hat{\text{se}} z_{\alpha/2}) 

$$



#### Pearson's $\chi^2$ for Multinomial Data

#### Permutation Test
- It can be difficult/impossible to compute p-values for complex cases, but with modern computers we can make use of a **permutation test**. This test repeatedly permutes the variables of interest (explicitly breaking any association) and computes the test statistic. 
- The p-value is taken as the proportion of values that are greater or equal than the observed value (the tails of the sampling distribution under the null hypothesis).

#### Likelihood Ratio Test
This test generalizes the Wald test to vector-valued parameters. Consider 

$$

 H_0 : \theta \in \Theta_0 \quad H_1 : \theta \notin \Theta_0. 

$$



The test statistic is 

$$

 \lambda = 2 \log \frac{\sup_{\theta \in \Theta} \mathcal{L}(\theta)}{\sup_{\theta \in \Theta_0} \mathcal{L}(\theta)} = 2 \log \frac{\mathcal{L}(\hat \theta)}{\mathcal{L}(\hat \theta_0)}, 

$$

 where $\hat \theta$ is the MLE and $\hat \theta_0$ is the MLE when $\theta$ is restricted to lie in $\Theta_0$.

## Parametric Estimation

### Maximum Likelihood

Define the likelihood function as the joint density of the data 

$$

\mathcal{L}(\theta) = \Pi_{i=0}^{n} f(X_i  \mid  \theta),

$$


then the maximum likelihood estimator (MLE) is given by the solution to


$$

 \hat{\theta} = \text{argmax}_{\theta} \mathcal{L}(\theta).

$$



Note that the likelihood $\mathcal{L}$ is not a probability density and does not integrate to $1$ (over $\theta$). We treat the likelihood as **a function of $\theta$**.

#### Properties of the MLE
Under regularity conditions (smoothness) on $f(x  \mid  \theta)$.
- Consistency
- Asymptotically Normal (can construct asymptotic confidence intervals)
- Asymptotically optimal (smallest variance)
- Equivariant ($\hat\theta$ for $\theta \implies g(\hat \theta)$ for $g(\theta)$)
- Approximately Bayes estimator

### Expectation Maximization

Fill in the missing data/latent variables with some initial values (e.g. zero). Then repeat until convergence:
1. M-step: use "filled-in" data to construct estimates $\hat{\theta}_t$ for the parameters of interest in the standard way (e.g. MLE)
2. E-step: update the missing data/latent variables with conditional expectations based on the *non-missing* data, assuming $\theta = \hat{\theta}_t$

In this way, the process iterates between filling in the missing data/latent variables and computing the parameters of interest. This algorithm is guaranteed to converge to the MLE for exponential families. Moreover, the likelihood increases with every step.

### Bayesian Inference

Posterior distribution:


$$

 P(\theta \mid D) \propto P(D \mid \theta) P(\theta) 

$$

---

## Convergence of Random Variables

### Preamble

Recall that for $X_1, X_2, ..., X_n$ an IID sample, with $Var(X_i) = \sigma^2$, 

$$
\begin{aligned}

 Var(\bar X_n) &= Var(n^{-1} \sum_i^n X_i ) \\
 &= n^{-2} Var(\sum_i^n X_i) \\
 &= n^{-2} \sum_i^n Var(X_i) \\
 &= n^{-2} (n \sigma^2) \\
 &= \sigma^2 / n.

\end{aligned}
$$

### Law of Large Numbers

**Statement:** Let $X_1, X_2, ..., X_n$ be an IID sample. Let $\mu = E[X_i]$ and $\sigma^2 = Var(X_i)$. Then 

$$

 \bar X_n \to \mu 

$$

 as $ n \to \infty $, in probability.

**Proof:** For some $\epsilon > 0$, 

$$

 P( \mid \bar X_n - \mu \mid  > \epsilon) \leq \frac{Var(\bar X_n)}{\epsilon^2} = \frac{\sigma^2}{n \epsilon^2}, 

$$

 by Chebyshev's inequality, which tends to $0$ as $n \to \infty$. $\square$

### Central Limit Theorem

**Statement:** Let $X_1, X_2, ..., X_n$ be IID with mean $\mu$ and variance $\sigma^2$. Let $\bar X = n^{-1} \sum_i^n X_i.$ Then 

$$

 \bar X \to N(\mu, \sigma^2 / n)

$$

 as $n \to \infty$. This is remarkable because nothing was assumed about the form of the distrbution of $X$. 

---

## Expectations of Random Variables

### Definitions
- Expected value: $E[X] = \int x f(x) dx$
- Variance (spread): $\text{Var}(X) = E[(X-E[X])^2]$
- Covariance (relationship): $\text{Cov}(X, Y) = E[(X - E[X])(Y - E[Y])] $
  - Correlation: $\text{Corr}(X, Y) = \text{Cov}(X, Y)/(\sigma_x \sigma_y) $

### Properties
Rule of the lazy statistician. Let $Y=r(X)$. Then $$ E[Y] = E[r(X)] = \int r(x) f_{x}(x) dx. $$

For random variables $X_1, X_2, ..., X_n$ and constants $a_i$,
- Sums: $E[\sum a_i X_i] = \sum a_i E[X_i]$
- Products: **(if $X_i$ independent)** $ E[\prod X_i] = \prod E[X_i] $
- Sum of variances: **(if $X_i$ independent)** $ Var(\sum X_i) = \sum Var(X_i)$
- $Var(X) = E[X^2] + E[X]^2$
- $Var(aX+b) = a^2 Var(X)$
- $Cov(X,Y) = E[XY] - E[X]E[Y]$
- Sum of variances: **(general case)** $ Var(\sum X_i) = \sum Var(X_i) + 2 \sum \sum_{i < j} Cov(X_i, X_j)$

### Conditionals
- $E[X \mid Y=y] = \int x f_{X \mid Y}(x \mid y) dx$
  - Note that while $E[X]$ is a number, $E[X \mid Y]$ is a random variable whose value is $E[X \mid Y=y]$ when $Y=y$.
- Iterated expectations: $ E[E[X \mid Y]] = E[X] $
- $Var(X \mid Y=y) = \int (x - E[X \mid Y=y])^2 f_{X \mid Y}(x \mid y) dx $
- $Var(X) = E[Var(X \mid Y)] + Var(E[X \mid Y])$

---

## Linear Regression

### Preamble

Note that in a regression problem we attempt to summarize a relationship between variable $Y$ and predictor $X$ by finding a regression function $r$ such that: 

$$

 r(x) = \mathbb{E}(Y \mid X=x) = \int y f(y \mid x) dy. 

$$

 In words, the regression function is the conditional expectation of the target variable $Y$ given the predictor $X$.

### Formulation

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

### Estimation

A common approach is to choose $\hat{\beta}$ that minimizes the mean squared error, called *least squares*: 

$$

 \hat{\beta} = \text{argmin}_{\beta}  \mid  \mid  Y - X\beta  \mid  \mid ^{2}. 

$$

 

Note that in the special case of $Y \sim N(X\beta, \sigma^2)$, the least squares estimator is also the maximum likelihood estimator.

#### By calculus

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



#### By orthogonality

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



### Inference

The inference problem amounts to finding standard errors for $Y$ and $\beta$. It's important to note that an unbiased estimate of $\sigma^2$ is given by 

$$

 \hat\sigma^2 = \frac{1}{n-p}\sum_i^n \hat\epsilon_i^2, 

$$

 where $\epsilon_i$ are the residuals $y_i - x_i\beta$. The importance here is that the variance term computes the spread of $y$ *from the regression line*.

#### Parameters

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

#### Prediction

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