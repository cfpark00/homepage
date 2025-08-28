import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PortalLayoutSimple } from '@/components/portal-layout-simple'
import { PageHeader } from '@/components/page-header'
import { getAllProjects } from '@/lib/projects'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Activity, Clock, FileText } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not authenticated, redirect to login
  if (!user) {
    redirect('/auth/login')
  }
  
  // Load all projects
  const projects = await getAllProjects()

  // Stats for dashboard
  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    totalItems: 17,
    lastActivity: '1 hour ago'
  }

  const recentActivity = [
    { id: 1, action: 'Added', item: 'Brain-Inspired Reweighting Paper', project: 'Origins of Representations', time: '1 hour ago', icon: FileText },
    { id: 2, action: 'Updated', item: 'Compositional Structures', project: 'Origins of Representations', time: '2 hours ago', icon: Activity },
    { id: 3, action: 'Created', item: 'Performance Metrics', project: 'Neural Scaling Laws', time: '5 hours ago', icon: FileText },
    { id: 4, action: 'Shared', item: 'Vision Transformer Features', project: 'Origins of Representations', time: '1 day ago', icon: Activity },
  ]

  // Show dashboard for authenticated users
  return (
    <PortalLayoutSimple userEmail={user.email} userMetadata={user.user_metadata} projects={projects}>
      <div className="p-8 max-w-7xl mx-auto">
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
    </PortalLayoutSimple>
  )
}