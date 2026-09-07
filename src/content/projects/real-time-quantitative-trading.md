---
title: Real-Time Quantitative Trading System
description: I built a live trading system that used topic models over financial news to predict cross-sectional price movements at the market open.
date: 2023-06-01T16:00:00-04:00
category: Projects
tags: [quantitative finance, natural language processing, topic modeling, real-time systems]
image: /assets/img/stocks-lda.png
imageAlt: Illustration of a document represented as a mixture of latent topics and word assignments
---

_Image source: [IBM's overview of latent Dirichlet allocation](https://www.ibm.com/think/topics/latent-dirichlet-allocation)._

Financial news contains information that can affect many securities at once, but the useful signal is rarely captured by a single keyword. I built and deployed a real-time quantitative trading system that represented incoming news articles with a topic model, predicted how stocks would move relative to one another at the opening auction, and turned those predictions into executable market signals.

## Representing news with latent topics

The system used **latent Dirichlet allocation (LDA)**, a probabilistic topic-modeling method. LDA represents each article as a mixture of topics and each topic as a distribution over words. A story might therefore load partly on earnings, partly on an industry, and partly on a macroeconomic theme instead of receiving one rigid label.

Those topic proportions turned an unstructured article into a compact numerical representation. Rather than attempting to interpret every word independently, the prediction model could learn how different combinations of themes related to subsequent price movements.

LDA is also intentionally simple. It uses word occurrence and co-occurrence while ignoring word order and much of the surrounding linguistic context. That makes the representation efficient and interpretable, but limits its ability to capture details such as negation or a subtle change in tone.

## Predicting the opening cross-section

The target was **cross-sectional movement** at the opening auction: which stocks were likely to move more or less than other stocks opening at the same time. This differs from forecasting whether the market as a whole will rise or fall. It focuses the model on the relative information contained in company- and topic-specific news.

As articles arrived, the system inferred their topic mixtures and used those features to produce predictions before the market opened. The resulting rankings became trading signals for the live execution system.

## From a model to a real-time system

The most important engineering work sat around the model. News and market data had to be processed with strict timestamps so the historical evaluation used only information that would have been available before each auction. The live pipeline also had to handle new articles, missing data, prediction generation, and trade execution on a fixed schedule.

This project was a useful lesson in the difference between an offline model and a deployed quantitative strategy. Predictive modeling was only one component; data freshness, leakage prevention, operational reliability, and disciplined execution were equally important to making the system work in real time.
