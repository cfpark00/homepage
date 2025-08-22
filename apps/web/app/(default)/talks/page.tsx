"use client"

import { useState } from "react"
import { PageContainer } from "@workspace/ui/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Button } from "@workspace/ui/components/button"
import { Badge } from "@workspace/ui/components/badge"
import { ChevronDown, ExternalLink, Play, Calendar, Clock, Presentation, MapPin, Download } from "lucide-react"
import { talks } from "@/lib/talks-data"

export default function TalksPage() {
  const [expandedTalks, setExpandedTalks] = useState<Set<number>>(new Set())

  // Helper function to check if slides URL is Google Slides
  const isGoogleSlides = (url: string | undefined) => {
    return url ? url.includes('docs.google.com/presentation') : false
  }

  // Helper function to check if slides URL is a downloadable file (e.g., Keynote on Google Drive)
  const isDownloadableSlides = (url: string | undefined) => {
    return url ? url.includes('drive.google.com/file') : false
  }

  // Convert Google Slides embed URL to share URL
  const getGoogleSlidesShareUrl = (embedUrl: string) => {
    // Extract presentation ID from embed URL
    const match = embedUrl.match(/\/presentation\/d\/e\/(2PACX-[^\/]+)/)
    if (match) {
      // Convert to share URL format
      return `https://docs.google.com/presentation/d/e/${match[1]}/pub?start=false&loop=false&delayms=3000`
    }
    return embedUrl
  }

  // Convert Google Drive view URL to download URL
  const getGoogleDriveDownloadUrl = (viewUrl: string) => {
    // Extract file ID from view URL
    const match = viewUrl.match(/\/file\/d\/([^\/]+)/)
    if (match) {
      return `https://drive.google.com/uc?export=download&id=${match[1]}`
    }
    return viewUrl
  }

  const getYouTubeEmbedUrl = (url: string) => {
    // Handle both youtube.com and youtu.be URLs
    let videoId = ""
    let timestamp = ""
    
    if (url.includes("youtu.be/")) {
      // Format: https://youtu.be/VIDEO_ID?t=SECONDS
      videoId = url.split("youtu.be/")[1]?.split("?")[0]
      const timeParam = url.match(/[?&]t=(\d+)/)
      if (timeParam) {
        timestamp = timeParam[1]
      }
    } else if (url.includes("youtube.com/watch")) {
      // Format: https://www.youtube.com/watch?v=VIDEO_ID&t=SECONDS
      videoId = url.split("v=")[1]?.split("&")[0]
      const timeParam = url.match(/[?&]t=(\d+)/)
      if (timeParam) {
        timestamp = timeParam[1]
      }
    }
    
    return timestamp 
      ? `https://www.youtube.com/embed/${videoId}?start=${timestamp}`
      : `https://www.youtube.com/embed/${videoId}`
  }

  const getYouTubeThumbnail = (url: string) => {
    let videoId = ""
    
    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0]
    } else if (url.includes("youtube.com/watch")) {
      videoId = url.split("v=")[1]?.split("&")[0]
    }
    
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  }

  const getGoogleSlidesThumbnail = (url: string) => {
    // Extract presentation ID from Google Slides URL
    const match = url.match(/\/presentation\/d\/e\/(2PACX-[^\/]+)/)
    if (match) {
      // Google provides a thumbnail endpoint for presentations
      return `https://docs.google.com/presentation/d/e/${match[1]}/thumbnail?sz=w400`
    }
    return null
  }

  const getThumbnailForTalk = (talk: any) => {
    // Priority 1: Use custom thumbnail if provided (local PNGs)
    if (talk.thumbnailUrl) return talk.thumbnailUrl
    
    // Priority 2: Try YouTube thumbnail if video exists
    if (talk.videoUrl && !talk.videoUrl.includes('drive.google.com')) {
      return getYouTubeThumbnail(talk.videoUrl)
    }
    
    // Priority 3: Try Google Slides thumbnail (often unreliable)
    if (talk.slidesUrl && talk.slidesUrl.includes('docs.google.com/presentation')) {
      const slideThumb = getGoogleSlidesThumbnail(talk.slidesUrl)
      if (slideThumb) return slideThumb
    }
    
    return null
  }

  return (
    <PageContainer>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Talks & Presentations</h1>
      </div>

      <div className="space-y-3">
        {talks.map((talk) => {
          const isExpanded = expandedTalks.has(talk.id)
          return (
            <Card 
              key={talk.id} 
              className="overflow-hidden cursor-pointer"
              onClick={() => {
                const newExpanded = new Set(expandedTalks)
                if (isExpanded) {
                  newExpanded.delete(talk.id)
                } else {
                  newExpanded.add(talk.id)
                }
                setExpandedTalks(newExpanded)
              }}
            >
              <div className="flex">
                <div className={`w-1 ${
                  talk.venue.includes("(Invited)") ? "bg-blue-500" : 
                  talk.venue.includes("Ph.D. Defense") ? "bg-purple-500" :
                  // Informal/semi-formal talks
                  (talk.id === 12 || // Scaling and In-Context Learning (NTT Journal Club)
                   talk.id === 16 || // Reconstruction of local dark matter (Kavli IPMU workshop)
                   talk.id === 18 || // How is AI used (High School talk)
                   talk.id === 19)   // Mstar2Mcdm (CAMELS Virtual Telecoms)
                  ? "bg-amber-500" :
                  "bg-green-500"
                }`} />
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row">
                    {/* Thumbnail */}
                    <div className="p-4 pb-2 sm:pb-4 flex-shrink-0 flex justify-center sm:justify-start">
                      <div className="w-32 h-20 sm:w-40 sm:h-24 relative overflow-hidden rounded bg-muted">
                        {(() => {
                          const thumbnail = getThumbnailForTalk(talk)
                          if (thumbnail) {
                            return (
                              <img 
                                src={thumbnail} 
                                alt={talk.title}
                                className="object-cover w-full h-full"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                  if (target.nextSibling) {
                                    (target.nextSibling as HTMLElement).style.display = 'flex'
                                  }
                                }}
                              />
                            )
                          }
                          return null
                        })()}
                        <div className="w-full h-full items-center justify-center text-muted-foreground hidden">
                          {talk.primaryContent === "slides" ? (
                            <Presentation className="w-8 h-8" />
                          ) : (
                            <Play className="w-8 h-8" />
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <CardHeader className="pb-3 pt-2 sm:pt-4 px-4 sm:pl-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 pr-2">
                            <CardTitle className="mb-1 text-sm sm:text-lg leading-tight">
                              {talk.title}
                            </CardTitle>
                            <div className="flex flex-col gap-1 text-muted-foreground">
                              <div className="flex items-center gap-2 text-xs">
                                <MapPin className="h-3 w-3" />
                                <span>{talk.venue}</span>
                              </div>
                              <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>{talk.date}</span>
                                </div>
                                {talk.duration && (
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    <span>{talk.duration}</span>
                                  </div>
                                )}
                              </div>
                              {/* Media availability icons */}
                              <div className="flex items-center gap-2 mt-1">
                                {talk.videoUrl && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                                    <Play className="h-3 w-3" />
                                    <span>Video</span>
                                  </div>
                                )}
                                {talk.slidesUrl && (
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground/70">
                                    <Presentation className="h-3 w-3" />
                                    <span>Slides</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          <ChevronDown 
                            className={`h-5 w-5 text-muted-foreground transition-transform flex-shrink-0 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pt-0 px-4 sm:pl-0">
                        {isExpanded && (
                          <div className="mt-3 space-y-3">
                            {talk.description && (
                              <p className="text-sm text-muted-foreground">
                                {talk.description}
                              </p>
                            )}
                            
                            {/* Show content based on primaryContent preference */}
                            {talk.primaryContent === "slides" ? (
                              <>
                                {talk.slidesUrl && talk.slidesUrl.includes('docs.google.com/presentation') && talk.slidesUrl.includes('/embed') && (
                                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                                    <iframe
                                      src={talk.slidesUrl}
                                      title={`${talk.title} - Slides`}
                                      className="w-full h-full"
                                      allowFullScreen
                                    />
                                  </div>
                                )}
                                {talk.videoUrl && (
                                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                                    <iframe
                                      src={getYouTubeEmbedUrl(talk.videoUrl)}
                                      title={talk.title}
                                      className="w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                {talk.videoUrl && (
                                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                                    <iframe
                                      src={getYouTubeEmbedUrl(talk.videoUrl)}
                                      title={talk.title}
                                      className="w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                )}
                                {talk.slidesUrl && talk.slidesUrl.includes('docs.google.com/presentation') && talk.slidesUrl.includes('/embed') && (
                                  <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-900">
                                    <iframe
                                      src={talk.slidesUrl}
                                      title={`${talk.title} - Slides`}
                                      className="w-full h-full"
                                      allowFullScreen
                                    />
                                  </div>
                                )}
                              </>
                            )}
                            
                            <div className="flex gap-2 pt-2">
                              {talk.videoUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    window.open(talk.videoUrl, '_blank')
                                  }}
                                >
                                  <ExternalLink className="mr-2 h-3 w-3" />
                                  Open in YouTube
                                </Button>
                              )}
                              {talk.slidesUrl && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    if (!talk.slidesUrl) return
                                    
                                    if (isDownloadableSlides(talk.slidesUrl)) {
                                      // For Keynote files on Google Drive, download directly
                                      const downloadUrl = getGoogleDriveDownloadUrl(talk.slidesUrl)
                                      window.open(downloadUrl, '_blank')
                                    } else if (isGoogleSlides(talk.slidesUrl)) {
                                      // For Google Slides, open the share link (not embed)
                                      const shareUrl = getGoogleSlidesShareUrl(talk.slidesUrl)
                                      window.open(shareUrl, '_blank')
                                    } else {
                                      // Fallback for other formats
                                      window.open(talk.slidesUrl, '_blank')
                                    }
                                  }}
                                >
                                  {isDownloadableSlides(talk.slidesUrl) ? (
                                    <>
                                      <Download className="mr-2 h-3 w-3" />
                                      Download Slides (Keynote)
                                    </>
                                  ) : (
                                    <>
                                      <Presentation className="mr-2 h-3 w-3" />
                                      View Slides
                                    </>
                                  )}
                                </Button>
                              )}
                            </div>
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

      {talks.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">
              No talks available yet.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Divider */}
      <div className="my-8 border-t" />

      {/* Other Talks without Media */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-muted-foreground mb-3">Other Talks & Presentations</h2>
        <div className="space-y-1 text-sm">
          <div>
            <span className="font-medium">Exploring Compositional Generalization of Neural Networks through Synthetic Experiments</span>
            <span className="text-muted-foreground"> • Astro AI Workshop 2025 (Invited Tutorial) • July 9, 2025</span>
          </div>
          <div>
            <span className="font-medium">Automated neuron tracking using deep learning and targeted augmentation</span>
            <span className="text-muted-foreground"> • American Physical Society March Meeting 2023 • March 2023</span>
          </div>
          <div>
            <span className="font-medium">On the Gaussianity of Non-Gaussian probes of Large Scale Structure</span>
            <span className="text-muted-foreground"> • American Astronomical Society 240 • 2022</span>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}