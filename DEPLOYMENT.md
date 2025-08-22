# Deployment Guide

## Setup (One-time)

1. **Vercel Dashboard Settings**
   - Go to: https://vercel.com/core-francisco-parks-projects/homepage/settings
   - Set **Root Directory**: `apps/web`
   - Keep all other settings as default (Vercel auto-detects Next.js)

2. **Local Setup**
   - Clone repo
   - Run `vercel link --project homepage --yes` from repository root
   - This creates `.vercel/` folder with project link

## Deploy

From repository root (`/Users/cfpark00/mysite`):

```bash
# Preview deployment
vercel

# Production deployment  
vercel --prod
```

## Important Notes

- **NO vercel.json file needed** - Dashboard settings handle everything
- Always deploy from repository root, not from `apps/web`
- The `.vercel/` folder should be in repository root
- Dashboard Root Directory setting (`apps/web`) tells Vercel where Next.js lives in the monorepo

## Troubleshooting

If deployments fail with path errors:
1. Check dashboard Root Directory is set to `apps/web`
2. Ensure NO vercel.json exists in repository
3. Verify `.vercel/project.json` exists in repository root