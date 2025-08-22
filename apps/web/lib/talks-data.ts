export type Talk = {
  id: number
  title: string
  venue: string
  date: string
  year: number
  description?: string
  type: "conference" | "seminar" | "workshop" | "lecture" | "podcast"
  videoUrl?: string
  slidesUrl?: string
  thumbnailUrl?: string
  duration?: string
  featured?: boolean
  primaryContent?: "video" | "slides"  // Which content to show first/use for thumbnail
}

export const talks: Talk[] = [
  {
    id: 2,
    title: "New News: System-2 Fine-tuning for Robust Integration of New Knowledge",
    venue: "Prague Synapse 2025 (Invited)",
    date: "July 9, 2025",
    year: 2025,
    type: "conference",
    slidesUrl: "https://drive.google.com/file/d/1OWApNJhRBivc9jkEZ2pMMFR96i3hz9SI/view?usp=sharing",
    thumbnailUrl: "/images/talks/prague-new-news.png",
    featured: false
  },
  {
    id: 3,
    title: "Decomposing Elements of Problem Solving: What 'Math' does RL Teach?",
    venue: "NVIDIA (Invited)",
    date: "June 13, 2025",
    year: 2025,
    type: "seminar",
    slidesUrl: "https://drive.google.com/file/d/190WhoZwEmyAy30hIm-moDxRdZjiL4vKp/view?usp=sharing",
    thumbnailUrl: "/images/talks/reason-wall-nvidia.png",
    featured: false
  },
  {
    id: 4,
    title: "In-Context Learning: From toy models to practice",
    venue: "Department of Physics, KAIST",
    date: "May 13, 2025",
    year: 2025,
    type: "seminar",
    slidesUrl: "https://drive.google.com/file/d/1Sp4D1b_4piMgJ9bWnlX6YJp7AnxBaoUG/view?usp=sharing",
    thumbnailUrl: "/images/talks/icl-kaist.png",
    featured: false
  },
  {
    id: 5,
    title: "In-Context Learning: Algorithms and Representations",
    venue: "Department of Physics, University of Tokyo (Invited)",
    date: "May 1, 2025",
    year: 2025,
    type: "seminar",
    slidesUrl: "https://drive.google.com/file/d/1H84jXT2tTC4j4cf1nhVDPcrAUjMG18G3/view?usp=sharing",
    thumbnailUrl: "/images/talks/icl-tokyo.png",
    featured: false
  },
  {
    id: 6,
    title: "Deep Learning as a Scientific Tool and a Model Organism of Intelligence",
    venue: "Ph.D. Defense",
    date: "April 21, 2025",
    year: 2025,
    type: "lecture",
    slidesUrl: "https://drive.google.com/file/d/1D_zToNK3TXGhazBjeNZYldYmgaywmckZ/view?usp=sharing",
    thumbnailUrl: "/images/talks/phd-defense.png",
    featured: true
  },
  {
    id: 7,
    title: "Fundamental Abilities and In-abilities of AI",
    venue: "Marks and Sander Lab, Harvard Medical School (Invited)",
    date: "February 28, 2025",
    year: 2025,
    type: "seminar",
    slidesUrl: "https://drive.google.com/file/d/1exGMlduMuPkbr6r26nI6aZXamnR2inlh/view?usp=sharing",
    thumbnailUrl: "/images/talks/fundamental-abilities-hms.png",
    featured: false
  },
  {
    id: 8,
    title: "Understanding Fundamental Abilities of AI with synthetic experiments",
    venue: "Astro AI Lunch Seminar, Center for Astrophysics (Invited)",
    date: "January 27, 2025",
    year: 2025,
    description: "Exploring how AI systems develop fundamental capabilities through carefully designed synthetic experiments, with focus on in-context learning and compositional generalization.",
    type: "seminar",
    videoUrl: "https://www.youtube.com/watch?v=lIfwwUl_cJo",
    slidesUrl: "https://drive.google.com/file/d/1Zvi4LUU4KsLpKlK76kpjwYXFmsYOZTk4/view?usp=sharing",
    thumbnailUrl: "/images/talks/fundamental-ai-astroai.png",
    featured: true
  },
  {
    id: 9,
    title: "Towards a Neuroethology of AI: AI as a model system of intelligent phenomena",
    venue: "CBS-NTT Fellow Candidate Talk",
    date: "November 26, 2024",
    year: 2024,
    type: "seminar",
    videoUrl: "https://drive.google.com/file/d/1lkkj6LKhJ0ODj6W7lQbaP8UjBeYzYyKO/view?usp=sharing",
    slidesUrl: "https://drive.google.com/file/d/1zuDyKgU4hp_X0KlvkwX70XCyjo_FQRj2/view?usp=sharing",
    thumbnailUrl: "/images/talks/neuroethology-ai-cbs.png",
    featured: true
  },
  {
    id: 10,
    title: "Understanding Compositional Generalization with Synthetic Data",
    venue: "Stanford Institute for Theoretical Physics (Invited)",
    date: "November 13, 2024",
    year: 2024,
    type: "seminar",
    slidesUrl: "https://drive.google.com/file/d/1VMhRHQ5wy-nuhEdXK61ScXC5ZNkBuMQd/view?usp=sharing",
    thumbnailUrl: "/images/talks/compositional-stanford.png",
    featured: false
  },
  {
    id: 11,
    title: "Understanding Compositional Generalization with Synthetic Data",
    venue: "Insight+Interaction Lab, Harvard",
    date: "October 30, 2024",
    year: 2024,
    type: "seminar",
    slidesUrl: "https://drive.google.com/file/d/1VMhRHQ5wy-nuhEdXK61ScXC5ZNkBuMQd/view?usp=sharing",
    thumbnailUrl: "/images/talks/compositional-harvard.png",
    featured: false
  },
  {
    id: 12,
    title: "Scaling and In-Context Learning of Large Language Models",
    venue: "NTT Physics & Informatics Laboratory Journal Club",
    date: "July 25, 2024",
    year: 2024,
    type: "seminar",
    slidesUrl: "https://docs.google.com/presentation/d/e/2PACX-1vQQNXb_63lp1m8kLF6EAFHgmxvITZKwBJVwfN5vK06jKS_7eH6QCf-SnyjALM9EEMFfmH-FyQzdpDmJ/embed?start=false&loop=false",
    thumbnailUrl: "/images/talks/scaling-icl-ntt.png",
    featured: false,
    primaryContent: "slides"
  },
  {
    id: 13,
    title: "Probabilistic Completion of Astrophysical Fields for Robust Statistics with Diffusion Models",
    venue: "EAS 2024, Padova",
    date: "July 2, 2024",
    year: 2024,
    type: "conference",
    slidesUrl: "https://docs.google.com/presentation/d/e/2PACX-1vRUfQfKOq-3G34G3ZmJTfhQW6G9hTcIgnKgV8-jZQEioN_u8qUBWW9xZm9oRmZ3mRSKlAOK4s-etzLc/embed?start=false&loop=false",
    thumbnailUrl: "/images/talks/probabilistic-completion.png",
    featured: false,
    primaryContent: "slides"
  },
  {
    id: 14,
    title: "3D probabilistic reconstruction of the local dark matter from galaxies",
    venue: "Astro AI Workshop 2024, Center for Astrophysics",
    date: "June 20, 2024",
    year: 2024,
    type: "workshop",
    videoUrl: "https://www.youtube.com/watch?v=-hNFO2Mjgs0",
    slidesUrl: "https://docs.google.com/presentation/d/e/2PACX-1vQPzd749Bfz_cEIFpIpbogEW7T00jLS6S3KxIFT-Sw3lwyDJFnT6qxbt109B20-SAp54TU8b7QvIMSe/embed?start=false&loop=false",
    thumbnailUrl: "/images/talks/3d-probabilistic-recons.png",
    featured: false,
    primaryContent: "slides"
  },
  {
    id: 15,
    title: "Debiasing with Diffusion: Probabilistic reconstruction of Dark Matter fields from galaxies",
    venue: "ITC Lunch Talk, Center for Astrophysics",
    date: "March 7, 2024",
    year: 2024,
    description: "Probabilistic reconstruction of dark matter density fields from galaxy distributions using score-based diffusion models, trained on the CAMELS simulation suite.",
    type: "seminar",
    videoUrl: "https://youtu.be/kYs1ZQWqz5U?t=3393",
    slidesUrl: "https://docs.google.com/presentation/d/e/2PACX-1vQMK7Z3bi9n3MdOTRzVmRH8tKhO49g3sTKVn6kWeFQmDxl8MfgcXvQmIezWsPWf8vpBIxXPbAxkDGlU/embed?start=false&loop=false",
    thumbnailUrl: "/images/talks/debiasing-with-diffusion.png",
    featured: true,
    primaryContent: "slides"
  },
  {
    id: 16,
    title: "Reconstruction of the local dark matter using diffusion models",
    venue: "Workshop on AI-driven Discovery, Kavli IPMU",
    date: "January 23, 2024",
    year: 2024,
    type: "workshop",
    slidesUrl: "https://docs.google.com/presentation/d/e/2PACX-1vSnTUsIbDWwFGv80cxVuGTSxzI9-6_r8CqIYkoR_OuIzpnWDfngk7acY3znXZCnU1RwmtczmDEvSxTh/embed?start=false&loop=false",
    thumbnailUrl: "/images/talks/recons-local-kavli.png",
    featured: false,
    primaryContent: "slides"
  },
  {
    id: 17,
    title: "Diffusion Models for Cosmology",
    venue: "AstroAI Lunch Talk, Center for Astrophysics",
    date: "October 30, 2023",
    year: 2023,
    type: "seminar",
    slidesUrl: "https://docs.google.com/presentation/d/e/2PACX-1vSmOBToqbvFgln46P8Ucu6tnwUMDHti77bhJ_6h3ow8GXFOOKlXcxo6ADKnosqdnTfd2lj9W0xbO4Bj/embed?start=false&loop=false",
    thumbnailUrl: "/images/talks/diffusion-cosmology.png",
    featured: false,
    primaryContent: "slides"
  },
  {
    id: 18,
    title: "How is AI used in the Physical Sciences?",
    venue: "Hansung Science High School Mentoring Talk @ Harvard",
    date: "October 13, 2023",
    year: 2023,
    type: "lecture",
    slidesUrl: "https://docs.google.com/presentation/d/e/2PACX-1vQxmhLAlSBeMn6LzwYhd3EaAnb4hk7RcAf3-YPFv-x_9_D0ilKwUd0tQMt4m9VOwiwVPG-4tCK1R_hw/embed?start=false&loop=false",
    thumbnailUrl: "/images/talks/hshs-dl4sci.png",
    featured: false,
    primaryContent: "slides"
  },
  {
    id: 19,
    title: "Mstar2Mcdm using Diffusion Models",
    venue: "CAMELS Virtual Telecoms, Flatiron Institute",
    date: "September 20, 2023",
    year: 2023,
    description: "Generating Cold Dark Matter density fields conditioned on stellar mass fields using Denoising Diffusion Probabilistic Models.",
    type: "seminar",
    slidesUrl: "https://docs.google.com/presentation/d/e/2PACX-1vSXQszE4vyeHAOB4hyOWWJ4TZKbbhkDRx58CGPg95nXXF0fdMEEzFUL2VWrJP8taIKkIHUiUhr56R1b/embed?start=false&loop=false",
    thumbnailUrl: "/images/talks/mstar2mcdm.png",
    featured: false,
    primaryContent: "slides"
  },
  {
    id: 22,
    title: "Dark Matter Axion Search Experiment using 18T HTS Magnet",
    venue: "Stockholm International Youth Science Seminar (National Representative)",
    date: "2018",
    year: 2018,
    type: "conference",
    videoUrl: "https://youtu.be/v3iwzfYi_VU?si=N9j8tsecrkxzVLII",
    thumbnailUrl: "/images/talks/syiss.png",
    featured: false
  }
]