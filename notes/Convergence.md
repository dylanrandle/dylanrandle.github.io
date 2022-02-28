---
title: Convergence of Random Variables
mathjax: true
---

{% include mathjax.html %}

## Preamble

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

## Law of Large Numbers

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

## Central Limit Theorem

**Statement:** Let $X_1, X_2, ..., X_n$ be IID with mean $\mu$ and variance $\sigma^2$. Let $\bar X = n^{-1} \sum_i^n X_i.$ Then 

$$

 \bar X \to N(\mu, \sigma^2 / n)

$$

 as $n \to \infty$. This is remarkable because nothing was assumed about the form of the distrbution of $X$. 