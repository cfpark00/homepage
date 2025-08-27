"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@workspace/ui/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"
import { Clock, Link2, ChevronDown, ChevronRight, Lock, Unlock, X } from "lucide-react"
import { TfiThought } from "react-icons/tfi"

export interface ThoughtItem {
  id: number
  content: string
  time: string
  tags?: string[]
  parent_id?: [string, number]
}

export interface DailyThoughts {
  date: string
  title: string
  thoughts: ThoughtItem[]
}

interface ThoughtsPageClientProps {
  dailyThoughts: DailyThoughts[]
}

function renderContent(content: string) {
  // Split by newlines first
  const paragraphs = content.split('\n')
  
  return paragraphs.map((paragraph, pIndex) => {
    // Simple markdown link parser for each paragraph
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g
    const parts = []
    let lastIndex = 0
    let match

    while ((match = linkRegex.exec(paragraph)) !== null) {
      // Add text before the link
      if (match.index > lastIndex) {
        parts.push(paragraph.slice(lastIndex, match.index))
      }
      // Add the link
      const [, linkText, url] = match
      parts.push(
        <a 
          key={`${pIndex}-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {linkText}
        </a>
      )
      lastIndex = match.index + match[0].length
    }
    
    // Add remaining text
    if (lastIndex < paragraph.length) {
      parts.push(paragraph.slice(lastIndex))
    }
    
    const content = parts.length > 0 ? parts : paragraph
    
    return (
      <span key={pIndex}>
        {content}
        {pIndex < paragraphs.length - 1 && <br />}
      </span>
    )
  })
}

export default function ThoughtsPageClient({ dailyThoughts }: ThoughtsPageClientProps) {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})
  const [password, setPassword] = useState("")
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if already authenticated
    const storedAuth = localStorage.getItem("thoughts-auth")
    if (storedAuth) {
      try {
        const { token, expiry } = JSON.parse(storedAuth)
        if (token && expiry && new Date().getTime() < expiry) {
          setIsUnlocked(true)
        } else {
          localStorage.removeItem("thoughts-auth")
        }
      } catch {
        localStorage.removeItem("thoughts-auth")
      }
    }
    setIsLoading(false)
  }, [])

  const toggleOpen = (date: string) => {
    if (isUnlocked) {
      setOpenStates(prev => ({ ...prev, [date]: !prev[date] }))
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch("/api/thoughts-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        // Store the token with 30-day expiration
        const authData = {
          token: data.token,
          expiry: new Date().getTime() + (30 * 24 * 60 * 60 * 1000) // 30 days
        }
        localStorage.setItem("thoughts-auth", JSON.stringify(authData))
        setIsUnlocked(true)
        setPassword("")
      } else {
        // Wrong password - clear it
        setPassword("")
      }
    } catch (err) {
      setPassword("")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleRemoveAccess = () => {
    localStorage.removeItem("thoughts-auth")
    setIsUnlocked(false)
    setOpenStates({})
  }

  if (isLoading) {
    return null // Don't render anything while checking auth
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-4xl font-bold">Thoughts</h1>
          {!isUnlocked && (
            <form onSubmit={handlePasswordSubmit} className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-8 w-48"
                disabled={isSubmitting}
              />
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-8"
              >
                Submit
              </Button>
            </form>
          )}
          {isUnlocked && (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Unlock className="h-4 w-4 text-green-600" />
                <span>Unlocked</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveAccess}
                className="h-8 text-xs text-red-600 hover:text-red-700"
              >
                <X className="h-3 w-3 mr-1" />
                Remove Access
              </Button>
            </div>
          )}
        </div>
      </div>

      {dailyThoughts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No thoughts yet. Check back later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-gradient-to-b from-border via-border to-transparent" />
          
          <div className="space-y-4">
            {dailyThoughts.map((daily) => {
              const date = new Date(daily.date + "T00:00:00")
              const month = date.toLocaleDateString("en-US", { month: "short" })
              const day = date.getDate()
              const isOpen = openStates[daily.date] || false
              
              return (
                <div key={daily.date} className="relative flex items-start">
                  {/* Date on the left */}
                  <div className="w-12 text-right pr-3 pt-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      {month}<br/>
                      <span className="text-lg">{day}</span>
                    </p>
                  </div>
                  
                  {/* Timeline node */}
                  <div className="relative z-10 pt-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full border bg-background">
                      <TfiThought className="h-5 w-5 text-foreground/70" />
                    </div>
                  </div>
                  
                  {/* Collapsible card */}
                  <div className="flex-1 ml-6">
                    <Card className="hover:shadow-lg transition-shadow">
                      <CardHeader 
                        className={`p-4 ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                        onClick={() => toggleOpen(daily.date)}
                      >
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-foreground">{daily.title}</CardTitle>
                          <div className="flex items-center gap-2">
                            {!isUnlocked && (
                              <Lock className="h-3 w-3 text-muted-foreground" />
                            )}
                            {isUnlocked && (
                              isOpen ? (
                                <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform" />
                              )
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      {isOpen && isUnlocked && (
                        <CardContent className="p-4 pt-0">
                          <div className="space-y-3">
                            {daily.thoughts.map((thought) => (
                              <div key={thought.id} className="border-l-2 border-muted pl-4">
                                <div className="flex items-center gap-2 mb-1">
                                  <Clock className="h-3 w-3 text-muted-foreground" />
                                  <span className="text-xs text-muted-foreground">{thought.time}</span>
                                  {thought.parent_id && (
                                    <>
                                      <Link2 className="h-3 w-3 text-muted-foreground" />
                                      <span className="text-xs text-muted-foreground">
                                        {thought.parent_id[0]} #{thought.parent_id[1]}
                                      </span>
                                    </>
                                  )}
                                </div>
                                <p className="text-sm mb-2">{renderContent(thought.content)}</p>
                                {thought.tags && thought.tags.length > 0 && (
                                  <div className="flex flex-wrap gap-1">
                                    {thought.tags.map((tag) => (
                                      <Badge key={tag} variant="outline" className="text-xs px-2 py-0">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </PageContainer>
  )
}