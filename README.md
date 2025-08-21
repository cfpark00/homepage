# Academic Homepage Monorepo

A modern, fully-featured academic portfolio website built with Next.js, TypeScript, and shadcn/ui.

## Features

- **Homepage** - Professional landing page with hero section and feature highlights
- **CV/Resume** - Detailed academic CV with education, experience, and skills
- **Publications** - Searchable and filterable publication list with links to papers
- **Blog** - MDX-powered blog system for sharing research insights
- **News & Updates** - Latest news about research, awards, and collaborations
- **Data Products** - Interactive visualizations and research tools showcase
- **Dark Mode** - Full dark mode support with system preference detection
- **Responsive Design** - Mobile-first responsive design

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI + Tailwind)
- **Content**: MDX for blog posts
- **Package Manager**: pnpm
- **Build System**: Turbo

## Project Structure

```
.
├── apps/
│   └── web/                 # Next.js application
│       ├── app/             # App router pages
│       ├── components/      # React components
│       ├── content/         # MDX content (blog, news)
│       └── lib/            # Utility functions
├── packages/
│   └── ui/                 # Shared UI component library
│       ├── src/
│       │   ├── components/ # shadcn/ui components
│       │   ├── lib/       # Utils
│       │   └── styles/    # Global CSS
│       └── tailwind.config.ts
└── turbo.json             # Turbo configuration
```

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 9.0.0+

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd academic-homepage
```

2. Install dependencies:
```bash
pnpm install
```

3. Start the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Development

### Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm clean` - Clean build outputs and node_modules

### Adding Blog Posts

Create MDX files in `apps/web/content/blog/` with frontmatter:

```mdx
---
title: "Your Post Title"
date: "2024-01-01"
excerpt: "Brief description"
author: "Your Name"
tags: ["tag1", "tag2"]
---

Your content here...
```

### Customization

1. **Personal Information**: Update the content in each page component
2. **Theme**: Modify colors in `packages/ui/src/styles/globals.css`
3. **Components**: Add or modify components in `packages/ui/src/components/`
4. **Navigation**: Edit `apps/web/components/navigation.tsx`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Configure build settings:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `pnpm build`
   - Output Directory: `apps/web/.next`

### Other Platforms

Build the project:
```bash
pnpm build
```

The production build will be in `apps/web/.next`. Deploy according to your platform's Next.js deployment guide.

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.