# Website Refinements and UI Improvements Log
**Date:** 2025-08-21  
**Time:** 14:43  
**Project:** Academic Homepage Refinements for Core Francisco Park

## Summary
Performed extensive UI/UX refinements and feature additions to the academic portfolio website, including navigation restructuring, content cleanup, chat interface improvements, and asset management.

## Major Tasks Completed

### 1. File Structure Reorganization
- **Route Groups Implementation** - Restructured app directory to use `(default)/` route group for main pages
- **Simple Page Isolation** - Separated `/simple` page with standalone layout (no nav/footer)
- **Asset Management** - Moved images to proper public directories:
  - `pic.jpg` → `/public/images/profile.jpg`
  - `orchestra.png` → `/public/images/orchestra.png`
  - `CFPark_CV.pdf` → `/public/CFPark_CV.pdf`

### 2. Navigation Updates
- **Reordered Navigation** - Final order: Home, CV, Ongoing, Projects, Publications, Blog, News
- **Removed "Ongoing" temporarily** then restored it between CV and Projects
- **Email Copy to Clipboard** - Changed email links to copy to clipboard with toast notification
- **Added Sonner Toast** - Integrated toast notifications for user feedback

### 3. Homepage Improvements
- **Removed Sections**:
  - "Explore My Work" feature cards section
  - "Recent Publications" section
- **Profile Picture Integration**:
  - Added rectangular profile image on right side (256x320px desktop)
  - Left-aligned text content with contact buttons
- **Contact Buttons**:
  - Email (copy to clipboard)
  - Location (Cambridge, MA)
  - GitHub
  - Twitter (@corefpark)
  - LinkedIn
- **Joke Banner** - Updated to: "If you think good academics have bad websites: corefranciscopark.com/simple"

### 4. Simple Page Enhancements
- **True 1990s Aesthetic**:
  - Removed navigation and footer completely
  - Forced Times New Roman font with !important
  - Standalone HTML layout
- **CV Download** - Added download link maintaining raw HTML style
- **Back Link** - Changed to: "Okay sure, good academics can have good websites..."

### 5. CV Page Updates
- **Header Simplification**:
  - Removed Korean name "박고래프란츠 (pronounced 'Corae')"
  - Changed "Ph.D. Candidate" to "Ph.D. in Physics"
- **Profile Picture** - Added rectangular image (96x128px) on left side
- **Download Button** - Moved next to Traditional/Timeline toggle with download icon
- **Contact Info Removal** - Moved email, location, GitHub, LinkedIn buttons to homepage

### 6. Ongoing Page Redesign
- **Title Change** - "Ongoing Research" → "Ongoing Stuff..."
- **Orchestra Project** - Added as first card with actual logo and link to app.orchestra-ai.org
- **Card Layout Overhaul**:
  - Square thumbnails (aspect-square)
  - Thin text section below image
  - Removed partner count and dates
  - Simplified to badges, title, description, and progress bar
- **Mock Data** - Created 10 realistic ongoing projects separate from publications

### 7. Chat Interface Unification
- **Merged Two Cards** into single "Chat with Core" interface
- **Toggle Feature** - Switch between "Virtual Core" (AI) and "Real Core" (email prompt)
- **Shared Interface** - Same chat UI for both modes, different behavior
- **Real Core Mode** - Shows email copy button when not virtual

### 8. Other Page Updates
- **Projects Page** - Simplified header to just "Projects" (removed subtitle)
- **Publications Page** - Simplified header to just "Publications" (removed subtitle)
- **Footer** - Reduced padding from py-8/12 to py-3/4

### 9. Technical Improvements
- **Component Updates**:
  - Created `sonner.tsx` wrapper for toast notifications
  - Modified `chat-box.tsx` to support dual modes
- **Import Cleanup** - Removed unused Lucide icon imports across files
- **Type Safety** - Maintained TypeScript types for all data structures

## Files Modified
- `/apps/web/app/(default)/` - All main pages moved here
- `/apps/web/app/simple/` - Standalone layout and page
- `/apps/web/components/chat-box.tsx` - Unified chat interface
- `/apps/web/app/(default)/page.tsx` - Homepage with new hero layout
- `/apps/web/app/(default)/cv/page.tsx` - CV with profile and simplified header
- `/apps/web/app/(default)/ongoing/page.tsx` - Redesigned project cards
- `/apps/web/components/navigation.tsx` - Updated nav order
- `/packages/ui/src/components/sonner.tsx` - New toast component

## Files Added
- `/apps/web/public/images/profile.jpg` - Profile picture
- `/apps/web/public/images/orchestra.png` - Orchestra logo
- `/apps/web/public/CFPark_CV.pdf` - CV PDF for download

## Final State
- Clean, professional academic portfolio with playful elements
- Improved user experience with toast notifications
- Better visual hierarchy with strategic use of images
- Consistent design language across all pages
- Functional joke page maintaining authentic 1990s aesthetic