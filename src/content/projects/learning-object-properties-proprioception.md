---
title: Learning Object Properties Through Robot Proprioception
description: We used differentiable robot-object simulations to estimate mass and softness from joint encoders alone.
date: 2025-05-19T16:05:00-05:00
category: Research
tags: [robotics, differentiable simulation, system identification, proprioception, amazon]
image: /assets/images/differentiable-robot-object-interaction.webp
imageAlt: Differentiable-physics calibration of object mass and material properties using robot joint positions
---

People can estimate whether an object is heavy or soft by lifting or squeezing it, even without watching it move. This paper asks whether a robot can learn object properties in the same way: from its own internal sense of motion.

Presented at ICRA 2025, our method identifies properties such as mass and elastic modulus using only readings from the robot's joint encoders. It does not require an external camera to track the object, a force sensor, or specialized material-testing equipment.

## Differentiating through interaction

We model the robot and object together in a differentiable physics simulator. The simulator predicts how the robot's joints should move during an interaction, and an optimizer adjusts the unknown object parameters until the simulated joint trajectory matches the measurements from the real robot.

We evaluated three types of interaction:

- A rigid object held by the robot
- An object moving and colliding inside a closed container
- A deformable object compressed by the gripper

The same principle applies in each case: the object's physical properties change how the robot reacts, and those changes are visible in the robot's proprioceptive signals.

## Results

From a single 0.6-second interaction, the system estimated the masses of four test objects with errors between **0.002 and 0.006 kg**. Each calibration took roughly **2.5–2.7 seconds on a laptop**. The method also recovered the mass of an object hidden inside a container and estimated the elastic parameters of materials with different stiffnesses.

The experiments showed performance comparable to a method that explicitly tracked the object's motion, while using only signals already available from the robot. One remaining limitation is that the simulator needs an estimate of the object's initial configuration; future work could make that setup more robust through uncertainty modeling or domain randomization.

This work was led by Peter Yichen Chen, Chao Liu, and Pingchuan Ma, with John Eastman, Daniela Rus, Dylan Randle, Yuri Ivanov, and Wojciech Matusik.

> Visit the [project page](https://warpdiffrobot.github.io/), explore the [source code](https://github.com/MediosZ/WarpDiffRobot), or read the [MIT News overview](https://news.mit.edu/2025/system-lets-robots-identify-objects-properties-through-handling-0508).
