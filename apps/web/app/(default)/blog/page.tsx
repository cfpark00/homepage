import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { CalendarDays, Clock, User } from "lucide-react"
import Link from "next/link"

// Static blog posts data
const posts: any[] = []

export default function BlogPage() {

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-6xl">
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
          <div className="space-y-8">
            {posts.map((post) => (
              <Card key={post.slug} className="overflow-hidden transition-shadow hover:shadow-lg">
                <Link href={`/blog/${post.slug}`}>
                  <CardHeader>
                    <CardTitle className="text-2xl hover:text-primary">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {post.excerpt}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
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
                  </CardContent>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}