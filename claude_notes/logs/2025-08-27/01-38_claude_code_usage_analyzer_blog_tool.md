# Claude Code Usage Pattern Analyzer Blog Tool

## Date: 2025-08-27, 01:38

## Summary
Created a comprehensive Claude Code conversation analyzer tool as a beta research blog post. The tool processes ZIP exports of Claude Code conversations to extract timestamps, analyze usage patterns, and generate visualizations showing coding activity patterns.

## Tasks Completed

### 1. SmartEM Publication Updates
- **Updated publication date**: Changed from Oct 2023 to Aug 20 2025
- **Updated bioRxiv URL**: Changed to v4 (https://www.biorxiv.org/content/10.1101/2023.10.05.561103v4)
- **Updated author list**: Added complete author list including I.S. Chandok and others
- **Fixed formatting**: Added asterisk to P. Potocek as requested
- **Fixed UI logic**: Made selfName authors with asterisks show both bold AND underlined

### 2. Created ZIP File JSONL Counter Blog Post
- **Created directory structure**: `/apps/web/content/blog/claude-code-usage-patterns/`
- **Built initial ZIP analyzer component**: Basic JSONL file counter
- **Added JSZip library**: Installed jszip for client-side ZIP processing
- **Fixed import issues**: Resolved JSZip dynamic import for Next.js
- **Fixed prose styling**: Used `not-prose` class to prevent margin interference

### 3. ZIP File Structure Analysis
- **Analyzed local ZIP structure**: Discovered JSONL files in subdirectory pattern
- **Fixed path detection**: Updated to handle files in first-level directories
- **Skipped macOS metadata**: Filtered out `__MACOSX/` directories
- **Tested with real data**: Extracted and analyzed 79 JSONL conversation files

### 4. Conversation Timestamp Analysis
- **Extracted timestamps**: Read start/end times from each conversation
- **Calculated durations**: Computed session lengths from timestamps
- **Created analysis script**: Python script showing 184.44 hours across 78 conversations
- **Identified patterns**: Found conversations ranging from 32 seconds to 21.5 hours

### 5. Enhanced Tool with Rich Analytics
- **Added conversation analysis**: Processes each JSONL to extract timestamps and message counts
- **Created hourly distribution**: Tracks activity patterns by hour of day
- **Added daily activity tracking**: Shows conversations per day with durations
- **Implemented statistics**: Total time, average duration, time span calculations
- **All client-side processing**: No server required, fully private

### 6. Created Data Visualizations
- **Hourly Activity Histogram**: 
  - SVG-based horizontal bar chart
  - 45-degree rotated x-axis labels
  - Shows message counts per hour (UTC)
  - Grid lines and hover effects
  
- **Daily Activity Timeline**:
  - Horizontal bar chart with date labels (MM/DD/YY format)
  - Shows conversation count (number) and duration (bar height)
  - Scrollable for many days
  - Blue bars to differentiate from hourly chart

- **Overview Statistics Cards**:
  - Total conversations count
  - Total time spent coding
  - Average session duration
  - Time span of activity

### 7. UX Improvements
- **Added processing stages**: 
  - Shows "Uploading file..." → "Unzipping archive..." → "Found X conversations" → "Analyzing..."
  - Spinner indicators for each stage
  - Clear completion message
  
- **Fixed chart issues**:
  - Added top padding to prevent label cutoff
  - Changed date format to MM/DD/YY
  - Added explanatory subtitles for chart meanings
  - Removed "Longest Conversations" section per request

- **Updated UI text**:
  - Changed title to "Conversation Analytics"
  - Added introduction explaining the tool's purpose
  - Added clear instructions about `.claude/projects/[project-name]` path
  - Removed redundant text

## Technical Implementation

### Key Technologies
- **JSZip**: For client-side ZIP file processing
- **React Hooks**: useState, useRef for state management
- **SVG**: For creating interactive histograms
- **TypeScript**: Full type safety for conversation data structures

### Data Processing Flow
1. User uploads ZIP file from `.claude/projects/[project-name]`
2. JSZip unzips in-memory (no server needed)
3. Identifies JSONL files (ignoring subdirectories and macOS metadata)
4. Parses each JSONL line-by-line
5. Extracts timestamps and message types
6. Calculates durations and aggregates statistics
7. Renders interactive visualizations

### Privacy & Performance
- All processing happens in the browser
- No data sent to servers
- Handles large ZIP files (tested with 79 conversations, ~70MB)
- Efficient streaming of JSONL parsing

## File Structure Changes
Created new blog post structure:
```
/apps/web/content/blog/claude-code-usage-patterns/
├── index.mdx
├── metadata.json
├── zip-analyzer.tsx
└── file-upload-example.tsx (example component)
```

Also created temporary analysis script:
```
/resources/analyze_conversations.py (for local testing)
```

## Insights from Testing
Using the actual Claude Code export data:
- **78 conversations** analyzed successfully
- **184.44 total hours** of coding conversations
- **Average session**: 141.88 minutes
- **Usage patterns**: Clear peaks during certain hours
- **Daily variations**: Some days with intense activity, others quiet

## Next Steps Potential
The tool could be enhanced with:
- Export functionality for analyzed data
- Comparison between multiple projects
- Topic/keyword analysis of conversations
- Progress tracking over time
- Team collaboration features (if server-side added)

## Deployment Status
- Blog post live at `/blog/claude-code-usage-patterns`
- Available in beta research section
- Password protected as beta content
- Fully functional for user uploads