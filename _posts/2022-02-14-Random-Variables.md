---
title: Random Variables
date: 2022-02-14 16:00:00 +/-TTTT
categories: [Math]
tags: [notes, statistics]
math: true
---

## Fundamentals

- A random variable is a mapping $X : \Omega \to \mathbb{R}$ that assigns a real number $X(\omega)$ to each outcome $\omega$.

### Cumulative Density Function (CDF)
- It is the function $F_X : \mathbb{R} \to [0, 1]$ defined by $F_X(x) = P(X \leq x)$
- The CDF completely determines the distribution of a random variable
  - Theorem: Let $X$ have CDF $F$ and let $Y$ have CDF $G$. If $F(x) = G(x)$ for all $x$, then $P(X \in A) = P(Y \in A)$ for all $A$ (if $A$ is measurable).

#### Lemmas:
- $P(x \leq X \leq y) = F_X(y) - F_X(x)$
- $P(X \geq x) = 1 - F(x)$.

### Probability Density Function (PDF)
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