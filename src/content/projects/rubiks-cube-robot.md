---
title: Rubik's Cube Solving Robot
description: A robot that autonomously solves a Rubik's cube.
date: 2024-11-03T23:51:00-05:00
category: Projects
tags: [robotics, computer vision, hardware]
image: /assets/images/rubiks-cube-robot.webp
imageAlt: A custom six-motor robot holding a Rubik's Cube
imageFit: cover
video: /assets/videos/rubiks-cube-robot-solve.mp4
previewVideo: /assets/videos/rubiks-cube-robot-solve-preview.mp4
---

## Background

As a kid, I was really into solving Rubik's cubes. I was able to solve a 3x3x3 cube in about 15-20 seconds, and I collected various exotic cubes, such as a 7x7x7 cube and 12-sided "Megaminx" cube. Getting a robot to solve a Rubik's cube in world-record level (human) times was too appealing to pass up.

This project was a great experience in designing and building a real robot from scratch. Most of my career has been spent developing machine learning (ML) systems for a variety of applications (including in robotics), which means most of my time is spent developing software rather than hardware. I took this opportunity to dive into electronics and hardware, which has ignited a newfound hobby in "full-stack" (hardware/software) robot development.

## Demo

The video above shows the robot executing a solution for a randomly scrambled Rubik's cube. Before it can plan those moves, it first needs to reconstruct the cube's complete state.

### Inspect: reconstructing the cube state

Two cameras positioned at opposite corners observe all six faces with help from dedicated lights. The motor shafts obscure parts of the far edges, so the robot rotates the faces during inspection to expose stickers that are not initially visible.

The computer-vision pipeline samples the visible sticker regions and classifies their colors. I initially tried fixed HSV color ranges, but they were brittle under changes in lighting. A K-nearest-neighbors classifier trained on labeled color samples was substantially more reliable. The observations from the additional face rotations are then combined into the full cube state used for planning.

The inspection video is shown at twice its original speed.

<video playsinline loop muted preload="auto" poster="/assets/images/rubiks-cube-robot.webp" aria-label="The robot rotating a Rubik's Cube while its cameras inspect the sticker colors" data-autoplay-video>
  <source src="/assets/videos/rubiks-cube-robot-inspect.mp4" type="video/mp4" />
</video>

### Plan: computing a solution

Once inspection is complete, the system uses [Kociemba's algorithm](https://kociemba.org) to compute a near-optimal sequence of moves from the observed state. This planning step takes only milliseconds and is therefore imperceptible in the video.

### Solve: executing the moves

Finally, the planned moves are sent to an Arduino microcontroller. Six TMC2209 stepper drivers operate the motors that turn the cube's faces.

## Lessons Learned

This project taught me many things, especially since this was one of my first hardware projects. Here I'll summarize the most important lessons I will take away from this project.

1. **Camera and lighting are part of the perception system:** I initially entered every sticker color manually and underestimated how difficult robust color detection would be. The inspection pipeline only became reliable after several iterations on the cameras, lighting, and classifier. It reinforced that sensing conditions need to be designed alongside the computer-vision model rather than treated as an afterthought.
2. **Open-Loop Stepper Motors and Power Electronics:** Getting the robot to move each face precisely (either by 90 or 180 degrees at a time) is essential for being able to execute moves reliably. In my initial setup, I did not carefully measure the overall current requirements (especially during initial power up) and as a result observed rogue movements of the motors, causing the initial positions to be incorrect. I solved this by re-wiring the motors using appropriate gauge wires and power supplies, teaching me the importance of carefully adhering to electrical specs. Additionally, the stepper motors can jump slightly when being powered on if their start position is not exactly aligned with one of the physical "steps" of the motor. This can happen if the motors are manually moved or if the robot was powered off while holding a position that's not aligned with a physical step due to micro-stepping in the controller. To solve this, I added a simple command line script to jog the motors by physical motor steps into the zero position.

## Next Steps

This project got me really excited about building robots and I am already planning my next project. Stay tuned for updates!

## Further Reading

The code for this project is available [here](https://github.com/dylanrandle/rubiks-cube-solver).
