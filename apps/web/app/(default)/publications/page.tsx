"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { Checkbox } from "@workspace/ui/components/checkbox"
import { Search, FileText, Users, Code, ChevronDown, ExternalLink } from "lucide-react"
import { publications } from "@/lib/publications-data"

export default function PublicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showSignificant, setShowSignificant] = useState(true)
  const [expandedPubs, setExpandedPubs] = useState<Set<number>>(new Set())

  const filteredPublications = useMemo(() => {
    return publications
      .filter(pub => !pub.hide) // Filter out hidden publications
      .filter(pub => {
        const matchesSearch = searchTerm === "" || 
          pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pub.authors.some(author => author.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (pub.abstract && pub.abstract.toLowerCase().includes(searchTerm.toLowerCase()))
        
        const matchesSignificant = !showSignificant || pub.significant
        
        return matchesSearch && matchesSignificant
      })
      .sort((a, b) => {
        // Sort by year first (descending)
        if (b.year !== a.year) return b.year - a.year
        // Then by month if available
        const monthOrder = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December']
        const aMonth = a.month ? monthOrder.indexOf(a.month) : -1
        const bMonth = b.month ? monthOrder.indexOf(b.month) : -1
        return bMonth - aMonth
      })
  }, [searchTerm, showSignificant])

  const typeColors = {
    journal: "bg-blue-500",
    conference: "bg-green-500",
    preprint: "bg-yellow-500",
    book: "bg-purple-500",
    thesis: "bg-gray-500",
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Publications</h1>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by title, author, or abstract..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <p className="text-sm text-muted-foreground mr-4">
                Showing {filteredPublications.length} of {publications.length} publications
              </p>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="significant" 
                  checked={showSignificant}
                  onCheckedChange={(checked) => setShowSignificant(checked as boolean)}
                />
                <label
                  htmlFor="significant"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Significant contributions only
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {filteredPublications.map((pub) => {
            const isExpanded = expandedPubs.has(pub.id)
            return (
            <Card 
              key={pub.id} 
              className="overflow-hidden cursor-pointer"
              onClick={() => {
                const newExpanded = new Set(expandedPubs)
                if (isExpanded) {
                  newExpanded.delete(pub.id)
                } else {
                  newExpanded.add(pub.id)
                }
                setExpandedPubs(newExpanded)
              }}
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
                              target="_blank"
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
                    {(pub.pdf || pub.code) && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {pub.pdf && (
                          <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
                            <a href={pub.pdf} target="_blank" rel="noopener noreferrer">
                              <FileText className="mr-2 h-3 w-3" />
                              PDF
                            </a>
                          </Button>
                        )}
                        {pub.code && (
                          <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
                            <a href={pub.code} target="_blank" rel="noopener noreferrer">
                              <Code className="mr-2 h-3 w-3" />
                              Code
                            </a>
                          </Button>
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
          })}
        </div>

        {filteredPublications.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                No publications found matching your criteria.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}