'use client'

import { useMDXComponents } from '@mdx-js/react'

interface MDXContentProps {
  slug: string
  components?: Record<string, any>
}

export default function MDXContent({ slug, components = {} }: MDXContentProps) {
  // Dynamically import MDX content based on slug
  let Content: any = () => <div>Loading...</div>
  
  // Blog posts
  if (slug === 'welcome-to-my-blog') {
    Content = require('@/content/blog/welcome-to-my-blog/index.mdx').default
  } else if (slug === 'random-walks-visualization') {
    Content = require('@/content/blog/random-walks-visualization/index.mdx').default
  }
  // Projects
  else if (slug === 'research-tracking') {
    Content = require('@/content/projects/research-tracking/index.mdx').default
  } else if (slug === 'evolving-research') {
    Content = require('@/content/projects/evolving-research/index.mdx').default
  }

  const mdxComponents = useMDXComponents(components)
  
  return <Content components={mdxComponents} />
}