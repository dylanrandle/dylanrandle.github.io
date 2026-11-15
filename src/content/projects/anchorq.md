---
title: Sample-Efficient Reinforcement Learning for Policy Improvement via Flow-Reversed Action Anchors
description: We developed AnchorQ to steer a pretrained robot policy by learning which variations on a familiar motion work best.
date: 2026-09-16T12:00:00-04:00
category: Research
image:
  src: /assets/images/anchorq-overview.webp
  alt: AnchorQ maps movement directions to noise samples, refines them with critic scores, and decodes a movement to place bread on a plate.
tags: [robotics, reinforcement learning, dexterous manipulation]
publications:
  - id: anchorq-arxiv-2026
    authors:
      - name: Carl Qi
        citation: C. Qi
        role: lead
      - name: Weijun Dong
        citation: W. Dong
      - name: Xiaojie Wang
        citation: X. Wang
      - name: Peiyi Chen
        citation: P. Chen
      - name: Rahul Sajnani
        citation: R. Sajnani
      - name: Mingyuan Zhang
        citation: M. Zhang
      - name: Amy Zhang
        citation: A. Zhang
      - name: Jose Barreiros
        citation: J. Barreiros
      - name: Manikatan Nambi
        citation: M. Nambi
      - name: Lillian J. Ratliff
        citation: L. J. Ratliff
        role: advisor
      - name: Dylan Randle
        citation: D. Randle
        role: advisor
    kind: conference
    venue: CoRL
    resumeVenue: Preprint, 2026
    track: R2RL Workshop
    year: 2026
    status: Accepted for an in-person poster at the CoRL 2026 R2RL workshop. Under review at ICLR
links:
  - label: Paper on arXiv
    href: https://arxiv.org/abs/2610.22852
  - label: Project page and robot demonstrations
    href: https://anchorq-rl.com/
  - label: R2RL workshop poster program
    href: https://r2rl-workshop.github.io/
---

A flow-matching policy turns a noise sample into a sequence of robot movements. AnchorQ runs that mapping in reverse to find inputs that correspond to a small set of reference movements in the current scene. A learned value function scores variations around each of those inputs and guides the choice of action. The pretrained policy stays frozen throughout training.

We measured both how often a policy finished a task and how much work it could do in an hour. Across the simulation tasks, AnchorQ averaged 294 completions per hour, compared with 149 for DSRL, a method that learns to steer the same policy directly in noise space.

## Learning from 100 robot trials

Every time our Franka arm tried to hang a towel, someone had to score the attempt and reset the scene. We gave each reinforcement learning method 100 training attempts per task. AnchorQ could use those attempts to explore variations on movements such as shifting the gripper up or to the left.

We evaluated the trained policies on 20 held-out configurations each for stacking cups, toasting bread, and hanging a towel. AnchorQ outperformed both the original policy and DSRL on all three tasks. On towel hanging, AnchorQ was the only steering method that improved on the original policy.
