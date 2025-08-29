"use client"

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  Home, 
  Menu,
  X,
  LogOut,
  Folder,
  Moon,
  Sun,
  Brain,
  TrendingUp,
  ArrowLeftToLine,
  ArrowRightFromLine
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@workspace/ui/lib/utils'
import { useSidebar } from './sidebar-context'

interface SidebarSimpleProps {
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

// Icon mapping for project icons
const iconMap: Record<string, any> = {
  Brain,
  TrendingUp,
  Folder
}

// Color mapping for project colors
const colorMap: Record<string, { color: string, bgColor: string }> = {
  purple: {
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-100 dark:bg-purple-900/20'
  },
  blue: {
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-100 dark:bg-blue-900/20'
  },
  green: {
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-100 dark:bg-green-900/20'
  },
  orange: {
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-100 dark:bg-orange-900/20'
  }
}

export function SidebarSimple({ userEmail, userMetadata, projects = [] }: SidebarSimpleProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()
  const { 
    isMobileOpen, 
    setIsMobileOpen, 
    isDesktopCollapsed, 
    setIsDesktopCollapsed
  } = useSidebar()
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [logoErrors, setLogoErrors] = useState<Record<string, boolean>>({})

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Check for Google avatar from user metadata
    if (userMetadata?.avatar_url || userMetadata?.picture) {
      const googleAvatar = userMetadata.avatar_url || userMetadata.picture
      setAvatarUrl(googleAvatar)
      // Cache in localStorage
      if (userEmail) {
        localStorage.setItem(`avatar_${userEmail}`, googleAvatar)
      }
    } else if (userEmail) {
      // Try to get from cache if not in metadata
      const cached = localStorage.getItem(`avatar_${userEmail}`)
      if (cached) {
        setAvatarUrl(cached)
      }
    }
  }, [userEmail, userMetadata])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  // Generate initials for avatar
  const getInitials = (email: string) => {
    if (!email) return 'U'
    const parts = email.split('@')[0].split('.')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return email.slice(0, 2).toUpperCase()
  }

  return (
    <>
      {/* Overlay for mobile only */}
      {isMobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-40 h-full w-64 bg-background border-r flex flex-col shadow-xl",
        "transition-transform duration-300 ease-in-out",
        // Mobile behavior
        isMobileOpen ? "translate-x-0" : "-translate-x-full",
        // Desktop behavior - MUST reset transform on desktop!
        "lg:translate-x-0 lg:static lg:z-0 lg:shadow-none",
        // When collapsed on desktop, hide it
        isDesktopCollapsed && "lg:-translate-x-full lg:fixed lg:z-40 lg:shadow-xl"
      )}>
        {/* Header - Dashboard + Theme Toggle */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className={cn(
                "flex items-center gap-2 hover:opacity-80 transition-opacity",
                pathname === "/" && "opacity-100"
              )}
              onClick={() => setIsMobileOpen(false)}
            >
              <Home className="h-5 w-5 shrink-0" />
              <span className="font-semibold text-lg">Dashboard</span>
            </Link>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-md hover:bg-muted transition-colors"
                title="Toggle theme"
              >
                {mounted ? (
                  theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )
                ) : (
                  <div className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={() => setIsDesktopCollapsed(true)}
                className="hidden lg:flex p-2 rounded-md hover:bg-muted transition-colors"
                title="Collapse sidebar"
              >
                <ArrowLeftToLine className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto p-3">
          {/* Projects Section */}
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-3 mb-3">
            Projects
          </div>
          <div className="space-y-2">
            {projects.map((project) => {
              const projectPath = `/${project.slug}`
              const isActive = pathname.startsWith(projectPath)
              const Icon = iconMap[project.icon || 'Folder'] || Folder
              const hasLogoError = logoErrors[project.slug] || false
              const colorScheme = colorMap[project.color || 'blue'] || colorMap.blue
              
              return (
                <Link
                  key={project.slug}
                  href={projectPath}
                  className={cn(
                    "flex items-center gap-3 p-1 rounded-lg text-sm transition-all",
                    isActive 
                      ? "bg-primary/10 hover:bg-primary/15 font-medium" 
                      : "hover:bg-muted/50"
                  )}
                  onClick={() => setIsMobileOpen(false)}
                >
                  <div className={cn(
                    "relative rounded-md shrink-0 overflow-hidden h-8 w-8 flex items-center justify-center",
                    colorScheme.bgColor
                  )}>
                    {project.logo && !hasLogoError ? (
                      <Image
                        src={project.logo}
                        alt={project.name}
                        width={32}
                        height={32}
                        className="object-cover"
                        onError={() => setLogoErrors(prev => ({ ...prev, [project.slug]: true }))}
                      />
                    ) : (
                      <Icon className={cn(
                        "h-4 w-4",
                        colorScheme.color
                      )} />
                    )}
                  </div>
                  <span className="truncate">{project.name}</span>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Footer with Avatar */}
        <div className="border-t p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative h-8 w-8 rounded-md overflow-hidden bg-muted shrink-0">
                {avatarUrl && (
                  <img 
                    src={avatarUrl}
                    alt={userEmail || 'User'}
                    className="absolute inset-0 h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      // On error, clear cache and hide image
                      console.error('Avatar load error')
                      if (userEmail) {
                        localStorage.removeItem(`avatar_${userEmail}`)
                      }
                      setAvatarUrl(null)
                    }}
                  />
                )}
                {!avatarUrl && (
                  <div className="h-full w-full flex items-center justify-center text-xs font-medium bg-muted">
                    {userEmail ? getInitials(userEmail) : 'U'}
                  </div>
                )}
              </div>
              <span className="text-sm text-muted-foreground truncate">
                {userEmail || 'user@example.com'}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-md hover:bg-muted transition-colors"
              title="Logout"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}