# Portal Literature System and Publication Cards

## Date: 2025-08-28, 14:32

## Summary
Major enhancements to the portal application's literature management system, including a complete redesign of the PublicationCard component, standardization of project tabs across all projects, and integration of the FER hypothesis paper into the origins-representations project.

## Tasks Completed

### 1. Thought Tracking System Enhancements
- **Verified automatic sorting implementation:**
  - Daily thoughts sorted by date in getThoughts() function
  - Individual thoughts sorted by time within each day
- **Added new thoughts to 2025-08-28:**
  - Quote about reasoning during learning vs inference from FER paper
  - Reflections on representation learning and compression
- **Grammar corrections across all August 28 thoughts**

### 2. Literature Management - FER Paper Integration
- **Added FER hypothesis paper to origins-representations project:**
  - Title: "Questioning Representational Optimism in Deep Learning: The Fractured Entangled Representation Hypothesis"
  - Authors: Akarsh Kumar, Jeff Clune, Joel Lehman, Kenneth O. Stanley
  - ArXiv ID: 2505.11581
  - Publication Date: May 2025
  - Included abstract, relevance to project, my take, and AI's take sections

### 3. Portal Navigation Configuration
- **Made Portal button development-only:**
  - Button only appears in dev mode
  - URL logic properly configured for both environments:
    - Development: http://localhost:3021
    - Production: https://portal.corefranciscopark.com

### 4. Project Structure Standardization
- **Standardized all projects with Overview and Literature tabs:**
  - All 8 projects now have consistent tab structure
  - Literature tab includes horizontal subtabs (General)
  - Removed empty/unused tabs from projects

### 5. New Portal Projects Created
- **Created 4 research projects:**
  1. Curriculum Learning Dynamics (curriculum-learning)
  2. Emergent Task Structure (emergent-task-structure) 
  3. Evolution of Intelligence (evolution-of-intelligence)
  4. Representation Geometry (representation-geometry)
- **Created 1 example project (example-project):**
  - Full tab structure: Overview, Literature, Experiments, Findings, Storyline, Thought Tree, Assets

### 6. PublicationCard Component Complete Redesign
- **Initial issues addressed:**
  - User feedback: "FUCKING ugly" about nested border design
  - Missing abstract, relevance, and AI's take sections
  - My Take defaulting to open
- **Final design implementation:**
  - Clean Card-based layout with amber accent strip
  - Compact collapsed state showing only title, authors, date, and TLDR
  - Expandable sections for Abstract, Relevance, My Take, AI's Take
  - All sections default to closed (defaultOpen={false})
  - ArXiv link with external icon
  - Publication date displayed with authors

### 7. JSON Syntax Fixes
- **Fixed double comma errors in thought files:**
  - 2025-08-26.json
  - 2025-08-28.json

## Technical Details

### Files Modified
- `/packages/ui/src/components/pub-card.tsx` - Complete component redesign
- `/apps/portal/content/projects/origins-representations/items.json` - Added FER paper
- `/apps/portal/components/project-tabs.tsx` - Added PublicationCard integration
- `/apps/web/components/navigation.tsx` - Dev-only Portal button
- `/apps/web/content/thoughts/2025-08-28.json` - Added thoughts and fixed grammar
- Multiple `/apps/portal/content/projects/*/metadata.json` files - Standardized tabs

### Component Architecture
- PublicationCard moved to shared UI package for reusability
- Uses shadcn/ui Card component as base
- ExpandableSection subcomponent for collapsible content
- Proper TypeScript interfaces for type safety

### Design Patterns
- Followed existing web app publication card patterns
- Consistent with shadcn/ui component styling
- Responsive design with proper mobile/desktop breakpoints

## User Feedback Addressed
1. "FUCKING ugly" - Redesigned with clean Card-based layout
2. "where is abstract, relevance and AI's take??????" - Added all sections
3. "why the fuck is only my take open? close all by default!" - Fixed with defaultOpen={false}
4. "we need the publication date somewhere as well" - Added to author line

## Next Steps
- Continue populating literature items for research projects
- Consider adding more sophisticated filtering/search for literature items
- Potential future enhancement: BibTeX import/export functionality