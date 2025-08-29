import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { ExternalLink, Star } from 'lucide-react'
import type { ProjectItem } from '@/lib/projects'

interface StarredPapersProps {
  papers: ProjectItem[]
}

export function StarredPapers({ papers }: StarredPapersProps) {
  if (papers.length === 0) return null

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-500" />
          Starred Papers
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {papers.map((paper) => (
            <div key={paper.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
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
      </CardContent>
    </Card>
  )
}