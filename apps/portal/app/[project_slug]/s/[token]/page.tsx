import { notFound } from 'next/navigation'

// Mock function - in production, verify token with database
async function verifyShareToken(projectSlug: string, token: string) {
  // For demo, accept specific tokens
  const validTokens = {
    'neural-scaling': ['demo123', 'abc123'],
    'quantum-computing': ['xyz789']
  }
  
  return validTokens[projectSlug as keyof typeof validTokens]?.includes(token)
}

export default async function SharedItemPage({
  params
}: {
  params: { project_slug: string; token: string }
}) {
  const isValid = await verifyShareToken(params.project_slug, params.token)
  
  if (!isValid) {
    notFound()
  }

  // In production, fetch the specific item this token grants access to
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
          <p className="text-sm text-blue-600 dark:text-blue-400">
            🔗 You're viewing this via a shared link
          </p>
        </div>
        
        <h1 className="text-4xl font-bold mb-4">
          Shared: Neural Scaling Laws Research
        </h1>
        
        <div className="prose dark:prose-invert max-w-none">
          <h2>Abstract</h2>
          <p>
            This is a publicly shared research artifact from the {params.project_slug} project.
            The content is accessible to anyone with this link.
          </p>
          
          <h2>Key Findings</h2>
          <ul>
            <li>Performance scales predictably with model size</li>
            <li>Data requirements follow power law relationships</li>
            <li>Compute-optimal training strategies identified</li>
          </ul>
          
          <h2>Interactive Visualization</h2>
          <div className="my-8 p-8 border-2 border-dashed rounded-lg text-center text-muted-foreground">
            [Interactive chart would go here]
          </div>
          
          <h2>Methods</h2>
          <p>
            We trained a series of transformer models ranging from 10M to 10B parameters
            on diverse text corpora, measuring performance across multiple benchmarks...
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t">
          <p className="text-sm text-muted-foreground">
            Share token: {params.token} | Project: {params.project_slug}
          </p>
        </div>
      </div>
    </div>
  )
}