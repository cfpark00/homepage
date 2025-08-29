# Domain Ablated LLMs Project Overview Setup
## Date: 2025-08-29 04:57

### Summary
Populated comprehensive project overview for the Domain Ablated LLMs project in the portal app, following the structured interview process for gathering project information.

### Tasks Completed

#### 1. Project Interview and Information Gathering
- Conducted structured interview with user about Domain Ablated LLMs project
- Reviewed existing blog post at `/apps/web/content/blog/ablated-knowledge-ood-training/` for context
- Updated interview guidelines to emphasize asking one question at a time (per user feedback)

#### 2. Created Project Overview
Created `/apps/portal/content/projects/domain-ablated-llms/overview.json` with:
- **Core Hypothesis**: Testing whether LLMs can self-evolve to reach ablated knowledge through fine-tuning/RL
- **Milestones**: 
  - Synthetic data validation
  - Assembling synthetic findings with mechanistic interpretability and RL experiments
  - Proposing real data experiments based on synthetic results
- **Experiments**: Synthetic concept space design, ablation validation, RL self-evolution testing, mechanistic analysis
- **Resources**: 1-2 students with 8 GPUs each for synthetic phase
- **Detailed Proposal**: Including background motivation, research roadmap, expected results, broader impact

#### 3. Literature Management
Added two related papers to `/apps/portal/content/projects/domain-ablated-llms/items.json`:
- "A Pretrainer's Guide to Training Data" (Longpre et al., 2023) - arXiv:2305.13169
- "DoReMi: Optimizing Data Mixtures" (Xie et al., 2023) - arXiv:2305.10429
- Verified abstracts are 100% accurate from arXiv

#### 4. Proposal Figure Integration
- Added `proposalFigure` field support to the ProjectOverview component
- Set up new image organization: `/apps/portal/public/projects/[project-name]/proposal.png`
- Copied proposal image from blog to portal public directory
- Adjusted image display sizing (max-w-md) for better presentation

#### 5. Project Thoughts Documentation
Added comprehensive thoughts to track the planning session:
- Core hypothesis discussion
- Synthetic data validation approach
- Resource planning
- Expected criticism and responses
- Broader implications for AI safety and scaling

### Key Insights from Discussion

1. **Project Status**: Very much in planning phase - focusing on synthetic data validation first
2. **Critical Question**: Can models self-evolve beyond training boundaries or are they fundamentally limited?
3. **Synthetic Data Challenge**: Need hierarchical structure, grammatical format, and discrete knowledge elements
4. **Main Expected Criticism**: Data filtering fragility - response is that models will still fail in data-scarce regions even with some leakage
5. **Broader Impact**: Could determine if AI progress will plateau at edge of human knowledge rather than exponentially self-improving

### File Structure Changes
- Created `/apps/portal/public/projects/domain-ablated-llms/` directory for project assets
- Added proposal.png to the new directory structure

### Technical Notes
- Updated ProjectOverview component to support proposalFigure field with proper image rendering
- Fixed image path issues (images must be in public directory for Next.js)
- Implemented responsive image sizing to prevent oversized displays

### Files Modified
- `/apps/portal/content/projects/domain-ablated-llms/overview.json` (created)
- `/apps/portal/content/projects/domain-ablated-llms/items.json` (updated with papers)
- `/apps/portal/content/projects/domain-ablated-llms/thoughts.json` (updated with planning thoughts)
- `/apps/portal/components/project-overview.tsx` (added proposalFigure support)
- `/claude_notes/jobs/populate_project_overview.txt` (updated with one-question-at-a-time rule)

### Next Steps
- Monitor synthetic data experiments as they begin
- Prepare for mechanistic interpretability experiments
- Document findings to build case for real data experiments