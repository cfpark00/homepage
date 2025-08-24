# CV Updates, Publication Fixes, and Deployment
**Date**: 2025-08-22
**Time**: 00:45 (03:00 - 04:45 UTC)
**Session Focus**: Added Professional Activities and Extracurricular sections to CV, fixed publication author order, updated talks page buttons, and deployed to production

## Summary
Enhanced the CV page with missing academic credentials (professional service/reviewing and extracurricular activities), corrected co-first author ordering in publications, improved the talks page slide download functionality, and successfully deployed all changes to production.

## Major Changes Implemented

### 1. CV Page Enhancements
- **Added Professional Activities Section**:
  - Sigma-Xi membership (Jun 2025 - Present)
  - Peer review service: 30 papers total for major conferences
    - NeurIPS 2025 (6 papers)
    - ICML HiDL Workshop 2025 (3 papers)
    - ICML MOSS Workshop 2025 (2 papers)
    - CoLM 2025 (2 papers)
    - ICLR workshops and main conference (2024-2025)
  - Renamed from "Professional Service" to "Professional Activities" per user feedback

- **Added Extracurricular Activities Section**:
  - Harvard AI Safety Team (2024)
  - KITP Neurophysics of Locomotion School (2022)
  - APCTP-POSTECH Biophysics Schools (2018, 2019)
  - KIAS-SNU Physics Winter Camp (2018) - Best Project Award
  - Stockholm International Youth Science Seminar (2018) - Korean Representative
  - Asian Science Camp (2014) - Korean Representative
  - Molecular Frontiers Symposium (2013) - School Representative
  - And several other summer schools and programs

- **Updated Components**:
  - Modified `apps/web/app/(default)/cv/page.tsx` to include new data structures
  - Enhanced `apps/web/components/cv-traditional.tsx` with new sections and icons
  - Updated `apps/web/components/cv-timeline.tsx` to display service and extracurricular events chronologically

### 2. Publication Author Order Correction
- **"Decomposing Elements of Problem Solving" Paper**:
  - Changed author order from "C.F. Park*, T. Qin*" to "T. Qin*, C.F. Park*"
  - Updated in both `/apps/web/lib/publications-data.ts` and `/resources/sections/publications.tex`
  - Also updated corresponding talks entries to reflect new author order

### 3. Talks Page Button Improvements
- **Enhanced Slide Download/View Functionality**:
  - Keynote files (Google Drive): Show "Download Slides (Keynote)" button with direct download
  - Google Slides: Show "View Slides" button that opens share link (not embed URL)
  - Added helper functions to detect slide types and convert URLs appropriately
  - Fixed TypeScript type errors for optional slidesUrl parameter

- **Date Corrections**:
  - Prague Synapse 2025: July 10 → July 9, 2025
  - Astro AI Workshop 2025: July 10 → July 9, 2025

### 4. Content Review and Analysis
- **Reviewed `/resources/sections/` directory**:
  - Identified that most content (education, employment, awards, skills, teaching) was already on the website
  - Found that professional service/reviewing and extracurricular activities were the only major missing sections
  - Confirmed references section was intentionally not public-facing

### 5. Build and Deployment
- **Build Issues Resolved**:
  - Fixed TypeScript errors related to undefined slide URLs
  - Cleared Next.js build cache to resolve tailwind-merge module issues
  - Successfully built project with all new features

- **Deployments Completed**:
  - Preview deployment: https://homepage-qcl7zocag-core-francisco-parks-projects.vercel.app
  - Production deployment: https://homepage-5bvdu292m-core-francisco-parks-projects.vercel.app
  - Live on custom domain: www.corefranciscopark.com

## Technical Details

### Files Modified
- `/apps/web/app/(default)/cv/page.tsx` - Added service and extracurricular data
- `/apps/web/components/cv-traditional.tsx` - Added new sections with Users and Activity icons
- `/apps/web/components/cv-timeline.tsx` - Added timeline events for service and activities
- `/apps/web/app/(default)/talks/page.tsx` - Enhanced button logic for slides
- `/apps/web/lib/talks-data.ts` - Updated dates for July 2025 talks
- `/apps/web/lib/publications-data.ts` - Fixed author order
- `/resources/sections/publications.tex` - Fixed author order and talk dates

### New Features Added
- Professional Activities card with membership and reviewing subsections
- Extracurricular Activities card with chronological listing
- Smart slide button that detects file type (Keynote vs Google Slides)
- Proper URL conversion for downloads and share links

## Deployment Notes
- Used standard Vercel deployment workflow per DEPLOYMENT.md
- No issues with deployment process
- All changes successfully deployed to production
- Build warnings only related to img tags (non-critical)

## Session Metrics
- Duration: ~1 hour 45 minutes
- Files modified: 7
- New features: 2 major CV sections, improved talks functionality
- Deployments: 2 (preview + production)
- Build issues resolved: 2 (cache issue, TypeScript errors)