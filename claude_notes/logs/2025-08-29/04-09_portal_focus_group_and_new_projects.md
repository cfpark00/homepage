# Portal Focus Group and New Projects

**Date:** 2025-08-29
**Time:** 04:09
**Session Focus:** Adding Focus group feature to portal sidebar and creating new research projects

## Summary

Implemented a Focus group feature for the portal sidebar to highlight important projects, and added two new research projects to the portal.

## Tasks Completed

### 1. Added Two New Research Projects

Created the following new projects in the portal:

#### High Dim. Comp. Gen. (`high-dim-comp-gen`)
- **Description:** Research on high-dimensional computational generation techniques
- **Created:** All required files (metadata.json, items.json, thoughts.json, overview.json)
- **Location:** `/apps/portal/content/projects/high-dim-comp-gen/`
- **Color:** Purple theme

#### Saying IDK (`saying-idk`)
- **Description:** Investigating how models express uncertainty and 'I don't know' responses  
- **Created:** All required files (metadata.json, items.json, thoughts.json, overview.json)
- **Location:** `/apps/portal/content/projects/saying-idk/`
- **Color:** Orange theme

### 2. Implemented Focus Group Feature

Added a new "Focus" section to the portal sidebar to highlight important projects:

#### TypeScript Updates
- **Modified:** `/apps/portal/lib/projects.ts`
  - Added optional `focus?: boolean` field to `ProjectMetadata` interface

#### UI Component Updates  
- **Modified:** `/apps/portal/components/sidebar-simple.tsx`
  - Added `focus?: boolean` to component props interface
  - Implemented conditional rendering of "Focus" group above "Projects" group
  - Focus group only appears when at least one project has `focus: true`
  - Projects with `focus: true` appear in Focus group
  - All other projects appear in regular Projects group

### 3. Set Focus Projects

Per user request, marked the following projects as focus:
- **Origins of Representations** - Set `focus: true` in metadata
- **Domain Ablated LLMs** - Set `focus: true` in metadata

### 4. Documentation Cleanup

- Initially mistakenly added example projects to the creating_new_projects.md documentation
- Removed these additions per user request

## Technical Implementation Details

### Focus Group Structure
The sidebar now has a two-tier project organization:
```
Dashboard
---
FOCUS (conditional - only if focus projects exist)
  - [Focus Project 1]
  - [Focus Project 2]
  
PROJECTS
  - [Regular Project 1]
  - [Regular Project 2]
  - ...
```

### Key Code Changes
- Projects are filtered by `focus` property: `projects.filter(p => p.focus)` for Focus group
- Projects without focus: `projects.filter(p => !p.focus)` for regular Projects group
- Focus section has bottom margin (`mb-6`) to visually separate from Projects section

## Files Modified

1. `/apps/portal/lib/projects.ts` - Added focus field to TypeScript interface
2. `/apps/portal/components/sidebar-simple.tsx` - Implemented Focus group UI
3. `/apps/portal/content/projects/high-dim-comp-gen/` - Created new project
4. `/apps/portal/content/projects/saying-idk/` - Created new project  
5. `/apps/portal/content/projects/origins-representations/metadata.json` - Added focus flag
6. `/apps/portal/content/projects/domain-ablated-llms/metadata.json` - Added focus flag
7. `/claude_notes/docs/portal_projects/creating_new_projects.md` - Reverted accidental changes

## Notes

- The Focus feature provides a clean way to highlight current priority projects
- The implementation is flexible - projects can be easily marked/unmarked as focus by editing their metadata.json
- The Focus group automatically hides when no projects are marked as focus
- All projects maintain their original categorization and just get promoted visually when marked as focus