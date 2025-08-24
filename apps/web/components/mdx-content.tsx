'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'

interface MDXContentProps {
  slug: string
  type: 'blog' | 'projects'
}

export default function MDXContent({ slug, type }: MDXContentProps) {
  // Dynamically import MDX content based on type and slug
  const Content = useMemo(
    () => dynamic(
      () => import(`@/content/${type}/${slug}/index.mdx`)
        .catch(() => {
          // Return a component that renders an error message
          return { 
            default: () => <div className="text-muted-foreground">Content not found: {type}/{slug}</div> 
          }
        }),
      {
        loading: () => <div className="text-muted-foreground">Loading content...</div>,
      }
    ),
    [slug, type]
  )
  
  return <Content />
}