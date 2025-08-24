# Random Walk Optimization and Blog Architecture Refactor Log
**Date:** 2025-08-23  
**Time:** 20:14  
**Project:** Academic Homepage - Random Walk Visualization & Blog System

## Summary
Optimized the random walk visualization for performance, fixing critical O(n²) bottlenecks, and refactored the blog system to use dynamic routing with a single page template to eliminate code duplication.

## Major Tasks Completed

### 1. Random Walk Performance Analysis & Optimization
- **Identified performance bottlenecks in v3**:
  - O(n) spread operator with `Math.max(...distanceHistory)` on every render
  - Complete distance history storage (200k+ elements)
  - Recalculation of bounds on every render
  - Result: O(n²) complexity when adding n steps

- **Created optimized v4 implementation**:
  - Removed all distance history tracking initially
  - Added back distance array parallel to path array
  - Sampled plotting (max 500 points) for large datasets
  - Single `Math.max()` calculation per render
  - Performance now acceptable up to 200k steps

- **Fixed implementation bugs**:
  - Corrected grid rendering threshold (0.3 → 0.8 zoom)
  - Fixed plot axis label cutoffs by adjusting transforms
  - Extended plot width usage (300px → 320px)
  - Added proper distance distribution calculations

### 2. Interactive Plots Implementation
- **Distance vs Time Plot**:
  - Shows actual distance (blue) vs expected √t (gray dashed)
  - Automatic scaling based on current data
  - Sampling for performance with large datasets

- **Distance Distribution Plot**:
  - Real-time Rayleigh distribution calculation
  - Current position indicator with value
  - Updates dynamically as simulation progresses
  - Shows probability up to 4 standard deviations

### 3. Blog System Architecture Refactor
- **Problem**: Duplicate page.tsx files for each blog post
- **Solution**: Dynamic routing with single page template

- **Implementation**:
  - Single `/blog/[slug]/page.tsx` handles all posts
  - Centralized metadata in `/lib/blog.ts`
  - Blog content in `/content/blog/{slug}/index.mdx`
  - Component registry for interactive elements

- **MDX Handling**:
  - Created client component wrapper (`mdx-content.tsx`)
  - Server component handles layout/metadata
  - Client component handles MDX rendering with React context

### 4. Blog Content Organization
- **Structure**:
  ```
  content/blog/
  ├── welcome-to-my-blog/
  │   └── index.mdx
  └── random-walks-visualization/
      ├── index.mdx
      └── random-walk.tsx
  ```

- **Removed duplicate titles** from MDX (handled by page.tsx)
- **Updated tags**:
  - Removed "general", "introduction", "mathematics"
  - Added "test" tag to both posts
  - Added "All Tags" section on main blog page

### 5. Content Updates
- **Random Walk Blog Post**:
  - Rewrote mathematics section to match visualization
  - Added plot explanations
  - Updated interaction instructions
  - Removed redundant sections (Applications, Try This)
  - Added concrete examples of √t scaling

### 6. Code Cleanup
- Deleted old versions (v1, v2, v3)
- Renamed v4 to main implementation
- Removed duplicate welcome-to-my-blog.mdx
- Removed specific page.tsx for random-walks

## Technical Decisions

### Performance Trade-offs
- Kept O(n) array copying for React immutability (acceptable for 100k points)
- Chose sampling over full data for plots (visual quality vs performance)
- Path simplification for SVG rendering when >5000 points

### Architecture Choices
- Dynamic imports require explicit cases due to Next.js MDX limitations
- Client/server component split for MDX rendering
- Centralized metadata over frontmatter (simpler, type-safe)

## Files Modified/Created

### Created
- `/apps/web/content/blog/random-walks-visualization/random-walk.tsx` (final optimized version)
- `/apps/web/content/blog/welcome-to-my-blog/index.mdx`
- `/apps/web/components/mdx-content.tsx`

### Modified
- `/apps/web/app/(default)/blog/[slug]/page.tsx` (dynamic routing)
- `/apps/web/app/(default)/blog/page.tsx` (added all tags section)
- `/apps/web/lib/blog.ts` (centralized metadata)
- `/apps/web/content/blog/random-walks-visualization/index.mdx` (content updates)

### Deleted
- `/apps/web/app/(default)/blog/random-walks-visualization/page.tsx`
- `/apps/web/content/blog/random-walks-visualization/random-walk.tsx` (v1)
- `/apps/web/content/blog/random-walks-visualization/random-walk-v2.tsx`
- `/apps/web/content/blog/random-walks-visualization/random-walk-v3.tsx`
- `/apps/web/content/blog/welcome-to-my-blog.mdx` (old location)

## Performance Results
- **Before**: +10K steps caused significant lag, O(n²) operations
- **After**: +10K steps nearly instant, supports up to 200K steps smoothly
- **Key improvement**: Eliminated repeated O(n) operations on render

## Next Steps Potential
- Implement automatic reading time calculation
- Add tag filtering on blog page
- Consider persistent data structures for >200k steps
- Add more blog posts to test scaling

## Lessons Learned
1. **Profile before optimizing**: Initial assumption about bounds checking was wrong
2. **MDX in Next.js App Router** requires careful client/server separation
3. **Dynamic imports with template literals** don't work with MDX in production
4. **React immutability** creates inherent O(n) operations that may be acceptable

## Git Commits
- "Add optimized random walk visualization with performance improvements" (5af880b)