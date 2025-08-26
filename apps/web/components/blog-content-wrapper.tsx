"use client"

import { FontSizeProvider, useFontSize } from "./blog-font-context"
import { FontSizeSelector } from "./font-size-selector"
import MDXContent from "./mdx-content"

interface BlogContentWrapperProps {
  slug: string
}

function BlogContent({ slug }: BlogContentWrapperProps) {
  const { fontSize } = useFontSize()

  return (
    <div className={`prose ${fontSize} prose-neutral max-w-none dark:prose-invert transition-all duration-200`}>
      <MDXContent slug={slug} type="blog" />
    </div>
  )
}

function BlogFontSelector() {
  const { setFontSize } = useFontSize()
  return <FontSizeSelector onSizeChange={setFontSize} />
}

export function BlogContentWrapper({ slug }: BlogContentWrapperProps) {
  return (
    <FontSizeProvider>
      <BlogContent slug={slug} />
    </FontSizeProvider>
  )
}

BlogContentWrapper.FontSelector = function FontSelector() {
  return (
    <FontSizeProvider>
      <BlogFontSelector />
    </FontSizeProvider>
  )
}

// Combined wrapper for when both are needed in the same context
export function BlogPageWrapper({ 
  slug, 
  children 
}: { 
  slug: string
  children: React.ReactNode 
}) {
  return (
    <FontSizeProvider>
      {children}
      <BlogContent slug={slug} />
    </FontSizeProvider>
  )
}