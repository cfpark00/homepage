# Portal Projects Template System Implementation

**Date**: 2025-08-28  
**Time**: 01:13  
**Focus**: Research Portal project system with file-based content management

## Summary

Implemented a complete project management system for the research portal, converting it from hardcoded mock data to a file-based content management system inspired by the web app's blog/thoughts implementation.

## Key Accomplishments

### 1. Project Template System
- Created file-based project system at `/apps/portal/content/projects/[project-name]/`
- Each project has:
  - `metadata.json` - Project info, tabs, colors, icons, status
  - `items.json` - Project items with type, tab assignment, sharing status
- Projects automatically populate sidebar from directory content

### 2. Dynamic Tab System
- Projects can define custom tabs in metadata
- Tabs show item counts as badges
- Items are grouped by tab assignment
- Projects without tabs show simple card layout

### 3. Project Updates
- **Origins of Representations**: Full tabbed layout with 6 custom tabs
- **Domain Ablated LLMs**: Replaced "Neural Scaling Laws" project
  - Based on blog post about training LLMs with ablated knowledge domains
  - Minimal implementation with 3 core items

### 4. UI Improvements
- Added project logos support (PNG files in `/public/project-logos/`)
- Fixed sidebar collapse/expand functionality 
- Improved mobile responsive behavior
- Fixed hamburger menu positioning in title bars
- Added subtle background colors to project cards
- Reduced padding for cleaner look

### 5. Project Ordering
- Projects sorted by `last_updated_at` field
- Falls back to `created` date if not specified
- Most recently updated projects appear first

## Technical Implementation

### File Structure
```
/apps/portal/
├── content/projects/
│   ├── origins-representations/
│   │   ├── metadata.json
│   │   └── items.json
│   └── domain-ablated-llms/
│       ├── metadata.json
│       └── items.json
├── lib/
│   └── projects.ts  # Loading utilities
└── components/
    ├── project-tabs.tsx  # Dynamic tab renderer
    └── page-header.tsx   # Unified header with hamburger
```

### Key Functions
- `getAllProjects()` - Loads all project metadata from directories
- `getProjectBySlug()` - Loads specific project with items
- Dynamic icon/color mapping for visual consistency

## Bug Fixes & Debugging

### Process.cwd() Issue
- Initial path was doubling: `/apps/portal/apps/portal/content/`
- Fixed: `process.cwd()` in Next.js returns app directory, not monorepo root
- Solution: Use `path.join(process.cwd(), 'content/projects')`

### Sidebar State Management
- Created SidebarContext for shared state
- Fixed collapsed sidebar behavior on desktop
- Proper hamburger button placement when collapsed

### Mobile Responsiveness
- Fixed transparent drawer background
- Prevented hamburger overlap with content
- Added proper padding to avoid UI conflicts

## Code Cleanup
- Removed debug console.log statements
- Deleted unused components:
  - portal-layout.tsx
  - sidebar.tsx  
  - logout-button.tsx
- Cleaned up unused imports
- Kept necessary files like theme-provider

## Files Modified

### Created
- `/apps/portal/content/projects/` directory structure
- `/apps/portal/lib/projects.ts`
- `/apps/portal/components/page-header.tsx`
- `/apps/portal/components/sidebar-context.tsx`
- `/apps/portal/components/project-tabs.tsx` (rewritten)

### Modified
- `/apps/portal/app/page.tsx` - Load projects dynamically
- `/apps/portal/app/[project_slug]/page.tsx` - Use file-based data
- `/apps/portal/components/sidebar-simple.tsx` - Dynamic projects
- `/apps/portal/components/portal-layout-simple.tsx` - Sidebar state

### Deleted
- Unused components (portal-layout, sidebar, logout-button)
- Old hardcoded mock data

## Next Steps Potential
- Add search/filter for project items
- Implement actual sharing functionality
- Add project creation UI
- Connect to Supabase for persistence
- Add markdown content support for items