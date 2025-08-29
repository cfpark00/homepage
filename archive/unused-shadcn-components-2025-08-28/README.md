# Archived Unused shadcn/ui Components

Date Archived: 2025-08-28

## Components Moved

These shadcn/ui components were installed but never used in any part of the codebase:

1. **navigation-menu.tsx** - Radix navigation menu component
2. **progress.tsx** - Radix progress bar component  
3. **scroll-area.tsx** - Radix scrollable area component

## Verification Process

Before archiving, these components were verified to be unused by:
- Checking imports in all `.tsx` and `.ts` files in both web and portal apps
- Checking usage in MDX blog posts and project documentation
- Verifying they are not exported from the UI package index
- Confirming no internal dependencies from other UI components

## Restoration

If needed, these components can be restored by moving them back to:
`/packages/ui/src/components/`

Note: warning-card.tsx was initially thought to be unused but is actually imported in 4 MDX files, so it was kept.