'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import type { ProjectItem } from '@/lib/projects'

interface PriorityPapersProps {
  papers: ProjectItem[]
}

export function PriorityPapers({ papers }: PriorityPapersProps) {
  const [showAll, setShowAll] = useState(false)
  const displayedPapers = showAll ? papers : papers.slice(0, 10)

  if (papers.length === 0) return null

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Priority Papers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {displayedPapers.map((paper) => (
            <div key={paper.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-semibold text-sm">
                {paper.priority}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{paper.name}</h4>
                    {paper.authors && paper.authors.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {paper.authors.length > 3 
                          ? `${paper.authors.slice(0, 3).join(', ')}, et al.`
                          : paper.authors.join(', ')}
                        {paper.publicationDate && ` • ${paper.publicationDate}`}
                      </p>
                    )}
                    {paper.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {paper.description}
                      </p>
                    )}
                    {paper.projectSlug && (
                      <Link href={`/${paper.projectSlug}`}>
                        <Badge variant="outline" className="mt-1.5 text-xs">
                          {paper.projectName || paper.projectSlug.split('-').map(word => 
                            word.charAt(0).toUpperCase() + word.slice(1)
                          ).join(' ')}
                        </Badge>
                      </Link>
                    )}
                  </div>
                  {paper.link && (
                    <a
                      href={paper.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 text-xs rounded-md bg-muted hover:bg-muted/80 transition-colors shrink-0"
                    >
                      Paper
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {papers.length > 10 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showAll ? (
              <>
                Show less
                <ChevronUp className="h-4 w-4" />
              </>
            ) : (
              <>
                Show {papers.length - 10} more
                <ChevronDown className="h-4 w-4" />
              </>
            )}
          </button>
        )}
      </CardContent>
    </Card>
  )
}