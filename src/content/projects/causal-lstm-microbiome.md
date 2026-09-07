---
title: Causal LSTMs for Mouse Microbiome Modeling
description: We used sparse LSTM models and Granger-causal analysis to compare microbial interactions in healthy and IBD mice.
date: 2019-05-01T16:06:00-05:00
category: Projects
tags: [deep learning, time series, causality, computational biology, harvard]
image: /assets/images/microbiome-causal-lstm.webp
previewImages:
  - src: /assets/images/microbiome-causal-lstm-480w.webp
    width: 480
  - src: /assets/images/microbiome-causal-lstm-960w.webp
    width: 960
imageAlt: Estimated microbial interaction networks for healthy and IBD mice
---

Microbiome measurements form a collection of interacting time series: the abundance of one organism may help predict how another changes later. In this project, we studied those temporal relationships in longitudinal data from healthy mice and mice with inflammatory bowel disease (IBD).

We focused on the 20 most prevalent operational taxonomic units (OTUs), which covered roughly 85–90% of the observed reads. Exploratory analysis suggested differences in both microbial diversity and dynamics between the healthy and IBD groups.

## Modeling interactions

We used a component-wise LSTM model designed for neural Granger-causality analysis. Each microbial series has its own recurrent model, while sparsity penalties encourage the network to retain only useful connections from the other series. The magnitude of those input connections provides an interpretable estimate of which past series help predict each target series.

Because the model was sensitive to training and regularization choices, we used Bayesian optimization to search over hidden size, learning rate, sparsity and ridge penalties, and time-series window length. We then compared networks fitted to individual mice with models fitted to pooled healthy and pooled IBD trajectories.

## Takeaway

The learned interaction patterns were more similar within each health group than across groups. The healthy and IBD networks emphasized different OTUs and predictive relationships, while sparsity made those differences possible to inspect visually. These links should be read as **Granger-predictive relationships**, not proof of biological causation; they are hypotheses for further study rather than intervention-level conclusions.

This was a team project with Joe Davison, Robbert Struyven, and Simon Sebbagh.

> Explore the analysis notebooks and code in the [project repository](https://github.com/dylanrandle/microbiome).
