# shadcn/ui Tips & Setup Guide

## What is shadcn/ui?

shadcn/ui is not a traditional component library - it's a collection of copy-and-paste components built using Radix UI primitives and styled with Tailwind CSS. The philosophy is "This is NOT a component library. It's a collection of re-usable components that you can copy and paste into your apps."

## Key Concepts Learned

### 1. Component Installation
- Components are installed via CLI: `npx shadcn@latest add <component>`
- Components are copied into your codebase, not installed as dependencies
- You own the code and can modify it as needed

### 2. CSS Variable Architecture
- Uses CSS variables for theming (e.g., `--background`, `--foreground`)
- Tailwind arbitrary values must use `var()` syntax: `w-[var(--radix-dropdown-menu-trigger-width)]`
- Common mistake: `w-[--radix-dropdown-menu-trigger-width]` (missing `var()`)

### 3. Component Composition
- Built on top of Radix UI primitives for accessibility
- Components are composable - smaller parts combine into larger components
- Example: Sidebar component uses Sheet, Button, and other primitives

### 4. Toast Notifications
- When using Sonner for toasts, export from UI package instead of direct import
- This avoids module resolution issues in monorepo setups

## How It's Set Up in This Repository

### 1. Configuration Files

**`components.json` locations:**
- `/apps/web/components.json` - Web app configuration
- `/packages/ui/components.json` - UI package configuration

**Web app config (`/apps/web/components.json`):**
```json
{
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "./tailwind.config.ts",
    "css": "../../packages/ui/src/styles/globals.css",
    "baseColor": "zinc",
    "cssVariables": true
  },
  "aliases": {
    "components": "@workspace/ui/components",
    "utils": "@workspace/ui/lib/utils",
    "ui": "@workspace/ui/components",
    "lib": "@workspace/ui/lib",
    "hooks": "@workspace/ui/hooks"
  }
}
```

### 2. Component Structure
Components are installed in the shared UI package:
```
packages/ui/src/components/
├── avatar.tsx
├── button.tsx
├── card.tsx
├── dropdown-menu.tsx
├── sidebar.tsx
├── sonner.tsx
└── ... more components
```

### 3. Import Pattern
Components are imported from the workspace UI package:
```tsx
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
```

### 4. Global Styles
Located at `/packages/ui/src/styles/globals.css`:
- Defines CSS variables for theming
- Includes Tailwind directives
- Sets up color scheme variables for light/dark modes

## Common Patterns & Best Practices

### 1. Page-Specific Components
Keep page-specific components close to where they're used:
```
app/login/
├── components/
│   ├── login-form.tsx
│   └── login-flow.tsx
└── page.tsx
```

### 2. Shared Component Groups
Group related components in dedicated folders:
```
components/sidebar/
├── sidebar.tsx
├── sidebar-data.ts
├── nav-main.tsx
├── nav-user.tsx
└── project-switcher.tsx
```

### 3. Data Separation
Extract static data from components:
```tsx
// sidebar-data.ts
export const sidebarData = {
  user: { ... },
  projects: [ ... ],
  navMain: [ ... ]
}

// sidebar.tsx
import { sidebarData } from "./sidebar-data"
```

## Useful Resources

### Official Documentation
- **Main site**: https://ui.shadcn.com/
- **Components**: https://ui.shadcn.com/docs/components
- **Themes**: https://ui.shadcn.com/themes
- **Examples**: https://ui.shadcn.com/examples

### Installation & Setup
- **Installation guide**: https://ui.shadcn.com/docs/installation
- **Next.js setup**: https://ui.shadcn.com/docs/installation/next
- **Manual installation**: https://ui.shadcn.com/docs/installation/manual

### Component Documentation
Each component has detailed docs with:
- Installation command
- Usage examples
- API reference
- Accessibility notes

Example: https://ui.shadcn.com/docs/components/button

### Related Projects
- **Radix UI**: https://www.radix-ui.com/ (underlying primitives)
- **Tailwind CSS**: https://tailwindcss.com/ (styling system)
- **Lucide Icons**: https://lucide.dev/ (icon library used with shadcn)

## Troubleshooting Tips

### 1. Module Resolution Issues
If you get "Cannot find module" errors:
- Check if component is properly exported from UI package
- Verify the import path matches your aliases
- For Sonner/toast, re-export from UI package
- Note: In this project, we don't use the shadcn CLI due to monorepo complexity - we manually create components instead

### 2. Styling Issues
- Dropdown transparency: Use `var()` in arbitrary values
- Missing styles: Ensure globals.css is imported in root layout
- Theme not applying: Check CSS variables in globals.css

### 3. CLI Installation
- Always run from the app directory that has components.json
- Use `--overwrite` flag to update existing components
- Check components.json aliases match your project structure

## Monorepo-Specific Setup

In this monorepo:
1. Components install to `packages/ui` (shared across apps)
2. Each app has its own `components.json` pointing to the UI package
3. Apps import from `@workspace/ui/components/*`
4. Global styles are shared from `packages/ui/src/styles/globals.css`

This setup allows all apps to share the same component library while maintaining the ability to customize per-app if needed.