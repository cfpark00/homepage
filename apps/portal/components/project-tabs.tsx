"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
import { PublicationCard } from '@workspace/ui/components/pub-card'
import { ThoughtsDisplay } from './thoughts-display'
import { 
  FileText, 
  Home,
  Database,
  Code,
  Calendar,
  Eye,
  Lock,
  Folder,
  FlaskConical,
  BarChart3
} from 'lucide-react'
import { TfiThought } from 'react-icons/tfi'
import Link from 'next/link'

interface DailyThoughts {
  date: string
  title: string
  thoughts: Array<{
    content: string
    time: string
    tags?: string[]
    parent_id?: [string, number]
  }>
}

interface ProjectTabsProps {
  projectSlug: string
  projectData?: {
    name: string
    description: string
    status: string
    created: string
    tabs?: Array<{
      id: string
      label: string
      icon: string
    }>
    items?: Array<{
      id: string
      name: string
      type: string
      tab?: string
      subtab?: string
      shared: boolean
      shareLink?: string
      lastModified: string
      description?: string
      publicationDate?: string
      arxivId?: string
      authors?: string[]
      myComments?: string
      abstract?: string
      relevanceToProject?: string
      myTake?: string
      aiTake?: string
      readingStatus?: 'to-read' | 'reading' | 'read'
      link?: string
      tags?: string[]
    }>
    thoughts?: DailyThoughts[]
  }
}

const iconMap: Record<string, any> = {
  Home,
  Flask: FlaskConical,
  Database,
  ChartBar: BarChart3,
  FileText,
  Code,
  Folder,
  Brain: TfiThought
}

export function ProjectTabs({ projectSlug, projectData }: ProjectTabsProps) {
  const tabs = projectData?.tabs || []
  const items = projectData?.items || []
  const [activeTab, setActiveTab] = useState(tabs[0]?.id || 'overview')

  // Group items by tab
  const itemsByTab = items.reduce((acc, item) => {
    const tabId = item.tab || 'overview'
    if (!acc[tabId]) acc[tabId] = []
    acc[tabId].push(item)
    return acc
  }, {} as Record<string, typeof items>)

  const typeColors: Record<string, string> = {
    experiment: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    dataset: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    paper: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    document: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    analysis: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    model: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    code: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  }

  const typeIcons: Record<string, any> = {
    experiment: FlaskConical,
    dataset: Database,
    paper: FileText,
    document: FileText,
    analysis: BarChart3,
    model: Database,
    code: Code,
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full flex justify-start overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = iconMap[tab.icon] || FileText
          const itemCount = itemsByTab[tab.id]?.length || 0
          return (
            <TabsTrigger key={tab.id} value={tab.id} className="flex items-center gap-2">
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
              {itemCount > 0 && tab.id !== 'overview' && (
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                  {itemCount}
                </Badge>
              )}
            </TabsTrigger>
          )
        })}
      </TabsList>

      {tabs.map((tab) => {
        const tabItems = itemsByTab[tab.id] || []
        
        return (
          <TabsContent key={tab.id} value={tab.id} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>{tab.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {tab.id === 'thoughts' ? (
                  <ThoughtsDisplay dailyThoughts={projectData?.thoughts || []} />
                ) : tabItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No items in this section yet.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {tab.id === 'literature' ? (
                      <>
                        {/* To Read Section */}
                        {tabItems.filter(item => item.readingStatus === 'to-read').length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">To Read</h3>
                            <div className="space-y-3">
                              {tabItems.filter(item => item.readingStatus === 'to-read').map((item) => (
                                <PublicationCard
                                  key={item.id}
                                  id={item.id}
                                  title={item.name}
                                  authors={item.authors}
                                  description={item.description}
                                  lastModified={item.lastModified}
                                  publicationDate={item.publicationDate}
                                  link={item.link || (item.arxivId ? `https://arxiv.org/abs/${item.arxivId}` : undefined)}
                                  type={item.type}
                                  abstract={item.abstract}
                                  relevanceToProject={item.relevanceToProject}
                                  myTake={item.myTake || item.myComments}
                                  aiTake={item.aiTake}
                                  tags={item.tags}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Reading Section */}
                        {tabItems.filter(item => item.readingStatus === 'reading').length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Currently Reading</h3>
                            <div className="space-y-3">
                              {tabItems.filter(item => item.readingStatus === 'reading').map((item) => (
                                <PublicationCard
                                  key={item.id}
                                  id={item.id}
                                  title={item.name}
                                  authors={item.authors}
                                  description={item.description}
                                  lastModified={item.lastModified}
                                  publicationDate={item.publicationDate}
                                  link={item.link || (item.arxivId ? `https://arxiv.org/abs/${item.arxivId}` : undefined)}
                                  type={item.type}
                                  abstract={item.abstract}
                                  relevanceToProject={item.relevanceToProject}
                                  myTake={item.myTake || item.myComments}
                                  aiTake={item.aiTake}
                                  tags={item.tags}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Read Section */}
                        {tabItems.filter(item => item.readingStatus === 'read' || !item.readingStatus).length > 0 && (
                          <div>
                            <h3 className="text-sm font-medium mb-3 text-muted-foreground">Read</h3>
                            <div className="space-y-3">
                              {tabItems.filter(item => item.readingStatus === 'read' || !item.readingStatus).map((item) => (
                                <PublicationCard
                                  key={item.id}
                                  id={item.id}
                                  title={item.name}
                                  authors={item.authors}
                                  description={item.description}
                                  lastModified={item.lastModified}
                                  publicationDate={item.publicationDate}
                                  link={item.link || (item.arxivId ? `https://arxiv.org/abs/${item.arxivId}` : undefined)}
                                  type={item.type}
                                  abstract={item.abstract}
                                  relevanceToProject={item.relevanceToProject}
                                  myTake={item.myTake || item.myComments}
                                  aiTake={item.aiTake}
                                  tags={item.tags}
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </>
                    ) : (
                      tabItems.map((item) => {
                      
                      // Default rendering for non-literature items
                      const TypeIcon = typeIcons[item.type] || Folder
                      return (
                        <div key={item.id} className="group">
                          <div className="flex items-start justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors">
                            <div className="flex items-start gap-3">
                              <div className="mt-0.5 p-2 rounded-md bg-muted">
                                <TypeIcon className="h-4 w-4 text-muted-foreground" />
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <p className="font-medium">{item.name}</p>
                                  <Badge variant="outline" className={`text-xs ${typeColors[item.type]}`}>
                                    {item.type}
                                  </Badge>
                                </div>
                                {item.description && (
                                  <p className="text-sm text-muted-foreground">
                                    {item.description}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">
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
                                        View
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
                      )
                    })
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        )
      })}
    </Tabs>
  )
}