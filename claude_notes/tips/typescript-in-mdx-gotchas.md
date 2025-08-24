# TypeScript Components in MDX: Gotchas and Solutions

## Overview
MDX allows you to use TypeScript React components within Markdown, but there are several subtle issues that can cause rendering differences between MDX contexts and regular React pages.

## Key Issues and Solutions

### 1. Prose Class Interference
**Problem**: MDX content is often wrapped in `prose` classes for typography styling, which can break component layouts.

```mdx
<!-- This will have prose styles applied -->
<div className="my-4">
  <PublicationCard publication={data} />
</div>
```

**Solution**: Use `not-prose` to escape prose styling:
```mdx
<div className="my-4 not-prose">
  <PublicationCard publication={data} />
</div>
```

### 2. Icon Alignment Issues
**Problem**: Icons using `sm:block` inside flex containers can become vertically misaligned when wrapped in prose styles.

**Example of problematic code**:
```tsx
<CardDescription className="flex sm:flex-row sm:items-center">
  <Users className="h-4 w-4 hidden sm:block" />  {/* This breaks in MDX! */}
  <span>Text content</span>
</CardDescription>
```

**Why it breaks**: The `prose` classes apply line-height and display rules that interfere with flexbox alignment.

### 3. Component Props Not Working
**Problem**: Props like `compact` may appear to be passed but don't actually affect rendering.

**Common mistake**:
```tsx
// Component accepts prop but doesn't use it
export function Card({ compact = false }) {
  return <div className="p-4">...</div>  // Same padding regardless of compact!
}
```

**Solution**: Actually implement prop-based styling:
```tsx
export function Card({ compact = false }) {
  return <div className={compact ? "p-2" : "p-4"}>...</div>
}
```

### 4. MDX Wrapper Divs
**Problem**: MDX requires wrapping components in divs, which adds extra margin/padding.

```mdx
<!-- This wrapper is necessary but adds spacing -->
<div className="my-4">
  <Component />
</div>
```

**Solution**: Be mindful of wrapper styles and consider using `not-prose` when needed.

## Best Practices

1. **Test components in both contexts**: Always test TypeScript components in both regular pages and MDX to catch rendering differences.

2. **Use `not-prose` liberally**: When embedding interactive components in MDX, wrap them with `not-prose` to prevent style interference.

3. **Avoid display utilities in flex children**: Instead of `sm:block` on flex children, use `sm:inline-flex` or let flex handle display.

4. **Export data separately**: Define complex data objects as exports rather than inline:
   ```mdx
   export const data = { ... }
   
   <Component data={data} />
   ```

5. **Check the parent wrapper**: Remember that MDX content typically gets wrapped in:
   ```tsx
   <div className="prose prose-neutral dark:prose-invert max-w-none">
     <MDXContent />
   </div>
   ```

## Debugging Tips

1. **Compare identical code**: If a component works on a regular page but not in MDX, the issue is likely prose/wrapper related.

2. **Inspect computed styles**: Use browser DevTools to compare computed styles between working and broken instances.

3. **Check flex alignment**: Icons and small elements are particularly susceptible to alignment issues in prose contexts.

4. **Verify prop usage**: Just because a component accepts a prop doesn't mean it uses it - check the implementation.

## Real Example from Today

We had a PublicationCard component that rendered perfectly on the publications page but had icon alignment issues in MDX. The problem was:

1. The MDX content was wrapped in `prose` classes
2. The Users icon had `sm:block` which broke flex alignment under prose styles
3. The `compact` prop was accepted but not actually implemented

The fix was simple: add `not-prose` to the wrapper div in MDX:
```mdx
<div className="my-4 not-prose">
  <PublicationCard publication={markovICLPublication} compact />
</div>
```

This prevented the prose typography styles from interfering with the component's internal flexbox layout.