# Project System Refactoring and Build Fixes

## Date: 2025-08-23, 23:38

## Summary
Major refactoring of the projects system from hardcoded entries to a dynamic metadata-driven architecture, along with TypeScript build fixes and UI improvements.

## Tasks Completed

### 1. Build Error Fixes
- Fixed TypeScript error in `mdx-content.tsx` by removing unused MDX components prop
- Fixed TypeScript error in `publications-data.ts` by removing invalid `related_projects` field
- Successfully resolved all build errors

### 2. Publication System Enhancement
- Added `related_projects` field to Publication type with structure: `{ name: string; url: string }[]`
- Restored ability for publications to link to related projects
- Updated publication card UI to display related project links with NotebookText icon
- Increased icon sizes from h-3 w-3 to h-4 w-4 for better visibility

### 3. Projects System Complete Refactoring
- Converted projects from hardcoded array to metadata-driven system using `metadata.json`
- Added Orchestra as a formal project with `isExternal: true` flag
- Implemented automatic external link handling:
  - External icon display for external projects
  - Confirmation modal when clicking external links
- Fixed "Module not found: fs" error by separating server/client components:
  - Projects page is now a server component
  - Created `ProjectCards` client component for interactions

### 4. Project Metadata Simplification
- Removed unnecessary fields: `subtitle`, `status`, `featured`, `publications`, fake dates
- Final clean metadata structure:
  - title (required)
  - excerpt (required)
  - thumbnailUrl (optional)
  - isExternal (optional)
  - externalUrl (optional for external projects)
  - date (optional)

### 5. UI/UX Improvements
- Changed "Back" button to "All Projects" in project pages
- Changed "Back" button to "All Posts" in blog pages
- Added thumbnail image support for projects
- Implemented responsive grid system for project cards:
  - <480px: 1 column
  - 480-768px: 2 columns
  - ≥768px: 4 columns
- Fixed timezone issue in blog post dates

## Technical Details

### Project System Architecture
- Server-side data loading in page component
- Client-side interactions in separate component
- Type-safe metadata system with TypeScript interfaces
- Automatic sorting logic (dateless projects first, then by date)

### Files Modified
- `/apps/web/app/(default)/projects/page.tsx` - Converted to server component
- `/apps/web/components/project-cards.tsx` - New client component
- `/apps/web/lib/projects.ts` - Updated types and removed unnecessary fields
- `/apps/web/content/projects/metadata.json` - Cleaned metadata structure
- `/apps/web/components/mdx-content.tsx` - Fixed TypeScript issues
- `/apps/web/lib/publications-data.ts` - Added related_projects support
- `/apps/web/components/publication-card.tsx` - UI improvements
- `/apps/web/app/(default)/projects/[slug]/page.tsx` - Button text update
- `/apps/web/app/(default)/blog/[slug]/page.tsx` - Button text update and date fix

## Current Project Structure
```
Projects now loaded from: /content/projects/metadata.json
- Orchestra (external link to app.orchestra-ai.org)
- Research Tracking System (internal project page)
- Evolving Research (internal project page)
```

## Notes
- All build errors resolved
- Projects system now fully dynamic and maintainable
- Clean separation of concerns between server and client code
- Responsive design maintains consistent card sizes across breakpoints