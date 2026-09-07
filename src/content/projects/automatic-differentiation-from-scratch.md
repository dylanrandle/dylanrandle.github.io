---
title: Automatic Differentiation from Scratch
description: We built a Python library for forward- and reverse-mode automatic differentiation, Jacobians, and gradient-based optimization.
date: 2018-12-15T16:04:00-05:00
category: Projects
tags: [machine learning, automatic differentiation, optimization, python, harvard]
image: /assets/images/autograd.webp
imageAlt: Gradient descent following a path across a three-dimensional objective surface
---

Automatic differentiation (AD) powers gradient-based optimization in modern machine learning. It avoids the expression growth of symbolic differentiation and the numerical error of finite differences by applying the chain rule to a program's sequence of elementary operations.

For this project, we implemented an AD library in Python from first principles. The library supports both **forward mode** and **reverse mode**, scalar and vector-valued functions, Jacobian calculations, and optimization routines.

## Design

The implementation represents a computation using two central abstractions:

- A `Variable` carries a value and the derivative information accumulated through the graph.
- A `Block` represents an elementary operation, such as addition, multiplication, sine, or exponentiation, together with its local Jacobian.

Composing blocks builds a computational graph. In forward mode, derivative information moves through the graph alongside values. In reverse mode, the graph records dependencies during the forward calculation and propagates gradients backward from the output. The API also supports multiple input variables and vector-to-vector mappings.

Building these pieces made the machinery behind libraries such as TensorFlow and PyTorch much more concrete: backpropagation is an organized application of the chain rule over a graph of simple operations.

This was a team project with Paxton Maeder-York, Adam Nitido, and Simon Sebbagh. The package was published to PyPI as `dragongrad`.

> Explore the [source code](https://github.com/dylanrandle/autograd) and its [documentation](https://autograd.readthedocs.io/en/latest/).
