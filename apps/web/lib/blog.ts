import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import readingTime from 'reading-time'

const postsDirectory = path.join(process.cwd(), 'content/blog')

export type BlogPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  author: string
  tags: string[]
  readingTime: string
  content: string
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const entries = fs.readdirSync(postsDirectory)
  const allPostsData = entries
    .map((entry) => {
      const fullPath = path.join(postsDirectory, entry)
      const stat = fs.statSync(fullPath)
      
      let slug = ''
      let fileContents = ''
      
      if (stat.isDirectory()) {
        // Check for index.mdx in folder
        const indexPath = path.join(fullPath, 'index.mdx')
        if (fs.existsSync(indexPath)) {
          slug = entry
          fileContents = fs.readFileSync(indexPath, 'utf8')
          
          // For random-walks-visualization, use hardcoded metadata
          if (slug === 'random-walks-visualization') {
            return {
              slug,
              title: 'Visualizing Random Walks',
              date: '2025-01-23',
              excerpt: 'An interactive exploration of random walks on a 2D grid, with live visualization and statistical insights.',
              author: 'Core Francisco Park',
              tags: ['mathematics', 'probability', 'visualization', 'interactive'],
              readingTime: '5 min read',
              content: fileContents,
            }
          }
        } else {
          return null
        }
      } else if (entry.endsWith('.mdx') || entry.endsWith('.md')) {
        // Regular file
        slug = entry.replace(/\.mdx?$/, '')
        fileContents = fs.readFileSync(fullPath, 'utf8')
      } else {
        return null
      }
      
      const { data, content } = matter(fileContents)
      const stats = readingTime(content)

      return {
        slug,
        title: data.title || 'Untitled',
        date: data.date || new Date().toISOString(),
        excerpt: data.excerpt || '',
        author: data.author || 'Anonymous',
        tags: data.tags || [],
        readingTime: stats.text,
        content,
      }
    })
    .filter(Boolean) as BlogPost[]

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getPostBySlug(slug: string): BlogPost | null {
  const fullPath = path.join(postsDirectory, `${slug}.mdx`)
  const fallbackPath = path.join(postsDirectory, `${slug}.md`)
  
  let fileContents: string
  
  if (fs.existsSync(fullPath)) {
    fileContents = fs.readFileSync(fullPath, 'utf8')
  } else if (fs.existsSync(fallbackPath)) {
    fileContents = fs.readFileSync(fallbackPath, 'utf8')
  } else {
    return null
  }
  
  const { data, content } = matter(fileContents)
  const stats = readingTime(content)

  return {
    slug,
    title: data.title || 'Untitled',
    date: data.date || new Date().toISOString(),
    excerpt: data.excerpt || '',
    author: data.author || 'Anonymous',
    tags: data.tags || [],
    readingTime: stats.text,
    content,
  }
}