# News Page Development and Site Enhancements Log
**Date:** 2025-08-21  
**Time:** 18:47  
**Project:** Academic Homepage - News Section Development and UI Improvements

## Summary
Major development session focused on creating a comprehensive news page, importing content from GitHub Pages, implementing theme colors, adding extensive historical entries, and fixing various UI issues across the site.

## Major Tasks Completed

### 1. News Page Development
- **Complete Redesign** - Transformed from card-based layout to compact, chronological list format
- **Data Import** - Imported all 29 news items from `/Users/cfpark00/cfpark00.github.io/_news/`
- **Content Expansion** - Added 28 additional entries from CV/resource files including:
  - Employment milestones (postdoc, internships)
  - Awards and scholarships
  - Teaching positions
  - Academic milestones
- **Total Entries** - 74 news items spanning 2015-2025

### 2. News Page Features
- **Fixed Date Column** - Set width to 120px to ensure consistent alignment
- **Link Integration** - Inline hyperlinks with custom theme colors
- **Chronological Sorting** - Newest entries first
- **Compact Design** - Single-line entries with date and content

### 3. Theme Color Implementation
- **Link Colors Added**:
  - Light mode: `--link: 211 100% 45%` (vibrant blue #0084E6)
  - Dark mode: `--link: 199 89% 64%` (cyan-blue #5DCDFD)
- **Location**: `/packages/ui/src/styles/globals.css`
- **Tailwind Config** - Added `link` color to extend theme colors

### 4. Content Updates
- **Talks & Presentations** - Added 17 conference talks and presentations from publications.tex
- **Links Added/Fixed**:
  - Sigma-Xi membership link
  - Prague Synapse 2025 slides
  - PhD Defense slides and thesis
  - Various talk slides and videos
- **Content Cleanup** - Removed personal postdoc entry per request

### 5. Blog Page Optimization
- **Removed Client-Side Fetching** - Converted from `"use client"` with useEffect to server component
- **Eliminated Loading State** - Page now loads instantly like other pages
- **Fixed 404 Errors** - Removed non-existent API endpoint calls

### 6. Projects to Research Rename
- **Navigation** - Changed "Projects" to "Research" in menu
- **Page Titles** - Updated all headers and section titles
- **Code Level Changes**:
  - `DataProject` → `ResearchProject`
  - `dataProjects` → `researchProjects`
  - `DataProjectsPage` → `ResearchPage`
  - Variable names updated throughout

### 7. Bug Fixes
- **Flying Publications Images** - Fixed 404 errors by:
  - Removing non-existent `points.gif` and `vae_latent.png`
  - Correcting `targettrack.png` to `targettrack.gif`
  - Added existing images: `hidden_emergence.png`, `iclr_gif.gif`

## Technical Details

### News Item Structure
```typescript
type NewsItem = {
  id: number
  date: string
  content: string
  links?: { text: string; url: string }[]
}
```

### Link Rendering Implementation
- Links are embedded in content text and replaced via regex
- Custom `renderContentWithLinks` function handles dynamic link insertion
- Links styled with `text-link` class using theme colors

### File Structure Changes
- No structural changes to directory organization
- Content updates only within existing files

## Files Modified
- `/apps/web/app/(default)/news/page.tsx` - Complete rewrite
- `/apps/web/components/navigation.tsx` - Projects → Research
- `/apps/web/app/(default)/projects/page.tsx` - Renamed variables/functions
- `/apps/web/app/(default)/blog/page.tsx` - Removed client-side fetching
- `/packages/ui/src/styles/globals.css` - Added link colors
- `/packages/ui/tailwind.config.ts` - Added link color to theme
- `/apps/web/components/flying-publications.tsx` - Fixed image references

## Notes
- News page now contains comprehensive academic history
- All links are functional and properly styled
- Site performance improved with removal of client-side data fetching
- Consistent theming across light/dark modes