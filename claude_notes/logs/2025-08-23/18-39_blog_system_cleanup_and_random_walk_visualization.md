# Blog System Cleanup and Interactive Random Walk Visualization
**Date:** 2025-08-23  
**Time:** 18:39  
**Project:** Academic Homepage - Blog Infrastructure and Interactive Visualizations

## Summary
Major cleanup of the blog system, removal of unused API routes, implementation of a fully static MDX-based blog, and creation of an advanced interactive random walk visualization with real-time analytics.

## Major Tasks Completed

### 1. Blog System Overhaul
- **Removed unused API routes** (`/api/blog/*`) that were never utilized
- **Fixed blog post listing** to properly display posts with metadata
- **Implemented two blog types**:
  - Simple markdown posts (single `.md`/`.mdx` files)
  - Interactive posts (folders with components)
- **Fixed MDX rendering** with proper Tailwind Typography plugin configuration

### 2. Codebase Cleanup
- **Removed 11 unused npm packages** including:
  - `@hookform/resolvers`, `@tanstack/react-query`, `next-mdx-remote` (initially), `react-hook-form`, `zod`
  - UI package: `@radix-ui/react-accordion`, `recharts`, `cmdk`, `embla-carousel-react`, `react-day-picker`, `vaul`
- **Deleted unused files/directories**:
  - `/scratch` directory with experimental code
  - `lib/reorganize-layout.js` utility script
- **Fixed deprecated patterns**:
  - Updated Next.js config from `images.domains` to `remotePatterns`
  - Removed unnecessary `./pages/**/*` from Tailwind config

### 3. Interactive Random Walk Visualization
Created a sophisticated random walk visualization with three iterations:

#### Version 1 (Basic)
- 2D grid with random walk animation
- Play/pause controls
- Speed adjustment
- 1K step generation

#### Version 2 (Enhanced)
- **Unlimited grid** (200x200 vs 20x20)
- **Pan and zoom** capabilities (mouse drag + wheel)
- **Pinch zoom support** for trackpads
- **+1K/+10K step buttons** (additive, not reset)
- **Graceful termination** with warnings at 100K and hard limit at 200K steps
- **Performance optimizations** for large datasets

#### Version 3 (With Analytics)
Added real-time analytical plots:
- **Distance vs Time plot**: Shows actual distance compared to theoretical E[r]=√t
- **Distribution plot**: "Is your run unusual?" - Rayleigh distribution with current position indicator
- **Performance optimizations**:
  - Memoized expensive calculations (SVG path, bounds, distributions)
  - Batched state updates to prevent 10K re-renders
  - Pre-calculated distance history

### 4. MDX Blog Infrastructure
- **Self-contained blog posts**: Each post with components in its own folder
- **Client-side interactivity**: Support for React components in MDX
- **Math rendering**: Initially attempted LaTeX support, simplified to Unicode
- **Created documentation**: Comprehensive MDX setup guide at `claude_notes/tips/mdx-blog-setup.md`

## Technical Achievements

### Performance Optimizations
- **Reduced stack overflow issues** by replacing spread operators with reduce for large arrays
- **Memoization strategy** using `useMemo` for:
  - SVG path generation (can be 100K+ points)
  - Bounds calculations
  - Distribution calculations
  - Expected distance arrays
- **Batch updates** for adding 10K steps in single render cycle

### Mathematical Implementation
- **Rayleigh distribution**: P(r,t) = (r/t) × exp(-r²/2t) for 2D random walks
- **Real-time statistics**: Distance from origin, bounds, max extent
- **Theoretical comparisons**: Expected vs actual distance visualization

### UI/UX Improvements
- **Zoom capture**: Prevents page zoom when interacting with visualization
- **Responsive design**: Works on mobile with touch support
- **Visual feedback**: Warnings for performance limits
- **Intuitive controls**: Speed as steps/second (not interval)

## File Structure Changes
- Removed `/apps/web/app/api/` directory
- Removed `/scratch/` directory
- Added `/apps/web/content/blog/random-walks-visualization/` with:
  - `index.mdx` - Blog content
  - `random-walk.tsx` - Original component
  - `random-walk-v2.tsx` - Enhanced version
  - `random-walk-v3.tsx` - Version with analytics
- Added `/apps/web/app/(default)/blog/random-walks-visualization/page.tsx`
- Added `/claude_notes/tips/mdx-blog-setup.md`

## Bugs Fixed
- React version mismatch errors with `next-mdx-remote`
- TypeScript JSX intrinsic elements errors
- LaTeX rendering issues in MDX (replaced with Unicode)
- Grid rendering issue in 4th quadrant
- Speed slider direction (now higher = faster)
- Stack overflow with large path arrays

## Lessons Learned
1. **MDX complexity**: Server components vs client components require different approaches
2. **Performance at scale**: Even simple operations become expensive with 100K+ data points
3. **React 18 batching**: State updates can still cause multiple renders if not properly batched
4. **Memoization critical**: For large datasets, recalculation on every render is prohibitive
5. **Typography plugin**: Must be properly configured in Tailwind config, not just installed

## Next Steps Potential
- Add WebGL rendering for million+ point walks
- Implement path simplification algorithms
- Add export functionality for walk data
- Create more interactive blog posts with embedded visualizations
- Consider moving to Canvas for better performance with large datasets