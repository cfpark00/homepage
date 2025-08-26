# Portal App Setup and Authentication System

## Date: 2025-08-26, 20:38

## Summary
Created a new research portal application (`apps/portal`) with Supabase authentication, project-based routing, and share token system for selective public access. Fixed critical dependency issues that prevented Tailwind CSS from working properly.

## Tasks Completed

### 1. Portal System Design Discussion
- Designed URL structure for private projects with public share tokens
- Decided on single-app architecture over multiple apps
- Established access model: all projects private by default, share specific items via tokens
- URL pattern: `/project-slug` (private), `/project-slug/s/token` (public share)

### 2. Portal App Initial Setup
- Created new Next.js app at `apps/portal` on port 3021
- Set up Supabase authentication with client/server configurations
- Added middleware for session management
- Created `.env.example` with Supabase configuration template
- Configured separate Vercel deployment settings

### 3. Database Schema and Routing
**Created database types** for:
- Projects (with visibility settings)
- Project items (documents, experiments, datasets)
- Share tokens (for public access)

**Implemented routing structure**:
- `/[project_slug]/page.tsx` - Private project pages
- `/[project_slug]/s/[token]/page.tsx` - Public share pages
- `/auth/login` and `/auth/signup` - Authentication pages
- `/test` - Demo links page

### 4. Authentication Implementation
- Built login/signup pages with Supabase auth
- Configured middleware to protect private routes
- Added public route exceptions for share tokens
- Implemented auth redirect logic for unauthenticated users

### 5. Navigation Integration
- Added "Portal" link to main website navigation
- Configured dynamic URL based on NODE_ENV (localhost:3021 in dev, portal.corefranciscopark.com in production)
- Added external link indicator icon

### 6. Critical Tailwind CSS Debugging
**Found and fixed multiple "unplugged cables"**:

**Missing Dependencies**:
- `tailwindcss` - Not installed initially
- `postcss` and `autoprefixer` - Required for CSS processing
- `clsx` and `tailwind-merge` - Required for `cn()` utility function
- `tailwindcss-animate` - Required by shared config preset
- `postcss.config.js` - Missing configuration file

**Version Mismatches**:
- Next.js: Portal had 15.1.0 vs Web's 15.5.0
- React: Portal had 19.0.0 vs Web's 18.3.1 (major version difference!)
- React DOM and types: Mismatched versions

**CSS Variables**:
- Added missing shadcn/ui CSS variables to globals.css
- Fixed color scheme definitions for light/dark modes

### 7. UI Component Integration
- Exported missing components (Button, Card, Input) from UI package
- Implemented proper shadcn/ui components in auth pages
- Created professional login/signup UI with cards and proper styling
- Added gradient backgrounds and loading states

## Technical Decisions

1. **Monorepo Structure**: Kept portal in same repo for shared UI components
2. **Auth Strategy**: Supabase for full user management vs simple password
3. **Share Token Design**: Token-based public access vs making entire projects public
4. **URL Structure**: Clean project slugs without prefixes for better readability

## Key Learning
The Tailwind CSS issue was a cascade of missing dependencies. The components rendered but without styles because:
1. PostCSS wasn't configured to process Tailwind
2. Critical utility functions (`clsx`, `tailwind-merge`) were missing
3. Version mismatches between apps caused subtle incompatibilities

Always ensure dependency parity between apps in a monorepo, especially for core libraries like React and Next.js.

## Files Created/Modified

### New Files
- `/apps/portal/` - Entire portal application
- Portal routing: `[project_slug]`, auth pages, test page
- Supabase configurations in `/lib/supabase/`
- Database types in `/lib/types/database.ts`

### Modified Files
- `/apps/web/components/navigation.tsx` - Added Portal link
- `/packages/ui/src/index.ts` - Exported missing components
- Multiple package.json files for dependency fixes

## Next Steps
- Connect real Supabase database tables
- Implement actual project creation/management
- Build share token generation UI
- Add project collaboration features
- Deploy to Vercel with subdomain configuration