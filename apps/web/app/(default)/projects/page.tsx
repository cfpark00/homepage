import { getProjects } from '@/lib/projects'
import { ProjectCards } from '@/components/project-cards'

export default async function ProjectsPage() {
  const projects = await getProjects()

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Projects</h1>
        </div>

        <ProjectCards projects={projects} />
      </div>
    </div>
  )
}