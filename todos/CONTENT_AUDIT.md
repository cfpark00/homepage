# Content Audit: App vs Content Directory

## Overview
This audit documents the content architecture of the site, distinguishing between:
- **Framework code** in `/apps/web/app` (pages, routing, UI logic)
- **Content data** in `/apps/web/content` (MDX files, JSON data)
- **Data libraries** in `/apps/web/lib` (TypeScript data files and content loaders)
- **Portal app** in `/apps/portal` (separate Next.js app for Orchestra platform)

## Content Management Architecture

### ✅ Fully Content-Driven Systems

#### 1. **Blog System**
- **Framework**: `/lib/blog.ts` - Generic blog loader
- **Content**: `/content/blog/` - MDX files + metadata.json
- **Structure**:
  ```
  /content/blog/
  ├── metadata.json (post metadata: title, date, excerpt, tags, beta flag)
  ├── welcome-to-my-blog/
  │   ├── index.mdx
  │   └── metadata.json
  ├── random-walks-visualization/
  │   ├── index.mdx
  │   ├── metadata.json
  │   └── random-walk.tsx (interactive component)
  ├── liquid-crystal-society/
  │   ├── index.mdx
  │   ├── metadata.json
  │   └── cognitive-dynamics.tsx
  └── [7 total blog posts]
  ```
- **Pages**:
  - `/app/(default)/blog/page.tsx` - Public blog list
  - `/app/(default)/blog/[slug]/page.tsx` - Individual posts
  - `/app/(default)/blog/beta/page.tsx` - Beta posts (password protected)
- **Features**: Dynamic MDX loading, interactive components, beta/public separation

#### 2. **Projects System**
- **Framework**: `/lib/projects.ts` - Generic project loader
- **Content**: `/content/projects/` - MDX files + metadata.json
- **Structure**:
  ```
  /content/projects/
  ├── metadata.json (project metadata: title, status, featured)
  ├── evolving-research/
  │   ├── index.mdx
  │   └── metadata.json
  ├── llm-dopamine/
  │   ├── index.mdx
  │   └── metadata.json
  ├── orchestra/
  │   └── metadata.json (external link project)
  └── research-tracking/
      ├── index.mdx
      ├── metadata.json
      ├── research-flow.tsx (React Flow diagram)
      ├── research-tree-data.ts
      └── research-tree-vertical.json
  ```
- **Pages**:
  - `/app/(default)/projects/page.tsx` - List view
  - `/app/(default)/projects/[slug]/page.tsx` - Individual projects
- **Features**: MDX content, external links support, embedded interactive visualizations

#### 3. **News System**
- **Framework**: `/lib/news.ts` - JSON news loader
- **Content**: `/content/news/` - JSON files by year/season
- **Structure**:
  ```
  /content/news/
  └── [year]/ (2015-2025)
      ├── 0winter.json
      ├── 1spring.json
      ├── 2summer.json
      └── 3fall.json
  ```
- **Page**: `/app/(default)/news/page.tsx`
- **Features**: Markdown link rendering, chronological organization

#### 4. **Publications System**
- **Framework**: `/lib/publications-data.ts` - Imports from JSON
- **Content**: `/content/publications/publications.json`
- **Page**: `/app/(default)/publications/page.tsx`
- **Features**: Search, filtering, significance toggle
- **Status**: ✅ Fully migrated to content directory

### ⚠️ Hybrid Systems (Data in `/lib`)

#### 5. **Talks**
- **Data**: `/lib/talks-data.ts` (TypeScript file)
- **Page**: `/app/(default)/talks/page.tsx`
- **Features**: Google Slides/YouTube embeds, expandable details
- **Status**: Data separated but not in content directory

### ❌ Fully Hardcoded Systems

#### 6. **CV Page**
- **Location**: `/app/(default)/cv/page.tsx`
- **Data**: Inline TypeScript object `cvData` in component
- **Components**: TimelineView, TraditionalView
- **Status**: All data hardcoded in component

#### 7. **Home Page**
- **Location**: `/app/(default)/page.tsx`
- **Data**: All content hardcoded (bio, links, etc.)
- **Components**: FlyingPublications animation

## Additional Systems

#### 8. **Portal App (Orchestra)**
- **Location**: `/apps/portal/` - Separate Next.js application
- **Purpose**: Research platform with authentication
- **Features**: 
  - Supabase integration for auth
  - Project-based routing `/[project_slug]/`
  - Token-based sharing `/[project_slug]/s/[token]/`
- **Status**: Separate application, not part of main content system

#### 9. **API Routes**
- **Beta Authentication**: `/app/api/beta-auth/route.ts`
  - Handles password protection for beta blog posts

#### 10. **Sitemap & Robots**
- **Sitemap**: `/app/sitemap.ts` - Dynamic sitemap generation
- **Robots**: `/app/robots.ts` - Robots.txt configuration

## MDX Component System

### Shared MDX Infrastructure
- **MDX Loader**: `/components/mdx-content.tsx`
  - Dynamic imports from `/content/[type]/[slug]/index.mdx`
  - Supports both blog and projects
  - Error handling for missing content

### Interactive Components in Content
- **Blog**: 
  - `random-walk.tsx` - Interactive random walk visualization
  - `cognitive-dynamics.tsx` - Liquid crystal society simulation
  - `double-pendulum.tsx` - Double pendulum chaos visualization
  - `optimizer-visualization.tsx` - Gradient optimizer comparisons
  - `scaling-laws-visualization.tsx` - Neural scaling laws interactive
  - `back-to-toc.tsx` - Navigation component
- **Projects**:
  - `research-flow.tsx` - React Flow research tracking diagram
  - Research tree data structures

## Content Types Summary

| System | Framework | Content Location | Data Format | Status |
|--------|-----------|-----------------|-------------|---------|
| Blog | ✅ Generic | `/content/blog/` | MDX + JSON | ✅ Fully migrated |
| Projects | ✅ Generic | `/content/projects/` | MDX + JSON | ✅ Fully migrated |
| News | ✅ Generic | `/content/news/` | JSON | ✅ Fully migrated |
| Publications | ✅ Generic | `/content/publications/` | JSON | ✅ Fully migrated |
| Talks | ⚠️ Page-specific | `/lib/talks-data.ts` | TypeScript | ⚠️ Hybrid |
| CV | ❌ Hardcoded | Component inline | TypeScript | ❌ Not migrated |
| Home Page | ❌ Hardcoded | Component inline | TypeScript | ❌ Not migrated |

## Migration Recommendations

### Priority 1: Complete Hybrid Systems
1. **Talks** → Move to `/content/talks/metadata.json` or `/content/talks/talks.json`

### Priority 2: Complex Pages
2. **CV** → Move to `/content/cv/cv.json` - Requires restructuring due to view components
3. **Home Page** → Consider if dynamic content needed

## Key Findings

1. **Migration Progress**: Publications system has been successfully migrated to content directory
2. **Framework Success**: Blog, Projects, News, and Publications demonstrate successful content/framework separation
3. **Metadata Pattern**: Using JSON files in content directory allows TypeScript typing while keeping content separate
4. **Interactive Content**: MDX supports importing React components for rich, interactive content
5. **Beta System**: Blog includes password-protected beta posts with separate listing page
6. **External Projects**: Projects system supports both MDX content and external links (e.g., Orchestra)
7. **Portal App**: Separate Next.js application for Orchestra platform exists in `/apps/portal/`
8. **Remaining Work**: Only Talks (hybrid) and CV/Home (hardcoded) remain to be migrated