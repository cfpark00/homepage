"use client"

import * as React from "react"
import { Card } from "./card"
import { Button } from "./button"
import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react"
import { cn } from "../lib/utils"

export interface PublicationCardProps {
  id: string
  title: string
  authors?: string[]
  description?: string // This will be the one-line TLDR
  lastModified: string
  publicationDate?: string // e.g., "May 2025"
  link?: string
  abstract?: string
  relevanceToProject?: string
  myTake?: string
  aiTake?: string
  myComments?: string
  type?: string
  tags?: string[]
}

export function PublicationCard(props: PublicationCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  
  const {
    title,
    authors = [],
    description, // One-line TLDR
    lastModified,
    publicationDate,
    link,
    abstract,
    relevanceToProject,
    myTake = props.myComments, // Use myComments as fallback for myTake
    aiTake,
    type = "paper",
    tags = []
  } = props
  
  // Add "General" tag if no tags provided
  const displayTags = tags.length > 0 ? tags : ["General"]
  
  const hasExpandableContent = abstract || relevanceToProject || myTake || aiTake
  
  return (
    <Card className="overflow-hidden">
      <div className="flex">
        {/* Color accent strip */}
        <div className="w-1 bg-amber-500" />
        
        <div className="flex-1">
          {/* Main header - always visible */}
          <div 
            className={cn(
              "px-4 py-3",
              hasExpandableContent && "cursor-pointer hover:bg-muted/30 transition-colors"
            )}
            onClick={hasExpandableContent ? () => setIsExpanded(!isExpanded) : undefined}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Title */}
                <h3 className="font-semibold text-sm leading-tight mb-1">
                  {title}
                </h3>
                
                {/* Authors and Date - Hide for document type */}
                {type !== 'document' && (authors.length > 0 || publicationDate) && (
                  <p className="text-xs text-muted-foreground mb-1">
                    {authors.length > 0 && (
                      authors.length > 4 
                        ? `${authors.slice(0, 4).join(', ')}, et al.`
                        : authors.join(', ')
                    )}
                    {authors.length > 0 && publicationDate && ' • '}
                    {publicationDate && <span className="font-medium">{publicationDate}</span>}
                  </p>
                )}
                
                {/* One-line TLDR and/or Document label */}
                {type === 'document' && (
                  <p className="text-xs text-muted-foreground font-medium">
                    Document
                  </p>
                )}
                {description && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    {description}
                  </p>
                )}
                
                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-1">
                  {displayTags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* Right side: Links and expand button */}
              <div className="flex items-start gap-2 flex-shrink-0">
                {/* Paper link */}
                {link && (
                  <a
                    href={link.includes('arxiv.org') ? link : link.includes('arxiv.org/abs/') ? `https://arxiv.org/abs/${link}` : link.match(/^\d{4}\.\d{4,5}$/) ? `https://arxiv.org/abs/${link}` : link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-muted hover:bg-muted/80 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {link.includes('arxiv') || link.match(/^\d{4}\.\d{4,5}$/) ? 'arXiv' : 'Link'}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                
                {/* Expand button */}
                {hasExpandableContent && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 w-7 p-0"
                    onClick={(e) => {
                      e.stopPropagation()
                      setIsExpanded(!isExpanded)
                    }}
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          {/* Expandable content */}
          {isExpanded && hasExpandableContent && (
            <div className="border-t bg-muted/10">
              <div className="p-4 space-y-3">
                {abstract && (
                  <ExpandableSection title="Abstract" defaultOpen={false}>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {abstract}
                    </p>
                  </ExpandableSection>
                )}
                
                {relevanceToProject && (
                  <ExpandableSection title="Relevance to Project" defaultOpen={false}>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {relevanceToProject}
                    </p>
                  </ExpandableSection>
                )}
                
                {myTake && (
                  <ExpandableSection title="My Take" defaultOpen={false}>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {myTake}
                    </p>
                  </ExpandableSection>
                )}
                
                {aiTake && (
                  <ExpandableSection title="AI's Take" defaultOpen={false}>
                    <p className="text-xs text-muted-foreground whitespace-pre-wrap">
                      {aiTake}
                    </p>
                  </ExpandableSection>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}

interface ExpandableSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

function ExpandableSection({ title, children, defaultOpen = false }: ExpandableSectionProps) {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  
  return (
    <div className="rounded-md border bg-background">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-muted/30 transition-colors"
      >
        <span className="text-xs font-medium">{title}</span>
        {isOpen ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        )}
      </button>
      {isOpen && (
        <div className="px-3 pb-3 pt-1">
          {children}
        </div>
      )}
    </div>
  )
}