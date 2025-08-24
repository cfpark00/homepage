"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card } from "@workspace/ui/components/card"
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
import type { Project } from '@/lib/projects'

interface ProjectCardsProps {
  projects: Project[]
}

export function ProjectCards({ projects }: ProjectCardsProps) {
  const router = useRouter()
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set())
  const [externalLinkModal, setExternalLinkModal] = useState<{ open: boolean; url: string; title: string }>({
    open: false,
    url: "",
    title: ""
  })

  const handleCardClick = (project: Project) => {
    if (project.isExternal && project.externalUrl) {
      setExternalLinkModal({
        open: true,
        url: project.externalUrl,
        title: project.title
      })
    } else if (!project.isExternal) {
      router.push(`/projects/${project.slug}`)
    }
  }

  const handleExternalNavigate = () => {
    window.open(externalLinkModal.url, "_blank", "noopener,noreferrer")
    setExternalLinkModal({ open: false, url: "", title: "" })
  }

  return (
    <>
      {/* Grid: 1 column on very small screens, 2 on mobile, 4 on tablets/desktop */}
      <div className="grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {projects.map((project) => (
          <Card 
            key={project.slug} 
            className="group overflow-hidden transition-all hover:shadow-xl cursor-pointer"
            onClick={() => handleCardClick(project)}
          >
            {/* Square Thumbnail */}
            <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50 relative">
              {project.thumbnailUrl && !failedImages.has(project.thumbnailUrl) ? (
                <Image
                  src={project.thumbnailUrl}
                  alt={project.title}
                  width={400}
                  height={400}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={() => {
                    setFailedImages(prev => new Set(prev).add(project.thumbnailUrl!))
                  }}
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
              
              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2">
                {project.excerpt}
              </p>
              
              {/* Date if exists */}
              {project.date && (
                <div className="text-[10px] text-muted-foreground/60">
                  <span>{new Date(project.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* External Link Modal */}
      <Dialog open={externalLinkModal.open} onOpenChange={(open) => {
        if (!open) setExternalLinkModal({ open: false, url: "", title: "" })
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>External Link</DialogTitle>
            <DialogDescription>
              You are about to leave this site and navigate to {externalLinkModal.title}. 
              This will open in a new tab.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setExternalLinkModal({ open: false, url: "", title: "" })}>
              Cancel
            </Button>
            <Button onClick={handleExternalNavigate}>
              Continue <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}