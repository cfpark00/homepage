# Ablated Knowledge Blog Post Refinement

## Date: 2025-08-26, 15:53

## Summary
Refined and improved the "Ablated Knowledge OOD Training" beta blog post, focusing on content organization, visual enhancements, MDX formatting fixes, and resolving technical issues with table of contents navigation.

## Tasks Completed

### 1. Metadata Updates
- Changed blog post date from 2025-08-26 to 2025-08-25
- Updated tags from ["LLMs", "evaluation", "machine learning", "AI safety"] to ["LLMs", "meta-research", "self-evolution"]
- Removed duplicate author attribution (was in both metadata and MDX content)

### 2. Content Restructuring
- Added TL;DR at the top of the post
- Added "Goals" section with four key objectives:
  - Testing if LLMs can truly generalize OOD
  - Creating a testbed for measuring learning capability vs memorization
  - Addressing fundamental questions about intelligence
  - Quantifying AI's societal impact
- Added Table of Contents with 8 main sections
- Reorganized sections: swapped "Current Solutions" and "Contamination Problem" for better narrative flow
- Added "The Grand Question: Are LLMs the Path to AGI?" as the opening section
- Incorporated Demis Hassabis' AGI definition with proper formatting and citation

### 3. Academic Content Improvements
- Replaced simplistic equation with concrete research citations:
  - Balloccu et al. 2024 (4.7M samples exposure)
  - Oren et al. 2023 (performance inflation evidence)
  - Li et al. 2023 (57% test set memorization)
  - Sainz et al. 2023 (scientific validity crisis)
- Added "The Interpolation Hypothesis" definition card
- Added "The Marginal Generalization Hypothesis" as contrasting theory
- Cited Balestriero et al. 2021 on high-dimensional extrapolation paradox
- Enhanced transitions between sections for better academic flow

### 4. Visual and UI Enhancements
- Created styled definition cards with gradient backgrounds for hypotheses
- Added collapsible "Discussion" dropdown for additional context
- Implemented "Back to TOC" floating button component
- Removed research warning card per user request
- Adjusted padding for visual elements (p-6 to p-4 for consistency)

### 5. Technical Fixes
- **Fixed TOC Navigation Issues:**
  - Installed and configured `rehype-slug` package for automatic heading ID generation
  - Updated `next.config.mjs` to include rehype-slug in MDX pipeline
  - Added smooth scrolling CSS in `globals.css`
  - Added `scroll-margin-top: 80px` for proper offset with fixed headers
- **Resolved MDX/HTML Nesting Errors:**
  - Fixed nested `<p>` tag issues causing hydration errors
  - Used `<div>` instead of `<p>` in custom components
  - Added `not-prose` class to prevent unwanted prose styling
- **Link Improvements:**
  - Updated all external links to open in new tabs with `target="_blank"`
  - Added `rel="noopener noreferrer"` for security
  - Removed blue color styling, keeping only underline

### 6. Files Modified
- `/apps/web/content/blog/ablated-knowledge-ood-training/index.mdx` - Main content
- `/apps/web/content/blog/ablated-knowledge-ood-training/metadata.json` - Post metadata
- `/apps/web/content/blog/ablated-knowledge-ood-training/back-to-toc.tsx` - New component
- `/apps/web/next.config.mjs` - Added rehype-slug configuration
- `/apps/web/app/globals.css` - Added smooth scrolling styles
- `/apps/web/package.json` - Added rehype-slug dependency

### 7. Cleanup
- Removed unused `table-of-contents.tsx` component after simplification

## Key Technical Learnings

### MDX Table of Contents Best Practices
- Standard markdown anchor links work best when combined with `rehype-slug`
- Avoid complex React components for simple navigation needs
- The rehype ecosystem provides robust solutions for common MDX needs

### MDX HTML Nesting Rules
- MDX wraps content in `<p>` tags automatically
- Custom HTML/JSX components should avoid `<p>` elements to prevent nesting
- Use `not-prose` class to escape Tailwind Typography styling when needed

## Next Steps (Suggested)
- Consider adding more interactive visualizations for the ablation concepts
- Could benefit from diagrams showing knowledge ablation process
- May want to add code examples for implementation details