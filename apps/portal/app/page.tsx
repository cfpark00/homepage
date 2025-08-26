import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LogoutButton } from '@/components/logout-button'

// Mock projects data - in production, fetch from database
const projects = [
  {
    slug: 'neural-scaling',
    name: 'Neural Scaling Laws',
    description: 'Investigating compute-optimal training strategies for large language models',
    itemCount: 5,
    lastUpdated: '2024-01-26'
  },
  {
    slug: 'quantum-computing',
    name: 'Quantum Computing Simulations',
    description: 'Classical simulations of quantum algorithms and error correction',
    itemCount: 3,
    lastUpdated: '2024-01-25'
  },
  {
    slug: 'climate-models',
    name: 'Climate Model Analysis',
    description: 'Statistical analysis of regional climate model predictions',
    itemCount: 8,
    lastUpdated: '2024-01-24'
  }
]

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // If not authenticated, redirect to login
  if (!user) {
    redirect('/auth/login')
  }

  // Show dashboard for authenticated users
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-5xl font-bold mb-4">Research Portal</h1>
              <p className="text-xl text-muted-foreground">
                Private workspace for research projects and experiments
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user.email}</span>
              <LogoutButton />
            </div>
          </div>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Your Projects</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.slug}
                href={`/${project.slug}`}
                className="group relative overflow-hidden rounded-lg border p-6 hover:shadow-lg transition-shadow"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    {project.name}
                  </h3>
                  <span className="inline-flex items-center mt-2 px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800">
                    🔒 Private
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{project.itemCount} items</span>
                  <span>Updated {project.lastUpdated}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-12 p-6 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Try Share Links</h2>
          <p className="text-sm text-muted-foreground mb-4">
            These are public share links that work without authentication:
          </p>
          <ul className="space-y-2">
            <li>
              <Link 
                href="/neural-scaling/s/demo123" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                /neural-scaling/s/demo123
              </Link>
              <span className="text-sm text-muted-foreground ml-2">
                - Public access to Neural Scaling research
              </span>
            </li>
            <li>
              <Link 
                href="/quantum-computing/s/xyz789" 
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                /quantum-computing/s/xyz789
              </Link>
              <span className="text-sm text-muted-foreground ml-2">
                - Shared quantum simulation results
              </span>
            </li>
          </ul>
        </section>

        <footer className="pt-8 border-t text-center text-sm text-muted-foreground">
          <p>Portal by Core Francisco Park</p>
        </footer>
      </div>
    </div>
  )
}