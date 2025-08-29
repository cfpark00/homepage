# Portal Literature System and Priority Papers

## Date: 2025-08-29, 01:51

## Summary
Major expansion of the portal's literature management system to support papers, GitHub repositories, and web content. Implemented a global priority scoring system with dashboard display, added comprehensive documentation for adding different content types, and populated multiple projects with research papers using real abstracts.

## Tasks Completed

### 1. Portal Bug Fixes
- **Fixed thoughts display error:** Corrected `dailyThoughts.map is not a function` by properly handling both old `{"thoughts": []}` and new array formats in `lib/projects.ts`
- **Fixed project icon styling:** Prevented project icons from changing color when selected in sidebar (maintained original color from `colorScheme.color`)
- **Fixed portal scrolling:** Made main container non-scrollable with project content scrolling independently
- **Fixed Wikipedia author format:** Changed from "Wikipedia Contributors" to empty array with "Wikipedia Article" as publicationDate

### 2. Literature System Expansion
- **Added support for multiple content types:**
  - `repository` - GitHub repositories with README-based abstracts
  - `web-article` - General web articles, Wikipedia entries
  - `blog-post` - Technical blog posts
  - `tweet` - Twitter/X posts
  - Updated TypeScript interfaces to include all new types

- **Created comprehensive documentation:** `/Users/cfpark00/mysite/claude_notes/docs/portal_projects/adding_papers.md`
  - Separate sections for papers, repositories, and web content
  - Critical emphasis on using REAL abstracts for papers
  - Guidelines for generating abstracts from README/web content
  - Examples for each content type

### 3. Global Priority System Implementation
- **Added priority field:** Optional number field (0 if not set) for papers
- **Dashboard integration:** New "Priority Papers" section showing top 10 papers
  - Yellow priority badges showing score
  - Paper metadata with authors and dates
  - Project badges linking to source projects
- **Deduplication mechanism:** Updated `getTopPriorityPapers()` to track papers by ID and avoid duplicates when same paper appears in multiple projects

### 4. Papers Added to Projects

#### Grand Synthetic Data (2 items)
1. **Competition Dynamics Shape Algorithmic Phases of In-Context Learning** (Dec 2024) - Markov chain task revealing ICL as competing algorithms
2. **Probabilistic Context-Free Grammar** (Wikipedia) - PCFG concepts for modeling structural relationships

#### Research Thought Tracking (4 items)
1. **Scaling up the think-aloud method** (May 2025) - Automating think-aloud analysis with NLP **(Priority: 10)**

#### Evolution Research (5 items)
1. **The Emergence of Canalization and Evolvability** (Apr 2017) - Computational evolution where canalization emerges naturally
2. **Illuminating search spaces by mapping elites** (Apr 2015) - MAP-Elites algorithm for holistic search space views
3. **General Intelligence Requires Rethinking Exploration** (Nov 2022) - Unified exploration framework **(Priority: 5)**

#### Origins of Representations (4 items)
1. **Representational Unification** - Added as milestone in overview tab (not a paper but important concept)
2. **Invariant representations of mass in the human brain** (Dec 2019) - fMRI study of abstract physical variables **(Priority: 9)**

#### LLM Research Ability (7 items)
1. **RL2: Ray Less Reinforcement Learning** (2025) - GitHub repository, <1K lines RL library for LLMs
2. **AI-Researcher: Autonomous Scientific Innovation** (May 2025) - Fully autonomous research pipeline system
3. **General Intelligence Requires Rethinking Exploration** (Nov 2022) - Same as in Evolution Research **(Priority: 5)**
4. **AlphaGo Moment for Model Architecture Discovery** (Jul 2025) - ASI-Arch discovers 106 SOTA architectures
5. **Darwin Gödel Machine** (May 2025) - Self-improving system modifying its own code (added by user)
6. **BALROG Benchmark** (Nov 2024) - LLM/VLM evaluation in game environments (added by user)

### 5. Date Format Standardization
- **Updated all publication dates to "Month Year" format** (e.g., "May 2023" instead of "2023-05-27")
- Created Python script to batch update existing entries
- Fixed dates in existing Research Thought Tracking papers

## Key Implementation Details

### Abstract Handling Rules
1. **Papers:** Must use EXACT abstract from the source (no summarization)
2. **Repositories:** Generate comprehensive description from README content
3. **Web content:** Create summary grounded in actual content (no hallucination)

### Priority Papers Dashboard
- Only shows papers with priority > 0
- Sorted by priority (highest first)
- Deduplicates papers appearing in multiple projects
- Shows project source as clickable badge

### File Structure Changes
- Created: `/Users/cfpark00/mysite/claude_notes/docs/portal_projects/adding_papers.md`
- Modified multiple items.json files across projects
- Updated portal components for bug fixes

## Technical Notes
- All papers fetched with real abstracts using WebFetch
- Proper error handling for different content formats
- Maintained backward compatibility with existing data structures
- Dashboard efficiently queries all projects for priority papers

## Next Steps
- Consider adding search/filter for priority papers
- Could add priority editing UI in project pages
- Might want to track citation relationships between papers