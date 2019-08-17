---
title: "Dylan's Blog"
nav_include: 1
---

*In God we trust... all others must bring data.*

## Posts
{:.no_toc}
*  
{: toc}

## Some Advice to Data Scientists & Machine Learners

Recently in my role as a data scientist at Amazon, I have been facing one of the fundamental dichotomies in data science: the tradeoff between inference and prediction, aptly discussed in [this Harvard Data Science Review article](https://hdsr.mitpress.mit.edu/pub/a7gxkn0a). Often in data science there is an underlying tension between *understanding* the data-generating process and making *predictions* about it. In a computer vision system, for example, we would typically only care about how often a model is correct in classifying certain objects; we would not worry about explaining what features of the pixel distributions explain an object's "cat-ness", for example. In contrast, if we are fitting a model to predict some serious illness in the real world, it would be paramount to understand the relationships among features and explain the model; not just for the peace-of-mind of doctor and patient, but even for the development of the science of medicine itself.

In most cases, prediction and inference must be traded off for one another: adding more "inference" generally means we give up some predictive power if we hold the amount of computation constant. In this post, I want to explain why the framing of data science problems in terms of prediction and inference is a crucial step in designing and implementing any data science solution.

As is the case in so many aspects of life, stepping back and remembering the fundamentals helps. There are usually two main reasons we want to fit a model to data:
1. We want to predict outcome *y* for some new, unseen data *X* (*prediction*)
2. We want to understand something about the data-generating process that yields *y* from *X* (*inference*)

Being clear about which question we are trying to answer will make our lives *much* easier.

Let's step back and understand what this really means in practice. Suppose we are working for a store owner who wishes to employ data science in his/her business. Further imagine that the owner is primarily focused on the time a customer is inside her/his store (from entering to exiting). Given the relevant data (e.g. customer identity, historical preferences, demographic cohort, browsing patterns, etc.), there are many different things we could do. It is up to us, as data scientists, to refine the problem by asking relevant questions of the store owner.

In terms of inference, we could explore how customer features lead to sales and use this *understanding* to inform future business decisions. We would need to be very careful about which features we use (picking only relevant features, dealing with multicollinearity, etc.), how we select representative samples, and which models we fit (leaning towards interpretability and carefully validating underlying assumptions).

On the other hand, we may develop a prediction-focused solution in which a powerful model is deployed to predict, on an individual basis, the probability a customer will make a purchase. The goal would be to use this information to inform real-time decision making (e.g. whether to offer a customer an exclusive deal), but without any need to explain the decisions to a human. Here we would not worry about multicollinearity in our feature set, which data to include or exclude (for the most part), or using only models with strong notions of interpretability. Our focus would be on achieving the highest possible accuracy on a representative test set. We could fit a big honking neural network that performs well on our test set and call it a day.

Each approach leads to a significantly different workflow: in inference we must place greater emphasis on understanding the data and carefully abiding by the assumptions of our modeling approach, while in prediction our focus is on fitting the data extremely well and in a way that we can confidently say will generalize to future scenarios. Getting to the root of whether a problem is focused  on prediction or inference will save considerable time when doing data science in practice. For inference it is very often the case that a simple model (e.g. linear/logistic regression) will be the best method, but it is paramount to understand the intricacies of the data and modeling assumptions. For prediction, optimal performance on the test data may be achieved with a neural network or gradient boosting machine trained on the largest possible amount of data, without too much thought into the data being used--we assume our model's training algorithm will discriminate among the features for us.

Whatever the case, being clear-eyed about the ultimate focus of the problem will save much back-and-forth between the data customer and streamline the process from conception to solution. Ultimately, data scientists are tasked with finding a sensible balance between prediction and inference that best suits our use-case and delivers the greatest value to our customer.

## My 10,000 Hours

Last night, I started reading Malcolm Gladwell's book, *Outliers*, and today I would like to write down my thoughts about it. In *Outliers*, Gladwell seeks to uncover the hidden alchemy of success and dispel the widespread myths surrounding it. He asserts that our common notion that success is achieved through some kind of utopian meritocratic process is patently false. In hockey, he explains, the vast majority of successful players share a single characteristic: their birthdate's proximity to January 1. Why is this? It's simple: hockey's age cutoff begins on January 1, and so players born closest to the cutoff will be the most mature in their cohort.

One would not, at first, imagine this to be a huge difference-maker. However, Gladwell is quick to point out that it serves to reinforce a self-fulfilling prophecy inherent in hockey's development model. When players are young, say below the age of eight, hockey players all play together. But at this young age, a few months of maturity can make a big difference, and so those players born close to January 1 tend to excel. This leads them to be selected for advanced training, the effect of which becomes compounded over many years, and voila: our best hockey players are overwhelmingly born from January-March.

So, Gladwell muses, perhaps success is not purely based on talent. Indeed, maybe our environment and the circumstances in which we grow up is a better predictor of how high up the ladder we will climb. Investigating this notion further, Gladwell turns to world-class musicians. Here he finds that the secret to utter mastery of an instrument lies in a seemingly arbitrary yet highly recurrent number: **10,000 hours** (of practice). It is this number that he finds cropping up everywhere he looks. Whether it be back with the hockey players or in his interviews with high performers across fields as diverse as music, software engineering, and management. Gladwell even posits that Mozart may have only produced his best works--works which truly deserve the "masterpiece" designation--after he had reached the 10,000 hour mark in his twenties.

This led me to think: "what are my 10,000 hours?" and what would I like to do with them? Throughout my childhood I focused on various pastimes. Early on, I played hockey and competed in alpine skiing races; in my teens I focused on academics and became interested in mathematics, physics, and economics; in my spare time I developed an enthusiasm for Rubik's cubes: either solving big ones (like the 7x7x7 or the 12-sided Megaminx), or solving them quickly (speedcubing, as it is known, e.g. solving a 3x3x3 in under 20 seconds); I even regularly played, and still play, the guitar. But upon reflection, I must conclude that it is mathematics, without a doubt, wherein lies my potential to reach the all-important 10,000 hour mark.

In high school I was in the advanced math class, a member of the math society, and wrote my high school thesis on a subject in mathematics; I had a tutor who would take me through advanced topics every week, and my innate passion for the subject has led me to pursue a master's in data science and to work on math-related subjects in my professional life. If we group together the disparate fields in which I have worked (mathematics, physics, operations research, data science), and place them all under the banner of mathematics, my rough accounting estimates I have spent between 8,000 and 10,000 hours in the practice of mathematics. I hope I am soon be due for my masterpiece! *-Dylan Randle (July 4, 2019)*

## The "AI-Revolution"

I recently re-read an [article](https://hdsr.mitpress.mit.edu/pub/wot7mkc1) which I have become very fond of: "Artificial Intelligence: The Revolution Hasn't Happened Yet" by one of the most respected researchers in the world of computer science and statistics, Michael I. Jordan. The article is his take on the AI hype, and serves as an important framing of the new field of "data science" for all the researchers in the field.

The essence of Jordan's message is this: the current round of AI innovations are not intelligent. This is backed up by others who have claimed deep learning is merely "curve-fitting", albeit in high dimensional space. And it is true, our deep learning systems come nowhere close to having common-sense and higher-level reasoning capabilities akin to humans. These deep learning achievements (and they certainly are incredible achievements) amaze us with their shows of raw sensorimotor skills, yet they continue to lack true intelligence.

All the while, our world is swimming in data and is unable to leverage it to its full potential. The status quo is one in which patients are routinely misdiagnosed simply due to the improper application of rudimentary statistical analyses (Jordan gives the example of his child whose life would have been put at undue risk due to the application of a miscalibrated statistical test).

The point is this: don't become enthralled by the "AI" achievements we are seeing and place all our faith in them for solving our problems (did chemical engineers believe an AI god would design their chemical plants?). We need a principled approach to solving our problems, not some fantastical fiction about an omnipresent AI who will do our bidding.

We lack an ability to bring together disparate data across time and space and to make appropriate conclusions from it. We are behind in the pursuit of augmented intelligence, whereby data can assist humans in decision-making by strengthening our quantitative abilities (which turns out to be the place in which computers have us beat, for now). We should remain inspired and continue to drive the field of AI forward, but it is important not to lose sight of the bigger picture and, in doing so, forget there are many tangible issues *right now* (not just AI!) that require distributed systems, statistics, privacy, and machine learning solutions. *-Dylan Randle (July 4, 2019)*
