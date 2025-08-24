export interface Project {
  slug: string
  title: string
  subtitle?: string
  date: string
  status: 'planning' | 'active' | 'completed' | 'paused'
  type: 'research' | 'engineering' | 'theoretical'
  excerpt: string
  featured?: boolean
  publications?: string[]
  visualization?: {
    type: 'research-flow' | 'timeline' | 'custom'
    component?: string
  }
}

// Metadata for all projects - this is the single source of truth
const projectMetadata: Record<string, Omit<Project, 'slug'>> = {
  'research-tracking': {
    title: 'Research Tracking System',
    subtitle: 'Tracking the research process',
    date: '2025-01-20',
    status: 'active',
    type: 'research',
    excerpt: 'A system to track questions, experiments, hypotheses, findings, and decisions throughout the research process.',
    featured: true,
    publications: ['markov-icl'],
    visualization: {
      type: 'research-flow',
      component: 'ResearchFlow'
    }
  },
  'evolving-research': {
    title: 'Evolving Research',
    subtitle: 'Digital evolution of discovery',
    date: '2025-01-22',
    status: 'planning',
    type: 'theoretical',
    excerpt: 'Understanding how research and discovery itself has evolved using digital evolution.',
    featured: true
  }
}

export async function getProjects(): Promise<Project[]> {
  // Simply return all projects from metadata
  const projects = Object.entries(projectMetadata)
    .map(([slug, metadata]) => ({
      slug,
      ...metadata
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return projects
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!projectMetadata[slug]) {
    return null
  }
  
  return {
    slug,
    ...projectMetadata[slug]
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects()
  return projects.filter(project => project.featured)
}