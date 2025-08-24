# Projects Framework Implementation and Publication Card Fixes
**Date:** 2025-08-23  
**Time:** 21:24  
**Project:** Academic Homepage - Projects System and Component Debugging

## Summary
Implemented a unified projects framework similar to the blog system, migrated standalone pages to the new structure, and fixed rendering issues with the PublicationCard component in MDX contexts. Discovered and documented critical prose class interference issues.

## Major Tasks Completed

### 1. Projects Framework Implementation
- Created `/apps/web/lib/projects.ts` for project metadata management
- Implemented `/apps/web/app/(default)/projects/page.tsx` - projects listing page
- Implemented `/apps/web/app/(default)/projects/[slug]/page.tsx` - dynamic project pages
- Migrated content from standalone pages to `/apps/web/content/projects/`:
  - `research-tracking/index.mdx` - Research tracking system project
  - `evolving-research/index.mdx` - Evolving research project
- Key difference from blog: No tags or reading time functionality

### 2. Critical "Loading..." Bug Resolution
**Problem:** Projects showed "Loading..." indefinitely despite correct routing
**Root Causes Identified:**
1. MDXContent component missing project slug handling
2. Next.js 15 async params requirement not met
3. Content directories in wrong location

**Solutions Applied:**
- Updated `/apps/web/components/mdx-content.tsx` to handle project slugs
- Fixed async params in project pages: `params: Promise<{ slug: string }>`
- Moved content to correct location under `/apps/web/content/projects/`

### 3. PublicationCard Component Issues
**Problem:** Icon misalignment and excessive height in MDX context
**Root Cause:** Prose typography classes interfering with component styles

**Key Discovery:**
- MDX content wrapped in `prose` classes applies typography styles to all children
- These styles break flexbox alignment, especially for icons
- Solution: Add `not-prose` class to component wrapper in MDX

**Fix Applied:**
```mdx
<div className="my-4 not-prose">
  <PublicationCard publication={data} compact />
</div>
```

### 4. File Organization and Archiving
- Created `/archive/2025-01-24/` directory structure
- Archived unused research-tree components and reorganize-layout.js
- Restored claude_notes documentation after accidental archiving
- Updated `/claude_notes/structure.txt` with current project structure

### 5. Documentation Created
- Created `/claude_notes/tips/typescript-in-mdx-gotchas.md`
- Documented prose class interference issues
- Included debugging tips and best practices
- Added real examples from today's debugging session

## Technical Insights

### MDX + TypeScript + Prose Classes
The combination of MDX, TypeScript components, and prose styling creates subtle issues:
1. Prose classes modify display properties of nested elements
2. Flexbox alignment breaks when children have `display: block` under prose
3. `not-prose` class escapes these styles but must be applied carefully

### Next.js 15 Changes
- Route params are now Promises that must be awaited
- This affects all dynamic routes with `[slug]` patterns
- Migration requires updating type signatures and adding await

## Files Modified
- `/apps/web/lib/projects.ts` - Created
- `/apps/web/app/(default)/projects/page.tsx` - Created
- `/apps/web/app/(default)/projects/[slug]/page.tsx` - Created
- `/apps/web/content/projects/research-tracking/index.mdx` - Created
- `/apps/web/content/projects/evolving-research/index.mdx` - Created
- `/apps/web/components/mdx-content.tsx` - Added project slug handling
- `/apps/web/components/publication-card.tsx` - Fixed icon alignment
- `/claude_notes/tips/typescript-in-mdx-gotchas.md` - Created
- `/claude_notes/structure.txt` - Updated with current structure

## Lessons Learned
1. Always test components in both regular React and MDX contexts
2. Prose classes are powerful but can interfere with component layouts
3. `not-prose` is essential for interactive components in MDX
4. Next.js 15 migration requires careful attention to async patterns
5. File structure documentation should be updated immediately after changes

## Next Steps Recommendations
1. Consider creating a dedicated MDX component wrapper that automatically applies `not-prose`
2. Audit other components that might be affected by prose styling
3. Update CLAUDE.md with Next.js 15 async params pattern
4. Consider extracting PublicationCard usage in publications page to use the component