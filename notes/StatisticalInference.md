---
title: Statistical Inference (aka "Learning")
mathjax: true
---

{% include mathjax.html %}

## Fundamentals

- Using data to *infer* the distribution that generated it
- Frequentist: data are random variables and parameters are fixed quantities
- Bayesian: data are fixed quantities and parameters are random variables

### Point Estimation ("Best Guess")

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

