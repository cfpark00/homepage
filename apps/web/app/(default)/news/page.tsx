import { CalendarDays } from "lucide-react"
import { getNewsItems } from "@/lib/news"

export default function NewsPage() {
  const newsItems = getNewsItems()
  
  const renderMarkdownLinks = (content: string) => {
    // Convert markdown links [text](url) to HTML links
    return content.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-link underline-offset-4 hover:underline">$1</a>'
    )
  }

  return (
    <div className="container py-8 md:py-12">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">News & Updates</h1>
        </div>

        <div className="space-y-3">
          {newsItems.map((item, index) => (
            <div
              key={index}
              className="flex gap-4 border-b pb-3 last:border-0"
            >
              <div className="flex items-start gap-1 text-sm text-muted-foreground pt-0.5 w-[120px] flex-shrink-0">
                <CalendarDays className="h-3.5 w-3.5 mt-0.5" />
                <span className="whitespace-nowrap">
                  {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div
                className="text-sm leading-relaxed flex-1"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdownLinks(item.content),
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}