import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ExternalLink } from "lucide-react"

type OngoingProject = {
  id: number
  title: string
  description: string
  collaborators: string[]
  startDate: string
  expectedCompletion?: string
  thumbnailUrl?: string
  thumbnailAlt?: string
  highlights?: string[]
  link?: string
}

const ongoingProjects: OngoingProject[] = [
  {
    id: 1,
    title: "Orchestra: A Research Platform",
    description: "Building a comprehensive AI-powered research platform to accelerate scientific discovery through automated literature analysis, hypothesis generation, and experimental design.",
    collaborators: ["Independent Project", "Open Source Contributors"],
    startDate: "2024-04",
    expectedCompletion: "2025-08",
    thumbnailUrl: "/images/orchestra.png",
    thumbnailAlt: "Orchestra research platform logo",
    highlights: [
      "Live platform at app.orchestra-ai.org",
      "AI-powered research automation",
      "Collaborative knowledge synthesis"
    ],
    link: "https://app.orchestra-ai.org"
  }
]

export default function OngoingPage() {
  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Ongoing Stuff...</h1>
        </div>

        {/* Single Orchestra Card - compact size */}
        <div className="max-w-xs">
          {ongoingProjects.map((project) => (
            <Card key={project.id} className="group overflow-hidden transition-all hover:shadow-xl">
              {/* Square Thumbnail */}
              <div className="aspect-square overflow-hidden bg-gradient-to-br from-muted to-muted/50">
                {project.thumbnailUrl ? (
                  <img
                    src={project.thumbnailUrl}
                    alt={project.thumbnailAlt || project.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-4xl font-bold text-muted-foreground/20">
                      {project.title.substring(0, 3).toUpperCase()}
                    </div>
                  </div>
                )}
              </div>

              {/* Compact Content Section */}
              <div className="p-3 space-y-1">
                <h3 className="font-medium text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {project.link ? (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 hover:underline"
                    >
                      {project.title}
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  ) : (
                    project.title
                  )}
                </h3>
                
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {project.description}
                </p>

              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  )
}