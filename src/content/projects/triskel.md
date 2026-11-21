---
title: Giving an agent control of Triskel
description: I built a mobile manipulator to pick up toys at home. I’m writing the agent harness that lets a model see through its camera, move its arm and base, and check what happened.
date: 2026-11-18T12:00:00-05:00
draft: true
image:
  src: /assets/images/triskel-hardware.webp
  alt: Triskel on the floor with its seven-joint arm extended, blue gripper fingers open, and three omniwheels beneath the deck
category: Projects
tags: [robotics, manipulation, computer vision]
links:
  - label: Triskel source code
    href: https://github.com/dylanrandle/humanoid
  - label: Agent harness and control API
    href: https://github.com/dylanrandle/humanoid/blob/130479827300072bb4efb20cd778ed24db5029c9/src/humanoid/agent/README.md
  - label: LeKiwi base design
    href: https://github.com/SIGRobotics-UIUC/LeKiwi
  - label: GraspGenX
    href: https://github.com/NVlabs/GraspGenX
  - label: CDM-D405 depth model
    href: https://huggingface.co/depth-anything/camera-depth-model-d405
---

I want to be able to say “put the toy car back in the bin” and have Triskel do it. In an early test with the physical robot parked, I asked a vision model where the gripper could take hold of the car. It marked the nose and the raised rear end in the camera image. When I tried to turn those two pixels into positions the arm could reach, both came back empty. The depth camera had missed the very spots the model wanted to touch.

## How the agent controls Triskel

I’m building a custom agent harness around Triskel’s controller. I enter a task in the operator console. The harness gives the model a fresh color image, the measured poses of the base and tool, and the gripper opening. In Idle, I can ask about the scene with the robot parked. When I select Autonomy, the model can move the base, move the tool, set the gripper opening, or hold position.

The model chooses one action at a time. The controller checks the requested motion against workspace and joint limits, executes it, and reports how close the robot got. The harness sends that result and a new observation back to the model so it can decide what to do next. In a MuJoCo test through the console, I asked for 20 mm of base travel and got 20.25 mm of measured motion. For a pickup, the harder check will come after the lift, when the agent has to look again and decide whether the car came with it.

## The hardware behind a motion command

I started with two open-source designs, the elrobot arm and the LeKiwi mobile base. The base has three omniwheels, so I can drive sideways to line up a grasp while keeping the arm facing the toy. Seven Feetech servos move the arm, and a separate servo opens and closes the gripper.

![Overhead workbench photo of Triskel’s open base, with the battery, wiring, and power display between its three omniwheels.](/assets/images/triskel-base.webp)

_With the top deck off, you can see how the battery and power electronics fit between the wheel motors._

The gripper is my own Fin Ray design. Its ribbed fingers flex around an object as the jaws close. I wanted the same fingers to get purchase on a flat-sided block and a toy with a curved body. I added an NVIDIA Jetson Orin Nano Super for onboard compute and an Intel RealSense D435 to see the workspace. The color image lets me specify which toy I want, and the depth image gives me a way to locate it relative to the gripper.

![Close-up of the gripper model showing the drive gear, sliding jaws, and blue ribbed fingers.](/assets/images/triskel-fin-ray.webp)

_The Fin Ray gripper as modeled in the URDF. The gear couples the two jaws, and the ribs give each fingertip room to bend on contact._

### Driving Triskel by hand

With a Quest controller in my right hand, I can reach toward a toy and rotate my wrist to set the gripper orientation. The thumbsticks translate and turn the base, and two buttons open and close the fingers. Releasing both grip triggers lets me reposition my hands. When I squeeze again, the reference starts from the robot's current pose.

I wrote a 30 Hz operational-space controller that takes a desired tool pose and solves for arm joint commands. Teleoperation, the controller, and the hardware driver communicate over LCM. A MuJoCo simulation exposes the same command and feedback messages as the physical robot. That lets me use the same hand controls in simulation, or replace my hand with a repeatable trajectory and see how accurately the gripper follows it.

![Triskel’s URDF model with its arm extended above the base and the camera between the two decks.](/assets/images/triskel-model.webp)

### Checking what the arm actually reached

When the agent requests a tool pose, the feedback it receives comes from the arm’s joint sensors. I tested that feedback with a figure eight because the gripper has to round each lobe and pass through the same point in two directions. I ran the pattern in the XY, XZ, and YZ planes at several settings. For each pass I compared three paths: the requested tool position, the position predicted from the commanded joint angles, and the position reconstructed from joint feedback.

![XY figure-eight paths and 3D position error over time. The commanded path closely follows the target, while the path reconstructed from joint feedback cuts inside both lobes.](/assets/images/triskel-figure-eight.webp)

_September 14, nominal XY figure eight. The upper plot shows displacement from the starting target with equal scales on both axes. The lower plot includes error along Z as well._

In this run, the nominal XY figure eight had **0.42 mm RMS position error** between the requested path and the path predicted from the joint commands. Using the measured joint angles, the error grew to **3.63 mm RMS**. For that pass, the inverse kinematics could describe the curve much more accurately than the joints followed it. That gave me a reason to inspect individual servo traces before adjusting the Cartesian controller. Both figures use the robot's kinematic model, so flex in the fingers or arm would require a separate measurement.

## Measuring depth where the fingers land

To investigate the missing contact points, I captured a shiny toy car and a wooden cube at several distances, five views with the RealSense D435 and six with a D405. I counted valid depth readings in the five-pixel band just inside the car’s outline. In two side-on views at similar distances, the D435 measured **22% of that band at 6.75 inches**, and the D405 measured **95% at 6 inches**. The lighting and framing differed between captures. All three D405 car views were side-on.

I first tried estimating depth from color alone. Depth Anything V2 put the near cube’s front face at 536 mm, where the D435 measured 188 mm. Scaling the model’s prediction using sensor readings from the same object improved agreement across its interior. I also tried using LiteAnyStereo on the D435’s infrared pair to supply scale. That sharpened the near car’s side-on outline, but in the end-on view some edge predictions landed about a meter behind the measured surface.

![Three views of the same side-on toy car, showing its color image, black gaps in raw D405 depth, and the continuous surface predicted by CDM-D405.](/assets/images/triskel-d405-car-depth.webp)

_From left to right, the panels show the car at 4.5 inches in color, the raw D405 depth, and the CDM-D405 estimate using both inputs. Yellow is closer, purple is farther, and black marks missing depth. Both depth panels use the same 80–240 mm scale._

To test how well a model could fill a gap, I hid 16 × 16 patches of valid D405 depth and compared predictions near the car’s outline with the readings I had removed. At 4.5 inches, the median absolute difference was **1.6 mm for CDM-D405**, 2.4 mm for a simple fill from nearby measurements, and 5.1 mm for Prompt Depth Anything given prefilled depth. CDM-D405 also had the lowest median at 6 and 10 inches. At 10 inches its 90th-percentile difference reached 35 mm. Those withheld readings give me a way to test a prediction where I have a reference. At a naturally missing contact point, the true distance is still unknown.

The camera-specific model for the D435 showed why that matters. On the far side-on car, its depth edge landed within three pixels of the traced outline on every sampled profile. When I hid the whole rim, its median depth difference there was 32 mm. For a first grasp, I’d keep valid sensor readings and use completion to propose contacts I can check against nearby measurements. CDM-D405 took about 1.1 seconds per 640 × 480 frame after warm-up on Triskel’s Jetson with PyTorch FP16, a cost I can pay while the robot pauses to choose a grasp.

## A grasp for the agent to try

For autonomous pickup, the input is a phrase such as “red toy car.” YOLOE-26S segments the car in the color image. I register the depth samples to that image and use the mask to extract a target point cloud. I keep the surrounding depth points too. A neighboring toy may be irrelevant to identifying the car and still be directly in the path of an approaching finger.

GraspGenX proposes gripper poses using the target points and the shape of my Fin Ray fingers. For each pose, I project the visible object points onto the axis along which the fingers close to estimate the jaw opening. The planner checks whether the open fingers have room to approach, then checks reachability and arm self-collision before sending the approach, closure, and lift to the same controller I use for teleoperation.

I’m working toward giving the agent this grasp planner as a tool. My next physical test is a single pickup from a stationary base. The planner models the fingers as rigid, so I want to see where the flexible tips actually make contact. After the commanded 80 mm lift, I want the agent to check a fresh camera image for the car between the fingers before it starts toward the bin.
