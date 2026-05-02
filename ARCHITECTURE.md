# Social Media Application - Architecture Guide

A comprehensive guide to the architecture, design patterns, and implementation details of this social media platform.

---

## Table of Contents

1. [System Architecture](#system-architecture)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [Database Architecture](#database-architecture)
5. [API Design](#api-design)
6. [Security Architecture](#security-architecture)
7. [Performance Architecture](#performance-architecture)
8. [Deployment Architecture](#deployment-architecture)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                             │
│                    (Next.js 15 Frontend)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Server Components (RSC) & Client Components (React 19)   │   │
│  │ Real-time Subscriptions via Supabase                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                      Edge & API Layer                            │
│                   (Vercel / Next.js Routes)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Route Handlers (REST API)                                │   │
│  │ Server Actions (RPC-style mutations)                     │   │
│  │ Middleware (Auth, CORS, etc.)                           │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              ↕
┌─────────────────────────────────────────────────────────────────┐
│                    Database & Storage Layer                      │
│                   (Supabase Cloud Platform)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ PostgreSQL (Primary data store)                          │   │
│  │ Row Level Security (Data access control)                 │   │
│  │ Real-time Subscriptions                                  │   │
│  │ Storage Buckets (Images, Videos)                         │   │
│  │ Triggers & Functions (Business logic)                    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 15 (App Router) | Server-side rendering, API routes |
| | React 19 | UI library with canary features |
| | TypeScript | Type safety |
| | Tailwind CSS | Styling |
| | shadcn/ui | Component library |
| | Supabase JS | Client SDK |
| **Backend** | Next.js Route Handlers | REST API |
| | Supabase Auth | Authentication |
| | PostgreSQL | Primary database |
| | RLS Policies | Row-level security |
| **Hosting** | Vercel | Frontend & API hosting |
| | Supabase Cloud | Database & storage |

---

## Frontend Architecture

### Directory Structure

```
app/
├── (app)/                    # Protected routes (layout group)
│   ├── layout.tsx           # App wrapper with sidebar
│   ├── home/
│   │   └── page.tsx         # Home feed
│   ├── explore/
│   │   └── page.tsx         # Explore page
│   ├── profile/
│   │   ├── [handle]/
│   │   │   └── page.tsx     # User profile
│   │   └── edit/
│   │       └── page.tsx     # Edit profile
│   ├── people/
│   │   └── page.tsx         # User discovery
│   ├── notifications/
│   │   └── page.tsx         # Notifications
│   ├── messages/
│   │   └── page.tsx         # Direct messages
│   └── bookmarks/
│       └── page.tsx         # Saved posts
├── auth/                     # Public auth routes
│   ├── login/
│   │   └── page.tsx
│   ├── sign-up/
│   │   └── page.tsx
│   ├── sign-up-success/
│   │   └── page.tsx
│   ├── callback/
│   │   └── route.ts         # Auth callback
│   └── error/
│       └── page.tsx
├── api/                      # API routes
│   ├── posts/
│   │   └── route.ts         # GET/POST posts
│   ├── follows/
│   │   └── route.ts         # POST/DELETE follows
│   ├── users/
│   │   └── profile/
│   │       └── route.ts     # GET/PUT user profile
│   ├── messages/
│   └── notifications/
├── page.tsx                 # Landing page
└── layout.tsx              # Root layout

components/
├── feed/
│   ├── feed.tsx            # Main feed wrapper
│   ├── post-card.tsx       # Individual post display
│   └── compose-post.tsx    # Post creation form
├── navigation/
│   ├── sidebar.tsx         # Left navigation
│   └── right-sidebar.tsx   # Trending & suggestions
└── ui/                     # shadcn/ui components

lib/
├── supabase/
│   ├── client.ts          # Browser client
│   ├── server.ts          # Server client
│   └── proxy.ts           # Session proxy
└── [utilities]/

public/                     # Static assets
```

### Component Architecture

#### Server vs Client Components

**Server Components (Default)**
- Fetch data on the server
- Access environment variables directly
- Keep sensitive logic on server
- Example: Layout, Page components

```typescript
// app/(app)/home/page.tsx - Server Component
import { createClient } from '@/lib/supabase/server'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) redirect('/auth/login')
  
  return <Feed />
}
```

**Client Components**
- Interactive features
- Event handlers
- Client-side state
- Hooks (useState, useEffect, etc.)

```typescript
// components/feed/post-card.tsx - Client Component
'use client'

import { useState } from 'react'

export function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  
  return <div>...</div>
}
```

#### Component Communication

1. **Props Down, Events Up**
   - Parent passes data via props
   - Children communicate via callbacks

2. **Supabase Client**
   - Shared instance via `createClient()`
   - Direct database access from client
   - Real-time subscriptions

3. **API Routes**
   - Fetch from client components
   - Server-side validation
   - Database mutations

### Styling Architecture

**Design Tokens**
```css
/* globals.css */
@layer base {
  :root {
    --background: #ffffff;
    --foreground: #000000;
    --muted: #f5f5f5;
    --primary: #1d9bf0;
    /* ... */
  }
}
```

**Tailwind CSS**
- Utility-first CSS framework
- Custom colors via CSS variables
- Responsive prefixes (sm, md, lg, xl)
- Dark mode support

**Component Library**
- shadcn/ui for base components
- Button, Input, Card, etc.
- Customizable via Tailwind
- Accessible by default

### State Management

**Client-side Data**
- React hooks (useState, useEffect)
- SWR pattern for data fetching
- Supabase real-time subscriptions

**Server-side Data**
- RSC props and context
- Fetched on each request
- ISR via revalidation

**Authentication**
- Supabase Auth session
- HTTP-only cookies
- Automatic token refresh

---

## Backend Architecture

### Route Handlers (REST API)

Each API endpoint follows this pattern:

```typescript
// app/api/[resource]/route.ts

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  // Business logic
  const { data, error } = await supabase
    .from('table')
    .select('*')
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  
  return NextResponse.json(data)
}

export async function POST(request: NextRequest) {
  // Validation
  const body = await request.json()
  
  // Database mutation
  const { data, error } = await supabase
    .from('table')
    .insert(body)
    .select()
    .single()
  
  // Response
  return NextResponse.json(data, { status: 201 })
}
```

### API Endpoints

#### Posts
- `GET /api/posts` - Fetch posts with pagination
- `POST /api/posts` - Create new post
- `GET /api/posts/[id]` - Get post details
- `PATCH /api/posts/[id]` - Update post
- `DELETE /api/posts/[id]` - Delete post

#### Users
- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile
- `GET /api/users/[handle]` - Get user by handle
- `GET /api/users/[id]/followers` - Get followers

#### Follows
- `POST /api/follows` - Follow user
- `DELETE /api/follows?following_id=[id]` - Unfollow user
- `GET /api/follows?user_id=[id]` - Get follows

#### Messages (Planned)
- `GET /api/messages/conversations` - List conversations
- `POST /api/messages/conversations` - Create conversation
- `GET /api/messages/[conversationId]` - Get messages
- `POST /api/messages` - Send message

### Middleware

```typescript
// middleware.ts
import { type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/proxy'

export async function middleware(request: NextRequest) {
  return await updateSession(request)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
}
```

**Responsibilities:**
- Session refresh before request
- Cookie management
- Protected route checks

---

## Database Architecture

### Schema Design

#### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  auth_id UUID UNIQUE,        -- Foreign key to auth.users
  handle VARCHAR(50) UNIQUE,  -- Twitter handle
  email VARCHAR(255) UNIQUE,  -- Email
  display_name VARCHAR(255),  -- Public name
  bio TEXT,                   -- User bio
  avatar_url TEXT,            -- Profile picture
  banner_url TEXT,            -- Banner image
  location VARCHAR(255),      -- Location
  website VARCHAR(255),       -- Personal website
  is_private BOOLEAN,         -- Private account flag
  is_verified BOOLEAN,        -- Verification badge
  followers_count INTEGER,    -- Denormalized count
  following_count INTEGER,    -- Denormalized count
  posts_count INTEGER,        -- Denormalized count
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP        -- Soft delete
)
```

#### Posts Table
```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY,
  user_id UUID,               -- Foreign key to users
  content TEXT,               -- Post content
  media_urls TEXT[],          -- Array of image/video URLs
  likes_count INTEGER,        -- Denormalized count
  replies_count INTEGER,      -- Denormalized count
  reposts_count INTEGER,      -- Denormalized count
  quotes_count INTEGER,       -- Denormalized count
  is_reply_to UUID,          -- Foreign key to parent post
  reply_to_user_id UUID,     -- Quick access to reply target
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  deleted_at TIMESTAMP        -- Soft delete
)
```

#### Post Engagements Table
```sql
CREATE TABLE post_engagements (
  id UUID PRIMARY KEY,
  post_id UUID,              -- Foreign key to posts
  user_id UUID,              -- Foreign key to users
  engagement_type VARCHAR(20), -- 'like', 'repost', 'reply'
  created_at TIMESTAMP,
  UNIQUE(post_id, user_id, engagement_type)
)
```

#### Follows Table
```sql
CREATE TABLE follows (
  id UUID PRIMARY KEY,
  follower_id UUID,          -- Foreign key to users
  following_id UUID,         -- Foreign key to users
  created_at TIMESTAMP,
  UNIQUE(follower_id, following_id),
  CHECK(follower_id != following_id)
)
```

#### Conversations & Messages
```sql
CREATE TABLE conversations (
  id UUID PRIMARY KEY,
  participant_ids UUID[],    -- Array of user IDs
  last_message_id UUID,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

CREATE TABLE messages (
  id UUID PRIMARY KEY,
  conversation_id UUID,
  sender_id UUID,
  content TEXT,
  media_urls TEXT[],
  is_edited BOOLEAN,
  created_at TIMESTAMP,
  deleted_at TIMESTAMP
)
```

### Indexing Strategy

**Primary Indexes**
- `users(auth_id)` - Auth lookup
- `users(handle)` - Handle lookup
- `posts(user_id)` - User's posts
- `posts(created_at DESC)` - Feed ordering
- `post_engagements(post_id)` - Post engagement
- `post_engagements(user_id)` - User engagement
- `follows(follower_id)` - Following list
- `follows(following_id)` - Followers list
- `messages(conversation_id)` - Conversation messages
- `notifications(user_id, is_read)` - User notifications

### Denormalization Pattern

Maintaining denormalized counters with triggers:

```sql
CREATE TRIGGER on_post_created
  AFTER INSERT ON posts
  FOR EACH ROW
  EXECUTE FUNCTION increment_posts_count();

CREATE FUNCTION increment_posts_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users SET posts_count = posts_count + 1
  WHERE id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Benefits:**
- No COUNT(*) queries needed
- O(1) counter reads
- Atomic updates via triggers

### Row Level Security (RLS)

**Policy Examples:**

```sql
-- Users can view all public profiles
CREATE POLICY "view_public_profiles" ON users
  FOR SELECT USING (true);

-- Users can only edit their own profile
CREATE POLICY "edit_own_profile" ON users
  FOR UPDATE USING (auth.uid() = auth_id);

-- Users can view public posts
CREATE POLICY "view_public_posts" ON posts
  FOR SELECT USING (
    NOT (SELECT is_private FROM users WHERE id = posts.user_id)
  );

-- Users can view their own posts regardless of privacy
CREATE POLICY "view_own_posts" ON posts
  FOR SELECT USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = posts.user_id)
  );
```

---

## API Design

### Request/Response Pattern

**Success Response (200)**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "content": "Hello world!",
  "created_at": "2024-01-01T12:00:00Z",
  "users": {
    "handle": "john",
    "display_name": "John Doe"
  }
}
```

**Error Response (4xx/5xx)**
```json
{
  "error": "Error message",
  "code": "INVALID_REQUEST"
}
```

### Authentication

**Session-based via Supabase**
- Email/password signup and login
- Email verification required
- HTTP-only secure cookies
- Automatic token refresh

**Per-Request Auth Check**
```typescript
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
```

### Pagination

**Query Parameters**
```
GET /api/posts?limit=50&offset=0
```

**Response**
```json
{
  "posts": [...],
  "total": 150,
  "limit": 50,
  "offset": 0
}
```

### Rate Limiting (Planned)

- Post creation: 50 per hour per user
- Follow/unfollow: 100 per hour
- API calls: 1000 per hour

---

## Security Architecture

### Authentication & Authorization

1. **Signup/Signin**
   - Email verification required
   - bcrypt password hashing (Supabase managed)
   - User metadata in JWT claims

2. **Session Management**
   - HTTP-only secure cookies
   - 7-day expiry (configurable)
   - Automatic refresh via middleware
   - CSRF token via cookies

3. **Protected Routes**
   - Middleware checks auth
   - API routes verify user
   - Server components redirect if unauthenticated

### Row Level Security

- All tables have RLS enabled
- Policies enforce data ownership
- Users only see/modify their own data
- Public content visible to all

### Input Validation

**Server-side validation on all inputs:**
- Email format validation
- Password strength requirements
- Content length limits
- SQL injection prevention (parameterized queries)
- XSS prevention (React escaping)

### Data Privacy

- Soft deletes preserve data
- No sensitive data in logs
- User data only in their session
- Private account flag respected

---

## Performance Architecture

### Database Optimization

1. **Query Optimization**
   - Proper indexing on all query columns
   - Avoid N+1 queries via joins
   - Pagination to limit result sets
   - SELECT specific columns, not *

2. **Denormalization**
   - Counters maintained via triggers
   - Pre-calculated stats
   - Avoid expensive aggregations

3. **Caching Strategy** (Planned)
   - Redis cache layer
   - Cache feed results
   - Cache trending tags
   - Cache user profiles

### Frontend Performance

1. **Code Splitting**
   - Route-based code splitting
   - Dynamic imports for heavy components
   - Tree shaking unused code

2. **Image Optimization**
   - Next.js Image component
   - Automatic format selection
   - Lazy loading by default
   - Responsive sizing

3. **Resource Loading**
   - Preload critical resources
   - Prefetch route links
   - Defer non-critical scripts

### Real-time Updates

- Supabase subscriptions for feed updates
- WebSocket connections (managed by Supabase)
- Optimistic UI updates
- Fallback polling if subscriptions fail

---

## Deployment Architecture

### Development Environment
- Local Next.js dev server
- Local Supabase via Docker (optional)
- Hot module reloading
- Debug tools

### Staging Environment
- Vercel preview deployments
- Branch deployments
- Staging database
- Integration testing

### Production Environment
- Vercel production deployment
- Supabase production database
- CDN for static assets
- Error tracking (Sentry)
- Performance monitoring

### Deployment Flow

```
Git Push → GitHub
    ↓
GitHub Actions (CI)
    ↓
Lint, Type Check, Test
    ↓
Build & Deploy to Staging
    ↓
Deploy to Production (main branch)
```

### Environment Variables

```bash
# Database
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# Auth Callback
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000

# Monitoring (future)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

---

## Scaling Strategy

### Phase 1: 0-10K Users
- Single database instance
- Vercel auto-scaling
- Basic monitoring
- No caching needed yet

### Phase 2: 10K-100K Users
- Read replicas for database
- Redis caching layer
- CDN for media
- Rate limiting

### Phase 3: 100K+ Users
- Database sharding
- Distributed caching
- Message queue for async tasks
- Microservices for heavy operations

---

## Technology Decisions

### Why Next.js?
- Server/Client components for flexibility
- Built-in API routes
- Automatic code splitting
- Excellent SEO support
- Vercel integration

### Why Supabase?
- Open-source PostgreSQL
- Built-in auth and RLS
- Real-time subscriptions
- File storage
- Type-safe queries

### Why Tailwind CSS?
- Utility-first approach
- Small bundle size
- Easy customization
- Excellent docs
- Built-in responsive design

### Why shadcn/ui?
- Copy-paste components
- Full control over styling
- Accessible by default
- Radix UI foundation
- Regular updates

---

## Future Improvements

1. **Performance**
   - Image CDN
   - Redis caching
   - GraphQL API option
   - ServiceWorker for offline support

2. **Features**
   - Spaces/communities
   - Voice/video calls
   - Live streaming
   - Polls and voting
   - Content recommendations

3. **Developer Experience**
   - API documentation
   - SDK for mobile apps
   - Analytics dashboard
   - Admin panel

4. **Operations**
   - Observability dashboard
   - Automated testing
   - Chaos engineering
   - Load testing

---

## References

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [PostgreSQL Best Practices](https://www.postgresql.org/docs/)
- [Vercel Deployment](https://vercel.com/docs)
- [React 19 Features](https://react.dev)

---

**Document Version**: 1.0
**Last Updated**: 2024
**Maintainers**: Development Team
