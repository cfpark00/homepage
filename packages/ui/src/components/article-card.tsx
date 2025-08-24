"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import { ChevronDown, ExternalLink } from "lucide-react"
import { cn } from "../lib/utils"

export interface ArticleLink {
  label: string
  url: string
  icon?: React.ReactNode
  external?: boolean
}

export interface LinkSection {
  title: string
  links: ArticleLink[]
}

export interface ArticleCardProps {
  title: string
  authors?: React.ReactNode
  authorIcon?: React.ReactNode
  thumbnail?: string
  thumbnailFallback?: React.ReactNode
  venue?: string
  venueUrl?: string
  yearInfo?: string
  links?: ArticleLink[]
  linkSections?: LinkSection[]
  expandedContent?: React.ReactNode
  expandable?: boolean
  highlightColor?: string
  className?: string
}

export function ArticleCard({
  title,
  authors,
  authorIcon,
  thumbnail,
  thumbnailFallback,
  venue,
  venueUrl,
  yearInfo,
  links = [],
  linkSections = [],
  expandedContent,
  expandable = false,
  highlightColor,
  className,
}: ArticleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleCardClick = () => {
    if (expandable) {
      setIsExpanded(!isExpanded)
    }
  }

  return (
    <Card
      className={cn(
        "overflow-hidden",
        expandable && "cursor-pointer",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="flex">
        {highlightColor && (
          <div className={cn("w-1", highlightColor)} />
        )}
        <div className="flex-1">
          {/* Thumbnail - stacks on mobile, inline on desktop */}
          <div className="flex flex-col sm:flex-row">
            <div className="p-4 pb-2 sm:pb-4 flex-shrink-0 flex justify-center sm:justify-start">
              <div className="w-32 h-32 sm:w-24 sm:h-24 relative overflow-hidden rounded bg-muted">
                {thumbnail ? (
                  <img 
                    src={thumbnail} 
                    alt={title}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                    {thumbnailFallback}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <CardHeader className="pb-3 pt-2 sm:pt-4 px-4 sm:pl-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 pr-2">
                    <CardTitle className="mb-1 text-sm sm:text-lg leading-tight">
                      {title}
                    </CardTitle>
                    {authors && (
                      <CardDescription className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                        {authorIcon && (
                          <span className="hidden sm:block flex-shrink-0">{authorIcon}</span>
                        )}
                        <span className="text-xs sm:text-sm line-clamp-2 sm:line-clamp-none">
                          {authors}
                        </span>
                      </CardDescription>
                    )}
                  </div>
                  {expandable && (
                    <ChevronDown 
                      className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform flex-shrink-0",
                        isExpanded && "rotate-180"
                      )}
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0 pb-3 px-4 sm:pl-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <div className="flex items-center gap-2">
                    {venueUrl ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={venueUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {venue}
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </Button>
                    ) : venue ? (
                      <span className="text-xs sm:text-sm text-muted-foreground">{venue}</span>
                    ) : null}
                    {yearInfo && (
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        · {yearInfo}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Additional links */}
                {links.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {links.map((link, idx) => (
                      <Button
                        key={idx}
                        variant="outline"
                        size="sm"
                        className="text-xs sm:text-sm"
                        asChild
                        onClick={(e) => e.stopPropagation()}
                      >
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {link.icon}
                          {link.label}
                        </a>
                      </Button>
                    ))}
                  </div>
                )}

                {/* Expanded Content */}
                {isExpanded && (expandedContent || linkSections.length > 0) && (
                  <div className="mt-3 space-y-3">
                    {expandedContent}
                    
                    {/* Link Sections */}
                    {linkSections.map((section, idx) => (
                      <div key={idx} className="pt-2 border-t">
                        <p className="text-xs text-muted-foreground font-medium mb-2">{section.title}:</p>
                        <div className="flex flex-wrap gap-2">
                          {section.links.map((link, linkIdx) => (
                            <Button
                              key={linkIdx}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              asChild
                              onClick={(e) => e.stopPropagation()}
                            >
                              <a
                                href={link.url}
                                target={link.external !== false ? "_blank" : undefined}
                                rel={link.external !== false ? "noopener noreferrer" : undefined}
                              >
                                {link.icon}
                                {link.label}
                                {link.external !== false && <ExternalLink className="ml-1 h-3 w-3" />}
                              </a>
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
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