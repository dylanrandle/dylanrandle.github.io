---
title: Differential Equation GAN (DEQGAN)
mathjax: true
---

{% include mathjax.html %}

Consider differential equations of the form

$$F\left(t, \hat{\Psi}(t), \Delta \hat{\Psi}(t), \Delta^2 \hat{\Psi}(t), ...\right) = 0.$$

To set up the problem for DEQGAN, we let

$$ LHS = F\left(t, \hat{\Psi}(t), \Delta \hat{\Psi}(t), \Delta^2 \hat{\Psi}(t), ...\right), $$

and $$ RHS = 0. $$

Then we optimize the discriminator ($D$) and generator ($G$) with the gradients:

$$ \eta_G = \nabla_{\theta_{g}} \frac{1}{m} \sum_{i=1}^{m} \log{ \left(1 - D \left( LHS^{(i)} \right) \right)}, $$

$$ \eta_{D} = \nabla_{\theta_{d}} \frac{1}{m} \sum_{i=1}^{m} \left[ \log D \left( RHS^{(i)} \right) + \log \left( 1 - D \left( LHS^{(i)} \right) \right) \right], $$

alternating between gradient ascent and descent steps for $D$ and $G$, respectively.

# Paper

<object data="GAN_Paper__NeurIPS_Preprint.pdf" type="application/pdf" width="700px" height="500px">
    <embed src="GAN_Paper__NeurIPS_Preprint.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="GAN_Paper__NeurIPS_Preprint.pdf">Download PDF</a>.</p>
    </embed>
</object>

<br />

# Experiment GIFs
![exp_gif](exp_2x.gif)
![sho_gif](sho_2x.gif)
![nlo_gif](nlo_2x.gif)
![sir_gif](sir_2x.gif)
![coo_gif](coo_2x.gif)
