import { notFound } from 'next/navigation'
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { getProjects, getProject } from '@/lib/projects'
import MDXContent from '@/components/mdx-content'

export async function generateStaticParams() {
  const projects = await getProjects()
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Get project metadata
  const project = await getProject(slug)
  if (!project) {
    notFound()
  }

  return (
    <article className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/projects">
              <ArrowLeft className="mr-2 h-4 w-4" />
              All Projects
            </Link>
          </Button>
          
          <h1 className="mb-4 text-4xl font-bold">
            {project.title}
          </h1>
          
          <p className="text-lg text-muted-foreground">{project.excerpt}</p>
        </div>

        <div className="prose prose-neutral dark:prose-invert max-w-none prose-h1:mt-6 prose-h2:mt-4">
          <MDXContent slug={slug} type="projects" />
        </div>
      </div>
    </article>
  )
}