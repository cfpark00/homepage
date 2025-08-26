# Deployment Guide

This monorepo contains two deployable Next.js applications that automatically deploy via Git push:
- `apps/web` - Main personal website (homepage)
- `apps/portal` - Portal application with authentication

## Automatic Deployment (Git-based)

### How It Works

**Simply push to GitHub and both apps deploy automatically!**

```bash
git push origin main → Both apps deploy to production
git push origin feature-branch → Both apps get preview deployments
```

No manual deployment commands needed! 🚀

## Initial Setup

### Web App (Homepage)

1. **Connect to GitHub** (if not already connected)
   - Go to: https://vercel.com/core-francisco-parks-projects/homepage/settings/git
   - Click "Connect Git Repository"
   - Select your GitHub repository
   - Production Branch: `main`

2. **Configure Settings**
   - Root Directory: `apps/web`
   - Framework Preset: Next.js (auto-detected)
   - Build Command: Default
   - Output Directory: Default

### Portal App

1. **Create New Project**
   - Go to: https://vercel.com/new
   - Import your GitHub repository
   - Name: `mysite-portal` or similar

2. **Configure Project**
   - Root Directory: `apps/portal`
   - Framework Preset: Next.js (auto-detected)
   
3. **Add Environment Variables**
   - `NEXT_PUBLIC_SUPABASE_URL` = [your-supabase-url]
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = [your-supabase-anon-key]

## Daily Workflow

### Production Deployment
```bash
# Make changes
git add .
git commit -m "Your changes"
git push origin main

# ✅ Both apps automatically deploy to production!
```

### Preview Deployment
```bash
# Create feature branch
git checkout -b feature/new-thing
git push origin feature/new-thing

# ✅ Both apps get preview URLs automatically!
```

## Build Optimization (Optional)

To prevent unnecessary builds when only one app changes:

### For Web App
Settings → General → Ignored Build Step:
```bash
git diff HEAD^ HEAD --quiet apps/web packages/ui
```

### For Portal App
Settings → General → Ignored Build Step:
```bash
git diff HEAD^ HEAD --quiet apps/portal packages/ui
```

## Important Notes

- **NO vercel.json needed** - Dashboard settings handle everything
- **NO .vercel/ folder needed** - Git integration handles deployment
- **NO CLI commands needed** - Just git push!
- Each app has its own Vercel project with appropriate Root Directory
- Both projects watch the same GitHub repo but build different directories

## Environment Variables

- **Web App**: 
  - `BETA_PASSWORD` (optional, for beta blog access)
  - Google Analytics ID (if configured)

- **Portal App**: 
  - `NEXT_PUBLIC_SUPABASE_URL` (required)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (required)

## Custom Domains

In each project's Settings → Domains:
- **Web App**: `yourdomain.com` or `www.yourdomain.com`
- **Portal App**: `portal.yourdomain.com`

## Monitoring Deployments

1. **GitHub**: Look for ✓ or ✗ next to commits
2. **Vercel Dashboard**: See real-time build logs
3. **Email**: Get notified of deployment status

## Troubleshooting

### If builds fail:
1. Check Vercel dashboard for error logs
2. Ensure `pnpm-lock.yaml` is committed and up to date
3. Verify Root Directory is set correctly
4. Check environment variables are configured

### To test builds locally:
```bash
pnpm build              # Build all apps
pnpm build --filter=@workspace/web    # Build only web
pnpm build --filter=@workspace/portal  # Build only portal
```

## Rollback

If something goes wrong:
1. Go to Vercel dashboard → project → Deployments
2. Find a previous working deployment
3. Click "..." → "Promote to Production"

Or via Git:
```bash
git revert HEAD
git push origin main
```