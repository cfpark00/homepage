import { CalendarDays, ExternalLink } from "lucide-react"

type NewsItem = {
  id: number
  date: string
  content: string
  links?: { text: string; url: string }[]
}

const newsItems: NewsItem[] = [
  {
    id: 1,
    date: "2025-01-27",
    content: "I gave a talk on 'Understanding Fundamental Abilities of AI with synthetic experiments' at the Astro AI Lunch Seminar at Harvard Smithsonian Center for Astrophysics. Video.",
    links: [{ text: "Video", url: "https://www.youtube.com/watch?v=lIfwwUl_cJo" }],
  },
  {
    id: 2,
    date: "2024-12-10",
    content: "I will be presenting some of our works at NeurIPS 2024: (1) Our work on concept learning and hidden emergence of compositional capabilities will be presented as a spotlight poster! (2) Our work on algorithmic phases of in-context learning will be presented at the Workshop on Scientific Methods for Understanding Deep Learning. (3) Our work on how LLMs can reorganize their representations in a context dependent way will be presented at the Workshop on Symmetry and Geometry in Neural Representations.",
    links: [
      { text: "work", url: "https://arxiv.org/abs/2406.19370" },
      { text: "work", url: "https://arxiv.org/abs/2412.01003" },
      { text: "work", url: "https://drive.google.com/file/d/1DyiOSt1AfTlATqbm3sHjP3klGXrpcwrz/view?usp=sharing" },
      { text: "NeurIPS 2024", url: "https://neurips.cc/Conferences/2024" },
    ],
  },
  {
    id: 3,
    date: "2024-12-01",
    content: "Our paper 'Competition Dynamics Shape Algorithmic Phases of In-Context Learning' is on ArXiv!",
    links: [{ text: "ArXiv", url: "https://arxiv.org/abs/2412.01003" }],
  },
  {
    id: 4,
    date: "2024-10-10",
    content: "Our paper 'Dynamics of Concept Learning and Compositional Generalization' is on ArXiv!",
    links: [{ text: "ArXiv", url: "https://www.arxiv.org/abs/2410.08309" }],
  },
  {
    id: 5,
    date: "2024-09-27",
    content: "Our paper 'Emergence of Hidden Capabilities: Exploring Learning Dynamics in Concept Space' is accepted to NeurIPS 2024 as a Spotlight!",
    links: [{ text: "paper", url: "https://arxiv.org/abs/2406.19370" }],
  },
  {
    id: 6,
    date: "2024-07-03",
    content: "Tunadorable made a video about our paper: 'Emergence of Hidden Capabilities: Exploring Learning Dynamics in Concept Space'",
    links: [
      { text: "video", url: "https://www.youtube.com/watch?v=FoAGwdQUALM" },
      { text: "paper", url: "https://arxiv.org/abs/2406.19370" },
    ],
  },
  {
    id: 7,
    date: "2024-07-02",
    content: "I gave a talk about our project diff4stats at EAS 2024: 'Probabilistic Completion of Astrophysical Fields for Robust Statistics with Diffusion Models'",
    links: [
      { text: "EAS 2024", url: "https://eas.unige.ch/EAS2024/" },
      { text: "slides", url: "https://docs.google.com/presentation/d/1_NTqc1EtjpP3Uai-fFAEavG8rbuMhAwbelipWFt9Ch4/edit?usp=sharing" },
    ],
  },
  {
    id: 8,
    date: "2024-06-27",
    content: "Our paper 'Emergence of Hidden Capabilities: Exploring Learning Dynamics in Concept Space' from our project concept_learning is on arxiv.",
    links: [{ text: "arxiv", url: "https://arxiv.org/abs/2406.19370" }],
  },
  {
    id: 9,
    date: "2024-06-20",
    content: "I gave a talk about our project vdm4cdm_3d at the AstroAI Workshop 2024: '3D probabilistic reconstruction of the local dark matter from galaxies'",
    links: [
      { text: "AstroAI Workshop 2024", url: "https://astroai.cfa.harvard.edu/workshop/" },
      { text: "talk", url: "https://www.youtube.com/watch?v=-hNFO2Mjgs0" },
    ],
  },
  {
    id: 10,
    date: "2024-06-17",
    content: "A paper from our project vdm4cdm_3d has been accepted at ICML 2024 Workshop Ai4Science: '3D Reconstruction of Dark Matter Fields with Diffusion Models: Towards Application to Galaxy Surveys'",
    links: [
      { text: "paper", url: "https://openreview.net/forum?id=7k2Eh7OCoz" },
      { text: "ICML 2024 Workshop Ai4Science", url: "https://ai4sciencecommunity.github.io/icml24.html" },
    ],
  },
  {
    id: 11,
    date: "2024-06-16",
    content: "A paper from our project concept_learning has been accepted at ICML 2024 Workshop on High-dimensional Learning Dynamics: 'Hidden Learning Dynamics of Capability before Behavior in Diffusion Models'",
    links: [
      { text: "paper", url: "https://openreview.net/forum?id=OX4cY2yDcE" },
      { text: "ICML 2024 Workshop", url: "https://sites.google.com/view/hidimlearning/home" },
    ],
  },
  {
    id: 12,
    date: "2024-03-20",
    content: "Our follow up paper of our project vdm4cdm_2d is on arxiv.",
    links: [{ text: "arxiv", url: "https://arxiv.org/abs/2403.10648" }],
  },
  {
    id: 13,
    date: "2024-03-07",
    content: "I gave a talk about our project vdm4cdm_2d at the ITC Luncheon: 'Debiasing with Diffusion: Probabilistic reconstruction of Dark Matter field from galaxies'",
    links: [
      { text: "ITC", url: "https://itc.cfa.harvard.edu/" },
      { text: "talk", url: "https://youtu.be/kYs1ZQWqz5U?t=3393" },
    ],
  },
  {
    id: 14,
    date: "2024-01-23",
    content: "I gave a quick presentation of our project vdm4cdm_3d on using Diffusion Models to generate dark matter fields at the workshop 'AI-driven Discovery in Physics and Astrophysics' at Kavli IPMU.",
    links: [
      { text: "workshop", url: "https://cd3.ipmu.jp/ai4phys/" },
      { text: "Kavli IPMU", url: "https://www.ipmu.jp/" },
    ],
  },
  {
    id: 15,
    date: "2023-12-09",
    content: "I will be presenting two works at NeurIPS 2023 Workshops.",
    links: [{ text: "NeurIPS 2023", url: "https://neurips.cc/Conferences/2023" }],
  },
  {
    id: 16,
    date: "2023-12-05",
    content: "Our work tracking individual neurons in C.elegans using synthetically augmented data is published in Nature Methods.",
    links: [{ text: "Nature Methods", url: "https://www.nature.com/articles/s41592-023-02096-3" }],
  },
  {
    id: 17,
    date: "2023-11-06",
    content: "Our project SmartEM, on optimizing neural imaging with real time deep learning is on the MIT News.",
    links: [{ text: "MIT News", url: "https://news.mit.edu/2023/using-ai-optimize-rapid-neural-imaging-1106" }],
  },
  {
    id: 18,
    date: "2023-10-30",
    content: "I gave a talk about our project vdm4cdm_2d at the AstroAI lunch talk.",
    links: [{ text: "AstroAI", url: "https://astroai.cfa.harvard.edu/" }],
  },
  {
    id: 19,
    date: "2023-10-08",
    content: "The paper about our project SmartEM is on bioarxiv.",
    links: [{ text: "bioarxiv", url: "https://www.biorxiv.org/content/10.1101/2023.10.05.561103v1" }],
  },
  {
    id: 20,
    date: "2023-07-23",
    content: "I will be presenting our project SmartEM at the ICML 2023 Workshop on Computational Biology.",
    links: [
      { text: "ICML 2023", url: "https://icml.cc/Conferences/2023" },
      { text: "Workshop", url: "https://icml-compbio.github.io/" },
    ],
  },
  {
    id: 21,
    date: "2023-06-24",
    content: "I will present our project Whole Brain Imaging at the International C.elegans Conference 2023.",
    links: [{ text: "conference", url: "https://genetics-gsa.org/celegans2023" }],
  },
  {
    id: 22,
    date: "2023-05-25",
    content: "Our work on constructing a galactic dustmap with minimal impact on cosmology is published in the Astrophysical Journal.",
    links: [{ text: "Astrophysical Journal", url: "https://iopscience.iop.org/article/10.3847/1538-4357/acc32c" }],
  },
  {
    id: 23,
    date: "2023-04-05",
    content: "Our work on quantifying the effect of high-dimensional non-Gaussianity to statistical probes in cosmology is published in the Astrophysical Journal.",
    links: [{ text: "Astrophysical Journal", url: "https://iopscience.iop.org/article/10.3847/1538-4357/acbe3b" }],
  },
  {
    id: 24,
    date: "2023-03-09",
    content: "I will present our project targettrack at COSYNE 2023.",
    links: [{ text: "COSYNE 2023", url: "https://www.cosyne.org/past-conferences" }],
  },
  {
    id: 25,
    date: "2023-03-05",
    content: "I will present our project targettrack at APS March Meeting 2023.",
    links: [{ text: "APS March Meeting 2023", url: "https://www.aps.org/meetings/meeting.cfm?name=MAR23" }],
  },
  {
    id: 26,
    date: "2022-06-10",
    content: "I will be presenting our work at AAS240.",
    links: [
      { text: "work", url: "https://arxiv.org/abs/2204.05435" },
      { text: "AAS240", url: "https://aas.org/meetings/aas240" },
    ],
  },
  {
    id: 27,
    date: "2021-10-13",
    content: "Our work on quantitatively investigating latent spaces of Variational Autoencoders is on arxiv.",
    links: [{ text: "arxiv", url: "https://arxiv.org/abs/2110.06421" }],
  },
  {
    id: 28,
    date: "2021-09-30",
    content: "Our work on 3D imaging a nervous system in a naturalistic context is published in Cell. See the project Whole Brain Imaging.",
    links: [{ text: "Cell", url: "https://www.cell.com/cell/fulltext/S0092-8674(21)00998-3" }],
  },
  {
    id: 29,
    date: "2019-09-01",
    content: "I'm excited to start my Ph.D. program at Harvard Physics.",
    links: [{ text: "Harvard Physics", url: "https://www.physics.harvard.edu/" }],
  },
  {
    id: 30,
    date: "2025-06-01",
    content: "Joined Sigma-Xi, the scientific research honor society.",
    links: [{ text: "Sigma-Xi", url: "https://www.sigmaxi.org/" }],
  },
  {
    id: 32,
    date: "2025-01-01",
    content: "Research internship at NTT Research on Understanding Mechanisms and Capabilities of AI with Hidenori Tanaka.",
  },
  {
    id: 33,
    date: "2024-07-01",
    content: "Summer research internship at NTT Research working on Understanding Mechanisms and Capabilities of AI.",
  },
  {
    id: 34,
    date: "2023-11-01",
    content: "Won 2nd place at the Citadel Datathon competition.",
  },
  {
    id: 35,
    date: "2022-01-15",
    content: "Teaching Fellow for AP50: Physics as a Foundation for Science and Engineering with Dr. Eric Mazur at Harvard University.",
  },
  {
    id: 36,
    date: "2021-09-01",
    content: "Teaching Fellow for Physics 141: The Physics of Sensory Systems in Biology with Dr. Aravinthan Samuel at Harvard University.",
  },
  {
    id: 37,
    date: "2020-06-01",
    content: "Started as Research Assistant at Harvard University with Dr. Aravinthan Samuel, Dr. Douglas Finkbeiner, and Dr. Cecilia Garraffo.",
  },
  {
    id: 38,
    date: "2019-09-01",
    content: "Received the Purcell Fellowship from Harvard University for 2019-2020.",
  },
  {
    id: 39,
    date: "2019-09-01",
    content: "Awarded the Doctoral Study Abroad Scholarship from KFAS (Korea Foundation for Advanced Studies).",
  },
  {
    id: 40,
    date: "2019-06-01",
    content: "Graduated Summa Cum Laude from KAIST with B.S. in Physics (Advanced Major), GPA: 4.08/4.3.",
  },
  {
    id: 41,
    date: "2019-06-01",
    content: "Received Best Machine Learning Project Award from KIAS.",
  },
  {
    id: 42,
    date: "2019-01-15",
    content: "Teaching Assistant for Physics Lab I at Seoul National University.",
  },
  {
    id: 43,
    date: "2018-12-01",
    content: "Received Physics Department Honorary Scholarship from KAIST.",
  },
  {
    id: 44,
    date: "2018-12-01",
    content: "Received Best Project Award at Physics Winter Camp from KIAS.",
  },
  {
    id: 45,
    date: "2018-09-01",
    content: "General Physics Tutor for General Physics 2 at KAIST.",
  },
  {
    id: 46,
    date: "2018-03-01",
    content: "General Physics Tutor for General Physics 1 at KAIST.",
  },
  {
    id: 47,
    date: "2017-12-01",
    content: "Dean's List, KAIST Physics Department.",
  },
  {
    id: 48,
    date: "2017-09-01",
    content: "Exchange student at École Polytechnique in Palaiseau, France.",
  },
  {
    id: 49,
    date: "2017-09-01",
    content: "Awarded Undergraduate Student Scholarship from KFAS (2017-2019).",
  },
  {
    id: 50,
    date: "2017-03-01",
    content: "General Physics Tutor for General Physics 1 at KAIST.",
  },
  {
    id: 51,
    date: "2016-12-01",
    content: "Received Best Buddy Award from KAIST International Office.",
  },
  {
    id: 52,
    date: "2016-09-01",
    content: "General Physics Tutor for General Physics 2 at KAIST.",
  },
  {
    id: 53,
    date: "2016-03-01",
    content: "General Physics Tutor for General Physics 1 at KAIST.",
  },
  {
    id: 54,
    date: "2015-12-01",
    content: "Fall Dean's List at KAIST.",
  },
  {
    id: 55,
    date: "2015-06-01",
    content: "Spring Dean's List at KAIST.",
  },
  {
    id: 56,
    date: "2015-03-01",
    content: "Awarded Korea Presidential Science Scholarship from KOSAF (2015-2019).",
  },
  {
    id: 57,
    date: "2015-03-01",
    content: "Received Full Tuition Scholarship from KAIST (2015-2019).",
  },
  {
    id: 58,
    date: "2025-07-10",
    content: "Invited Tutorial Speaker at Astro AI Workshop 2025: 'Exploring Compositional Generalization of Neural Networks through Synthetic Experiments'.",
    links: [{ text: "Astro AI Workshop 2025", url: "https://astroai.cfa.harvard.edu/workshop/details.html" }],
  },
  {
    id: 59,
    date: "2025-07-10", 
    content: "Invited Speaker at Prague Synapse 2025: 'New News: System-2 Fine-tuning for Robust Integration of New Knowledge'. Slides.",
    links: [
      { text: "Prague Synapse 2025", url: "https://praguesynapse.cz/" },
      { text: "Slides", url: "https://drive.google.com/file/d/1OWApNJhRBivc9jkEZ2pMMFR96i3hz9SI/view?usp=sharing" }
    ],
  },
  {
    id: 60,
    date: "2025-06-13",
    content: "Talk at NVIDIA: 'Decomposing Elements of Problem Solving: What \"Math\" does RL Teach?' Slides.",
    links: [{ text: "Slides", url: "https://drive.google.com/file/d/190WhoZwEmyAy30hIm-moDxRdZjiL4vKp/view?usp=sharing" }],
  },
  {
    id: 61,
    date: "2025-05-13",
    content: "Seminar talk at KAIST Department of Physics: 'In-Context Learning: From toy models to practice.' Slides.",
    links: [{ text: "Slides", url: "https://drive.google.com/file/d/1Sp4D1b_4piMgJ9bWnlX6YJp7AnxBaoUG/view?usp=sharing" }],
  },
  {
    id: 62,
    date: "2025-05-01",
    content: "Seminar talk at University of Tokyo Department of Physics: 'In-Context Learning: Algorithms and Representations'. Slides.",
    links: [{ text: "Slides", url: "https://drive.google.com/file/d/1H84jXT2tTC4j4cf1nhVDPcrAUjMG18G3/view?usp=sharing" }],
  },
  {
    id: 63,
    date: "2025-04-21",
    content: "Ph.D. Defense: 'Deep Learning as a Scientific Tool and a Model Organism of Intelligence'. Slides, Thesis.",
    links: [
      { text: "Slides", url: "https://drive.google.com/file/d/1D_zToNK3TXGhazBjeNZYldYmgaywmckZ/view?usp=sharing" },
      { text: "Thesis", url: "https://drive.google.com/file/d/1ioXeY4p_a687NYnBPahItx6HeQcrSULq/view?usp=sharing" }
    ],
  },
  {
    id: 64,
    date: "2025-02-28",
    content: "Seminar talk at Marks and Sander Lab, Harvard Medical School: 'Fundamental Abilities and In-abilities of AI'. Slides.",
    links: [{ text: "Slides", url: "https://drive.google.com/file/d/1exGMlduMuPkbr6r26nI6aZXamnR2inlh/view?usp=sharing" }],
  },
  {
    id: 65,
    date: "2024-11-26",
    content: "CBS-NTT Fellow Candidate Talk: 'Towards a Neuroethology of AI: AI as a model system of intelligent phenomena'.",
    links: [
      { text: "Video", url: "https://drive.google.com/file/d/1lkkj6LKhJ0ODj6W7lQbaP8UjBeYzYyKO/view?usp=sharing" },
      { text: "Slides", url: "https://drive.google.com/file/d/1zuDyKgU4hp_X0KlvkwX70XCyjo_FQRj2/view?usp=sharing" }
    ],
  },
  {
    id: 66,
    date: "2024-11-13",
    content: "Talk at Stanford Institute for Theoretical Physics: 'Understanding Compositional Generalization with Synthetic Data'.",
    links: [
      { text: "SITP", url: "https://sitp.stanford.edu/" },
      { text: "Slides", url: "https://drive.google.com/file/d/1VMhRHQ5wy-nuhEdXK61ScXC5ZNkBuMQd/view?usp=sharing" }
    ],
  },
  {
    id: 67,
    date: "2024-11-13",
    content: "Talk at Insight+Interaction Lab at Harvard: 'Understanding Compositional Generalization with Synthetic Data'.",
    links: [
      { text: "Lab", url: "https://insight.seas.harvard.edu/" },
      { text: "Slides", url: "https://drive.google.com/file/d/1VMhRHQ5wy-nuhEdXK61ScXC5ZNkBuMQd/view?usp=sharing" }
    ],
  },
  {
    id: 68,
    date: "2024-08-01",
    content: "Poster at New England Mechanistic Interpretability Workshop 2024: 'Emergence of In-Context Learning Beyond Bayesian retrieval: A mechanistic study'.",
    links: [{ text: "Poster", url: "https://docs.google.com/presentation/d/1B2MV71WRGIDFtpVGNoBrGWkVaJ9FjTFsqzsE8hEd_Fo/edit?usp=sharing" }],
  },
  {
    id: 69,
    date: "2024-07-25",
    content: "NTT Physics & Informatics Laboratory Journal Club: 'Scaling and In-Context Learning of Large Language Models'.",
    links: [{ text: "Slides", url: "https://docs.google.com/presentation/d/1chVbiXn_LQukPf1NZW0klsURUFfXBaltaA5T3cn85-0/edit?usp=sharing" }],
  },
  {
    id: 70,
    date: "2023-09-20",
    content: "Camels Virtual Telecoms hosted by the Flatiron Institute: 'Mstar2Mcdm using Diffusion Models: Generating Cold Dark Matter density fields'.",
    links: [{ text: "Slides", url: "https://docs.google.com/presentation/d/1lFZa7PXMjPOX2M_UYiVIabLNN_njOZ1SqrHXsyN1628/edit?usp=sharing" }],
  },
  {
    id: 71,
    date: "2023-03-01",
    content: "American Physical Society March Meeting 2023: 'Automated neuron tracking using deep learning and targeted augmentation'.",
  },
  {
    id: 72,
    date: "2022-06-01",
    content: "American Astronomical Society 240: 'On the Gaussianity of Non-Gaussian probes of Large Scale Structure'.",
  },
  {
    id: 73,
    date: "2018-12-01",
    content: "Stockholm International Youth Science Seminar 2018: 'Dark Matter Axion Search Experiment using 18T HTS Magnet'.",
    links: [{ text: "Video", url: "https://youtu.be/v3iwzfYi_VU?si=N9j8tsecrkxzVLII" }],
  },
  {
    id: 74,
    date: "2018-10-01",
    content: "Korean Physical Society Meeting 2018 Poster: 'Data acquisition system for dark matter Axion search experiment using 18 T HTS magnet at CAPP/IBS'.",
  },
]

export default function NewsPage() {
  const renderContentWithLinks = (content: string, links?: { text: string; url: string }[]) => {
    if (!links || links.length === 0) return content

    let result = content
    links.forEach((link) => {
      const regex = new RegExp(`\\b${link.text}\\b`, "i")
      result = result.replace(
        regex,
        `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-link underline-offset-4 hover:underline">${link.text}</a>`
      )
    })
    return result
  }

  // Sort news items by date in descending order (newest first)
  const sortedNewsItems = [...newsItems].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">News & Updates</h1>
        </div>

        <div className="space-y-3">
          {sortedNewsItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 border-b pb-3 last:border-0"
            >
              <div className="flex items-start gap-1 text-sm text-muted-foreground pt-0.5 w-[120px] flex-shrink-0">
                <CalendarDays className="h-3.5 w-3.5 mt-0.5" />
                <span className="whitespace-nowrap">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div
                className="text-sm leading-relaxed flex-1"
                dangerouslySetInnerHTML={{
                  __html: renderContentWithLinks(item.content, item.links),
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}