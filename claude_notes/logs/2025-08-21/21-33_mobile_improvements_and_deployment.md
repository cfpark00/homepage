# Mobile Improvements and Deployment Fix Log
**Date:** 2025-08-21  
**Time:** 21:33  
**Project:** Academic Homepage - Mobile Responsiveness and Vercel Deployment

## Summary
Implemented comprehensive mobile responsiveness improvements, fixed timeline chronology issues, standardized content width across pages, and resolved Vercel deployment configuration problems.

## Major Tasks Completed

### 1. Mobile Responsiveness Improvements
- **Homepage Layout**:
  - Changed profile image to appear above name on mobile devices
  - Used flexbox ordering (`lg:order-1`, `lg:order-2`) for responsive layout
  - Image displays first on mobile, text on left for desktop

- **Publications Page Mobile Optimization**:
  - Fixed thumbnail display - changed from full-width stretched to proper square (128px on mobile, 96px on desktop)
  - Centered thumbnails on mobile, left-aligned on desktop
  - Improved text sizing: smaller on mobile (`text-xs`), normal on desktop (`text-sm`)
  - Added `line-clamp-2` for author lists on mobile to prevent overflow
  - Made abstracts and "Other forms" sections more readable with proper spacing and word breaking
  - Venue/year info now wraps better on small screens

### 2. CV Timeline Fixes
- **Chronology Issue**: Fixed postdoc appearing before Ph.D. completion
- **Dates Clarified**:
  - Ph.D. completion: May 29, 2025
  - Postdoc start: May 30, 2025
  - NTT internships: Jan 2025 (1 month), Jul-Aug 2024 (2 months)
- **Solution**: Added month-based sorting to timeline with special handling for events in same year

### 3. Content Width Standardization
- **Changed all pages to `max-w-4xl`** (896px max width) for consistent narrower layout
- **Affected pages**: Home, Publications, Projects, News, Ongoing, Blog
- **Result**: More focused, readable content with larger side margins

### 4. UI Refinements
- **Navigation**: Removed redundant "Home" link (name serves as home link)
- **Text Updates**:
  - Homepage: "If you think good academics should not have fancy websites:"
  - Simple page: "Okay fine, good academics can have fancy websites..."

### 5. Vercel Deployment Fix
- **Problem**: Multiple deployment failures due to incorrect project configuration
- **Root Cause**: Confusion between monorepo structure and Vercel settings
- **Solution**:
  - Dashboard Root Directory: `apps/web`
  - NO vercel.json file needed
  - Deploy from repository root
- **Created DEPLOYMENT.md**: Clear, opinionated deployment guide

### 6. Container Padding Investigation
- **Current Setup**: 32px (2rem) padding on all sides via Tailwind config
- **Explored Options**: Tested responsive padding (16px mobile, 64px desktop)
- **Decision**: Kept original 32px for consistency

## Technical Details

### Mobile Layout Pattern
```html
<!-- Desktop: text left, image right -->
<!-- Mobile: image top, text bottom -->
<div className="flex flex-col lg:flex-row">
  <div className="lg:order-2"><!-- Image --></div>
  <div className="lg:order-1"><!-- Text --></div>
</div>
```

### Timeline Sorting Fix
```javascript
// Added month-based sorting for same-year events
events.sort((a, b) => {
  if (b.year !== a.year) return b.year - a.year
  if (a.month && b.month) return b.month - a.month
  // Special handling for Ph.D. (month=5) vs Postdoc (month=5.5)
})
```

### Vercel Configuration
- **Project**: homepage
- **Dashboard Root Directory**: `apps/web`
- **Deploy Commands**: `vercel` (preview), `vercel --prod` (production)
- **No vercel.json required**

## Files Modified
- `/apps/web/app/(default)/page.tsx` - Homepage mobile layout
- `/apps/web/app/(default)/publications/page.tsx` - Publications mobile improvements
- `/apps/web/components/cv-timeline.tsx` - Timeline chronology fix
- `/apps/web/components/navigation.tsx` - Removed "Home" link
- All page files - Changed to max-w-4xl
- `/DEPLOYMENT.md` - Created deployment guide
- Removed `/vercel.json` - Not needed with dashboard configuration

## Deployment Status
✅ Successfully deployed to production  
✅ All mobile improvements live  
✅ Timeline chronology corrected  
✅ Deployment process documented  

## Lessons Learned
1. Vercel dashboard Root Directory setting is crucial for monorepos
2. Don't use vercel.json when dashboard settings suffice
3. Mobile-first responsive design requires careful flexbox ordering
4. Always test timeline sorting with edge cases (same year events)