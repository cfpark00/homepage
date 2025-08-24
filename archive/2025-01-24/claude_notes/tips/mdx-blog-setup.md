# MDX Blog Setup Tips

## Overview
This document explains how to create interactive blog posts using MDX in the Next.js app.

## Two Types of Blog Posts

### 1. Simple Markdown Posts
For basic blog posts without interactive components:
- Create a single `.mdx` or `.md` file in `/apps/web/content/blog/`
- Example: `welcome-to-my-blog.mdx`
- Include frontmatter with metadata
- Uses the dynamic `[slug]` route

### 2. Interactive MDX Posts with Components
For blog posts with interactive React components:
- Create a folder in `/apps/web/content/blog/[post-name]/`
- Include:
  - `index.mdx` - The blog content
  - Component files (`.tsx`) - Interactive components
  - `page.tsx` in `/app/(default)/blog/[post-name]/` - The page wrapper
- Example: `random-walks-visualization/`

## Creating an Interactive Blog Post

### Step 1: Create the folder structure
```
/apps/web/content/blog/my-interactive-post/
  ├── index.mdx           # Blog content
  └── my-component.tsx    # Interactive component
```

### Step 2: Create the MDX content
```mdx
import MyComponent from './my-component'

# My Blog Post Title

Regular markdown content here.

## Interactive Section

<MyComponent />

More markdown content...
```

**Important:** Do NOT include frontmatter (---) in interactive MDX posts, as it causes rendering issues.

### Step 3: Create the page component
Create `/apps/web/app/(default)/blog/my-interactive-post/page.tsx`:

```tsx
'use client'

import BlogPost from '@/content/blog/my-interactive-post/index.mdx'
import { Badge } from "@workspace/ui/components/badge"
import { CalendarDays, User, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import MyComponent from '@/content/blog/my-interactive-post/my-component'

const metadata = {
  title: "My Interactive Post",
  date: "2025-01-23",
  author: "Core Francisco Park",
  tags: ["interactive", "demo"]
}

export default function MyInteractivePost() {
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
          <BlogPost components={{ MyComponent }} />
        </div>
      </div>
    </article>
  )
}
```

### Step 4: Update blog listing
Add hardcoded metadata for the interactive post in `/apps/web/lib/blog.ts`:

```typescript
if (slug === 'my-interactive-post') {
  return {
    slug,
    title: 'My Interactive Post',
    date: '2025-01-23',
    excerpt: 'Description of the post',
    author: 'Core Francisco Park',
    tags: ['interactive', 'demo'],
    readingTime: '5 min read',
    content: fileContents,
  }
}
```

### Step 5: Exclude from dynamic route
Update `/apps/web/app/(default)/blog/[slug]/page.tsx` to exclude the interactive post:

```typescript
export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts
    .filter(post => post.slug !== 'my-interactive-post')
    .map((post) => ({
      slug: post.slug,
    }))
}

// In the component
if (slug === 'my-interactive-post') {
  notFound() // Will be handled by the specific page
}
```

## MDX Formatting Tips

### Headings
```mdx
# Main Title (H1)
## Section Title (H2)
### Subsection Title (H3)
```

### Lists
```mdx
- Bullet point 1
- Bullet point 2
  - Nested bullet

1. Numbered item 1
2. Numbered item 2
```

### Emphasis
```mdx
**Bold text**
*Italic text*
***Bold and italic***
```

### Code
````mdx
Inline code: `const x = 5`

Code block:
```javascript
function hello() {
  console.log("Hello World")
}
```
````

### Components
```mdx
import MyComponent from './my-component'

<MyComponent prop1="value" prop2={42} />
```

## Important Configuration

### Tailwind Typography Plugin
Ensure the Typography plugin is configured in `/apps/web/tailwind.config.ts`:

```typescript
import typography from "@tailwindcss/typography"

const config: Config = {
  // ...
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./content/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
  ],
  plugins: [
    ...(sharedConfig.plugins || []),
    typography
  ]
}
```

### Next.js MDX Config
The MDX support is configured in `/apps/web/next.config.mjs`:

```javascript
import createMDX from '@next/mdx'
import remarkGfm from 'remark-gfm'

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
})
```

## Common Issues and Solutions

### Issue: Prose styles not applying
**Solution:** Ensure the content is wrapped with `prose` classes:
```jsx
<div className="prose prose-neutral max-w-none dark:prose-invert">
  <BlogPost />
</div>
```

### Issue: "t is not defined" error
**Solution:** Remove LaTeX math expressions with `$` symbols. Use plain text or Unicode symbols instead.

### Issue: "createContext only works in Client Components"
**Solution:** Add `'use client'` directive at the top of the page component when using interactive components.

### Issue: React version mismatch errors
**Solution:** Use direct imports instead of dynamic imports for components in server components.

### Issue: Blog post shows as "Untitled" in listing
**Solution:** Add hardcoded metadata in `lib/blog.ts` for interactive posts that don't use frontmatter.

## Benefits of This Approach

1. **Self-contained posts**: Each blog post and its components are in one folder
2. **Type safety**: Full TypeScript support for components
3. **Flexibility**: Mix static content with interactive React components
4. **Performance**: Static generation for better SEO and load times
5. **Developer experience**: Hot reload works for both MDX and components