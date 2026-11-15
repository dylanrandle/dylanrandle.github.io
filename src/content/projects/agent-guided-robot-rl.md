---
title: Agent-Guided Reinforcement Learning for Robot Policy Improvement
description: We used a reasoning agent to review failed robot trials and suggest specific movements for the policy to try during training.
date: 2026-09-28T12:00:00-04:00
category: Research
image:
  src: /assets/images/agent-guided-robot-rl-overview.webp
  alt: A reasoning agent proposes corrections from failed robot trials. A bar chart compares success rate and throughput across three training methods.
tags: [robotics, reinforcement learning, dexterous manipulation]
publications:
  - id: agent-guided-rl-corl-2026
    authors:
      - name: Weijun Dong
        citation: W. Dong
      - name: Carl Qi
        citation: C. Qi
      - name: Mingyuan Zhang
        citation: M. Zhang
      - name: Manikantan Nambi
        citation: M. Nambi
      - name: Lillian J. Ratliff
        citation: L. J. Ratliff
      - name: Jeroen Vanbaar
        citation: J. Vanbaar
        role: advisor
      - name: Dylan Randle
        citation: D. Randle
        role: advisor
      - name: Jose Barreiros
        citation: J. Barreiros
        role: advisor
    kind: conference
    venue: CoRL
    track: R2RL Workshop
    year: 2026
    status: Selected for the R2RL in-person poster session
links:
  - label: Paper on OpenReview
    href: https://openreview.net/forum?id=eaGcY3DlZa
  - label: R2RL workshop poster program
    href: https://r2rl-workshop.github.io/
---

A failed trial tells a robot that its policy needs work. The reward alone says little about which movement to change. We gave a reasoning agent the recorded trajectory and asked it to find a moment when a different action could have helped.

## Using a correction during training

While the robot policy collects more experience, the agent inspects earlier failures and proposes replacement actions for particular states. We train the policy to imitate those suggestions alongside its usual reinforcement learning objective. The suggestions guide exploration, and the rewards from subsequent trials let the policy improve on an imperfect correction.

We tested the method on ten simulated LIBERO manipulation tasks with a budget of 400 episodes per task. The agent-guided policy achieved 6.9 times the normalized success throughput of the strongest baseline trained with reinforcement learning alone. The difference between advice and direct imitation was clearest with a weaker agent. Learning from both rewards and that agent’s proposals yielded a 58% average success rate, compared with 26% from imitating the same proposals alone.
