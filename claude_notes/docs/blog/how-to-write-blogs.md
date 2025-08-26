# How to Write Blog Posts

## Quick Start

To create a new blog post:

1. **Create content folder**: `/apps/web/content/blog/your-post-slug/`
2. **Add metadata**: Create `metadata.json` in your post folder
3. **Write your post**: Create `index.mdx` with your content

That's it! The blog system automatically discovers posts from their folders. No need to update any central files.

## Writing Regular vs Beta Research Posts

### Regular Blog Posts
Standard posts that appear on the main `/blog` page:

```json
"your-post-slug": {
  "title": "Your Post Title",
  "date": "2025-08-25",
  "excerpt": "Brief description of your post",
  "tags": ["tag1", "tag2"],
  "readingTime": "5 min read"
}
```

### Beta Research Posts
Private/draft research posts that are password-protected:

```json
"your-research-slug": {
  "title": "Research Paper Title",
  "date": "2025-08-25",
  "excerpt": "Academic description of the research",
  "tags": ["AI", "research", "deep learning"],
  "readingTime": "15 min read",
  "beta": true  // This makes it a beta post
}
```

**Beta posts are:**
- Password-protected (require authentication to view)
- Listed separately at `/blog/beta/`
- Typically longer, more academic content
- Often include interactive visualizations and math

## MDX Content Structure

### Basic MDX Template
```mdx
import { WarningCard } from "@workspace/ui/components/warning-card"

# Your Title Here

Introduction paragraph...

## Section Heading

Your content with **markdown** formatting.

<div className="not-prose">
  <WarningCard>
    Note: This is a draft or disclaimer
  </WarningCard>
</div>
```

### Adding Math (for research posts)
```mdx
Inline math: $L = L_0 + N^{\alpha}$

Block math:
$$
\frac{d\mathbf{X}_i}{dt} = \sum_{j=1}^n a_{i,j} \langle\mathbf{X}_i, \mathbf{X}_j\rangle
$$
```

### Adding Interactive Components
1. Create component file in your post folder: `/content/blog/your-post/visualization.tsx`
2. Import in your MDX:
```mdx
import Visualization from "./visualization"

## Interactive Demo

<Visualization />
```

## Metadata File Structure

Each blog post folder contains its own `metadata.json`:

```json
{
  "title": "Your Post Title",
  "date": "2025-08-26",
  "excerpt": "Brief description",
  "tags": ["tag1", "tag2"],
  "readingTime": "5 min read",
  "beta": false,  // Set to true for password-protected posts
  "order": 1      // Optional: control display order (lower numbers first)
}
```

**Important:** 
- Posts are automatically discovered from folders containing `metadata.json`
- **Ordering**: Posts with `order` field appear first (sorted by order), then posts without `order` (sorted by date, newest first)
- Set `"beta": true` for password-protected research posts

## File Organization

```
/apps/web/content/blog/
├── your-regular-post/
│   ├── index.mdx
│   └── metadata.json
└── your-research-post/
    ├── index.mdx
    ├── metadata.json
    └── interactive-viz.tsx
```

**Note:** Each blog post is completely self-contained in its folder. The system automatically discovers all posts by scanning folders with `metadata.json` files.

## Tips for Writing

- **Excerpts**: Keep them concise (1-2 sentences)
- **Tags**: Use consistent tag names across posts
- **Reading time**: Estimate honestly (150-200 words per minute)
- **Beta posts**: Use for drafts or sensitive research content
- **Interactive components**: Place complex React components in separate `.tsx` files
- **Math rendering**: Wrap complex equations in `$$` blocks for better display