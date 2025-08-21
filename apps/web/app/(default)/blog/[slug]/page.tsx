"use client"

import { useEffect, useState } from "react"
import { Badge } from "@workspace/ui/components/badge"
import { CalendarDays, Clock, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { useParams } from "next/navigation"

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    fetch(`/api/blog/${slug}`)
      .then(res => res.json())
      .then(data => {
        setPost(data)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-4 text-4xl font-bold">Post Not Found</h1>
          <p className="mb-8 text-muted-foreground">
            The blog post you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <article className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/blog">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Blog
            </Link>
          </Button>
          
          <h1 className="mb-4 text-4xl font-bold">{post.title}</h1>
          
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {post.readingTime}
            </span>
          </div>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>
    </article>
  )
}