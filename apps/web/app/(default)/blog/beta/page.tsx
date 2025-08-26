import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { CalendarDays, Clock, User, FlaskConical } from "lucide-react"
import Link from "next/link"
import { getBlogPosts } from "@/lib/blog"
import { ShareButton } from "@/components/share-button"
import { BetaPasswordGuard } from "@/components/beta-password-guard"

export default async function BetaBlogPage() {
  const posts = await getBlogPosts(true) // true = include beta posts
  const betaPosts = posts.filter(post => post.beta)
  
  // Collect all unique tags from beta posts
  const allTags = new Set<string>()
  betaPosts.forEach(post => {
    post.tags.forEach(tag => allTags.add(tag))
  })
  const sortedTags = Array.from(allTags).sort()

  return (
    <BetaPasswordGuard>
      <div className="container py-8 md:py-12">
        <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <FlaskConical className="h-6 w-6 text-muted-foreground" />
            <h1 className="text-4xl font-bold">Beta Research</h1>
          </div>
          <p className="text-muted-foreground">
            Early access to our group's research in progress. These posts are not yet public and may contain preliminary findings.
          </p>
        </div>

        {betaPosts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">
                No beta posts available at the moment.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-5">
            {betaPosts.map((post) => (
              <Card key={post.slug} className="relative overflow-hidden transition-shadow hover:shadow-lg border-amber-200/50 dark:border-amber-900/30">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400/50 to-orange-400/50" />
                <ShareButton 
                  url={`/blog/${post.slug}`} 
                  size="icon" 
                  className="absolute top-3 right-3 z-10"
                />
                <Link href={`/blog/${post.slug}`}>
                  <CardHeader className="px-6 pt-5 pb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs border-amber-400/50 text-amber-700 dark:text-amber-400">
                        Beta
                      </Badge>
                    </div>
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
                        {new Date(post.date + "T00:00:00").toLocaleDateString("en-US", {
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
    </BetaPasswordGuard>
  )
}