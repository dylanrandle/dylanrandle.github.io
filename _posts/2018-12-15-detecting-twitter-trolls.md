---
title: Detecting Twitter Trolls with Machine Learning
description: We compared text representations and classifiers for identifying tweets from Internet Research Agency accounts.
date: 2018-12-15 16:03:00 -0500
categories: [Projects]
tags: [machine learning, natural language processing, social media, harvard]
image:
  path: /assets/img/twitter-troll-detection.webp
  alt: Principal-component projections showing troll and non-troll tweets separating across neural-network layers
---

This project asked whether machine-learning models could distinguish tweets written by accounts associated with the Internet Research Agency (IRA) from ordinary election-related tweets. We began with FiveThirtyEight's archive of nearly three million IRA tweets and collected a comparison set related to the 2016 U.S. election.

After filtering and balancing the data, we trained on roughly 266,000 tweets and used separate validation and test sets of about 33,000 tweets each. The features combined tweet text with the author's follower count, following count, and a retweet indicator.

## Models

We compared three representations of the text:

- Bag of Words
- TF-IDF
- 4,096-dimensional InferSent sentence embeddings

We used those representations with Naive Bayes, logistic regression, a support-vector machine, and a fully connected neural network. We evaluated both a conventional random split and a more realistic temporal split that trained on earlier tweets and tested on later ones.

## Results and limitations

Logistic regression with Bag of Words was the strongest model, reaching 96.7% test accuracy on the random split and 95.9% on the temporal split. The embedding-based neural network was close behind. The temporal results were particularly useful because they tested whether the models could generalize as topics changed over time.

The result needs an important qualification: the positive examples came from one known organization and the negative examples came from election-related searches. The model therefore learned to identify patterns associated with this dataset of IRA accounts—not a universal definition of trolling.

This was a team project with Joe Davison, Julien Laasri, and Abhimanyu Talwar.

> See the [full project site](https://dylanrandle.github.io/troll_classification/) and [source code](https://github.com/dylanrandle/troll_classification).
{: .prompt-info }
