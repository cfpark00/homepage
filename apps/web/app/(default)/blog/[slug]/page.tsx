import { notFound } from 'next/navigation'
import { Badge } from "@workspace/ui/components/badge"
import { CalendarDays, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { getBlogPosts, getBlogPost } from '@/lib/blog'
import { ShareButton } from '@/components/share-button'
import { BetaPasswordGuard } from '@/components/beta-password-guard'
import { BlogArticleWrapper } from '@/components/blog-article-wrapper'
import { BlogFontSelectorStandalone } from '@/components/blog-font-selector-standalone'

export async function generateStaticParams() {
  const posts = await getBlogPosts(true) // Include beta posts for static generation
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

  // Determine back link based on whether post is beta
  const backLink = post.beta ? "/blog/beta" : "/blog"
  const backText = post.beta ? "Beta Research" : "All Posts"

  const content = (
    <article className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" asChild>
              <Link href={backLink}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {backText}
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <BlogFontSelectorStandalone />
              <ShareButton url={`/blog/${slug}`} size="icon" variant="outline" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              Core Francisco Park
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
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
        
        <BlogArticleWrapper slug={slug} />
      </div>
    </article>
  )

  // Wrap beta posts with password protection
  if (post.beta) {
    return <BetaPasswordGuard>{content}</BetaPasswordGuard>
  }

  return content
}