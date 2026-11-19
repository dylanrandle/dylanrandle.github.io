---
title: Building Triskel, a mobile manipulator
description: I built Triskel to pick up toys at home. It has a seven-joint arm, a gripper with flexible fingers, and a three-wheel base I can drive with a VR controller.
date: 2026-11-18T12:00:00-05:00
draft: true
image:
  src: /assets/images/triskel-model.webp
  alt: Triskel’s URDF model with a seven-joint arm reaching over its three-wheel base and the RealSense camera mounted between the base plates
category: Projects
tags: [robotics, manipulation, computer vision]
links:
  - label: Triskel source code
    href: https://github.com/dylanrandle/humanoid
  - label: LeKiwi base design
    href: https://github.com/SIGRobotics-UIUC/LeKiwi
  - label: GraspGenX
    href: https://github.com/NVlabs/GraspGenX
---

I'd like to be able to point out one of my son's toys and have a robot pick it up and put it back in the bin. I built Triskel to work on that problem at home. Picking up a single toy from a stationary base gives me a first test I can run both by hand and under software control.

## Building the robot

I started with two open-source designs, the elrobot arm and the LeKiwi mobile base. The base has three omniwheels, so I can drive sideways to line up a grasp while keeping the arm facing the toy. Seven Feetech servos move the arm, and a separate servo opens and closes the gripper.

The gripper is my own Fin Ray design. Its ribbed fingers flex around an object as the jaws close. I wanted the same fingers to get purchase on a flat-sided block and a toy with a curved body. I added an NVIDIA Jetson Orin Nano Super for onboard compute and an Intel RealSense D435 to see the workspace. The color image lets me specify which toy I want, and the depth image gives me a way to locate it relative to the gripper.

![Close-up of the gripper model showing the drive gear, sliding jaws, and blue ribbed fingers.](/assets/images/triskel-fin-ray.webp)

_The Fin Ray gripper as modeled in the URDF. The gear couples the two jaws, and the ribs give each fingertip room to bend on contact._

## Driving Triskel by hand

With a Quest controller in my right hand, I can reach toward a toy and rotate my wrist to set the gripper orientation. The thumbsticks translate and turn the base, and two buttons open and close the fingers. Releasing both grip triggers lets me reposition my hands. When I squeeze again, the reference starts from the robot's current pose.

I wrote a 30 Hz operational-space controller that takes a desired tool pose and solves for arm joint commands. Teleoperation, the controller, and the hardware driver communicate over LCM. A MuJoCo simulation exposes the same command and feedback messages as the physical robot. That lets me use the same hand controls in simulation, or replace my hand with a repeatable trajectory and see how accurately the gripper follows it.

## Tuning with figure eights

A figure eight makes a useful tuning target because the gripper has to round each lobe and pass through the same point in two directions. I ran the pattern in the XY, XZ, and YZ planes at several settings. For each pass I compared three paths: the requested tool position, the position predicted from the commanded joint angles, and the position reconstructed from joint feedback.

![XY figure-eight paths and 3D position error over time. The commanded path closely follows the target, while the path reconstructed from joint feedback cuts inside both lobes.](/assets/images/triskel-figure-eight.webp)

_September 14, nominal XY figure eight. The upper plot shows displacement from the starting target with equal scales on both axes. The lower plot includes error along Z as well._

In this run, the nominal XY figure eight had **0.42 mm RMS position error** between the requested path and the path predicted from the joint commands. Using the measured joint angles, the error grew to **3.63 mm RMS**. For that pass, the inverse kinematics could describe the curve much more accurately than the joints followed it. That gave me a reason to inspect individual servo traces before adjusting the Cartesian controller. Both figures use the robot's kinematic model, so flex in the fingers or arm would require a separate measurement.

## From an object name to a grasp

For autonomous pickup, the input is a phrase such as “red toy car.” YOLOE-26S segments the car in the color image. I register the depth samples to that image and use the mask to extract a target point cloud. I keep the surrounding depth points too. A neighboring toy may be irrelevant to identifying the car and still be directly in the path of an approaching finger.

GraspGenX proposes gripper poses using the target points and the shape of my Fin Ray fingers. For each pose, I project the visible object points onto the axis along which the fingers close to estimate the jaw opening. The planner checks whether the open fingers have room to approach, then checks reachability and arm self-collision before sending the approach, closure, and lift to the same controller I use for teleoperation.

The next experiment is a physical pickup with this pipeline. The width estimate comes from the visible surfaces, and the grasp model represents the fingers as rigid. I want to see where the flexible fingers actually make contact and whether the toy stays between them through the commanded 80 mm lift.
