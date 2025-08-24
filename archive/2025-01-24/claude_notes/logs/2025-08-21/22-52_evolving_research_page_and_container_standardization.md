# Evolving Research Page and Container Standardization
**Date**: 2025-08-21
**Time**: 22:52
**Session Focus**: Creating new research page and standardizing layout containers

## Summary
Added a new "Evolving Research" project page to the website and created a standardized PageContainer component to maintain consistent layout across all pages.

## Changes Made

### 1. Ongoing Page Updates
- **File**: `apps/web/app/(default)/ongoing/page.tsx`
- Added third project card for "Evolving Research"
  - Title: "Evolving Research"
  - Description: "Understanding how research and discovery itself has evolved using digital evolution."
  - Used existing image from `/images/ongoing/evolving-research/evolving-research.png`
  - Links to internal `/evolving-research` page

### 2. New Evolving Research Page
- **File**: `apps/web/app/(default)/evolving-research/page.tsx` (new)
- Created comprehensive research project page with:
  - Back navigation button
  - "Planning Phase" badge to indicate project status
  - Planned research focus areas (Digital Evolution, Cross-Domain Learning, Computational Discovery, Emergent Patterns)
  - Core belief statement about research methodologies evolving like living systems
  - Planned investigations section (simplified from cards to compact list format)
  - Open questions section
  - Suggested reading section with three academic papers:
    - "The Surprising Creativity of Digital Evolution" (arxiv.org/abs/1803.03453)
    - "Evolving Neural Networks through Augmenting Topologies (NEAT)" (ieeexplore.ieee.org/document/6790655)
    - "Evolution Strategies as a Scalable Alternative to Reinforcement Learning" (arxiv.org/abs/1703.03864)

### 3. PageContainer Component
- **File**: `packages/ui/src/components/page-container.tsx` (new)
- Created reusable container component to standardize page layouts
- Provides consistent:
  - Container padding: `py-8 md:py-12`
  - Maximum width: `max-w-4xl`
  - Centered content with responsive margins
- Supports custom className overrides for both outer and inner containers
- Exported from `packages/ui/src/index.ts`

### 4. Updated Pages to Use PageContainer
- **File**: `apps/web/app/(default)/evolving-research/page.tsx`
  - Replaced manual container divs with `<PageContainer>`
- **File**: `apps/web/app/(default)/research-tracking/page.tsx`
  - Replaced manual container divs with `<PageContainer>`
  - Note: User also removed the left border styling from core belief section

### 5. Documentation for Contributors
- **File**: `CLAUDE.md` (new)
- Created comprehensive guidelines for AI agents and developers:
  - Project structure (monorepo root, Vercel project name)
  - Important rules (never run pnpm dev/build unless requested)
  - References to related docs (SHADCN_TIPS.md, DEPLOYMENT.md)
  - Page layout standards using PageContainer
  - Component import patterns
  - File organization conventions
  - Styling guidelines

## Key Decisions
- Simplified the evolving research page design:
  - Removed colored indicators/bars for cleaner appearance
  - Used compact list format instead of large cards for planned investigations
  - Made it clear this is research in planning phase, not active work
- Created standardized container component to solve the problem of manually setting margins/padding on every page
- Documented the patterns for future contributors (both human and AI)

## Technical Improvements
- **Problem Solved**: Previously, every page manually specified `className="container py-8 md:py-12"` and `className="mx-auto max-w-4xl"`, requiring contributors to know these conventions
- **Solution**: PageContainer component centralizes these styles, making it easier for new contributors to maintain consistency
- **Documentation**: CLAUDE.md provides clear guidelines for AI agents and developers

## Files Modified
- `apps/web/app/(default)/ongoing/page.tsx` - Added Evolving Research project
- `apps/web/app/(default)/evolving-research/page.tsx` - Created new page
- `apps/web/app/(default)/research-tracking/page.tsx` - Updated to use PageContainer
- `packages/ui/src/components/page-container.tsx` - Created new component
- `packages/ui/src/index.ts` - Added export for PageContainer
- `CLAUDE.md` - Created documentation file

## Next Steps Suggested
- Consider updating all other pages to use PageContainer component
- Could create similar standardized components for other repeated patterns