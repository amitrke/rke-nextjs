# Architecture

This document outlines the architecture of the Roorkee.org Next.js application.

## Frontend

The frontend is a [Next.js](https://nextjs.org/) application. Next.js is a React framework that provides features like server-side rendering and static site generation.

-   **Pages**: The `pages` directory contains the application's routes. For example, `pages/index.tsx` is the home page, and `pages/posts/[id].tsx` is a dynamic route for displaying a single post.
-   **Components**: The `components` directory contains reusable UI components that are used throughout the application.
-   **Styling**: The application uses a combination of global CSS (`styles/globals.css`), CSS Modules (`styles/Home.module.css`), and Sass (`styles/main.scss`). [Bootstrap](https://getbootstrap.com/) is used as the primary CSS framework.

### Page Rendering Strategies

The application utilizes both Server-Side Rendering (SSR) and Static Site Generation (SSG) for optimal performance.

#### Generated at Request Time (Server-Side Rendering)

These pages are rendered on the server for each incoming request.

-   `pages/sitemap.xml.ts`: The sitemap is generated dynamically on each request.
-   `pages/weather/[id].tsx`: Weather data is fetched and the page is rendered for each request.
-   **API Routes**: All API routes are serverless functions that execute on every request.
    -   `pages/api/fetchCount.ts`
    -   `pages/api/hello.ts`
    -   `pages/api/incrementCount.ts`

#### Generated at Build Time (Static Site Generation)

These pages are pre-rendered into static HTML files when the site is built.

-   **Pages with data (`getStaticProps`)**:
    -   `pages/index.tsx`
    -   `pages/albums.tsx`
    -   `pages/album/[aid].tsx`
    -   `pages/post/[category]/[slug].tsx`
    -   `pages/posts/[id].tsx`
    -   `pages/user/[id].tsx`
    -   `pages/users/[userid]/profile/index.tsx`
-   **Static Pages (no server-side data fetching)**: These pages are rendered as static HTML. Any dynamic content (like in `myaccount`) is loaded on the client-side.
    -   `pages/auth.tsx`
    -   `pages/contact.tsx`
    -   `pages/disclaimer.tsx`
    -   `pages/privacy.tsx`
    -   `pages/myaccount.tsx`
    -   `pages/account/editAlbum.tsx`
    -   `pages/account/editpost.tsx`

### Future Considerations

-   The `/albums` page currently uses SSG. For logged-in users, the "Edit" and "Delete" buttons appear after the initial page load, which may cause a UI flicker. To provide a better user experience, this page could be converted to use Server-Side Rendering (SSR) in the future. This would allow the server to render the buttons conditionally based on the user's authentication status before sending the page to the client.

## Backend

The backend is powered by [Firebase](https://firebase.google.com/).

-   **Authentication**: Firebase Authentication is used to manage user sign-up and login.
-   **Database**:
    -   [Firestore](https://firebase.google.com/docs/firestore) is the primary database for storing data like posts, user profiles, and albums.
    -   [Realtime Database](https://firebase.google.com/docs/database) is used for features that require real-time data synchronization, such as the counter.
-   **Storage**: [Firebase Storage](https://firebase.google.com/docs/storage) is used to store user-uploaded files like images.

## Deployment

The application is deployed on [Vercel](https://vercel.com/). The `master` branch is deployed to production, and the `develop` branch is deployed to a preview environment.
