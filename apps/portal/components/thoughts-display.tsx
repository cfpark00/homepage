"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Clock, ChevronDown, ChevronRight, Link2 } from "lucide-react"
import { TfiThought } from "react-icons/tfi"

interface ThoughtItem {
  content: string
  time: string
  parent_id?: [string, number]
}

interface DailyThoughts {
  date: string
  title: string
  thoughts: ThoughtItem[]
}

interface ThoughtsDisplayProps {
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

export function ThoughtsDisplay({ dailyThoughts }: ThoughtsDisplayProps) {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({})

  const toggleOpen = (date: string) => {
    setOpenStates(prev => ({ ...prev, [date]: !prev[date] }))
  }

  if (dailyThoughts.length === 0) {
    return (
      <p className="text-sm text-muted-foreground py-8 text-center">
        No thoughts recorded yet.
      </p>
    )
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-14 top-0 bottom-0 w-0.5 bg-gradient-to-b from-border via-border to-transparent" />
      
      <div className="space-y-4">
        {dailyThoughts.map((daily) => {
          const date = new Date(daily.date + "T00:00:00")
          const month = date.toLocaleDateString("en-US", { month: "short" })
          const day = date.getDate()
          const isOpen = openStates[daily.date] || false // Default to closed
          
          return (
            <div key={daily.date} className="relative flex items-start">
              {/* Date on the left */}
              <div className="w-10 text-right pr-2 pt-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {month}<br/>
                  <span className="text-base">{day}</span>
                </p>
              </div>
              
              {/* Timeline node */}
              <div className="relative z-10 pt-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
                  <TfiThought className="h-4 w-4 text-foreground/70" />
                </div>
              </div>
              
              {/* Collapsible card */}
              <div className="flex-1 ml-4">
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader 
                    className="p-3 cursor-pointer"
                    onClick={() => toggleOpen(daily.date)}
                  >
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{daily.title}</CardTitle>
                      {isOpen ? (
                        <ChevronDown className="h-3 w-3 text-muted-foreground transition-transform" />
                      ) : (
                        <ChevronRight className="h-3 w-3 text-muted-foreground transition-transform" />
                      )}
                    </div>
                  </CardHeader>
                  {isOpen && (
                    <CardContent className="p-3 pt-0">
                      <div className="space-y-2">
                        {daily.thoughts.map((thought, index) => (
                          <div key={`${daily.date}-${index}`} className="border-l-2 border-muted pl-3">
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
                            <p className="text-sm">{renderContent(thought.content)}</p>
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
  )
}