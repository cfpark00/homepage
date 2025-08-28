"use client"

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@workspace/ui/components/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'
import { Badge } from '@workspace/ui/components/badge'
import { Button } from '@workspace/ui/components/button'
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
import Link from 'next/link'

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
      shared: boolean
      shareLink?: string
      lastModified: string
      description?: string
    }>
  }
}

const iconMap: Record<string, any> = {
  Home,
  Flask: FlaskConical,
  Database,
  ChartBar: BarChart3,
  FileText,
  Code,
  Folder
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
    document: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    analysis: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    model: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    code: 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400',
  }

  const typeIcons: Record<string, any> = {
    experiment: FlaskConical,
    dataset: Database,
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
              {itemCount > 0 && (
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
                <CardDescription>
                  {tab.id === 'overview' 
                    ? projectData?.description 
                    : `${tabItems.length} items in this section`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {tabItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground py-8 text-center">
                    No items in this section yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {tabItems.map((item) => {
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
                    })}
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