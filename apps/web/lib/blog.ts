import fs from 'fs'
import path from 'path'

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  readingTime?: string
  beta?: boolean
  order?: number  // Optional: explicit ordering (lower numbers first)
}

// Discover posts from content folders
function discoverPosts(): BlogPost[] {
  const contentDir = path.join(process.cwd(), 'content/blog')
  const posts: BlogPost[] = []
  
  // Read all directories in content/blog
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
          posts.push({
            slug,
            ...metadata
          })
        } catch (error) {
          console.error(`Error reading metadata for ${slug}:`, error)
        }
      }
    }
  }
  
  // Sort by order (if specified), then by date (newest first)
  posts.sort((a, b) => {
    // If both have order, sort by order (ascending)
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    // If only one has order, it comes first
    if (a.order !== undefined) return -1
    if (b.order !== undefined) return 1
    // Otherwise sort by date (newest first)
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
  
  return posts
}

export async function getBlogPosts(includeBeta: boolean = false): Promise<BlogPost[]> {
  const posts = discoverPosts()
  
  // Filter out beta posts unless requested
  return posts.filter(post => includeBeta || !post.beta)
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const metadataPath = path.join(process.cwd(), 'content/blog', slug, 'metadata.json')
  
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
    console.error(`Error reading metadata for ${slug}:`, error)
    return null
  }
}