import { MetadataRoute } from 'next'
import fs from 'fs/promises'
import path from 'path'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.corefranciscopark.com'
  
  // Static routes
  const staticRoutes = [
    '',
    '/cv',
    '/publications',
    '/talks',
    '/news',
    '/blog',
    '/projects',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Dynamic blog posts
  const blogDir = path.join(process.cwd(), 'content/blog')
  const blogFolders = await fs.readdir(blogDir)
  const blogPosts = blogFolders
    .filter(folder => !folder.startsWith('.') && folder !== 'metadata.json')
    .map(slug => ({
      url: `${baseUrl}/blog/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

  // Dynamic project pages
  const projectsDir = path.join(process.cwd(), 'content/projects')
  const projectFolders = await fs.readdir(projectsDir)
  const projects = projectFolders
    .filter(folder => !folder.startsWith('.') && folder !== 'metadata.json')
    .map(slug => ({
      url: `${baseUrl}/projects/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

  return [...staticRoutes, ...blogPosts, ...projects]
}