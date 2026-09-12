---
title: Avoiding Object Damage in Robotic Manipulation
description: We built and deployed a damage-risk classifier that reduced robot-induced object damage in a warehouse manipulation system.
date: 2024-10-14T16:00:00-05:00
category: Research
tags: [robotics, machine learning, multimodal learning, warehouse automation, amazon]
image:
  src: /assets/images/robotic-object-damage.webp
  alt: An Amazon Robotics workcell, an object flagged as high risk, and an example of package damage
publications:
  - id: object-damage-iros-2024
    authors:
      - name: Erica Aduh
        citation: E. Aduh
        role: lead
      - name: Fan Wang
        citation: F. Wang
        role: lead
      - name: Dylan Randle
        citation: D. Randle
      - name: Kaiwen Wang
        citation: K. Wang
      - name: Priyesh Shah
        citation: P. Shah
      - name: Chaitanya Mitash
        citation: C. Mitash
      - name: Manikantan Nambi
        citation: M. Nambi
    kind: conference
    venue: IROS
    year: 2024
links:
  - label: Amazon Science publication page
    href: https://www.amazon.science/publications/avoiding-object-damage-in-robotic-manipulation
  - label: Full paper
    href: https://cdn.amazon.science/c3/22/865c882d484492a4ba9df499f945/avoiding-object-damage-in-robotic-manipulation.pdf
---

Reliable warehouse robots need to do more than complete picks: they must also avoid damaging the enormous variety of objects they encounter. Damage is rare relative to the number of successful manipulations, but each event can destroy inventory, interrupt a workcell, or harm sensitive equipment.

In this IROS 2024 paper, we introduced a system that predicts the risk of object damage before a robot attempts a pick. The prediction combines information from warehouse catalog systems with attributes observed at the workcell and outcomes from earlier manipulations.

## Modeling damage risk

We first developed a taxonomy for damage caused by robotic handling, including crushing, tearing, opening, and objects separating into multiple parts. We then compared several ways to predict those outcomes:

- Classical models including logistic regression, random forests, XGBoost, and CatBoost
- A BERT classifier that can use unstructured product descriptions
- A multimodal ViT-BERT model that combines text and images of the picking scene

The multimodal model performed best in the offline study, showing that product descriptions and visual context contain complementary information. For deployment, we used the BERT model because it offered a strong balance between predictive performance and integration complexity.

## Deployment result

We evaluated the system over **50,687 real pick-and-place operations** using control and treatment groups. When damage avoidance was enabled, the robot skipped picks predicted to be unsafe. This reduced the object-damage rate by **64%**, with a **9% reduction in picking volume**.

That tradeoff is central to deploying safety models: a system needs to prevent costly failures without rejecting so many actions that throughput collapses. The study demonstrates how operational data and multimodal learning can turn an infrequent failure mode into a prediction problem that can be managed before a robot acts.
