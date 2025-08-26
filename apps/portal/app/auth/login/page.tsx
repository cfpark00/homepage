'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getURL } from '@/lib/utils/url'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { Button } from '@workspace/ui/components/button'
import { Input } from '@workspace/ui/components/input'
import { Label } from '@workspace/ui/components/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@workspace/ui/components/card'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${getURL()}auth/callback`,
      }
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Left side - Login form */}
      <div className="flex w-full flex-col justify-center px-8 md:px-12 lg:w-1/2 lg:px-16 xl:px-24">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight">Core's Research Portal</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Workspace for collaboration, research tracking and sharing.
            </p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Sign in</CardTitle>
            </CardHeader>
            <form onSubmit={handleLogin}>
              <CardContent className="space-y-4">
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    required
                  />
                </div>
              </CardContent>
              
              <CardFooter className="flex flex-col space-y-4">
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign in
                </Button>
                
                <div className="relative w-full">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Sign in with Google
                </Button>
                
                <div className="flex flex-col space-y-2 text-center text-sm">
                  <span>
                    Don't have an account?{' '}
                    <Link 
                      href="/auth/signup" 
                      className="font-medium text-primary hover:underline"
                    >
                      Create one
                    </Link>
                  </span>
                </div>
              </CardFooter>
            </form>
          </Card>
          
          {/* Mobile-only public shares button */}
          <Link href="/explore" className="lg:hidden">
            <Button 
              className="w-full mt-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 hover:opacity-90"
            >
              Explore all public research →
            </Button>
          </Link>
          
          <p className="mt-8 text-center text-xs text-muted-foreground">
            By signing in, you agree to our{' '}
            <Link href="#" className="underline hover:text-foreground">
              Terms
            </Link>{' '}
            and{' '}
            <Link href="#" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      {/* Right side - Public Links */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        
        {/* Floating public project links */}
        <div className="relative z-10 w-full h-full flex items-center justify-center p-12">
          <div className="relative w-full h-full max-w-2xl max-h-[600px]">
            {/* Sample public research links floating around */}
            {[
              { title: "Neural Scaling Laws", href: "/neural-scaling/s/demo123", description: "Public access to Neural Scaling Laws research findings", top: "15%", left: "10%", delay: "0s" },
              { title: "Quantum Computing", href: "/quantum-computing/s/xyz789", description: "Shared quantum simulation results and visualizations", top: "25%", left: "55%", delay: "0.5s" },
              { title: "Climate Data Analysis", href: "#", top: "45%", left: "15%", delay: "1s" },
              { title: "Protein Folding Research", href: "#", top: "55%", left: "50%", delay: "1.5s" },
              { title: "Machine Learning Models", href: "#", top: "70%", left: "25%", delay: "2s" },
              { title: "Genomics Database", href: "#", top: "35%", left: "35%", delay: "2.5s" },
              { title: "Physics Simulations", href: "#", top: "75%", left: "55%", delay: "3s" },
              { title: "Data Visualization Tools", href: "#", top: "50%", left: "5%", delay: "3.5s" },
            ].map((project, i) => (
              <a
                key={i}
                href={project.href}
                className="absolute px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-all duration-300 hover:scale-105 whitespace-nowrap"
                style={{
                  top: project.top,
                  left: project.left,
                  animation: `float ${4 + i * 0.3}s ease-in-out infinite`,
                  animationDelay: project.delay,
                }}
              >
                <span className="text-sm font-medium">{project.title}</span>
              </a>
            ))}
            
          </div>
          
          {/* Explore all button in bottom right */}
          <Link 
            href="/explore" 
            className="absolute bottom-4 right-4 px-4 py-2 bg-white/20 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-all duration-300 hover:scale-105 text-sm"
          >
            Explore all public research →
          </Link>
        </div>

        {/* Add floating animation keyframes */}
        <style jsx>{`
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) translateX(0px);
            }
            33% {
              transform: translateY(-15px) translateX(5px);
            }
            66% {
              transform: translateY(10px) translateX(-5px);
            }
          }
        `}</style>
      </div>
    </div>
  )
}