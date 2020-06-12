---
title: DEQGAN
mathjax: true
---

{% include mathjax.html %}

# Unsupervised Learning of Solutions to Differential Equations with Generative Adversarial Networks

Consider differential equations of the form

$$F\left(t, \hat{\Psi}(t), \Delta \hat{\Psi}(t), \Delta^2 \hat{\Psi}(t), ...\right) = 0.$$

To set up the problem for Differential Equation GAN (DEQGAN), we let

$$ LHS = F\left(t, \hat{\Psi}(t), \Delta \hat{\Psi}(t), \Delta^2 \hat{\Psi}(t), ...\right), $$

and $$ RHS = 0. $$

Then we optimize the discriminator ($D$) and generator ($G$) with the gradients:

$$ \eta_G = \nabla_{\theta_{g}} \frac{1}{m} \sum_{i=1}^{m} \log{ \left(1 - D \left( LHS^{(i)} \right) \right)}, $$

$$ \eta_{D} = \nabla_{\theta_{d}} \frac{1}{m} \sum_{i=1}^{m} \left[ \log D \left( RHS^{(i)} \right) + \log \left( 1 - D \left( LHS^{(i)} \right) \right) \right], $$

alternating between gradient ascent and descent steps for $D$ and $G$, respectively.

# Experiment Visualizations

![deqgan_gif](deqgan.gif)

# Paper

<object data="GAN_Paper__NeurIPS_Preprint.pdf" type="application/pdf" width="700px" height="500px">
    <embed src="GAN_Paper__NeurIPS_Preprint.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="GAN_Paper__NeurIPS_Preprint.pdf">Download PDF</a>.</p>
    </embed>
</object>

<br />
