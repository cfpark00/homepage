# Academic Homepage Build Log
**Date:** 2025-08-21  
**Time:** 13:00  
**Project:** Next.js Monorepo for Core Francisco Park's Academic Website

## Summary
Built a complete academic portfolio website for Core Francisco Park using Next.js, TypeScript, and shadcn/ui in a monorepo structure. Populated with actual content from existing GitHub Pages site.

## Major Tasks Completed

### 1. Initial Setup & Architecture
- Created pnpm monorepo with Turbo build system
- Set up Next.js 14 app with TypeScript
- Created shared UI package with shadcn/ui components
- Configured Tailwind CSS with custom theme

### 2. Core Pages Developed
- **Homepage** - Hero section, feature cards, recent publications
- **CV Page** - Traditional view + fancy timeline view with scroll animations
- **Publications** - 20+ papers with filtering and search
- **Blog** - MDX support with 2 blog posts
- **News** - Updates and announcements
- **Projects** (formerly Data Products) - Research tools showcase
- **Ongoing** - Current research with progress tracking
- **Simple** - Joke page with raw HTML style

### 3. Key Features Implemented

#### Navigation & Layout
- Persistent top navigation bar across all pages
- Menu items: Home, CV, Ongoing, Publications, Projects, Blog, News
- Dark mode support with theme toggle
- Responsive mobile menu
- Footer with copyright

#### CV Page Special Features
- Toggle between Traditional and Timeline views
- Timeline view with:
  - Scroll-triggered animations
  - Year-based navigation (forward/backward buttons)
  - Keyboard navigation (Arrow keys, j/k)
  - Progress dots indicator
  - Alternating left/right cards
  - Color coding by event type
  - Glowing timeline icons

#### Interactive Elements
- Chat box on homepage (simulated AI assistant)
- Quick question buttons
- Typing indicators
- Reset functionality

#### Content Migration
- Populated with Core's actual:
  - Education history (Harvard, SNU, École Polytechnique, KAIST)
  - Publications (NeurIPS, Nature Methods, ApJ, etc.)
  - Awards and honors
  - Research interests
  - Skills and languages
  - Current projects at NTT Research

### 4. Special Additions
- Sparrow favicon from original site
- Humorous banner: "Here is my website if you think good academics have bad websites: /simple"
- Ultra-minimal /simple page with raw HTML aesthetic (Times New Roman, blue links, left-aligned)

### 5. Technical Components Created

#### UI Components (packages/ui/src/components/)
- button.tsx
- card.tsx
- badge.tsx
- navigation-menu.tsx
- input.tsx
- select.tsx
- tabs.tsx
- progress.tsx
- scroll-area.tsx

#### App Components (apps/web/components/)
- navigation.tsx
- theme-provider.tsx
- chat-box.tsx
- cv-timeline.tsx
- cv-traditional.tsx

#### Data Files
- publications-data.ts (20+ publications)
- Blog posts in MDX format

### 6. File Structure Created
```
/Users/cfpark00/mysite/
├── apps/
│   └── web/
│       ├── app/
│       │   ├── (main)/
│       │   ├── blog/
│       │   ├── cv/
│       │   ├── data-products/ → projects/
│       │   ├── news/
│       │   ├── ongoing/
│       │   ├── publications/
│       │   └── simple/
│       ├── components/
│       ├── content/
│       │   └── blog/
│       ├── lib/
│       └── public/
│           └── sparrow.png
├── packages/
│   └── ui/
│       └── src/
│           ├── components/
│           ├── lib/
│           ├── styles/
│           └── hooks/
├── claude_notes/
│   └── logs/
│       └── 2025-08-21/
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
├── README.md
└── SHADCN_TIPS.md
```

## Commands & Configuration
- Dev server: `pnpm dev` (runs on port 3002)
- Build: `pnpm build`
- Deployment ready for Vercel (no .env required)
- Monorepo managed with pnpm workspaces
- Turbo for orchestrated builds

## Final State
- Fully functional academic portfolio
- All Core Francisco Park's actual content populated
- Production-ready for deployment
- Responsive design with dark mode
- Modern tech stack with excellent DX

## Notes
- Used shadcn/ui's copy-paste component approach
- Implemented scroll animations with Intersection Observer
- Created both sophisticated and deliberately simple versions for humor
- No database needed - all content is static/file-based