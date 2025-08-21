"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs"
import { Download, GraduationCap, Briefcase, Award, BookOpen, List, Clock } from "lucide-react"
import { TimelineView } from "@/components/cv-timeline"
import { TraditionalView } from "@/components/cv-traditional"

export type CVData = {
  education: Array<{
    degree: string
    institution: string
    period: string
    description: string
    advisor?: string
    gpa?: string
    thesis?: string
  }>
  experience: Array<{
    position: string
    institution: string
    period: string
    responsibilities: string[]
  }>
  awards: Array<{
    name: string
    year: string
  }>
  skills: Record<string, string[]>
  researchInterests: string[]
}

const cvData: CVData = {
  education: [
    {
      degree: "Ph.D. in Physics",
      institution: "Harvard University",
      period: "2019 - 2025",
      description: "Machine Learning for Physical Sciences",
      advisor: "Advisors: Aravinthan Samuel, Douglas Finkbeiner, Hidenori Tanaka, Michael Brenner",
      gpa: "GPA: 3.945/4.0",
      thesis: "Thesis: Deep Learning as a Scientific Tool and a Model Organism of Intelligence",
    },
    {
      degree: "Graduate Coursework in Physics",
      institution: "Seoul National University",
      period: "2019",
      description: "Advanced physics coursework",
    },
    {
      degree: "Exchange Student",
      institution: "Ecole Polytechnique, France",
      period: "2017",
      description: "Physics and Computer Science",
    },
    {
      degree: "B.S. in Physics, Advanced Major",
      institution: "KAIST",
      period: "2015 - 2019",
      description: "Summa Cum Laude, Focus: Computational Physics",
      gpa: "GPA: 4.08/4.3",
      thesis: "Thesis: Real time DAQ setup and dead-time measurement for CAPP 18T Dark Matter Axion search",
    },
  ],
  experience: [
    {
      position: "Postdoctoral Fellow",
      institution: "Harvard University",
      period: "May 2025 - Present",
      responsibilities: [
        "Working with Dr. Venkatesh Murthy and Dr. Hidenori Tanaka",
        "Research on AI and neuroscience",
      ],
    },
    {
      position: "Research Intern",
      institution: "NTT Research",
      period: "Jan 2025, Jul 2024 - Sep 2024",
      responsibilities: [
        "Understanding Mechanisms and Capabilities of AI",
        "Supervisor: Hidenori Tanaka",
        "Developing synthetic experiments for AI understanding",
      ],
    },
    {
      position: "Research Assistant",
      institution: "Harvard University",
      period: "Jun 2020 - May 2025",
      responsibilities: [
        "Leading research on compositional generalization and in-context learning",
        "Developing ML tools for astrophysics and neuroscience applications",
        "Publishing in top-tier venues (NeurIPS, Nature Methods, ApJ)",
        "Supervisors: Dr. Aravinthan Samuel, Dr. Douglas Finkbeiner, Dr. Cecilia Garraffo",
      ],
    },
    {
      position: "Teaching Assistant",
      institution: "Harvard University",
      period: "2021 - 2022",
      responsibilities: [
        "Applied Physics 50: Physics as Foundation for Science & Engineering (Spring 2022)",
        "Physics 141: The Physics of Sensory Systems in Biology (Fall 2021)",
        "Mentoring undergraduate and graduate students",
      ],
    },
  ],
  awards: [
    { name: "2nd Place - Citadel Datathon", year: "2023" },
    { name: "Best Machine Learning Project Award - KIAS", year: "2019" },
    { name: "Purcell Fellowship - Harvard", year: "2019-2020" },
    { name: "Summa Cum Laude - KAIST", year: "2019" },
    { name: "Best Project Award Physics Winter Camp - KIAS", year: "2018" },
    { name: "Dean's List - KAIST Physics", year: "2017" },
    { name: "Korea Presidential Science Scholarship", year: "2015-2019" },
    { name: "Dean's List - KAIST (Fall & Spring)", year: "2015" },
  ],
  skills: {
    "ML/AI Research": ["Large Language Models", "Reinforcement Learning", "In-Context Learning", "Compositional Generalization"],
    "Programming": ["Python", "JavaScript", "Java", "C++", "SQL", "MATLAB", "Julia"],
    "Computational": ["Real-time DAQ", "High Performance Computing", "GPU Computing", "Cache Optimization"],
    "Data Analysis": ["Fourier Analysis", "Time Series Filtering", "Bayesian Inference"],
    "DevOps": ["Full Product Building", "Frontend/Backend", "VM", "Kubernetes"],
    "Experimental": ["Hardware Control", "Experiment Automation", "PID Control", "Lab Optics"],
    "Languages": ["Korean (Native)", "English (Native)", "French (Semi-Native - TCF C1/C2)", "Spanish (Novice)"],
  },
  researchInterests: [
    "Machine Learning: Deep Learning, Probabilistic Models, Uncertainty Quantification",
    "Astrophysics: Cosmology, Image Space Statistics, Bayesian Inference, Fourier Analysis",
    "Neuroscience: Whole-Brain Imaging, Connectomics, Practical Machine Learning",
    "Mechanistic Understanding of ML: Compositional Generalization, Diffusion Models, In-Context Learning"
  ]
}

export default function CVPage() {
  const [view, setView] = useState<"traditional" | "timeline">("traditional")

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex items-center gap-6">
          <div className="flex-1">
            <h1 className="mb-2 text-4xl font-bold">Core Francisco Park</h1>
            <p className="text-lg text-muted-foreground">
              Ph.D. in Physics, Harvard University
            </p>
          </div>
          <img 
            src="/images/profile-square.jpg" 
            alt="Core Francisco Park"
            className="h-32 w-32 rounded-lg object-cover shadow-lg flex-shrink-0"
          />
        </div>

        <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Tabs value={view} onValueChange={(v) => setView(v as "traditional" | "timeline")} className="w-auto">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="traditional" className="flex items-center gap-2">
                <List className="h-4 w-4" />
                Traditional View
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Timeline View
              </TabsTrigger>
            </TabsList>
          </Tabs>
          <Button asChild>
            <a href="/CFPark_CV.pdf" download>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </a>
          </Button>
        </div>

        {view === "traditional" ? (
          <TraditionalView data={cvData} />
        ) : (
          <TimelineView data={cvData} />
        )}
      </div>
    </div>
  )
}