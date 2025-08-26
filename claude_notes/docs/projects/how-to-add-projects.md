# How to Add Projects

## Quick Start

To add a new project:

1. **Create project folder**: `/apps/web/content/projects/your-project-slug/`
2. **Add metadata**: Create `metadata.json` in your project folder
3. **Add content** (optional): Create `index.mdx` for internal projects

That's it! The project system automatically discovers projects from their folders. No need to update any central files.

## Types of Projects

### Internal Projects (with MDX content)
Projects that have detailed pages on your site:

```json
{
  "title": "Your Project Title",
  "excerpt": "Brief description of your project",
  "thumbnailUrl": "/images/projects/your-project/thumbnail.png"
}
```

Include `index.mdx` with detailed content:
```mdx
import ResearchFlow from './research-flow'

Your project description here...

<ResearchFlow />
```

### External Projects (links)
Projects that link to external sites:

```json
{
  "title": "External Project",
  "excerpt": "Description of external project",
  "isExternal": true,
  "externalUrl": "https://external-site.com",
  "thumbnailUrl": "/images/projects/external/thumbnail.png"
}
```

No `index.mdx` needed for external projects.

## File Organization

```
/apps/web/content/projects/
├── internal-project/
│   ├── index.mdx
│   ├── metadata.json
│   └── interactive-component.tsx
└── external-project/
    └── metadata.json
```

## Metadata Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | string | ✅ | Project title |
| `excerpt` | string | ✅ | Brief description (1-2 sentences) |
| `thumbnailUrl` | string | ❌ | Path to thumbnail image |
| `isExternal` | boolean | ❌ | Set to `true` for external links |
| `externalUrl` | string | ❌ | URL for external projects (required if `isExternal: true`) |
| `date` | string | ❌ | Date in YYYY-MM-DD format (optional) |
| `order` | number | ❌ | Control display order (lower numbers first) |

## Ordering

Projects are displayed in this order:
1. **Projects with `order`** - sorted by order number (ascending)
2. **Projects without `order`** - sorted alphabetically by title

Example: If you want "Orchestra" to always appear first:
```json
{
  "title": "Orchestra: A Research Platform",
  "excerpt": "...",
  "order": 1
}
```

## Adding Interactive Components

1. Create component file in project folder
2. Import in your MDX:

```mdx
import Visualization from "./visualization"

## Interactive Demo

<Visualization />
```

## Notes

- Projects are automatically discovered from folders containing `metadata.json`
- Projects are sorted alphabetically by title
- External projects will open in a new tab
- Internal projects use the same MDX system as blog posts
- Components can be co-located in the project folder