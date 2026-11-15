---
title: "UniWALM: Unified World Action Language Model for Embodied Robot Control"
description: We trained a robot to describe what it has seen and use that description to guide its next movement.
date: 2026-09-30T12:00:00-04:00
category: Research
image:
  src: /assets/images/uniwalm-overview.webp
  alt: UniWALM predicts video, robot actions, and text together across four tasks, including a two-arm robot locating a covered item.
tags: [robotics, multimodal learning, dexterous manipulation]
publications:
  - id: uniwalm-arxiv-2026
    authors:
      - name: Rahul Sajnani
        citation: R. Sajnani
      - name: Diego Romeres
        citation: D. Romeres
      - name: Mingyuan Zhang
        citation: M. Zhang
      - name: Kai Gao
        citation: K. Gao
      - name: Carl Qi
        citation: C. Qi
      - name: Baichuan Huang
        citation: B. Huang
      - name: Srinath Sridhar
        citation: S. Sridhar
      - name: Dylan Randle
        citation: D. Randle
      - name: Lillian J. Ratliff
        citation: L. J. Ratliff
      - name: Jose Barreiros
        citation: J. Barreiros
      - name: Manikantan Nambi
        citation: M. Nambi
      - name: Jeroen Vanbaar
        citation: J. Vanbaar
    kind: conference
    venue: CoRL
    resumeVenue: Preprint, 2026
    track: RoboMem and “Do Robots Need World Models?” workshops
    year: 2026
    status: CoRL 2026 workshop posters at RoboMem (in person) and “Do Robots Need World Models?” (top 30% of submissions). Under review at ICRA
links:
  - label: Paper on arXiv
    href: https://arxiv.org/abs/2610.28626
  - label: Project page and robot demonstrations
    href: https://rahulsajnani.github.io/projects/uniwalm/
  - label: Memory for Robot Foundation Models workshop
    href: https://corl2026-memory.github.io/
  - label: Do Robots Need World Models? workshop
    href: https://do-robots-need-world-models.github.io/
---

We built UniWALM to study whether learning to describe a task helps a robot carry it out. The model starts from a pretrained video backbone. During training, three transformer streams share information as they predict future frames, robot movements, and text. At each control step the robot can generate an action together with a short description of its progress, then read that description at the next step.

We also trained the action stream to correct errors by perturbing trajectories and teaching the model how to return to the intended path. The correction happens during training, so the deployed policy uses the same number of sampling steps.

On four simulated RMBench tasks that require remembering earlier observations, UniWALM completed 34.5% of trials. FastWAM, a video-and-action model built on the same backbone, completed 13.3%.

## Finding a hidden item

We placed a black box, a packet of Parmesan, and a tissue box side by side. The robot could see all three before it covered them with cardboard. To point to a particular item afterward, it had to remember where it had seen it.

In one trial, as the robot grasped the cardboard, UniWALM generated a note placing the black box on the left, the Parmesan in the middle, and the tissues on the right. We could read the note the model passed to its next control step and watch where its hand went once the items were out of sight. On the physical robot, UniWALM found the requested item in 61.1% of trials. FastWAM succeeded in 11.1%. Choosing among the three positions at random would succeed about a third of the time.
