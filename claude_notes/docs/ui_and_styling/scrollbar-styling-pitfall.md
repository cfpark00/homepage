# Scrollbar Styling Pitfall - Native vs Custom Components

## Problem
You notice inconsistent scrollbar appearance across your app:
- ✅ **Clean scrollbars** (no gray track, thumb only): Chat messages, timeline, canvas areas
- ❌ **Ugly scrollbars** (gray track visible): Form inputs, textareas, custom components

## Root Cause
**Different scrollbar sources:**
- **ScrollArea component** (shadcn/ui) = Clean, custom styled scrollbars
- **Native elements** (textarea, div with overflow) = Browser default scrollbars

## Quick Diagnosis
1. Check if the problematic area uses `<ScrollArea>` component
2. If it uses native scrollable elements (`textarea`, `div` with `overflow-auto`), that's your culprit

## Solution

### For textarea elements:
```tsx
<textarea
  className={cn(
    "your-other-classes",
    // Add these scrollbar classes:
    "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
    "[&::-webkit-scrollbar]:w-2",
    "[&::-webkit-scrollbar-track]:bg-transparent", 
    "[&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
  )}
/>
```

### For div elements:
```tsx
<div 
  className={cn(
    "overflow-auto", // or overflow-y-auto
    // Add these scrollbar classes:
    "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
    "[&::-webkit-scrollbar]:w-2",
    "[&::-webkit-scrollbar-track]:bg-transparent",
    "[&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full"
  )}
>
```

### Best practice - Use ScrollArea when possible:
```tsx
import { ScrollArea } from "@workspace/ui/components/scroll-area"

<ScrollArea className="h-full">
  <div>Your scrollable content</div>
</ScrollArea>
```

## Why This Happens
- **ScrollArea component** automatically handles cross-browser scrollbar styling
- **Native scrollable elements** use browser defaults unless explicitly styled
- The shadcn/ui ScrollArea component is designed to hide native scrollbars and show custom ones

## Investigation Method
When debugging scrollbar issues:
1. Read multiple files that have working scrollbars (chat-interface.tsx, timeline-view.tsx)
2. Compare with problematic components 
3. Look for `ScrollArea` vs native scrollable elements
4. Check if scrollbar styling classes are applied to native elements

## Files Affected in This Project
- ✅ `chat-interface.tsx` - Uses ScrollArea (clean)
- ✅ `timeline-view.tsx` - Uses ScrollArea (clean) 
- ❌ `chat-input.tsx` - Used native textarea (was problematic, now fixed)

## Related Components
- `packages/ui/src/components/scroll-area.tsx` - The custom ScrollArea implementation
- Any component using `textarea`, `overflow-auto`, `overflow-y-auto` without ScrollArea wrapper