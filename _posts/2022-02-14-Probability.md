---
title: Probability
date: 2022-02-14 16:00:00 +/-TTTT
categories: [Math]
tags: [notes, statistics]
math: true
---

## Fundamentals

### Axioms:

1. $ P(A) \geq 0 $ for all $ A $
2. $ P(\Omega) = 1 $ where $ \Omega $ is the sample space
3. If $A_i$ are *disjoint* (or *mutually exclusive*), then $ P( \bigcup_{i}^{\infty} A_i ) = \sum_{i}^{\infty} P(A_i) $

#### Interpretations of $P(A)$:
- Frequentist: long-run frequency
- Bayesian: degree of belief

#### Lemmas:
- Complement: $P(A^c) = 1 - P(A)$
- Subset: $A \subset B \implies P(A) \leq P(B)$
- Venn diagram: $P(A \cup B) = P(A) + P(B) - P(A \cap B)$

### Independence:
- $A,B$ are **independent** if $ P(A \cap B) = P(A) P(B) $
  - Extends to a set of indepedent events.
- Either assumed or verified (by the above equation).
  - Trick: if $A,B$ are disjoint, each with positive probability, can they be independent? No, equation is violated: $P(A \cap B) = 0$ (by disjointness) but $P(A)P(B) > 0$ (by positivity), and so $ P(A \cap B) \neq P(A) P(B) $.
  - In general: no way to judge independence based on Venn diagram alone!

### Conditional Probability:
- Define $P(A \mid B) = \frac{P(A,B)}{P(B)}$ if $P(B)>0$.
  - Fraction of times that A occurs among events in which B also occurs
- Axioms of probability apply to events **left of the bar, not the right**
  - E.g. if $A,B$ disjoint, then $P(A \cup B \mid C) = P(A \mid C) + P(B \mid C)$, but in general $P(C \mid A \cup B) \neq P(C \mid A) + P(C \mid B).$
- In general, $P(A \mid B) \neq P(B \mid A)$.
  - E.g. probability of tumor given cancer is 1, but probability of cancer given tumor < 1 (could be benign)

#### Lemmas:
- If $A,B$ independent, $P(A \mid B) = \frac{P(A)P(B)}{P(B)} = P(A)$
- $P(A,B) = P(A \mid B)P(B) = P(B \mid A)P(A)$
  - $\implies P(A \mid B) = \frac{P(B \mid A)P(A)}{P(B)}$ (Bayes' rule)

### Bayes' Theorem:
- Law of total probability: if $A_i$ partitions $\Omega$, then for any event $B$, $ P(B) = \sum_{\forall i} P(B \mid A_i)P(A_i) $
  - For conditional probabilities, we have $P(B \mid C) = \sum_{\forall i} P(B \mid C \cap A_i) P(A_i \mid C)$
- Bayes' rule: $P(A \mid B) = \frac{P(B \mid A)P(A)}{P(B)} = \frac{P(B \mid A)P(A)}{\sum_{\forall i}P(B \mid A_i)P(A_i)}$