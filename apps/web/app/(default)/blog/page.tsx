import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { CalendarDays, Clock, User } from "lucide-react"
import Link from "next/link"
import { getBlogPosts } from "@/lib/blog"
import { ShareButton } from "@/components/share-button"

export default async function BlogPage() {
  const posts = await getBlogPosts()
  
  // Collect all unique tags
  const allTags = new Set<string>()
  posts.forEach(post => {
    post.tags.forEach(tag => allTags.add(tag))
  })
  const sortedTags = Array.from(allTags).sort()

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">Blog</h1>
        </div>

        {posts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No blog posts yet. Check back soon!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {posts.map((post) => (
              <Card key={post.slug} className="relative overflow-hidden transition-shadow hover:shadow-lg">
                <ShareButton 
                  url={`/blog/${post.slug}`} 
                  size="icon" 
                  className="absolute top-3 right-3 z-10"
                />
                <Link href={`/blog/${post.slug}`}>
                  <CardHeader className="px-6 pt-5 pb-3">
                    <CardTitle className="text-xl hover:text-primary pr-8">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-6 pb-5 pt-0">
                    <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {post.readingTime}
                        </span>
                      )}
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
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
        
        {/* All tags section at the bottom */}
        {sortedTags.length > 0 && (
          <>
            <hr className="my-8 border-t border-border" />
            <div className="flex flex-wrap gap-2">
              {sortedTags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}