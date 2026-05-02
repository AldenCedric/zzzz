# Getting Started Guide

## Prerequisites

- Node.js 18+ installed
- npm, yarn, pnpm, or bun package manager
- Git for version control
- A Supabase account (free tier available at supabase.com)

## Quick Start (5 minutes)

### 1. Clone the Repository

```bash
git clone <repository-url>
cd social-media-app
```

### 2. Install Dependencies

```bash
pnpm install
# or npm install, yarn install, bun install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Get these from your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# For auth redirects in development
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## First Steps

### Create an Account

1. Visit `http://localhost:3000`
2. Click "Sign Up"
3. Enter your email and create a password
4. Check your email for verification link
5. Confirm your email and you're ready to go!

### Create Your First Post

1. Sign in to your account
2. Go to Home (`/home`)
3. Click in the "What's happening?!" text box
4. Write your post (up to 300 characters)
5. Click "Post" to publish

### Follow Someone

1. Visit the People page (`/people`)
2. Click "Follow" on any user
3. View their profile by clicking their name
4. See all their posts on their profile page

## Project Structure

```
├── app/
│   ├── (app)/              # Protected routes
│   ├── auth/               # Authentication
│   ├── api/                # API endpoints
│   └── page.tsx            # Landing page
│
├── components/
│   ├── feed/              # Feed components
│   ├── navigation/        # Navigation
│   └── ui/                # UI components
│
├── lib/
│   └── supabase/          # Supabase setup
│
├── public/                # Static files
│
└── IMPLEMENTATION.md      # Detailed progress
└── ARCHITECTURE.md        # System architecture
```

## Key Features

### Authentication ✅
- Email/password signup and login
- Email verification
- Secure session management
- Auto logout on tab close

### Posts ✅
- Create posts (up to 300 characters)
- Like posts
- View engagement counts
- Real-time feed updates
- User profile links

### User Profiles ✅
- View user profiles
- Edit your profile (bio, location, website)
- See follower/following counts
- View user's posts

### Social Features ✅
- Follow/unfollow users
- User discovery page
- See who to follow suggestions

### Planned Features 🔜
- Direct messaging
- Notifications
- Search functionality
- Image uploads
- Hashtags & trending
- Bookmarks
- Repost functionality

## Common Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run type checking
pnpm type-check

# Run linting
pnpm lint
```

## Database Setup

The database schema is automatically created when you connect to Supabase. The following tables are created:

- `users` - User profiles
- `posts` - User posts
- `post_engagements` - Likes, reposts, replies
- `follows` - Follow relationships
- `conversations` - Direct message threads
- `messages` - Direct messages
- `notifications` - User notifications
- `hashtags` - Trending hashtags

## API Endpoints

### Posts
```bash
# Get posts
GET /api/posts?limit=50&offset=0

# Create post
POST /api/posts
Content-Type: application/json
{ "content": "Hello world!" }
```

### Users
```bash
# Get current user profile
GET /api/users/profile

# Update profile
PUT /api/users/profile
Content-Type: application/json
{
  "display_name": "John Doe",
  "bio": "Developer",
  "location": "San Francisco",
  "website": "https://example.com"
}
```

### Follows
```bash
# Follow user
POST /api/follows
Content-Type: application/json
{ "following_id": "user-uuid" }

# Unfollow user
DELETE /api/follows?following_id=user-uuid
```

## Troubleshooting

### "Environment variables not set"
Make sure your `.env.local` file is in the root directory with the correct Supabase credentials.

### "Email verification required"
Check your email inbox (and spam folder) for the verification link from Supabase.

### "Database connection error"
Verify that your Supabase project is active and the environment variables are correct.

### "Post creation fails"
Ensure you're logged in and your email is verified.

## Development Tips

### Debug with Console Logs

```typescript
// Components
console.log("[v0] Debug message:", variable)

// Use React DevTools browser extension
// React 19 compatible debugging
```

### Hot Module Reloading

The dev server automatically refreshes when you save files. No manual reload needed!

### TypeScript Checking

The project has strict TypeScript enabled. Use `pnpm type-check` to verify types.

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables in Vercel dashboard
4. Vercel automatically deploys on push

```bash
# Build locally to test
pnpm build

# Check for build errors
pnpm type-check && pnpm lint
```

## Next Steps

### To add more features:

1. **Search & Discovery**
   - Create `app/(app)/search/page.tsx`
   - Add search API route
   - Implement hashtag search

2. **Messaging**
   - Create messaging components
   - Add conversation API routes
   - Implement real-time messages

3. **Image Uploads**
   - Create upload handler
   - Use Supabase Storage
   - Update post component

4. **Notifications**
   - Create notification components
   - Add notification API routes
   - Wire up real-time notifications

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [React 19 Features](https://react.dev)

## Getting Help

### Documentation
- See `ARCHITECTURE.md` for system design
- See `IMPLEMENTATION.md` for feature details

### Common Issues

**Port already in use?**
```bash
# Kill process on port 3000
lsof -i :3000
kill -9 <PID>

# Or use different port
pnpm dev -p 3001
```

**Dependency conflicts?**
```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Database issues?**
```bash
# Check Supabase status at supabase.com
# Verify environment variables
# Check browser console for errors
```

## License

This project is open source and available under the MIT License.

## Support

For questions or issues:
1. Check the ARCHITECTURE.md and IMPLEMENTATION.md files
2. Review the code comments
3. Check the official documentation links above
4. Open an issue on GitHub (if available)

---

**Happy coding!** 🚀

Ready to start building? Run `pnpm dev` and head to `http://localhost:3000`
