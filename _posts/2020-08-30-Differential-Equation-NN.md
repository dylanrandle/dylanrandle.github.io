---
title: Physics-Informed Generative Adversarial Networks for Differential Equations
description: We developed a novel GAN formulation for solving differential equations with physics-informed neural networks.
date: 2020-08-30 16:00:00 -0500
categories: [Research]
tags: [artificial intelligence, machine learning, differential equations, masters]
math: true
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

![deqgan](/assets/img/deqgan.png)
_Visual representation of DEQGAN formulation._

## Results

We obtain *orders of magnitude lower error* when compared to classic unsupervised neural-network approaches that use traditional loss functions (L1, L2, and Huber).

![deqgan_result](/assets/img/deqgan-results.png)
_Comparison of DEQGAN to traditional physics-informed NNs on various problems._

## Further Reading
- My master's thesis
    - [Manuscript](/assets/docs/Harvard_Masters_Thesis_Submit.pdf)
    - [Slides](/assets/docs/Thesis_Defense_Presentation_Final.pdf)
    - [Defense](https://www.youtube.com/watch?feature=player_embedded&v=bq2FurxD2Xo)
- [Preprint paper](/assets/docs/GAN_Paper_Preprint.pdf)
- [ICML AI4Science paper](/assets/docs/GAN_Paper_AI4Science.pdf)