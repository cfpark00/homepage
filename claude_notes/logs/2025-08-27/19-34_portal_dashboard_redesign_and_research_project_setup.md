# Portal Dashboard Redesign and Research Project Setup

## Date: 2025-08-27, 19:34

## Summary
Major redesign of the Research Portal with a new dashboard layout, simplified sidebar navigation, implemented the "Origins of Representations" research project with literature tracking, and added various UI improvements including floating AI chat and theme toggle.

## Tasks Completed

### 1. Thoughts Page Updates
- Added multiple new thoughts to 2025-08-27.json (ids 7-23)
- Fixed markdown link formatting for arxiv paper reference
- Captured research ideas about LLMs, ablated concepts, and OOD benchmarks

### 2. Portal Dashboard Layout Redesign
- **Implemented new sidebar-based layout inspired by orchestra-app-dev:**
  - Left sidebar with projects as main navigation items
  - Dashboard link at top (replaced "Portal" text)
  - User avatar at bottom (rounded square, fetches Google profile pic)
  - Theme toggle button next to Dashboard
  - Responsive with mobile hamburger menu

- **Simplified navigation structure:**
  - Removed complex nested menus
  - Projects are primary navigation items
  - Clean scrollable project list

### 3. Origins of Representations Project
- **Created comprehensive project structure with tabs:**
  - Overview tab with abstract and project stats
  - Literature tab with proper arxiv paper card
  - Experiments tab with mock experiment tracking
  - Datasets tab for data collections
  - Notes tab for research insights

- **Added correct arxiv paper (2505.11581):**
  - Title: "Questioning Representational Optimism in Deep Learning: The Fractured Entangled Representation Hypothesis"
  - Authors: Akarsh Kumar, Jeff Clune, Joel Lehman, Kenneth O. Stanley
  - Proper tags and description

- **Project metadata management:**
  - Moved description, created date, and status to Overview tab
  - Simplified main header to save vertical space
  - Changed padding to p-7 (28px) for better spacing

### 4. UI/UX Improvements
- **Google Avatar Integration:**
  - Fetches profile picture from OAuth metadata
  - Caches in localStorage for performance
  - Shows initials as fallback
  - Rounded square design (corner-trimmed)

- **Floating AI Chat Button:**
  - Fixed position bottom-right on all project pages
  - Opens chat window with mock AI assistant
  - Smooth animations and hover effects

- **Theme System:**
  - Full dark/light mode support
  - Theme toggle in sidebar header
  - Uses Next.js theme provider
  - Respects system preferences

### 5. Project Cleanup
- Removed Quantum Computing and Climate Models projects
- Updated dashboard stats (2 projects, 17 items)
- Swapped Share and Invite button positions
- Fixed JSX syntax errors in project-tabs component
- Removed Quick Actions section from dashboard

### 6. Technical Improvements
- Created reusable PortalLayoutSimple component
- Implemented proper user metadata passing through components
- Added ThemeProvider to root layout
- Fixed build errors and component structure

## Files Created
- `/apps/portal/components/sidebar-simple.tsx` - New simplified sidebar
- `/apps/portal/components/portal-layout-simple.tsx` - Layout wrapper
- `/apps/portal/components/floating-chat.tsx` - AI chat component
- `/apps/portal/components/theme-provider.tsx` - Theme provider wrapper
- `/apps/portal/components/project-tabs.tsx` - Tabbed project interface

## Files Modified
- `/apps/portal/app/page.tsx` - Updated to use new layout and simplified dashboard
- `/apps/portal/app/[project_slug]/page.tsx` - Simplified header, added chat, used new layout
- `/apps/portal/app/layout.tsx` - Added ThemeProvider
- `/apps/web/content/thoughts/2025-08-27.json` - Added multiple research thoughts
- `/apps/portal/components/logout-button.tsx` - Added className prop support

## Key Decisions
- Chose sidebar navigation pattern over complex nested menus for simplicity
- Made projects the primary navigation items rather than sub-items
- Implemented tabs only for Origins of Representations project (others use simple list)
- Used localStorage for avatar caching to reduce API calls
- Kept mock data structure for quick prototyping

## Next Steps
- Connect portal to real database for project/paper management
- Implement actual AI chat functionality
- Add real-time collaboration features
- Create project creation/editing interface
- Build out literature management system with citations