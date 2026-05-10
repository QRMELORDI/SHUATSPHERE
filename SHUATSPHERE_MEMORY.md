# SHUATSPHERE — Complete App Memory & Developer Guide

> Last updated: May 10, 2026  
> For any new AI agent: Read this entire document before making changes.

---

## 1. What is SHUATSPHERE?

SHUATSPHERE is a **Reddit-like university community platform** built exclusively for students of **Sam Higginbottom University of Agriculture, Technology and Sciences (SHUATS)**, Prayagraj, India.

**Core concept:** Every student has a university email like `25msrsgis001@shiats.edu.in`. Only `@shiats.edu.in` email holders can register and interact. Others can browse in "Ghost Mode" (read-only).

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 6 |
| Routing | react-router v7 (Data Mode, `createBrowserRouter`) |
| Styling | Tailwind CSS v4 |
| Animations | Motion (motion/react) — formerly Framer Motion |
| Icons | lucide-react |
| Fonts | Outfit (headings/brand) + Plus Jakarta Sans (body) |
| State | React Context API (`AppContext`) |
| Data | Mock data only (`/src/app/data/mockData.ts`) |
| Backend | **NOT YET CONNECTED** — Supabase recommended |

---

## 3. Brand Identity

| Element | Value |
|---|---|
| Primary color | `#7C3AED` (Violet) |
| Secondary color | `#0D9488` (Teal) |
| Dark background | `#0D0B1A` |
| Card dark | `#15122A` |
| Font – Brand | Outfit (font-black for headings) |
| Font – Body | Plus Jakarta Sans |
| Design style | **Neo-brutalist** — heavy borders (`border-2 border-zinc-900`), hard shadows (`shadow-[4px_4px_0px_#18181B]`), rounded-2xl cards |
| Logo | Custom SVG sphere in `/src/app/components/SphereLogo.tsx` |

---

## 4. Reddit → SHUATSPHERE Terminology Map

| Reddit Term | SHUATSPHERE Term |
|---|---|
| Subreddit | **Sphere** (e.g., `s/cse-2025`) |
| Upvote | **Boost** 👍 |
| Downvote | **Bury** 👎 |
| Karma | **Aura Score** ✨ |
| Save | **Stash** 🔖 |
| User Flair | **Tag** (e.g., "CSE 3rd yr") |
| DM / Private Message | **Whisper** 💬 |
| Anonymous Browse | **Ghost Mode** 👻 |
| Subreddit Moderator | **Sphere Keeper** 👑 |
| Admin | **Sphere Keeper** (can delete comments + posts in their sphere) |

---

## 5. File Structure

```
/src/app/
├── App.tsx                    # Root: AppProvider + RouterProvider
├── routes.tsx                 # All page routes
├── context/
│   └── AppContext.tsx         # Global state: auth, posts, spheres, whispers, notifications
├── data/
│   └── mockData.ts            # All mock data + TypeScript interfaces
├── components/
│   ├── Layout.tsx             # Shell: Header + Bottom Nav + Drawer
│   ├── PostCard.tsx           # Reusable post card (feed + search + stash)
│   └── SphereLogo.tsx         # Custom SVG logo
└── pages/
    ├── LoginPage.tsx          # @shiats.edu.in validation login
    ├── RegisterPage.tsx       # Registration with email domain check
    ├── HomePage.tsx           # Feed: Trending | Latest | Top + My Feed toggle
    ├── SpheresPage.tsx        # Browse + search + Create Sphere modal
    ├── SphereDetailPage.tsx   # Sphere posts + sort + join/leave
    ├── PostDetailPage.tsx     # Full post + nested comments + voting
    ├── CreatePostPage.tsx     # Text | Photo (gallery upload) | Link post
    ├── ProfilePage.tsx        # User profile + edit (avatar/banner)
    ├── InboxPage.tsx          # Whispers conversation list + thread view
    ├── ComposeWhisperPage.tsx # Full-page new whisper (matches design spec)
    ├── NotificationsPage.tsx  # Notification feed with mark-as-read
    ├── LeaderboardPage.tsx    # Aura rankings + Top Spheres
    ├── SearchPage.tsx         # Post + Sphere search; "s/" prefix shows all spheres
    └── StashPage.tsx          # Saved posts
/src/styles/
├── index.css    # Imports + animated banner keyframes
├── theme.css    # CSS variables (light/dark colors)
├── fonts.css    # Google Fonts imports
└── tailwind.css # Tailwind v4 config
```

---

## 6. Data Models (TypeScript Interfaces in mockData.ts)

```typescript
User {
  id, email, name, username, batch, branch, bio,
  avatar, bannerColor, auraScore, joinDate,
  badges, joinedSpheres, isVerified, tag
}

Sphere {
  id, name, slug, description, icon, coverColor,
  coverImage?, memberCount, postCount,
  createdBy, createdAt, isPrivate, category, tags, keeper
}

Post {
  id, title, content?, imageUrl?, linkUrl?,
  type: 'text'|'image'|'link',
  authorId, sphereId, sphereSlug,
  boosts, buries, replyCount, stashCount,
  createdAt, flair?, isPinned?, isEvent?,
  eventDate?, eventVenue?
}

Reply {
  id, postId, parentId?,  // parentId enables nested replies
  content, authorId, boosts, buries, createdAt, replies?
}

Whisper {
  id, fromId, toId, content, createdAt, read
}

Notification {
  id, type: 'boost'|'reply'|'whisper'|'badge'|'mention',
  message, time, read, userId?, postId?
}
```

---

## 7. AppContext State & Functions

```typescript
// Auth
currentUser: User | null
isLoggedIn: boolean
login(email, password): Promise<{success, error?}>
register(data: RegisterData): Promise<{success, error?}>
logout(): void

// Posts
posts: Post[]
addPost(data): void
deletePost(id): void

// Voting
boostedPosts: Set<string>
buriedPosts: Set<string>
toggleBoost(postId): void
toggleBury(postId): void

// Stash
stashedPosts: Set<string>
toggleStash(postId): void

// Spheres
spheres: Sphere[]
joinedSpheres: Set<string>
toggleJoinSphere(slug): void
createSphere(data): void       // Adds sphere + auto-joins

// Whispers
whispers: Whisper[]
sendWhisper(toId, content): void
markWhisperRead(id): void
unreadWhisperCount: number

// Notifications
notifications: Notification[]
markNotifRead(id): void
markAllNotifsRead(): void
unreadNotifCount: number

// Profile
updateProfile(data: {name?, bio?, avatar?, bannerColor?}): void

// UI
isDark: boolean
toggleTheme(): void
searchQuery: string
setSearchQuery(q): void
```

---

## 8. Routing Table

| Path | Component | Notes |
|---|---|---|
| `/login` | LoginPage | Standalone (no Layout) |
| `/register` | RegisterPage | Standalone (no Layout) |
| `/compose-whisper` | ComposeWhisperPage | Standalone full-page |
| `/` | HomePage | Feed with sort/filter |
| `/spheres` | SpheresPage | Browse + Create Sphere |
| `/sphere/:slug` | SphereDetailPage | Posts in a sphere |
| `/post/:id` | PostDetailPage | Full post + comments |
| `/create` | CreatePostPage | Text/Photo/Link post |
| `/profile` | ProfilePage | Own profile |
| `/profile/:id` | ProfilePage | Any user profile |
| `/inbox` | InboxPage | Conversation list + thread view |
| `/search` | SearchPage | Posts + Spheres |
| `/stash` | StashPage | Saved posts |
| `/notifications` | NotificationsPage | Bell notifications |
| `/leaderboard` | LeaderboardPage | Aura + Sphere rankings |

---

## 9. Key Features Implemented

### Authentication
- Email domain validation: only `@shiats.edu.in` allowed
- Mock auth (no real backend yet)
- Auto-assigns Verified Student badge on register
- Ghost Mode: can browse without login

### Feed & Posts
- Trending / Latest / Top sort algorithms
- All Feed vs My Feed (joined spheres only)
- Post types: Text, Photo (gallery upload), Link
- Boost (upvote) / Bury (downvote) with mutual exclusion
- Stash (bookmark) posts
- Share post link to clipboard
- Pinned posts (`isPinned`)
- Event posts with date/venue

### Comments (PostDetailPage)
- Top-level comments + 2-level nested replies
- Vote on comments (Boost/Bury with state)
- Delete comment: allowed for **comment author**, **post author**, or **Sphere Keeper**
- Report comment: marks as reported, visible to moderators
- Sort comments: Top (by score) or New (by date)
- OP badge on post author's comments
- MOD badge on Sphere Keeper's comments
- Collapse/expand threads

### Spheres
- Browse all spheres with category filter + search
- Join/Leave any sphere
- Create new sphere (modal with icon picker, color picker, animated previews)
- Sphere Keeper = creator = moderator powers
- "s/" prefix in search auto-lists all spheres

### Inbox / Whispers
- Conversation-grouped view (not flat message list)
- Click conversation → thread view with inline reply
- New Whisper → `/compose-whisper` (standalone page, keyboard-safe)
- Unread badge on conversations and nav

### Notifications
- Real state (not hardcoded)
- Mark individual / all as read
- Click to navigate to related post/profile
- Types: Boost, Reply, Whisper, Badge, Mention

### Profile
- View own profile + any user's profile
- Edit: Display name, bio, avatar style, banner color
- **Profile save fix**: uses reactive `currentUser` from context (not stale mockData)
- Avatar styles: 9 DiceBear styles (Classic, Adventurer, Robot, Emoji, Lorelei, Artist, Pixel, Thumbs, Shapes)
- Banner: 8 static gradients + 6 animated CSS gradient banners (Rainbow, Ocean, Cosmic, Sunset, Forest, Gold)
- Badges: Verified Student, First Post, Boost Master, Sphere Keeper
- Stats: Aura score, post count, sphere count

### Leaderboard
- Aura Rankings: podium for top 3 + full ranked list
- Top Spheres: by member count

### Search
- Search posts by title + content
- Search spheres by name + slug + description
- "s/" prefix auto-switches to spheres tab and shows all spheres
- "s/keyword" filters spheres in real-time

### Image Upload
- Gallery file picker (no URL required)
- FileReader API converts to base64 data URL
- Supports JPG, PNG, GIF, WEBP
- 5 MB size limit with error handling
- Preview with change/remove options

---

## 10. Features Inspired by Referenced Git Repos

Based on the feature specification provided, these Reddit-clone concepts were implemented:

| Feature | Implementation |
|---|---|
| Communities (Subreddits) | Spheres with slug, cover, keeper, category |
| Upvote / Downvote | Boost / Bury with mutual exclusion + score |
| Comments + voting | Full comment tree with vote state |
| Nested comments | 2-level depth with parentId |
| Save posts | Stash system |
| User profiles + karma | Aura score + badges |
| Anonymous browsing | Ghost Mode (no login required to view) |
| Dark / Light mode | System-synced + manual toggle |
| Bottom navigation | Home / Spheres / FAB / Inbox / Profile |
| Feed sorting | Trending (votes/hour) / Latest / Top |
| Private messages | Whispers (one-to-one only) |
| User flairs | Tag field per user |
| Moderators | Sphere Keeper with delete powers |
| Pin posts | `isPinned` field on posts |
| Event posts | `isEvent` + `eventDate` + `eventVenue` |
| Search | Cross-post + sphere search |
| Notifications | Real-state notification feed |

---

## 11. Known Limitations (To Fix with Backend)

1. **All data is in-memory** — refreshing the page resets everything
2. **Authentication is mocked** — any `@shiats.edu.in` email works
3. **Images stored as base64** — large files; needs cloud storage (Supabase Storage)
4. **No real-time updates** — new posts/comments don't push to other users
5. **Whispers not end-to-end encrypted** — needs backend for real privacy
6. **No push notifications** — only in-app notification state
7. **Aura score not computed** — static mock value
8. **Sphere creation not persisted** — lost on page refresh

---

## 12. Backend Plan (Supabase Recommended)

### Tables needed:
```sql
users (id, email, name, username, batch, branch, bio, avatar_url, banner_color, aura_score, join_date, is_verified)
spheres (id, name, slug, description, icon, cover_color, member_count, keeper_id, category, is_private)
sphere_members (sphere_id, user_id, joined_at)
posts (id, title, content, image_url, link_url, type, author_id, sphere_id, flair, is_pinned, is_event)
votes (post_id, user_id, direction: 'up'|'down')
comments (id, post_id, parent_id, content, author_id, created_at)
comment_votes (comment_id, user_id, direction)
stashes (post_id, user_id)
whispers (id, from_id, to_id, content, read, created_at)
notifications (id, user_id, type, message, read, post_id, from_user_id)
```

### Auth: Supabase Auth with email domain restriction
```sql
-- RLS policy: only @shiats.edu.in emails
CREATE POLICY "shiats_only" ON users
  FOR INSERT WITH CHECK (email LIKE '%@shiats.edu.in');
```

---

## 13. Deployment Guide

### Web (Free hosting)
- **Vercel** (recommended): Connect GitHub repo → auto-deploy on push
- **Netlify**: Similar to Vercel, drag-and-drop or GitHub
- Build command: `vite build`
- Output directory: `dist/`

### Android APK (Free)
Using **Capacitor** (converts web app to native):
```bash
npm install @capacitor/core @capacitor/cli @capacitor/android
npx cap init SHUATSPHERE com.shuats.sphere
npx cap add android
vite build
npx cap sync
npx cap open android
# In Android Studio: Build > Generate Signed Bundle/APK
```

### iOS (Requires Mac + Apple Developer account — $99/year)
```bash
npx cap add ios
npx cap open ios
# In Xcode: Product > Archive > Distribute App
```

### Play Store (Free to list, $25 one-time registration)
1. Create Google Play Developer account
2. Build signed APK/AAB from Android Studio
3. Upload to Play Console
4. Fill store listing + screenshots
5. Submit for review

### App Store (Requires $99/year Apple Developer Program)
1. Create Apple Developer account
2. Build in Xcode → Archive
3. Upload to App Store Connect via Xcode Organizer
4. Submit for TestFlight review, then production

### Free APK Distribution (without Play Store)
1. Build APK in Android Studio
2. Host the `.apk` file on Google Drive / GitHub Releases
3. Share direct download link
4. Users must enable "Install from unknown sources" on Android

---

## 14. GitHub Setup Guide

```bash
# 1. Initialize git (if not already)
git init

# 2. Create .gitignore
echo "node_modules/\ndist/\n.env" > .gitignore

# 3. Stage all files
git add .

# 4. Initial commit
git commit -m "feat: initial SHUATSPHERE build"

# 5. Create repo on github.com (name: shuatsphere)
# Then add remote:
git remote add origin https://github.com/YOUR_USERNAME/shuatsphere.git

# 6. Push
git branch -M main
git push -u origin main

# For future updates:
git add .
git commit -m "feat: describe your change"
git push
```

### Vercel Auto-Deploy Setup:
1. Go to vercel.com → New Project
2. Import from GitHub → select `shuatsphere`
3. Framework: Vite | Build: `vite build` | Output: `dist`
4. Deploy → every `git push` auto-updates the live URL

---

## 15. Environment Variables (when backend is connected)

```env
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

---

## 16. Component Conventions

- All components use `font-black` (900 weight) for headings via `style={{ fontFamily: 'Outfit, sans-serif' }}`
- Neo-brutalist cards: `border-2 border-zinc-900 dark:border-zinc-700 shadow-[4px_4px_0px_#18181B] dark:shadow-none`
- Primary buttons: `bg-[#7C3AED] text-white border-2 border-zinc-900 shadow-[3px_3px_0px_#18181B]`
- Active/pressed: `active:translate-y-0.5 active:shadow-none transition-all`
- Sphere pill: `bg-violet-50 dark:bg-violet-950/30 border border-violet-200 text-[#7C3AED]`
- Verified badge: `text-[#0D9488] bg-[#0D9488]/10 border border-[#0D9488]/20`

---

*This memory file should be updated whenever significant features are added, bugs fixed, or architectural decisions made. Pass this to any new AI agent starting work on SHUATSPHERE.*
