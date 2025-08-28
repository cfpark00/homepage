# Portal Fixes and Blog Image Integration

## Date: 2025-08-28, 01:36

## Summary
Fixed lucide-react icon import errors in the portal app, improved sidebar UI for active project highlighting, created new "Grand Synthetic Data" project, analyzed portal/web app architectures, and integrated proposal image into the ablated knowledge blog post.

## Tasks Completed

### 1. Portal Icon Import Fixes
- **Fixed lucide-react barrel optimization errors:**
  - Changed `Flask` → `FlaskConical`
  - Changed `ChartBar` → `BarChart3`
  - Updated imports in `/apps/portal/components/project-tabs.tsx`

### 2. Sidebar UI Improvements
- **Fixed unintuitive active project styling:**
  - Active projects now have visible background (`bg-primary/10`)
  - Inactive projects are transparent until hovered
  - Changed from "invisible when selected" to "highlighted when selected"
  - Updated icon backgrounds and colors for better contrast

### 3. Grand Synthetic Data Project
- **Created new research project in portal:**
  - Path: `/apps/portal/content/projects/grand-synthetic-data/`
  - Added metadata.json with 4 tabs (Overview, Datasets, Generation, Evaluation)
  - Added items.json with 8 sample items including:
    - Synthetic reasoning chains dataset
    - Code completion pairs
    - Multilingual conversations
    - Data generator v3
    - Quality filter model
    - Diversity metrics analysis
  - Purple color scheme with Database icon

### 4. Favicon Integration
- **Copied Orchestra app favicon to portal:**
  - Used v2 icons from orchestra-app-dev
  - Updated portal layout.tsx with proper icon configuration
  - Added multiple favicon sizes and Apple touch icon

### 5. Architecture Analysis
- **Confirmed portal app structure:**
  - Framework code in `/apps/portal/app/`
  - Content in `/apps/portal/content/projects/`
  - Complete separation of presentation and data
  - Projects are pure JSON (metadata.json + items.json)

- **Analyzed web app blog structure:**
  - Blog posts in `/apps/web/content/blog/`
  - Each post is a folder with index.mdx + metadata.json
  - MDX allows React components in markdown
  - "Ablated Knowledge OOD Training" post is a beta research proposal

### 6. Blog Image Integration
- **Added proposal.png to ablated knowledge blog post:**
  - Fixed MDX image import (needed Next.js Image component)
  - Set image to 50% width with centering
  - Added figure caption with "Figure 1:" label
  - Caption explains current vs proposed training approaches
  - Positioned right after TL;DR for immediate visual context

## Files Modified

### Portal App
- `/apps/portal/components/project-tabs.tsx` - Fixed icon imports
- `/apps/portal/components/sidebar-simple.tsx` - Improved active state styling
- `/apps/portal/app/layout.tsx` - Added favicon configuration
- `/apps/portal/app/favicon.ico` - Replaced with Orchestra v2 favicon
- `/apps/portal/public/icons/` - Added v2 icon set

### Portal Content
- `/apps/portal/content/projects/grand-synthetic-data/metadata.json` - New project
- `/apps/portal/content/projects/grand-synthetic-data/items.json` - Project items

### Web App Blog
- `/apps/web/content/blog/ablated-knowledge-ood-training/index.mdx` - Added proposal image with proper imports and caption

## Key Insights

1. **Portal Architecture:** The portal uses a clean content/framework separation where all project data lives in JSON files, making it easy to add projects without touching code.

2. **MDX Requirements:** In MDX files, images must be imported as modules and rendered with Next.js Image component, not standard markdown syntax.

3. **Icon Naming:** Lucide-react uses specific icon names that differ from common expectations (FlaskConical not Flask, BarChart3 not ChartBar).

4. **UI/UX Principle:** Active states should be visually prominent, not invisible - the selected item should stand out more than unselected items.

## Next Steps Suggested
- Consider adding more projects to the portal
- Potentially implement activity tracking for the dashboard
- Could add more interactive components to blog posts using MDX capabilities