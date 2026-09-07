---
title: Differentiable Neural Architecture Search for Scientific Datasets
description: We evaluated DARTS as an efficient way to discover neural architectures for materials science, astronomy, and medical imaging.
date: 2019-12-15T16:02:00-05:00
category: Projects
tags: [deep learning, neural architecture search, automl, scientific machine learning, harvard]
image: /assets/img/darts-scientific-datasets.webp
imageAlt: Training, validation, and test learning curves for a DARTS model on graphene kirigami data
---

Designing a neural network usually requires substantial manual experimentation. Neural Architecture Search (NAS) tries to automate that process, but many search strategies are computationally expensive enough to be impractical for ordinary research teams.

In this Harvard Data Science capstone project, completed in partnership with Google AI, we investigated **DARTS** (Differentiable Architecture Search). DARTS makes architecture choices differentiable: instead of selecting one discrete operation at a time, it learns continuous weights over candidate operations and optimizes those architecture weights with gradient descent.

## Experiments

We compared continuous and discretized DARTS models with random search and hand-designed ResNet baselines. Beyond an MNIST baseline, we focused on three scientific domains:

- **Graphene kirigami:** predicting material behavior for cut graphene sheets.
- **Galaxy Zoo:** predicting galaxy morphology from telescope imagery.
- **Chest X-rays:** predicting findings from medical images.

The work required adapting the original DARTS implementation to new input shapes, regression objectives, multi-label classification, and scientific data formats. Architecture searches were GPU-intensive and highly sensitive to optimization hyperparameters.

## Takeaway

DARTS was capable of modest improvements, but it was often unnecessary for simpler tasks where random search or a well-designed baseline already performed well. More importantly, the final discretization step could degrade a strong continuous model. The project highlighted that an efficient search algorithm still needs careful tuning and a robust way to convert its soft architecture weights into a deployable network.

This was a team project with Julien Laasri, Michael Emanuel, and Jiawei Zhuang.

> Read the [full project article](https://medium.com/data-science/investigating-differentiable-neural-architecture-search-for-scientific-datasets-62899be8714e) or explore the [project code](https://github.com/capstone2019-neuralsearch/AC297r_2019_NAS).
