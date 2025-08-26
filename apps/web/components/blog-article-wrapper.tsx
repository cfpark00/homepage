"use client"

import { useState, useEffect } from "react"
import MDXContent from "./mdx-content"

type FontSize = "prose-sm" | "prose-base" | "prose-lg" | "prose-xl"

interface BlogArticleWrapperProps {
  slug: string
}

export function BlogArticleWrapper({ slug }: BlogArticleWrapperProps) {
  const [fontSize, setFontSize] = useState<FontSize>("prose-base")

  useEffect(() => {
    // Load saved preference on mount
    const saved = localStorage.getItem("blog-font-size") as FontSize
    if (saved) {
      setFontSize(saved)
    }

    // Listen for font size changes from the standalone selector
    const handleFontSizeChange = (event: CustomEvent) => {
      setFontSize(event.detail as FontSize)
    }

    window.addEventListener('fontSizeChange', handleFontSizeChange as EventListener)
    
    return () => {
      window.removeEventListener('fontSizeChange', handleFontSizeChange as EventListener)
    }
  }, [])

  return (
    <div className={`prose ${fontSize} prose-neutral max-w-none dark:prose-invert transition-all duration-200`}>
      <MDXContent slug={slug} type="blog" />
    </div>
  )
}