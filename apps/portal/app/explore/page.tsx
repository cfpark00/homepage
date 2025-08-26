'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@workspace/ui/components/card'

export default function ExplorePage() {
  const publicProjects = [
    { 
      title: "Neural Scaling Laws", 
      href: "/neural-scaling/s/demo123", 
      description: "Public access to Neural Scaling Laws research findings" 
    },
    { 
      title: "Quantum Computing", 
      href: "/quantum-computing/s/xyz789", 
      description: "Shared quantum simulation results and visualizations" 
    },
    { 
      title: "Climate Data Analysis", 
      href: "#", 
      description: "Interactive climate data visualizations and trends" 
    },
    { 
      title: "Protein Folding Research", 
      href: "#", 
      description: "3D protein structure predictions and analysis" 
    },
    { 
      title: "Machine Learning Models", 
      href: "#", 
      description: "Pre-trained models and benchmarks" 
    },
    { 
      title: "Genomics Database", 
      href: "#", 
      description: "Open genomic sequences and annotations" 
    },
    { 
      title: "Physics Simulations", 
      href: "#", 
      description: "Interactive physics experiments and simulations" 
    },
    { 
      title: "Data Visualization Tools", 
      href: "#", 
      description: "Open-source data visualization libraries" 
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/auth/login">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold tracking-tight mb-2">Explore Public Research</h1>
          <p className="text-muted-foreground">
            Discover collaborative projects and shared research from our community
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {publicProjects.map((project, i) => (
            <Link 
              key={i} 
              href={project.href}
              className="block transition-transform hover:scale-[1.02]"
            >
              <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="text-sm">
                    {project.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <span className="text-xs text-muted-foreground">
                    {project.href === '#' ? 'Coming soon' : 'View project →'}
                  </span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground">
            These are publicly shared research projects. 
            <br />
            <Link href="/auth/signup" className="text-primary hover:underline">
              Create an account
            </Link>
            {' '}to share your own research.
          </p>
        </div>
      </div>
    </div>
  )
}