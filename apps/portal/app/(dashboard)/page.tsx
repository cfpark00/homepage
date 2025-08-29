import Link from 'next/link'
import { PageHeader } from '@/components/page-header'
import { getTopPriorityPapers, getProjectStats, getStarredPapers } from '@/lib/projects'
import { PriorityPapers } from '@/components/priority-papers'
import { StarredPapers } from '@/components/starred-papers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Activity, Clock, FileText, ExternalLink } from 'lucide-react'

export default async function HomePage() {
  // Load all priority papers (up to 100)
  const topPapers = await getTopPriorityPapers(100)
  
  // Load starred papers
  const starredPapers = await getStarredPapers()
  
  // Get real project stats
  const projectStats = await getProjectStats()

  // Stats for dashboard
  const stats = {
    totalProjects: projectStats.totalProjects,
    focusProjects: projectStats.focusProjects,
    totalLiteratureItems: projectStats.totalLiteratureItems
  }

  return (
    <div className="p-8 max-w-7xl mx-auto overflow-y-auto h-full">
        <PageHeader title="Research Portal" />

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
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
                Focus Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.focusProjects}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Literature Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLiteratureItems}</div>
            </CardContent>
          </Card>
        </div>

        {/* Priority Papers */}
        <PriorityPapers papers={topPapers} />

        {/* Starred Papers */}
        <StarredPapers papers={starredPapers} />

    </div>
  )
}