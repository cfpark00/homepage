# Neural Scaling Laws Blog Post and Content Ordering

## Date: 2025-08-25, 13:11

## Summary
Created an interactive blog post about neural scaling laws with customizable visualizations, implemented manual ordering for blog posts and projects, added LaTeX math rendering support, and successfully deployed all changes to production.

## Tasks Completed

### 1. Build Verification and Deployment
- Ran initial `pnpm build` to verify no existing errors
- Successfully deployed to production via `vercel --prod` (initial deployment)
- Deployed again after all changes completed

### 2. New Blog Post: Neural Scaling Laws
- Created `/apps/web/content/blog/neural-scaling-laws/` directory
- Developed interactive React component (`scaling-laws-visualization.tsx`) featuring:
  - Adjustable scaling law parameters (L₀, Nᶜ, Dᶜ, αₙ, αᴅ)
  - Flexible axis configuration (parameters/compute/data vs loss/compute/data)
  - Multiple curve visualizations (compute-optimal frontier, infinite compute limit)
  - Real-time interactive charts using Recharts library
- Wrote comprehensive MDX content (`index.mdx`) covering:
  - Chinchilla scaling equations
  - Compute-optimal scaling strategies
  - Mathematical derivations and practical implications
- Added blog post metadata entry with appropriate tags
- Installed required dependency: `recharts` for data visualization

### 3. LaTeX Math Rendering Implementation
- Verified existing setup:
  - `remark-math` and `rehype-katex` packages already installed
  - Plugins configured in `next.config.mjs`
  - KaTeX CSS imported in `app/layout.tsx`
- Updated blog post to use proper LaTeX notation:
  - Display equations with `$$...$$`
  - Inline math with `$...$`
  - Converted all mathematical expressions from plain text to LaTeX format

### 4. Content Ordering System Refactoring
- Modified `/apps/web/lib/blog.ts` to use manual ordering from metadata.json
  - Removed date-based sorting
  - Now preserves order as defined in metadata file
- Modified `/apps/web/lib/projects.ts` similarly for consistent behavior
- Reordered blog posts as requested:
  1. double-pendulum-chaos (dp)
  2. gradient-optimizer-comparison (go)  
  3. neural-scaling-laws (sl)
  4. random-walks-visualization (rw)
  5. welcome-to-my-blog (welcome)
  6. liquid-crystal-society (beta)
- Projects order maintained (already correct):
  1. orchestra (orch)
  2. research-tracking (rts)
  3. evolving-research (er)
  4. llm-dopamine (dopamine)

### 5. Blog Post Tagging Update
- Simplified and standardized tags across all blog posts:
  - **double-pendulum-chaos**: physics, chaos, simulation
  - **gradient-optimizer-comparison**: optimization, machine learning, deep learning
  - **neural-scaling-laws**: deep learning, artificial intelligence, LLMs
  - **random-walks-visualization**: simulation, probability
  - **welcome-to-my-blog**: test
  - **liquid-crystal-society**: AI and society, opinion dynamics, multi-agent systems

### 6. Beta Research Configuration
- Marked neural-scaling-laws as beta research post
- Now appears only in `/blog/beta` alongside liquid-crystal-society
- Hidden from main blog listing

## Technical Details

### Dependencies Added
- `recharts@3.1.2` - For interactive data visualization in scaling laws post

### Files Created
- `/apps/web/content/blog/neural-scaling-laws/index.mdx`
- `/apps/web/content/blog/neural-scaling-laws/scaling-laws-visualization.tsx`

### Files Modified
- `/apps/web/content/blog/metadata.json` - Added new post, reordered entries, updated tags
- `/apps/web/lib/blog.ts` - Removed date sorting, use metadata order
- `/apps/web/lib/projects.ts` - Removed date sorting, use metadata order
- `/apps/web/content/projects/metadata.json` - Maintained existing order

### Build Status
- All TypeScript types validated successfully
- No compilation errors
- 26 static pages generated
- LaTeX math rendering verified
- Interactive components functioning correctly

## Deployment Results
- Successfully deployed to Vercel production
- All interactive visualizations working
- Manual ordering system functioning as expected
- Beta posts properly segregated
- LaTeX equations rendering correctly

## Notes
- The scaling laws visualization adapts equations from `/resources/scaling-laws/plot_scaling_frontier.py`
- Made equations more flexible for different axis configurations
- Manual ordering provides better control over content presentation
- LaTeX setup was already complete, just needed to use proper syntax