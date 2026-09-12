import { profileDataSchema } from './profile-schema.ts';

// Both lists use Markdown filenames from src/content/projects/, without .md.
// List order is résumé order. Each publications entry contributes its papers
// in frontmatter order. Dates are display text only.
export const resumeSelection = {
  projects: [
    'rubiks-cube-robot',
    'real-time-quantitative-trading',
    'golf-cv',
    'generating-faces-vae',
    'differentiable-neural-architecture-search',
    'interpretable-reinforcement-learning',
    'distributed-youtube-classification',
    'causal-lstm-microbiome',
    'bayesian-gans',
    'detecting-twitter-trolls',
    'automatic-differentiation-from-scratch',
  ],
  publications: [
    'multimodal-multi-suction-picking',
    'must-skill-transformer',
    'learning-object-properties-proprioception',
    'avoiding-object-damage-robotic-manipulation',
    'differential-equation-nn',
  ],
} as const;

export const profileData = profileDataSchema.parse({
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
    experience: [
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
    ],
    education: [
      {
        school: 'Harvard University',
        degree: 'Master of Science in Data Science · GPA 4.0',
        period: 'Aug 2018–May 2020',
        location: 'Cambridge, MA, USA',
        bullets: [
          'Recognized with Scholarship in Applied Computation and Distinction in Teaching.',
          'Research and coursework focused on machine learning.',
        ],
        thesisPublicationId: 'harvard-thesis-2020',
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
    ],
    skills: [
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
    ],
  },
});
