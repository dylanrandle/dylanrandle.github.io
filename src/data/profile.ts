import { profileSchema, type ProfileInput } from './profile-schema.ts';

const experience = [
  {
    organization: 'Amazon Robotics',
    location: 'North Reading, MA, USA',
    roles: [
      {
        title: 'Senior Applied Scientist',
        period: 'Apr 2024–Present',
        bullets: [
          'Tech lead for closed-loop imitation and reinforcement learning systems for dexterous bimanual manipulation.',
          "Delivered Amazon's first bimanual manipulation policies, achieving a 92% success rate on unseen items. The technology was demonstrated to Jeff Bezos, Andy Jassy, and the Board of Directors.",
        ],
      },
      {
        title: 'Senior Data Scientist',
        period: 'Apr 2023–Apr 2024',
        bullets: [
          'Developed production ML systems for robotic manipulation, including grasp generation, damage prediction, and box packing.',
          "Deployed the first learned action model for Amazon's Sparrow robot, delivering performance improvements of 35% and savings of $10 million per year.",
        ],
      },
      {
        title: 'Data Scientist II',
        period: 'Jul 2020–Apr 2023',
        bullets: [
          'Developed an ML path-planning optimization system for large-scale mobile robot fleets.',
          'Published research demonstrating a 15% throughput increase and identifying $150 million in annualized efficiency gains for mobile robot fleets.',
        ],
      },
      {
        title: 'Data Scientist I',
        period: 'Jun 2019–Aug 2019',
        bullets: [
          'Developed an AutoML system for training, evaluating, and interpreting models trained on trillion-row robotics datasets.',
          'The system was used by multiple scientists to accelerate research and analysis workflows.',
        ],
      },
    ],
  },
  {
    organization: 'Hubdoc',
    location: 'Toronto, ON, Canada',
    roles: [
      {
        title: 'Data Scientist',
        period: 'Feb 2017–Jul 2018',
        bullets: [
          "Started and led the ML team from ideation through the company's $70 million USD acquisition.",
          'Developed an ML-based NLP system for automated data extraction from unstructured financial documents.',
          'Reduced data-extraction time from hours to seconds.',
        ],
      },
    ],
  },
  {
    organization: 'BMO Capital Markets',
    location: 'Toronto, ON, Canada',
    roles: [
      {
        title: 'Financial Products Analyst',
        period: 'Jun 2014–Aug 2014',
        bullets: [
          'Developed an interest-rate swap and swaption delta-hedging optimization algorithm.',
          'Uncovered market opportunities for fixed-income traders.',
        ],
      },
    ],
  },
];

const education = [
  {
    school: 'Harvard University',
    degree: 'Master of Science in Data Science · GPA 4.0',
    period: 'Aug 2018–May 2020',
    location: 'Cambridge, MA, USA',
    bullets: [
      'Thesis: Unsupervised Neural Network Methods for Solving Differential Equations.',
      'Recognized with Scholarship in Applied Computation and Distinction in Teaching.',
      'Research and coursework focused on machine learning.',
    ],
  },
  {
    school: 'University of California, Berkeley',
    degree:
      'Bachelor of Science in Industrial Engineering & Operations Research · GPA 3.9',
    period: 'Aug 2012–May 2016',
    location: 'Berkeley, CA, USA',
    bullets: [
      'Graduated with High Honors (magna cum laude) and received the Frank Kraft Award.',
      'Inducted into Phi Beta Kappa, Tau Beta Pi, and Alpha Pi Mu.',
      'Coursework focused on statistics and optimization.',
    ],
  },
];

const publications = [
  {
    title:
      'Demonstrating Multi-Suction Item Picking at Scale via Multi-Modal Learning of Pick Success',
    href: '/projects/multimodal-multi-suction-picking/',
    authors:
      'C. Wang, J. van Baar, C. Mitash, S. Li, D. Randle, W. Wang, S. Sontakke, K. E. Bekris, K. Katyal',
    venue: 'RSS 2025',
  },
  {
    title:
      'MuST: Multi-Head Skill Transformer for Long-Horizon Dexterous Manipulation with Skill Progress',
    href: '/projects/must-skill-transformer/',
    authors: 'K. Gao, F. Wang, E. Aduh, D. Randle, J. Shi',
    venue: 'ICRA 2025',
  },
  {
    title:
      'Learning Object Properties Using Robot Proprioception via Differentiable Robot-Object Interaction',
    href: '/projects/learning-object-properties-proprioception/',
    authors:
      'P. Y. Chen, C. Liu, P. Ma, J. Eastman, D. Rus, D. Randle, Y. Ivanov, W. Matusik',
    venue: 'ICRA 2025',
  },
  {
    title: 'Avoiding Object Damage in Robotic Manipulation',
    href: '/projects/avoiding-object-damage-robotic-manipulation/',
    authors:
      'E. Aduh, F. Wang, D. Randle, K. Wang, P. Shah, C. Mitash, M. Nambi',
    venue: 'IROS 2024',
  },
  {
    title:
      'DEQGAN: Learning the Loss Function for PINNs with Generative Adversarial Networks',
    href: '/projects/differential-equation-nn/',
    authors: 'B. Bullwinkel*, D. Randle*, P. Protopapas, D. Sondak',
    venue: 'ICML 2022, AI for Science · Equal contribution',
  },
  {
    title:
      'Unsupervised Learning of Solutions to Differential Equations with Generative Adversarial Networks',
    href: '/projects/differential-equation-nn/',
    authors: 'D. Randle, P. Protopapas, D. Sondak',
    venue: 'arXiv:2007.11133 · 2020',
  },
  {
    title:
      'Unsupervised Neural Network Methods for Solving Differential Equations',
    href: '/projects/differential-equation-nn/',
    authors: 'D. Randle',
    venue: "Master's thesis, Harvard University · 2020",
  },
];

const projects = [
  {
    title: "Rubik's Cube Solving Robot",
    date: 'Nov 2024',
    description:
      "Built a robot that solves a cube in under three seconds using camera-based perception, Kociemba's planning algorithm, and custom stepper-motor hardware.",
  },
  {
    title: 'Real-Time Quantitative Trading System',
    date: 'Jun 2023',
    description:
      'Built and deployed a live quantitative trading system that uses real-time NLP analysis of news articles to generate market signals and execute trades.',
  },
  {
    title: 'Golf Swing Analysis with Computer Vision',
    date: 'Jul 2020',
    description:
      'Applied monocular 3D human-pose estimation to analyze body mechanics throughout a golf swing.',
  },
  {
    title: 'ResNet Variational Autoencoder',
    date: 'Jun 2020',
    description:
      'Trained a residual-network VAE on CelebA to learn a generative latent representation and synthesize faces.',
  },
  {
    title: 'Differentiable Neural Architecture Search',
    date: 'Dec 2019',
    description:
      'Partnered with Google AI to adapt and evaluate DARTS across materials science, astronomy, and medical-imaging datasets.',
  },
  {
    title: 'Interpretable Reinforcement Learning',
    date: 'Dec 2019',
    description:
      'Distilled black-box policies into readable decision sets using DAgger and quantified the interpretability-performance tradeoff in an HIV treatment simulator.',
  },
  {
    title: 'Distributed YouTube-8M Classification',
    date: 'May 2019',
    description:
      'Trained bidirectional LSTM video classifiers with Spark, TensorFlow, Elephas, HDFS, and a custom AWS EMR cluster.',
  },
  {
    title: 'Causal LSTM Microbiome Modeling',
    date: 'May 2019',
    description:
      'Used sparse LSTMs, neural Granger-causality analysis, and Bayesian optimization to compare microbial interactions in healthy and IBD mice.',
  },
  {
    title: 'Bayesian Generative Adversarial Networks',
    date: 'Dec 2018',
    description:
      'Reproduced and evaluated Bayesian GANs using stochastic-gradient HMC, demonstrating mode diversity and semi-supervised learning.',
  },
  {
    title: 'Twitter Troll Detection',
    date: 'Dec 2018',
    description:
      'Built NLP classifiers for identifying Internet Research Agency tweets, achieving 95.9% accuracy on a temporally separated test set.',
  },
  {
    title: 'Automatic Differentiation from Scratch',
    date: 'Dec 2018',
    description:
      'Built and published the dragongrad Python package with forward- and reverse-mode differentiation, Jacobians, and gradient-based optimization.',
  },
];

const skills = [
  {
    label: 'Languages',
    value: 'Python, C++, JavaScript/TypeScript, SQL',
  },
  {
    label: 'Libraries',
    value:
      'PyTorch, Keras/TensorFlow, OpenCV, Open3D, Pandas, NumPy, SciPy, scikit-learn, React',
  },
  {
    label: 'Platforms',
    value: 'AWS, Docker, Firebase, Linux, macOS',
  },
];

const profileData = {
  name: 'Dylan L Randle',
  displayName: 'Dylan Randle',
  email: 'dylanrandle@gmail.com',
  portrait: {
    src: '/assets/images/headshot.jpg',
    alt: 'Dylan Randle',
  },
  links: {
    website: 'https://dylanrandle.github.io/',
    github: 'https://github.com/dylanrandle',
    linkedin: 'https://www.linkedin.com/in/dylanrandle',
    scholar: 'https://scholar.google.com/citations?user=62z1l9cAAAAJ',
    cv: '/assets/docs/DylanRandleResume.pdf',
  },
  intro: {
    eyebrow: 'AI · Robotics · Embodied Intelligence',
    headline:
      'Applied scientist and technical lead building learning systems for dexterous robot manipulation.',
    detail:
      'I work across imitation learning, reinforcement learning, perception, and deployed robotics—turning research into systems that operate at industrial scale.',
    aboutHeading: 'Making learned systems dependable.',
  },
  resume: {
    summary:
      'Technical lead with 8+ years of experience in AI, robotics, and machine learning. Expert in developing closed-loop policies for dexterous manipulation using imitation and reinforcement learning. Proven track record building and deploying AI/ML systems for robotics, computer vision, and natural language processing.',
    experience,
    education,
    publications,
    projects,
    skills,
  },
} satisfies ProfileInput;

export const profile = profileSchema.parse(profileData);
