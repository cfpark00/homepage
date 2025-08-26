import Link from 'next/link'

export default function TestPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Portal Test Page</h1>
          <p className="text-lg text-muted-foreground">
            Test various portal features and access patterns
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">🔓 Public Share Links</h2>
          <p className="text-sm text-muted-foreground mb-4">
            These links work without authentication - anyone with the link can view:
          </p>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <Link 
                href="/neural-scaling/s/demo123" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
              >
                /neural-scaling/s/demo123
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                Public access to Neural Scaling Laws research findings
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Link 
                href="/quantum-computing/s/xyz789" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
              >
                /quantum-computing/s/xyz789
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                Shared quantum simulation results and visualizations
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">🔒 Private Project Links</h2>
          <p className="text-sm text-muted-foreground mb-4">
            These require authentication - will redirect to login:
          </p>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <Link 
                href="/neural-scaling" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
              >
                /neural-scaling
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                Full project access (requires login)
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Link 
                href="/quantum-computing" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
              >
                /quantum-computing
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                Full project access (requires login)
              </p>
            </div>
            <div className="p-4 border rounded-lg">
              <Link 
                href="/climate-models" 
                className="text-blue-600 dark:text-blue-400 hover:underline font-mono"
              >
                /climate-models
              </Link>
              <p className="text-sm text-muted-foreground mt-1">
                Full project access (requires login)
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">🔑 Authentication</h2>
          <div className="flex gap-4">
            <Link 
              href="/auth/login" 
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Login
            </Link>
            <Link 
              href="/auth/signup" 
              className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Sign Up
            </Link>
            <Link 
              href="/" 
              className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Homepage
            </Link>
          </div>
        </section>

        <section className="p-6 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
          <h3 className="font-semibold mb-2">⚠️ Test Tokens</h3>
          <p className="text-sm text-muted-foreground">
            Valid test tokens for this demo:
          </p>
          <ul className="mt-2 text-sm font-mono">
            <li>• neural-scaling: demo123, abc123</li>
            <li>• quantum-computing: xyz789</li>
          </ul>
        </section>
      </div>
    </div>
  )
}