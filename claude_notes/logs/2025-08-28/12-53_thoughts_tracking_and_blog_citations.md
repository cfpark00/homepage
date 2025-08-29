# Thoughts Tracking and Blog Citations

## Date: 2025-08-28, 12:53

## Summary
Continued managing the thoughts tracking system with multiple entries for August 28, added academic citations to the ablated knowledge blog post, and refactored the thought data structure to remove redundant ID fields.

## Tasks Completed

### 1. Thoughts System Updates for August 28
- **Added multiple thought entries throughout the day:**
  - 02:15 - Still reading paper while micro-procrastinating
  - 03:34 - Continued reading paper with questions about output space representations
  - 03:46 - 3/4 through paper, worth follow up, need sleep
  - 11:00 - Concerns about OOD research direction and LLMxRL crowding
  - 12:28 - Almost done with paper, procrastinated on WebGPU demo possibilities
  - 12:49 - Added note about curriculum learning paper challenging simultaneous data absorption

### 2. Academic Citations Added to Blog
- **Added two key citations to ablated knowledge blog post:**
  - Cobbe et al. (2021) - GSM8K benchmark paper in synthetic benchmarks section
  - Mirzadeh et al. (2024) - GSM-Symbolic contamination study in contamination crisis section
  - Added both papers to references section with proper formatting

### 3. Thought System Structure Refactoring
- **Removed redundant ID field from all thought entries:**
  - Changed from using numeric `id` field to using `time` as unique identifier
  - Updated all existing thought files (Aug 25-28) to remove ID fields
  - Fixed React component to use `thought.time` as key prop instead of `thought.id`
  - Benefits: prevents ID collisions, enables natural sorting, allows time-based parent linking

### 4. Link Formatting Standardization
- **Ensured consistent Markdown link formatting:**
  - Updated links to use `[title](url)` format across all thought entries
  - Maintained consistency with existing thought content style

## Technical Details

### Files Modified
- `/apps/web/content/thoughts/2025-08-28.json` - Added 6 new thought entries
- `/apps/web/content/thoughts/2025-08-25.json` - Removed ID fields
- `/apps/web/content/thoughts/2025-08-26.json` - Removed ID fields  
- `/apps/web/content/thoughts/2025-08-27.json` - Removed ID fields
- `/apps/web/app/(default)/thoughts/thoughts-client.tsx` - Fixed React key prop
- `/apps/web/content/blog/ablated-knowledge-ood-training/index.mdx` - Added citations

### Web Search Research
- Found and summarized Cobbe et al. 2021 paper on GSM8K benchmark
- Found and summarized Mirzadeh et al. 2024 paper on GSM-Symbolic and contamination
- Provided context on 65% performance drops when GSM8K problems are varied

## Next Steps
- Continue tracking thoughts as they come in
- Monitor for any issues with the new time-based ID system
- Consider adding parent linking functionality using time references