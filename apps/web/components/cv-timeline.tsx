"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Button } from "@workspace/ui/components/button"
import { GraduationCap, Briefcase, Award, Trophy, Sparkles, Calendar, MapPin, Users, Code } from "lucide-react"
import type { CVData } from "@/app/(default)/cv/page"

type TimelineEvent = {
  year: number
  month?: number
  title: string
  subtitle: string
  description?: string
  type: "education" | "work" | "award" | "milestone" | "service" | "extracurricular"
  icon: any
  details?: string[]
  skills?: string[]
}

function parseYear(period: string, useEndYear: boolean = false): number {
  // Handle different formats: "2019 - 2025", "2019 - Present", "2019", "Jan 2025, Jul 2024 - Sep 2024"
  const years = period.match(/\d{4}/g)
  if (!years) return new Date().getFullYear()
  
  if (useEndYear && years.length > 1) {
    // Return the last year if it's an end date
    return parseInt(years[years.length - 1])
  }
  // Return the first year (start date)
  return parseInt(years[0])
}

function convertToTimelineEvents(data: CVData): TimelineEvent[] {
  const events: TimelineEvent[] = []

  // Add education events - use end year for completed degrees
  data.education.forEach((edu) => {
    const isCompleted = !edu.period.toLowerCase().includes('present')
    const year = parseYear(edu.period, isCompleted) // Use end year for completed education
    // Special handling for Ph.D. completion
    let month = undefined
    if (edu.period.includes("May 29, 2025")) {
      month = 5 // May
    }
    events.push({
      year: year,
      month: month,
      title: `${isCompleted ? 'Completed: ' : 'Started: '}${edu.degree}`,
      subtitle: edu.institution,
      description: edu.description,
      type: "education",
      icon: GraduationCap,
      details: [edu.gpa, edu.advisor, edu.thesis].filter(Boolean) as string[]
    })
  })

  // Add experience events - use start year for positions
  data.experience.forEach((exp) => {
    const isOngoing = exp.period.toLowerCase().includes('present')
    // Special handling for postdoc start date
    let month = undefined
    if (exp.period.includes("May 30, 2025")) {
      month = 5.5 // Late May (after Ph.D.)
    }
    events.push({
      year: parseYear(exp.period, false), // Always use start year for positions
      month: month,
      title: `${isOngoing ? 'Current: ' : 'Started: '}${exp.position}`,
      subtitle: exp.institution,
      type: "work",
      icon: Briefcase,
      details: exp.responsibilities
    })
  })

  // Add award events
  data.awards.forEach((award) => {
    if (award.year !== "Multiple") {
      events.push({
        year: parseInt(award.year),
        title: award.name,
        subtitle: "Award",
        type: "award",
        icon: Trophy,
      })
    }
  })

  // Add service events
  data.service.membership.forEach((item) => {
    const year = parseYear(item.period, false)
    events.push({
      year: year,
      title: `Joined ${item.organization}`,
      subtitle: "Professional Membership",
      type: "service",
      icon: Users,
    })
  })

  // Add major reviewing milestones
  const totalPapers = data.service.reviewing.reduce((sum, item) => sum + item.count, 0)
  if (totalPapers > 0) {
    events.push({
      year: 2024,
      title: `Reviewed ${totalPapers} papers`,
      subtitle: "Peer Review",
      description: "Peer reviewer for NeurIPS, ICML, ICLR, and various workshops",
      type: "service",
      icon: Users,
    })
  }

  // Add extracurricular events
  data.extracurricular.forEach((item) => {
    const year = parseInt(item.year)
    events.push({
      year: year,
      title: item.activity,
      subtitle: item.achievement || "Participant",
      type: "extracurricular",
      icon: Sparkles,
    })
  })

  // Add milestone events based on actual publications
  events.push({
    year: 2024,
    month: 12,
    title: "NeurIPS 2024 Spotlight",
    subtitle: "Emergence of Hidden Capabilities",
    description: "Paper exploring learning dynamics in concept space selected for spotlight presentation",
    type: "milestone",
    icon: Sparkles,
  })

  events.push({
    year: 2024,
    month: 1,
    title: "Nature Methods Publication",
    subtitle: "Automated Neuron Tracking",
    description: "Deep learning method for tracking neurons in moving C. elegans published",
    type: "milestone",
    icon: Sparkles,
  })

  events.push({
    year: 2025,
    month: 4,
    title: "Ph.D. Defense",
    subtitle: "Harvard University",
    description: "Successfully defended thesis: Deep Learning as a Scientific Tool and a Model Organism of Intelligence",
    type: "milestone",
    icon: Sparkles,
  })

  // Sort by year (newest first), then by month if available
  return events.sort((a, b) => {
    if (b.year !== a.year) {
      return b.year - a.year
    }
    // If same year, sort by month (later months first)
    if (a.month !== undefined && b.month !== undefined) {
      return b.month - a.month
    }
    // If one has month and other doesn't, prioritize the one with month
    if (a.month !== undefined) return -1
    if (b.month !== undefined) return 1
    return 0
  })
}

export function TimelineView({ data }: { data: CVData }) {
  const events: TimelineEvent[] = convertToTimelineEvents(data)
  const [visibleItems, setVisibleItems] = useState<Set<number>>(new Set())
  const [currentYearIndex, setCurrentYearIndex] = useState(0)
  const [currentMonth, setCurrentMonth] = useState<string>("")
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const yearRefs = useRef<(HTMLDivElement | null)[]>([])
  
  const uniqueYears = [...new Set(events.map(e => e.year))]

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(entry.target.getAttribute('data-index') || '0')
          if (entry.isIntersecting) {
            setVisibleItems((prev) => new Set(prev).add(index))
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
      }
    )

    const refs = itemRefs.current.filter((ref): ref is HTMLDivElement => ref !== null)
    refs.forEach((ref) => observer.observe(ref))

    return () => {
      refs.forEach((ref) => observer.unobserve(ref))
    }
  }, [])

  // Update current year and month based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      // Update year
      yearRefs.current.forEach((ref, index) => {
        if (ref) {
          const rect = ref.getBoundingClientRect()
          const absoluteTop = rect.top + window.scrollY
          
          if (absoluteTop <= scrollPosition) {
            setCurrentYearIndex(index)
          }
        }
      })
      
      // Find the closest visible event to get month
      let closestEventIndex: number | null = null
      let minDistance = Infinity
      
      itemRefs.current.forEach((ref, index) => {
        if (ref && index < events.length) {
          const rect = ref.getBoundingClientRect()
          const elementCenter = rect.top + rect.height / 2
          const viewportCenter = window.innerHeight / 2
          const distance = Math.abs(elementCenter - viewportCenter)
          
          if (distance < minDistance) {
            minDistance = distance
            closestEventIndex = index
          }
        }
      })
      
      if (closestEventIndex !== null) {
        const closestEvent = events[closestEventIndex]
        if (closestEvent?.month) {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", 
                            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
          setCurrentMonth(monthNames[closestEvent.month - 1])
        } else {
          setCurrentMonth("")
        }
      } else {
        setCurrentMonth("")
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Initial check
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [events])


  const typeColors = {
    education: "bg-blue-500",
    work: "bg-green-500",
    award: "bg-yellow-500",
    milestone: "bg-purple-500",
    service: "bg-orange-500",
    extracurricular: "bg-pink-500"
  }

  const typeGradients = {
    education: "from-blue-500/20 to-blue-500/5",
    work: "from-green-500/20 to-green-500/5",
    award: "from-yellow-500/20 to-yellow-500/5",
    milestone: "from-purple-500/20 to-purple-500/5",
    service: "from-orange-500/20 to-orange-500/5",
    extracurricular: "from-pink-500/20 to-pink-500/5"
  }

  return (
    <div className="relative">
      {/* Date display floater */}
      <div className="fixed bottom-8 right-8 z-50 md:bottom-auto md:right-8 md:top-1/2 md:-translate-y-1/2">
        <div className="flex flex-col items-center rounded-full bg-background/95 px-3 py-2 backdrop-blur shadow-lg">
          {currentMonth && (
            <span className="text-xs font-medium text-muted-foreground">{currentMonth}</span>
          )}
          <span className="text-sm font-bold">{uniqueYears[currentYearIndex]}</span>
        </div>
      </div>

      {/* Timeline line */}
      <div className="absolute left-8 top-0 h-full w-0.5 bg-gradient-to-b from-primary via-primary/50 to-transparent md:left-1/2 md:-translate-x-1/2" />
      
      {/* Year markers */}
      {uniqueYears.map((year, idx) => (
        <div
          key={year}
          ref={(el) => {
            yearRefs.current[idx] = el
          }}
          className="relative mb-16"
          style={{
            opacity: visibleItems.has(idx) ? 1 : 0,
            transform: visibleItems.has(idx) ? 'translateY(0)' : 'translateY(20px)',
            transition: 'all 0.5s ease-out'
          }}
        >
          <div className="sticky top-20 z-10 mb-8 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background md:absolute md:left-1/2 md:-translate-x-1/2">
              <Calendar className="h-5 w-5" />
            </div>
            <div className="text-2xl font-bold md:absolute md:left-1/2 md:ml-20">
              {year}
            </div>
          </div>

          {events
            .filter((e) => e.year === year)
            .map((event, eventIdx) => {
              const globalIdx = events.indexOf(event)
              const isLeft = globalIdx % 2 === 0
              const Icon = event.icon

              return (
                <div
                  key={eventIdx}
                  ref={(el) => {
                    itemRefs.current[globalIdx] = el
                  }}
                  data-index={globalIdx}
                  className={`relative mb-8 flex ${
                    isLeft ? 'md:justify-start' : 'md:justify-end'
                  } ${isLeft ? 'md:pr-[50%]' : 'md:pl-[50%]'} pl-20 md:pl-0 md:pr-0`}
                  style={{
                    opacity: visibleItems.has(globalIdx) ? 1 : 0,
                    transform: visibleItems.has(globalIdx) 
                      ? 'translateX(0) scale(1)' 
                      : `translateX(${isLeft ? '-20px' : '20px'}) scale(0.95)`,
                    transition: `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${eventIdx * 0.1}s`
                  }}
                >
                  {/* Icon on timeline */}
                  <div 
                    className={`absolute left-4 flex h-10 w-10 items-center justify-center rounded-full border-4 border-background ${
                      typeColors[event.type]
                    } md:left-1/2 md:-translate-x-1/2 z-20`}
                    style={{
                      boxShadow: visibleItems.has(globalIdx) 
                        ? `0 0 20px ${typeColors[event.type].replace('bg-', 'rgb(var(--')}/0.5)` 
                        : 'none',
                      transition: 'all 0.6s ease-out'
                    }}
                  >
                    <Icon className="h-5 w-5 text-white" />
                  </div>

                  {/* Content card */}
                  <Card 
                    className={`w-full overflow-hidden bg-gradient-to-br ${
                      typeGradients[event.type]
                    } backdrop-blur transition-all duration-500 hover:shadow-xl md:max-w-md ${
                      isLeft ? 'md:mr-8' : 'md:ml-8'
                    }`}
                  >
                    <CardHeader className="pb-3">
                      <div className="mb-2 flex items-center justify-between">
                        <Badge variant="secondary" className="capitalize">
                          {event.type}
                        </Badge>
                        {event.month && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(event.year, event.month - 1).toLocaleDateString('en-US', { month: 'short' })}
                          </span>
                        )}
                      </div>
                      <CardTitle className="text-lg">{event.title}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.subtitle}
                      </CardDescription>
                    </CardHeader>
                    {(event.description || event.details) && (
                      <CardContent>
                        {event.description && (
                          <p className="mb-3 text-sm">{event.description}</p>
                        )}
                        {event.details && event.details.length > 0 && (
                          <ul className="space-y-1 text-xs text-muted-foreground">
                            {event.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start gap-1">
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground" />
                                <span>{detail}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {event.skills && (
                          <div className="mt-3 flex flex-wrap gap-1">
                            {event.skills.map((skill) => (
                              <Badge key={skill} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    )}
                  </Card>
                </div>
              )
            })}
        </div>
      ))}

      {/* End marker */}
      <div className="relative flex justify-center pb-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background">
          <Code className="h-5 w-5" />
        </div>
      </div>
    </div>
  )
}