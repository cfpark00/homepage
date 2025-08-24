# Blog System Architecture

## Overview
The blog system uses a three-layer architecture that separates framework, content, and metadata. This design allows for flexible content management, easy publishing control, and clean separation of concerns.

## Three-Layer Architecture

### 1. Framework Layer (`/apps/web/app/(default)/blog/[slug]/page.tsx`)
The rendering template that handles:
- Dynamic routing with `[slug]` parameter
- Page layout and structure
- Component injection for interactive elements
- Static generation via `generateStaticParams()`

**Key characteristics:**
- Contains no actual blog content
- Reusable for all blog posts
- Handles presentation logic only
- Includes hardcoded author name and component registry

### 2. Content Layer (`/apps/web/content/blog/*/`)
Physical blog content stored as MDX files:
- Each post in its own folder: `/content/blog/[slug]/index.mdx`
- Can include co-located components (e.g., `random-walk.tsx`)
- MDX allows mixing Markdown with React components
- Content can exist without being published

**Structure:**
```
content/blog/
├── welcome-to-my-blog/
│   └── index.mdx
└── random-walks-visualization/
    ├── index.mdx
    └── random-walk.tsx
```

### 3. Metadata Layer (`/apps/web/lib/blog.ts`)
Centralized control for blog visibility and metadata:
- Single `blogMetadata` object controls which posts are live
- Contains: title, date, excerpt, tags, reading time
- Acts as gatekeeper - only posts with metadata entries are visible
- Enables draft/archive functionality without deleting content

**Example metadata:**
```typescript
const blogMetadata = {
  'welcome-to-my-blog': {
    title: 'Welcome to My Blog',
    date: '2025-01-20',
    excerpt: 'An introduction to my personal blog...',
    tags: ['test'],
    readingTime: '2 min read'
  }
}
```

## Key Components

### Blog Listing Page (`/apps/web/app/(default)/blog/page.tsx`)
- Fetches all posts via `getBlogPosts()`
- Displays post cards with metadata
- Shows aggregate of all unique tags
- Server-side rendered

### MDX Content Processor (`/apps/web/components/mdx-content.tsx`)
- Client-side component
- Dynamically imports MDX files based on slug
- Merges custom components with MDX content
- Manual slug-to-import mapping

### Blog Library (`/apps/web/lib/blog.ts`)
- `getBlogPosts()`: Returns all posts with metadata, sorted by date
- `getBlogPost(slug)`: Returns single post metadata
- Filters filesystem folders to only include those with metadata

## Rendering Flow

1. **List View** (`/blog`)
   - `getBlogPosts()` reads filesystem folders
   - Filters by metadata existence
   - Returns sorted array of posts
   - Renders as cards

2. **Post View** (`/blog/[slug]`)
   - Route parameter provides slug
   - `getBlogPost(slug)` fetches metadata
   - `MDXContent` component loads appropriate MDX file
   - Custom components injected if needed

## Publishing Workflow

### To Publish a Post:
1. Create folder in `/content/blog/[slug]/`
2. Add `index.mdx` with content
3. Add metadata entry to `blogMetadata` in `/lib/blog.ts`
4. Add MDX import to `/components/mdx-content.tsx`

### To Hide a Post:
- Remove or comment out metadata entry - content remains intact

### To Add Interactive Components:
1. Create component in post folder
2. Add to component registry in `/blog/[slug]/page.tsx`
3. Reference in MDX content

## Benefits

- **Content Preservation**: Never lose writing, just control visibility
- **Draft Management**: Keep unpublished content in repo
- **Quick Publishing**: Toggle visibility via metadata
- **Clean Separation**: Framework, content, and metadata are independent
- **Easy Maintenance**: Clear structure for adding/removing posts
- **Type Safety**: TypeScript interfaces for blog post structure

## Current Limitations

- Manual MDX import mapping in `mdx-content.tsx`
- Component registry requires hardcoding in `[slug]/page.tsx`
- No automatic slug generation from filesystem

## File Locations Summary

- **Framework**: `/apps/web/app/(default)/blog/[slug]/page.tsx`
- **Content**: `/apps/web/content/blog/*/index.mdx`
- **Metadata**: `/apps/web/lib/blog.ts`
- **MDX Processor**: `/apps/web/components/mdx-content.tsx`
- **Blog List**: `/apps/web/app/(default)/blog/page.tsx`