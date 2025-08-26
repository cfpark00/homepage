'use client'

import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

export function BackToTOC() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      // Show button when page is scrolled past the TOC section
      if (window.scrollY > 600) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  const scrollToTOC = () => {
    document.getElementById('table-of-contents')?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start' 
    })
  }

  if (!isVisible) return null

  return (
    <button
      onClick={scrollToTOC}
      className="fixed bottom-8 right-8 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-opacity hover:opacity-80"
      aria-label="Back to Table of Contents"
      title="Back to Table of Contents"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  )
}