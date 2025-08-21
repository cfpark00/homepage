import Link from "next/link"

export default function SimplePage() {
  return (
    <>
      <p>
        <Link href="/">Okay sure, good academics can have good websites...</Link>
      </p>
      <img 
        src="/images/profile.jpg" 
        alt="Core Francisco Park"
        style={{ width: '120px', height: '160px', objectFit: 'cover', float: 'left', marginRight: '15px', marginBottom: '10px' }}
      />
      <h1>Core Francisco Park</h1>
      <p>Postdoctoral Fellow, Harvard University (May 2025 - Present)<br />
      Ph.D. in Physics, Harvard University (2025)<br />
      Thesis: Deep Learning as a Scientific Tool and a Model Organism of Intelligence</p>
      <div style={{ clear: 'both' }}></div>
      <hr />
      
      <h2>Contact</h2>
      <p>Email: corefranciscopark@g.harvard.edu</p>
      <p>Location: Cambridge, MA</p>
      
      <h2>Education</h2>
      <ul>
        <li>Ph.D. Physics, Harvard University, 2019-2025</li>
        <li>B.S. Physics, KAIST, 2015-2019, Summa Cum Laude, GPA: 4.08/4.3</li>
      </ul>
      
      <h2>Research Interests</h2>
      <ul>
        <li>Machine Learning: In-Context Learning, Compositional Generalization, Diffusion Models</li>
        <li>Astrophysics: Cosmology, Dark Matter Reconstruction, Bayesian Inference</li>
        <li>Neuroscience: Whole-Brain Imaging, Connectomics, Neural Tracking</li>
        <li>Mechanistic Understanding of AI Systems</li>
      </ul>
      
      <h2>Selected Publications</h2>
      <ol>
        <li>Park, C.F.* et al. (2025). "Decomposing Elements of Problem Solving: What 'Math' Does RL Teach?" preprint</li>
        <li>Park, C.F.*, Zhang, Z.*, Tanaka, H. (2025). "New News: System-2 Fine-tuning for Robust Integration of New Knowledge" preprint</li>
        <li>Park, C.F.*, Lubana, E.S.*, Tanaka, H. (2025). "Competition Dynamics Shape Algorithmic Phases of In-Context Learning" ICLR 2025 (Spotlight)</li>
        <li>Park, C.F.* et al. (2025). "ICLR: In-Context Learning of Representations" ICLR 2025</li>
        <li>Yang, Y.*, Park, C.F. et al. (2025). "Swing-by Dynamics in Concept Learning and Compositional Generalization" ICLR 2025</li>
        <li>Park, C.F.*, Okawa, M.* et al. (2024). "Emergence of Hidden Capabilities: Exploring Learning Dynamics in Concept Space" NeurIPS 2024 (Spotlight)</li>
        <li>Park, C.F.* et al. (2024). "Automated neuron tracking inside moving and deforming animals using deep learning" Nature Methods</li>
        <li>Meirovitch, Y.*, Park, C.F.* et al. (2025). "SmartEM: machine-learning guided electron microscopy" Nature Methods (accepted)</li>
        <li>Ono, V.*, Park, C.F. et al. (2024). "Debiasing with Diffusion: Probabilistic reconstruction of Dark Matter fields" Astrophysical Journal</li>
        <li>Park, C.F.* et al. (2023). "Quantification of high dimensional non-Gaussianities" Astrophysical Journal</li>
        <li>Susoy, V.* et al. (2021). "Natural sensory context drives diverse brain-wide activity during C. elegans mating" Cell</li>
      </ol>
      <p>(* denotes first author)</p>
      
      
      
      <h2>Links</h2>
      <p>
        <a href="https://scholar.google.com/citations?user=RfXjPuEAAAAJ">Google Scholar</a><br />
        <a href="https://github.com/cfpark00">GitHub</a><br />
        <a href="https://arxiv.org/search/?query=Core+Francisco+Park&searchtype=author">arXiv</a><br />
        <a href="/CFPark_CV.pdf" download>Download CV (PDF)</a>
      </p>
      
      <hr />
      <p>
        <Link href="/">Okay sure, good academics can have good websites...</Link>
      </p>
    </>
  )
}