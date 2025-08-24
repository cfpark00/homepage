'use client'

import BlogPost from '@/content/blog/random-walks-visualization/index.mdx'
import { Badge } from "@workspace/ui/components/badge"
import { CalendarDays, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import RandomWalk from '@/content/blog/random-walks-visualization/random-walk'

const metadata = {
  title: "Visualizing Random Walks",
  date: "2025-01-23",
  author: "Core Francisco Park",
  tags: ["mathematics", "probability", "visualization", "interactive"]
}

export default function RandomWalksPost() {
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
          
          <h1 className="mb-4 text-4xl font-bold">{metadata.title}</h1>
          
          <div className="mb-6 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-3 w-3" />
              {metadata.author}
            </span>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(metadata.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
          
          {metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {metadata.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <BlogPost components={{ RandomWalk }} />
        </div>
      </div>
    </article>
  )
}