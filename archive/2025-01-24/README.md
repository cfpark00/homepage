# Archive - 2025-01-24

## Contents

### backup/
- Original research-tracking and evolving-research pages before migration to projects framework
- research-flow.tsx component backup
- ongoing-page.tsx backup

### claude_notes/
- Development logs and documentation
- Tips and structure notes

### lib-research-tree-files/
- research-tree-data.ts
- research-tree-full.json
- research-tree-vertical.json

### scratch/
- Experimental code and prototypes
- Research tree visualization experiments

### research-tree.json
- Original research tree data from resources folder

## Reason for Archiving
These files were moved during the migration to a unified projects framework that follows the blog architecture pattern. The new system treats projects as first-class entities with:
- Centralized metadata in `/apps/web/lib/projects.ts`
- MDX content in `/apps/web/content/projects/`
- Dynamic routing via `/projects/[slug]`