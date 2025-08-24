import { getProjects } from '@/lib/projects'
import { Card, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Ongoing research and engineering projects
          </p>
        </div>

        <div className="space-y-4">
        {projects.map((project) => (
          <Link key={project.slug} href={`/projects/${project.slug}`}>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">
                      {project.title}
                      {project.subtitle && (
                        <span className="text-sm font-normal text-muted-foreground ml-2">
                          — {project.subtitle}
                        </span>
                      )}
                    </CardTitle>
                    <CardDescription>{project.excerpt}</CardDescription>
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
        </div>
      </div>
    </div>
  )
}