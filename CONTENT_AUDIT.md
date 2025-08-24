# Content Audit: App vs Content Directory

## Overview
This audit documents the content architecture of the site, distinguishing between:
- **Framework code** in `/apps/web/app` (pages, routing, UI logic)
- **Content data** in `/apps/web/content` (MDX files, JSON data)
- **Data libraries** in `/apps/web/lib` (TypeScript data files and content loaders)

## Content Management Architecture

### ✅ Fully Content-Driven Systems

#### 1. **Blog System**
- **Framework**: `/lib/blog.ts` - Generic blog loader
- **Content**: `/content/blog/` - MDX files + metadata.json
- **Structure**:
  ```
  /content/blog/
  ├── metadata.json (post metadata: title, date, excerpt, tags)
  ├── welcome-to-my-blog/
  │   └── index.mdx
  └── random-walks-visualization/
      ├── index.mdx
      └── random-walk.tsx (interactive component)
  ```
- **Pages**:
  - `/app/(default)/blog/page.tsx` - List view
  - `/app/(default)/blog/[slug]/page.tsx` - Individual posts
- **Features**: Dynamic MDX loading, interactive components, metadata-driven

#### 2. **Projects System**
- **Framework**: `/lib/projects.ts` - Generic project loader
- **Content**: `/content/projects/` - MDX files + metadata.json
- **Structure**:
  ```
  /content/projects/
  ├── metadata.json (project metadata: title, status, featured)
  ├── evolving-research/
  │   └── index.mdx
  └── research-tracking/
      ├── index.mdx
      ├── research-flow.tsx (React Flow diagram)
      ├── research-tree-data.ts
      └── research-tree-vertical.json
  ```
- **Pages**:
  - `/app/(default)/projects/page.tsx` - List view
  - `/app/(default)/projects/[slug]/page.tsx` - Individual projects
- **Features**: MDX content, embedded interactive visualizations

#### 3. **News System**
- **Framework**: `/lib/news.ts` - JSON news loader
- **Content**: `/content/news/` - JSON files by year/season
- **Structure**:
  ```
  /content/news/
  └── [year]/
      ├── 0winter.json
      ├── 1spring.json
      ├── 2summer.json
      └── 3fall.json
  ```
- **Page**: `/app/(default)/news/page.tsx`
- **Features**: Markdown link rendering, chronological organization

### ⚠️ Hybrid Systems (Data in `/lib`)

#### 4. **Publications**
- **Data**: `/lib/publications-data.ts` (TypeScript file)
- **Page**: `/app/(default)/publications/page.tsx`
- **Features**: Search, filtering, significance toggle
- **Status**: Data separated but not in content directory

#### 5. **Talks**
- **Data**: `/lib/talks-data.ts` (TypeScript file)
- **Page**: `/app/(default)/talks/page.tsx`
- **Features**: Google Slides/YouTube embeds, expandable details
- **Status**: Data separated but not in content directory

### ❌ Fully Hardcoded Systems

#### 6. **CV Page**
- **Location**: `/app/(default)/cv/page.tsx`
- **Data**: Inline TypeScript object in component
- **Components**: TimelineView, TraditionalView
- **Status**: All data hardcoded in component

#### 7. **Ongoing Projects**
- **Location**: `/app/(default)/ongoing/page.tsx`
- **Data**: `ongoingProjects` array inline in component
- **Status**: Small dataset, fully hardcoded

#### 8. **Research Tools**
- **Location**: `/app/(default)/research-tools/page.tsx`
- **Data**: `researchProjects` array inline in component
- **Status**: Small dataset, fully hardcoded

#### 9. **Home Page**
- **Location**: `/app/(default)/page.tsx`
- **Data**: All content hardcoded (bio, links, etc.)
- **Components**: FlyingPublications animation

## MDX Component System

### Shared MDX Infrastructure
- **MDX Loader**: `/components/mdx-content.tsx`
  - Dynamic imports from `/content/[type]/[slug]/index.mdx`
  - Supports both blog and projects
  - Error handling for missing content

### Interactive Components in Content
- **Blog**: 
  - `random-walk.tsx` - Interactive random walk visualization
- **Projects**:
  - `research-flow.tsx` - React Flow research tracking diagram
  - Research tree data structures

## Content Types Summary

| System | Framework | Content Location | Data Format | Status |
|--------|-----------|-----------------|-------------|---------|
| Blog | ✅ Generic | `/content/blog/` | MDX + JSON | ✅ Fully migrated |
| Projects | ✅ Generic | `/content/projects/` | MDX + JSON | ✅ Fully migrated |
| News | ✅ Generic | `/content/news/` | JSON | ✅ Fully migrated |
| Publications | ⚠️ Page-specific | `/lib/publications-data.ts` | TypeScript | ⚠️ Hybrid |
| Talks | ⚠️ Page-specific | `/lib/talks-data.ts` | TypeScript | ⚠️ Hybrid |
| CV | ❌ Hardcoded | Component inline | TypeScript | ❌ Not migrated |
| Ongoing | ❌ Hardcoded | Component inline | TypeScript | ❌ Not migrated |
| Research Tools | ❌ Hardcoded | Component inline | TypeScript | ❌ Not migrated |

## Migration Recommendations

### Priority 1: Complete Hybrid Systems
1. **Publications** → Move to `/content/publications/metadata.json`
2. **Talks** → Move to `/content/talks/metadata.json`

### Priority 2: Simple Hardcoded Pages
3. **Ongoing Projects** → Move to `/content/ongoing/metadata.json`
4. **Research Tools** → Move to `/content/research-tools/metadata.json`

### Priority 3: Complex Pages
5. **CV** → Requires restructuring due to view components
6. **Home Page** → Consider if dynamic content needed

## Key Findings

1. **Framework Success**: Blog and Projects demonstrate a successful content/framework separation
2. **Metadata Pattern**: Using `metadata.json` files allows TypeScript typing while keeping content separate
3. **Interactive Content**: MDX supports importing React components for rich interactions
4. **Inconsistency**: Some systems (Publications, Talks) are halfway migrated with data in `/lib`
5. **Opportunity**: The existing blog/projects framework could easily be extended to other content types