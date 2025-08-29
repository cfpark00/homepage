# LLMs Dopamine Project Overview and File Restructuring

## Date: 2025-08-29, 15:27

## Summary
Conducted comprehensive project planning interview for "Do LLMs Have Dopamine" research project, populated project overview with milestones and resources, added 7 related papers with verified abstracts, and performed major file restructuring by renaming all items.json files to literature.json across the entire portal system.

## Tasks Completed

### 1. Project Overview Population for "Do LLMs Have Dopamine"
- **Conducted structured interview** with user about their research project investigating emergent reward representations in LLMs
- **Created comprehensive overview.json** with:
  - Research abstract about dopamine-like reward representations in LLMs
  - 6 detailed milestones from neuroscience review to open-ended exploration
  - 3 core experiments (reward representation discovery, in-context RL analysis, intervention studies)
  - Resource requirements (8 GPUs per student, 2TB storage, NDIF/nnsight tools)
  - Detailed proposal covering motivation, expected results, broader impact, and potential objections
- **Key insight captured**: This is genuinely exploratory research with no prior hypothesis - even null results would be valuable

### 2. Literature Addition with Verified Abstracts
- **Added 7 papers to literature.json** with 100% accurate abstracts from arXiv:
  1. Context reorganization (Kumar et al. 2025) - team's foundational work
  2. TD errors in LLMs (Demircan et al. 2024) - marked as core/priority
  3. PRIME process reinforcement (2025) - fixed 3 typos in abstract
  4. In-context RL survey (2025)
  5. Algorithm Distillation (2022)
  6. In-context RL with contextual bandits (2024)
  7. In-context RL at inference time (2024)
- **Verified all abstracts** character-by-character against arXiv originals
- **Fixed PRIME paper abstract** errors: "implict"→"implicit", "phrase"→"phase", "competitional"→"competitive"

### 3. Project Thoughts Documentation
- **Created thoughts.json** with 8 thought entries documenting the planning session
- **All timestamped at 15:27** capturing key decisions:
  - Research question formulation
  - Methodological approach
  - Resource planning
  - Literature gaps identified
  - Potential impacts and AI welfare implications
  - Anticipated reviewer objections

### 4. Critical Bug Fix
- **Fixed wrong project directory**: Initially created "do-llms-have-dopamine" when it should have been "llms-dopamine"
- **Moved all content** to correct project directory
- **Fixed JSON structure**: Changed from direct array `[...]` to object with items key `{"items": [...]}`

### 5. Major File Restructuring: items.json → literature.json
- **Renamed 15 files** across all portal projects from `items.json` to `literature.json`
- **Updated codebase references**:
  - `/Users/cfpark00/mysite/apps/portal/lib/projects.ts` (2 references in getProjectBySlug and getTopPriorityPapers)
  - `/Users/cfpark00/mysite/claude_notes/docs/portal_projects/adding_literature.md` (5 references)
  - `/Users/cfpark00/mysite/claude_notes/jobs/populate_project_overview.txt` (3 references)
- **Ensured consistency** across documentation and code

## Technical Details

### Interview Process
- Followed structured interview protocol from populate_project_overview.txt
- Asked one question at a time to build comprehensive understanding
- Captured user's terminology and phrasing exactly

### Abstract Verification Process
- Used WebFetch to get exact abstracts from arXiv
- Compared character-by-character with stored versions
- Found and fixed 3 errors in PRIME paper abstract

### File Structure Changes
```
Before: /projects/[slug]/items.json
After:  /projects/[slug]/literature.json

Structure fixed: 
From: [{"id": "paper1"}, {"id": "paper2"}]
To:   {"items": [{"id": "paper1"}, {"id": "paper2"}]}
```

## Issues Resolved
1. **Wrong project directory** - moved from "do-llms-have-dopamine" to "llms-dopamine"
2. **Invalid JSON structure** - added "items" wrapper object
3. **Abstract accuracy** - fixed typos in PRIME paper
4. **File naming consistency** - unified all projects to use literature.json

## Files Modified
- `/Users/cfpark00/mysite/apps/portal/content/projects/llms-dopamine/overview.json` (created)
- `/Users/cfpark00/mysite/apps/portal/content/projects/llms-dopamine/literature.json` (created with correct structure)
- `/Users/cfpark00/mysite/apps/portal/content/projects/llms-dopamine/thoughts.json` (created)
- `/Users/cfpark00/mysite/apps/portal/lib/projects.ts` (updated references)
- `/Users/cfpark00/mysite/claude_notes/docs/portal_projects/adding_literature.md` (updated references)
- `/Users/cfpark00/mysite/claude_notes/jobs/populate_project_overview.txt` (updated references)
- 15 project directories had items.json renamed to literature.json

## Next Steps Suggested
- Portal should now properly load literature from all projects
- "Do LLMs Have Dopamine" project fully populated and ready for research tracking
- All abstracts verified to be 100% accurate from source