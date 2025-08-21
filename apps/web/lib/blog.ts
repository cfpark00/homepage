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

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
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