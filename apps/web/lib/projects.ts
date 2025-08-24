import fs from 'fs'
import path from 'path'

export interface Project {
  slug: string
  title: string
  date?: string
  excerpt: string
  isExternal?: boolean
  externalUrl?: string
  thumbnailUrl?: string
}

// Load metadata from JSON file
function loadMetadata(): Record<string, Omit<Project, 'slug'>> {
  const metadataPath = path.join(process.cwd(), 'content/projects/metadata.json')
  const metadataContent = fs.readFileSync(metadataPath, 'utf-8')
  const metadata = JSON.parse(metadataContent)
  return metadata.projects
}

export async function getProjects(): Promise<Project[]> {
  const metadata = loadMetadata()
  
  // Return all projects from metadata
  const projects = Object.entries(metadata)
    .map(([slug, projectMetadata]) => ({
      slug,
      ...projectMetadata
    }))
    .sort((a, b) => {
      // Sort by date if both have dates, otherwise put dateless projects first
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      }
      if (a.date && !b.date) return 1
      if (!a.date && b.date) return -1
      return 0
    })

  return projects
}

export async function getProject(slug: string): Promise<Project | null> {
  const metadata = loadMetadata()
  const projectMetadata = metadata[slug]
  
  if (!projectMetadata) {
    return null
  }
  
  return {
    slug,
    ...projectMetadata
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects()
  return projects
}