# Portal Projects and Thoughts Management

## Date: 2025-08-29, 03:34

## Summary
Enhanced the portal application with automatic "Project created" thoughts injection, fixed ProjectOverview component errors, created new projects, added research papers, and implemented comprehensive documentation for project creation guidelines.

## Tasks Completed

### 1. Automatic "Project Created" Thoughts Injection
- **Modified getProjectBySlug function** in `/apps/portal/lib/projects.ts`:
  - Automatically injects "Project created" thought at 00:00 on project creation date
  - Checks for existing thoughts to avoid duplicates
  - Maintains chronological order when inserting
  - Tags thoughts with "milestone" and "project"
- **Tested implementation** with multiple projects to verify functionality

### 2. Fixed ProjectOverview Component Error
- **Added null checks** in `/apps/portal/components/project-overview.tsx`:
  - Made all detailedProposal fields optional with conditional rendering
  - Added checks for milestones, coreExperiments, and expectedResources arrays
  - Added hasContent check to display empty state when no overview data exists
- **Resolved runtime TypeError** for undefined backgroundMotivation property

### 3. Created New Projects

#### Context to Weights Project
- **Created project structure** at `/apps/portal/content/projects/context-to-weights/`
- **Added three research papers** (in order):
  1. "New News: System-2 Fine-tuning" (arxiv:2505.01812) - Core Francisco Park et al.
  2. "Generative Adapter" (arxiv:2411.05877) - Tong Chen et al.
  3. "Self-Adapting LLMs" (arxiv:2506.10943) - Adam Zweiger et al.
- **Removed LaTeX formatting** from New News title and abstract for consistency
- **Note:** Mistakenly added documentation file as literature item, then removed it

#### Representation vs Objective Project
- **Created project structure** at `/apps/portal/content/projects/representation-vs-objective/`
- Minimal setup with overview, thoughts, and literature tabs
- Added initial "Project created" thought

#### Synthetic RL Project
- **Created project structure** at `/apps/portal/content/projects/synthetic-rl/`
- Minimal setup with overview, thoughts, and literature tabs
- Added initial "Project created" thought

### 4. Added Thoughts to Existing Projects

#### Origins of Representations
- Added thought: "Figuring out under what conditions nice isolated representations emerge is currently a big question."
- Added thought: "It seems like the simplest setup is to train on two tasks, which conceptually share the same computation, but is tokenized or superficially represented differently. Then check if common mechanisms are used or not."

#### Domain Ablated LLMs
- Added thought: "It seems like 'connecting-the-dots' learning and data filtering failure are always the main criticism. Somehow personally, I'm not so worried since I think models will just suck at missing parts of the data distribution, but my intuition might be wrong. It is indeed worth trying out a toy model first!"

### 5. Documentation Created
- **Created project creation guide** at `/claude_notes/docs/portal_projects/creating_new_projects.md`:
  - Emphasized not creating hallucinated data
  - Required steps: query date, create directory, create 4 JSON files
  - Specified minimal tabs: overview, thoughts, literature
  - Included format for initial "Project created" thought
  - Added examples and JSON structure references

### 6. Bug Fixes and Improvements
- **Fixed PROJECTS_DIR path** from 'content/projects' to 'apps/portal/content/projects'
- **Verified all paper abstracts** were copied verbatim from arxiv sources
- **Ensured proper date querying** before creating each new project

## Files Modified
- `/apps/portal/lib/projects.ts` - Added automatic "Project created" thought injection
- `/apps/portal/components/project-overview.tsx` - Added null checks for optional fields
- `/apps/portal/content/projects/context-to-weights/*` - Created new project
- `/apps/portal/content/projects/representation-vs-objective/*` - Created new project
- `/apps/portal/content/projects/synthetic-rl/*` - Created new project
- `/apps/portal/content/projects/origins-representations/thoughts.json` - Added thoughts
- `/apps/portal/content/projects/domain-ablated-llms/thoughts.json` - Added thoughts
- `/claude_notes/docs/portal_projects/creating_new_projects.md` - Created documentation

## Technical Notes
- All paper abstracts were fetched using WebFetch and copied exactly as they appear on arxiv
- LaTeX formatting in abstracts can cause display issues; removed for consistency
- The automatic "Project created" thought injection happens at runtime, not stored in files
- ProjectOverview component now gracefully handles missing/incomplete overview data

## Next Steps
- Consider implementing LaTeX rendering for paper titles and abstracts
- May need to add more project templates for different research areas
- Could enhance thoughts display with better formatting options