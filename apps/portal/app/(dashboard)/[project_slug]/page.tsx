import { redirect } from 'next/navigation'
import { PageHeader } from '@/components/page-header'
import { ProjectTabs } from '@/components/project-tabs'
import { FloatingChat } from '@/components/floating-chat'
import { getProjectBySlug } from '@/lib/projects'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Button } from '@workspace/ui/components/button'
import { Badge } from '@workspace/ui/components/badge'
import { Share2, UserPlus, Calendar, FileText, Eye, Lock } from 'lucide-react'
import Link from 'next/link'

export default async function ProjectPage({
  params
}: {
  params: Promise<{ project_slug: string }>
}) {
  const { project_slug } = await params
  
  // Load project data from files
  const project = await getProjectBySlug(project_slug)

  if (!project) {
    redirect('/')
  }

  const typeColors = {
    experiment: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    dataset: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    paper: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    document: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    analysis: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    model: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    code: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  }

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="p-7 pb-0 max-w-7xl mx-auto w-full">
        <PageHeader 
          title={project.name}
          actions={
            <>
              <Button variant="outline" size="sm">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </>
          }
          />
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto px-7 pb-7 max-w-7xl mx-auto w-full">
          {/* Show tabs for projects with tabs defined, regular items for others */}
          {project.tabs && project.tabs.length > 0 ? (
            <ProjectTabs projectSlug={project_slug} projectData={project} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Project Items</CardTitle>
                <CardDescription>
                  {project.items.length} items in this project
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y">
                  {project.items.map((item) => (
                    <div key={item.id} className="p-4 hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-medium">{item.name}</p>
                              <Badge variant="outline" className={`text-xs ${typeColors[item.type as keyof typeof typeColors]}`}>
                                {item.type}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              Last modified {item.lastModified}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.shared ? (
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                <Eye className="h-3 w-3 mr-1" />
                                Shared
                              </Badge>
                              {item.shareLink && (
                                <Link href={item.shareLink}>
                                  <Button variant="ghost" size="sm">
                                    View Share
                                  </Button>
                                </Link>
                              )}
                            </div>
                          ) : (
                            <Badge variant="outline" className="text-xs text-muted-foreground">
                              <Lock className="h-3 w-3 mr-1" />
                              Private
                            </Badge>
                          )}
                          <Button variant="ghost" size="sm">
                            Open
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
      </div>
      <FloatingChat />
    </div>
  )
}