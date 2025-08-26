# Portal Login Core Link Addition

## Date: 2025-08-26, 18:41

## Summary
Added a clickable link to the "Core" text in the Research Portal login page heading that opens corefranciscopark.com in a new tab. Also fixed authentication redirect issue in development mode that was pointing to production URL.

## Tasks Completed

### 1. Portal Login Page - Core Link Addition
- **Modified heading structure:**
  - Made "Core" text in "Core's Research Portal" a clickable link
  - Link dynamically switches between development and production URLs:
    - Development: `http://localhost:3020`
    - Production: `https://corefranciscopark.com`
  - Added hover underline effect with decoration styling
  - Opens in new tab with `target="_blank"` and security attributes

- **File modified:**
  - `/apps/portal/app/auth/login/page.tsx:71-79`

### 2. Fixed Development Mode Authentication Redirect
- **Issue identified:**
  - Local development was redirecting to production portal URL
  - Root cause: `.env` file had hardcoded production URL for `NEXT_PUBLIC_SITE_URL`
  
- **Solution implemented:**
  - Updated `.env` to use localhost URL for development: `http://localhost:3021/`
  - Production URL will be automatically set by Vercel environment variables
  - This ensures proper OAuth redirects in local development

- **Files modified:**
  - `/apps/portal/.env:6` - Changed from production URL to localhost

## Technical Details

### Link Implementation
```tsx
<Link 
  href={process.env.NODE_ENV === 'development' ? 'http://localhost:3020' : 'https://corefranciscopark.com'}
  className="hover:underline decoration-2 underline-offset-4"
  target="_blank"
  rel="noopener noreferrer"
>
  Core
</Link>
```

### Environment Variable Fix
- Changed: `NEXT_PUBLIC_SITE_URL=https://portal.corefranciscopark.com/`
- To: `NEXT_PUBLIC_SITE_URL=http://localhost:3021/`

## Notes
- The `.env` file should contain development values since it's local-only
- Production values should be configured in Vercel's dashboard, not in local `.env` files
- The `getURL()` utility function properly falls back through environment variables