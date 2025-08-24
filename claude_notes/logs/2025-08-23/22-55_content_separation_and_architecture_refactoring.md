# Content Separation and Architecture Refactoring
Date: 2025-08-23 22:55

## Overview
Major architecture refactoring to achieve complete separation of concerns between content and framework code, making the site truly modular and maintainable.

## Major Changes

### 1. Complete Content/Framework Separation
- **Moved metadata to JSON files**:
  - Created `/content/blog/metadata.json` for blog post metadata
  - Created `/content/projects/metadata.json` for project metadata
  - Refactored `lib/blog.ts` and `lib/projects.ts` to read from JSON instead of hardcoded TypeScript
  - Now adding content only requires: 1) MDX file, 2) metadata.json entry (no TypeScript changes)

### 2. Dynamic MDX Loading System
- **Fixed MDX hardcoding issue**:
  - Replaced hardcoded imports in `mdx-content.tsx` with dynamic imports
  - Now uses `import(\`@/content/${type}/${slug}/index.mdx\`)` 
  - Added proper error handling and loading states
  - New content automatically works without code changes

### 3. Self-Contained Content Architecture
- **Achieved true self-containment**:
  - Moved `research-flow.tsx` to `/content/projects/research-tracking/`
  - Moved `research-tree-data.ts` and `research-tree-vertical.json` to same folder
  - Each content folder is now completely portable with all its dependencies
  - Content imports from its own folder, not from app code

### 4. Generic ArticleCard Component
- **Created reusable ArticleCard in shared UI library**:
  - Generic component for any article-like content
  - Supports thumbnails, authors, links, expandable content
  - Added LinkSection support for extensible link types
  - PublicationCard now wraps ArticleCard (thin domain wrapper)
  
- **Fixed visual issues**:
  - Restored thumbnail display (was missing)
  - Fixed abstract only showing when expanded
  - Removed excess padding at bottom
  - Maintained exact original layout

### 5. Related Projects Feature
- **Enhanced publication system**:
  - Added `related_projects` field to Publication interface
  - Implemented LinkSection rendering in ArticleCard
  - Added "Related Projects" button to ICL publication linking to Research Tracking System
  - Extensible for future link types (talks, posters, data, etc.)

### 6. Projects Page Migration
- **Renamed "Ongoing" to "Projects"**:
  - Moved `/ongoing/page.tsx` to `/projects/page.tsx`
  - Updated navigation from "Ongoing" to "Projects"
  - Renamed image directory `/images/ongoing/` to `/images/projects/`
  - Updated all references throughout codebase
  - Verified complete removal of "ongoing" references

### 7. Clean Architecture Achieved
```
/content/
├── blog/
│   ├── metadata.json                    # Blog metadata
│   └── [slug]/
│       ├── index.mdx                   # Content
│       └── components.tsx               # Co-located components
├── projects/
│   ├── metadata.json                    # Project metadata
│   └── [slug]/
│       ├── index.mdx                   # Content
│       ├── research-flow.tsx           # Interactive component
│       └── research-tree-data.ts       # Data files

/lib/
├── blog.ts                             # Pure loader (reads JSON)
└── projects.ts                         # Pure loader (reads JSON)

/packages/ui/
└── components/
    └── article-card.tsx                # Generic, reusable UI
```

## Benefits
- **Zero TypeScript edits** needed to add new content
- **Framework is generic** - knows HOW to load, not WHAT exists
- **Content is portable** - each folder is self-contained
- **Clean separation** - UI components have no domain knowledge
- **Extensible** - easy to add new content types and link sections

## Technical Details
- Used Next.js dynamic imports with proper error handling
- Implemented useMemo for performance optimization
- Maintained TypeScript type safety throughout
- Preserved all existing functionality while improving architecture

## Files Modified
- Core refactoring: ~15 files
- Content restructuring: ~10 files  
- Navigation and references: ~5 files
- Total: ~30 files modified

## Next Steps Potential
- Could add more LinkSection types (talks, posters, external links)
- Could make news system use metadata.json pattern if it grows
- Could create content validation scripts
- Could add content preview/draft system