# Portal Literature Types and Tags System

## Date: 2025-08-29, 02:24

## Summary
Major overhaul of the portal literature system to support different content types (papers vs documents), implemented tags system for categorization, fixed rendering bugs, and added multiple papers to various projects.

## Tasks Completed

### 1. Document Type System Implementation
- **Created new "document" type** for general documents, Google Docs, PDFs
  - Papers now use type: "paper" (changed from "document")
  - Documents use type: "document" with simplified display
- **UI differentiation:**
  - Papers: Full details with authors, publication date, abstract
  - Documents: Simplified display with title, "Document" label, and TLDR
  - Visual distinction: Papers (gray), Documents (amber)

### 2. Tags System Implementation
- **Added tags field** to TypeScript type definitions (`tags?: string[]`)
- **Implemented tag rendering** in PublicationCard component
  - Tags display as small badges under TLDR
  - Automatic "General" tag for items without explicit tags
- **Updated documentation** to warn: "NEVER hallucinate tags; only add tags when explicitly told"

### 3. Bug Fixes
- **Fixed critical rendering bug** where documents showed only "Document" label without TLDR
  - Changed conditional logic to show both label AND description
- **Fixed priority score handling** for duplicate papers across projects
  - Now uses maximum priority when same paper appears in multiple projects
  - Changed from Set to Map implementation for proper tracking

### 4. Papers Added to Projects

#### Domain-Ablated LLMs Project
- Effects of Excluding Domains in Language Model Pretraining (Document)
- GSM-Symbolic: Understanding the Limitations of Mathematical Reasoning (Paper, tagged "Motivation")

#### LLM Research Ability Project
- MLGym: A New Framework and Benchmark for Advancing AI Research Agents (Paper)
- AI-Researcher: Autonomous Scientific Innovation (Paper) - already existed

#### Origins of Representations Project
- Projecting Assumptions: The Duality Between Sparse Autoencoders and Concept Geometry (Paper)
- NEAT: Evolving Neural Networks through Augmenting Topologies (Paper, priority 12)

#### Evolution Research Project
- NEAT: Evolving Neural Networks through Augmenting Topologies (Paper, priority 12)
- Evolution Strategies as a Scalable Alternative to Reinforcement Learning (Paper)

### 5. Documentation Updates
- **Updated adding_literature.md:**
  - Clear distinction between paper and document types
  - Emphasized ALL content must have TLDR and abstract
  - Added warning about not hallucinating tags
  - Updated examples to show both document and paper entries
  - Added verification rule for 100% exact abstracts

### 6. Quality Standards Enforced
- **Strict abstract accuracy:** All paper abstracts are 100% unmodified from source
- **No unnecessary fields:** Removed relevanceToProject and myTake from unread items
- **Proper status management:** Fixed "reading" status (only one paper should be marked as read)

## Technical Details

### Files Modified
- `/apps/portal/lib/projects.ts` - Added tags field, fixed priority handling
- `/apps/portal/lib/types/database.ts` - Updated type definitions
- `/packages/ui/src/components/pub-card.tsx` - Fixed rendering, added tags display
- `/apps/portal/components/project-tabs.tsx` - Connected tags prop
- `/apps/portal/app/[project_slug]/page.tsx` - Updated type colors
- Multiple `items.json` files - Changed existing documents to papers, added new entries
- `/claude_notes/docs/portal_projects/adding_literature.md` - Comprehensive documentation update

### Key Implementation Decisions
1. **Type migration:** All existing "document" types became "paper" to maintain consistency
2. **Tag defaults:** Items without tags automatically get "General" tag for UI consistency
3. **Priority resolution:** Maximum priority wins when papers appear in multiple projects
4. **TLDR requirement:** Made description field effectively required for all content types

## Issues Identified and Resolved
1. **Document TLDR not rendering** - Fixed conditional logic in PublicationCard
2. **Duplicate paper priorities** - Implemented proper Map-based deduplication
3. **Inconsistent reading statuses** - Changed all "reading" to "to-read"
4. **Missing abstracts for documents** - Made abstract required for all types

## Future Considerations
- Tags are implemented but not yet used for filtering/searching
- Could add tag-based navigation or filtering in the UI
- Priority scores could be project-specific rather than global
- Consider adding more semantic tag categories