import fs from 'fs'
import path from 'path'

export interface ProjectTab {
  id: string
  label: string
  icon: string
}

export interface ProjectItem {
  id: string
  name: string
  type: 'experiment' | 'dataset' | 'document' | 'analysis' | 'model' | 'code'
  tab?: string
  shared: boolean
  shareLink?: string
  lastModified: string
  description?: string
}

export interface ProjectMetadata {
  slug: string
  name: string
  description: string
  status: 'active' | 'inactive' | 'archived'
  created: string
  last_updated_at?: string
  icon: string
  logo?: string
  color: string
  tabs: ProjectTab[]
}

export interface Project extends ProjectMetadata {
  items: ProjectItem[]
}

const PROJECTS_DIR = path.join(process.cwd(), 'content/projects')

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const projectDir = path.join(PROJECTS_DIR, slug)
    
    // Check if project directory exists
    if (!fs.existsSync(projectDir)) {
      return null
    }
    
    // Read metadata
    const metadataPath = path.join(projectDir, 'metadata.json')
    const metadata: ProjectMetadata = JSON.parse(
      fs.readFileSync(metadataPath, 'utf-8')
    )
    
    // Read items
    const itemsPath = path.join(projectDir, 'items.json')
    const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf-8'))
    
    return {
      ...metadata,
      items: itemsData.items
    }
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error)
    return null
  }
}

export async function getAllProjects(): Promise<ProjectMetadata[]> {
  try {
    // Check if projects directory exists
    if (!fs.existsSync(PROJECTS_DIR)) {
      return []
    }
    
    const projectDirs = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    const projects: ProjectMetadata[] = []
    
    for (const dir of projectDirs) {
      try {
        const metadataPath = path.join(PROJECTS_DIR, dir, 'metadata.json')
        if (fs.existsSync(metadataPath)) {
          const metadataContent = fs.readFileSync(metadataPath, 'utf-8')
          const metadata: ProjectMetadata = JSON.parse(metadataContent)
          projects.push(metadata)
        }
      } catch (error) {
        console.error(`Error loading metadata for ${dir}:`, error)
      }
    }
    
    // Sort projects by last_updated_at (newest first), then by created date
    projects.sort((a, b) => {
      const dateA = a.last_updated_at || a.created
      const dateB = b.last_updated_at || b.created
      return new Date(dateB).getTime() - new Date(dateA).getTime()
    })
    
    return projects
  } catch (error) {
    console.error('Error loading projects:', error)
    return []
  }
}