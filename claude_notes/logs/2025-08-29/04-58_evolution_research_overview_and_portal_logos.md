# Evolution Research Overview and Portal Logos Organization

**Date:** 2025-08-29
**Time:** 04:58
**Session Focus:** Creating comprehensive overview for Evolution of Research project and reorganizing portal project logos

## Summary

Conducted a detailed interview session to populate the Evolution of Research project overview, then reorganized the portal's project logo system for better structure and consistency.

## Tasks Completed

### 1. Evolution of Research Project Overview

Conducted comprehensive planning interview for the "Evolution of Research" project:

#### Interview Process
- **Phase 1:** Core Concept - Understanding research abilities in organisms
- **Phase 2:** Experimental Approach - 100% in silico, multi-agent bandits
- **Phase 3:** Milestones - From algorithm setup to characterizing environments
- **Phase 4:** Resources - CPU-intensive with ~8TB storage needs
- **Phase 5:** Theoretical Background - Building on Clune, Stanley, Lehman work
- **Phase 6:** Expected Outcomes - Three-condition hypothesis for research behavior
- **Phase 7:** Impact - Meta-scientific perspective on why we fund science
- **Phase 8:** Challenges - Risk of failure to find research behaviors

#### Key Project Details
- **Core Question:** What evolutionary environments give rise to research abilities?
- **Hypothesis:** Research requires: (1) resources for exploration, (2) learnable complexity, (3) no single best solution
- **Approach:** Start simple with multi-agent multi-armed bandits, not complex 3D environments
- **Impact:** Grounds discussion on why humans intrinsically value discovery

#### Files Created/Updated
- Created `/apps/portal/content/projects/evolution-research/overview.json`
- Updated `/apps/portal/content/projects/evolution-research/thoughts.json` with 7 planning reflections
- Verified existing literature (8 papers from Clune, Stanley, Lehman already present)

### 2. Portal Project Logos Reorganization

Systematic reorganization of project thumbnail/logo system:

#### Initial Issue Discovery
- Evolution of Research image wasn't loading
- Found portal uses `logo` field, not `thumbnail`
- Images should be in `/project-logos/`, not `/images/projects/`

#### Logo Migration for Multiple Projects
Copied and configured logos for:
- **evolution-research** - Network visualization image
- **llms-dopamine** - From llm-dopamine project
- **research-thought-tracking** - From research-tracking-system
- **llm-research-ability** - From orchestra project

#### Final Logo Organization
Restructured entire logo system to cleaner pattern:
- **Old Structure:** `/public/project-logos/[project-name].png`
- **New Structure:** `/public/projects/[project-name]/logo.png`

Actions taken:
1. Created directory structure for each project
2. Moved all logos to new locations (6 existing logos)
3. Updated all 12 metadata.json files with new paths
4. Removed old `/project-logos/` directory
5. Cleaned up duplicate `/images/` directory

### 3. Project Promotion

- Promoted "Evolution of Research" to focus status by adding `focus: true` to metadata
- Project now appears in the Focus group in portal sidebar

## File Structure Changes

### Added
- `/apps/portal/content/projects/evolution-research/overview.json`
- `/apps/portal/public/projects/*/logo.png` (new structure for all project logos)

### Modified
- All project metadata.json files - Updated logo paths from `/project-logos/` to `/projects/[name]/logo.png`
- `/apps/portal/content/projects/evolution-research/metadata.json` - Added focus status
- `/apps/portal/content/projects/evolution-research/thoughts.json` - Added planning session thoughts

### Removed
- `/apps/portal/public/project-logos/` directory (old structure)
- `/apps/portal/public/images/` directory (unnecessary duplicate)

## Technical Notes

- Portal uses `logo` field in metadata.json, not `thumbnail`
- Logo paths are relative to portal's public directory
- Focus projects appear in separate sidebar group above regular projects
- Abstracts in literature items must be exact copies from sources (verified MAP-Elites paper)

## Next Steps

- Other projects still need overview.json files populated
- Consider adding logos for projects currently without them
- Evolution of Research project ready for active research phase

## Bug Fix (Post-Session)

Fixed React key prop warning in ThoughtsDisplay component for evolution-research project:
- **Issue**: thoughts.json was incorrectly formatted as `{thoughts: [...]}` instead of `[{date: "2025-08-29", thoughts: [...]}]`
- **Solution**: Reformatted file to match the expected array-of-date-objects structure used by all other projects
- **Root Cause**: Incorrect format when creating thoughts.json during the overview session