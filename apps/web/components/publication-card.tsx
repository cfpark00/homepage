"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { FileText, Users, ExternalLink, ChevronDown } from "lucide-react"

export interface Publication {
  id: number
  title: string
  authors: string[]
  abstract?: string
  venue: string
  year: number
  month?: string
  type: "conference" | "workshop" | "thesis" | "preprint"
  arxiv?: string
  doi?: string
  url?: string
  thumbnail?: string
  significant?: boolean
  related_pubs?: string[]
}

const typeColors = {
  conference: "bg-blue-500",
  workshop: "bg-purple-500",
  thesis: "bg-green-500",
  preprint: "bg-orange-500",
}

interface PublicationCardProps {
  publication: Publication
  compact?: boolean
}

export function PublicationCard({ publication: pub, compact = false }: PublicationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card 
      className="overflow-hidden cursor-pointer"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="flex">
        <div className={`w-1 ${typeColors[pub.type]}`} />
        <div className="flex-1">
          {/* Thumbnail - stacks on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row">
            <div className="p-4 pb-2 sm:pb-4 flex-shrink-0 flex justify-center sm:justify-start">
              <div className="w-32 h-32 sm:w-24 sm:h-24 relative overflow-hidden rounded bg-muted">
                {pub.thumbnail ? (
                  <img 
                    src={pub.thumbnail} 
                    alt={pub.title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    <FileText className="w-8 h-8" />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <CardHeader className="pb-3 pt-2 sm:pt-4 px-4 sm:pl-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <CardTitle className="mb-1 text-sm sm:text-lg leading-tight">
                      {pub.title}
                    </CardTitle>
                    <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                      <Users className="h-4 w-4 hidden sm:block flex-shrink-0" />
                      <span className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-none">
                        {pub.authors.map((author, index) => {
                          const isFirst = author.includes("*")
                          const cleanAuthor = author.replace("*", "")
                          const isMe = cleanAuthor === "C.F. Park"
                          
                          return (
                            <span key={index}>
                              {index > 0 && ", "}
                              {isFirst ? (
                                <strong>{cleanAuthor}</strong>
                              ) : isMe ? (
                                <span className="underline">{cleanAuthor}</span>
                              ) : (
                                cleanAuthor
                              )}
                            </span>
                          )
                        })}
                      </span>
                    </CardDescription>
                  </div>
                  <ChevronDown 
                    className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${
                      isExpanded ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </CardHeader>
              <CardContent className="pt-0 px-4 sm:pl-0">
                <div className="mb-2 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    {(pub.arxiv || pub.doi || pub.url) ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={pub.arxiv ? `https://arxiv.org/abs/${pub.arxiv}` : pub.doi ? `https://doi.org/${pub.doi}` : pub.url}
                          target="__blank"
                          rel="noopener noreferrer"
                        >
                          {pub.venue}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    ) : (
                      <span className="text-xs sm:text-sm text-muted-foreground">{pub.venue}</span>
                    )}
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      · {pub.month ? `${pub.month} ` : ''}{pub.year}
                    </span>
                  </div>
                </div>
                {isExpanded && (
                  <div className="mt-3 space-y-3">
                    <div className="space-y-2">
                      {pub.abstract ? (
                        pub.abstract.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
                          <p key={idx} className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
                            {paragraph.trim()}
                          </p>
                        ))
                      ) : (
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed text-justify">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                        </p>
                      )}
                    </div>
                    {pub.related_pubs && pub.related_pubs.length > 0 && (
                      <div className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground font-medium mb-1">Other forms:</p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                          {pub.related_pubs.map((relPub, idx) => (
                            <li key={idx} className="break-words">• {relPub}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}