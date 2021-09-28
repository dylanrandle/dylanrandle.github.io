---
title: Master's Thesis
mathjax: true
---

{% include mathjax.html %}

# Unsupervised Neural Network Methods for Solving Differential Equations

- Code available on [GitHub](https://github.com/dylanrandle/denn/tree/master/denn).
- You can watch a recorded video of my defense [here](https://www.youtube.com/watch?feature=player_embedded&v=bq2FurxD2Xo).
- Some of this work overlaps with [DEQGAN](deqgan.html).

Consider differential equations of the form

$$F\left(t, \hat{\Psi}(t), \Delta \hat{\Psi}(t), \Delta^2 \hat{\Psi}(t), ...\right) = 0.$$

To approximately solve the equation, we optimize

$$\min_{\theta}{\sum_{t \in \mathcal{D}}{F(t, \Psi_{\theta}(t), \Delta \Psi_{\theta}(t), \Delta^2 \Psi_{\theta}(t), \ldots)^2}}$$

where $\Psi_{\theta}$ is a neural network parameterized by $\theta$, $\mathcal{D}$ is the domain of the problem, and we compute derivatives with automatic differentiation.

# Paper
<object data="Harvard_Masters_Thesis_Submit.pdf" type="application/pdf" width="700px" height="500px">
    <embed src="Harvard_Masters_Thesis_Submit.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="Harvard_Masters_Thesis_Submit.pdf">Download PDF</a>.</p>
    </embed>
</object>

<br />

# Slides
<object data="Thesis_Defense_Presentation_Final.pdf" type="application/pdf" width="700px" height="500px">
    <embed src="Thesis_Defense_Presentation_Final.pdf">
        <p>This browser does not support PDFs. Please download the PDF to view it: <a href="Thesis_Defense_Presentation_Final.pdf">Download PDF</a>.</p>
    </embed>
</object>

<br />
