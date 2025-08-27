"use client"

import { ArticleCard, type ArticleLink, type LinkSection } from "@workspace/ui/components/article-card"
import { FileText, Users, Code, NotebookText } from "lucide-react"
import React from "react"

export interface Publication {
  id: number
  title: string
  authors: string[]
  abstract?: string
  venue: string
  year: number
  month?: string
  type: "journal" | "conference" | "workshop" | "thesis" | "preprint" | "book"
  arxiv?: string
  doi?: string
  url?: string
  pdf?: string
  code?: string
  thumbnail?: string
  significant?: boolean
  related_pubs?: string[]
  related_projects?: { name: string; url: string }[]
}

const typeColors = {
  journal: "bg-blue-500",
  conference: "bg-green-500",
  workshop: "bg-purple-500",
  thesis: "bg-purple-500",
  preprint: "bg-amber-500",
  book: "bg-purple-500"
}

interface PublicationCardProps {
  publication: Publication
  selfName?: string
}

export function PublicationCard({ publication: pub, selfName = "C.F. Park" }: PublicationCardProps) {
  // Format authors with special highlighting
  const formattedAuthors = pub.authors.map((author, index) => {
    const isFirst = author.includes("*")
    const cleanAuthor = author.replace("*", "")
    const isMe = cleanAuthor === selfName
    
    return (
      <span key={index}>
        {index > 0 && ", "}
        {isFirst && isMe ? (
          <strong className="underline">{cleanAuthor}</strong>
        ) : isFirst ? (
          <strong>{cleanAuthor}</strong>
        ) : isMe ? (
          <span className="underline">{cleanAuthor}</span>
        ) : (
          cleanAuthor
        )}
      </span>
    )
  })

  // Prepare venue URL
  const venueUrl = pub.arxiv 
    ? `https://arxiv.org/abs/${pub.arxiv}` 
    : pub.doi 
    ? `https://doi.org/${pub.doi}` 
    : pub.url

  // Prepare additional links (PDF, Code)
  const links: ArticleLink[] = []
  if (pub.pdf) {
    links.push({
      label: "PDF",
      url: pub.pdf,
      icon: <FileText className="mr-2 h-4 w-4" />
    })
  }
  if (pub.code) {
    links.push({
      label: "Code",
      url: pub.code,
      icon: <Code className="mr-2 h-4 w-4" />
    })
  }

  // Prepare expanded content with abstract
  const expandedContent = pub.abstract ? (
    <div className="space-y-2">
      {pub.abstract.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
        <p key={idx} className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
          {paragraph.trim()}
        </p>
      ))}
      {pub.related_pubs && pub.related_pubs.length > 0 && (
        <div className="pt-2 border-t">
          <p className="text-xs text-muted-foreground font-medium mb-1">Other forms:</p>
          <ul className="text-xs text-muted-foreground space-y-1">
            {pub.related_pubs.map((relPub, idx) => (
              <li key={idx} className="break-words">• {relPub}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  ) : (
    // Default placeholder if no abstract
    <div className="space-y-2">
      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
      </p>
    </div>
  )

  const typeColor = typeColors[pub.type]
  const yearInfo = `${pub.month ? `${pub.month} ` : ''}${pub.year}`

  // Prepare link sections
  const linkSections: LinkSection[] = []
  
  if (pub.related_projects && pub.related_projects.length > 0) {
    linkSections.push({
      title: "Related Projects",
      links: pub.related_projects.map(project => ({
        label: project.name,
        url: project.url,
        icon: <NotebookText className="mr-2 h-4 w-4" />,
        external: false // Internal link
      }))
    })
  }

  return (
    <ArticleCard
      title={pub.title}
      authors={<span>{formattedAuthors}</span>}
      authorIcon={<Users className="h-4 w-4" />}
      thumbnail={pub.thumbnail}
      thumbnailFallback={<FileText className="w-8 h-8" />}
      venue={pub.venue}
      venueUrl={venueUrl}
      yearInfo={yearInfo}
      links={links}
      linkSections={linkSections}
      expandedContent={expandedContent}
      expandable={true}
      highlightColor={typeColor}
    />
  )
}