"use client"

import { createContext, useContext, useState, useEffect } from "react"

type FontSize = "prose-sm" | "prose-base" | "prose-lg" | "prose-xl"

interface FontSizeContextType {
  fontSize: FontSize
  setFontSize: (size: FontSize) => void
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined)

export function useFontSize() {
  const context = useContext(FontSizeContext)
  if (!context) {
    throw new Error("useFontSize must be used within FontSizeProvider")
  }
  return context
}

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSize] = useState<FontSize>("prose-base")

  useEffect(() => {
    // Load saved preference on mount
    const saved = localStorage.getItem("blog-font-size") as FontSize
    if (saved && ["prose-sm", "prose-base", "prose-lg", "prose-xl"].includes(saved)) {
      setFontSize(saved)
    }
  }, [])

  const handleSetFontSize = (size: FontSize) => {
    setFontSize(size)
    localStorage.setItem("blog-font-size", size)
  }

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize: handleSetFontSize }}>
      {children}
    </FontSizeContext.Provider>
  )
}