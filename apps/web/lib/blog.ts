import fs from 'fs'
import path from 'path'

export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  readingTime?: string
}

// Load metadata from JSON file
function loadMetadata(): Record<string, Omit<BlogPost, 'slug'>> {
  const metadataPath = path.join(process.cwd(), 'content/blog/metadata.json')
  const metadataContent = fs.readFileSync(metadataPath, 'utf-8')
  const metadata = JSON.parse(metadataContent)
  return metadata.posts
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const metadata = loadMetadata()
  const contentDir = path.join(process.cwd(), 'content/blog')
  
  // Get all folders in the blog content directory
  const folders = fs.readdirSync(contentDir).filter(item => {
    if (item === 'metadata.json') return false // Skip metadata file
    const itemPath = path.join(contentDir, item)
    return fs.statSync(itemPath).isDirectory()
  })

  // Map folders to blog posts using metadata
  const posts = folders
    .filter(slug => metadata[slug]) // Only include folders with metadata
    .map(slug => ({
      slug,
      ...metadata[slug]
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const metadata = loadMetadata()
  const postMetadata = metadata[slug]
  if (!postMetadata) return null

  return {
    slug,
    ...postMetadata
  }
}