import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function ProjectPage({
  params
}: {
  params: Promise<{ project_slug: string }>
}) {
  const { project_slug } = await params
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  
  // ALL projects require authentication
  if (!user) {
    redirect('/auth/login')
  }

  // For now, return a simple project page
  // In production, fetch project data from database
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Project: {project_slug}</h1>
        <p className="text-muted-foreground">
          Private workspace. Share specific items via public links.
        </p>
        
        <div className="mt-8 p-6 border rounded-lg">
          <h2 className="text-2xl font-semibold mb-4">Project Items</h2>
          <ul className="space-y-2">
            <li>• Experiment 1</li>
            <li>• Dataset Analysis</li>
            <li>• Research Notes</li>
          </ul>
        </div>
      </div>
    </div>
  )
}