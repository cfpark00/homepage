# Content System Refactoring and Portal App Setup

## Date: 2025-08-26, 20:39

## Summary
Major refactoring of blog and project systems to be fully content-driven with automatic discovery, added a new beta research blog post, consolidated documentation, and set up a new portal app with Supabase authentication.

## Tasks Completed

### 1. Portal App Setup
- Created new Next.js app at `/apps/portal/` with shadcn/ui
- Set up Supabase authentication system
- Created environment variables configuration
- Implemented basic login/signup pages with:
  - Email/password authentication
  - OAuth providers (Google, GitHub)
  - Form validation using zod
  - Proper error handling

### 2. Blog System Refactoring
- **Converted to fully content-driven system**:
  - Blog posts now discovered automatically from `/content/blog/*/metadata.json`
  - No central metadata file needed - each post is self-contained
  - Modified `/apps/web/lib/blog.ts` to scan folders and read individual metadata files
  - Posts sorted by date (newest first) or optional `order` field

### 3. New Beta Research Blog Post
- Created "Proposal: Training LLMs with Ablated Knowledge to Measure Truly Out-of-Distribution Abilities"
- Folder: `/content/blog/ablated-knowledge-ood-training/`
- Comprehensive research proposal covering:
  - Knowledge ablation methodology
  - Evaluation frameworks
  - Implementation challenges
  - Broader implications for AI safety
- Marked as beta (password-protected) with 12 min read time

### 4. Projects System Refactoring
- **Made projects content-driven** like blogs:
  - Projects discovered from `/content/projects/*/metadata.json`
  - Each project folder self-contained
  - Modified `/apps/web/lib/projects.ts` for automatic discovery
  - Added explicit ordering: Orchestra (1), RTS (2), Evolving Research (3), LLM Dopamine (4)

### 5. Documentation Reorganization
- Created `/claude_notes/docs/blog/` subfolder
- Moved and renamed documentation:
  - `blog-system-architecture.md` → `how-to-write-blogs.md`
  - Moved all blog-related tips from `/tips/` to `/docs/blog/`
- Created `/claude_notes/docs/projects/how-to-add-projects.md`
- Updated documentation to reflect new content-driven approach
- Removed obsolete `/tips/` folder

### 6. Ordering System Enhancement
- Added optional `order` field to both blogs and projects
- Ordering logic:
  - Items with `order` field appear first (sorted ascending)
  - Items without `order` follow (sorted by date/alphabetically)
- Applied manual ordering to projects as requested

### 7. Publications System Conversion
- **Converted to JSON-based system**:
  - Backed up original `publications-data.ts`
  - Created `/content/publications/publications.json` with all 24 publications
  - Modified `publications-data.ts` to import from JSON
  - Verified data integrity - 100% consistent with original
- Now publications can be edited without code changes

### 8. System Improvements
- Added rule to CLAUDE.md: Always use `/scratch/` for temporary files
- Fixed double title issue in blog posts (title comes from metadata, not MDX)
- Created local metadata.json files for all existing blog posts and projects

## Key Architecture Changes

### Before
- Centralized metadata in TypeScript/JSON files
- Manual updates required in multiple places
- Mixed code and content

### After  
- Fully content-driven discovery
- Self-contained folders with metadata.json
- No code changes needed to add/edit content
- Consistent approach across blogs, projects, and publications

## File Structure Updates
- Created `/apps/portal/` app directory
- Created `/claude_notes/docs/blog/` and `/claude_notes/docs/projects/`
- Removed `/claude_notes/tips/` (contents moved to docs)
- Added metadata.json to all blog and project folders
- Created `/content/publications/publications.json`

## Dependencies Added
- Portal app: Supabase client libraries, zod for validation

## Notes
- All systems now follow the same pattern: content drives the site
- Adding new content requires only creating a folder with the necessary files
- No central configuration or code updates needed
- Backup files preserved for publications system