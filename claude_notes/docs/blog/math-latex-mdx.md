# Math/LaTeX in MDX - Setup and Gotchas

## Setup Requirements

1. **Install packages:**
   ```bash
   pnpm add remark-math rehype-katex katex
   ```

2. **Configure `next.config.mjs`:**
   ```javascript
   import remarkMath from 'remark-math'
   import rehypeKatex from 'rehype-katex'

   const withMDX = createMDX({
     options: {
       remarkPlugins: [remarkGfm, remarkMath],
       rehypePlugins: [rehypeKatex],
     },
   })
   ```

3. **Import KaTeX CSS in `app/layout.tsx`:**
   ```typescript
   import "katex/dist/katex.min.css"
   ```

## IMPORTANT UPDATE: No Escaping Needed!

**Good news:** With proper `remark-math` and `rehype-katex` setup, you DON'T need to escape curly braces in math expressions!

### Working Examples

✅ **ALL OF THESE WORK**:
```markdown
$X_i \in \mathbb{R}^{C \times D}$
$\frac{1}{2}$
$X_{ij}$
$\sum_{i=1}^n$
$$\lim_{x \to \infty} \frac{1}{x} = 0$$
```

### Common LaTeX Patterns That Work

| LaTeX Command | Example |
|--------------|---------|
| Superscript with content | `x^{2n}` |
| Subscript with content | `X_{ij}` |
| Fractions | `\frac{a}{b}` |
| Math blackboard | `\mathbb{R}` |
| Math calligraphic | `\mathcal{L}` |
| Limits | `\lim_{x \to 0}` |
| Sums | `\sum_{i=1}^n` |
| Text in math | `\text{rank}` |

### Display Math
```markdown
$$
\frac{d}{dt} X_i = \sum_{j=1}^n a_{ij} X_j
$$
```

## Debugging Tips

1. **Build error at specific character position**: The error message shows line and character position. Look for unescaped `{` or `}` around that position.

2. **Math not rendering** (shows literal `$...$`): Check that:
   - `remark-math` and `rehype-katex` are in next.config.mjs
   - KaTeX CSS is imported in layout
   - Dev server was restarted after config changes

3. **Test incrementally**: Start with simple math and add complexity gradually to identify which expressions cause issues.

## Alternative: Use Custom Component

If escaping becomes too cumbersome, create a custom component:
```jsx
<Math>X_i \in \mathbb{R}^{C \times D}</Math>
```
This avoids MDX parsing but requires more setup.