"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { PageContainer } from "@workspace/ui/components/page-container"
import { ArrowLeft, Dna, Globe, Cpu, Zap } from "lucide-react"

export default function EvolvingResearchPage() {
  const router = useRouter()

  return (
    <PageContainer>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => router.back()}
          className="mb-6 -ml-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Evolving Research</h1>
          <p className="text-sm text-muted-foreground">
            Understanding how research and discovery itself has evolved using digital evolution.
          </p>
          <Badge className="mt-2" variant="secondary">Planning Phase</Badge>
        </div>

        {/* Vision Section - Compact */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Planned Research Focus</h2>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <Dna className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Digital Evolution:</span> Exploring how evolutionary algorithms and artificial life systems can model the development of research methodologies and discovery processes.
              </div>
            </div>
            <div className="flex gap-3">
              <Globe className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Cross-Domain Learning:</span> Understanding how research practices evolve across different scientific domains and how insights transfer between fields.
              </div>
            </div>
            <div className="flex gap-3">
              <Cpu className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Computational Discovery:</span> Investigating how AI and computational methods are changing the nature of scientific discovery and hypothesis generation.
              </div>
            </div>
            <div className="flex gap-3">
              <Zap className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">Emergent Patterns:</span> Identifying patterns in how breakthrough discoveries emerge from iterative research processes and collaborative networks.
              </div>
            </div>
          </div>
        </div>

        {/* Core Belief - Compact */}
        <div className="mb-8">
          <p className="text-sm font-medium mb-1">Research methodologies are not static but evolve like living systems</p>
          <p className="text-sm text-muted-foreground">
            By applying evolutionary principles to understand how research practices develop, adapt, and spread, 
            we can accelerate scientific progress and create more effective discovery frameworks for both humans and AI systems.
          </p>
        </div>

        {/* Planned Work */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-3">Planned Investigations</h2>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium">Evolutionary Fitness of Research Strategies</p>
              <p className="text-xs text-muted-foreground">
                Modeling different research approaches as competing strategies in an evolutionary landscape, 
                measuring their success rates, resource efficiency, and ability to produce novel insights.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Digital Organisms for Hypothesis Generation</p>
              <p className="text-xs text-muted-foreground">
                Creating digital organisms that evolve to generate and test hypotheses, 
                studying how complexity and insight emerge from simple evolutionary rules.
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium">Meta-Research Evolution</p>
              <p className="text-xs text-muted-foreground">
                Tracking how research about research itself has evolved over time, 
                identifying key transitions in how we understand and optimize the discovery process.
              </p>
            </div>
          </div>
        </div>

        {/* Key Questions */}
        <div className="mt-6 space-y-3">
          <h2 className="text-lg font-semibold">Open Questions</h2>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>How do successful research strategies spread and mutate across scientific communities?</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>Can we identify universal patterns in how breakthrough discoveries emerge?</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>What role does diversity of approaches play in accelerating collective discovery?</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground">•</span>
              <span>How can AI systems develop their own evolving research methodologies?</span>
            </div>
          </div>
        </div>

        {/* Suggested Reading */}
        <div className="mt-6 space-y-3">
          <h2 className="text-lg font-semibold">Suggested Reading</h2>
          <div className="space-y-3">
            <Card className="p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">The Surprising Creativity of Digital Evolution</p>
                <p className="text-xs text-muted-foreground">
                  A crowd-sourced collection of first-hand accounts that reveal how digital evolutionary algorithms can produce unexpected and creative adaptations that often surprise researchers.
                </p>
                <a href="https://arxiv.org/abs/1803.03453" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                  arxiv.org/abs/1803.03453
                </a>
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Evolving Neural Networks through Augmenting Topologies (NEAT)</p>
                <p className="text-xs text-muted-foreground">
                  Presents the NEAT method, which demonstrates how neural network topologies can be evolved alongside weights, offering a more efficient approach to neuroevolution through speciation and incremental complexity growth.
                </p>
                <a href="https://ieeexplore.ieee.org/document/6790655" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                  ieeexplore.ieee.org/document/6790655
                </a>
              </div>
            </Card>
            
            <Card className="p-3">
              <div className="space-y-1">
                <p className="text-sm font-medium">Evolution Strategies as a Scalable Alternative to Reinforcement Learning</p>
                <p className="text-xs text-muted-foreground">
                  Explores using Evolution Strategies (ES) as a flexible optimization technique for machine learning tasks, demonstrating its ability to efficiently solve complex problems with parallel computing.
                </p>
                <a href="https://arxiv.org/abs/1703.03864" target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline">
                  arxiv.org/abs/1703.03864
                </a>
              </div>
            </Card>
          </div>
        </div>
    </PageContainer>
  )
}