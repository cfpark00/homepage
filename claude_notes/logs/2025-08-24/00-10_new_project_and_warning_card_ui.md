# New Project and Warning Card UI Development

## Date: 2025-08-24, 00:10

## Summary
Added a new project "Do LLMs have dopamine?" to the website, created a custom WarningCard UI component, and refined various UI elements including prose styles and spacing.

## Tasks Completed

### 1. Project System Investigation
- Confirmed that adding new projects only requires:
  - Adding entry to `/apps/web/content/projects/metadata.json`
  - Creating folder with `index.mdx` in `/apps/web/content/projects/[slug]/`
- No lib or app code changes needed due to dynamic loading system

### 2. New Project Addition: "Do LLMs have dopamine?"
- Added metadata entry with slug `llm-dopamine`
- Created project folder and comprehensive MDX content
- Focused on causal internal representations of reward in LLMs
- Topics covered: mechanistic interpretability, behavioral analysis, theoretical framework

### 3. WarningCard UI Component Development
- Created new component at `/packages/ui/src/components/warning-card.tsx`
- Features:
  - Orange/red warning color scheme (orange-50 bg, orange-200 border)
  - AlertTriangle icon from lucide-react
  - Responsive dark mode support
  - Clean flex layout with proper spacing
- Added semi-placeholder warnings to all non-external projects

### 4. MDX Prose Style Fixes
- Identified prose wrapper interference causing mysterious margins (17.5px)
- Solution: Wrapped WarningCard components in `not-prose` divs
- Documented this gotcha in `typescript-in-mdx-gotchas.md` with new example
- Key learning: Odd computed values often indicate prose style interference

### 5. UI Spacing Refinements
- Adjusted h1/h2 top margins in project pages (h1: mt-6, h2: mt-4)
- Reduced project page header bottom margin from 32px to 24px
- Removed redundant h1 title from llm-dopamine project content
- Fixed nested `<p>` HTML validation error by using `<span>` in WarningCard

### 6. Component Structure Improvements
- Simplified WarningCard from nested divs to single flex container
- Fixed padding and margin issues through iterative refinement
- Changed warning text from "half placeholder" to "semi-placeholder"

## Technical Decisions

### Architecture
- Maintained consistency with existing UI component patterns
- Used forwardRef pattern for WarningCard following shadcn/ui conventions
- Leveraged `not-prose` escape hatch for MDX components

### Styling
- Used Tailwind classes exclusively for consistency
- Chose subtle orange tones for warning without being too aggressive
- Maintained dark mode compatibility throughout

## Files Modified
- `/apps/web/content/projects/metadata.json` - Added llm-dopamine project
- `/apps/web/content/projects/llm-dopamine/index.mdx` - New project content
- `/packages/ui/src/components/warning-card.tsx` - New UI component
- `/apps/web/content/projects/research-tracking/index.mdx` - Added warning card
- `/apps/web/content/projects/evolving-research/index.mdx` - Added warning card
- `/apps/web/app/(default)/projects/[slug]/page.tsx` - Adjusted spacing
- `/claude_notes/tips/typescript-in-mdx-gotchas.md` - Added new example

## Files Created
- `/apps/web/content/projects/llm-dopamine/index.mdx`
- `/packages/ui/src/components/warning-card.tsx`

## Next Steps
- Consider adding project thumbnails for new projects
- May need to revisit prose styles globally for better MDX component integration
- Could extend WarningCard with different severity levels (info, warning, error)