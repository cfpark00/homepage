import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { getTopPriorityPapers } from '@/lib/projects'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Activity, Clock, FileText, Star, ExternalLink } from 'lucide-react'

export default async function HomePage() {
  // Load top priority papers
  const topPapers = await getTopPriorityPapers(10)

  // Stats for dashboard - hardcoded for now since we don't have projects in this scope
  const stats = {
    totalProjects: 12,
    activeProjects: 8,
    totalItems: 17,
    lastActivity: '1 hour ago'
  }

  const recentActivity = [
    { id: 1, action: 'Added', item: 'Brain-Inspired Reweighting Paper', project: 'Origins of Representations', time: '1 hour ago', icon: FileText },
    { id: 2, action: 'Updated', item: 'Compositional Structures', project: 'Origins of Representations', time: '2 hours ago', icon: Activity },
    { id: 3, action: 'Created', item: 'Performance Metrics', project: 'Neural Scaling Laws', time: '5 hours ago', icon: FileText },
    { id: 4, action: 'Shared', item: 'Vision Transformer Features', project: 'Origins of Representations', time: '1 day ago', icon: Activity },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto h-full">
        <PageHeader title="Research Portal" />

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Active Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeProjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalItems}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Last Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.lastActivity}</div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Papers */}
        {topPapers.length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Priority Papers</CardTitle>
                  <CardDescription>Top {topPapers.length} papers by global priority</CardDescription>
                </div>
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {topPapers.map((paper, index) => (
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
                                {paper.projectSlug.split('-').map(word => 
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
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates across all projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-start gap-4">
                    <div className="mt-1 p-2 rounded-full bg-muted">
                      <Icon className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm">
                          <span className="font-medium">{activity.action}</span>{' '}
                          <span className="text-muted-foreground">{activity.item}</span>
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        in {activity.project}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

    </div>
  )
}