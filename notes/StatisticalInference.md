---
title: Statistical Inference (aka "Learning")
mathjax: true
---

{% include mathjax.html %}

## Fundamentals

- Using data to *infer* the distribution that generated it
- Frequentist: data are random variables and parameters are fixed quantities
- Bayesian: data are fixed quantities and parameters are random variables

### Point Estimation

- "Best guess"
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

- The $1 - \alpha$ confidence interval for parameter $\theta$ is an interval $C_n = (a, b)$ where $a,b$ are functions of the data such that $$P_{\theta}(\theta \in C_n) \geq 1 - \alpha, \quad \text{for all}\, \theta \in \Theta$$ 
- $C_n = (a,b)$ "traps" the parameter $\theta$ with probability of at least $1-\alpha$. Note that $C_n$ is the random component here, and $\theta$ is assumed to be fixed.
- The (frequentist) idea is that if we repeated the experiment and statistical procedure many times, and each time we computed a new $C_n$, we would trap $\theta$ in $1-\alpha$ of the repetitions.
- When a variable follows a Normal distribution (e.g. from CLT), then we can construct 95% confidence intervals as $\pm 1.96 \hat{\text{se}}$.
- It can be hard to compute confidence intervals analytically. With modern computers we can often use the **bootstrap** to estimate them instead.

### Hypothesis Tests

- Define a test $$H_0 : \theta \in \Theta_0 \quad \text{versus} \quad H_1 : \theta \in \Theta_1$$
- Let $X$ be a random variable with suppport $\mathcal{X}$. We test the hypothesis by finding a subset of outcomes $R \subset \mathcal{X}$ called the **rejection region**. We reject the test if $X \in R$.
- Generally $R = \{ x : T(x) > c \}$ where $T$ is a *test statistic* and $c$ is a *critical value*.
- The *power function* is given by $$\beta(\theta) = P_{\theta}(X \in R)$$
- The *size* is defined as $ \alpha = \sup_{\theta \in \Theta_0} \beta(\theta) $
  - Test has level $\alpha$ if its sizes is $\leq \alpha$
- The **p-value** is the smallest level $\alpha$ at which the test rejects
  - It is the probability under $H_0$ of observing a value of the test statistic that is the same as or more extreme than what was actually observed
- It can be difficult to compute p-values, but with modern computers we can make use of a **permutation test**. This test repeatedly permutes the variables of interest (explicitly breaking any association) and computes the test statistic. The p-value is taken as the proportion of values that are greater or equal than the observed value.

## Parametric Estimation

### Maximum Likelihood

Define the likelihood function as the joint density of the data $$\mathcal{L}(\theta) = \Pi_{i=0}^{n} f(X_i  \mid  \theta),$$
then the maximule likelihood estimator (MLE) is given by the solution to
$$ \hat{\theta} = \text{argmax}_{\theta} \mathcal{L}(\theta).$$

### Bayesian Inference

Posterior distribution:
$$ P(\theta \mid D) \propto P(D \mid \theta) P(\theta) $$