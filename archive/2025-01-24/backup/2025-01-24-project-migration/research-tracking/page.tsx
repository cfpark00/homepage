"use client"

import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { PageContainer } from "@workspace/ui/components/page-container"
import { ArrowLeft, Target, Brain, Users, Sparkles } from "lucide-react"
import { ResearchFlow } from "@/components/research-flow"
import { PublicationCard, type Publication } from "@/components/publication-card"

const markovICLPublication: Publication = {
  id: 3,
  title: "Competition Dynamics Shape Algorithmic Phases of In-Context Learning",
  authors: ["C.F. Park*", "E.S. Lubana*", "I. Pres", "H. Tanaka"],
  abstract: `In-Context Learning (ICL) has significantly expanded the general-purpose nature of large language models, allowing them to adapt to novel tasks using merely the inputted context. This has motivated a series of papers that analyze tractable synthetic domains and postulate precise mechanisms that may underlie ICL. However, the use of relatively distinct setups that often lack a sequence modeling nature to them makes it unclear how general the reported insights from such studies are. Motivated by this, we propose a synthetic sequence modeling task that involves learning to simulate a finite mixture of Markov chains. As we show, models trained on this task reproduce most well-known results on ICL, hence offering a unified setting for studying the concept. Building on this setup, we demonstrate we can explain a model's behavior by decomposing it into four broad algorithms that combine a fuzzy retrieval vs. inference approach with either unigram or bigram statistics of the context. These algorithms engage in a competition dynamics to dominate model behavior, with the precise experimental conditions dictating which algorithm ends up superseding others: e.g., we find merely varying context size or amount of training yields (at times sharp) transitions between which algorithm dictates the model behavior, revealing a mechanism that explains the transient nature of ICL. In this sense, we argue ICL is best thought of as a mixture of different algorithms, each with its own peculiarities, instead of a monolithic capability. This also implies that making general claims about ICL that hold universally across all settings may be infeasible.`,
  venue: "ICLR 2025 Spotlight",
  year: 2025,
  type: "conference",
  arxiv: "2412.01003",
  thumbnail: "/images/publications/markov-icl.png",
  significant: true,
}

export default function ResearchTrackingPage() {
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
          <h1 className="text-2xl font-bold mb-2">Research Tracking System</h1>
          <p className="text-sm text-muted-foreground">
            We are developing a system to track questions, experiments, hypotheses, findings, and decisions throughout the research process.
          </p>
        </div>

        {/* Vision Section - Compact */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Why This Matters</h2>
          <div className="space-y-2 text-sm">
            <div className="flex gap-3">
              <Target className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">For Researchers:</span> Systematically organize research processes, track decision paths, and maintain clear connections between ideas and outcomes.
              </div>
            </div>
            <div className="flex gap-3">
              <Users className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">For Science:</span> Reduce duplicated efforts, make research sharing more efficient, and enable better collaboration across teams and institutions.
              </div>
            </div>
            <div className="flex gap-3">
              <Sparkles className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-medium">For AI:</span> Help AI systems understand open-ended discovery processes and learn from human research patterns and decision-making.
              </div>
            </div>
          </div>
        </div>

        {/* Core Belief - Compact */}
        <div className="mb-8">
          <p className="text-sm font-medium mb-1">Open-ended discovery is a core aspect of research</p>
          <p className="text-sm text-muted-foreground">
            Yet there isn't much data to understand how humans organize their research process. 
            By tracking these chains of thought, we can better understand and enhance the creative process of scientific discovery.
          </p>
        </div>

        {/* Example Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold mb-2">Example: Markov ICL Research</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Below is a real research process tracking the development of understanding in-context learning through Markov chains, 
              showing how questions evolve into experiments, findings lead to pivots, and insights build upon each other.
            </p>
          </div>

          {/* Publication Reference */}
          <div className="mb-4">
            <PublicationCard publication={markovICLPublication} compact />
          </div>

          {/* Legend */}
          <div className="mb-4">
            <h3 className="text-xs font-medium mb-2 text-muted-foreground">Node Types</h3>
            <div className="flex flex-wrap gap-1.5 text-xs">
              <Badge variant="outline" className="text-purple-600 border-purple-500/50">Question</Badge>
              <Badge variant="outline" className="text-pink-600 border-pink-500/50">Hypothesis</Badge>
              <Badge variant="outline" className="text-blue-600 border-blue-500/50">Experiment</Badge>
              <Badge variant="outline" className="text-green-600 border-green-500/50">Observation</Badge>
              <Badge variant="outline" className="text-yellow-600 border-yellow-500/50">Thought</Badge>
              <Badge variant="outline" className="text-orange-600 border-orange-500/50">Work</Badge>
              <Badge variant="outline" className="text-red-600 border-red-500/50">Pivot</Badge>
              <Badge variant="outline" className="text-cyan-600 border-cyan-500/50">Idea</Badge>
              <Badge variant="outline" className="text-amber-600 border-amber-500/50">Finding</Badge>
              <Badge variant="outline" className="text-indigo-600 border-indigo-500/50">Literature Review</Badge>
              <Badge variant="outline" className="text-teal-600 border-teal-500/50">Analysis</Badge>
              <Badge variant="outline" className="text-rose-600 border-rose-500/50">Eureka</Badge>
            </div>
          </div>

          {/* Research Flow Visualization */}
          <ResearchFlow />
        </div>
    </PageContainer>
  )
}