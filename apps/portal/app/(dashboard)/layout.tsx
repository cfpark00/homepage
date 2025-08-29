import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PortalLayoutSimple } from '@/components/portal-layout-simple'
import { getAllProjects } from '@/lib/projects'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not authenticated, redirect to login
  if (!user) {
    redirect('/auth/login')
  }
  
  // Load all projects for sidebar
  const projects = await getAllProjects()

  return (
    <PortalLayoutSimple 
      userEmail={user.email} 
      userMetadata={user.user_metadata} 
      projects={projects}
    >
      {children}
    </PortalLayoutSimple>
  )
}