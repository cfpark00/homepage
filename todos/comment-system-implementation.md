# Blog Comment System Implementation Guide

## Overview
Add a comment system to blog posts using the existing Supabase instance from the portal app, but architected for easy separation when scaling.

## Architecture Principles

### 1. Database Design (Shared Supabase, Separate Concerns)
- Use same Supabase project as portal app (free tier limitation)
- Prefix all tables with `blog_` to maintain clear separation
- No foreign keys or relations to portal tables
- Design for easy migration to separate project later

### 2. Database Schema

```sql
-- Users table for commenters (separate from portal users)
CREATE TABLE blog_comment_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  is_anonymous BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments table
CREATE TABLE blog_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_slug TEXT NOT NULL,
  user_id UUID REFERENCES blog_comment_users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  parent_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  is_edited BOOLEAN DEFAULT false,
  edited_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Moderation
  is_flagged BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  
  -- Indexing
  INDEX idx_post_slug (post_slug),
  INDEX idx_parent_id (parent_id)
);

-- Votes/reactions
CREATE TABLE blog_comment_votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  comment_id UUID REFERENCES blog_comments(id) ON DELETE CASCADE,
  user_id UUID REFERENCES blog_comment_users(id) ON DELETE CASCADE,
  vote_type TEXT CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(comment_id, user_id)
);
```

### 3. RLS Policies

```sql
-- Enable RLS
ALTER TABLE blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comment_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_comment_votes ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can read comments" ON blog_comments
  FOR SELECT TO anon USING (NOT is_hidden);

-- Authenticated users can create
CREATE POLICY "Users can create comments" ON blog_comments
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Users can edit own comments
CREATE POLICY "Users can edit own comments" ON blog_comments
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);
```

### 4. Implementation Structure

```
apps/web/
├── lib/
│   └── supabase-comments.ts     # Separate client for comments
├── components/
│   └── comments/
│       ├── comment-section.tsx   # Main container
│       ├── comment-form.tsx      # New comment form
│       ├── comment-item.tsx      # Individual comment
│       ├── comment-list.tsx      # List with nesting
│       └── comment-auth.tsx      # Simple auth modal
└── app/
    └── api/
        └── comments/
            ├── route.ts          # GET/POST comments
            └── [id]/
                └── route.ts      # PUT/DELETE individual

```

### 5. Auth Strategy

Two options:

**Option A: Anonymous + Email (Recommended)**
```typescript
// Simple email verification for comments
const { data } = await supabase.auth.signInWithOtp({
  email: userEmail,
  options: { 
    emailRedirectTo: `${window.location.origin}/blog/${slug}`,
    data: { context: 'blog_comment' }
  }
})
```

**Option B: Full Anonymous**
```typescript
// Fully anonymous comments with optional name
const { data } = await supabase.auth.signInAnonymously()
// Store display_name in blog_comment_users
```

### 6. Component Implementation

```tsx
// apps/web/app/(default)/blog/[slug]/page.tsx
import { CommentSection } from '@/components/comments/comment-section'

// Add at the bottom of article
<div className="mt-16 border-t pt-8">
  <CommentSection postSlug={slug} />
</div>
```

### 7. Key Separation Rules

1. **Never import** portal code into web app
2. **Separate Supabase clients** with different auth flows
3. **No shared state** between apps
4. **Independent API routes** 
5. **Different auth contexts** (portal: Google OAuth, comments: email/anonymous)

### 8. Migration Path (When Needed)

```bash
# 1. Export blog tables
pg_dump $OLD_DB_URL \
  --table='blog_*' \
  --data-only > blog_data.sql

# 2. Create schema in new project
psql $NEW_DB_URL < blog_schema.sql

# 3. Import data
psql $NEW_DB_URL < blog_data.sql

# 4. Update env vars in apps/web/.env
NEXT_PUBLIC_SUPABASE_URL=new_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=new_key

# 5. Deploy - no code changes needed
```

### 9. Environment Variables

```bash
# apps/web/.env.local
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key  # For moderation
```

### 10. Features to Consider

- **Real-time updates** using Supabase subscriptions
- **Markdown support** with sanitization
- **Rate limiting** per IP/user
- **Spam detection** (simple keyword filter initially)
- **Moderation queue** for flagged comments
- **Email notifications** for replies (optional)

### 11. Security Considerations

- Sanitize all HTML/markdown input
- Rate limit comment creation (e.g., 5 per minute)
- Implement CAPTCHA for anonymous users
- Store IP addresses for moderation
- Add honeypot field to prevent bots

### 12. Testing Approach

1. Test comment CRUD operations
2. Test nested reply structure
3. Test auth flows (anonymous vs email)
4. Test moderation features
5. Load test with many comments
6. Test real-time updates

## Estimated Timeline

- Database setup: 30 mins
- API routes: 1 hour  
- React components: 2 hours
- Auth flow: 1 hour
- Testing & polish: 1 hour

**Total: ~5-6 hours for basic implementation**

## Alternative: Quick Solution with Giscus

If timeline is critical, use Giscus (GitHub Discussions):

```tsx
// components/giscus-comments.tsx
export function GiscusComments({ slug }: { slug: string }) {
  return (
    <div className="giscus" 
      data-repo="your-github/repo"
      data-repo-id="..."
      data-mapping="pathname"
      data-term={`blog/${slug}`}
      data-theme="preferred_color_scheme"
    />
  )
}
```

Setup time: 15 minutes