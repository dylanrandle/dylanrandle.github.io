---
title: "MuST: A Multi-Head Skill Transformer for Long-Horizon Manipulation"
description: We developed a transformer policy that learns reusable manipulation skills and chains them using estimates of skill progress.
date: 2025-05-19T16:00:00-05:00
category: Research
tags: [robotics, imitation learning, transformers, dexterous manipulation, amazon]
image: /assets/images/must-skill-transformer.webp
imageAlt: MuST chaining flipping, picking, packing, and pushing skills using progress-guided selection
---

Long-horizon manipulation tasks are difficult because a robot must do more than predict the next motion. It must determine which skill is appropriate, recognize when that skill is complete, and recover when the environment changes unexpectedly.

In this ICRA 2025 paper, we introduced the **Multi-Head Skill Transformer (MuST)**. The model decomposes a task into reusable skills—in our experiments, flipping, picking, packing, and pushing—and learns how to execute and sequence them from human demonstrations.

## Skill heads and progress

MuST extends an Octo transformer backbone with one action head for each skill and an additional head that estimates every skill's progress. Its progress-guided selector, **ProGSS**, uses those estimates to choose which skill to execute next.

This structure has several practical advantages:

- Individual skills can be trained, fine-tuned, or added without retraining every action head.
- Goal images or language instructions can specify the desired packing location.
- The policy can skip a skill that is already complete or return to an earlier skill after a disturbance.
- Multiple valid skill orderings can be represented instead of forcing every task through one sequence.

## Results

On a simulated pick-and-pack task, the single-head Octo baseline completed 32.5% of the full tasks, while MuST achieved **80–90% success** and completed successful trials **23.7–38.4% faster**. Tests with new object shapes exposed the remaining challenge: early pick-and-place skills generalized well, while precise pushing was more sensitive to unfamiliar geometry.

The physical-robot experiments showed the value of the decomposition more directly. MuST completed 88% of trials across a diverse object set and could handle both small and previously unseen objects that the single-head baseline failed to complete.

This work was led by Kai Gao with Fan Wang, Erica Aduh, Dylan Randle, and Jane Shi.

> Read the [Amazon Science publication page](https://www.amazon.science/publications/must-multi-head-skill-transformer-for-long-horizon-dexterous-manipulation-with-skill-progress) or the [paper on arXiv](https://arxiv.org/abs/2502.02753).
