# Claude Code Guidelines

This document provides guidelines for AI agents and developers contributing to this codebase.

## Project Structure

- **Monorepo Root**: `/Users/cfpark00/mysite`
- **Vercel Project Name**: `homepage`

## Important Rules

- **NEVER** run `pnpm dev` or `pnpm build` unless explicitly requested by the user
- These commands should only be run when the user specifically asks for them

## Related Documentation

- **UI Components & shadcn/ui**: Information about using shadcn/ui components is in `SHADCN_TIPS.md`
- **Deployment**: Information about deploying this application is in `DEPLOYMENT.md`

## Page Layout Standards

### Container Components

All content pages should use the standardized `PageContainer` component for consistent layout:

```tsx
import { PageContainer } from "@workspace/ui/components/page-container"

export default function MyPage() {
  return (
    <PageContainer>
      {/* Your page content here */}
    </PageContainer>
  )
}
```

The `PageContainer` component provides:
- Standard container padding: `py-8 md:py-12`
- Maximum width constraint: `max-w-4xl`
- Centered content with responsive margins

### When NOT to use PageContainer

- Layout components (headers, footers)
- Full-width pages that need custom layouts
- Modal/dialog content

### Custom Container Styling

If you need to override the default styles:

```tsx
<PageContainer className="py-4" innerClassName="max-w-6xl">
  {/* Custom styled content */}
</PageContainer>
```

## Component Imports

Always import UI components from the workspace UI package:

```tsx
import { Button, Card, Badge } from "@workspace/ui/components/[component-name]"
import { PageContainer } from "@workspace/ui/components/page-container"
```

## File Organization

- Pages go in `/apps/web/app/(default)/[page-name]/page.tsx`
- Shared components go in `/packages/ui/src/components/`
- Page-specific components go in `/apps/web/components/`

## Styling Guidelines

- Use Tailwind CSS classes
- Follow existing patterns for consistency
- Keep text sizes small and readable (text-sm, text-xs for descriptions)
- Avoid unnecessary colors and decorations unless specifically requested