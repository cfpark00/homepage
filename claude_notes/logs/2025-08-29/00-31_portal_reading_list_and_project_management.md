# Portal Reading List and Project Management

## Date: 2025-08-29, 00:31

## Summary
Major enhancements to the portal's literature management system, including implementing a reading list feature with status tracking, creating multiple research projects, adding numerous papers to reading lists, and fixing critical rendering issues. Also unified link handling across the system.

## Tasks Completed

### 1. Reading List Feature Implementation
- **Added readingStatus field** to literature items (`to-read`, `reading`, `read`)
- **Updated ProjectTabs component** to group literature by reading status:
  - "To Read" section for papers marked as `to-read`
  - "Currently Reading" section for papers marked as `reading`
  - "Read" section for papers marked as `read` or without status
- **Enhanced PublicationCard** to support 4+ author truncation with "et al."

### 2. New Projects Created
- **Research Thought Tracking** (created 8/25, updated 8/25)
  - Focus on systematic tracking of research thoughts and ideas
  - Added 3 sample papers with different reading statuses
- **LLM Research Ability** (created 8/29)
  - Investigating LLM research capabilities for scientific discovery
  - Added "Open-Ended Learning" and "lmgame-Bench" papers
- **Evo-LLM** (created 8/29)
  - Exploring evolutionary algorithms and gradient-free optimization for LLMs
  - Added MeZO and GEVB papers
- **Evolution of Research** (renamed from "Environmental Constraint for Evolution of Research")
  - Updated description to focus on environmental constraints
  - Added Deep HyperNEAT and Novelty Search papers

### 3. Papers Added to Projects
Added 10+ papers across various projects with proper metadata:
- Origins of Representations: FER hypothesis paper, mathematical reasoning paper, model merging blog
- Domain Ablated LLMs: Mathematical reasoning paper
- LLM Research Ability: Open-ended learning, GRL framework
- Evo-LLM: MeZO (forward passes), GEVB (global error broadcasting)
- Evolution of Research: Deep HyperNEAT, Novelty Search

### 4. Critical Fixes

#### Link System Unification
- **Removed arxivId field** in favor of single `link` field
- **Updated PublicationCard** to intelligently detect arXiv links and display appropriate button
- **Migrated all projects** from arxivId to link field
- Fixed special cases: blog posts, PDF links, arXiv IDs

#### Abstract Corrections
- **Fixed truncated abstracts** for major papers:
  - Attention Is All You Need: Full abstract with BLEU scores
  - GPT-3 (Language Models are Few-Shot Learners): Complete multi-paragraph abstract
  - Constitutional AI: Full RLAIF process description
  - Scaling Laws: Complete findings
  - FER hypothesis: Proper abstract from paper
  - GEVB: Full technical abstract
  - Novelty Search: Complete abstract

#### Rendering Issues Fixed
- **Fixed JSON structure** for LLM Research Ability and Evo-LLM projects
  - Changed from array format `[]` to object format `{"items": []}`
  - Ensured consistency across all projects

### 5. My Takes Integration
- **Consolidated user's thoughts** from August 27-28 for FER paper
- Integrated personal insights about:
  - Paper putting concrete wording to intuitions
  - Single-image training clarification in Section 6.3
  - Connection to representation unification questions
  - Key quote about reasoning lacking during learning

### 6. Project Metadata Updates
- Updated Evolution of Research slug and name
- Added proper links for all papers including:
  - Deep HyperNEAT PDF: https://web.mit.edu/fsosa/www/papers/dhn18.pdf
  - Model Merging blog: https://crisostomi.github.io/blog/2025/model_merging
  - Novelty Search PDF: https://www.cs.swarthmore.edu/~meeden/DevelopmentalRobotics/lehman_ecj11.pdf

## Technical Details

### Component Changes
- `PublicationCard`: Added link field, smart link detection, 4+ author truncation
- `ProjectTabs`: Added readingStatus support, grouped literature display
- Items.json structure: Unified to `{"items": [...]}` format across all projects

### Data Migration
- Created Python script to migrate arxivId to link fields
- Handled edge cases for blog posts and PDF links
- Ensured all links are properly formatted with https://

## Files Modified
- `/packages/ui/src/components/pub-card.tsx`
- `/apps/portal/components/project-tabs.tsx`
- All project `items.json` and `metadata.json` files
- Multiple project folders created/renamed

## Notes
- User emphasized importance of correct abstracts - all papers now have properly queried, complete abstracts
- Reading list system is simple but effective - just a status field that groups papers
- Link unification makes the system cleaner and more maintainable
- All projects now render correctly with consistent JSON structure