# OAuth Redirect Production Fix
Date: 2025-08-26
Time: 18:40

## Problem Identified
The portal app was redirecting to `http://localhost:3000` after OAuth sign-in in production. This was happening because:
1. The login/signup pages were using `window.location.origin` for the redirect URL
2. In production, this was incorrectly evaluating to localhost

## Solution Implemented

### 1. Created URL Helper Function
- Added `/apps/portal/lib/utils/url.ts` with `getURL()` function
- Function checks for environment URLs in order:
  1. `NEXT_PUBLIC_SITE_URL` (manual override)
  2. `NEXT_PUBLIC_VERCEL_URL` (Vercel auto-provides)
  3. Falls back to `http://localhost:3021/` for local dev

### 2. Updated Authentication Pages
- Modified `/apps/portal/app/auth/login/page.tsx`
- Modified `/apps/portal/app/auth/signup/page.tsx`
- Both now use `getURL()` instead of `window.location.origin`

### 3. Environment Configuration
- Updated `.env.example` with documentation for `NEXT_PUBLIC_SITE_URL`
- Set `NEXT_PUBLIC_SITE_URL=https://portal.corefranciscopark.com/` in `.env`

### 4. Supabase Configuration Requirements
User needs to set in Supabase Dashboard:
- Site URL: `https://portal.corefranciscopark.com`
- Redirect URLs (Allow List):
  - `https://portal.corefranciscopark.com/auth/callback`
  - `http://localhost:3021/auth/callback`

## Deployment
- Ran `pnpm type-check` - passed
- Ran `pnpm build` - succeeded with Edge Runtime warnings (normal for Supabase)
- Committed and pushed changes to GitHub
- Auto-deployment triggered via Vercel

## Files Modified
- `apps/portal/app/auth/login/page.tsx` - Updated OAuth redirect + added "Core" link to homepage
- `apps/portal/app/auth/signup/page.tsx` - Updated OAuth redirect
- `apps/portal/.env.example` - Added documentation
- `apps/portal/lib/utils/url.ts` - New file for URL handling

## Key Learnings
- OAuth redirect URLs must be dynamically generated based on environment
- Vercel provides `NEXT_PUBLIC_VERCEL_URL` automatically
- Supabase requires explicit allow-listing of redirect URLs for security
- Always use HTTPS in production, not HTTP