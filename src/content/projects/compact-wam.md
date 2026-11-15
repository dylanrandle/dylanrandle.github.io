---
title: "Predicting What Matters: Interaction-Centric 4D World-Action Models"
description: We trained a robot to predict how its hand, a tool, and the object it acts on will move together.
date: 2026-10-07T12:00:00-04:00
category: Research
image:
  src: /assets/images/compact-wam-overview.webp
  alt: Compact-WAM tracks the robot hand and drill in 3D over time and predicts the next movements using a mask of the subtask goal.
tags: [robotics, computer vision, dexterous manipulation]
publications:
  - id: compact-wam-corl-2026
    authors:
      - name: Luoxin Ye
        citation: L. Ye
      - name: Baichuan Huang
        citation: B. Huang
      - name: Kai Gao
        citation: K. Gao
      - name: Ruolin Ye
        citation: R. Ye
      - name: Dylan Randle
        citation: D. Randle
      - name: Jeroen Vanbaar
        citation: J. Vanbaar
      - name: Alan Yuille
        citation: A. Yuille
      - name: Manikantan Nambi
        citation: M. Nambi
      - name: Jose Barreiros
        citation: J. Barreiros
    kind: conference
    venue: CoRL
    resumeVenue: Preprint, 2026
    track: BiDexTool and “Do Robots Need World Models?” workshops
    year: 2026
    status: Selected for posters at “Do Robots Need World Models?” (top 30% of submissions) and BiDexTool
links:
  - label: Paper on OpenReview
    href: https://openreview.net/forum?id=MwnWdUaeBJ
  - label: Do Robots Need World Models? workshop
    href: https://do-robots-need-world-models.github.io/
  - label: BiDexTool workshop program
    href: https://bimanual-tool.github.io/
---

When a robot uses a drill, the motion of the drill head relative to the target matters more for control than the color of the work surface. In **Compact-WAM**, we use demonstrations to teach a policy which parts of the scene matter for the task and how those parts move in three dimensions over time.

## From a demonstration to a training target

A reasoning model identifies the objects involved and breaks the demonstration into subtasks. Vision models then mark the relevant parts of each frame and track points on them in 3D. These annotations let us train a smaller model to predict where the hand and objects should end up after the next subtask. That predicted arrangement helps it choose the next movement.

## Testing on a physical robot

Compact-WAM succeeded in 90% of drill trials and 85% of trials that required removing objects from a container in sequence. Across the two tasks, its average success rate was 87.5%, compared with 60% for the strongest baseline. In simulation, it reached 98.6% on LIBERO and averaged 86.0% across seven categories of perturbations in LIBERO-Plus.
