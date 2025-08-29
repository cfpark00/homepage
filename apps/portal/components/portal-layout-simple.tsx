"use client"

import { SidebarSimple } from './sidebar-simple'
import { SidebarProvider, useSidebar } from './sidebar-context'
import { Menu } from 'lucide-react'
import { cn } from '@workspace/ui/lib/utils'

interface PortalLayoutProps {
  children: React.ReactNode
  userEmail?: string
  userMetadata?: any
  projects?: Array<{
    slug: string
    name: string
    icon?: string
    logo?: string
    color?: string
  }>
}

function PortalLayoutInner({ children, userEmail, userMetadata, projects }: PortalLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <SidebarSimple 
        userEmail={userEmail} 
        userMetadata={userMetadata} 
        projects={projects}
      />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
    </div>
  )
}

export function PortalLayoutSimple(props: PortalLayoutProps) {
  return (
    <SidebarProvider>
      <PortalLayoutInner {...props} />
    </SidebarProvider>
  )
}

// Export the hamburger button as a separate component that pages can use
export function HamburgerButton() {
  const { toggleSidebar, isDesktopCollapsed } = useSidebar()
  
  return (
    <button
      onClick={toggleSidebar}
      className={cn(
        "p-2 -ml-2 rounded-lg hover:bg-muted transition-colors",
        isDesktopCollapsed ? "block" : "lg:hidden"
      )}
    >
      <Menu className="h-5 w-5" />
    </button>
  )
}