# Deployment Guide

This monorepo contains two deployable Next.js applications:
- `apps/web` - Main personal website (homepage)
- `apps/portal` - Portal application with authentication

## Web App (Homepage) Deployment

### Setup (One-time)

1. **Vercel Dashboard Settings**
   - Go to: https://vercel.com/core-francisco-parks-projects/homepage/settings
   - Set **Root Directory**: `apps/web`
   - Keep all other settings as default (Vercel auto-detects Next.js)

2. **Local Setup**
   - Clone repo
   - Run `vercel link --project homepage --yes` from repository root
   - This creates `.vercel/` folder with project link

### Deploy

From repository root (`/Users/cfpark00/mysite`):

```bash
# Preview deployment
vercel

# Production deployment  
vercel --prod
```

## Portal App Deployment

### Setup (One-time)

1. **Create New Vercel Project**
   - Go to Vercel dashboard and create a new project
   - Import the same repository
   - Set **Root Directory**: `apps/portal`
   - Configure environment variables (if using Supabase):
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - Any other required environment variables

2. **Local Setup**
   - From repository root, create a separate `.vercel` folder for portal:
   - Run `vercel link --project [portal-project-name] --yes`
   - Note: You'll need to manage separate `.vercel` folders or switch between projects

### Deploy

```bash
# For portal deployment, ensure correct project is linked
vercel --prod
```

## Important Notes

- **NO vercel.json file needed** - Dashboard settings handle everything
- Always deploy from repository root, not from individual app directories
- Each app needs its own Vercel project with appropriate Root Directory setting
- The `.vercel/` folder should be in repository root
- Dashboard Root Directory setting tells Vercel where each Next.js app lives in the monorepo

## Environment Variables

- **Web App**: Generally doesn't require environment variables
- **Portal App**: Requires Supabase credentials and potentially other auth-related variables

## Troubleshooting

If deployments fail with path errors:
1. Check dashboard Root Directory is set correctly (`apps/web` or `apps/portal`)
2. Ensure NO vercel.json exists in repository
3. Verify `.vercel/project.json` exists in repository root
4. For portal app, ensure all required environment variables are configured in Vercel dashboard