# Beta Blog System and MDX Math Configuration

## Date: 2025-08-24, 16:10

## Summary
Implemented a beta/private blog system for research paper previews, configured MDX to properly render LaTeX math expressions, and added the "Liquid Crystal Society" research paper as the first beta post. Resolved significant MDX parsing issues with math expressions.

## Tasks Completed

### 1. Beta Blog System Implementation
- Created `/blog/beta` page for private research posts
- Added subtle "Beta Research →" link at bottom of main blog page
- Modified `getBlogPosts()` to support filtering beta posts
- Updated blog post page to route back to beta page for beta posts
- Added visual indicators (amber colors, beta badges) for beta content

**Key Features:**
- Beta posts completely hidden from main `/blog` page
- Direct URLs still work for sharing with collaborators
- No password protection (security through obscurity as requested)
- Beta page not linked in main navigation

### 2. MDX Math/LaTeX Configuration
- **Problem**: Math expressions weren't rendering, showing literal `$...$` text
- **Root Cause**: Missing remark-math and rehype-katex plugins in Next.js config
- **Solution**:
  - Added `remark-math` and `rehype-katex` to `next.config.mjs`
  - Imported KaTeX CSS in root layout (`import "katex/dist/katex.min.css"`)
  - Discovered that with proper setup, NO escaping of curly braces needed!

### 3. MDX Math Debugging Journey
- Initially thought curly braces needed escaping (they don't with proper plugins)
- Created test file to isolate issues
- Documented findings in `/claude_notes/tips/math-latex-mdx.md`
- Key learning: `remark-math` handles LaTeX naturally without escaping

### 4. Liquid Crystal Society Paper
- Converted LaTeX paper to MDX format
- Added as beta post with metadata:
  - Title: "A Liquid Crystal Society: Modeling Human-AI Collective Dynamics"
  - Topics: AI alignment, complex systems, opinion dynamics
  - Authors: Yongyi Yang, Ken Suzuki, Hidenori Tanaka
  - Potential contributors: Maya Okawa, Core Francisco Park
- Fixed formatting issues with WarningCard component using `not-prose` wrapper

### 5. Component Styling Fixes
- **Problem**: WarningCard had mysterious 17.5px margins in MDX
- **Cause**: Prose typography styles interfering with component
- **Solution**: Wrapped component in `<div className="not-prose">` to escape prose styling
- Learned about prose/not-prose pattern for MDX component isolation

## Technical Insights

### MDX + Math Setup Requirements
1. Install: `pnpm add remark-math rehype-katex katex`
2. Configure plugins in `next.config.mjs`
3. Import KaTeX CSS in layout
4. Use standard LaTeX syntax (no escaping needed!)

### Prose Class Interference
- MDX content wrapped in `prose` classes for typography
- These styles can break component layouts (weird margins, alignment issues)
- Solution: Use `not-prose` wrapper around React components in MDX

## Files Created/Modified

### Created
- `/apps/web/app/(default)/blog/beta/page.tsx` - Beta blog listing page
- `/apps/web/content/blog/liquid-crystal-society/index.mdx` - Research paper
- `/claude_notes/tips/math-latex-mdx.md` - Documentation for MDX math

### Modified
- `/apps/web/app/(default)/blog/page.tsx` - Added beta link
- `/apps/web/app/(default)/blog/[slug]/page.tsx` - Beta-aware routing
- `/apps/web/lib/blog.ts` - Beta filtering support
- `/apps/web/content/blog/metadata.json` - Added beta flag
- `/apps/web/next.config.mjs` - Math plugin configuration
- `/apps/web/app/layout.tsx` - KaTeX CSS import

## Deployment Notes
- Beta system live and functional
- Math rendering working correctly
- Liquid Crystal Society paper accessible at `/blog/liquid-crystal-society`
- Only visible through `/blog/beta` page, not main blog

## Next Steps
- Could add password protection if needed (currently just unlisted)
- May want to add more visual differentiation for beta posts
- Consider adding "last updated" timestamps for research drafts