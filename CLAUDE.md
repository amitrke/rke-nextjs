# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Roorkee.org is a Next.js community website for people who have lived in Roorkee, a town in North India. The site enables residents to share posts, pictures, and interact with the community. It uses Firebase for backend services and is deployed on Vercel.

## Commands

### Development
```bash
pnpm dev          # Start development server on http://localhost:3000
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint:fix     # Fix linting issues in .tsx files
```

### Package Management
```bash
pnpm install      # Install dependencies
pnpm add next@latest react@latest react-dom@latest eslint-config-next@latest  # Upgrade Next.js
pnpm up -u        # Upgrade all packages
```

### Commit Messages
Use emoji prefixes from https://gist.github.com/parmentf/035de27d6ed1dce0b36a

## Environment Setup

Create `.env.local` in the project root with Firebase credentials:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Architecture

### Next.js Rendering Strategies

**Static Site Generation (SSG)** - Pre-rendered at build time:
- Homepage (`pages/index.tsx`)
- Album pages (`pages/album/[aid].tsx`, `pages/albums.tsx`)
- Post pages (`pages/post/[category]/[slug].tsx`, `pages/posts/[id].tsx`)
- User profiles (`pages/user/[id].tsx`, `pages/users/[userid]/profile/index.tsx`)
- Static pages (`pages/auth.tsx`, `pages/contact.tsx`, `pages/disclaimer.tsx`, `pages/privacy.tsx`)
- Account pages with client-side dynamic content (`pages/myaccount.tsx`, `pages/account/editAlbum.tsx`, `pages/account/editpost.tsx`)

**Server-Side Rendering (SSR)** - Rendered on each request:
- Weather pages (`pages/weather/[id].tsx`)
- Sitemap (`pages/sitemap.xml.ts`)
- All API routes (`pages/api/*`)

### Firebase Integration

The application uses both Firebase compat SDK and modular SDK (migration in progress - see TODO in `firebase/initFirebase.ts`).

**Firebase Services:**
- **Authentication**: Email/password authentication via Firebase Auth
- **Firestore**: Primary database for posts, users, albums, events, and news articles
- **Realtime Database**: Used for real-time features like counters
- **Storage**: User-uploaded images stored at `users/{userId}/images/`

**Key Firebase Modules:**
- `firebase/initFirebase.ts`: Firebase initialization with both compat and modular SDKs
- `firebase/firestore.ts`: Firestore operations (queryOnce, write, subscribeToCollectionUpdates, deleteDocument, arrayAppend)
- `firebase/firebaseAdmin.ts`: Server-side admin operations
- `firebase/useUser.ts`: Custom hook for user authentication state
- `firebase/userCookies.ts`: User session management via cookies
- `firebase/types.ts`: Core type definitions (PostType, User, MessageType, PostDisplayType)

### Service Layer

**PostService.ts** - Centralized business logic for fetching and processing data:
- `getPosts()`: Fetch posts with filtering (public, userId, limit)
- `getPostsWithDetails()`: Posts with author info and images
- `getPostBySlug()`: Fetch post by category and slug
- `getPostWithAuthor()`: Single post with full author details
- `getAlbums()`: Public albums with thumbnail images
- `getEvents()`: Upcoming events (filtered by date >= today)
- `getNews()`: News articles with deduplication by similar titles
- `getPaginatedNews()` / `getPaginatedPosts()`: Paginated data with total counts

**News Deduplication:** The service includes sophisticated title similarity detection using Jaccard similarity and token coverage to prevent duplicate news articles (thresholds: 0.75 Jaccard, 0.85 token coverage).

### Component Organization

```
components/
├── auth/              # FirebaseAuth.tsx - Authentication UI
├── cloudFirestore/    # Read.tsx, Write.tsx - Firestore CRUD operations
├── nav/               # Navigation components
├── realtimeDatabase/  # Real-time database components
├── storage/           # Firebase Storage components
├── ui/                # showImage (getImageDownloadURLV2), uiUtils (uiDateFormat)
└── layout.tsx         # Main layout component
```

### Image Handling

Images are stored in Firebase Storage with size variants:
- `getImageDownloadURLV2({ file, size })` - size options: 's', 'm', 'l'
- Path pattern: `users/{userId}/images/{imageName}`
- Next.js Image component configured for Firebase Storage, OpenWeatherMap, and placehold.co domains

### Data Types

Key type definitions in `firebase/types.ts`:
- **PostType**: id, title, intro, edState, updateDate, images, public, userId, category, slug
- **PostDisplayType**: PostType + formatted images URLs, author, formattedUpdateDate
- **User**: id, email, token, name, profilePic
- **MessageType**: fromUserId, title, body, updateDate, toUserId, state, thread

Additional types in `service/PostService.ts`:
- **Event**: id, name, description, date (ISO), formatted date fields, expireAt
- **NewsArticle**: Unified schema from NewsData.io API with expireAt for sorting

### Backend Functions

Firebase Functions run in a separate repository but interact with the same Firebase project:
- **updateNewsFromNewsDataIO**: Scheduled function (every 12 hours) that fetches news about "Roorkee" from NewsData.io API and stores in Firestore `news` collection with `apiSource: "newsdata.io"`

## Configuration

### Next.js Config (`next.config.js`)
- Sass support with `styles` directory
- Image optimization for Firebase Storage, OpenWeatherMap, placehold.co
- Minimum cache TTL: 1,500,000ms
- Webpack configured to disable `fs` module (client-side)

### TypeScript Config
- Target: ES2015
- Strict mode: disabled
- JSX: preserve (Next.js handles transformation)

### ESLint Config (`eslint.config.mjs`)
- React rules: react-in-jsx-scope off, prop-types off, no-unescaped-entities off
- Ignores: node_modules/, .next/

## Branching & Deployment

- **master** branch → Production (https://www.roorkee.org)
- **develop** branch → Preview (https://preview.roorkee.org)
- Deployed on Vercel with automatic deployments

## Documentation

Additional docs in `docs/`:
- `docs/architecture.md` - Detailed architecture overview
- `docs/firebase-setup.md` - Firebase project setup guide
- `docs/deployment.md` - Deployment instructions
- `docs/api-reference.md` - API routes reference
- `docs/contribution-guide.md` - Contribution guidelines
