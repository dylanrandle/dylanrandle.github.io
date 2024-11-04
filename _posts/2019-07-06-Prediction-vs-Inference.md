---
title: Prediction vs Inference
date: 2019-07-06 16:00:00 -0500
categories: [Musings]
tags: [statistical inference, machine learning]
---

Recently, in my role as Data Scientist at Amazon, I have been faced with one of the fundamental dichotomies of data science: the tradeoff between inference and prediction (aptly discussed in [this Harvard Data Science Review article](https://hdsr.mitpress.mit.edu/pub/a7gxkn0a)). The situation is best described through example: consider a computer vision system that predicts if an image contains a cat; in this setting, we would only care about the accuracy of our model and would not be focused on explaining why a prediction was made--either there's a cat or there isn't. In contrast, if we are fitting a model to predict an illness, for example, it would be paramount to understand why the model made a certain prediction. Not just for the peace-of-mind of the doctor and patient, but, even more fundamentally, for the development of science itself.

As the word "tradeoff" implies, it is unfortunately not often the case that we can "have our cake an eat it too", so to speak. In most cases, prediction and inference must be traded off for one another: adding more "inference" generally means we give up some predictive power if we hold the amount of computation constant. In this post, I want to explain why the framing of data science problems in terms of prediction and inference is a crucial step in designing and implementing any data science solution.

The prediction vs. inference question can be boiled down to the following two cases:
1. We want to predict *y* for some new, unseen *X*
2. We want to understand how *X* leads to *y* (the so-called "data generating process")

If the first case seems like the correct choice, then our problem is primarily one of prediction, and vice-versa for inference. Being clear about which question we are trying to answer will make our lives easier.

**A practical scenario**

Let's step back and understand, in concrete terms, how this might play out in practice. Suppose, for example, that we are approached by a shop owner who would like to "leverage his/her customer data to increase sales". This is typical of the questions encountered "in the wild": vague and underspecified. We must dive deeper to probe for the answer to the prediction/inference tradeoff.

In this case, we might ask the owner the following questions:
- "How important is it to understand which aspects of the data drive sales?"
- "Do you want to gain insights about your customer and convey these to your sales associates?"
- "Would you be willing to employ a system for predicting customer-by-customer shopping behavior?"

The answers to these questions provide meaningful insights. If they come back on the inference spectrum (i.e. "understanding is paramount to me, I am not comfortable with deploying a machine learning solution in my store"), we want to err on the side of **simple, interpretable models** and be very careful about:
1. Understanding the data we have been given
2. Cleaning and filtering it to obtain an appropriate sample
3. Dealing with multicollinearity, testing model assumptions, and crafting useful visualizations

On the other hand, a prediction-focused answer might sound something like "I could care less about why my customers buy something, I just want to know who is likely to buy and who is not!" In this example, we would need to dive deeper to brainstorm ways in which predictions could be used to facilitate the owner's goals of increasing sales. One potential idea could be to use this information to inform real-time decision making (e.g. whether to offer a customer a deal), but without any need to explain the decisions to a human. Here we should focus on the best possible **performance on the test set** and doggedly pursue the following steps:
1. Select data and generate training, testing and validation sets that is/are representative of the future (as far as we can tell)
2. Train and evaluate models in order of increasing complexity (don't worry about interpretability: tree ensembles & neural networks are fair game); inspect model training to balance under/over-fitting
3. Employ cross-validation to tune hyper-parameters (if computation is a bottleneck, focus on scalable methods for implementing this step, e.g. multi-GPU/distributed processing)

Each approach leads to vastly different workflows: in inference we place greater emphasis on understanding the data and carefully abiding by the assumptions of our model, while in prediction we focus on fitting the data extremely well and in a way that we are confident will generalize to future scenarios. Whatever the case, being clear-eyed about the ultimate focus of the problem will save much back-and-forth and streamline the process from conception to solution. Ultimately, data scientists are tasked with finding a sensible balance between prediction and inference that best suits the use-case and delivers the greatest value. I believe it is paramount to understand this tradeoff to become an effective data scientist.