---
title: Distributed YouTube-8M Training with Spark and TensorFlow
description: We trained bidirectional LSTM video classifiers over YouTube-8M using Spark, Elephas, HDFS, and an AWS EMR cluster.
date: 2019-05-01T16:05:00-05:00
category: Projects
tags: [deep learning, computer vision, distributed systems, video classification, harvard]
image: /assets/img/spark-tensorflow.webp
imageAlt: Measured training speedup as the number of Spark worker nodes increases
---

YouTube-8M contains features from more than eight million videos and poses a systems problem as much as a modeling problem. Training over terabytes of audio and visual data requires a pipeline that can move data efficiently, coordinate workers, and recover useful scaling from additional machines.

Our project trained two bidirectional LSTM classifiers—one for audio features and one for video features—to predict from thousands of labels. We used Spark for distributed data processing, Elephas to coordinate Keras/TensorFlow training, S3 and HDFS for storage, and a custom AWS EMR cluster built from compatible machine images.

## Systems work

Much of the project involved integration rather than model architecture. We configured TensorFlow's Spark connector, packaged a reproducible cluster image, tuned driver and executor memory, and monitored distributed jobs through Spark's web interface. We also compared two asynchronous training strategies.

In our scaling experiment, epoch-level asynchronous updates benefited much more from additional workers than batch-level asynchronous updates, which quickly saturated. The result illustrated an important distributed-learning lesson: adding machines only helps when coordination and communication overhead do not dominate the work performed by each worker.

This was a 2019 course project, so the documented TensorFlow, Spark, EMR, and Python versions describe the system we built at the time rather than current deployment guidance.

> Explore the [source code and setup notes](https://github.com/dylanrandle/spark-tensorflow) or read the [project report](https://cs205youtubeteam.github.io/index.html).
