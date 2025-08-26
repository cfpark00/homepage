"use client"

import { FontSizeSelector } from "./font-size-selector"

interface StandaloneFontSelectorProps {
  onSizeChange?: (size: string) => void
}

export function BlogFontSelectorStandalone({ onSizeChange }: StandaloneFontSelectorProps = {}) {
  const handleSizeChange = (size: string) => {
    // Store in localStorage for the BlogArticleWrapper to pick up
    localStorage.setItem("blog-font-size", size)
    // Dispatch a custom event so the article wrapper can listen for changes
    window.dispatchEvent(new CustomEvent('fontSizeChange', { detail: size }))
    onSizeChange?.(size)
  }

  return <FontSizeSelector onSizeChange={handleSizeChange} />
}