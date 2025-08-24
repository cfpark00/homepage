# Date Parsing and Timezone Fixes

## Date: 2025-08-23 23:33

## Summary
Fixed timezone-related date display issues in blog and news pages where dates were appearing one day earlier due to UTC parsing. Analyzed date handling across all content types (blogs, news, publications, talks) and implemented fixes where needed.

## Major Activities

### 1. Blog Date Investigation
- User reported that blog posts dated Aug 22-23 were displaying as Aug 21-22
- Examined blog metadata structure in `/apps/web/content/blog/metadata.json`
- Found dates stored as ISO strings like `"2025-08-22"`
- Updated welcome blog date from 2025-01-20 to 2025-08-22 per user request

### 2. Date Parsing Analysis
Identified the root cause of the timezone issue:
- **Problem**: `new Date("2025-08-22")` parses as UTC midnight (00:00:00Z)
- **Impact**: In PST/PDT (UTC-8/7), this displays as previous day (Aug 21 at 16:00/17:00)
- **Solution**: Use `new Date("2025-08-22T00:00:00")` to parse as local midnight

### 3. Blog Date Display Fixes
Fixed date parsing in two blog-related files:
- `/apps/web/app/(default)/blog/page.tsx` - Blog listing page
- `/apps/web/app/(default)/blog/[slug]/page.tsx` - Individual blog post page
- Changed from `new Date(post.date)` to `new Date(post.date + "T00:00:00")`

### 4. Content Type Date Audit
Analyzed date handling across all content types:

#### Publications (Safe)
- Uses separate `year` and `month` numeric fields
- Display: Simple text concatenation `${pub.month} ${pub.year}`
- No date parsing, no timezone issues

#### Talks (Safe)
- Stores dates as formatted strings like `"July 9, 2025"`
- Display: Direct string rendering `{talk.date}`
- No date parsing, no timezone issues

#### News (Had Issues)
- Stores dates as ISO strings like `"2025-07-10"`
- Uses `new Date()` for both sorting and display
- Had same timezone bug as blogs

### 5. News Date Display Fixes
Fixed date parsing in news-related files:
- `/apps/web/app/(default)/news/page.tsx` - Display fix
- `/apps/web/lib/news.ts` - Sorting logic fix
- Changed to use `new Date(date + "T00:00:00")` for local time parsing

## Technical Details

### JavaScript Date Parsing Behavior
- `"YYYY-MM-DD"` → Parsed as UTC midnight → Wrong date in local timezone
- `"YYYY-MM-DD" + "T00:00:00"` → Parsed as local midnight → Correct date display

### Files Modified
1. `/apps/web/content/blog/metadata.json` - Date content update
2. `/apps/web/app/(default)/blog/page.tsx` - Blog listing date fix
3. `/apps/web/app/(default)/blog/[slug]/page.tsx` - Blog post date fix
4. `/apps/web/app/(default)/news/page.tsx` - News display date fix
5. `/apps/web/lib/news.ts` - News sorting date fix

## Result
All date display issues resolved. Dates now correctly show in the user's local timezone without the one-day offset problem.