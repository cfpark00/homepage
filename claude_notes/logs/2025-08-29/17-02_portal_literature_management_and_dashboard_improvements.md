# Portal Literature Management and Dashboard Improvements

**Date**: 2025-08-29 17:02
**Focus**: Research portal dashboard enhancements, literature management, and priority/starred papers system

## Summary

Extensive improvements to the research portal's literature management system, focusing on paper prioritization, starred papers, and dashboard usability enhancements.

## Tasks Completed

### 1. Literature Management
- Added arxiv paper "Emergence of Chemotactic Strategies with Multi-Agent Reinforcement Learning" to evolution-research project
- Added arxiv paper "Transformers represent belief state geometry in their residual stream" to llms-dopamine project
- Set `focus: true` for llms-dopamine and representation-vs-objective projects to promote them in sidebar

### 2. Priority System Adjustments
- Set priority scores for multiple papers:
  - "A Pretrainer's Guide to Training Data" → priority: 11
  - "TD Errors in LLMs" paper → priority: 10
  - "Beyond Autoregression: Discrete Diffusion" → priority: 8 (later removed)
  - "Scaling up the think-aloud method" → priority: 7
- Removed priority scores from:
  - "The pitfalls of next-token prediction"
  - "The Factorization Curse"
  - "The Mystery of the Pathological Path-star Task"
  - "Loss Landscape Degeneracy"
  - "Diffusion Beats Autoregressive"
  - "Beyond Autoregression"
  - "Invariant representations of mass in the human brain"

### 3. Starred Papers System
- Introduced `starred` field for papers
- Set "Invariant representations of mass in the human brain" as starred
- Created new `StarredPapers` component to display starred papers on dashboard
- Added `getStarredPapers()` function to collect starred papers across all projects

### 4. Dashboard UI Improvements

#### Priority Papers Section
- Removed "Papers ranked by global priority" subtitle
- Removed star icon from Priority Papers header
- Changed to fetch up to 100 priority papers instead of 10
- Added "Show more" button for displaying papers beyond the first 10
- Created client-side `PriorityPapers` component for interactive show/hide

#### Dashboard Stats
- Changed "Active Projects" to "Focus Projects" (displays count of projects with focus: true)
- Changed "Total Items" to "Literature Items" (shows unique literature items across all projects)
- Removed "Last Activity" stat card (was hardcoded)
- Changed grid from 4 columns to 3 columns
- Implemented proper deduplication for literature items count using Set with unique IDs

#### Recent Activity
- Completely removed Recent Activity card (was showing hardcoded fake data)

### 5. Project Name Display
- Updated both `getTopPriorityPapers()` and `getStarredPapers()` to fetch project display names from metadata
- Modified `ProjectItem` interface to include `projectName` field
- Updated PriorityPapers and StarredPapers components to show project display names instead of slugs
- Project badges now show "Evolution Research" instead of "evolution-research", etc.

### 6. Bug Fixes
- Fixed literature items counting to handle duplicates across projects using unique IDs
- Added proper metadata fetching in paper collection functions

## Files Modified

### Components
- `/apps/portal/components/priority-papers.tsx` (created)
- `/apps/portal/components/starred-papers.tsx` (created)

### Pages
- `/apps/portal/app/(dashboard)/page.tsx` - Major refactoring for real data and new components

### Library
- `/apps/portal/lib/projects.ts` - Added getProjectStats(), getStarredPapers(), updated getTopPriorityPapers()

### Content Files
- `/apps/portal/content/projects/evolution-research/items.json` - Added new paper
- `/apps/portal/content/projects/evolution-research/literature.json` - Added new paper
- `/apps/portal/content/projects/llms-dopamine/literature.json` - Added new paper, updated priorities
- `/apps/portal/content/projects/llms-dopamine/metadata.json` - Added focus: true
- `/apps/portal/content/projects/representation-vs-objective/metadata.json` - Added focus: true
- `/apps/portal/content/projects/representation-vs-objective/literature.json` - Updated priorities
- `/apps/portal/content/projects/domain-ablated-llms/literature.json` - Updated priorities
- `/apps/portal/content/projects/origins-representations/literature.json` - Added starred field
- `/apps/portal/content/projects/research-thought-tracking/literature.json` - Updated priorities

## Technical Decisions

1. **Client Components for Interactivity**: Created separate client components (PriorityPapers, StarredPapers) to handle interactive features while keeping main page as server component

2. **Deduplication Strategy**: Used Set data structure with paper IDs to count unique literature items across projects

3. **Project Name Resolution**: Fetch metadata.json alongside literature.json to get human-readable project names

4. **Priority System**: Maintained global priority scores while introducing starred papers as a separate highlighting mechanism

## Impact

- Dashboard now shows real, dynamic data instead of hardcoded placeholders
- Improved user experience with collapsible paper lists and clear project attribution
- Better organization of important papers through dual priority/starred system
- Cleaner interface by removing non-functional elements (Recent Activity, Last Activity)
- More accurate statistics through proper deduplication