"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { BarChart3, LineChart, Map, Database, Brain, TrendingUp, ExternalLink, Github, Play } from "lucide-react"
import Link from "next/link"

type ResearchProject = {
  id: number
  title: string
  description: string
  category: "visualization" | "tool" | "dataset" | "model"
  technologies: string[]
  icon: any
  demoUrl?: string
  githubUrl?: string
  arxivUrl?: string
  status: "live" | "beta" | "development"
  featured?: boolean
}

const researchProjects: ResearchProject[] = [
  {
    id: 1,
    title: "In-Context Learning Dynamics Visualizer",
    description: "Interactive tool for visualizing how transformers learn representations in-context. Tracks competition dynamics between tokens and emergence of algorithmic phases during learning.",
    category: "visualization",
    technologies: ["Python", "Plotly", "Streamlit", "PyTorch"],
    icon: Brain,
    githubUrl: "https://github.com/cfpark00/in-context-learning",
    status: "live",
    featured: true,
  },
  {
    id: 2,
    title: "Dark Matter Field Reconstruction with Diffusion Models",
    description: "Probabilistic reconstruction of dark matter density fields from galaxy distributions using score-based diffusion models. Trained on CAMELS simulation suite.",
    category: "model",
    technologies: ["Python", "JAX", "Haiku", "Diffusion Models"],
    icon: Map,
    arxivUrl: "https://arxiv.org/abs/2403.14591",
    status: "live",
    featured: true,
  },
  {
    id: 3,
    title: "C. elegans Whole-Brain Tracker",
    description: "Deep learning system for automated tracking of all neurons in freely moving C. elegans. Enables unprecedented whole-brain calcium imaging during natural behavior.",
    category: "tool",
    technologies: ["Python", "PyTorch", "OpenCV", "CUDA"],
    icon: LineChart,
    githubUrl: "https://github.com/neuron-tracking/celegans-tracker",
    status: "live",
    featured: true,
  },
  {
    id: 4,
    title: "Cosmological Non-Gaussianity Quantifier",
    description: "Statistical framework for quantifying high-dimensional non-Gaussianities in cosmological fields and their implications for Fisher analysis.",
    category: "tool",
    technologies: ["Python", "NumPy", "SciPy", "Astropy"],
    icon: BarChart3,
    arxivUrl: "https://arxiv.org/abs/2206.01624",
    status: "live",
  },
  {
    id: 5,
    title: "Compositional Generalization Benchmark",
    description: "Synthetic benchmark suite for testing compositional generalization in neural networks. Includes datasets and evaluation metrics for concept learning dynamics.",
    category: "dataset",
    technologies: ["Python", "PyTorch", "NumPy"],
    icon: Database,
    githubUrl: "https://github.com/cfpark00/compositional-benchmark",
    status: "beta",
  },
  {
    id: 6,
    title: "Axion Dark Matter DAQ System",
    description: "Real-time data acquisition and analysis system for the CAPP-12TB axion haloscope experiment. Handles TB-scale data streams with microsecond precision.",
    category: "tool",
    technologies: ["LabVIEW", "C++", "FPGA", "Real-time Processing"],
    icon: TrendingUp,
    status: "live",
  },
  {
    id: 7,
    title: "Hyperspectral ML for Climate",
    description: "Machine learning pipeline for analyzing hyperspectral satellite data to track climate change indicators. Collaboration with environmental monitoring agencies.",
    category: "model",
    technologies: ["Python", "TensorFlow", "Rasterio", "XArray"],
    icon: Map,
    status: "development",
  },
  {
    id: 8,
    title: "3D Neuron Tracking for Confocal Microscopy",
    description: "Advanced tracking system for following neurons in 3D confocal microscopy data. Handles deformable tissue and maintains identity through complex movements.",
    category: "tool",
    technologies: ["Python", "scikit-image", "napari", "GPU acceleration"],
    icon: Brain,
    status: "beta",
  },
]

const categoryColors = {
  visualization: "bg-blue-500",
  tool: "bg-green-500",
  dataset: "bg-purple-500",
  model: "bg-orange-500",
}

const statusColors = {
  live: "default",
  beta: "secondary",
  development: "outline",
} as const

export default function ResearchPage() {
  const featuredResearch = researchProjects.filter(p => p.featured)
  const allResearch = researchProjects.filter(p => !p.featured)

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Research</h1>
        </div>

        {featuredResearch.length > 0 && (
          <>
            <h2 className="mb-4 text-2xl font-bold">Featured Research</h2>
            <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {featuredResearch.map((project) => {
                const Icon = project.icon
                return (
                  <Card key={project.id} className="relative overflow-hidden border-2">
                    <div className={`absolute inset-x-0 top-0 h-1 ${categoryColors[project.category]}`} />
                    <CardHeader>
                      <div className="mb-2">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <CardTitle>{project.title}</CardTitle>
                      <CardDescription className="line-clamp-3">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2">
                        {project.demoUrl && (
                          <Button size="sm" asChild>
                            <a
                              href={project.demoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Play className="mr-2 h-3 w-3" />
                              Demo
                            </a>
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Github className="mr-2 h-3 w-3" />
                              Code
                            </a>
                          </Button>
                        )}
                        {project.arxivUrl && (
                          <Button size="sm" variant="outline" asChild>
                            <a
                              href={project.arxivUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="mr-2 h-3 w-3" />
                              Paper
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </>
        )}

        {allResearch.length > 0 && (
          <>
            <h2 className="mb-4 text-2xl font-bold">All Research</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {allResearch.map((project) => {
                const Icon = project.icon
                return (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="flex">
                      <div className={`w-1 ${categoryColors[project.category]}`} />
                      <div className="flex-1">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="mb-2 flex items-center gap-2">
                                <Icon className="h-5 w-5 text-muted-foreground" />
                              </div>
                              <CardTitle className="text-lg">{project.title}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-3 text-sm text-muted-foreground">
                            {project.description}
                          </p>
                          <div className="flex gap-2">
                            {project.demoUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a
                                  href={project.demoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="mr-2 h-3 w-3" />
                                  Demo
                                </a>
                              </Button>
                            )}
                            {project.githubUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <Github className="mr-2 h-3 w-3" />
                                  Code
                                </a>
                              </Button>
                            )}
                            {project.arxivUrl && (
                              <Button size="sm" variant="outline" asChild>
                                <a
                                  href={project.arxivUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="mr-2 h-3 w-3" />
                                  Paper
                                </a>
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          </>
        )}

      </div>
    </div>
  )
}