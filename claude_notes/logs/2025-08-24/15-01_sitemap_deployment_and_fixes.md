# Sitemap Generation, Deployment, and Bug Fixes

## Date: 2025-08-24, 15:01

## Summary
Implemented automatic sitemap.xml and robots.txt generation for SEO, fixed build issues, deployed multiple times to production, and resolved sitemap bugs. Also handled git operations for committing new blog posts with interactive visualizations.

## Tasks Completed

### 1. Build Verification and Deployment
- Ran `pnpm build` to verify no errors after recent changes
- Successfully deployed to Vercel preview environment
- Deployed to production at www.corefranciscopark.com

### 2. Git Operations
- Staged all changes including:
  - New blog posts: Double Pendulum Chaos, Gradient Optimizer Comparison
  - Enhanced Random Walk visualization
  - Development logs documenting implementation
- Created descriptive commit with co-author attribution
- Pushed changes to GitHub repository

### 3. Sitemap and SEO Implementation
- Created `/apps/web/app/sitemap.ts` for automatic sitemap generation
  - Includes static routes (home, cv, publications, talks, etc.)
  - Dynamically includes all blog posts
  - Dynamically includes all project pages
  - Sets appropriate priorities and change frequencies
- Created `/apps/web/app/robots.ts` for robots.txt generation
  - Allows all crawlers
  - Points to sitemap location

### 4. Sitemap Bug Fix
- Discovered issue: `metadata.json` was being included as a project page in sitemap
- Identified root cause: Projects filter only excluded hidden files (starting with `.`)
- Fixed by adding explicit exclusion for `metadata.json` in projects filter
- Blog section was already correctly filtering out its `metadata.json`

### 5. Multiple Production Deployments
- Initial deployment with sitemap/robots implementation
- Second deployment to fix metadata.json appearing in sitemap
- All deployments successful with sitemap now correctly generated

## Technical Details

### Sitemap Generation Approach
- Used Next.js 15's built-in sitemap generation via `sitemap.ts`
- Files are generated at build time, not runtime
- Automatically served at `/sitemap.xml` and `/robots.txt`
- No files stored in repository - dynamically created during build

### Vercel Deployment Process
- Confirmed correct project linking (`homepage` not `web`)
- Deployments run from repository root as per documentation
- Root directory setting in Vercel dashboard points to `apps/web`

## Files Modified
- `/apps/web/app/sitemap.ts` - Created and then fixed filter bug
- `/apps/web/app/robots.ts` - Created for SEO
- Multiple blog and project content files committed to git

## URLs Generated
- Sitemap: https://www.corefranciscopark.com/sitemap.xml
- Robots: https://www.corefranciscopark.com/robots.txt

## Status
All tasks completed successfully. Website fully deployed with working sitemap and SEO configuration.