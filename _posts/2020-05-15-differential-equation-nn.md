---
title: Physics-Informed Generative Adversarial Networks for Differential Equations
description: We developed a novel GAN formulation for solving differential equations with physics-informed neural networks.
date: 2020-05-15 16:00:00 -0500
categories: [Research]
tags: [scientific machine learning, physics-informed neural networks, differential equations, generative adversarial networks, harvard]
math: true
image:
  path: /assets/img/deqgan.webp
  alt: Diagram of the DEQGAN generator, differential equation residual, and discriminator
---

## Background

Consider differential equations of the form

$$F\left(t, \hat{\Psi}(t), \Delta \hat{\Psi}(t), \Delta^2 \hat{\Psi}(t), ...\right) = 0.$$

To set up the problem for Differential Equation GAN (DEQGAN), we let

$$ LHS = F\left(t, \hat{\Psi}(t), \Delta \hat{\Psi}(t), \Delta^2 \hat{\Psi}(t), ...\right), $$

and $$ RHS = 0. $$

Then we optimize the discriminator ($D$) and generator ($G$) with the gradients:

$$ \eta_G = \nabla_{\theta_{g}} \frac{1}{m} \sum_{i=1}^{m} \log{ \left(1 - D \left( LHS^{(i)} \right) \right)}, $$

$$ \eta_{D} = \nabla_{\theta_{d}} \frac{1}{m} \sum_{i=1}^{m} \left[ \log D \left( RHS^{(i)} \right) + \log \left( 1 - D \left( LHS^{(i)} \right) \right) \right], $$

alternating between gradient ascent and descent steps for $D$ and $G$, respectively.

## Results

We obtain *orders of magnitude lower error* when compared to classic unsupervised neural-network approaches that use traditional loss functions (L1, L2, and Huber).

![DEQGAN predictions against analytical solutions](/assets/img/deqgan-results.webp)
_Comparison of DEQGAN to traditional physics-informed NNs on various problems._

## Further Reading
- My master's thesis
    - [Manuscript](/assets/docs/harvard-thesis.pdf)
    - [Slides](/assets/docs/harvard-defense.pdf)
    - [Defense](https://www.youtube.com/watch?feature=player_embedded&v=bq2FurxD2Xo)
- [Preprint paper](/assets/docs/deqgan-arxiv.pdf)
- [ICML AI4Science paper](/assets/docs/deqgan-icml.pdf)
