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
  order?: number  // Optional: explicit ordering (lower numbers first)
}

// Discover projects from content folders
function discoverProjects(): Project[] {
  const contentDir = path.join(process.cwd(), 'content/projects')
  const projects: Project[] = []
  
  // Read all directories in content/projects
  const entries = fs.readdirSync(contentDir, { withFileTypes: true })
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const slug = entry.name
      const metadataPath = path.join(contentDir, slug, 'metadata.json')
      
      // Check if metadata.json exists
      if (fs.existsSync(metadataPath)) {
        try {
          const metadataContent = fs.readFileSync(metadataPath, 'utf-8')
          const metadata = JSON.parse(metadataContent)
          projects.push({
            slug,
            ...metadata
          })
        } catch (error) {
          console.error(`Error reading metadata for project ${slug}:`, error)
        }
      }
    }
  }
  
  // Sort by order (if specified), then alphabetically by title
  projects.sort((a, b) => {
    // If both have order, sort by order (ascending)
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    // If only one has order, it comes first
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    // Otherwise sort alphabetically by title
    return a.title.localeCompare(b.title)
  })
  
  return projects
}

export async function getProjects(): Promise<Project[]> {
  return discoverProjects()
}

export async function getProject(slug: string): Promise<Project | null> {
  const metadataPath = path.join(process.cwd(), 'content/projects', slug, 'metadata.json')
  
  if (!fs.existsSync(metadataPath)) {
    return null
  }
  
  try {
    const metadataContent = fs.readFileSync(metadataPath, 'utf-8')
    const metadata = JSON.parse(metadataContent)
    return {
      slug,
      ...metadata
    }
  } catch (error) {
    console.error(`Error reading metadata for project ${slug}:`, error)
    return null
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects()
  return projects
}