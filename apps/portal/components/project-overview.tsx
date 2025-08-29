"use client"

import { useState } from 'react'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@workspace/ui/components/collapsible'
import { Progress } from '@workspace/ui/components/progress'
import { SimpleMarkdown } from './simple-markdown'
import { 
  ChevronDown,
  ChevronRight,
  Target,
  FlaskConical,
  Server,
  FileText,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface Milestone {
  id: string
  title: string
  description: string
  targetDate: string
  status: 'completed' | 'in-progress' | 'pending'
  progress?: number
}

interface Experiment {
  id: string
  name: string
  description: string
  status: 'planned' | 'running' | 'completed' | 'failed'
  estimatedDuration?: string
  results?: string
}

interface Resource {
  type: 'compute' | 'data' | 'personnel' | 'other'
  description: string
  quantity?: string
  status?: 'available' | 'requested' | 'allocated'
}

interface ProjectOverviewProps {
  overview: {
    proposalFigure?: string
    proposalAbstract: string
    milestones: Milestone[]
    coreExperiments: Experiment[]
    expectedResources: Resource[]
    detailedProposal: {
      backgroundMotivation: string
      relatedResearch: string
      researchRoadmap: string
      expectedResults: string
      broaderImpact: string
      potentialObjections: string
    }
  }
}

const statusColors = {
  completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'in-progress': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  pending: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  planned: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
  running: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
}

const statusIcons = {
  completed: CheckCircle2,
  'in-progress': Clock,
  pending: AlertCircle,
  planned: AlertCircle,
  running: Clock,
  failed: AlertCircle
}

const resourceTypeIcons = {
  compute: Server,
  data: FileText,
  personnel: Target,
  other: FileText
}

export function ProjectOverview({ overview }: ProjectOverviewProps) {
  const [isDetailedProposalOpen, setIsDetailedProposalOpen] = useState(false)
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  // Check if overview has any actual content
  const hasContent = overview.proposalAbstract || 
                     overview.milestones?.length > 0 || 
                     overview.coreExperiments?.length > 0 || 
                     overview.expectedResources?.length > 0 ||
                     overview.detailedProposal

  if (!hasContent) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No overview content available yet.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {/* Proposal Abstract */}
      {overview.proposalAbstract && (
        <Card>
          <CardHeader className="p-4 pb-3">
            <CardTitle className="text-lg">Proposal Abstract</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-4">
            {overview.proposalFigure && (
              <div className="flex justify-center">
                <img
                  src={overview.proposalFigure}
                  alt="Project proposal overview"
                  className="rounded-lg w-full max-w-md h-auto"
                />
              </div>
            )}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {overview.proposalAbstract}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Detailed Proposal (Collapsible) */}
      {overview.detailedProposal && (
        <Collapsible open={isDetailedProposalOpen} onOpenChange={setIsDetailedProposalOpen}>
          <Card>
          <CardHeader className="p-4 pb-3">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-between p-0 h-auto hover:bg-transparent">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="h-5 w-5" />
                  Detailed Proposal
                </CardTitle>
                {isDetailedProposalOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="p-4 pt-0 space-y-4">
              {/* Background & Motivation */}
              {overview.detailedProposal?.backgroundMotivation && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm flex items-center gap-2">
                    Background & Motivation
                  </h4>
                  <SimpleMarkdown content={overview.detailedProposal.backgroundMotivation} />
                </div>
              )}

              {/* Related Research */}
              {overview.detailedProposal?.relatedResearch && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Related Research</h4>
                  <SimpleMarkdown content={overview.detailedProposal.relatedResearch} />
                </div>
              )}

              {/* Research Roadmap */}
              {overview.detailedProposal?.researchRoadmap && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Research Roadmap</h4>
                  <SimpleMarkdown content={overview.detailedProposal.researchRoadmap} />
                </div>
              )}

              {/* Expected Results */}
              {overview.detailedProposal?.expectedResults && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Expected Results</h4>
                  <SimpleMarkdown content={overview.detailedProposal.expectedResults} />
                </div>
              )}

              {/* Broader Impact */}
              {overview.detailedProposal?.broaderImpact && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Broader Impact</h4>
                  <SimpleMarkdown content={overview.detailedProposal.broaderImpact} />
                </div>
              )}

              {/* Potential Objections and Responses */}
              {overview.detailedProposal?.potentialObjections && (
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Potential Objections and Responses</h4>
                  <SimpleMarkdown content={overview.detailedProposal.potentialObjections} />
                </div>
              )}
            </CardContent>
          </CollapsibleContent>
        </Card>
        </Collapsible>
      )}

      {/* Milestones */}
      {overview.milestones && overview.milestones.length > 0 && (
        <Card>
          <CardHeader className="p-4 pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              Milestones
            </CardTitle>
            <CardDescription>Key project milestones and deliverables</CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0 space-y-3">
            {overview.milestones.map((milestone) => {
            const Icon = milestone.status === 'completed' ? CheckCircle2 : Circle
            return (
              <div key={milestone.id} className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon className={`h-4 w-4 ${
                    milestone.status === 'completed' ? 'text-muted-foreground' : 'text-muted-foreground/60'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{milestone.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{milestone.description}</p>
                </div>
              </div>
            )
            })}
          </CardContent>
        </Card>
      )}

      {/* Core Experiments */}
      {overview.coreExperiments && overview.coreExperiments.length > 0 && (
        <Card>
        <CardHeader className="p-4 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FlaskConical className="h-5 w-5" />
            Core Experiments
          </CardTitle>
          <CardDescription>Primary experiments driving the research</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-2">
          {overview.coreExperiments.map((experiment) => {
            const Icon = experiment.status === 'completed' ? CheckCircle2 : Circle
            return (
              <div key={experiment.id} className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon className={`h-4 w-4 ${
                    experiment.status === 'completed' ? 'text-muted-foreground' : 'text-muted-foreground/60'
                  }`} />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{experiment.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{experiment.description}</p>
                  {experiment.results && experiment.status === 'completed' && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Results: {experiment.results}
                    </p>
                  )}
                </div>
              </div>
            )
            })}
          </CardContent>
        </Card>
      )}

      {/* Expected Resources */}
      {overview.expectedResources && overview.expectedResources.length > 0 && (
        <Card>
        <CardHeader className="p-4 pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Server className="h-5 w-5" />
            Expected Resources
          </CardTitle>
          <CardDescription>Resources required for project completion</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          {overview.expectedResources.map((resource, idx) => {
            const Icon = resource.status === 'allocated' || resource.status === 'available' ? CheckCircle2 : Circle
            return (
              <div key={idx} className="flex items-start gap-3">
                <div className="mt-0.5">
                  <Icon className={`h-4 w-4 ${
                    resource.status === 'allocated' || resource.status === 'available' ? 'text-muted-foreground' : 'text-muted-foreground/60'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {resource.description}
                    {resource.quantity && (
                      <span className="text-xs text-muted-foreground ml-2">({resource.quantity})</span>
                    )}
                  </p>
                </div>
              </div>
            )
            })}
          </CardContent>
        </Card>
      )}
    </div>
  )
}