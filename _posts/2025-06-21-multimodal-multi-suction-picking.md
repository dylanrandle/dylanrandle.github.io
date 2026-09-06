---
title: Multi-Modal Learning for Multi-Suction Picking at Scale
description: We learned to score multi-suction robot picks from real industrial data using visual pretraining and cross-modal attention.
date: 2025-06-21 16:00:00 -0500
categories: [Research]
tags: [robotics, computer vision, multimodal learning, warehouse automation, amazon]
image:
  path: /assets/img/multi-suction-pick-success.webp
  alt: A multimodal perception model scoring candidate multi-suction picks in an industrial workcell
---

Picking previously unseen items from an unstructured pile is one of the defining challenges of warehouse robotics. A high-throughput system must select a reliable grasp from clutter while handling variation in shape, packaging, material, and occlusion—all within tight latency constraints.

In this RSS 2025 paper, we studied how to improve **multi-suction picking** using data collected from a deployed industrial system. The core task is to estimate the probability that a candidate arrangement of suction cups will successfully lift an item.

## Learning from multimodal experience

The model combines candidate-pick features with a visual representation of the scene. Its inputs can include RGB images, depth, candidate pick locations, and semantic segmentation. A cross-attention mechanism weights the visual tokens using the proposed pick, then produces a pick-success score.

Real production data introduces an unusual constraint: the system normally attempts only one pick in each scene, so the labels are sparse. We addressed that limitation by first pretraining a multimodal visual encoder to reconstruct the available scene modalities, then fine-tuning it on examples of successful and failed picks.

## Evaluation and takeaway

We evaluated the approach on three complementary datasets: a large item-picking dataset, a dataset focused on partial occlusions, and a package-picking dataset containing boxes and envelopes. The experiments compared scene encoders, input combinations, local crops, pretraining strategies, and fine-tuning choices.

The ablations showed that in-domain multimodal pretraining was important even when not every modality was available during deployment. By learning the relationships among RGB, depth, and semantic signals during pretraining, the encoder could retain useful structure while using a smaller set of inputs at inference time. This makes multimodal learning more practical for industrial systems, where additional sensors or intermediate perception outputs may carry runtime costs.

This work was led by Che Wang with Jeroen van Baar, Chaitanya Mitash, Shuai Li, Dylan Randle, Weiyao Wang, Sumedh Sontakke, Kostas E. Bekris, and Kapil Katyal.

> Read the [RSS proceedings entry](https://www.roboticsproceedings.org/rss21/p107.html), the [Amazon Science publication page](https://www.amazon.science/publications/demonstrating-multi-suction-item-picking-at-scale-via-multi-modal-learning-of-pick-success), or the [paper on arXiv](https://arxiv.org/abs/2506.10359).
{: .prompt-info }
