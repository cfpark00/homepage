"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

interface SidebarContextType {
  isMobileOpen: boolean
  setIsMobileOpen: (open: boolean) => void
  toggleSidebar: () => void
  isDesktopCollapsed: boolean
  setIsDesktopCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
  
  const toggleSidebar = () => {
    if (window.innerWidth >= 1024) { // lg breakpoint
      // On desktop, toggle the collapsed state
      setIsDesktopCollapsed(false)
    } else {
      // On mobile, toggle the open state
      setIsMobileOpen(!isMobileOpen)
    }
  }
  
  return (
    <SidebarContext.Provider value={{ 
      isMobileOpen, 
      setIsMobileOpen, 
      toggleSidebar,
      isDesktopCollapsed,
      setIsDesktopCollapsed
    }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}