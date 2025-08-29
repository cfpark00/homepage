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
  type: 'experiment' | 'dataset' | 'paper' | 'document' | 'analysis' | 'model' | 'code' | 'milestone' | 'repository' | 'web-article' | 'blog-post' | 'tweet'
  tab?: string
  tags?: string[]
  shared: boolean
  shareLink?: string
  lastModified: string
  description?: string
  priority?: number
  publicationDate?: string
  authors?: string[]
  link?: string
  projectSlug?: string // Will be added when collecting papers
  projectName?: string // Display name of the project
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
  focus?: boolean
}

export interface Thought {
  content: string
  time: string
  tags?: string[]
  parent_id?: [string, number]
}

export interface DailyThoughts {
  date: string
  title: string
  thoughts: Thought[]
}

export interface Project extends ProjectMetadata {
  items: ProjectItem[]
  thoughts?: DailyThoughts[]
  overview?: any
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
    const itemsPath = path.join(projectDir, 'literature.json')
    const itemsData = JSON.parse(fs.readFileSync(itemsPath, 'utf-8'))
    
    // Read thoughts if file exists (support both formats)
    let thoughts: DailyThoughts[] = []
    const thoughtsPath = path.join(projectDir, 'thoughts.json')
    if (fs.existsSync(thoughtsPath)) {
      const thoughtsData = JSON.parse(fs.readFileSync(thoughtsPath, 'utf-8'))
      // Check if it's already in daily format (array)
      if (Array.isArray(thoughtsData)) {
        thoughts = thoughtsData
      } else if (thoughtsData.thoughts && Array.isArray(thoughtsData.thoughts)) {
        // Handle old format {"thoughts": []}
        thoughts = thoughtsData.thoughts
      }
    }
    
    // Add "Project created" thought at creation date
    if (metadata.created) {
      const createdDate = metadata.created.split('T')[0] // Get YYYY-MM-DD part
      
      // Check if we already have thoughts for the creation date
      const existingCreationDateThoughts = thoughts.find(dt => dt.date === createdDate)
      
      if (existingCreationDateThoughts) {
        // Check if "Project created" thought already exists
        const hasProjectCreatedThought = existingCreationDateThoughts.thoughts.some(
          t => t.content === 'Project created' && t.time === '00:00'
        )
        
        if (!hasProjectCreatedThought) {
          // Add "Project created" thought at the beginning
          existingCreationDateThoughts.thoughts.unshift({
            content: 'Project created',
            time: '00:00',
            tags: ['milestone', 'project']
          })
        }
      } else {
        // Create new daily thoughts entry for creation date
        const creationDateThoughts: DailyThoughts = {
          date: createdDate,
          title: `Project ${metadata.name} Created`,
          thoughts: [{
            content: 'Project created',
            time: '00:00',
            tags: ['milestone', 'project']
          }]
        }
        
        // Insert at the correct position (maintain chronological order)
        const insertIndex = thoughts.findIndex(dt => dt.date < createdDate)
        if (insertIndex === -1) {
          thoughts.push(creationDateThoughts)
        } else {
          thoughts.splice(insertIndex, 0, creationDateThoughts)
        }
      }
    }
    
    // Read overview if file exists
    let overview = null
    const overviewPath = path.join(projectDir, 'overview.json')
    if (fs.existsSync(overviewPath)) {
      overview = JSON.parse(fs.readFileSync(overviewPath, 'utf-8'))
    }
    
    return {
      ...metadata,
      items: itemsData.items,
      thoughts,
      overview
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

export async function getProjectStats() {
  try {
    const projects = await getAllProjects()
    const focusProjects = projects.filter(p => p.focus === true)
    
    // Count unique literature items across all projects
    const uniqueItems = new Set<string>()
    const projectDirs = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    for (const dir of projectDirs) {
      try {
        const itemsPath = path.join(PROJECTS_DIR, dir, 'literature.json')
        if (fs.existsSync(itemsPath)) {
          const itemsContent = fs.readFileSync(itemsPath, 'utf-8')
          const itemsData = JSON.parse(itemsContent)
          const items = itemsData.items || []
          
          // Add each item's ID to the set (deduplicates automatically)
          items.forEach((item: any) => {
            if (item.id) {
              uniqueItems.add(item.id)
            }
          })
        }
      } catch (error) {
        console.error(`Error counting items for ${dir}:`, error)
      }
    }
    
    return {
      totalProjects: projects.length,
      focusProjects: focusProjects.length,
      totalLiteratureItems: uniqueItems.size
    }
  } catch (error) {
    console.error('Error getting project stats:', error)
    return {
      totalProjects: 0,
      focusProjects: 0,
      totalLiteratureItems: 0
    }
  }
}

export async function getStarredPapers(): Promise<ProjectItem[]> {
  try {
    if (!fs.existsSync(PROJECTS_DIR)) {
      return []
    }
    
    const projectDirs = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    const starredPapers: ProjectItem[] = []
    
    for (const dir of projectDirs) {
      try {
        const itemsPath = path.join(PROJECTS_DIR, dir, 'literature.json')
        const metadataPath = path.join(PROJECTS_DIR, dir, 'metadata.json')
        
        if (fs.existsSync(itemsPath) && fs.existsSync(metadataPath)) {
          const itemsContent = fs.readFileSync(itemsPath, 'utf-8')
          const itemsData = JSON.parse(itemsContent)
          const items = itemsData.items || []
          
          const metadataContent = fs.readFileSync(metadataPath, 'utf-8')
          const metadata = JSON.parse(metadataContent)
          const projectName = metadata.name || dir
          
          // Filter for papers with starred flag
          const papers = items
            .filter((item: any) => item.starred === true)
            .map((item: any) => ({ ...item, projectSlug: dir, projectName }))
          
          starredPapers.push(...papers)
        }
      } catch (error) {
        console.error(`Error loading items for ${dir}:`, error)
      }
    }
    
    return starredPapers
  } catch (error) {
    console.error('Error loading starred papers:', error)
    return []
  }
}

export async function getTopPriorityPapers(limit: number = 10): Promise<ProjectItem[]> {
  try {
    if (!fs.existsSync(PROJECTS_DIR)) {
      return []
    }
    
    const projectDirs = fs.readdirSync(PROJECTS_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
    
    const paperMap = new Map<string, ProjectItem>() // Track papers by ID with highest priority
    
    for (const dir of projectDirs) {
      try {
        const itemsPath = path.join(PROJECTS_DIR, dir, 'literature.json')
        const metadataPath = path.join(PROJECTS_DIR, dir, 'metadata.json')
        
        if (fs.existsSync(itemsPath) && fs.existsSync(metadataPath)) {
          const itemsContent = fs.readFileSync(itemsPath, 'utf-8')
          const itemsData = JSON.parse(itemsContent)
          const items = itemsData.items || []
          
          const metadataContent = fs.readFileSync(metadataPath, 'utf-8')
          const metadata = JSON.parse(metadataContent)
          const projectName = metadata.name || dir
          
          // Filter for papers with priority and add project info
          const papers = items
            .filter((item: any) => item.type === 'paper' && item.priority && item.priority > 0)
            .map((item: any) => ({ ...item, projectSlug: dir, projectName }))
          
          // Keep paper with highest priority when duplicates exist
          for (const paper of papers) {
            const existing = paperMap.get(paper.id)
            if (!existing || (paper.priority || 0) > (existing.priority || 0)) {
              paperMap.set(paper.id, paper)
            }
          }
        }
      } catch (error) {
        console.error(`Error loading items for ${dir}:`, error)
      }
    }
    
    const allPapers = Array.from(paperMap.values())
    
    // Sort by priority (highest first) and return top N
    allPapers.sort((a, b) => (b.priority || 0) - (a.priority || 0))
    
    return allPapers.slice(0, limit)
  } catch (error) {
    console.error('Error loading priority papers:', error)
    return []
  }
}