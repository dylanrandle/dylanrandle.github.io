---
title: Golf Swing Analysis with Computer Vision
description: I explored how well human pose estimation could track a golfer's body through a fast, highly articulated swing.
date: 2020-07-20T00:01:00-05:00
category: Projects
tags: [computer vision, pose estimation, sports]
image: /assets/images/golf-cv.jpg
imageAlt: Pose-estimation keypoints overlaid on a golfer preparing to swing
imageFit: cover
video: /assets/videos/golf-cv.mp4
---

A golf swing is a compact stress test for human pose estimation. The subject rotates quickly, limbs cross in the image, and motion blur and self-occlusion make individual joints difficult to localize. I used a short, ordinary side-view video to explore how well an off-the-shelf pose estimator could follow that motion.

## A qualitative pose-tracking experiment

I ran the clip through a human pose model and rendered its predicted body skeleton frame by frame. The goal was deliberately modest: this was an exploration of whether the estimated pose remained visually coherent through the address, backswing, downswing, and follow-through—not a new model, a swing score, or a validated biomechanics system.

## What the clip shows

The overlay tracks the major body landmarks through much of the swing and makes the overall movement easy to inspect. It also exposes the limits of a general-purpose body representation. The golf club is outside the skeleton entirely, depth is ambiguous from one camera, and fast or occluded joints can jitter or jump between frames.

Because the comparison is visual rather than measured against motion-capture ground truth, the result should be treated as a prototype rather than evidence of tracking accuracy.

## Takeaway

Pose estimation is useful for quickly turning a video into an interpretable movement visualization. A serious golf-analysis tool would need temporal smoothing, camera calibration or multiple views, golf-specific landmarks for the hands and club, and quantitative validation before making coaching or biomechanical claims.
