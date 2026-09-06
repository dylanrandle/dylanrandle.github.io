---
layout: page
icon: fas fa-info-circle
order: 4
description: Applied scientist and technical lead working in robotics, machine learning, and AI.
toc: true
---

I'm an applied scientist and technical lead working at the intersection of
robotics and machine learning. At Amazon Robotics, I develop closed-loop
policies for dexterous manipulation, with a focus on turning imitation and
reinforcement learning research into reliable production systems.

My broader work spans computer vision, natural language processing,
optimization, and scientific machine learning. I enjoy problems that combine
mathematical depth with real-world systems: from physics-informed neural
networks and interpretable reinforcement learning to warehouse robots operating
at scale.

<div class="d-flex flex-wrap gap-2 mb-4">
  <a class="btn btn-primary" href="/assets/docs/DylanRandleResume.pdf">View résumé PDF</a>
  <a class="btn btn-outline-primary" href="https://linkedin.com/in/dylanrandle/">LinkedIn</a>
  <a class="btn btn-outline-primary" href="https://github.com/dylanrandle">GitHub</a>
  <a class="btn btn-outline-primary" href="https://scholar.google.com/citations?user=62z1l9cAAAAJ">Google Scholar</a>
</div>

## Current focus

- Building closed-loop imitation and reinforcement learning systems for
  dexterous bimanual manipulation.
- Developing and deploying perception, planning, and learned-action models for
  production robotics.
- Publishing applied research in multimodal learning, differentiable
  simulation, and robot manipulation.

## Résumé

The sections below provide a web version of my résumé. A print-ready version is
available as a [PDF](/assets/docs/DylanRandleResume.pdf).

### Experience

#### Amazon Robotics

*North Reading, MA, USA*

**Senior Applied Scientist** · Apr 2024–Present

- Tech lead for closed-loop imitation and reinforcement learning systems for
  dexterous bimanual manipulation.
- Delivered Amazon's first bimanual manipulation policies, achieving a 92%
  success rate on unseen items. The technology was demonstrated to Jeff Bezos,
  Andy Jassy, and the Board of Directors.

**Senior Data Scientist** · Apr 2023–Apr 2024

- Developed production ML systems for robotic manipulation, including grasp
  generation, damage prediction, and box packing.
- Deployed the first learned action model for Amazon's Sparrow robot, delivering
  performance improvements of 35% and savings of $10 million per year.

**Data Scientist II** · Jul 2020–Apr 2023

- Developed an ML path-planning optimization system for large-scale mobile
  robot fleets.
- Published research demonstrating a 15% throughput increase and identifying
  $150 million in annualized efficiency gains for mobile robot fleets.

**Data Scientist I** · Jun 2019–Aug 2019

- Developed an AutoML system for training, evaluating, and interpreting models
  trained on trillion-row robotics datasets.
- The system was used by multiple scientists to accelerate research and
  analysis workflows.

#### Hubdoc

*Toronto, ON, Canada*

**Data Scientist** · Feb 2017–Jul 2018

- Started and led the ML team from ideation through the company's $70 million
  USD acquisition.
- Developed an ML-based NLP system for automated data extraction from
  unstructured financial documents.
- Reduced data-extraction time from hours to seconds.

#### BMO Capital Markets

*Toronto, Canada*

**Financial Products Analyst** · Jun 2014–Aug 2014

- Developed an interest-rate swap and swaption delta-hedging optimization
  algorithm.
- Uncovered market opportunities for fixed-income traders.

### Education

#### Harvard University

*Master of Science in Data Science (GPA: 4.0) · Aug 2018–May 2020 · Cambridge,
MA, USA*

- Thesis: *Unsupervised Neural Network Methods for Solving Differential
  Equations*.
- Recognized with Scholarship in Applied Computation and Distinction in
  Teaching.
- Research and coursework focused on machine learning.

#### University of California, Berkeley

*Bachelor of Science in Industrial Engineering & Operations Research (GPA: 3.9)
· Aug 2012–May 2016 · Berkeley, CA, USA*

- Graduated with High Honors (*magna cum laude*) and received the Frank Kraft
  Award.
- Inducted into Phi Beta Kappa, Tau Beta Pi, and Alpha Pi Mu.
- Coursework focused on statistics and optimization.

### Publications

- [**Demonstrating Multi-Suction Item Picking at Scale via Multi-Modal Learning
  of Pick Success.**](/posts/multimodal-multi-suction-picking/) C Wang, J van
  Baar, C Mitash, S Li, **D Randle**, W Wang, S Sontakke, K E Bekris, K Katyal.
  RSS 2025.
- [**MuST: Multi-Head Skill Transformer for Long-Horizon Dexterous Manipulation
  with Skill Progress.**](/posts/must-skill-transformer/) K Gao, F Wang, E Aduh,
  **D Randle**, J Shi. ICRA 2025.
- [**Learning Object Properties Using Robot Proprioception via Differentiable
  Robot-Object Interaction.**](/posts/learning-object-properties-proprioception/)
  PY Chen, C Liu, P Ma, J Eastman, D Rus, **D Randle**, Y Ivanov, W Matusik.
  ICRA 2025.
- [**Avoiding Object Damage in Robotic
  Manipulation.**](/posts/avoiding-object-damage-robotic-manipulation/) E Aduh,
  F Wang, **D Randle**, K Wang, P Shah, C Mitash, M Nambi. IROS 2024.
- [**DEQGAN: Learning the Loss Function for PINNs with Generative Adversarial
  Networks.**](/posts/differential-equation-nn/) B Bullwinkel*, **D Randle***, P
  Protopapas, D Sondak. ICML 2022, AI for Science. *Equal contribution.*
- [**Unsupervised Learning of Solutions to Differential Equations with
  Generative Adversarial Networks.**](/posts/differential-equation-nn/) **D
  Randle**, P Protopapas, D Sondak. arXiv:2007.11133, 2020.
- [**Unsupervised Neural Network Methods for Solving Differential
  Equations.**](/posts/differential-equation-nn/) **D Randle**. Master's thesis,
  Harvard University, 2020.

### Projects

- [**Rubik's Cube Solving Robot**](/posts/rubiks-cube-robot/) *(Nov 2024)*:
  Built a robot that solves a cube in under three seconds using camera-based
  perception, Kociemba's planning algorithm, and custom stepper-motor hardware.
- **Real-Time Quantitative Trading System** *(Jun 2023)*: Built and deployed a
  live quantitative trading system that uses real-time NLP analysis of news
  articles to generate market signals and execute trades.
- [**Golf Swing Analysis with Computer Vision**](/posts/golf-cv/) *(Jul 2020)*:
  Applied monocular 3D human-pose estimation to analyze body mechanics
  throughout a golf swing.
- [**ResNet Variational Autoencoder**](/posts/generating-faces-vae/) *(Jun
  2020)*: Trained a residual-network VAE on CelebA to learn a generative latent
  representation and synthesize faces.
- [**Differentiable Neural Architecture
  Search**](/posts/differentiable-neural-architecture-search/) *(Dec 2019)*:
  Partnered with Google AI to adapt and evaluate DARTS across materials science,
  astronomy, and medical-imaging datasets.
- [**Interpretable Reinforcement
  Learning**](/posts/interpretable-reinforcement-learning/) *(Dec 2019)*:
  Distilled black-box policies into readable decision sets using DAgger,
  quantified the interpretability-performance tradeoff in an HIV treatment
  simulator, and released `pynterp`, an open-source package providing
  interpretable algorithms.
- [**Distributed YouTube-8M
  Classification**](/posts/distributed-youtube-classification/) *(May 2019)*:
  Trained bidirectional LSTM video classifiers with Spark, TensorFlow, Elephas,
  HDFS, and a custom AWS EMR cluster.
- [**Causal LSTM Microbiome Modeling**](/posts/causal-lstm-microbiome/) *(May
  2019)*: Used sparse LSTMs, neural Granger-causality analysis, and Bayesian
  optimization to compare microbial interactions in healthy and IBD mice.
- [**Bayesian Generative Adversarial Networks**](/posts/bayesian-gans/) *(Dec
  2018)*: Reproduced and evaluated Bayesian GANs using stochastic-gradient HMC,
  demonstrating mode diversity on four-shapes data and semi-supervised MNIST.
- [**Twitter Troll Detection**](/posts/detecting-twitter-trolls/) *(Dec 2018)*:
  Built NLP classifiers for identifying Internet Research Agency tweets,
  achieving 95.9% accuracy on a temporally separated test set.
- [**Automatic Differentiation from
  Scratch**](/posts/automatic-differentiation-from-scratch/) *(Dec 2018)*: Built
  and published the `dragongrad` Python package with forward- and reverse-mode
  differentiation, Jacobians, and gradient-based optimization.

### Technical skills

- **Languages:** Python, C++, JavaScript/TypeScript, SQL
- **Libraries:** PyTorch, Keras/TensorFlow, OpenCV, Open3D, Pandas, NumPy, SciPy,
  scikit-learn, React
- **Platforms:** AWS, Docker, Firebase, Linux, macOS
