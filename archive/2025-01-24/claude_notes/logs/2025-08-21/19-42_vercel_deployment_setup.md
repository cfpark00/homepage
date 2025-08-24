# Vercel Deployment Setup and Troubleshooting Log
**Date:** 2025-08-21  
**Time:** 19:42  
**Project:** Homepage Vercel Deployment and Git Setup

## Summary
Successfully set up Git repository, pushed to GitHub, created new Vercel project "homepage", and resolved monorepo deployment issues. Fixed TypeScript build errors and configured Vercel for Next.js monorepo deployment.

## Major Tasks Completed

### 1. Build Error Fixes
- **Fixed TypeScript Errors**:
  - `blog/page.tsx`: Added explicit `string` type annotation for `tag` parameter in map function
  - `cv-timeline.tsx`: Refactored closestEvent logic to avoid "type 'never'" and "possibly undefined" errors
- **Result**: Build successfully completed with only ESLint warnings

### 2. Git Repository Setup
- **Verified .gitignore**: Confirmed `node_modules` properly excluded
- **Initialized Git**: Created new repository in `/Users/cfpark00/mysite`
- **Initial Commit**: 112 files committed with proper structure
- **GitHub Push**: Successfully pushed to `git@github.com:cfpark00/homepage.git`

### 3. Vercel Project Configuration
- **Challenge**: Initial deployments kept using "mysite" project instead of "homepage"
- **Solution Process**:
  1. Created new project via CLI: `vercel project add homepage`
  2. Linked local directory: `vercel link --yes --project homepage`
  3. Attempted multiple deployment configurations

### 4. Monorepo Deployment Issues
- **Root Cause**: Vercel couldn't find Next.js in root directory (it's in `apps/web`)
- **Key Discovery**: Compared with OrchestraWebsite structure - it has Next.js at root level
- **Failed Attempts**:
  - Various vercel.json configurations
  - Different build commands and output directories
  - Root directory settings in project.json

### 5. Final Solution
- **Vercel Dashboard Settings** (critical for monorepo):
  - **Root Directory**: `apps/web`
  - **Framework Preset**: Next.js
  - **Build Command**: `pnpm build`
  - **Output Directory**: `.next`
  - **Install Command**: `pnpm install`
  - **Development Command**: `pnpm dev`
- **Result**: Successful deployment after dashboard configuration

### 6. Final Deployment
- **Updated CV**: Replaced CV file with updated version from root directory
- **Production Deploy**: Successfully deployed to production
- **URLs Active**:
  - https://homepage-delta-roan.vercel.app
  - https://homepage-core-francisco-parks-projects.vercel.app
  - Custom domain SSL certificates being created for corefranciscopark.com

## Technical Details

### Monorepo Structure Difference
- **OrchestraWebsite**: Flat structure with Next.js at root
- **Homepage**: Monorepo with Next.js in `apps/web` subdirectory
- **Key Learning**: Root Directory setting in Vercel dashboard is essential for monorepos

### DNS Configuration Notes
- Removed unnecessary DNS records:
  - DMARC record (email authentication)
  - DomainConnect record (GoDaddy proprietary)
  - Parked A record (blocking domain)

## Files Modified
- `/apps/web/app/(default)/blog/page.tsx` - TypeScript fix
- `/apps/web/components/cv-timeline.tsx` - TypeScript fix
- `/apps/web/public/CFPark_CV.pdf` - Updated CV
- `.gitignore` - Verified configuration
- `vercel.json` - Created and later removed (using dashboard settings instead)
- `.vercel/project.json` - Auto-configured by Vercel

## Deployment Status
✅ Git repository initialized and pushed to GitHub  
✅ Vercel project "homepage" created and configured  
✅ TypeScript errors fixed  
✅ Monorepo deployment working  
✅ Production deployment successful  
✅ Custom domain SSL certificates in progress