"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ExternalLink } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { Button } from "@workspace/ui/components/button"

type OngoingProject = {
  id: number
  title: string
  description: string
  collaborators: string[]
  startDate: string
  expectedCompletion?: string
  thumbnailUrl?: string
  thumbnailAlt?: string
  highlights?: string[]
  link?: string
  isExternal?: boolean
}

const ongoingProjects: OngoingProject[] = [
  {
    id: 1,
    title: "Orchestra: A Research Platform",
    description: "A platform to accelerate and track research using AI Agents.",
    collaborators: ["Independent Project", "Open Source Contributors"],
    startDate: "2024-04",
    expectedCompletion: "2025-08",
    thumbnailUrl: "/images/ongoing/orchestra/orchestra.png",
    thumbnailAlt: "Orchestra research platform logo",
    highlights: [
      "Live platform at app.orchestra-ai.org",
      "AI-powered research automation",
      "Collaborative knowledge synthesis"
    ],
    link: "https://app.orchestra-ai.org",
    isExternal: true
  },
  {
    id: 2,
    title: "Research Tracking System",
    description: "A system for tracking research questions, hypothesis, findings and decisions.",
    collaborators: ["Research Team"],
    startDate: "2024-06",
    expectedCompletion: "2025-04",
    thumbnailUrl: "/images/ongoing/research-tracking-system/research-tracking-system.png",
    thumbnailAlt: "Research tracking system interface",
    highlights: [
      "Real-time progress monitoring",
      "Experiment tracking and versioning",
      "Collaborative research management"
    ],
    link: "/research-tracking",
    isExternal: false
  },
  {
    id: 3,
    title: "Evolving Research",
    description: "Understanding how research and discovery itself has evolved using digital evolution.",
    collaborators: ["AI Research Lab", "Cognitive Science Department"],
    startDate: "2024-09",
    expectedCompletion: "2025-12",
    thumbnailUrl: "/images/ongoing/evolving-research/evolving-research.png",
    thumbnailAlt: "Evolving research framework visualization",
    highlights: [
      "Adaptive research methodologies",
      "Dynamic hypothesis generation",
      "Continuous learning integration"
    ],
    link: "/evolving-research",
    isExternal: false
  }
]

export default function OngoingPage() {
  const router = useRouter()
  const [externalLinkModal, setExternalLinkModal] = useState<{ open: boolean; url: string; title: string }>({
    open: false,
    url: "",
    title: ""
  })

  const handleCardClick = (project: OngoingProject) => {
    if (!project.link) return
    
    if (project.isExternal) {
      setExternalLinkModal({
        open: true,
        url: project.link,
        title: project.title
      })
    } else {
      router.push(project.link)
    }
  }

  const handleExternalNavigate = () => {
    window.open(externalLinkModal.url, "_blank", "noopener,noreferrer")
    setExternalLinkModal({ open: false, url: "", title: "" })
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Ongoing Stuff...</h1>
        </div>

        {/* Responsive grid layout - 1 card on mobile, 2 on tablet, 3 on desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ongoingProjects.map((project) => (
            <Card 
              key={project.id} 
              className="group overflow-hidden transition-all hover:shadow-xl cursor-pointer"
              onClick={() => handleCardClick(project)}
            >
              {/* Square Thumbnail */}
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                {project.thumbnailUrl ? (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.thumbnailAlt || project.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-4xl font-bold text-muted-foreground/20">
                      {project.title.substring(0, 3).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Content Section */}
              <div className="p-3 space-y-1">
                <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors inline-flex items-center gap-1.5">
                  {project.title}
                  {project.isExternal && <ExternalLink className="h-2.5 w-2.5" />}
                </h3>
                
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* External Link Confirmation Modal */}
        <Dialog open={externalLinkModal.open} onOpenChange={(open) => setExternalLinkModal({ ...externalLinkModal, open })}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Leaving Site</DialogTitle>
              <DialogDescription>
                You're about to navigate to an external site:
                <br />
                <span className="font-medium text-foreground mt-2 block">
                  {externalLinkModal.url}
                </span>
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setExternalLinkModal({ open: false, url: "", title: "" })}>
                Cancel
              </Button>
              <Button onClick={handleExternalNavigate} autoFocus>
                Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}