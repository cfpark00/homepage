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

// Metadata for all blog posts - this is the single source of truth
const blogMetadata: Record<string, Omit<BlogPost, 'slug'>> = {
  'welcome-to-my-blog': {
    title: 'Welcome to My Blog',
    date: '2025-01-20',
    excerpt: 'An introduction to my personal blog and what you can expect to find here.',
    tags: ['test'],
    readingTime: '2 min read'
  },
  'random-walks-visualization': {
    title: 'Visualizing Random Walks',
    date: '2025-08-23',
    excerpt: 'Interactive visualization and exploration of random walks in 2D space with real-time statistics.',
    tags: ['probability', 'visualization', 'interactive', 'test'],
    readingTime: '5 min read'
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const contentDir = path.join(process.cwd(), 'content/blog')
  
  // Get all folders in the blog content directory
  const folders = fs.readdirSync(contentDir).filter(item => {
    const itemPath = path.join(contentDir, item)
    return fs.statSync(itemPath).isDirectory()
  })

  // Map folders to blog posts using metadata
  const posts = folders
    .filter(slug => blogMetadata[slug]) // Only include folders with metadata
    .map(slug => ({
      slug,
      ...blogMetadata[slug]
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return posts
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const metadata = blogMetadata[slug]
  if (!metadata) return null

  return {
    slug,
    ...metadata
  }
}

// Export metadata for use in the dynamic page
export { blogMetadata }