import { notFound } from 'next/navigation'
import { Badge } from "@workspace/ui/components/badge"
import { CalendarDays, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { getBlogPosts, getBlogPost } from '@/lib/blog'
import MDXContent from '@/components/mdx-content'
import { ShareButton } from '@/components/share-button'

// Component registry for special interactive components
const getComponents = (slug: string) => {
  if (slug === 'random-walks-visualization') {
    // Dynamically import the RandomWalk component
    const RandomWalk = require('@/content/blog/random-walks-visualization/random-walk').default
    return { RandomWalk }
  }
  return {}
}

export async function generateStaticParams() {
  const posts = await getBlogPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  
  // Get blog post metadata
  const post = await getBlogPost(slug)
  if (!post) {
    notFound()
  }

  // Get components for this specific blog post
  const components = getComponents(slug)

  return (
    <article className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          
          <div className="flex items-start justify-between mb-4">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <ShareButton url={`/blog/${slug}`} size="icon" variant="outline" className="ml-4 flex-shrink-0" />
          </div>
          
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Core Francisco Park
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {post.readingTime && (
              <span>{post.readingTime}</span>
            )}
          </div>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <MDXContent slug={slug} type="blog" components={components} />
        </div>
      </div>
    </article>
  )
}